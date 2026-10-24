from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String(1000), default="", nullable=False)
    priority = Column(String(50), default="medium", nullable=False)  # low, medium, high, urgent
    category = Column(String(100), default="Ogólne", nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    xp_reward = Column(Integer, default=50, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)
