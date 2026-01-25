from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from .recipes_schemas import RecipeOut, RecipeCreate
from .recipes_models import DBRecipe
from schemas import IngredientOut, InstructionOut


# TODO use this file to make database requests
# some examples: get_recipe_by_id,
#     get_all_recipes


def get_all_recipes(session: Session) -> list[RecipeOut]:
    stmt = select(DBRecipe).options(
        joinedload(DBRecipe.ingredients), joinedload(DBRecipe.instructions)
    )
    recipe_objects = session.scalars(stmt).all()
    recipes: list[RecipeOut] = []
    for recipe in recipe_objects:
        # Validate and construct each property according to RecipeOut schema
        ingredients = [
            IngredientOut(id=ingredient.id, name=ingredient.name)
            for ingredient in recipe.ingredients
        ]
        instructions = [
            InstructionOut(
                id=instruction.id,
                step_text=instruction.step_text,
                step_number=instruction.step_number,
            )
            for instruction in recipe.instructions
        ]
        result = RecipeOut(
            id=recipe.id,  # int
            user_id=recipe.user_id,  # int
            title=recipe.title,  # str
            image_url=recipe.image_url,  # Optional[str]
            total_time=recipe.total_time,  # int
            ingredients=ingredients,  # List[IngredientOut]
            instructions=instructions,  # List[InstructionOut]
        )
        recipes.append(result)
    return recipes


def add_recipe(
    session: Session, recipe: RecipeCreate, user_id: int
) -> RecipeOut:
    from .recipes_models import DBIngredient, DBInstruction

    # Create the recipe (no id, SQLAlchemy will generate it)
    recipe_model = DBRecipe(
        user_id=user_id,
        title=recipe.title,
        image_url=None,  # or set from recipe if available
        total_time=recipe.total_time,
    )
    session.add(recipe_model)
    session.commit()
    session.refresh(recipe_model)

    # Add ingredients
    db_ingredients = []
    for ingredient in recipe.ingredients:
        db_ingredient = DBIngredient(
            recipe_id=recipe_model.id, name=ingredient.name
        )
        session.add(db_ingredient)
        db_ingredients.append(db_ingredient)

    # Add instructions
    db_instructions = []
    for instruction in recipe.instructions:
        db_instruction = DBInstruction(
            recipe_id=recipe_model.id,
            step_text=instruction.step_text,
            step_number=instruction.step_number,
        )
        session.add(db_instruction)
        db_instructions.append(db_instruction)

    session.commit()

    # Refresh to get ids
    session.refresh(recipe_model)
    for db_ingredient in db_ingredients:
        session.refresh(db_ingredient)
    for db_instruction in db_instructions:
        session.refresh(db_instruction)

    # Build output lists
    ingredients_out = [
        IngredientOut(id=ing.id, name=ing.name) for ing in db_ingredients
    ]
    instructions_out = [
        InstructionOut(
            id=inst.id, step_text=inst.step_text, step_number=inst.step_number
        )
        for inst in db_instructions
    ]

    return RecipeOut(
        id=recipe_model.id,
        user_id=recipe_model.user_id,
        title=recipe_model.title,
        image_url=recipe_model.image_url,
        total_time=recipe_model.total_time,
        ingredients=ingredients_out,
        instructions=instructions_out,
    )
