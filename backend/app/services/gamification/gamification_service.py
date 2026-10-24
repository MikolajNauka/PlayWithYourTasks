from typing import List
from app.models.task import Task
from app.models.user_stats import UserStats
from app.schemas.gamification import Badge, GamificationStatsResponse
from app.services.gamification.base_strategy import XPStrategy
from app.services.gamification.priority_strategy import PriorityXPStrategy


class GamificationService:
    """
    Serwis grywalizacji wykorzystujący wzorzec strategii (Strategy Pattern) oraz polimorfizm.
    """

    XP_PER_LEVEL = 100

    def __init__(self, strategy: XPStrategy | None = None):
        # Domyślnie używamy strategii opartej na priorytecie
        self.strategy: XPStrategy = strategy or PriorityXPStrategy()

    def set_strategy(self, strategy: XPStrategy) -> None:
        """Dynamiczna podmiana strategii punktowej (demonstracja polimorfizmu w runtime)."""
        self.strategy = strategy

    def compute_xp_for_task(self, task: Task) -> int:
        """Wywołanie metody polimorficznej z aktualnie ustawionej strategii."""
        return self.strategy.calculate_xp(task)

    @classmethod
    def calculate_level_and_progress(cls, total_xp: int) -> tuple[int, int, int]:
        """
        Zwraca: (level, xp_to_next_level, progress_percentage)
        Każdy poziom wymaga 100 XP.
        """
        if total_xp < 0:
            total_xp = 0

        level = (total_xp // cls.XP_PER_LEVEL) + 1
        xp_in_current_level = total_xp % cls.XP_PER_LEVEL
        xp_to_next_level = cls.XP_PER_LEVEL - xp_in_current_level
        progress_percentage = int((xp_in_current_level / cls.XP_PER_LEVEL) * 100)

        return level, xp_to_next_level, progress_percentage

    @classmethod
    def get_badges(cls, completed_count: int, total_xp: int) -> List[Badge]:
        """Zwraca listę odznak wraz ze statusem ich odblokowania."""
        return [
            Badge(
                id="first_step",
                name="Pierwszy Krok",
                description="Ukończ swoje pierwsze zadanie",
                unlocked=completed_count >= 1,
                icon="🎯",
            ),
            Badge(
                id="task_master_5",
                name="Wielozadaniowiec",
                description="Ukończ przynajmniej 5 zadań",
                unlocked=completed_count >= 5,
                icon="🚀",
            ),
            Badge(
                id="xp_champion_300",
                name="Łowca Doświadczenia",
                description="Zdobądź co najmniej 300 punktów XP",
                unlocked=total_xp >= 300,
                icon="👑",
            ),
        ]

    def build_stats_response(
        self, stats: UserStats, tasks: List[Task]
    ) -> GamificationStatsResponse:
        total_tasks = len(tasks)
        completed_tasks = sum(1 for t in tasks if t.is_completed)

        level, xp_to_next, level_prog = self.calculate_level_and_progress(stats.total_xp)

        overall_prog = (
            int((completed_tasks / total_tasks) * 100) if total_tasks > 0 else 0
        )

        badges = self.get_badges(completed_tasks, stats.total_xp)

        return GamificationStatsResponse(
            total_xp=stats.total_xp,
            level=level,
            xp_to_next_level=xp_to_next,
            level_progress_percentage=level_prog,
            completed_tasks_count=completed_tasks,
            total_tasks_count=total_tasks,
            overall_progress_percentage=overall_prog,
            badges=badges,
        )
