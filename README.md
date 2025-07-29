# 👩‍💼 Consultant Training and Assessment Platform

This project is a full-stack web application designed to manage consultants' registration, resume processing, attendance tracking, assessments, and performance monitoring. Admins can oversee consultants’ progress, while consultants can interact with training and evaluation features.

---

## 🚀 Features

### Consultant Side:
- Register/Login
- Upload resume
- Skill extraction from resume
- Mark daily attendance
- Take assessments

### Admin Side:
- View all consultants
- Filter consultants by skills, department, and status
- Monitor attendance and assessment scores
- Send email notifications

---

## 🛠️ Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React.js, Vite, Tailwind CSS |
| Backend   | FastAPI (Python), SQLAlchemy, Uvicorn |
| Database  | PostgreSQL |
| Auth & Email | JWT (Authentication), FastAPI-Mail (Gmail SMTP) |
| Environment | Python-dotenv |
| ORM       | SQLAlchemy |
| Others    | Pydantic, Passlib (for password hashing), Dotenv for secrets |

---

## 📁 Project Structure


pool-consultant-management/
│
├── frontend/ # React frontend (Vite + Tailwind)
│
├── app/ # FastAPI app package
│ ├── model/ # SQLAlchemy models
│ ├── routers/ # API routers
│ └── database.py # Database connection
│
├── dmain.py # FastAPI main entry point
├── .env # Environment variables
├── requirements.txt # Backend dependencies
└── README.md # You're here!



---



