from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime
from backend.app.database.database import Base

class ActionPlanStep(Base):
    __tablename__ = "action_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_career = Column(String(150), default="Software Developer")
    step_number = Column(Integer, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    timeline = Column(String(100))
    status = Column(String(50), default="Upcoming") # 'In Progress', 'Upcoming', 'Completed'
    created_at = Column(DateTime, default=datetime.utcnow)

class RecentActivity(Base):
    __tablename__ = "recent_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_type = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    timestamp_text = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
