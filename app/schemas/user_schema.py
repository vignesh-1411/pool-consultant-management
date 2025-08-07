
from pydantic import BaseModel, EmailStr, Field
from enum import Enum
from typing import Optional, List
from datetime import datetime

class UserRole(str, Enum):
    admin = "admin"
    consultant = "consultant"

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole = UserRole.consultant
    department: Optional[str] = Field(None, max_length=50)
    skills: Optional[list[str]] = []

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: UserRole

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None

class SkillOut(BaseModel):
    skill: str
    proficiency: Optional[int] = None

    class Config:
        orm_mode = True


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    department: Optional[str]
    # skills: Optional[list[str]]
    skills: List[SkillOut]
    created_at: datetime

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class AdminResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    created_at: datetime

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class AttendanceSummary(BaseModel):
    present_days: int
    total_days: int
    attendance_rate: str

class ConsultantResponse(UserResponse):
    resume_status: str
    training_status: str
    attendance_summary: AttendanceSummary
    opportunities_count: int

    class Config:
        orm_mode = True
        