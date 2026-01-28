from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from .recipes_schemas import (
    RecipeOut,
    RecipeCreate,
    IngredientOut,
    InstructionOut,
)
from .recipes_models import DBRecipe


def get_all_recipes(session: Session) -> list[RecipeOut]:
    stmt = select(DBRecipe).options(
        joinedload(DBRecipe.ingredients), joinedload(DBRecipe.instructions)
    )
    recipe_objects = session.scalars(stmt).unique().all()
    # Without .unique(): You get duplicate parent objects, which causes an error.
    # With .unique(): SQLAlchemy ensures each parent (recipe) is unique in the result, so your code works as expected.
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


def get_recipe_by_id(session: Session, recipe_id: int) -> RecipeOut | None:
    stmt = (
        select(DBRecipe)
        .where(DBRecipe.id == recipe_id)
        .options(
            joinedload(DBRecipe.ingredients), joinedload(DBRecipe.instructions)
        )
    )
    recipe = session.scalars(stmt).unique().first()
    if not recipe:
        return None
    ingredients = [
        IngredientOut(id=ingredient.id, name=ingredient.name)
        for ingredient in recipe.ingredients
    ]

    # We sort instructions by step_number to ensure they are returned in the correct order (step 1, step 2, ...).
    # The database does not guarantee order of related objects unless explicitly sorted.
    # The key argument is required to tell sorted() to use the step_number attribute of each instruction.
    def get_step_number(instruction):
        return instruction.step_number

    instructions = [
        InstructionOut(
            id=instruction.id,
            step_text=instruction.step_text,
            step_number=instruction.step_number,
        )
        for instruction in sorted(recipe.instructions, key=get_step_number)
    ]
    return RecipeOut(
        id=recipe.id,
        user_id=recipe.user_id,
        title=recipe.title,
        image_url=recipe.image_url,
        total_time=recipe.total_time,
        ingredients=ingredients,
        instructions=instructions,
    )


def update_recipe(
    session: Session, recipe_id: int, update_data: dict
) -> RecipeOut | None:
    from .recipes_models import DBIngredient, DBInstruction

    recipe = session.get(DBRecipe, recipe_id)
    if not recipe:
        return None
    # Update simple fields
    if "title" in update_data and update_data["title"] is not None:
        recipe.title = update_data["title"]
    if "image_url" in update_data and update_data["image_url"] is not None:
        recipe.image_url = update_data["image_url"]
    if "total_time" in update_data and update_data["total_time"] is not None:
        recipe.total_time = update_data["total_time"]

    # Update ingredients if provided
    if "ingredients" in update_data and update_data["ingredients"] is not None:
        # Remove old ingredients
        recipe.ingredients.clear()
        session.flush()
        # Add new ingredients (expecting list of dicts with 'name')
        for ingredient in update_data["ingredients"]:
            name = (
                ingredient["name"]
                if isinstance(ingredient, dict) and "name" in ingredient
                else str(ingredient)
            )
            new_ingredient = DBIngredient(recipe_id=recipe.id, name=name)
            session.add(new_ingredient)

    # Update instructions if provided
    if (
        "instructions" in update_data
        and update_data["instructions"] is not None
    ):
        # Remove old instructions
        recipe.instructions.clear()
        session.flush()
        # Add new instructions (expecting list of dicts with 'step_text' and 'step_number')
        for instruction in update_data["instructions"]:
            if isinstance(instruction, dict):
                step_text = instruction.get("step_text", "")
                step_number = instruction.get("step_number", 1)
            else:
                step_text = str(instruction)
                step_number = 1
            new_instruction = DBInstruction(
                recipe_id=recipe.id,
                step_text=step_text,
                step_number=step_number,
            )
            session.add(new_instruction)

    session.commit()
    session.refresh(recipe)
    return get_recipe_by_id(session, recipe_id)
