# test_db.py

from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.model import Consultant

def test_insert():
    db: Session = SessionLocal()

    new_consultant = Consultant(
        name="Alice Johnson",
        skills=["python", "react", "aws"]
    )

    db.add(new_consultant)
    db.commit()
    db.refresh(new_consultant)

    print("✅ Inserted:", new_consultant.name, new_consultant.skills)

    db.close()

if __name__ == "__main__":
    test_insert()
