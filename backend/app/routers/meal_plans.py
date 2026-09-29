from datetime import date

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.meal_plan import MealPlanCreate, MealPlanRead, MealPlanUpdate
from app.services import meal_plan_service

router = APIRouter(prefix="/api/meal-plans", tags=["meal-plans"])


@router.get("", response_model=list[MealPlanRead])
def list_meal_plans(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return meal_plan_service.list_meal_plans(db, start_date=start_date, end_date=end_date)


@router.post("", response_model=MealPlanRead, status_code=status.HTTP_201_CREATED)
def create_meal_plan(data: MealPlanCreate, db: Session = Depends(get_db)):
    return meal_plan_service.create_meal_plan(db, data)


@router.put("/{meal_plan_id}", response_model=MealPlanRead)
def update_meal_plan(meal_plan_id: int, data: MealPlanUpdate, db: Session = Depends(get_db)):
    return meal_plan_service.update_meal_plan(db, meal_plan_id, data)


@router.delete("/{meal_plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal_plan(meal_plan_id: int, db: Session = Depends(get_db)):
    meal_plan_service.delete_meal_plan(db, meal_plan_id)
