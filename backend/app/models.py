from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean, Enum, Date, Numeric, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class LeadType(str, enum.Enum):
    procurement = "procurement"
    sales = "sales"

class LeadStage(str, enum.Enum):
    hot = "hot"
    warm = "warm"
    cold = "cold"

class LeadStatus(str, enum.Enum):
    open = "open"
    hold = "hold"
    wip = "wip"
    rejected = "rejected"
    won = "won"
    lost = "lost"

class Industry(str, enum.Enum):
    fmcg = "fmcg"
    fnb = "fnb"
    pharma = "pharma"
    ayurvedic = "ayurvedic"
    others = "others"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String)
    role = Column(String, default="customer")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reset_code = Column(String, nullable=True)
    reset_expiry = Column(DateTime, nullable=True)
    otp_attempts = Column(Integer, default=0)
    last_otp_sent_at = Column(DateTime, nullable=True)
    # Relationships
    orders = relationship("Order", back_populates="user")
    cart_items = relationship("CartItem", back_populates="user")
    addresses = relationship("Address", back_populates="user")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    base_price = Column(Float, nullable=False)  # Price for 200gm
    image = Column(String)
    category = Column(String)
    stock_quantity = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    cart_items = relationship("CartItem", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")

class CartItem(Base):
    __tablename__ = "cart_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    size = Column(String, nullable=False, default="200gm")  # 200gm, 500gm, 1kg
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="cart_items")
    product = relationship("Product", back_populates="cart_items")

class Address(Base):
    __tablename__ = "addresses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    flat_no = Column(String, nullable=False)
    street = Column(String, nullable=False)
    landmark = Column(String)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="addresses")
    orders = relationship("Order", back_populates="address")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    address_id = Column(Integer, ForeignKey("addresses.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, confirmed, shipped, delivered, cancelled
    payment_status = Column(String, default="pending")  # pending, completed, failed
    payment_id = Column(String)  # PhonePe transaction ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="orders")
    address = relationship("Address", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    size = Column(String, nullable=False)
    price = Column(Float, nullable=False)  # Price at time of order
    
    # Relationships
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")

# CRM Models (existing)
class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(LeadType), nullable=False)
    company = Column(String)
    person_name = Column(String, nullable=False)
    phone = Column(String)
    email = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String, default="India")
    pincode = Column(String)
    stage = Column(Enum(LeadStage), default=LeadStage.cold)
    next_follow_up_at = Column(Date)
    status = Column(Enum(LeadStatus), default=LeadStatus.open)
    tentative_order_qty = Column(Numeric(18, 3))
    tentative_qty_unit = Column(String)
    industry = Column(Enum(Industry))
    notes = Column(Text)
    owner_id = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    activities = relationship("LeadActivity", back_populates="lead")

class LeadActivity(Base):
    __tablename__ = "lead_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    actor_id = Column(Integer)
    kind = Column(String, nullable=False)
    body = Column(Text)
    at = Column(DateTime(timezone=True), server_default=func.now())
    meta = Column(JSON)
    
    # Relationships
    lead = relationship("Lead", back_populates="activities")