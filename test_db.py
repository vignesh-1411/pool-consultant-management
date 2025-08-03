# test_db.py

# populate_sample_data.py

from datetime import date
from app.database import SessionLocal
from app.model.models import Training, Recommendation

# Start a DB session
db = SessionLocal()

# Insert sample data
try:
    db.add_all([
        Training(
            user_id=13,
            title="Docker Basics",
            provider="Udemy",
            completed_date=date.today(),
            rating=4.5,
            certificate="http://example.com/certificate/docker"
        ),
        Recommendation(
            user_id=13,
            title="Advanced Python",
            provider="Coursera",
            duration="6 weeks",
            rating=4.7,
            reason="Skill gap in backend",
            priority="high"
        )
    ])
    db.commit()
    print("✅ Sample data inserted.")
except Exception as e:
    db.rollback()
    print("❌ Error inserting sample data:", e)
finally:
    db.close()
