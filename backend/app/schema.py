from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import enum

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: float
    image: Optional[str] = None
    category: Optional[str] = None

class ProductCreate(ProductBase):
    stock_quantity: int = 0

class Product(ProductBase):
    id: int
    stock_quantity: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Cart schemas
class CartItemBase(BaseModel):
    product_id: int
    quantity: int
    size: str = "200gm"

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    user_id: int
    created_at: datetime
    product: Product
    
    class Config:
        from_attributes = True

# Address schemas
class AddressBase(BaseModel):
    full_name: str
    phone: str
    flat_no: str
    street: str
    landmark: Optional[str] = None
    city: str
    state: str
    pincode: str
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class Address(AddressBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Order schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    size: str
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    product: Product
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    address_id: int
    total_amount: float

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    user_id: int
    status: str
    payment_status: str
    payment_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    address: Address
    order_items: List[OrderItem]
    
    class Config:
        from_attributes = True

# Payment schemas
class PaymentRequest(BaseModel):
    order_id: int
    amount: float
    phone: str

class PaymentResponse(BaseModel):
    payment_url: str
    transaction_id: str

# Lead schemas (existing)
class LeadBase(BaseModel):
    type: str
    company: Optional[str] = None
    person_name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: str = "India"
    pincode: Optional[str] = None
    stage: str = "cold"
    status: str = "open"
    notes: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class Lead(LeadBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ===== Leads: Extended types used by routes/crud =====

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

class LeadUpdate(BaseModel):
    type: Optional[str] = None
    company: Optional[str] = None
    person_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    stage: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    next_follow_up_at: Optional[date] = None
    tentative_order_qty: Optional[float] = None
    tentative_qty_unit: Optional[str] = None
    industry: Optional[str] = None
    owner_id: Optional[int] = None

class LeadOut(BaseModel):
    id: int
    type: str
    company: Optional[str] = None
    person_name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: str
    pincode: Optional[str] = None
    stage: str
    status: str
    notes: Optional[str] = None
    tentative_order_qty: Optional[float] = None
    tentative_qty_unit: Optional[str] = None
    industry: Optional[str] = None
    owner_id: Optional[int] = None
    next_follow_up_at: Optional[date] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Lead activities
class ActivityBase(BaseModel):
    kind: str
    body: Optional[str] = None
    at: Optional[datetime] = None
    meta: Optional[Dict[str, Any]] = None

class ActivityCreate(ActivityBase):
    lead_id: int

class ActivityOut(ActivityBase):
    id: int
    lead_id: int
    actor_id: Optional[int] = None
    at: datetime

    class Config:
        from_attributes = True