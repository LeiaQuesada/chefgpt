from shared.database import get_session
from recipes.recipes_db import get_all_recipes


def test_get_all_recipes():
    with next(get_session()) as session:
        recipes = get_all_recipes(session)
        print(f"Found {len(recipes)} recipes.")
        for recipe in recipes:
            print(recipe)


if __name__ == "__main__":
    test_get_all_recipes()
