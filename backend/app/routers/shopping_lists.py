from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.shopping_list import (
    ShoppingListCreate,
    ShoppingListDetailRead,
    ShoppingListItemCreate,
    ShoppingListItemUpdate,
    ShoppingListRead,
    ShoppingListUpdate,
)
from app.services import shopping_list_service

router = APIRouter(prefix="/api/shopping-lists", tags=["shopping-lists"])


@router.get("", response_model=list[ShoppingListRead])
def list_shopping_lists(db: Session = Depends(get_db)):
    return shopping_list_service.list_shopping_lists(db)


@router.get("/{shopping_list_id}", response_model=ShoppingListDetailRead)
def get_shopping_list(shopping_list_id: int, db: Session = Depends(get_db)):
    return shopping_list_service.get_shopping_list(db, shopping_list_id)


@router.post("", response_model=ShoppingListDetailRead, status_code=status.HTTP_201_CREATED)
def generate_shopping_list(data: ShoppingListCreate, db: Session = Depends(get_db)):
    return shopping_list_service.generate_shopping_list(db, data)


@router.post("/{shopping_list_id}/regenerate", response_model=ShoppingListDetailRead)
def regenerate_shopping_list(shopping_list_id: int, db: Session = Depends(get_db)):
    return shopping_list_service.regenerate_shopping_list(db, shopping_list_id)


@router.put("/{shopping_list_id}", response_model=ShoppingListDetailRead)
def update_shopping_list(shopping_list_id: int, data: ShoppingListUpdate, db: Session = Depends(get_db)):
    return shopping_list_service.update_shopping_list(db, shopping_list_id, data)


@router.delete("/{shopping_list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shopping_list(shopping_list_id: int, db: Session = Depends(get_db)):
    shopping_list_service.delete_shopping_list(db, shopping_list_id)


@router.post("/{shopping_list_id}/items", response_model=ShoppingListDetailRead, status_code=status.HTTP_201_CREATED)
def add_item(shopping_list_id: int, data: ShoppingListItemCreate, db: Session = Depends(get_db)):
    return shopping_list_service.add_item(db, shopping_list_id, data)


@router.put("/{shopping_list_id}/items/{item_id}", response_model=ShoppingListDetailRead)
def update_item(shopping_list_id: int, item_id: int, data: ShoppingListItemUpdate, db: Session = Depends(get_db)):
    return shopping_list_service.update_item(db, shopping_list_id, item_id, data)


@router.delete("/{shopping_list_id}/items/{item_id}", response_model=ShoppingListDetailRead)
def remove_item(shopping_list_id: int, item_id: int, db: Session = Depends(get_db)):
    return shopping_list_service.remove_item(db, shopping_list_id, item_id)
