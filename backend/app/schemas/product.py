from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.category import CategoryRead


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    category_id: int
    unit: str = Field(min_length=1, max_length=30)
    active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    category: CategoryRead
