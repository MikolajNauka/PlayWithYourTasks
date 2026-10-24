from fastapi import status


def test_create_and_get_tasks(client):
    # Początkowo pusta lista
    res = client.get("/api/tasks")
    assert res.status_code == status.HTTP_200_OK
    assert res.json() == []

    # Dodanie zadania
    payload = {
        "title": "Nauczyć się do kolokwium",
        "description": "Przeczytać rozdziały 1-4 z testowania",
        "priority": "high",
        "category": "Studia",
    }
    create_res = client.post("/api/tasks", json=payload)
    assert create_res.status_code == status.HTTP_201_CREATED
    data = create_res.json()
    assert data["id"] is not None
    assert data["title"] == "Nauczyć się do kolokwium"
    assert data["priority"] == "high"
    assert data["is_completed"] is False
    assert data["xp_reward"] == 100  # PriorityXPStrategy dla high daje 100 XP

    # Sprawdzenie czy zadanie jest na liście
    list_res = client.get("/api/tasks")
    assert list_res.status_code == status.HTTP_200_OK
    assert len(list_res.json()) == 1


def test_toggle_task_completion_and_gamification_integration(client):
    # 1. Dodajemy zadanie o priorytecie urgent (150 XP)
    create_res = client.post(
        "/api/tasks",
        json={"title": "Pilny projekt", "priority": "urgent", "category": "Projekt"},
    )
    task_id = create_res.json()["id"]

    # 2. Sprawdzamy początkowy stan grywalizacji
    stats_before = client.get("/api/gamification/stats").json()
    assert stats_before["total_xp"] == 0
    assert stats_before["level"] == 1
    assert stats_before["completed_tasks_count"] == 0

    # 3. Oznaczamy zadanie jako ukończone
    toggle_res = client.patch(f"/api/tasks/{task_id}/toggle")
    assert toggle_res.status_code == status.HTTP_200_OK
    assert toggle_res.json()["is_completed"] is True
    assert toggle_res.json()["completed_at"] is not None

    # 4. Sprawdzamy stan grywalizacji po ukończeniu:
    # 150 XP -> Poziom 2, 50 XP do kolejnego, 50% paska
    stats_after = client.get("/api/gamification/stats").json()
    assert stats_after["total_xp"] == 150
    assert stats_after["level"] == 2
    assert stats_after["xp_to_next_level"] == 50
    assert stats_after["level_progress_percentage"] == 50
    assert stats_after["completed_tasks_count"] == 1
    assert stats_after["overall_progress_percentage"] == 100

    # 5. Cofnięcie ukończenia zadania
    toggle_back_res = client.patch(f"/api/tasks/{task_id}/toggle")
    assert toggle_back_res.status_code == status.HTTP_200_OK
    assert toggle_back_res.json()["is_completed"] is False

    stats_reverted = client.get("/api/gamification/stats").json()
    assert stats_reverted["total_xp"] == 0
    assert stats_reverted["level"] == 1
    assert stats_reverted["completed_tasks_count"] == 0


def test_delete_task(client):
    # Tworzymy zadanie
    create_res = client.post(
        "/api/tasks",
        json={"title": "Do usunięcia", "priority": "low"},
    )
    task_id = create_res.json()["id"]

    # Usuwamy zadanie
    del_res = client.delete(f"/api/tasks/{task_id}")
    assert del_res.status_code == status.HTTP_204_NO_CONTENT

    # Weryfikujemy, że zadanie nie istnieje (404)
    get_res = client.get(f"/api/tasks/{task_id}")
    assert get_res.status_code == status.HTTP_404_NOT_FOUND


def test_task_not_found_errors(client):
    res_get = client.get("/api/tasks/9999")
    assert res_get.status_code == status.HTTP_404_NOT_FOUND

    res_toggle = client.patch("/api/tasks/9999/toggle")
    assert res_toggle.status_code == status.HTTP_404_NOT_FOUND

    res_delete = client.delete("/api/tasks/9999")
    assert res_delete.status_code == status.HTTP_404_NOT_FOUND
