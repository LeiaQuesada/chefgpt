from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from shared.database import get_session
from .recipes_db import get_all_recipes, add_recipe, get_recipe_by_id
from .recipes_db import get_all_recipes, add_recipe
from .recipes_schemas import RecipeCreate, RecipeOut
from shared.auth import require_auth
from authentication.auth_schemas import AuthenticatedUser

recipes_router = APIRouter(prefix="/api/recipes", tags=["recipes"])


@recipes_router.get("")
def endpoint_get_all_recipes(session: Session = Depends(get_session)):
    return get_all_recipes(session)


@recipes_router.post("")
async def endpoint_new_recipe(
    recipe: RecipeCreate,
    session: Session = Depends(get_session),
    auth_user: AuthenticatedUser = Depends(require_auth),
) -> RecipeOut:
    return add_recipe(session, recipe, auth_user.user_id)

    # TODO: Decision discussion:
    # Using response_model in FastAPI is better than just using a type hint (-> RecipeOut) because:
    # - response_model automatically serializes and validates the output to match the Pydantic model, ensuring the response is always in the correct format.
    # - It filters out any extra fields not defined in the model, improving security and consistency.
    # - It generates accurate OpenAPI (Swagger) docs for your API, making it easier for frontend and other consumers to understand your API.
    # Type hints (-> RecipeOut) are helpful for editor autocompletion and static analysis, but do not enforce response validation or affect the OpenAPI docs.
    # Best practice: Use both response_model and type hints together for clarity, validation, and documentation.
@recipes_router.get("/{recipe_id}", response_model=RecipeOut)
def endpoint_get_recipe_by_id(
    recipe_id: int, session: Session = Depends(get_session)
) -> RecipeOut:
    recipe = get_recipe_by_id(session, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe
