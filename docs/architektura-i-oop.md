# Architektura, OOP i Koncepcje Projektu PlayWithYourTasks

Ten dokument zawiera teoretyczne i praktyczne uzasadnienie rozwiązań zastosowanych w projekcie, przygotowane pod kątem pytań prowadzącego podczas obrony projektu z przedmiotu **Programowanie i testowanie aplikacji webowych**.

---

## 1. Wybór Technologii

- **Backend: FastAPI (Python)** — nowoczesny, asynchroniczny framework z automatyczną walidacją typów (Pydantic), automatyczną dokumentacją OpenAPI/Swagger (`/docs`) oraz natywną obsługą wzorców obiektowych.
- **Frontend: Next.js (React)** — framework ze wsparciem dla SSR (Server-Side Rendering), hybrydowego renderowania komponentów oraz Tailwind CSS do szybkiej budowy responsywnego interfejsu.
- **Baza danych: SQLite (SQLAlchemy ORM)** — relacyjna baza danych niewymagająca zewnętrznych serwerów kontenerowych, idealna do uruchomienia i demonstracji na dowolnym komputerze.

---

## 2. Programowanie Obiektowe (OOP) i Polimorfizm w Projekcie

Projekt demonstruje 4 kluczowe filary programowania obiektowego na przykładzie modułu obliczania nagród za zadania (`app/services/gamification`):

### A. Abstrakcja (Abstraction)
Zdefiniowano klasę bazową `XPStrategy` dziedziczącą po `abc.ABC`. Definiuje ona kontrakt za pomocą dekoratora `@abstractmethod`:
```python
from abc import ABC, abstractmethod

class XPStrategy(ABC):
    @abstractmethod
    def calculate_xp(self, task: Task) -> int:
        """Polimorficzna metoda obliczająca punkty XP."""
        pass
```

### B. Dziedziczenie (Inheritance)
Konkretne strategie punktowe dziedziczą po klasie abstrakcyjnej `XPStrategy`:
1. `StandardXPStrategy(XPStrategy)` — zwraca stałą liczbę 50 XP.
2. `PriorityXPStrategy(XPStrategy)` — kalkuluje XP zależnie od wagi zadania (low: 25, medium: 50, high: 100, urgent: 150).
3. `SpeedBonusXPStrategy(XPStrategy)` — dodaje bonus 30 XP, jeśli zadanie ukończono w ciągu 1 godziny.

### C. Polimorfizm (Polymorphism)
Polimorfizm polega na tym, że kod kliencki (`GamificationService`) wywołuje tę samą metodę `.calculate_xp(task)` na obiekcie typu `XPStrategy`, nie musząc wiedzieć, z którą dokładnie klasą ma do czynienia:
```python
class GamificationService:
    def __init__(self, strategy: XPStrategy | None = None):
        self.strategy = strategy or PriorityXPStrategy()

    def set_strategy(self, strategy: XPStrategy) -> None:
        self.strategy = strategy

    def compute_xp_for_task(self, task: Task) -> int:
        return self.strategy.calculate_xp(task) # Wywołanie polimorficzne!
```
**Zaleta architektoniczna (zasada Open-Closed z SOLID):** Dodanie nowego sposobu naliczania punktów (np. `StreakXPStrategy` lub `WeekendBonusStrategy`) wymaga jedynie utworzenia nowej klasy dziedziczącej po `XPStrategy`, bez konieczności modyfikacji istniejącego kodu!

### D. Hermetyzacja (Encapsulation)
- Modele danych (`models/task.py`, `models/user_stats.py`) hermetyzują stan tabel bazy danych.
- Schematy Pydantic (`schemas/task.py`) hermetyzują walidację poprawności typów, długości pól i reguł wejścia/wyjścia.
- Serwis `TaskService` hermetyzuje całą logikę biznesową operacji bazodanowych i zmian stanu.

---

## 3. Server-Side Rendering (SSR) vs Client-Side Rendering (CSR)

W projekcie Next.js:
- **SSR (Server-Side Rendering)**: Gotowy kod HTML strony jest przygotowywany na serwerze i przesyłany do przeglądarki. Użytkownik widzi treść natychmiast, a roboty wyszukiwarek (SEO) indeksują pełną zawartość.
- **CSR (Client-Side Rendering) / Hydratacja**: Po załadowaniu strony kod JavaScript przejmuje kontrolę (hydratacja), umożliwiając dynamiczne interakcje (np. kliknięcie checkboxa ukończenia zadania, natychmiastowe przeliczenie pasków postępu bez przeładowywania strony).
