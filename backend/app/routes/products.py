from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..deps.db import get_db
from ..models import Product

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("")
def list_products_no_slash(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_active == True).all()


@router.get("/")
def list_products(db: Session = Depends(get_db)):
    """Get all active products."""
    try:
        return db.query(Product).filter(Product.is_active == True).all()
    except Exception as e:
        print(f"Error in list_products: {e}")
        raise


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get single product by ID."""
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except Exception as e:
        print(f"Error in get_product: {e}")
        raise


