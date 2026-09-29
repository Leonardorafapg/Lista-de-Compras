from collections import defaultdict
from datetime import date
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.exceptions import NotFoundError
from app.models.meal_plan import MealPlan
from app.models.product import Product
from app.models.recipe import RecipeIngredient
from app.models.shopping_list import ShoppingList, ShoppingListItem
from app.schemas.shopping_list import ShoppingListCreate, ShoppingListItemCreate, ShoppingListItemUpdate, ShoppingListUpdate


def _sum_ingredients_for_period(db: Session, start_date: date, end_date: date) -> dict[int, Decimal]:
    """Busca os MealPlans do período, soma as quantidades dos ingredientes por product_id."""
    meal_plans = db.scalars(select(MealPlan).where(MealPlan.date >= start_date, MealPlan.date <= end_date)).all()

    meal_plan_count_per_recipe: dict[int, int] = defaultdict(int)
    for meal_plan in meal_plans:
        meal_plan_count_per_recipe[meal_plan.recipe_id] += 1

    recipe_ids = list(meal_plan_count_per_recipe.keys())
    if not recipe_ids:
        return {}

    ingredients = db.scalars(select(RecipeIngredient).where(RecipeIngredient.recipe_id.in_(recipe_ids)))

    totals: dict[int, Decimal] = defaultdict(lambda: Decimal("0"))
    for ingredient in ingredients:
        occurrences = meal_plan_count_per_recipe[ingredient.recipe_id]
        totals[ingredient.product_id] += ingredient.quantity * occurrences

    return dict(totals)


def list_shopping_lists(db: Session) -> list[ShoppingList]:
    return db.scalars(select(ShoppingList).order_by(ShoppingList.start_date.desc())).all()


def get_shopping_list(db: Session, shopping_list_id: int) -> ShoppingList:
    shopping_list = db.get(
        ShoppingList,
        shopping_list_id,
        options=[joinedload(ShoppingList.items).joinedload(ShoppingListItem.product).joinedload(Product.category)],
    )
    if shopping_list is None:
        raise NotFoundError("Lista de compras não encontrada")
    return shopping_list


def generate_shopping_list(db: Session, data: ShoppingListCreate) -> ShoppingList:
    totals = _sum_ingredients_for_period(db, data.start_date, data.end_date)

    shopping_list = ShoppingList(name=data.name, start_date=data.start_date, end_date=data.end_date)
    db.add(shopping_list)
    db.flush()

    for product_id, quantity in totals.items():
        db.add(ShoppingListItem(shopping_list_id=shopping_list.id, product_id=product_id, quantity=quantity))

    db.commit()
    return get_shopping_list(db, shopping_list.id)


def regenerate_shopping_list(db: Session, shopping_list_id: int) -> ShoppingList:
    shopping_list = get_shopping_list(db, shopping_list_id)
    totals = _sum_ingredients_for_period(db, shopping_list.start_date, shopping_list.end_date)

    for item in list(shopping_list.items):
        db.delete(item)
    db.flush()

    for product_id, quantity in totals.items():
        db.add(ShoppingListItem(shopping_list_id=shopping_list.id, product_id=product_id, quantity=quantity))

    db.commit()
    return get_shopping_list(db, shopping_list_id)


def update_shopping_list(db: Session, shopping_list_id: int, data: ShoppingListUpdate) -> ShoppingList:
    shopping_list = get_shopping_list(db, shopping_list_id)
    shopping_list.name = data.name
    db.commit()
    return get_shopping_list(db, shopping_list_id)


def delete_shopping_list(db: Session, shopping_list_id: int) -> None:
    shopping_list = get_shopping_list(db, shopping_list_id)
    db.delete(shopping_list)
    db.commit()


def add_item(db: Session, shopping_list_id: int, data: ShoppingListItemCreate) -> ShoppingList:
    get_shopping_list(db, shopping_list_id)
    product = db.get(Product, data.product_id)
    if product is None:
        raise NotFoundError("Produto não encontrado")

    existing_item = db.scalar(
        select(ShoppingListItem).where(
            ShoppingListItem.shopping_list_id == shopping_list_id, ShoppingListItem.product_id == data.product_id
        )
    )
    if existing_item is not None:
        existing_item.quantity += data.quantity
    else:
        db.add(ShoppingListItem(shopping_list_id=shopping_list_id, product_id=data.product_id, quantity=data.quantity))

    db.commit()
    return get_shopping_list(db, shopping_list_id)


def update_item(db: Session, shopping_list_id: int, item_id: int, data: ShoppingListItemUpdate) -> ShoppingList:
    get_shopping_list(db, shopping_list_id)
    item = db.scalar(
        select(ShoppingListItem).where(
            ShoppingListItem.id == item_id, ShoppingListItem.shopping_list_id == shopping_list_id
        )
    )
    if item is None:
        raise NotFoundError("Item não encontrado")

    if data.quantity is not None:
        item.quantity = data.quantity
    if data.checked is not None:
        item.checked = data.checked

    db.commit()
    return get_shopping_list(db, shopping_list_id)


def remove_item(db: Session, shopping_list_id: int, item_id: int) -> ShoppingList:
    get_shopping_list(db, shopping_list_id)
    item = db.scalar(
        select(ShoppingListItem).where(
            ShoppingListItem.id == item_id, ShoppingListItem.shopping_list_id == shopping_list_id
        )
    )
    if item is None:
        raise NotFoundError("Item não encontrado")
    db.delete(item)
    db.commit()
    return get_shopping_list(db, shopping_list_id)
