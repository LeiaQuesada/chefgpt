from fastapi import Request, Depends, HTTPException
from .database import get_session
from sqlalchemy.orm import Session
from authentication.auth_db import validate_session
from authentication.auth_schemas import AuthenticatedUser


def require_auth(
    request: Request, session: Session = Depends(get_session)
) -> AuthenticatedUser:
    """
    Dependency to get the authenticated user data from the session.
    Raises HTTP 401 if not authenticated.
    Returns AuthenticatedUser with username, user_id, and session_token.
    """
    username = request.session.get("username")
    session_token = request.session.get("session_token")
    user_id = request.session.get("user_id")

    if not username or not session_token or not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    is_valid = validate_session(session, username, session_token)

    if not is_valid:
        raise HTTPException(
            status_code=403, detail="Invalid or expired session"
        )

    return AuthenticatedUser(username=username, user_id=user_id)
