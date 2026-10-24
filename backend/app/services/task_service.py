from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.user_stats import UserStats
from app.schemas.task import TaskCreate, TaskUpdate
from app.services.gamification import GamificationService, PriorityXPStrategy


class TaskService:
    @staticmethod
    def get_or_create_stats(db: Session) -> UserStats:
        stats = db.query(UserStats).first()
        if not stats:
            stats = UserStats(total_xp=0, level=1, completed_tasks_count=0)
            db.add(stats)
            db.commit()
            db.refresh(stats)
        return stats

    @staticmethod
    def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> List[Task]:
        return db.query(Task).order_by(Task.is_completed.asc(), Task.id.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_task(db: Session, task_id: int) -> Optional[Task]:
        return db.query(Task).filter(Task.id == task_id).first()

    @classmethod
    def create_task(cls, db: Session, task_in: TaskCreate) -> Task:
        # Przykładowe użycie polimorficznej kalkulacji nagrody XP za zadanie
        dummy_task = Task(priority=task_in.priority)
        calculator = GamificationService(strategy=PriorityXPStrategy())
        calculated_xp = calculator.compute_xp_for_task(dummy_task)

        task = Task(
            title=task_in.title.strip(),
            description=(task_in.description or "").strip(),
            priority=task_in.priority.lower(),
            category=task_in.category.strip(),
            is_completed=False,
            xp_reward=calculated_xp,
            created_at=datetime.now(timezone.utc),
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @classmethod
    def toggle_task_completion(cls, db: Session, task_id: int) -> Optional[Task]:
        task = cls.get_task(db, task_id)
        if not task:
            return None

        stats = cls.get_or_create_stats(db)

        if not task.is_completed:
            # Oznaczenie jako wykonane
            task.is_completed = True
            task.completed_at = datetime.now(timezone.utc)
            stats.total_xp += task.xp_reward
            stats.completed_tasks_count += 1
        else:
            # Cofnięcie wykonania
            task.is_completed = False
            task.completed_at = None
            stats.total_xp = max(0, stats.total_xp - task.xp_reward)
            stats.completed_tasks_count = max(0, stats.completed_tasks_count - 1)

        # Przeliczenie poziomu
        level, _, _ = GamificationService.calculate_level_and_progress(stats.total_xp)
        stats.level = level

        db.commit()
        db.refresh(task)
        return task

    @classmethod
    def delete_task(cls, db: Session, task_id: int) -> bool:
        task = cls.get_task(db, task_id)
        if not task:
            return False

        if task.is_completed:
            stats = cls.get_or_create_stats(db)
            stats.total_xp = max(0, stats.total_xp - task.xp_reward)
            stats.completed_tasks_count = max(0, stats.completed_tasks_count - 1)
            level, _, _ = GamificationService.calculate_level_and_progress(stats.total_xp)
            stats.level = level

        db.delete(task)
        db.commit()
        return True
