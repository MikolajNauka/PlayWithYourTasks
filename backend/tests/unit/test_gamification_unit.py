from datetime import datetime, timedelta, timezone
import pytest

from app.models.task import Task
from app.services.gamification.base_strategy import XPStrategy
from app.services.gamification.gamification_service import GamificationService
from app.services.gamification.priority_strategy import PriorityXPStrategy
from app.services.gamification.speed_strategy import SpeedBonusXPStrategy
from app.services.gamification.standard_strategy import StandardXPStrategy


class CustomTestXPStrategy(XPStrategy):
    """Pomocnicza klasa do weryfikacji polimorfizmu z własną implementacją."""
    def calculate_xp(self, task: Task) -> int:
        return 999

    def get_strategy_name(self) -> str:
        return "CustomTest"


# ==========================================
# 1. Testy jednostkowe: StandardXPStrategy
# ==========================================
def test_standard_strategy_returns_fixed_xp():
    strategy = StandardXPStrategy()
    task = Task(title="Test", priority="urgent")
    assert strategy.calculate_xp(task) == 50
    assert strategy.get_strategy_name() == "Standard"


# ==========================================
# 2. Testy jednostkowe: PriorityXPStrategy
# ==========================================
@pytest.mark.parametrize(
    "priority,expected_xp",
    [
        ("low", 25),
        ("medium", 50),
        ("high", 100),
        ("urgent", 150),
        ("URGENT", 150),
        ("HIGH", 100),
        ("unknown_priority", 50),
        ("", 50),
    ],
)
def test_priority_strategy_calculations(priority, expected_xp):
    strategy = PriorityXPStrategy()
    task = Task(title="Test", priority=priority)
    assert strategy.calculate_xp(task) == expected_xp
    assert strategy.get_strategy_name() == "Priority-based"


# ==========================================
# 3. Testy jednostkowe: SpeedBonusXPStrategy
# ==========================================
def test_speed_bonus_awarded_within_window():
    strategy = SpeedBonusXPStrategy()
    now = datetime.now(timezone.utc)
    task = Task(
        title="Speedy task",
        created_at=now,
        completed_at=now + timedelta(minutes=30),  # 1800s <= 3600s
    )
    assert strategy.calculate_xp(task) == 80  # 50 + 30
    assert strategy.get_strategy_name() == "Speed-Bonus"


def test_speed_bonus_not_awarded_after_window():
    strategy = SpeedBonusXPStrategy()
    now = datetime.now(timezone.utc)
    task = Task(
        title="Slow task",
        created_at=now,
        completed_at=now + timedelta(hours=2),  # 7200s > 3600s
    )
    assert strategy.calculate_xp(task) == 50


def test_speed_bonus_without_completed_at():
    strategy = SpeedBonusXPStrategy()
    now = datetime.now(timezone.utc)
    task = Task(title="Incomplete task", created_at=now, completed_at=None)
    assert strategy.calculate_xp(task) == 50


# ==========================================
# 4. Testy jednostkowe: Polimorfizm w GamificationService
# ==========================================
def test_gamification_service_polymorphism():
    task = Task(title="Polymorphic task", priority="high")

    # Domyślna strategia w serwisie: Priority (high -> 100 XP)
    service = GamificationService()
    assert service.compute_xp_for_task(task) == 100

    # Dynamiczna zmiana strategii na Standard (zawsze 50 XP)
    service.set_strategy(StandardXPStrategy())
    assert service.compute_xp_for_task(task) == 50

    # Dynamiczna zmiana strategii na własną klasę CustomTestXPStrategy
    service.set_strategy(CustomTestXPStrategy())
    assert service.compute_xp_for_task(task) == 999


# ==========================================
# 5. Testy jednostkowe: Matematyka poziomów i postępu
# ==========================================
@pytest.mark.parametrize(
    "total_xp,expected_level,expected_to_next,expected_percentage",
    [
        (0, 1, 100, 0),
        (50, 1, 50, 50),
        (99, 1, 1, 99),
        (100, 2, 100, 0),
        (150, 2, 50, 50),
        (230, 3, 70, 30),
        (-50, 1, 100, 0),  # Ujemne XP powinno być obsłużone jako 0
    ],
)
def test_level_calculation(total_xp, expected_level, expected_to_next, expected_percentage):
    level, to_next, percentage = GamificationService.calculate_level_and_progress(total_xp)
    assert level == expected_level
    assert to_next == expected_to_next
    assert percentage == expected_percentage


# ==========================================
# 6. Testy jednostkowe: Odznaki (Badges)
# ==========================================
def test_badges_unlock_logic():
    # 0 zadań, 0 XP -> żadna odznaka nieodblokowana
    badges_zero = GamificationService.get_badges(completed_count=0, total_xp=0)
    assert all(not b.unlocked for b in badges_zero)

    # 1 zadanie ukończone -> Pierwszy Krok odblokowany
    badges_one = GamificationService.get_badges(completed_count=1, total_xp=50)
    badge_dict = {b.id: b.unlocked for b in badges_one}
    assert badge_dict["first_step"] is True
    assert badge_dict["task_master_5"] is False
    assert badge_dict["xp_champion_300"] is False

    # 5 zadań, 350 XP -> wszystkie odznaki odblokowane
    badges_all = GamificationService.get_badges(completed_count=5, total_xp=350)
    assert all(b.unlocked for b in badges_all)
