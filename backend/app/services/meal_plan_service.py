from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.exceptions import NotFoundError
from app.models.meal_plan import MealPlan
from app.models.recipe import Recipe
from app.schemas.meal_plan import MealPlanCreate, MealPlanUpdate


def list_meal_plans(db: Session, start_date: date | None = None, end_date: date | None = None) -> list[MealPlan]:
    query = select(MealPlan).options(joinedload(MealPlan.recipe)).order_by(MealPlan.date)
    if start_date is not None:
        query = query.where(MealPlan.date >= start_date)
    if end_date is not None:
        query = query.where(MealPlan.date <= end_date)
    return db.scalars(query).all()


def get_meal_plan(db: Session, meal_plan_id: int) -> MealPlan:
    meal_plan = db.get(MealPlan, meal_plan_id, options=[joinedload(MealPlan.recipe)])
    if meal_plan is None:
        raise NotFoundError("Planejamento não encontrado")
    return meal_plan


def create_meal_plan(db: Session, data: MealPlanCreate) -> MealPlan:
    recipe = db.get(Recipe, data.recipe_id)
    if recipe is None:
        raise NotFoundError("Receita não encontrada")
    meal_plan = MealPlan(date=data.date, meal_type=data.meal_type, recipe_id=data.recipe_id)
    db.add(meal_plan)
    db.commit()
    db.refresh(meal_plan)
    return get_meal_plan(db, meal_plan.id)


def update_meal_plan(db: Session, meal_plan_id: int, data: MealPlanUpdate) -> MealPlan:
    meal_plan = get_meal_plan(db, meal_plan_id)
    recipe = db.get(Recipe, data.recipe_id)
    if recipe is None:
        raise NotFoundError("Receita não encontrada")
    meal_plan.date = data.date
    meal_plan.meal_type = data.meal_type
    meal_plan.recipe_id = data.recipe_id
    db.commit()
    db.refresh(meal_plan)
    return get_meal_plan(db, meal_plan.id)


def delete_meal_plan(db: Session, meal_plan_id: int) -> None:
    meal_plan = get_meal_plan(db, meal_plan_id)
    db.delete(meal_plan)
    db.commit()
