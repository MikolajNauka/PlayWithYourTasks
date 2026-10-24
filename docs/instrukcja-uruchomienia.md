# Instrukcja Uruchomienia i Wykonania Testów — PlayWithYourTasks

Ten przewodnik zawiera wszystkie komendy potrzebne do uruchomienia aplikacji oraz każdego z wymaganych rodzajów testów.

---

## 1. Uruchomienie Backend (FastAPI)

Otwórz pierwszy terminal i przejdź do katalogu `backend`:

```powershell
cd PlayWithYourTasks\backend

# Aktywacja wirtualnego środowiska (jeśli nie jest aktywne):
.\venv\Scripts\Activate.ps1
# LUB bez aktywacji, bezpośrednio przez python ze środowiska venv:
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

- API będzie dostępne pod adresem: `http://127.0.0.1:8000`
- Interaktywna dokumentacja Swagger UI: `http://127.0.0.1:8000/docs`

---

## 2. Uruchomienie Frontend (Next.js)

Otwórz drugi terminal i przejdź do katalogu `frontend`:

```powershell
cd PlayWithYourTasks\frontend

npm run dev
```

- Aplikacja frontendowa uruchomi się pod adresem: `http://localhost:3000`

---

## 3. Uruchamianie Testów

Wszystkie rodzaje testów wymagane przez przedmiot zostały skonfigurowane w projekcie:

### A. Testy Jednostkowe (Unit Tests)
Sprawdzają logikę biznesową, matematykę poziomów XP, wzorzec strategii oraz komponenty UI w izolacji.

- **Backend (Pytest):**
  ```powershell
  cd PlayWithYourTasks\backend
  .\venv\Scripts\python.exe -m pytest tests/unit -v
  ```

- **Frontend (Vitest):**
  ```powershell
  cd PlayWithYourTasks\frontend
  npm test
  ```

---

### B. Testy Integracyjne (Integration Tests)
Sprawdzają współpracę endpointów API FastAPI z prawdziwą relacyjną bazą danych SQLite.

```powershell
cd PlayWithYourTasks\backend
.\venv\Scripts\python.exe -m pytest tests/integration -v
```

Aby uruchomić **wszystkie testy backendu** (jednostkowe + integracyjne) naraz:
```powershell
cd PlayWithYourTasks\backend
.\venv\Scripts\python.exe -m pytest -v
```

---

### C. Testy Mutacyjne (Mutation Tests)
Wprowadzają celowe modyfikacje kodu (mutanty), aby sprawdzić, czy testy wychwycą błędy.

- **Frontend (Stryker Mutator):**
  Działa natywnie na systemie Windows w środowisku Node.js:
  ```powershell
  cd PlayWithYourTasks\frontend
  npm run test:mutation
  ```
  *Po zakończeniu generowany jest interaktywny raport HTML w pliku: `frontend/reports/mutation/mutation.html` (wynik: ponad 90% mutation score na komponencie grywalizacji!).*

- **Backend (Mutmut):**
  Narzędzie `mutmut` dla Pythona jest skonfigurowane w `backend/setup.cfg`. Na systemie Windows mutmut wymaga uruchomienia w podsystemie Linux (WSL), zgodnie z dokumentacją twórców biblioteki:
  ```bash
  mutmut run --paths-to-mutate app/services/gamification/
  mutmut results
  ```

---

### D. Testy End-to-End (E2E)
Sprawdzają aplikację w prawdziwej przeglądarce od strony użytkownika (Playwright).

> **Ważne:** Przed uruchomieniem testów E2E upewnij się, że backend (`uvicorn`) i frontend (`npm run dev`) są uruchomione!

W nowym oknie terminala:
```powershell
cd PlayWithYourTasks\frontend
npm run test:e2e
```
Aby zobaczyć okno przeglądarki podczas wykonywania testu:
```powershell
npx playwright test --headed
```

---

### E. Testy Manualne
Scenariusze testów manualnych krok po kroku wraz z tabelą wyników i oczekiwanym zachowaniem interfejsu znajdują się w pliku:
`docs/testy-manualne.md`
