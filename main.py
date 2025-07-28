from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import re
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
from datetime import date

from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
# from app.model import Consultant
from app.model.user_model import User
# --------------------------------------
from fastapi import FastAPI
from app.routers import user_router

app = FastAPI()

# Include your auth/user router
app.include_router(user_router.router, prefix="/auth", tags=["Auth"])





# Load .env file
load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
EMAIL_TO   = os.getenv("EMAIL_TO")

DISABLE_EMAIL = False

app = FastAPI()

# ========== JD Submission ==========
class JDRequest(BaseModel):
    jd_text: str

jd_storage = ""

@app.post("/submit-jd")
def submit_jd(jd: JDRequest):
    global jd_storage
    jd_storage = jd.jd_text
    return {"message": "JD received", "jd": jd_storage}

# ========== Consultant Profile Submission ==========
class ConsultantProfile(BaseModel):
    name: str
    skills: List[str]

from app.database import SessionLocal
# from app.model import Consultant
from fastapi import Depends

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/submit-profiles")
def submit_profiles(profiles: List[ConsultantProfile], db: Session = Depends(get_db)):
    count = 0
    for profile in profiles:
        # Check if consultant already exists
        existing = db.query(User).filter(Consultant.name == profile.name,User.role == 'consultant').first()
        if not existing:
            new_user = User(name=profile.name, skills=profile.skills)
            db.add(new_consultant)
            count += 1
    db.commit()

    return {
        "message": f"{count} new profiles added.",
    }

# @app.post("/submit-profiles")
# def submit_profiles(profiles: List[ConsultantProfile], db: SessionLocal = Depends(get_db)):
    count = 0
    for profile in profiles:
        existing = db.query(Consultant).filter(Consultant.name == profile.name).first()
        if existing:
            existing.skills = profile.skills
        else:
            new_c = Consultant(name=profile.name, skills=profile.skills)
            db.add(new_c)
        count += 1
    db.commit()

    total = db.query(Consultant).count()

    return {
        "message": f"{count} profiles processed.",
        "total_profiles_stored": total
    }

# ========== Email Sender ==========
def send_email(subject, body):
    if DISABLE_EMAIL:
        print("📭 Email sending disabled (simulation mode).")
        print("Subject:", subject)
        print("Body:", body)
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
        print(f"❌ Email sending failed: {e}")
        return False
#==========resume upload class===============
class ResumeUpload(BaseModel):
    name: str
    resume_text: str

common_skills = [
    "python", "java", "javascript", "react", "node", "aws", "docker",
    "sql", "mongodb", "kubernetes", "html", "css", "git", "linux",
    "tensorflow", "pytorch", "fastapi", "flask", "django"
]

from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db
# from app.model import Consultant

from app.model.user_model import User


@app.post("/upload-resume")
def upload_resume(data: ResumeUpload, db: Session = Depends(get_db)):
    resume = data.resume_text.lower()
    extracted = [skill for skill in common_skills if skill in resume]

    # Check if consultant exists in the DB
    consultant = db.query(Consultant).filter(Consultant.name == data.name).first()

    if consultant:
        consultant.skills = extracted  # update skills
    else:
        consultant = Consultant(name=data.name, skills=extracted)
        db.add(consultant)

    db.commit()

    return {
        "message": f"Resume parsed for {data.name}",
        "extracted_skills": extracted
    }


consultant_attendance = {}
class AttendanceEntry(BaseModel):
    name: str
    date: date  # Format: "YYYY-MM-DD"


@app.post("/mark-attendance")
def mark_attendance(entry: AttendanceEntry):
    if entry.name not in consultant_attendance:
        consultant_attendance[entry.name] = []

    if entry.date in consultant_attendance[entry.name]:
        return {"message": f"{entry.name} already marked present on {entry.date}"}

    consultant_attendance[entry.name].append(entry.date)
    return {"message": f"Attendance marked for {entry.name} on {entry.date}"}


@app.get("/attendance-summary/{name}")
def attendance_summary(name: str):
    dates = consultant_attendance.get(name, [])
    return {
        "name": name,
        "total_days_present": len(dates),
        "present_dates": dates
    }




class AssessmentSubmission(BaseModel):
    name: str
    topic: str
    answers: List[str]

# Simulated correct answers per topic
quiz_bank = {
    "python": ["a", "b", "c", "a", "d"],
    "aws": ["b", "c", "a", "d", "b"]
}

# Store assessment scores
consultant_assessments = {}


# Simulated database for learning progress
consultant_learning_db = {}



# Simulated TSR role skill mapping=========================================================
#===========================================================================================
#====================================================

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
def recommend_learning(name: str):
    profile = next((c for c in consultant_profiles if c.name.lower() == name.lower()), None)
    if not profile:
        return {"error": "Consultant not found"}

    # Assume TSR role is 'python_developer'
    tsr = tsr_skills_map["python_developer"]
    missing_skills = [s for s in tsr["required_skills"] if s not in profile.skills]

    learning_path = [tsr["learning_modules"][skill] for skill in missing_skills]

    # Optionally store this path in consultant_learning_db
    consultant_learning_db[name] = {
        "learning_path": learning_path,
        "completed": []
    }

    return {
        "name": profile.name,
        "missing_skills": missing_skills,
        "recommended_learning": learning_path
    }


class LearningProgressUpdate(BaseModel):
    name: str
    completed_modules: List[str]

@app.post("/update-learning-progress")
def update_learning(data: LearningProgressUpdate):
    if data.name not in consultant_learning_db:
        consultant_learning_db[data.name] = {
            "learning_path": [],
            "completed": []
        }

    # Update completed modules (avoid duplicates)
    existing = consultant_learning_db[data.name]["completed"]
    for module in data.completed_modules:
        if module not in existing:
            existing.append(module)

    return {
        "message": f"Progress updated for {data.name}",
        "completed": existing
    }


@app.get("/consultant-dashboard/{name}")
def get_dashboard(name: str):
    data = consultant_learning_db.get(name)
    if not data:
        return {"error": "Consultant not found"}

    total = len(data["learning_path"])
    done = len(data["completed"])
    progress = f"{(done / total) * 100:.0f}%" if total > 0 else "0%"

    return {
        "name": name,
        "learning_path": data["learning_path"],
        "completed": data["completed"],
        "progress": progress
    }


@app.post("/submit-assessment")
def submit_assessment(submission: AssessmentSubmission):
    topic = submission.topic.lower()
    user_answers = submission.answers

    if topic not in quiz_bank:
        return {"error": f"No quiz available for topic: {topic}"}

    correct = quiz_bank[topic]
    score = sum(1 for i, ans in enumerate(user_answers) if i < len(correct) and ans == correct[i])
    percentage = round((score / len(correct)) * 100)

    # Save to consultant_assessments
    if submission.name not in consultant_assessments:
        consultant_assessments[submission.name] = {}

    consultant_assessments[submission.name][topic] = {
        "score": score,
        "percentage": percentage
    }

    return {
        "message": f"{submission.name}'s {topic} assessment completed.",
        "score": score,
        "percentage": f"{percentage}%"
    }



#=========get dashboard============
@app.get("/consultant-dashboard/{name}")
def get_dashboard(name: str):
    name = name.lower()

    # Try to find consultant with case-insensitive match
    for stored_name in consultant_learning_db:
        if stored_name.lower() == name:
            data = consultant_learning_db[stored_name]
            total = len(data["learning_path"])
            done = len(data["completed"])
            progress = f"{(done / total) * 100:.0f}%" if total > 0 else "0%"

            return {
                "name": stored_name,
                "learning_path": data["learning_path"],
                "completed": data["completed"],
                "progress": progress
            }

    return {"error": "Consultant not found."}


# ========== Matching and Email Notification ==========
@app.get("/match-profiles")
def match_profiles():
    if not jd_storage:
        return {"error": "JD not submitted yet."}
    if not consultant_profiles:
        return {"error": "No consultant profiles available."}

    jd_words = set(re.findall(r'\b\w+\b', jd_storage.lower()))

    scored_profiles = []
    for profile in consultant_profiles:
        score = sum(1 for skill in profile.skills if skill.lower() in jd_words)
        scored_profiles.append({
            "name": profile.name,
            "skills": profile.skills,
            "match_score": score
        })

    top_matches = sorted(scored_profiles, key=lambda x: x["match_score"], reverse=True)[:3]

    if top_matches and top_matches[0]["match_score"] > 0:
        email_body = "Top Matching Profiles:\n\n"
        for match in top_matches:
            email_body += f"- {match['name']} (Score: {match['match_score']})\n  Skills: {', '.join(match['skills'])}\n\n"
        send_email("Top Consultant Matches Found", email_body)
        return {"status": "Email sent with top matches", "top_matches": top_matches}
    else:
        send_email("No Consultant Match Found", "No suitable candidates found for the submitted JD.")
        return {"status": "No match found — email sent to recruiter"}
    

#============admin api startss===================================

from fastapi import Query

@app.get("/admin/consultants")
def admin_dashboard(skill: str = Query(None), name: str = Query(None)):
    results = []

    for profile in consultant_profiles:
        consultant_name = profile.name
        profile_skills = profile.skills

        # Match optional filters
        if name and name.lower() not in consultant_name.lower():
            continue
        if skill and skill.lower() not in [s.lower() for s in profile_skills]:
            continue

        # Get all assessment scores by topic
        assessment_data = consultant_assessments.get(consultant_name, {})
        assessment_scores = {
            topic: result["percentage"]
            for topic, result in assessment_data.items()
        }

        # Learning progress
        learning_data = consultant_learning_db.get(consultant_name, {})
        learning_path = learning_data.get("learning_path", [])
        completed = learning_data.get("completed", [])
        progress = f"{(len(completed) / len(learning_path)) * 100:.0f}%" if learning_path else "0%"

        results.append({
            "name": consultant_name,
            "skills": profile_skills,
            "assessment_scores": assessment_scores,
            "learning_path": learning_path,
            "completed_modules": completed,
            "progress": progress
        })

    return {"consultants": results}


    