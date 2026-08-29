import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinQuest API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment & Database
    ENV: str = os.getenv("ENV", "development")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./finquest.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-finquest-jwt-key-2026-change-in-prod")
    JWT_REFRESH_SECRET: str = os.getenv("JWT_REFRESH_SECRET", "super-secret-finquest-refresh-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # AI Providers
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "fallback") # openai | gemini | nvidia | fallback
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    GOOGLE_API_KEY: Optional[str] = os.getenv("GOOGLE_API_KEY", None)
    NVIDIA_API_KEY: Optional[str] = os.getenv("NVIDIA_API_KEY", None)
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
