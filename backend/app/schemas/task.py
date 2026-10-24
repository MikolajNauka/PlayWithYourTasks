from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Tytuł zadania")
    description: Optional[str] = Field(default="", max_length=1000, description="Opis zadania")
    priority: str = Field(default="medium", description="Priorytet: low, medium, high, urgent")
    category: str = Field(default="Ogólne", max_length=100, description="Kategoria zadania")


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    is_completed: Optional[bool] = None


class TaskResponse(TaskBase):
    id: int
    is_completed: bool
    xp_reward: int
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
