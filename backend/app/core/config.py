from pydantic import BaseModel
import os
from dotenv import load_dotenv
load_dotenv() 

class Settings(BaseModel):
    database_url: str = os.getenv("DATABASE_URL", "")
    allowed_origins: list[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

settings = Settings()