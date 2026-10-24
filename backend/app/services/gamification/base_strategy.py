from abc import ABC, abstractmethod
from app.models.task import Task


class XPStrategy(ABC):
    """
    Abstrakcyjna klasa bazowa definiująca interfejs kalkulatora punktów doświadczenia (XP).
    Wymóg dydaktyczny projektu: OOP (Abstrakcja, Dziedziczenie, Polimorfizm).
    """

    @abstractmethod
    def calculate_xp(self, task: Task) -> int:
        """
        Polimorficzna metoda obliczająca punkty doświadczenia (XP) za wykonanie zadania.
        Każda podklasa implementuje tę metodę zgodnie z własną logiką.
        """
        pass

    @abstractmethod
    def get_strategy_name(self) -> str:
        """Zwraca identyfikator lub nazwę strategii."""
        pass
