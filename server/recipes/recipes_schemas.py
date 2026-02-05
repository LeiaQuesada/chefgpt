# pydantic models
from pydantic import Field
from typing import List, Optional
from shared.base_schema import BaseSchema


# help validate nested objects in recipes
class IngredientCreate(BaseSchema):
    name: str


class IngredientOut(BaseSchema):
    id: int
    name: str


# help validate nested objects in recipes
class InstructionCreate(BaseSchema):
    step_text: str
    step_number: int


class InstructionOut(BaseSchema):
    id: int
    step_text: str
    step_number: int


# when user adds a new recipe
class RecipeCreate(BaseSchema):
    title: str
    total_time: int = Field(..., gt=0)
    ingredients: List[IngredientCreate]
    instructions: List[InstructionCreate]


# when user updates an existing recipe
class RecipeUpdate(BaseSchema):
    title: Optional[str] = None
    image_url: Optional[str] = None
    total_time: Optional[int] = Field(None, gt=0)
    ingredients: Optional[List[IngredientCreate]] = None
    instructions: Optional[List[InstructionCreate]] = None


# returning recipe data back to client
class RecipeOut(BaseSchema):
    id: int
    user_id: int
    title: str
    image_url: Optional[str]
    total_time: int
    ingredients: List[IngredientOut]
    instructions: List[InstructionOut]


# RecipeCreate:
# example json when user sends a request to create a recipe in frontend
# {
#   "title": "Spaghetti Carbonara",
#   "total_time": 30,
#   "ingredients": [{"name": "Spaghetti"}, {"name": "Eggs"}],
#   "instructions": [{"step_text": "Boil spaghetti", "step_number": 1}]
# }

# RecipeOut:
# example json of what data frontend receives when fetching a recipe
# # {
#   "id": 12,
#   "user_id": 3,
#   "title": "Garlic Butter Shrimp Pasta",
#   "image_url": "https://images.example.com/shrimp-pasta.jpg",
#   "total_time": 25,
#   "ingredients": [
#     {
#       "id": 101,
#       "name": "Shrimp"
#     },
#     {
#       "id": 102,
#       "name": "Garlic"
#     },
#     {
#       "id": 103,
#       "name": "Butter"
#     },
#     {
#       "id": 104,
#       "name": "Pasta"
#     }
#   ],
#   "instructions": [
#     {
#       "id": 201,
#       "step_number": 1,
#       "step_text": "Boil pasta in salted water until al dente."
#     },
#     {
#       "id": 202,
#       "step_number": 2,
#       "step_text": "Sauté garlic in butter until fragrant."
#     },
#     {
#       "id": 203,
#       "step_number": 3,
#       "step_text": "Add shrimp and cook until pink."
#     },
#     {
#       "id": 204,
#       "step_number": 4,
#       "step_text": "Toss pasta with shrimp and sauce."
#     }
#   ]
# }
