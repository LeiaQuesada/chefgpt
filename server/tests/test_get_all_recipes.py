import pytest
from shared.database import get_session
from recipes.recipes_db import get_all_recipes
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from shared.base_model import Base

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


def test_get_all_recipes(session):
    recipes = get_all_recipes(session)
    print(f"Found {len(recipes)} recipes.")
    for recipe in recipes:
        print(recipe)
