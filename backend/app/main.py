from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .routes import leads as leads_router
from .routes import products as products_router
from .routes import auth as auth_router
from .database import Base, engine

Base.metadata.create_all(bind=engine)  # for quick start; move to Alembic later

app = FastAPI(title="Nutrieve LMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leads_router.router)
app.include_router(products_router.router)
app.include_router(auth_router.router)

@app.get("/health")
def health():
    return {"ok": True}