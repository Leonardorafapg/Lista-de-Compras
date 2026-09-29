from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.exceptions import ConflictError, NotFoundError
from app.models.meal_plan import MealPlan
from app.models.product import Product
from app.models.recipe import Recipe, RecipeIngredient
from app.schemas.recipe import RecipeCreate, RecipeIngredientCreate, RecipeIngredientUpdate, RecipeUpdate


def list_recipes(db: Session) -> list[Recipe]:
    return db.scalars(select(Recipe).order_by(Recipe.name)).all()


def get_recipe(db: Session, recipe_id: int) -> Recipe:
    recipe = db.get(
        Recipe,
        recipe_id,
        options=[joinedload(Recipe.ingredients).joinedload(RecipeIngredient.product).joinedload(Product.category)],
    )
    if recipe is None:
        raise NotFoundError("Receita não encontrada")
    return recipe


def create_recipe(db: Session, data: RecipeCreate) -> Recipe:
    recipe = Recipe(name=data.name, description=data.description)
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return get_recipe(db, recipe.id)


def update_recipe(db: Session, recipe_id: int, data: RecipeUpdate) -> Recipe:
    recipe = get_recipe(db, recipe_id)
    recipe.name = data.name
    recipe.description = data.description
    db.commit()
    db.refresh(recipe)
    return get_recipe(db, recipe.id)


def delete_recipe(db: Session, recipe_id: int) -> None:
    recipe = get_recipe(db, recipe_id)
    used_in_plan = db.scalar(select(MealPlan.id).where(MealPlan.recipe_id == recipe_id).limit(1))
    if used_in_plan is not None:
        raise ConflictError("Não é possível excluir uma receita associada a planejamentos no calendário")
    db.delete(recipe)
    db.commit()


def add_ingredient(db: Session, recipe_id: int, data: RecipeIngredientCreate) -> Recipe:
    get_recipe(db, recipe_id)
    product = db.get(Product, data.product_id)
    if product is None:
        raise NotFoundError("Produto não encontrado")
    existing = db.scalar(
        select(RecipeIngredient).where(
            RecipeIngredient.recipe_id == recipe_id, RecipeIngredient.product_id == data.product_id
        )
    )
    if existing is not None:
        raise ConflictError("Este produto já é um ingrediente desta receita")
    ingredient = RecipeIngredient(recipe_id=recipe_id, product_id=data.product_id, quantity=data.quantity)
    db.add(ingredient)
    db.commit()
    return get_recipe(db, recipe_id)


def update_ingredient(db: Session, recipe_id: int, ingredient_id: int, data: RecipeIngredientUpdate) -> Recipe:
    get_recipe(db, recipe_id)
    ingredient = db.scalar(
        select(RecipeIngredient).where(RecipeIngredient.id == ingredient_id, RecipeIngredient.recipe_id == recipe_id)
    )
    if ingredient is None:
        raise NotFoundError("Ingrediente não encontrado")
    ingredient.quantity = data.quantity
    db.commit()
    return get_recipe(db, recipe_id)


def remove_ingredient(db: Session, recipe_id: int, ingredient_id: int) -> Recipe:
    get_recipe(db, recipe_id)
    ingredient = db.scalar(
        select(RecipeIngredient).where(RecipeIngredient.id == ingredient_id, RecipeIngredient.recipe_id == recipe_id)
    )
    if ingredient is None:
        raise NotFoundError("Ingrediente não encontrado")
    db.delete(ingredient)
    db.commit()
    return get_recipe(db, recipe_id)
