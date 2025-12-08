from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
import smtplib
from email.message import EmailMessage
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


@router.post("/{order_id}/send-confirmation")
def send_order_confirmation(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send order confirmation email with invoice and a track link.
    Requires SMTP settings via env:
      SMTP_HOST, SMTP_PORT (default 587), SMTP_USER, SMTP_PASS,
      SMTP_FROM (default info@nutrieve.in),
      FRONTEND_URL (default http://localhost:5173)
    """
    order: Order = db.query(Order).filter(
        Order.id == order_id, Order.user_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Fetch order items with products
    items: List[OrderItem] = (
        db.query(OrderItem)
        .join(Product, OrderItem.product_id == Product.id)
        .filter(OrderItem.order_id == order.id)
        .all()
    )

    # Build HTML invoice
    track_url_base = os.getenv("FRONTEND_URL", "http://localhost:5173")
    track_url = f"{track_url_base}#track-orders"
    from_email = os.getenv("SMTP_FROM", "info@nutrieve.in")
    to_email = current_user.email
    subtotal = sum((item.price or 0) * item.quantity for item in items)
    cgst = subtotal * 0.025
    sgst = subtotal * 0.025
    total = order.total_amount or (subtotal + cgst + sgst)

    rows = "".join(
        f"""
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;">{getattr(item.product,'name','Item')}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">{item.size}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">₹{(item.price or 0):.0f}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">{item.quantity}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">₹{((item.price or 0)*item.quantity):.0f}</td>
        </tr>
        """
        for item in items
    )

    html_body = f"""
    <div style="font-family:Arial,sans-serif;color:#111827;">
      <h2 style="color:#ea580c;">Thanks for your order!</h2>
      <p>Hi {current_user.name or 'Customer'},</p>
      <p>Your order <strong>#{str(order.id).zfill(6)}</strong> has been received.</p>
      <table style="border-collapse:collapse;width:100%;margin-top:12px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Product</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Size</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;">Price</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:center;">Qty</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <div style="margin-top:16px;text-align:right;">
        <p>Subtotal: ₹{subtotal:.0f}</p>
        <p>CGST (2.5%): ₹{cgst:.0f}</p>
        <p>SGST (2.5%): ₹{sgst:.0f}</p>
        <p style="font-size:18px;font-weight:bold;">Grand Total: ₹{total:.0f}</p>
      </div>
      <div style="margin-top:20px;">
        <a href="{track_url}" style="background:#ea580c;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;">Track your order</a>
      </div>
      <p style="margin-top:16px;color:#6b7280;">If you have questions, reply to this email.</p>
    </div>
    """

    # SMTP send
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

    if not (smtp_host and smtp_user and smtp_pass):
        raise HTTPException(
            status_code=500,
            detail="Email not configured (SMTP_HOST/USER/PASS missing)."
        )

    try:
        msg = EmailMessage()
        msg["Subject"] = f"Nutrieve Order Confirmation #{str(order.id).zfill(6)}"
        msg["From"] = from_email
        msg["To"] = to_email
        msg.set_content("Your order has been placed.")
        msg.add_alternative(html_body, subtype="html")

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)

        return {"message": "Confirmation email sent"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

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