from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.gamification import GamificationStatsResponse
from app.services.gamification import GamificationService, PriorityXPStrategy
from app.services.task_service import TaskService

router = APIRouter(prefix="/api/gamification", tags=["gamification"])


@router.get("/stats", response_model=GamificationStatsResponse)
def get_gamification_stats(db: Session = Depends(get_db)):
    """Pobierz aktualne statystyki gracza (XP, poziom, paski postępu, odznaki)."""
    stats = TaskService.get_or_create_stats(db)
    all_tasks = TaskService.get_tasks(db, skip=0, limit=1000)

    service = GamificationService(strategy=PriorityXPStrategy())
    return service.build_stats_response(stats, all_tasks)
