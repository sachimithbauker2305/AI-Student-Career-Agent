from sqlalchemy import Column, Integer, String, Float, Text
from backend.app.database.database import Base

class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    domain = Column(String(100), nullable=False)
    match_keywords = Column(Text)
    min_cgpa = Column(Float, default=6.0)
    avg_salary_lpa = Column(String(50), default="₹ 6 - 12 LPA")
    job_outlook = Column(String(50), default="High")
    required_education = Column(String(255))
    description = Column(Text)
    why_fit_template = Column(Text)
    key_skills = Column(Text)
