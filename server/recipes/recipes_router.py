from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from shared.database import get_session
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
