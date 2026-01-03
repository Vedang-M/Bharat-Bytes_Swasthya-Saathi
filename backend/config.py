"""Application Configuration"""
from typing import Optional
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment"""
    
    # Application
    debug: bool = False
    
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "swasthya_saathi"
    
    # OCR
    ocr_confidence_threshold: float = 0.7
    
    # LLM Configuration - Ollama (local) or OpenRouter (cloud)
    ollama_enabled: bool = False
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama2"
    
    # OpenRouter API (for AI-powered content extraction)
    openrouter_api_key: Optional[str] = None
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openrouter_model: str = "google/gemini-2.5-flash"
    openrouter_enabled: bool = True  # Use OpenRouter by default if API key provided
    
    # File upload
    max_file_size_mb: int = 10
    
    # CORS
    cors_origins: list = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
    
    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
