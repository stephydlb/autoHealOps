from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List
import psutil
import os
import signal
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from database import init_db, SessionLocal
from models import Metric, Process as ProcessModel, Script, User
from ai.anomaly_detection import detect_anomaly

app = FastAPI(title="AutoHealOps Backend API")

# Initialize database
init_db()

# Auth constants
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(username: str, password: str):
    db = SessionLocal()
    user = db.query(User).filter(User.username == username).first()
    db.close()
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    db = SessionLocal()
    user = db.query(User).filter(User.username == username).first()
    db.close()
    if user is None:
        raise credentials_exception
    return user

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin required")
    return current_user

@app.post("/register")
def register(username: str, password: str):
    db = SessionLocal()
    hashed_password = get_password_hash(password)
    db_user = User(username=username, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.close()
    return {"message": "User created"}

@app.post("/login")
def login(username: str, password: str):
    user = authenticate_user(username, password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

class ProcessInfo(BaseModel):
    pid: int
    name: str
    username: str
    cpu_percent: float
    memory_percent: float

class ScriptCreate(BaseModel):
    name: str
    content: str

class ScriptResponse(BaseModel):
    id: int
    name: str
    content: str
    created_at: str
    executed_at: str | None
    result: str | None

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/metrics/cpu")
def get_cpu_usage():
    cpu_percent = psutil.cpu_percent(interval=1)
    db = SessionLocal()
    metric = Metric(cpu_percent=cpu_percent)
    db.add(metric)
    db.commit()
    db.close()
    return {"cpu_percent": cpu_percent}

@app.get("/metrics/memory")
def get_memory_usage():
    mem = psutil.virtual_memory()
    db = SessionLocal()
    metric = Metric(memory_percent=mem.percent)
    db.add(metric)
    db.commit()
    db.close()
    return {"total": mem.total, "available": mem.available, "used": mem.used, "percent": mem.percent}

from fastapi.responses import JSONResponse

@app.get("/predict/cpu")
def predict_cpu_anomaly():
    cpu_percent = psutil.cpu_percent(interval=1)
    is_anomaly = detect_anomaly(cpu_percent, 0)  # Assuming memory 0 for simplicity
    return JSONResponse(content={"cpu_percent": cpu_percent, "is_anomaly": bool(is_anomaly)})

@app.get("/predict/memory")
def predict_memory_anomaly():
    mem = psutil.virtual_memory()
    is_anomaly = detect_anomaly(0, mem.percent)  # Assuming cpu 0 for simplicity
    return JSONResponse(content={"memory_percent": mem.percent, "is_anomaly": bool(is_anomaly)})

@app.get("/processes", response_model=List[ProcessInfo])
def list_processes():
    processes = []
    db = SessionLocal()
    for proc in psutil.process_iter(['pid', 'name', 'username', 'cpu_percent', 'memory_percent']):
        try:
            pinfo = proc.info
            processes.append(ProcessInfo(**pinfo))
            # Save to DB
            process_model = ProcessModel(**pinfo)
            db.add(process_model)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    db.commit()
    db.close()
    return processes

@app.post("/scripts", response_model=ScriptResponse)
def create_script(script: ScriptCreate):
    db = SessionLocal()
    db_script = Script(name=script.name, content=script.content)
    db.add(db_script)
    db.commit()
    db.refresh(db_script)
    db.close()
    return db_script

@app.get("/scripts", response_model=List[ScriptResponse])
def list_scripts():
    db = SessionLocal()
    scripts = db.query(Script).all()
    db.close()
    return scripts

@app.post("/scripts/{script_id}/execute")
def execute_script(script_id: int):
    db = SessionLocal()
    script = db.query(Script).filter(Script.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    try:
        # Execute the script content as Python code (dangerous, for demo only)
        exec(script.content)
        result = "Executed successfully"
    except Exception as e:
        result = str(e)
    script.executed_at = datetime.utcnow()
    script.result = result
    db.commit()
    db.close()
    return {"result": result}

@app.post("/processes/{pid}/kill")
def kill_process(pid: int, current_user: User = Depends(require_admin)):
    try:
        os.kill(pid, signal.SIGKILL)
        return {"message": f"Process {pid} killed"}
    except ProcessLookupError:
        raise HTTPException(status_code=404, detail="Process not found")
    except PermissionError:
        raise HTTPException(status_code=403, detail="Permission denied")

@app.post("/processes/{pid}/restart")
def restart_process(pid: int):
    # Note: Restarting a process is complex; this is a placeholder
    # In a real scenario, you might need to know the command to restart
    raise HTTPException(status_code=501, detail="Restart not implemented")

@app.post("/processes/cleanup-zombies")
def cleanup_zombies():
    zombies = []
    for proc in psutil.process_iter(['pid', 'status']):
        if proc.info['status'] == psutil.STATUS_ZOMBIE:
            try:
                os.waitpid(proc.info['pid'], 0)
                zombies.append(proc.info['pid'])
            except ChildProcessError:
                pass
    return {"zombies_cleaned": zombies}
