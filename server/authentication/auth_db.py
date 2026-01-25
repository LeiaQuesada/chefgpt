from sqlalchemy import select
from sqlalchemy.orm import Session
from .auth_models import DBUser
import bcrypt
from datetime import datetime, timedelta
from secrets import token_urlsafe
from .auth_schemas import UserPublicDetailsResponse

SESSION_LIFE_MINUTES = 120


def get_user_by_username(session: Session, username: str) -> DBUser | None:
    """
    Get user object by username. Returns None if the user does not exist.
    """
    stmt = select(DBUser).where(DBUser.username == username)
    return session.scalar(stmt)


def get_user_public_details(
    session: Session, username: str
) -> UserPublicDetailsResponse | None:
    """
    Get public details for a user by username.
    Returns None if the user does not exist.
    """
    user = get_user_by_username(session, username)
    if not user:
        return None
    else:
        return UserPublicDetailsResponse(
            id=user.id, username=user.username, image_url=user.image_url
        )


def create_user_account(
    session: Session,
    username: str,
    password: str,
    image_url: str | None,
) -> bool:
    """
    Create a new user account with the given username and password.
    Returns True if the account was created successfully, of
    False if the username exists.
    """
    stmt = select(DBUser).where(DBUser.username == username)
    if session.scalar(stmt):
        return False
    hashed_password = bcrypt.hashpw(
        password.encode(), bcrypt.gensalt()
    ).decode()
    account = DBUser(
        username=username,
        hashed_password=hashed_password,
        image_url=image_url,
        session_token=None,
        session_expires_at=None,
    )
    session.add(account)
    session.commit()
    return True


def validate_session(
    session: Session, username: str, session_token: str
) -> bool:
    """
    Validate a session token for a given username. Returns True if the
    session is valid and not expired, and updates the session expiration.
    Returns False otherwise.
    """
    stmt = (
        select(DBUser)
        .where(DBUser.username == username)
        .where(DBUser.session_token == session_token)
    )
    user = session.scalar(stmt)
    if not user:
        return False

    # Check if session has expired or is None
    if (
        user.session_expires_at is None
        or datetime.now() >= user.session_expires_at
    ):
        return False

    expires = datetime.now() + timedelta(minutes=SESSION_LIFE_MINUTES)
    user.session_expires_at = expires
    session.commit()
    return True


def invalidate_session(
    session: Session, username: str, session_token: str
) -> None:
    """
    Invalidate a user's session by setting the session token to a unique
    expired value.
    """
    stmt = (
        select(DBUser)
        .where(DBUser.username == username)
        .where(DBUser.session_token == session_token)
    )
    user = session.scalar(stmt)
    if not user:
        return

    user.session_token = f"expired-{token_urlsafe()}"
    session.commit()


def validate_username_password(
    session: Session, user: DBUser, password: str
) -> str | None:
    """
    Validate a password against a user object. If valid,
    generates a new session token, updates the session expiration, and
    returns the session token. Returns None if credentials are invalid.
    """
    valid_credentials = bcrypt.checkpw(
        password.encode(), user.hashed_password.encode()
    )
    if not valid_credentials:
        return None

    session_token = token_urlsafe()
    user.session_token = session_token
    expires = datetime.now() + timedelta(minutes=SESSION_LIFE_MINUTES)
    user.session_expires_at = expires
    session.commit()
    return session_token
