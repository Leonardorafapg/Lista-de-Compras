from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.recipe import (
    RecipeCreate,
    RecipeDetailRead,
    RecipeIngredientCreate,
    RecipeIngredientUpdate,
    RecipeRead,
    RecipeUpdate,
)
from app.services import recipe_service

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


@router.get("", response_model=list[RecipeRead])
def list_recipes(db: Session = Depends(get_db)):
    return recipe_service.list_recipes(db)


@router.get("/{recipe_id}", response_model=RecipeDetailRead)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    return recipe_service.get_recipe(db, recipe_id)


@router.post("", response_model=RecipeDetailRead, status_code=status.HTTP_201_CREATED)
def create_recipe(data: RecipeCreate, db: Session = Depends(get_db)):
    return recipe_service.create_recipe(db, data)


@router.put("/{recipe_id}", response_model=RecipeDetailRead)
def update_recipe(recipe_id: int, data: RecipeUpdate, db: Session = Depends(get_db)):
    return recipe_service.update_recipe(db, recipe_id, data)


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe_service.delete_recipe(db, recipe_id)


@router.post("/{recipe_id}/ingredients", response_model=RecipeDetailRead, status_code=status.HTTP_201_CREATED)
def add_ingredient(recipe_id: int, data: RecipeIngredientCreate, db: Session = Depends(get_db)):
    return recipe_service.add_ingredient(db, recipe_id, data)


@router.put("/{recipe_id}/ingredients/{ingredient_id}", response_model=RecipeDetailRead)
def update_ingredient(recipe_id: int, ingredient_id: int, data: RecipeIngredientUpdate, db: Session = Depends(get_db)):
    return recipe_service.update_ingredient(db, recipe_id, ingredient_id, data)


@router.delete("/{recipe_id}/ingredients/{ingredient_id}", response_model=RecipeDetailRead)
def remove_ingredient(recipe_id: int, ingredient_id: int, db: Session = Depends(get_db)):
    return recipe_service.remove_ingredient(db, recipe_id, ingredient_id)
