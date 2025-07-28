from fastapi import FastAPI, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.model.user_model import User
from app.model.models import Assessment, LearningProgress, Attendance
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

app = FastAPI()

# Load environment variables
load_dotenv()


from app.routers.user_router import router as auth_router
app.include_router(auth_router, prefix="/auth")

#--------------------


# ---------- Authentication & Core Functions ----------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "consultant"
    department: Optional[str] = None
    skills: Optional[List[str]] = []

@app.post("/register")
def register(user: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user (admin or consultant)"""
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(400, "Email already registered")
    
    new_user = User(
        name=user.name,
        email=user.email,
        department=user.department,
        skills=user.skills,
        role=user.role
    )
    new_user.set_password(user.password)
    
    db.add(new_user)
    db.commit()
    return {"message": f"{user.role} registered successfully", "user_id": new_user.id}

# ---------- Consultant Profile Management ----------
class ResumeUpload(BaseModel):
    user_id: int
    resume_text: str

@app.post("/upload-resume")
def upload_resume(data: ResumeUpload, db: Session = Depends(get_db)):
    """Process resume and update skills"""
    user = db.query(User).filter(User.id == data.user_id, User.role == "consultant").first()
    if not user:
        raise HTTPException(404, "Consultant not found")
    
    # Simple skill extraction (replace with your AI logic)
    resume_text = data.resume_text.lower()
    extracted_skills = [skill for skill in user.skills or [] if skill in resume_text]
    
    user.skills = extracted_skills
    user.resume_status = "updated"
    db.commit()
    
    return {
        "message": "Resume processed",
        "user_id": user.id,
        "skills": extracted_skills
    }

# ---------- Attendance Tracking ----------
class AttendanceMark(BaseModel):
    user_id: int
    date: date
    status: str  # "present", "absent", "excused"

@app.post("/mark-attendance")
def mark_attendance(entry: AttendanceMark, db: Session = Depends(get_db)):
    """Record attendance for a consultant"""
    user = db.query(User).get(entry.user_id)
    if not user or user.role != "consultant":
        raise HTTPException(404, "Consultant not found")
    
    # Check if attendance already exists for this date
    existing = db.query(Attendance).filter(
        Attendance.user_id == entry.user_id,
        Attendance.date == entry.date
    ).first()
    
    if existing:
        existing.status = entry.status
    else:
        new_attendance = Attendance(
            user_id=entry.user_id,
            date=entry.date,
            status=entry.status
        )
        db.add(new_attendance)
    
    db.commit()
    return {"message": f"Attendance recorded for {user.name}"}

@app.get("/attendance-summary/{user_id}")
def get_attendance_summary(
    user_id: int,
    start_date: date = Query(None),
    end_date: date = Query(None),
    db: Session = Depends(get_db)
):
    """Get attendance summary for a consultant"""
    query = db.query(Attendance).filter(Attendance.user_id == user_id)
    
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)
        
    records = query.all()
    present_days = sum(1 for r in records if r.status == "present")
    
    return {
        "user_id": user_id,
        "total_days": len(records),
        "present_days": present_days,
        "attendance_rate": f"{(present_days/len(records))*100:.1f}%" if records else "0%"
    }

# ---------- Training & Assessment ----------
class AssessmentSubmission(BaseModel):
    user_id: int
    topic: str
    answers: List[str]

@app.post("/submit-assessment")
def submit_assessment(data: AssessmentSubmission, db: Session = Depends(get_db)):
    """Record assessment results"""
    user = db.query(User).get(data.user_id)
    if not user or user.role != "consultant":
        raise HTTPException(404, "Consultant not found")
    
    # Calculate score (replace with your grading logic)
    correct_answers = ["a", "b", "c", "a", "d"]  # Example
    score = sum(1 for i, ans in enumerate(data.answers) 
               if i < len(correct_answers) and ans == correct_answers[i])
    percentage = (score / len(correct_answers)) * 100
    
    # Store assessment
    assessment = Assessment(
        user_id=data.user_id,
        topic=data.topic,
        score=score,
        percentage=percentage
    )
    db.add(assessment)
    db.commit()
    
    return {
        "user_id": data.user_id,
        "topic": data.topic,
        "score": score,
        "percentage": f"{percentage:.1f}%"
    }

# ---------- Admin Dashboard Endpoints ----------
@app.get("/admin/consultants")
def list_consultants(
    department: str = Query(None),
    skill: str = Query(None),
    status: str = Query(None),
    db: Session = Depends(get_db)
):
    """Admin view of all consultants with filtering"""
    query = db.query(User).filter(User.role == "consultant")
    
    if department:
        query = query.filter(User.department.ilike(f"%{department}%"))
    if skill:
        query = query.filter(User.skills.contains([skill]))
    if status:
        query = query.filter(User.status == status)
        
    consultants = query.all()
    
    return [{
        "id": c.id,
        "name": c.name,
        "department": c.department,
        "skills": c.skills,
        "status": c.status,
        "resume_status": c.resume_status
    } for c in consultants]

@app.get("/admin/consultant/{user_id}")
def get_consultant_details(user_id: int, db: Session = Depends(get_db)):
    """Get full details for a specific consultant"""
    consultant = db.query(User).get(user_id)
    if not consultant or consultant.role != "consultant":
        raise HTTPException(404, "Consultant not found")
    
    # Get related records
    assessments = db.query(Assessment).filter(Assessment.user_id == user_id).all()
    attendance = db.query(Attendance).filter(Attendance.user_id == user_id).all()
    
    return {
        "profile": {
            "id": consultant.id,
            "name": consultant.name,
            "email": consultant.email,
            "department": consultant.department,
            "skills": consultant.skills,
            "status": consultant.status
        },
        "assessments": [{
            "topic": a.topic,
            "score": a.score,
            "percentage": a.percentage
        } for a in assessments],
        "attendance_summary": {
            "total_days": len(attendance),
            "present_days": sum(1 for a in attendance if a.status == "present")
        }
    }

from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

# Add to your existing config
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_USER"),
    MAIL_PASSWORD=os.getenv("EMAIL_APP_PASSWORD"),  # Use app password!
    MAIL_FROM=os.getenv("EMAIL_USER"),
    MAIL_PORT=int(os.getenv("EMAIL_PORT")),
    MAIL_SERVER=os.getenv("EMAIL_HOST"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_email_async(subject: str, recipient: EmailStr, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[recipient],
        body=body,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

# Example endpoint
@app.post("/send-notification")
async def send_notification(
    email: EmailStr,
    background_tasks: BackgroundTasks
):
    background_tasks.add_task(
        send_email_async,
        "Your Attendance Report",
        email,
        "<h1>Attendance Submitted</h1><p>Your status was recorded</p>"
    )
    return {"message": "Notification queued"}