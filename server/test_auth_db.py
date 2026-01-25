import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from authentication.auth_db import (
    get_user_by_username,
    get_user_public_details,
    create_user_account,
    validate_session,
    invalidate_session,
    validate_username_password,
)

from authentication.auth_models import DBUser
from authentication.auth_schemas import UserPublicDetailsResponse
from shared.base_model import Base

# Import all models to register with SQLAlchemy metadata
from recipes.recipes_models import DBRecipe, DBIngredient, DBInstruction

# Use an in-memory SQLite database for testing
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine)


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def session():
    db = SessionLocal()
    yield db
    db.close()


def test_create_and_get_user(session):
    username = "testuser"
    password = "testpass"
    image_url = "http://example.com/image.png"
    # Create user
    assert create_user_account(session, username, password, image_url) is True
    # Duplicate username
    assert create_user_account(session, username, password, image_url) is False
    # Get user by username
    user = get_user_by_username(session, username)
    assert user is not None
    assert user.username == username
    # Get public details
    public = get_user_public_details(session, username)
    assert isinstance(public, UserPublicDetailsResponse)
    assert public.username == username


def test_validate_username_password_and_session(session):
    username = "sessionuser"
    password = "sessionpass"
    image_url = None
    create_user_account(session, username, password, image_url)
    user = get_user_by_username(session, username)
    # Invalid password
    assert validate_username_password(session, user, "wrongpass") is None
    # Valid password
    token = validate_username_password(session, user, password)
    assert isinstance(token, str)
    # Validate session
    assert validate_session(session, username, token) is True
    # Invalidate session
    invalidate_session(session, username, token)
    # Session should now be invalid
    assert validate_session(session, username, token) is False
