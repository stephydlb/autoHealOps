from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import psutil
from database import init_db, SessionLocal
from models import Metric, Process as ProcessModel

app = FastAPI(title="AutoHealOps Backend API")

# Initialize database
init_db()

class ProcessInfo(BaseModel):
    pid: int
    name: str
    username: str
    cpu_percent: float
    memory_percent: float

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
