import enum

from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Integer, func
from sqlalchemy.orm import relationship

from app.database import Base


class MealType(str, enum.Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    OTHER = "other"


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)
    meal_type = Column(
        Enum(MealType, name="meal_type", values_callable=lambda enum_cls: [member.value for member in enum_cls]),
        nullable=False,
    )
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="RESTRICT"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    recipe = relationship("Recipe")
