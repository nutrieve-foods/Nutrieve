from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes import auth, cart, products, orders
from app.database import Base, engine

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
except Exception as e:
    print(f"❌ Database connection failed: {e}")

app = FastAPI(title="Nutrieve API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers (IMPORTANT)
app.include_router(auth.router)
app.include_router(cart.router)
app.include_router(products.router)
app.include_router(orders.router)


@app.get("/")
def read_root():
    return {"message": "Nutrieve API is running", "status": "healthy"}

@app.get("/health")
def health():
    return {"status": "ok", "database": "connected"}
