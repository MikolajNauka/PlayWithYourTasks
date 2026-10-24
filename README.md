# 🎮 PlayWithYourTasks — Task Manager z Grywalizacją

Projekt na zaliczenie przedmiotu **Programowanie i testowanie aplikacji webowych**.

Aplikacja to nowoczesny, minimalistyczny menedżer zadań łączący funkcje produktywności z mechanikami gier (punkty doświadczenia XP, poziomy, paski postępu, odznaki osiągnięć).

---

## 🛠️ Architektura i Technologie

- **Frontend:** Next.js (React 19, TypeScript, Tailwind CSS, Lucide Icons) ze wsparciem dla SSR (Server-Side Rendering)
- **Backend:** FastAPI (Python 3, Pydantic, SQLAlchemy, SQLite)
- **Wzorce projektowe:** OOP, Polimorfizm (Wzorzec Strategii punktowej `XPStrategy`), Hermetyzacja, Dziedziczenie, Abstrakcja

---

## 🧪 Pokrycie Testami (Wszystkie 5 wymaganych kategorii)

1. **Testy jednostkowe (Unit Tests):**
   - Backend: `pytest` (21 testów logiki biznesowej, kalkulacji poziomów, strategii punktowych)
   - Frontend: `vitest` + React Testing Library (5 testów komponentów `GamificationBar` oraz `TaskCard`)
2. **Testy integracyjne (Integration Tests):**
   - Backend: `pytest` + `TestClient` (6 testów endpointów REST API z bazą SQLite w pamięci)
3. **Testy mutacyjne (Mutation Tests):**
   - Frontend: `Stryker Mutator` (ponad 90% mutation score na komponencie postępu, raport HTML w `frontend/reports/mutation/mutation.html`)
   - Backend: `mutmut` (skonfigurowany w `setup.cfg`)
4. **Testy End-to-End (E2E):**
   - `Playwright` (kompletny scenariusz użytkownika: od wejścia na stronę, przez formularz, oznaczenie wykonania, aż po usunięcie zadania)
5. **Testy manualne:**
   - Udokumentowane scenariusze TC-01 do TC-08 w pliku `docs/testy-manualne.md`

---

## 🚀 Szybki Start

Szczegółowa instrukcja krok po kroku znajduje się w pliku [`docs/instrukcja-uruchomienia.md`](docs/instrukcja-uruchomienia.md).

### Uruchomienie Backend:
```bash
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```
Swagger UI: `http://127.0.0.1:8000/docs`

### Uruchomienie Frontend:
```bash
cd frontend
npm run dev
```
Aplikacja: `http://localhost:3000`

---

## 📚 Dokumentacja na obronę projektu
- [Opis architektury, OOP i Polimorfizmu](docs/architektura-i-oop.md)
- [Scenariusze testów manualnych](docs/testy-manualne.md)
- [Przewodnik uruchamiania testów](docs/instrukcja-uruchomienia.md)
