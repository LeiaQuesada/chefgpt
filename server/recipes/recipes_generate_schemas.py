from pydantic import BaseModel
from typing import List


class GenerateRecipesRequest(BaseModel):
    ingredients: List[str]
    max_time: int


class GeneratedRecipe(BaseModel):
    name: str
    ingredients: List[str]
    instructions: List[str]
    total_time: int


class GenerateRecipesResponse(BaseModel):
    recipes: List[GeneratedRecipe]
