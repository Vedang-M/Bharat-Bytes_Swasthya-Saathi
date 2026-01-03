"""
Anonymous Session Handling
Generates and manages session-based patient IDs without PII
"""
import hashlib
import uuid
from datetime import datetime
from fastapi import Request, Response


def generate_session_id() -> str:
    """Generate a new unique session ID"""
    return str(uuid.uuid4())


def hash_session_to_patient_id(session_id: str) -> str:
    """
    Convert session ID to a hashed patient ID
    This ensures anonymity while maintaining consistency
    """
    return hashlib.sha256(session_id.encode()).hexdigest()[:16]


def get_or_create_session(request: Request, response: Response) -> str:
    """
    Get existing session ID from cookie or create a new one
    Returns the session ID
    """
    session_id = request.cookies.get("session_id")
    
    if not session_id:
        session_id = generate_session_id()
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            samesite="lax",
            max_age=365 * 24 * 60 * 60  # 1 year
        )
    
    return session_id


def get_patient_id(request: Request, response: Response) -> str:
    """
    Get the hashed patient ID for the current session
    Creates a new session if none exists
    """
    session_id = get_or_create_session(request, response)
    return hash_session_to_patient_id(session_id)


def get_session_from_request(request: Request) -> str:
    """Get session ID from request without creating new one"""
    return request.cookies.get("session_id", "demo-session")
