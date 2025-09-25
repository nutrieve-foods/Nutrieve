from sqlalchemy import Enum, ForeignKey, String, Text, Date, Numeric, JSON, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base
import enum
from datetime import date, datetime

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
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    email: Mapped[str] = mapped_column(String, unique=True)
    role: Mapped[str] = mapped_column(default="agent")

class LeadSource(Base):
    __tablename__ = "lead_sources"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    category: Mapped[LeadType] = mapped_column(Enum(LeadType, name="lead_type", create_constraint=False))

class Lead(Base):
    __tablename__ = "leads"
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[LeadType] = mapped_column(Enum(LeadType, name="lead_type", create_constraint=False))
    source_id: Mapped[int | None] = mapped_column(ForeignKey("lead_sources.id"))
    company: Mapped[str | None]
    person_name: Mapped[str]
    phone: Mapped[str | None]
    email: Mapped[str | None]
    address: Mapped[str | None]
    city: Mapped[str | None]
    state: Mapped[str | None]
    country: Mapped[str | None] = mapped_column(default="India")
    pincode: Mapped[str | None]

    stage: Mapped[LeadStage] = mapped_column(Enum(LeadStage, name="lead_stage", create_constraint=False), default=LeadStage.cold)
    next_follow_up_at: Mapped[date | None] = mapped_column(Date)
    status: Mapped[LeadStatus] = mapped_column(Enum(LeadStatus, name="lead_status", create_constraint=False), default=LeadStatus.open)
    tentative_order_qty: Mapped[float | None] = mapped_column(Numeric(18,3))
    tentative_qty_unit: Mapped[str | None]

    industry: Mapped[Industry | None] = mapped_column(Enum(Industry, name="industry", create_constraint=False))
    notes: Mapped[str | None] = mapped_column(Text)

    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(server_default=text("now()"))
    updated_at: Mapped[datetime] = mapped_column(server_default=text("now()"))

    activities: Mapped[list["LeadActivity"]] = relationship(back_populates="lead", cascade="all, delete-orphan")

class LeadActivity(Base):
    __tablename__ = "lead_activities"
    id: Mapped[int] = mapped_column(primary_key=True)
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id", ondelete="CASCADE"))
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    kind: Mapped[str]
    body: Mapped[str | None] = mapped_column(Text)
    at: Mapped[datetime] = mapped_column(server_default=text("now()"))
    meta: Mapped[dict | None] = mapped_column(JSON)

    lead: Mapped[Lead] = relationship(back_populates="activities")