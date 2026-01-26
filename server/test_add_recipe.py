from recipes.recipes_db import add_recipe
from recipes.recipes_schemas import RecipeCreate
from schemas import IngredientCreate, InstructionCreate
from shared.database import SessionLocal

# Replace with a valid user_id from your users table
USER_ID = 1


def main():
    session = SessionLocal()
    try:
        recipe = RecipeCreate(
            title="Test Recipe",
            total_time=30,
            ingredients=[
                IngredientCreate(name="Eggs"),
                IngredientCreate(name="Flour"),
            ],
            instructions=[
                InstructionCreate(step_text="Mix ingredients", step_number=1),
                InstructionCreate(
                    step_text="Bake for 20 minutes", step_number=2
                ),
            ],
        )
        result = add_recipe(session, recipe, user_id=USER_ID)
        print("Recipe created:", result)
    except Exception as e:
        print("Error:", e)
    finally:
        session.close()


if __name__ == "__main__":
    main()
