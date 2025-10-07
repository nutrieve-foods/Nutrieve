from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..deps.db import get_db
from ..models import Address, User, Order, OrderItem, CartItem, Product
from ..schema import AddressCreate, Address as AddressSchema, OrderCreate, Order as OrderSchema
from .auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("/addresses", response_model=AddressSchema)
def create_address(
    address_data: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new address for the current user"""
    try:
        # If this is set as default, unset other default addresses
        if address_data.is_default:
            db.query(Address).filter(
                Address.user_id == current_user.id,
                Address.is_default == True
            ).update({"is_default": False})
        
        # Create new address
        address = Address(
            user_id=current_user.id,
            **address_data.dict()
        )
        db.add(address)
        db.commit()
        db.refresh(address)
        
        return address
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create address: {str(e)}")

@router.get("/addresses", response_model=List[AddressSchema])
def get_addresses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all addresses for the current user"""
    addresses = db.query(Address).filter(Address.user_id == current_user.id).all()
    return addresses

@router.post("/create", response_model=OrderSchema)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create order from cart items"""
    try:
        # Get cart items
        cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
        
        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        # Calculate total
        total_amount = 0
        for item in cart_items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                # Calculate price based on size
                multipliers = {"200gm": 0.2, "500gm": 0.5, "1kg": 1.0}
                price = product.base_price * multipliers.get(item.size, 1.0)
                total_amount += price * item.quantity
        
        # Add GST (18%)
        total_amount = total_amount * 1.18
        
        # Create order
        order = Order(
            user_id=current_user.id,
            address_id=order_data.address_id,
            total_amount=total_amount,
            status="pending",
            payment_status="pending"
        )
        db.add(order)
        db.flush()  # Get order ID
        
        # Create order items
        for item in cart_items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                multipliers = {"200gm": 0.2, "500gm": 0.5, "1kg": 1.0}
                price = product.base_price * multipliers.get(item.size, 1.0)
                
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    size=item.size,
                    price=price
                )
                db.add(order_item)
        
        # Clear cart
        db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
        
        db.commit()
        db.refresh(order)
        
        return order
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

@router.get("", response_model=List[OrderSchema])
def get_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all orders for the current user"""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders

@router.get("/{order_id}", response_model=OrderSchema)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific order details"""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order