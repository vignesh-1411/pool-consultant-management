from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from app.database import Base





from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy import Time


class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String(50))
    score = Column(Integer)
    percentage = Column(Integer)
    user = relationship("User", back_populates="assessments")

class LearningProgress(Base):
    __tablename__ = "learning_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    module = Column(String(100))
    completed = Column(Boolean, default=False)
    completion_date = Column(Date, nullable=True)
    user = relationship("User", back_populates="learning_progress")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)
    status = Column(String, default="absent")  # or Boolean: present=True
    check_in_time = Column(Time, nullable=True)

    user = relationship("User", back_populates="attendances")


class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    skill = Column(String, nullable=False)
    proficiency = Column(Integer, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="skills")

# Add to models.py

# Add these imports at the top of your models.py
from sqlalchemy import DateTime
from sqlalchemy.sql import func  # This provides SQL functions like now()

class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(Integer, primary_key=True)
    consultant_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(100))
    status = Column(String(20))  # 'active'|'completed'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="opportunities")

# in app/model/models.py

from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base

class Training(Base):
    __tablename__ = 'trainings'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    provider = Column(String)
    completed_date = Column(Date)
    rating = Column(Float)
    certificate = Column(String)

class Recommendation(Base):
    __tablename__ = 'recommendations'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    provider = Column(String)
    duration = Column(String)
    rating = Column(Float)
    reason = Column(String)
    priority = Column(String)

class TrainingRecommendation(Base):
    __tablename__ = "training_recommendations"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill = Column(String)
    course_title = Column(String)
    platform = Column(String)
    link = Column(String)
    reason = Column(String)


class CompletedTraining(Base):
    __tablename__ = "completed_trainings"

    id = Column(Integer, primary_key=True, index=True)
    consultant_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    provider = Column(String)
    completed_date = Column(String)
    user = relationship("User", back_populates="completed_trainings")

