# app/models/user_model.py

from sqlalchemy import Column, Integer, String, Boolean, ARRAY, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # 'admin' or 'consultant'
    
    # Consultant-specific fields (nullable for admins)
    department = Column(String(50), nullable=True)
    # skills = Column(ARRAY(String), nullable=True)
    status = Column(String(20), default='bench')  # 'bench'|'assigned'|'training'
    resume_status = Column(String(20), default='pending')  # 'pending'|'updated'
    training_status = Column(String(20), nullable=True)
    resume_file = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    assessments = relationship("Assessment", back_populates="user")
    learning_progress = relationship("LearningProgress", back_populates="user")
    # attendance = relationship("Attendance", back_populates="user")
    attendances = relationship("Attendance", back_populates="user")

    completed_trainings = relationship(
        "CompletedTraining", back_populates="user", cascade="all, delete-orphan"
    )

    opportunities = relationship("Opportunity", back_populates="user")
    skills = relationship("Skill", back_populates="user", cascade="all, delete-orphan")

    def set_password(self, password: str):
        self.hashed_password = pwd_context.hash(password)
        
    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)