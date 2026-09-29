from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.exceptions import ConflictError, NotFoundError
from app.models.product import Product
from app.models.recipe import RecipeIngredient
from app.models.shopping_list import ShoppingListItem
from app.schemas.product import ProductCreate, ProductUpdate


def list_products(db: Session, search: str | None = None, category_id: int | None = None) -> list[Product]:
    query = select(Product).options(joinedload(Product.category)).order_by(Product.name)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    if category_id is not None:
        query = query.where(Product.category_id == category_id)
    return db.scalars(query).all()


def get_product(db: Session, product_id: int) -> Product:
    product = db.get(Product, product_id, options=[joinedload(Product.category)])
    if product is None:
        raise NotFoundError("Produto não encontrado")
    return product


def create_product(db: Session, data: ProductCreate) -> Product:
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return get_product(db, product.id)


def update_product(db: Session, product_id: int, data: ProductUpdate) -> Product:
    product = get_product(db, product_id)
    for field, value in data.model_dump().items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return get_product(db, product.id)


def delete_product(db: Session, product_id: int) -> None:
    product = get_product(db, product_id)
    used_in_recipe = db.scalar(select(RecipeIngredient.id).where(RecipeIngredient.product_id == product_id).limit(1))
    if used_in_recipe is not None:
        raise ConflictError("Não é possível excluir um produto utilizado em receitas")
    used_in_list = db.scalar(select(ShoppingListItem.id).where(ShoppingListItem.product_id == product_id).limit(1))
    if used_in_list is not None:
        raise ConflictError("Não é possível excluir um produto utilizado em listas de compras")
    db.delete(product)
    db.commit()
