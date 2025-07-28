from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from app.database import Base

#-----deep
# class Consultant(Base):
#     __tablename__ = "consultants"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, unique=True, index=True)
#     skills = Column(ARRAY(String))
#---deep


# # models.py
# from sqlalchemy import Column, String, Integer, Enum
# import enum

# class UserRole(enum.Enum):
#     admin = "admin"
#     consultant = "consultant"

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, unique=True, nullable=False)
#     email = Column(String, unique=True, index=True)
#     hashed_password = Column(String, nullable=False)
#     role = Column(Enum(UserRole), nullable=False)


#-------------------------------deep
# class Assessment(Base):
#     __tablename__ = "assessments"

#     id = Column(Integer, primary_key=True, index=True)
#     consultant_name = Column(String, ForeignKey("consultants.name"))
#     topic = Column(String)
#     score = Column(Integer)
#     percentage = Column(Integer)


# class LearningProgress(Base):
#     __tablename__ = "learning_progress"

#     id = Column(Integer, primary_key=True, index=True)
#     consultant_name = Column(String, ForeignKey("consultants.name"))
#     module = Column(String)
#     completed = Column(Boolean, default=False)


# class Attendance(Base):
#     __tablename__ = "attendance"

#     id = Column(Integer, primary_key=True, index=True)
#     consultant_name = Column(String, ForeignKey("consultants.name"))
#     date = Column(Date)
#-----------------------deep



from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

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
    status = Column(String(20))  # 'present'|'absent'|'excused'
    user = relationship("User", back_populates="attendance")