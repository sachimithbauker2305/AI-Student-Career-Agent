from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from datetime import datetime
from backend.app.database.database import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    education_level = Column(String(100), default="")
    stream_major = Column(String(150), default="")
    cgpa_percentage = Column(Float, default=0)
    year_of_study = Column(String(50), default="")
    interests = Column(Text, default="")
    skills = Column(Text, default="")
    preferred_subjects = Column(Text, default="")
    budget_range = Column(String(100), default="")
    preferred_locations = Column(Text, default="")
    profile_completion_percent = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
