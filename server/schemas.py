# pydantic models
from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime


# input for creating a user
class UserCreate(BaseModel):
    username: str
    password: str
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# input for updating a user profile
class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# output for user data
class UserOut(BaseModel):
    id: int
    username: str
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IngredientCreate(BaseModel):
    name: str


class IngredientOut(BaseModel):
    id: int
    recipe_id: int
    name: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InstructionCreate(BaseModel):
    step_text: str
    step_number: int


class InstructionOut(BaseModel):
    id: int
    recipe_id: int
    step_text: str
    step_number: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# when user adds a new recipe
class RecipeCreate(BaseModel):
    title: str
    total_time: int = Field(..., gt=0)
    ingredients: List[IngredientCreate]
    instructions: List[InstructionCreate]

    model_config = ConfigDict(from_attributes=True)


# when user updates an existing recipe
class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    total_time: Optional[int] = Field(None, gt=0)
    ingredients: Optional[List[IngredientCreate]] = None
    instructions: Optional[List[InstructionCreate]] = None

    model_config = ConfigDict(from_attributes=True)


# returning recipe data back to client
class RecipeOut(BaseModel):
    id: int
    user_id: int
    title: str
    image_url: Optional[str]
    total_time: int
    ingredients: List[IngredientOut]
    instructions: List[InstructionOut]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# example json when user sends a request to create a recipe in frontend
# {
#   "title": "Spaghetti Carbonara",
#   "total_time": 30,
#   "ingredients": [{"name": "Spaghetti"}, {"name": "Eggs"}],
#   "instructions": [{"step_text": "Boil spaghetti", "step_number": 1}]
# }
