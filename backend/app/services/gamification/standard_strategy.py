from app.models.task import Task
from app.services.gamification.base_strategy import XPStrategy


class StandardXPStrategy(XPStrategy):
    """
    Standardowa strategia punktacji: przyznaje stałą bazową liczbę punktów.
    """

    BASE_XP = 50

    def calculate_xp(self, task: Task) -> int:
        return self.BASE_XP

    def get_strategy_name(self) -> str:
        return "Standard"
