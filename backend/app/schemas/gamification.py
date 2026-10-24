from typing import List
from pydantic import BaseModel, ConfigDict


class Badge(BaseModel):
    id: str
    name: str
    description: str
    unlocked: bool
    icon: str


class GamificationStatsResponse(BaseModel):
    total_xp: int
    level: int
    xp_to_next_level: int
    level_progress_percentage: int
    completed_tasks_count: int
    total_tasks_count: int
    overall_progress_percentage: int
    badges: List[Badge]

    model_config = ConfigDict(from_attributes=True)
