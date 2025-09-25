from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional, Literal

LeadType = Literal["procurement","sales"]
LeadStage = Literal["hot","warm","cold"]
LeadStatus = Literal["open","hold","wip","rejected","won","lost"]
Industry = Literal["fmcg","fnb","pharma","ayurvedic","others"]

class LeadBase(BaseModel):
    type: LeadType
    source_id: Optional[int] = None
    company: Optional[str] = None
    person_name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = "India"
    pincode: Optional[str] = None
    stage: LeadStage = "cold"
    next_follow_up_at: Optional[date] = None
    status: LeadStatus = "open"
    tentative_order_qty: Optional[float] = None
    tentative_qty_unit: Optional[str] = None
    industry: Optional[Industry] = None
    notes: Optional[str] = None
    owner_id: Optional[int] = None

class LeadCreate(LeadBase): pass
class LeadUpdate(LeadBase): pass

class LeadOut(LeadBase):
    id: int
    class Config:
        from_attributes = True

class ActivityBase(BaseModel):
    kind: str
    body: Optional[str] = None
    meta: Optional[dict] = None

class ActivityCreate(ActivityBase):
    lead_id: int
    actor_id: Optional[int] = None

class ActivityOut(ActivityBase):
    id: int
    lead_id: int
    class Config:
        from_attributes = True