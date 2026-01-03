"""
MongoDB Database Connection and Operations
"""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError
from config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

# Global database client
client: AsyncIOMotorClient = None
db = None


async def connect_db():
    """Connect to MongoDB"""
    global client, db
    try:
        client = AsyncIOMotorClient(settings.mongodb_url, serverSelectionTimeoutMS=5000)
        # Verify connection
        await client.admin.command('ping')
        db = client[settings.mongodb_db_name]
        
        # Create indexes
        await db.reports.create_index("patient_id")
        await db.reports.create_index("report_date")
        await db.reports.create_index([("patient_id", 1), ("report_date", -1)])
        
        logger.info(f"Connected to MongoDB: {settings.mongodb_db_name}")
    except ServerSelectionTimeoutError:
        logger.warning("MongoDB not available, using in-memory fallback")
        client = None
        db = None


async def close_db():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed")


def get_db():
    """Get database instance"""
    return db


def is_db_connected() -> bool:
    """Check if database is connected"""
    return db is not None


# In-memory fallback storage for hackathon demo
_in_memory_reports: dict = {}
_in_memory_sessions: dict = {}


def get_memory_storage():
    """Get in-memory storage for fallback"""
    return {
        "reports": _in_memory_reports,
        "sessions": _in_memory_sessions
    }
