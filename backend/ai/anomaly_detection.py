from sklearn.ensemble import IsolationForest
import numpy as np
from database import SessionLocal
from models import Metric

def train_anomaly_model():
    db = SessionLocal()
    metrics = db.query(Metric).all()
    db.close()
    if not metrics:
        return None
    data = np.array([[m.cpu_percent, m.memory_percent] for m in metrics])
    model = IsolationForest(contamination=0.1)
    model.fit(data)
    return model

def detect_anomaly(cpu_percent, memory_percent):
    model = train_anomaly_model()
    if model is None:
        return False
    prediction = model.predict([[cpu_percent, memory_percent]])
    return prediction[0] == -1  # -1 is anomaly
