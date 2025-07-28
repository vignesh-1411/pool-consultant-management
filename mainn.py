from fastapi import FastAPI, Depends, Query
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from datetime import date
import re
import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

from app.database import get_db
from app.model.user_model import User

from app.routers import user_router

app = FastAPI()
app.include_router(user_router.router, prefix="/auth", tags=["Auth"])

# Load environment variables
load_dotenv()
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
EMAIL_TO = os.getenv("EMAIL_TO")
DISABLE_EMAIL = False

# ---------- JD Submission ----------
class JDRequest(BaseModel):
    jd_text: str

jd_storage = ""

@app.post("/submit-jd")
def submit_jd(jd: JDRequest):
    global jd_storage
    jd_storage = jd.jd_text
    return {"message": "JD received", "jd": jd_storage}

# ---------- Consultant Profile Submission ----------
class ConsultantProfileInput(BaseModel):
    name: str
    email: str
    skills: List[str]

@app.post("/submit-profiles")
def submit_profiles(profiles: List[ConsultantProfileInput], db: Session = Depends(get_db)):
    count = 0
    for profile in profiles:
        existing_user = db.query(User).filter(User.name == profile.name, User.role == 'consultant').first()

        if not existing_user:
            new_user = User(
                name=profile.name,
                email=f"{profile.name.lower().replace(' ', '')}@example.com",
                hashed_password="not_used_yet",
                role="consultant"
            )
            db.add(new_user)
            db.flush()

            new_profile = ConsultantProfile(
                user_id=new_user.id,
                skills=profile.skills,
                department="Not Assigned",
                status="Resume Pending"
            )
            db.add(new_profile)
            count += 1
        else:
            if existing_user.profile:
                
                existing_user.profile.skills = profile.skills
            else:
                new_profile = ConsultantProfile(
                    user_id=existing_user.id,
                    skills=profile.skills,
                    department="Not Assigned",
                    status="Resume Pending"
                )
                db.add(new_profile)
    db.commit()
    return {"message": f"{count} profiles submitted/updated successfully"}

# ---------- Resume Upload ----------
class ResumeUpload(BaseModel):
    name: str
    resume_text: str

common_skills = ["python", "java", "javascript", "react", "node", "aws", "docker", "sql", "mongodb", "kubernetes", "html", "css", "git", "linux", "tensorflow", "pytorch", "fastapi", "flask", "django"]

@app.post("/upload-resume")
def upload_resume(data: ResumeUpload, db: Session = Depends(get_db)):
    resume = data.resume_text.lower()
    extracted = [skill for skill in common_skills if skill in resume]

    user = db.query(User).filter(User.name == data.name, User.role == 'consultant').first()
    if user:
        if user.profile:
            user.profile.skills = extracted
        else:
            profile = ConsultantProfile(user_id=user.id, skills=extracted, department="Not Assigned", status="Resume Pending")
            db.add(profile)
    db.commit()

    return {"message": f"Resume parsed for {data.name}", "extracted_skills": extracted}

# ---------- Attendance ----------
consultant_attendance = {}
class AttendanceEntry(BaseModel):
    name: str
    date: date

@app.post("/mark-attendance")
def mark_attendance(entry: AttendanceEntry):
    consultant_attendance.setdefault(entry.name, [])
    if entry.date in consultant_attendance[entry.name]:
        return {"message": f"{entry.name} already marked present on {entry.date}"}
    consultant_attendance[entry.name].append(entry.date)
    return {"message": f"Attendance marked for {entry.name} on {entry.date}"}

@app.get("/attendance-summary/{name}")
def attendance_summary(name: str):
    dates = consultant_attendance.get(name, [])
    return {"name": name, "total_days_present": len(dates), "present_dates": dates}

# ---------- Assessment ----------
class AssessmentSubmission(BaseModel):
    name: str
    topic: str
    answers: List[str]

quiz_bank = {
    "python": ["a", "b", "c", "a", "d"],
    "aws": ["b", "c", "a", "d", "b"]
}

consultant_assessments = {}

@app.post("/submit-assessment")
def submit_assessment(submission: AssessmentSubmission):
    topic = submission.topic.lower()
    if topic not in quiz_bank:
        return {"error": f"No quiz available for topic: {topic}"}
    correct = quiz_bank[topic]
    score = sum(1 for i, ans in enumerate(submission.answers) if i < len(correct) and ans == correct[i])
    percentage = round((score / len(correct)) * 100)
    consultant_assessments.setdefault(submission.name, {})[topic] = {"score": score, "percentage": percentage}
    return {"message": f"{submission.name}'s {topic} assessment completed.", "score": score, "percentage": f"{percentage}%"}

# ---------- Learning Progress ----------
consultant_learning_db = {}

tsr_skills_map = {
    "python_developer": {
        "required_skills": ["python", "flask", "sql", "git"],
        "learning_modules": {
            "python": "Intro to Python",
            "flask": "Flask Crash Course",
            "sql": "SQL for Developers",
            "git": "Version Control with Git"
        }
    }
}

@app.get("/recommend-learning/{name}")
def recommend_learning(name: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.name == name, User.role == 'consultant').first()
    if not user or not user.profile:
        return {"error": "Consultant not found"}

    profile = user.profile
    tsr = tsr_skills_map["python_developer"]
    missing = [s for s in tsr["required_skills"] if s not in profile.skills]
    path = [tsr["learning_modules"][s] for s in missing]
    consultant_learning_db[name] = {"learning_path": path, "completed": []}
    return {"name": name, "missing_skills": missing, "recommended_learning": path}

class LearningProgressUpdate(BaseModel):
    name: str
    completed_modules: List[str]

@app.post("/update-learning-progress")
def update_learning(data: LearningProgressUpdate):
    progress = consultant_learning_db.setdefault(data.name, {"learning_path": [], "completed": []})
    for module in data.completed_modules:
        if module not in progress["completed"]:
            progress["completed"].append(module)
    return {"message": f"Progress updated for {data.name}", "completed": progress["completed"]}

@app.get("/consultant-dashboard/{name}")
def get_dashboard(name: str):
    data = consultant_learning_db.get(name)
    if not data:
        return {"error": "Consultant not found"}
    total = len(data["learning_path"])
    done = len(data["completed"])
    progress = f"{(done / total) * 100:.0f}%" if total > 0 else "0%"
    return {"name": name, "learning_path": data["learning_path"], "completed": data["completed"], "progress": progress}

# ---------- Admin Dashboard ----------
@app.get("/admin/consultants")
def admin_dashboard(skill: str = Query(None), name: str = Query(None), db: Session = Depends(get_db)):
    query = db.query(User).filter(User.role == 'consultant')
    if name:
        query = query.filter(User.name.ilike(f"%{name}%"))
    users = query.all()

    result = []
    for user in users:
        profile = user.profile
        if skill and skill.lower() not in [s.lower() for s in (profile.skills or [])]:
            continue
        learning = consultant_learning_db.get(user.name, {})
        total = len(learning.get("learning_path", []))
        done = len(learning.get("completed", []))
        progress = f"{(done / total) * 100:.0f}%" if total > 0 else "0%"
        assessments = consultant_assessments.get(user.name, {})
        result.append({
            "name": user.name,
            "skills": profile.skills if profile else [],
            "assessment_scores": {k: v["percentage"] for k, v in assessments.items()},
            "learning_path": learning.get("learning_path", []),
            "completed_modules": learning.get("completed", []),
            "progress": progress
        })
    return {"consultants": result}

# ---------- Email Utility ----------
def send_email(subject, body):
    if DISABLE_EMAIL:
        print("📭 Email sending disabled.")
        return True
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_USER
    msg["To"] = EMAIL_TO
    try:
        with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, EMAIL_TO, msg.as_string())
        print("✅ Email sent successfully")
        return True
    except Exception as e:
        print(f"❌ Email failed: {e}")
        return False
