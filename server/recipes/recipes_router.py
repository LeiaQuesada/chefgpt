import os
import json
import dotenv
import google.genai as genai
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from shared.database import get_session
from .recipes_db import (
    get_all_recipes,
    add_recipe,
    get_recipe_by_id,
    update_recipe,
)
from .recipes_schemas import RecipeCreate, RecipeOut, RecipeUpdate
from .recipes_generate_schemas import (
    GenerateRecipesResponse,
    GeneratedRecipe,
    GenerateRecipesRequest,
)
from shared.auth import require_auth
from authentication.auth_schemas import AuthenticatedUser

# Temporary test endpoint for hardcoded AI recipe generation
ai_test_router = APIRouter(prefix="/api/ai", tags=["ai"])
dotenv.load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))


@ai_test_router.get("/generate-test", response_model=GenerateRecipesResponse)
async def generate_recipes_test():
    ingredients = ["eggs", "rice", "broccoli", "chicken"]
    max_time = 30
    prompt = f"""
You are a meal planning assistant.\n\nUser has these ingredients: {', '.join(ingredients)}\nMaximum cooking total time per meal: {max_time} minutes\n\nGenerate 3 simple recipes they can make using only these ingredients, with cooking total time <= {max_time} minutes, where time will be in minutes.\nReturn JSON in this format:\n\nOnly return JSON text, and no other text.\n\n[\n    {{\n      \"name\": \"Recipe Name\",\n      \"ingredients\": [\"ingredient1\", \"ingredient2\"],\n      \"instructions\": [\"Step one\", \"Step two\"],\n      \"total_time\": 20\n    }}\n]\n"""
    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )
        print("[DEBUG] Gemini response object:", response)
        json_text = getattr(response, "text", None)
        print("[DEBUG] Gemini raw response:", json_text)
        if not json_text or not json_text.strip().startswith("["):
            raise ValueError(
                f"No valid JSON received from LLM.\nRaw response: {json_text}\nFull response: {response}"
            )
        try:
            recipes_data = json.loads(json_text)
        except Exception as parse_err:
            raise ValueError(
                f"Failed to parse JSON.\nRaw response: {json_text}\nFull response: {response}"
            ) from parse_err
        recipes = [GeneratedRecipe.model_validate(r) for r in recipes_data]
        return GenerateRecipesResponse(recipes=recipes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


recipes_router = APIRouter(prefix="/api/recipes", tags=["recipes"])

# AI router for /api/ai endpoints
ai_router = APIRouter(prefix="/api/ai", tags=["ai"])
dotenv.load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=GOOGLE_API_KEY)


dotenv.load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=GOOGLE_API_KEY)


# POST /api/generate: Generate recipes using Gemini API
@ai_router.post("/generate", response_model=GenerateRecipesResponse)
async def generate_recipes(request: GenerateRecipesRequest):
    # Build prompt from user input
    print(request.ingredients)
    print(request.max_time)
    ingredients_str = ", ".join(request.ingredients)

    prompt = f"""
You are a meal planning assistant.

User ingredients:
{ingredients_str}

Maximum total cooking time per recipe:
{request.max_time} minutes.

Generate exactly 3 recipes.

IMPORTANT:
- Use ONLY the provided ingredients
- total_time must be <= {request.max_time}
- Return ONLY valid JSON
- Do NOT include markdown
- Do NOT include explanation text

Return JSON in this EXACT format:

[
  {{
    "name": "Recipe name",
    "ingredients": ["ingredient1", "ingredient2"],
    "instructions": ["Step 1", "Step 2"],
    "total_time": 10
  }}
]
"""

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )

        raw_text = (response.text or "").strip()

        if not raw_text:
            raise ValueError("LLM returned empty response")

        # 🔒 SAFETY: strip markdown if Gemini adds it anyway
        if raw_text.startswith("```"):
            raw_text = raw_text.strip("`")
            raw_text = raw_text.replace("json", "").strip()

        try:
            recipes_data = json.loads(raw_text)
        except json.JSONDecodeError:
            raise ValueError(f"LLM did not return valid JSON:\n{raw_text}")

        recipes = [
            GeneratedRecipe.model_validate(recipe) for recipe in recipes_data
        ]

        return GenerateRecipesResponse(recipes=recipes)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


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
