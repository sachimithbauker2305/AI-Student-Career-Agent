import json
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint

from backend.app.database.database import Base


class SavedCareer(Base):
    __tablename__ = "saved_careers"
    __table_args__ = (
        UniqueConstraint("user_id", "career_id", name="uq_user_saved_career"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    career_id = Column(Integer, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    domain = Column(String(100), default="")
    match_score = Column(Integer, default=0)
    description = Column(Text, default="")
    why_fit = Column(Text, default="")
    avg_salary_lpa = Column(String(80), default="")
    required_education = Column(String(200), default="")
    key_skills = Column(Text, default="[]")
    tags = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)

    @staticmethod
    def normalize_list(value):
        if value in (None, "", "[]"):
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return parsed
            except (TypeError, ValueError):
                pass
            return [part.strip() for part in value.split(",") if part.strip()]
        return [value]
