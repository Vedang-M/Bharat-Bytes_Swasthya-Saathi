"""
Swasthya Saathi Backend - Main Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import get_settings
from database.mongodb import connect_db, close_db
from routers import reports


settings = get_settings()
APP_NAME = "Swasthya Saathi API"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    await connect_db()
    yield
    # Shutdown
    await close_db()


app = FastAPI(
    title=APP_NAME,
    description="Medical Report Intelligence Platform - Health clarity without diagnosis",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(reports.router)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": APP_NAME}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Swasthya Saathi API",
        "docs": "/docs",
        "health": "/health"
    }

