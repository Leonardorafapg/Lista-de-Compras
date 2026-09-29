from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from app.schemas.product import ProductRead


class ShoppingListItemCreate(BaseModel):
    product_id: int
    quantity: Decimal = Field(gt=0, decimal_places=3)


class ShoppingListItemUpdate(BaseModel):
    quantity: Decimal | None = Field(default=None, gt=0, decimal_places=3)
    checked: bool | None = None


class ShoppingListItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    shopping_list_id: int
    product_id: int
    quantity: Decimal
    checked: bool
    created_at: datetime
    updated_at: datetime
    product: ProductRead

    @field_serializer("quantity")
    def serialize_quantity(self, value: Decimal) -> float:
        return float(value)


class ShoppingListCreate(BaseModel):
    name: str | None = Field(default=None, max_length=150)
    start_date: date
    end_date: date


class ShoppingListUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=150)


class ShoppingListRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str | None
    start_date: date
    end_date: date
    created_at: datetime
    updated_at: datetime


class ShoppingListDetailRead(ShoppingListRead):
    items: list[ShoppingListItemRead] = []
