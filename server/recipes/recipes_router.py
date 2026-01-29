# import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from shared.database import get_session
from .recipes_db import (
    get_all_recipes,
    add_recipe,
    get_recipe_by_id,
    update_recipe,
    delete_recipe,
)
from .recipes_schemas import RecipeCreate, RecipeOut, RecipeUpdate
from .ai_schemas import (
    GenerateRecipesResponse,
    GeneratedRecipe,
    GenerateRecipesRequest,
)
from shared.auth import require_auth
from authentication.auth_schemas import AuthenticatedUser

from recipes.ai_api import generate_recipes_with_gemini


recipes_router = APIRouter(prefix="/api/recipes", tags=["recipes"])

# AI router for AI endpoints
ai_router = APIRouter(prefix="/api", tags=["ai"])


# POST /api/generate: Generate recipes using Gemini API
@ai_router.post("/generate", response_model=GenerateRecipesResponse)
async def endpoint_generate_recipes(request: GenerateRecipesRequest):
    print(request.ingredients)
    print(request.max_time)
    try:
        recipes_data = generate_recipes_with_gemini(
            request.ingredients, request.max_time
        )
        recipes = [
            GeneratedRecipe.model_validate(recipe) for recipe in recipes_data
        ]
        return GenerateRecipesResponse(recipes=recipes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@recipes_router.get("")
def endpoint_get_all_recipes(session: Session = Depends(get_session)):
    return get_all_recipes(session)


# Save recipe from AI results
@recipes_router.post("", response_model=RecipeOut)
async def endpoint_new_recipe(
    recipe: RecipeCreate,
    session: Session = Depends(get_session),
    auth_user: AuthenticatedUser = Depends(require_auth),
) -> RecipeOut:
    return add_recipe(session, recipe, auth_user.user_id)

    # TODO: Decision discussion:
    # Using response_model in FastAPI is better than just using a type hint
    # (-> RecipeOut) because response_model automatically serializes and
    # validates the output to match the Pydantic model. This ensures the
    # response is always in the correct format.
    # It filters out any extra fields not defined in the model, improving
    # security and consistency. It generates accurate OpenAPI (Swagger) docs
    # for your API, making it easier for frontend and other consumers to
    # understand your API.
    # Type hints (-> RecipeOut) are helpful for editor autocompletion and
    # static analysis, but do not enforce response validation or affect the
    # OpenAPI docs.
    # Best practice: Use both response_model and type hints together for
    # clarity, validation, and documentation.


@recipes_router.get("/{recipe_id}", response_model=RecipeOut)
def endpoint_get_recipe_by_id(
    recipe_id: int,
    session: Session = Depends(get_session),
    auth_user: AuthenticatedUser = Depends(require_auth),
) -> RecipeOut:
    recipe = get_recipe_by_id(session, recipe_id, auth_user.user_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


# Update a recipe by ID
@recipes_router.put("/{recipe_id}", response_model=RecipeOut)
async def endpoint_update_recipe(
    recipe_id: int,
    update: RecipeUpdate,
    session: Session = Depends(get_session),
    auth_user: AuthenticatedUser = Depends(require_auth),
) -> RecipeOut:
    # Convert Pydantic model to dict, skipping unset fields
    update_data = update.model_dump(exclude_unset=True)
    print("[DEBUG] update_data:", update_data)
    try:
        # update_recipe expects only 3 arguments: session, recipe_id,
        # update_data
        updated_recipe = update_recipe(
            session, recipe_id, update_data, auth_user.user_id
        )
        if not updated_recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return updated_recipe
    except Exception as e:
        import traceback

        print("[ERROR] Exception in update_recipe endpoint:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# Delete a recipe by ID
@recipes_router.delete("/{recipe_id}")
async def endpoint_delete_recipe_by_id(
    recipe_id: int,
    session: Session = Depends(get_session),
    auth_user: AuthenticatedUser = Depends(require_auth),
):
    recipe = get_recipe_by_id(session, recipe_id, auth_user.user_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    try:

        delete_recipe(session, recipe_id, auth_user.user_id)
        return {"detail": "Recipe deleted successfully"}
    except Exception as e:
        import traceback

        print("[ERROR] Exception in delete_recipe endpoint:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
