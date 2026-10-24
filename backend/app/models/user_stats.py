from sqlalchemy import Column, Integer
from app.database import Base


class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, index=True)
    total_xp = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)
    completed_tasks_count = Column(Integer, default=0, nullable=False)
