# Scenariusze Testów Manualnych — PlayWithYourTasks

**Aplikacja:** PlayWithYourTasks (Task Manager z Grywalizacją)  
**Środowisko testowe:** Przeglądarka internetowa (Chrome / Firefox / Edge)  
**Backend:** FastAPI (`http://127.0.0.1:8000`)  
**Frontend:** Next.js (`http://localhost:3000`)  
**Testerzy:** Zespół projektowy  

---

## Tabela Scenariuszy Testowych

| ID Scenariusza | Nazwa testu | Warunki wstępne | Kroki do wykonania | Oczekiwany wynik | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Dodanie nowego zadania o priorytecie wysokim | Uruchomiony backend i frontend, widok strony głównej | 1. Kliknij przycisk **„Dodaj zadanie”**.<br>2. Wpisz tytuł: `Napisać dokumentację projektu`.<br>3. Wpisz opis: `Szczegółowy opis modułów`.<br>4. Wybierz priorytet: **Wysoki (+100 XP)**.<br>5. Wpisz kategorię: `Studia`.<br>6. Kliknij **„Dodaj zadanie”**. | Zadanie pojawia się na początku listy z plakietką „Wysoki”, kategorią „Studia” oraz wartością nagrody `+100 XP`. Okno modalne zamyka się. | **PASS** |
| **TC-02** | Oznaczenie zadania jako wykonane i przyrost punktów XP | Zadanie z TC-01 obecne na liście | 1. Kliknij kwadratowy checkbox obok zadania `Napisać dokumentację projektu`. | Checkbox zmienia kolor na zielony ze znacznikiem „ptaszka”. Tytuł zostaje przekreślony. Pasek XP w komponencie grywalizacji zwiększa się o 100 XP. Licznik ukończonych zadań wzrasta o 1. | **PASS** |
| **TC-03** | Awans na wyższy poziom (Level Up) | Użytkownik posiada 0 XP | 1. Dodaj zadanie o priorytecie **Pilny (+150 XP)**.<br>2. Oznacz je jako ukończone. | Poziom gracza zmienia się z `Poziom 1` na `Poziom 2`. Pasek postępu poziomu wskazuje 50% (50 XP z wymaganych 100 XP do Poziomu 3). | **PASS** |
| **TC-04** | Cofnięcie statusu ukończenia zadania | Zadanie oznaczone jako ukończone | 1. Kliknij ponownie zielony checkbox przy ukończonym zadaniu. | Status wraca do nieukończonego (tekst bez przekreślenia). Punkty XP oraz stan licznika zadań zostają poprawnie odjęte z paska grywalizacji. | **PASS** |
| **TC-05** | Filtrowanie zadań (Wszystkie, Aktywne, Ukończone) | Na liście znajdują się co najmniej jedno zadanie aktywne i jedno ukończone | 1. Kliknij przycisk filtra **„Aktywne”**.<br>2. Zweryfikuj listę.<br>3. Kliknij przycisk filtra **„Ukończone”**.<br>4. Zweryfikuj listę. | Przy filtrze „Aktywne” widoczne są wyłącznie zadania bez zaznaczonego checkboxa.<br>Przy filtrze „Ukończone” widoczne są tylko zadania zakończone. | **PASS** |
| **TC-06** | Usunięcie zadania | Co najmniej jedno zadanie na liście | 1. Najedź kursorem myszy na zadanie.<br>2. Kliknij ikonę kosza na śmieci po prawej stronie. | Zadanie znika z listy bez przeładowania całej strony (płynna aktualizacja UI). Licznik zadań aktualizuje się. | **PASS** |
| **TC-07** | Walidacja pustego formularza | Otwarte okno dodawania zadania | 1. Pozostaw pole „Tytuł zadania” puste.<br>2. Kliknij przycisk „Dodaj zadanie”. | Formularz nie wysyła żądania do serwera. Pojawia się komunikat o błędzie informujący o wymaganym tytule. | **PASS** |
| **TC-08** | Odblokowanie odznaki osiągnięć (Badges) | Nowy profil gracza (0 ukończonych zadań) | 1. Ukończ 1 dowolne zadanie.<br>2. Zaobserwuj sekcję „Odznaki i Osiągnięcia”. | Odznaka **„🎯 Pierwszy Krok”** zmienia stan z wyszarzonej (grayscale) na aktywną, podświetloną na złoto. | **PASS** |
