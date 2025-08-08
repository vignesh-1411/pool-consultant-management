from fastapi import FastAPI, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.model.user_model import User
from app.model.models import Assessment, LearningProgress, Attendance, Skill
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["https://pool-consultant-management.vercel.app"],  # In development, "*" is okay. For production, restrict to ["http://localhost:5173"] or your domain

    allow_origins=[
        "https://pool-consultant-management.vercel.app",  # Your Vercel domain
        "https://*.vercel.app"  # Optional, for preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import user_router

app.include_router(user_router.router, prefix="/auth")
# allow_origins=["http://localhost:5173"]
# app.include_router(auth_router, prefix="/auth")


# Load environment variables
load_dotenv()

from dotenv import load_dotenv
import os

load_dotenv()

print("EMAIL_PASS from .env:", os.getenv("EMAIL_PASS"))  # ✅ Add this

import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))






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
        "resume_status": c.resume_status,
        # Add these new fields
        "attendance_summary": {
            "present_days": db.query(Attendance)
                            .filter(Attendance.user_id == c.id)
                            .filter(Attendance.status == "present")
                            .count(),
            "total_days": db.query(Attendance)
                          .filter(Attendance.user_id == c.id)
                          .count() or 1  # Avoid division by zero
        },
        "training_status": c.training_status
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

from fastapi import UploadFile, File
import shutil

@app.post("/upload-file")
def upload_resume_file(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Uploads a resume file and updates the user's resume_file field
    """
    user = db.query(User).filter(User.id == user_id, User.role == "consultant").first()
    if not user:
        raise HTTPException(status_code=404, detail="Consultant not found")

    # Create folder if it doesn't exist
    os.makedirs("resumes", exist_ok=True)

    # Save file with unique name
    filename = f"{user_id}_{file.filename}"
    filepath = os.path.join("resumes", filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save file name in database
    user.resume_file = filename
    db.commit()

    return {
        "message": "Resume uploaded successfully",
        "file": filename
    }

from fastapi import UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
import docx
import fitz  # PyMuPDF
import os
import google.generativeai as genai
import json

@app.post("/process-resume-ai")
def process_resume_ai(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id, User.role == "consultant").first()
    if not user:
        raise HTTPException(status_code=404, detail="Consultant not found")

    # Extract text based on file type
    contents = ""
    if file.filename.endswith(".pdf"):
        try:
            with fitz.open(stream=file.file.read(), filetype="pdf") as pdf:
                contents = "\n".join([page.get_text() for page in pdf])
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")
    elif file.filename.endswith(".docx"):
        try:
            doc = docx.Document(file.file)
            contents = "\n".join([para.text for para in doc.paragraphs])
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading DOCX: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # Prompt Gemini
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-2.0-flash")

    prompt = f"""
    You are an API. Analyze the resume text below and return ONLY a JSON array with each skill, its proficiency (1–10).

    Format:
    [
    {{
        "skill": "Python",
        "proficiency": 5,
        
    }},
    ...
    ]

    Do not return any explanation or commentary. Only valid JSON output.

    Resume:
    {contents}
    """




    try:
        response = model.generate_content(prompt)
        skills_data = response.text.strip()
        import re

        # Remove Markdown-style triple backticks (e.g., ```json ... ```)
        cleaned_data = re.sub(r"^```(?:json)?\s*|\s*```$", "", skills_data.strip(), flags=re.IGNORECASE)
        parsed_skills = json.loads(cleaned_data)

        # parsed_skills = json.loads(skills_data)
        # skills_data = response.text.strip()
        # print("\n\n========== RAW GEMINI RESPONSE ==========")
        # print(skills_data)
        # print("=========================================\n\n")
        # return {
        # "raw_output": skills_data
        # }
        



        # Optional: Update DB with skill names
        # user.skills = [s["skill"] for s in parsed_skills]
        user.skills.clear()  # optional, if you want to remove old skills first

        user.skills = [
        Skill(skill=s["skill"], proficiency=s["proficiency"], user_id=user.id)
        for s in parsed_skills
        ]

        user.resume_status = "updated"
        db.commit()

        return {
            "message": "Resume processed with Gemini AI",
            "user_id": user.id,
            "skills": parsed_skills
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Gemini returned invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {str(e)}")
    
@app.get("/consultant/{user_id}/skills")
def get_skills(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    skills = db.query(Skill).filter(Skill.user_id == user_id).all()
    return [{"skill": s.skill, "proficiency": s.proficiency} for s in skills]


from fastapi.responses import FileResponse

@app.get("/consultants/{user_id}/resume")
def download_resume_by_user(user_id: int, db: Session = Depends(get_db)):
    """
    Download resume file by user ID
    """
    user = db.query(User).filter(User.id == user_id, User.role == "consultant").first()
    if not user:
        raise HTTPException(status_code=404, detail="Consultant not found")
    
    if not user.resume_file:
        raise HTTPException(status_code=404, detail="No resume uploaded for this consultant")
    
    file_path = os.path.join("resumes", user.resume_file)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Resume file not found")

    return FileResponse(
        path=file_path,
        media_type="application/octet-stream",
        filename=user.resume_file
    )



from fastapi.responses import StreamingResponse
import csv
import io

@app.get("/consultants/{consultant_id}/report")  # Changed route to be simpler
def download_consultant_report(
    consultant_id: int,
    db: Session = Depends(get_db)  # Removed admin dependency
):
    consultant = db.query(User).filter(
        User.id == consultant_id,
        User.role == "consultant"
    ).first()
    
    if not consultant:
        raise HTTPException(404, "Consultant not found")
    
    # Get attendance data
    attendance = db.query(Attendance).filter(
        Attendance.user_id == consultant_id
    ).all()
    
    # Prepare CSV data
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "Name", "Email", "Department", "Status", 
        "Resume Status", "Training Status", 
        "Attendance Rate", "Skills"
    ])
    
    # Calculate attendance
    present_days = sum(1 for a in attendance if a.status == "present")
    total_days = len(attendance) if attendance else 1  # Avoid division by zero
    
    # Write data row
    writer.writerow([
        consultant.name,
        consultant.email or "N/A",  # Handle potential None values
        consultant.department or "Unassigned",
        consultant.status,
        getattr(consultant, 'resume_status', 'pending'),  # Safe attribute access
        getattr(consultant, 'training_status', 'not_started'),
        f"{(present_days/total_days)*100:.1f}%",
        ", ".join(skill.skill for skill in consultant.skills) if consultant.skills else "None"
    ])
    
    # Return as downloadable file
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={consultant.name}_report.csv"
        }
    )
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

# Add to your existing config
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_USER"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASS"),  # Use app password!
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

#---------------------------------------------------------------------------------------


from sqlalchemy.orm import Session
from app.model.models import Attendance, Training, Recommendation
from app.model.user_model import User

def get_consultant_dashboard_data(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id, User.role == "consultant").first()
    if not user:
        return None

    # Resume status
    resume_status = user.resume_status or "pending"

    # Attendance rate
    attendance = db.query(Attendance).filter(Attendance.user_id == user_id).all()
    present_days = sum(1 for a in attendance if a.status == "present")
    total_days = len(attendance) or 1
    attendance_rate = int((present_days / total_days) * 100)

    # Dummy count for opportunities (replace with real logic if needed)
    opportunities_count = 2

    # Training status
    training_status = "not_started"

    # Workflow progress (example logic)
    workflow_progress = 70 if training_status == "in_progress" else 100 if training_status == "completed" else 20

    # Trainings
    completed_trainings = db.query(Training).filter(Training.user_id == user_id).all()
    trainings_data = [{
        "title": t.title,
        "provider": t.provider,
        "completedDate": str(t.completed_date),
        "rating": t.rating,
        "certificate": bool(t.certificate)
    } for t in completed_trainings]

    # Recommendations
    recs = db.query(Recommendation).filter(Recommendation.user_id == user_id).all()
    recs_data = [{
        "title": r.title,
        "provider": r.provider,
        "duration": r.duration,
        "rating": r.rating,
        "url": "",  # Add if you have
        "reason": r.reason,
        "priority": r.priority
    } for r in recs]

    return {
        "resumeStatus": resume_status,
        "attendanceRate": attendance_rate,
        "opportunitiesCount": opportunities_count,
        "trainingProgress": training_status,
        "workflowProgress": workflow_progress,
        "completedTrainings": trainings_data,
        "recommendations": recs_data
    }
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from app.database import get_db

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@app.get("/consultants/{user_id}/dashboard")
def consultant_dashboard(user_id: int, db: Session = Depends(get_db)):
    # from app.utils.consultant_dashboard import get_consultant_dashboard_data  # if placed in separate file
    data = get_consultant_dashboard_data(db, user_id)
    if not data:
        raise HTTPException(status_code=404, detail="Consultant not found")
    return data

from fastapi import UploadFile, File
import csv
from datetime import datetime, timedelta

@app.post("/upload-attendance")
def upload_attendance(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    contents = file.file.read().decode("utf-8").splitlines()
    reader = csv.DictReader(contents)

    for row in reader:
        # Example: Adapt keys based on Teams CSV format
        name = row["Full Name"]
        join_time_str = row["Join Time"]   # e.g., "8/5/2025, 10:00:00 AM"
        leave_time_str = row["Leave Time"]

        # Parse datetimes
        join_time = datetime.strptime(join_time_str, "%m/%d/%Y, %I:%M:%S %p")
        leave_time = datetime.strptime(leave_time_str, "%m/%d/%Y, %I:%M:%S %p")
        duration = (leave_time - join_time).seconds // 60

        # Get user from DB
        user = db.query(User).filter(User.full_name == name).first()
        if not user:
            continue  # or create user if needed

        # Create attendance record
        attendance = Attendance(
            user_id=user.id,
            date=join_time.date(),
            join_time=join_time.time(),
            leave_time=leave_time.time(),
            duration_minutes=duration
        )
        db.add(attendance)

    db.commit()
    return {"message": "Attendance data processed successfully"}




from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import google.generativeai as genai
import os, json
from metrics import log_request, get_metrics
import time
# from models import get_db, User  # adjust as needed

# router = APIRouter()

@app.get("/consultants/{user_id}/training-recommendations", tags=["Training"])
def get_training_recommendations(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.skills:
        raise HTTPException(status_code=404, detail="Consultant or skills not found")

    # skills_list = json.dumps(user.skills)  # Assuming user.skills is already in list of dicts format

    skills_list = json.dumps([
        {"name": skill.skill, "proficiency": skill.proficiency}
        for skill in user.skills
    ])

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-2.0-flash")

    prompt = f"""
        You are a training recommendation engine.

        Here is a list of skills with proficiency (1–10) of a software consultant:
        {skills_list}

        Your task:
        - Recommend one or more online training courses (Coursera, Udemy) for skill where proficiency is below 5.
        - recommend the courses which is the advanced version of existing skills, if skill is java, you should recommend advanced topics in java like springboot and etc..
        - do this for all other skills and you should also provide the link for that course, mostly use famous courses from udemy and coursera 
        - For each course, return:
        - skill name
        - course title
        - platform
        - link (URL is must and only valid URL)
        - reason why it's recommended

        Return only a JSON list like this:

        [
        {{
            "skill": "Python",
            "course_title": "Python for Everybody",
            "platform": "Coursera",
            "link": "https://www.coursera.org/specializations/python",
            "reason": "Great for beginners to strengthen Python fundamentals."
        }},
        ...
        ]

        Only return JSON. No extra text.
        """


    try:
        response = model.generate_content(prompt)
        import re
        raw_text = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.text.strip())
        recommendations = json.loads(raw_text)
        return {"user_id": user_id, "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

from fastapi import APIRouter, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import fitz  # PyMuPDF
import os
import google.generativeai as genai
import json
from app.model.models import CompletedTraining  # Adjust the path as needed



# router = APIRouter()

@app.post("/consultants/{consultant_id}/upload-certificate")
async def upload_certificate(
    consultant_id: int,
    certificate: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    print("Received file:", certificate.filename)
    # Step 1: Extract text from certificate using PyMuPDF
    try:
        

        file_bytes = certificate.file.read()
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            full_text = "\n".join([page.get_text() for page in doc])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

    # Step 2: Prompt Gemini to extract training info
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-2.0-flash")

    prompt = f"""
You are an AI assistant for parsing training certificates.

Given the certificate content below, extract the following information in pure JSON (no extra text, no markdown):

Format:
{{
  "title": "<course title>",
  "provider": "<training provider (it should be company name who offered the course, not canditate name)>",
  "completedDate": "<date in DD MMM YYYY or MM/YYYY format>"
  
}}

Only return valid JSON.

Certificate Text:
\"\"\"
{full_text}
\"\"\"
"""

    try:
        response = model.generate_content(prompt)
        json_text = response.text.strip()

        # Remove markdown wrapping if present
        import re
        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", json_text.strip(), flags=re.IGNORECASE)

        parsed = json.loads(cleaned)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {str(e)}")
    if not parsed["title"] or not parsed["provider"] or not parsed["completedDate"]:
        raise HTTPException(status_code=400, detail="Certificate parsing failed.")


    # Step 3: Save to database (optional)
    training = CompletedTraining(
        consultant_id=consultant_id,
        title=parsed["title"],
        provider=parsed["provider"],
        completed_date=parsed["completedDate"]
    )
    
    db.add(training)
    db.commit()

    # Step 4: Return parsed data
    return {
        "consultant_id": consultant_id,
        "training": parsed
    }


@app.get("/consultants/{consultant_id}/completed-trainings")
def get_completed_trainings(consultant_id: int, db: Session = Depends(get_db)):
    trainings = db.query(CompletedTraining).filter(CompletedTraining.consultant_id == consultant_id).all()
    return [
        {
            "title": t.title,
            "provider": t.provider,
            "completedDate": t.completed_date
        } for t in trainings
    ]



import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

# Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    # It's crucial to handle this error at startup
    raise ValueError("GEMINI_API_KEY environment variable is not set. Please set it to your API key.")
genai.configure(api_key=GEMINI_API_KEY)

# router = APIRouter()
model = genai.GenerativeModel('gemini-2.0-flash')

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    
# In-memory storage for conversation history, keyed by a user identifier
# This is a simple approach for demonstration. A real-world app would use a database.
# For this example, we'll maintain a single, global conversation.
conversation = model.start_chat(history=[])

@app.post("/chat", response_model=ChatResponse)
async def chat_with_gemini(request: ChatRequest):
    """
    Sends a user message to the Gemini Pro model and returns the response.
    """
    if not request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )
        
    try:
        # Send the user's message to the conversation model
        response = conversation.send_message(request.message)
        
        # Extract the text from the response object
        gemini_text = response.text
        
        return ChatResponse(response=gemini_text)
    
    except Exception as e:
        # Log the full exception for debugging
        print(f"Gemini API error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while communicating with the chatbot."
        )