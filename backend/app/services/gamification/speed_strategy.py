from app.models.task import Task
from app.services.gamification.base_strategy import XPStrategy


class SpeedBonusXPStrategy(XPStrategy):
    """
    Strategia z bonusem za szybkie wykonanie zadania:
    Zwraca bazowe 50 XP + dodatkowe 30 XP, jeśli zadanie zostało ukończone w ciągu godziny od utworzenia.
    """

    BASE_XP = 50
    SPEED_BONUS = 30
    MAX_SECONDS_FOR_BONUS = 3600

    def calculate_xp(self, task: Task) -> int:
        if task.completed_at and task.created_at:
            delta = (task.completed_at - task.created_at).total_seconds()
            if delta <= self.MAX_SECONDS_FOR_BONUS:
                return self.BASE_XP + self.SPEED_BONUS
        return self.BASE_XP

    def get_strategy_name(self) -> str:
        return "Speed-Bonus"
