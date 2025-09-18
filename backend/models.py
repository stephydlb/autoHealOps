from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Metric(Base):
    __tablename__ = 'metrics'
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    cpu_percent = Column(Float)
    memory_percent = Column(Float)
    disk_percent = Column(Float)

class Process(Base):
    __tablename__ = 'processes'
    id = Column(Integer, primary_key=True)
    pid = Column(Integer)
    name = Column(String(255))
    username = Column(String(255))
    cpu_percent = Column(Float)
    memory_percent = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Script(Base):
    __tablename__ = 'scripts'
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    executed_at = Column(DateTime, nullable=True)
    result = Column(Text, nullable=True)

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(255), unique=True)
    password_hash = Column(String(255))
    role = Column(String(50), default='viewer')  # admin or viewer
