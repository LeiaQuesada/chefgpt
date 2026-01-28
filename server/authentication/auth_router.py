from fastapi import APIRouter, HTTPException, Request, Depends
from sqlalchemy.orm import Session
from shared.database import get_session
from shared.auth import require_auth
from .auth_db import (
    validate_username_password,
    get_user_public_details,
    get_user_by_username,
    create_user_account,
    invalidate_session,
)
from .auth_schemas import (
    LoginRequest,
    LoginResponse,
    UserPublicDetailsResponse,
    SignUpRequest,
    AuthenticatedUser,
)

auth_router = APIRouter(prefix="/api/auth", tags=["authentication"])


@auth_router.post("/login", response_model=LoginResponse)
async def session_login(
    credentials: LoginRequest,
    request: Request,
    session: Session = Depends(get_session),
) -> LoginResponse:
    """
    Handle user login.
    Validates credentials, creates a session, and stores session info
    in cookies. Returns success if login is valid, else raises 401.
    """
    username = credentials.username
    password = credentials.password

    user = get_user_by_username(session, username)
    if not user:
        raise HTTPException(status_code=401)

    new_session_token = validate_username_password(session, user, password)
    if not new_session_token:
        raise HTTPException(status_code=401)

    request.session["username"] = username
    request.session["session_token"] = new_session_token
    request.session["user_id"] = user.id
    return LoginResponse(success=True)


@auth_router.post("/signup", response_model=LoginResponse)
async def signup(
    credentials: SignUpRequest,
    request: Request,
    session: Session = Depends(get_session),
) -> LoginResponse:
    """
    Handle user signup.
    Creates a new user account if username is available, then logs in
    the user. Returns success if signup is successful, else raises 400 or 409.
    """
    username = credentials.username
    password = credentials.password
    image_url = credentials.image_url
    if not username or not password:
        raise HTTPException(
            status_code=400, detail="Username and password required"
        )
    success = create_user_account(session, username, password, image_url)
    if not success:
        raise HTTPException(status_code=409, detail="Username already exists")

    user = get_user_by_username(session, username)
    if not user:
        raise HTTPException(status_code=500, detail="User creation failed")

    new_session_token = validate_username_password(session, user, password)
    if not new_session_token:
        raise HTTPException(status_code=500, detail="User creation failed")

    request.session["username"] = username
    request.session["session_token"] = new_session_token
    request.session["user_id"] = user.id
    return LoginResponse(success=True)


@auth_router.get("/logout", response_model=LoginResponse)
async def session_logout(
    request: Request, session: Session = Depends(get_session)
) -> LoginResponse:
    """
    Handle user logout.
    Invalidates the session in the database and clears session data
    from cookies. Returns success status.
    """
    username = request.session.get("username")
    if not username and not isinstance(username, str):
        return LoginResponse(success=False)
    session_token = request.session.get("session_token")
    if not session_token and not isinstance(session_token, str):
        return LoginResponse(success=False)
    invalidate_session(session, username, session_token)

    request.session.clear()
    return LoginResponse(success=True)


@auth_router.get(
    "/me",
    response_model=UserPublicDetailsResponse,
)
async def get_me(
    session: Session = Depends(get_session),
    auth_user: AuthenticatedUser = Depends(require_auth),
) -> UserPublicDetailsResponse:
    """
    Returns the public details of the currently authenticated user.
    Raises 404 if the user is not found in the database.
    """
    user_details = get_user_public_details(session, auth_user.username)
    if not user_details:
        raise HTTPException(status_code=404, detail="User not found")
    return user_details
