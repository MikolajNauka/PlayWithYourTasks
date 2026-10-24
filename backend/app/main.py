from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import gamification_router, tasks_router

# Automatyczne utworzenie tabel w SQLite
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PlayWithYourTasks API",
    description="API dla prostego Task Managera z grywalizacją (Programowanie i testowanie aplikacji webowych)",
    version="1.0.0",
)

# Konfiguracja CORS pod frontend Next.js (domyślnie port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router)
app.include_router(gamification_router)


@app.get("/")
def root():
    return {
        "message": "PlayWithYourTasks API działa poprawnie!",
        "docs_url": "/docs",
    }
