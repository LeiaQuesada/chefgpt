import google.genai as genai
import dotenv
import os
import json
from rich import print
from pydantic import BaseModel


class Recipe(BaseModel):
    name: str
    ingredients: list[str]
    instructions: list[str]
    total_time: int


dotenv.load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

try:
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="""
        You are a meal planning assistant.

        User has these ingredients: eggs, rice, broccoli, chicken
        Maximum cooking total time per meal: 30 minutes
        Dietary preference: high protein

        Generate 3 simple recipes they can make using only these ingredients, with cooking total time <= 30 minutes, where time will be in minutes.
        Return JSON in this format:

        Only return JSON text, and no other text.

        [
            {
              "name": "Recipe Name",
              "ingredients": ["ingredient1", "ingredient2"],
              "instructions": ["Step one", "Step two"],
              "total_time": 20
            }
        ]
        """,
    )

    json_text = response.text

    if not json_text:
        raise ValueError("No text received from LLM")

    recipes = json.loads(json_text)

    for recipe_dict in recipes:
        recipe = Recipe.model_validate(recipe_dict)
        print(f"\nRecipe: {recipe.name}")
        print(f"Total time: {recipe.total_time} minutes")
        print("Ingredients:")
        for ingredient in recipe.ingredients:
            print(f"- {ingredient}")
        print("Instructions:")
        for i, instruction in enumerate(recipe.instructions, 1):
            print(f"{i}. {instruction}")

except Exception as e:
    print(e)
