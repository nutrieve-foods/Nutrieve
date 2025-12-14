from pydantic import BaseModel
import os
from dotenv import load_dotenv
load_dotenv() 

class Settings(BaseModel):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
    allowed_origins: list[str] = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]







settings = Settings()