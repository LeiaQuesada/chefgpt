import os
import dotenv
import google.genai as genai
import json

dotenv.load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=GOOGLE_API_KEY)


def generate_recipes_with_gemini(ingredients, max_time):
    ingredients_str = ", ".join(ingredients)
    prompt = f"""
You are a meal planning assistant.

User ingredients:
{ingredients_str}

Maximum total cooking time per recipe:
{max_time} minutes.

Generate exactly 3 recipes.

IMPORTANT:
- Use ONLY the provided ingredients
- total_time must be <= {max_time}
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
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
    )
    raw_text = (response.text or "").strip()
    if not raw_text:
        raise ValueError("LLM returned empty response")
    #  SAFETY: strip markdown if Gemini adds it anyway
    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        raw_text = raw_text.replace("json", "").strip()
    try:
        recipes_data = json.loads(raw_text)
    except json.JSONDecodeError:
        raise ValueError(f"LLM did not return valid JSON:\n{raw_text}")
    return recipes_data
