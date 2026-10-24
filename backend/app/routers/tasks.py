from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.task import TaskCreate, TaskResponse
from app.services.task_service import TaskService

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=List[TaskResponse])
def get_all_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Pobierz listę zadań."""
    return TaskService.get_tasks(db, skip=skip, limit=limit)


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_new_task(task_in: TaskCreate, db: Session = Depends(get_db)):
    """Utwórz nowe zadanie z automatycznie skalkulowanym XP."""
    return TaskService.create_task(db, task_in)


@router.get("/{task_id}", response_model=TaskResponse)
def get_single_task(task_id: int, db: Session = Depends(get_db)):
    """Pobierz szczegóły jednego zadania."""
    task = TaskService.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zadanie o id {task_id} nie zostało znalezione.",
        )
    return task


@router.patch("/{task_id}/toggle", response_model=TaskResponse)
def toggle_task(task_id: int, db: Session = Depends(get_db)):
    """Przełącz status ukończenia zadania (przyznaje lub cofa XP)."""
    task = TaskService.toggle_task_completion(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zadanie o id {task_id} nie zostało znalezione.",
        )
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Usuń zadanie."""
    success = TaskService.delete_task(db, task_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zadanie o id {task_id} nie zostało znalezione.",
        )
    return None
