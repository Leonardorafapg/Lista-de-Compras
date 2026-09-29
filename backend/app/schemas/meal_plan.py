from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models.meal_plan import MealType
from app.schemas.recipe import RecipeRead


class MealPlanBase(BaseModel):
    date: date
    meal_type: MealType
    recipe_id: int


class MealPlanCreate(MealPlanBase):
    pass


class MealPlanUpdate(MealPlanBase):
    pass


class MealPlanRead(MealPlanBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    recipe: RecipeRead
