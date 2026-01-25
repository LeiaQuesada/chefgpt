from datetime import datetime
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from shared.base_model import Base


from authentication.auth_models import DBUser

# (display all recipes for a user on frontend)
# not a new column. it tells SQLAlchemy this is a Python attribute that links
# this user to all their recipes.
# Creates a Python list of recipes for this user.
# list of DBRecipe objects associated with this user
# Allows you to access all recipes for a user via user.recipes
# back_populates="user" links it to DBRecipe.user so SQLAlchemy
# knows they are connected.


class DBRecipe(Base):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False
    )
    title: Mapped[str] = mapped_column(nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(nullable=True)
    total_time: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=datetime.now
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=datetime.now, onupdate=datetime.now
    )

    user: Mapped["DBUser"] = relationship(back_populates="recipes")
    ingredients: Mapped[list["DBIngredient"]] = relationship(
        back_populates="recipe"
    )
    instructions: Mapped[list["DBInstruction"]] = relationship(
        back_populates="recipe"
    )


# user → gives access to the recipe’s user via recipe.user (Show the username
# who created the recipe) ingredients → list of all ingredients for this
# recipe via recipe.ingredients (Display ingredients in the recipe detail page)

# instructions → list of all instructions for this recipe via recipe.
# instructions (Display instructions in the recipe detail page)


class DBIngredient(Base):
    __tablename__ = "ingredients"
    id: Mapped[int] = mapped_column(primary_key=True)
    recipe_id: Mapped[int] = mapped_column(
        ForeignKey("recipes.id"), nullable=False
    )
    name: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=datetime.now
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=datetime.now, onupdate=datetime.now
    )
    recipe = relationship("DBRecipe", back_populates="ingredients")


# Lets you access the DBRecipe object that the ingredient belongs to
# via ingredient.recipe
# (display recipe title for an ingredient maybe if you want to find
# recipes that use eggs)
# back_populates="ingredients" links it to DBRecipe.ingredients so
# SQLAlchemy knows they are connected.


class DBInstruction(Base):
    __tablename__ = "instructions"
    id: Mapped[int] = mapped_column(primary_key=True)
    recipe_id: Mapped[int] = mapped_column(
        ForeignKey("recipes.id"), nullable=False
    )
    step_text: Mapped[str] = mapped_column(nullable=False)
    step_number: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=datetime.now
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=datetime.now, onupdate=datetime.now
    )
    recipe = relationship("DBRecipe", back_populates="instructions")


# lets you access the DBRecipe object that the instruction belongs to
# via instruction.recipe maybe for if youre editing or
# deleting a single instruction and returning recipe info to frontend.
# back_populates links it to DBRecipe.instructions so
# SQLAlchemy knows they are connected.
