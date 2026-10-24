from app.models.task import Task
from app.services.gamification.base_strategy import XPStrategy


class PriorityXPStrategy(XPStrategy):
    """
    Strategia punktacji uzależniona od priorytetu zadania:
    - low: 25 XP
    - medium: 50 XP
    - high: 100 XP
    - urgent: 150 XP
    """

    PRIORITY_MAP = {
        "low": 25,
        "medium": 50,
        "high": 100,
        "urgent": 150,
    }

    def calculate_xp(self, task: Task) -> int:
        priority_normalized = (task.priority or "").lower()
        return self.PRIORITY_MAP.get(priority_normalized, 50)

    def get_strategy_name(self) -> str:
        return "Priority-based"
