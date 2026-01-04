from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..deps.db import get_db
from ..models import CartItem, Product, User
from ..schema import CartItem as CartItemSchema, CartItemCreate, CartItemUpdate
from ..routes.auth import get_current_user
from fastapi import Response


router = APIRouter(prefix="/api/cart", tags=["cart"])

@router.get("", response_model=List[CartItemSchema])
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = (
        db.query(CartItem)
        .join(Product, CartItem.product_id == Product.id)
        .filter(CartItem.user_id == current_user.id)
        .all()
    )
    return cart_items

@router.post("/add")
def add_to_cart(
    item: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add item to cart"""
    # Check if product exists
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if item already exists in cart
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == item.product_id,
        CartItem.size == item.size
    ).first()
    
    if existing_item:
        # Update quantity
        existing_item.quantity += item.quantity
        db.commit()
        db.refresh(existing_item)
        return {"message": "Cart updated successfully", "item": existing_item}
    else:
        # Create new cart item
        cart_item = CartItem(
            user_id=current_user.id,
            product_id=item.product_id,
            quantity=item.quantity,
            size=item.size
        )
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return {"message": "Item added to cart successfully", "item": cart_item}

@router.put("/{item_id}")
def update_cart_item(
    item_id: int,
    update_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update cart item quantity"""
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    if update_data.quantity <= 0:
        db.delete(cart_item)
    else:
        cart_item.quantity = update_data.quantity
    
    db.commit()
    return {"message": "Cart updated successfully"}

@router.delete("/{item_id}")
def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove item from cart"""
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart successfully"}

@router.options("/{path:path}")
def cart_preflight(path: str, response: Response):
    response.status_code = 200
    return


@router.delete("/clear")
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Clear all items from cart"""
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared successfully"}