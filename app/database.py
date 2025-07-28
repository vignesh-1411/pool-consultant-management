from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
import os
from dotenv import load_dotenv

# Load .env to get DB connection info
load_dotenv()

# Replace with your actual PostgreSQL details
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the SQLAlchemy engine

engine = create_engine(DATABASE_URL)
# try:
#     engine = create_engine(DATABASE_URL)
#     # Test connection
#     with engine.connect() as conn:
#         conn.execute("SELECT 1")
# except Exception as e:
#     print(f"❌ Database connection failed: {e}")
#     raise


# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
# Base = declarative_base()

from sqlalchemy.orm import declarative_base

Base = declarative_base()


# database.py

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

