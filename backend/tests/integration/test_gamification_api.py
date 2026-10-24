from fastapi import status


def test_gamification_stats_initial_state(client):
    res = client.get("/api/gamification/stats")
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert data["total_xp"] == 0
    assert data["level"] == 1
    assert data["xp_to_next_level"] == 100
    assert data["level_progress_percentage"] == 0
    assert data["completed_tasks_count"] == 0
    assert data["total_tasks_count"] == 0
    assert data["overall_progress_percentage"] == 0
    assert len(data["badges"]) == 3
    assert all(b["unlocked"] is False for b in data["badges"])


def test_gamification_multiple_tasks_and_badge_unlock(client):
    # Utworzenie 5 zadań
    task_ids = []
    for i in range(5):
        create_res = client.post(
            "/api/tasks",
            json={
                "title": f"Zadanie {i+1}",
                "priority": "high",  # 100 XP każde
            },
        )
        task_ids.append(create_res.json()["id"])

    # Ukończenie 3 zadań -> 300 XP (powinno odblokować Pierwszy Krok oraz Łowcę Doświadczenia)
    for tid in task_ids[:3]:
        client.patch(f"/api/tasks/{tid}/toggle")

    stats = client.get("/api/gamification/stats").json()
    assert stats["total_xp"] == 300
    assert stats["level"] == 4  # 300 // 100 + 1 = 4
    assert stats["completed_tasks_count"] == 3
    assert stats["total_tasks_count"] == 5
    assert stats["overall_progress_percentage"] == 60  # 3/5 = 60%

    badges = {b["id"]: b["unlocked"] for b in stats["badges"]}
    assert badges["first_step"] is True
    assert badges["xp_champion_300"] is True
    assert badges["task_master_5"] is False  # dopiero od 5 ukończonych

    # Ukończenie pozostałych 2 zadań -> odblokowuje task_master_5
    for tid in task_ids[3:]:
        client.patch(f"/api/tasks/{tid}/toggle")

    stats_final = client.get("/api/gamification/stats").json()
    assert stats_final["completed_tasks_count"] == 5
    assert stats_final["overall_progress_percentage"] == 100
    badges_final = {b["id"]: b["unlocked"] for b in stats_final["badges"]}
    assert badges_final["task_master_5"] is True
