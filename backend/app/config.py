import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SURAKSHA Flood Decision Support Platform"
    VERSION: str = "2.4.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment & Host
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./suraksha.db")
    
    # JWT & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "suraksha-super-secure-production-jwt-token-key-2026-secret")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # CORS
    CORS_ORIGINS: list = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
        if origin.strip()
    ]
    
    # Operator security
    OPERATOR_API_KEY: str = os.getenv("SURAKSHA_OPERATOR_API_KEY", "SURAKSHA-OP-KEY-98421")
    JEV_MODE: str = os.getenv("JEV_SUPERVISOR_MODE", "OFFLINE_DETERMINISTIC")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

