from sqlalchemy import select
from sqlalchemy.orm import Session

from app.exceptions import ConflictError, NotFoundError
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryCreate, CategoryUpdate


def list_categories(db: Session) -> list[Category]:
    return db.scalars(select(Category).order_by(Category.name)).all()


def get_category(db: Session, category_id: int) -> Category:
    category = db.get(Category, category_id)
    if category is None:
        raise NotFoundError("Categoria não encontrada")
    return category


def create_category(db: Session, data: CategoryCreate) -> Category:
    existing = db.scalar(select(Category).where(Category.name == data.name))
    if existing is not None:
        raise ConflictError("Já existe uma categoria com esse nome")
    category = Category(name=data.name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, category_id: int, data: CategoryUpdate) -> Category:
    category = get_category(db, category_id)
    existing = db.scalar(select(Category).where(Category.name == data.name, Category.id != category_id))
    if existing is not None:
        raise ConflictError("Já existe uma categoria com esse nome")
    category.name = data.name
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int) -> None:
    category = get_category(db, category_id)
    product_count = db.scalar(select(Product.id).where(Product.category_id == category_id).limit(1))
    if product_count is not None:
        raise ConflictError("Não é possível excluir uma categoria que possui produtos associados")
    db.delete(category)
    db.commit()
