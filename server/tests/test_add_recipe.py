import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from recipes.recipes_db import add_recipe
from recipes.recipes_schemas import RecipeCreate
from recipes.recipes_schemas import IngredientCreate, InstructionCreate
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


# Replace with a valid user_id from your users table
USER_ID = 1


def test_recipe_create(session):
    recipe = RecipeCreate(
        title="Test Recipe",
        total_time=30,
        ingredients=[
            IngredientCreate(name="Eggs"),
            IngredientCreate(name="Flour"),
        ],
        instructions=[
            InstructionCreate(step_text="Mix ingredients", step_number=1),
            InstructionCreate(step_text="Bake for 20 minutes", step_number=2),
        ],
    )
    result = add_recipe(session, recipe, user_id=USER_ID)
    assert result.title == "Test Recipe"
