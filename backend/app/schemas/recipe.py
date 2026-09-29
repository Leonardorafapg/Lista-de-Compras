from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from app.schemas.product import ProductRead


class RecipeIngredientBase(BaseModel):
    product_id: int
    quantity: Decimal = Field(gt=0, decimal_places=3)


class RecipeIngredientCreate(RecipeIngredientBase):
    pass


class RecipeIngredientUpdate(BaseModel):
    quantity: Decimal = Field(gt=0, decimal_places=3)


class RecipeIngredientRead(RecipeIngredientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recipe_id: int
    product: ProductRead

    @field_serializer("quantity")
    def serialize_quantity(self, value: Decimal) -> float:
        return float(value)


class RecipeBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    description: str | None = Field(default=None, max_length=1000)


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(RecipeBase):
    pass


class RecipeRead(RecipeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class RecipeDetailRead(RecipeRead):
    ingredients: list[RecipeIngredientRead] = []
