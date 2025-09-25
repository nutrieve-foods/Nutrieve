# Design backend structure for LMS
_Exported on 9/17/2025 at 11:50:19 GMT+5:30 from Cursor (1.5.11)_

---

**User**

Hi, I have built this frontend for Indian Organic powder company named Nutrieve So Now I want to create a backend for that for LMS. I have a flowchart also for how the LMS workflows goes . 
So I am  thinking of using 
Database → PostgreSQL (unlimited, scalable)
Backend → FastAPI (lightweight, scalable, API-first).
Frontend → React + Tailwind (already in place, future dashboards can be in any JS framework).
Architecture → API-based, so frontends are independent and interchangeable.

I am thinking of of below backend structure
backend/
│── app/
│   ├── main.py              # entry point
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # database functions
│   ├── routes/
│   │   └── leads.py         # lead API endpoints
│   └── database.py          # db connection
│── requirements.txt

---> If you want you can change/add folder/files as you think is ok 

Database Schema (PostgreSQL / SQL Server)

Backend Structure (FastAPI)

Frontend Flow (React + Tailwind)

Future Dashboard Plug-in

So can you tell me this

---

**Cursor**

### Great plan. I’ll give you a ready-to-use scaffold: database schema, FastAPI structure (with auth-ready layout), and a simple React integration flow. You can copy-paste to bootstrap the backend now and plug the frontend later.

### Backend folder layout (FastAPI)
- **backend/**
  - **app/**
    - `main.py`
    - `database.py`
    - `models.py`
    - `schemas.py`
    - `crud.py`
    - **core/**
      - `config.py`        (env, CORS, settings)
    - **routes/**
      - `leads.py`
    - **deps/**
      - `db.py`            (Session dependency)
  - `requirements.txt`
  - `.env.example`

---

### Database schema (PostgreSQL)
Covers Procurement and Sales leads in one unified table with typed fields, stages, statuses, industries, follow-ups, and activity log.

```sql
-- enums
CREATE TYPE lead_type AS ENUM ('procurement', 'sales');
CREATE TYPE lead_stage AS ENUM ('hot', 'warm', 'cold');
CREATE TYPE lead_status AS ENUM ('open', 'hold', 'wip', 'rejected', 'won', 'lost');
CREATE TYPE industry AS ENUM ('fmcg', 'fnb', 'pharma', 'ayurvedic', 'others');

-- users & roles (simple; expand later to full auth)
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent', -- 'admin' | 'manager' | 'agent'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- lead_sources lets you define Farmers, Mandi Broker, B2B, B2C, etc.
CREATE TABLE lead_sources (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,          -- e.g. Farmers, Mandi Broker, B2B, B2C
  category lead_type NOT NULL  -- ties the source to procurement/sales
);

-- leads (single table for both procurement & sales)
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  type lead_type NOT NULL,           -- procurement | sales
  source_id BIGINT REFERENCES lead_sources(id),
  company TEXT,                      -- org/firm if any
  person_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  pincode TEXT,

  stage lead_stage NOT NULL DEFAULT 'cold', -- hot (<30d), warm (45-60d), cold (>60d)
  next_follow_up_at DATE,
  status lead_status NOT NULL DEFAULT 'open',
  tentative_order_qty NUMERIC(18,3), -- kg/units etc; keep unit in a separate column if needed
  tentative_qty_unit TEXT,           -- e.g. kg/mt/units

  industry industry,                 -- only used for sales leads; nullable for procurement
  notes TEXT,

  owner_id BIGINT REFERENCES users(id),   -- assigned to agent
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- activities (timeline)
CREATE TABLE lead_activities (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  actor_id BIGINT REFERENCES users(id),
  kind TEXT NOT NULL,               -- 'note','call','visit','status_change','stage_change','follow_up'
  body TEXT,
  at TIMESTAMPTZ NOT NULL DEFAULT now(),
  meta JSONB                        -- optional extra fields
);

-- simple index set
CREATE INDEX ix_leads_type ON leads(type);
CREATE INDEX ix_leads_owner ON leads(owner_id);
CREATE INDEX ix_leads_next_fu ON leads(next_follow_up_at);
CREATE INDEX ix_leads_stage ON leads(stage);
CREATE INDEX ix_leads_status ON leads(status);
```

---

### requirements.txt
```txt
fastapi==0.115.0
uvicorn[standard]==0.30.6
SQLAlchemy==2.0.34
psycopg[binary]==3.2.1
pydantic==2.9.2
python-dotenv==1.0.1
```

---

### `.env.example`
```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/nutrieve_lms
ALLOWED_ORIGINS=http://localhost:5173
```

---

### `app/core/config.py`
```python
from pydantic import BaseModel
import os

class Settings(BaseModel):
    database_url: str = os.getenv("DATABASE_URL", "")
    allowed_origins: list[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

settings = Settings()
```

### `app/database.py`
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .core.config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass
```

### `app/deps/db.py`
```python
from ..database import SessionLocal
from typing import Generator

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### `app/models.py`
```python
from sqlalchemy import Enum, ForeignKey, String, Text, Date, Numeric, JSON, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
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
    next_follow_up_at: Mapped[Date | None]
    status: Mapped[LeadStatus] = mapped_column(Enum(LeadStatus, name="lead_status", create_constraint=False), default=LeadStatus.open)
    tentative_order_qty: Mapped[float | None] = mapped_column(Numeric(18,3))
    tentative_qty_unit: Mapped[str | None]

    industry: Mapped[Industry | None] = mapped_column(Enum(Industry, name="industry", create_constraint=False))
    notes: Mapped[str | None] = mapped_column(Text)

    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[str] = mapped_column(server_default=text("now()"))
    updated_at: Mapped[str] = mapped_column(server_default=text("now()"))

    activities: Mapped[list["LeadActivity"]] = relationship(back_populates="lead", cascade="all, delete-orphan")

class LeadActivity(Base):
    __tablename__ = "lead_activities"
    id: Mapped[int] = mapped_column(primary_key=True)
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id", ondelete="CASCADE"))
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    kind: Mapped[str]
    body: Mapped[str | None] = mapped_column(Text)
    at: Mapped[str] = mapped_column(server_default=text("now()"))
    meta: Mapped[dict | None] = mapped_column(JSON)

    lead: Mapped[Lead] = relationship(back_populates="activities")
```

### `app/schemas.py`
```python
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
```

### `app/crud.py`
```python
from sqlalchemy.orm import Session
from . import models, schemas

def list_leads(db: Session, *, skip=0, limit=20, filters: dict = {}):
    q = db.query(models.Lead)
    if t := filters.get("type"): q = q.filter(models.Lead.type == t)
    if s := filters.get("stage"): q = q.filter(models.Lead.stage == s)
    if st := filters.get("status"): q = q.filter(models.Lead.status == st)
    if owner := filters.get("owner_id"): q = q.filter(models.Lead.owner_id == owner)
    return q.order_by(models.Lead.next_follow_up_at.nulls_last()).offset(skip).limit(limit).all()

def get_lead(db: Session, lead_id: int):
    return db.query(models.Lead).get(lead_id)

def create_lead(db: Session, data: schemas.LeadCreate):
    obj = models.Lead(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

def update_lead(db: Session, lead_id: int, data: schemas.LeadUpdate):
    obj = db.query(models.Lead).get(lead_id)
    if not obj: return None
    for k,v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit(); db.refresh(obj)
    return obj

def delete_lead(db: Session, lead_id: int):
    obj = db.query(models.Lead).get(lead_id)
    if not obj: return False
    db.delete(obj); db.commit(); return True

def add_activity(db: Session, data: schemas.ActivityCreate):
    act = models.LeadActivity(**data.model_dump())
    db.add(act); db.commit(); db.refresh(act)
    return act

def list_activities(db: Session, lead_id: int):
    return db.query(models.LeadActivity).filter(models.LeadActivity.lead_id == lead_id).order_by(models.LeadActivity.at.desc()).all()
```

### `app/routes/leads.py`
```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..deps.db import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/leads", tags=["leads"])

@router.get("", response_model=list[schemas.LeadOut])
def list_leads(
    skip: int = 0,
    limit: int = 20,
    type: schemas.LeadType | None = Query(None),
    stage: schemas.LeadStage | None = Query(None),
    status: schemas.LeadStatus | None = Query(None),
    owner_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    return crud.list_leads(db, skip=skip, limit=limit, filters={"type":type,"stage":stage,"status":status,"owner_id":owner_id})

@router.post("", response_model=schemas.LeadOut, status_code=201)
def create_lead(payload: schemas.LeadCreate, db: Session = Depends(get_db)):
    return crud.create_lead(db, payload)

@router.get("/{lead_id}", response_model=schemas.LeadOut)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    obj = crud.get_lead(db, lead_id)
    if not obj: raise HTTPException(404, "Lead not found")
    return obj

@router.put("/{lead_id}", response_model=schemas.LeadOut)
def update_lead(lead_id: int, payload: schemas.LeadUpdate, db: Session = Depends(get_db)):
    obj = crud.update_lead(db, lead_id, payload)
    if not obj: raise HTTPException(404, "Lead not found")
    return obj

@router.delete("/{lead_id}", status_code=204)
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_lead(db, lead_id)
    if not ok: raise HTTPException(404, "Lead not found")

@router.get("/{lead_id}/activities", response_model=list[schemas.ActivityOut])
def get_activities(lead_id: int, db: Session = Depends(get_db)):
    return crud.list_activities(db, lead_id)

@router.post("/{lead_id}/activities", response_model=schemas.ActivityOut, status_code=201)
def post_activity(lead_id: int, payload: schemas.ActivityBase, db: Session = Depends(get_db)):
    return crud.add_activity(db, schemas.ActivityCreate(lead_id=lead_id, **payload.model_dump()))
```

### `app/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .routes import leads as leads_router
from .database import Base, engine

Base.metadata.create_all(bind=engine)  # for quick start; move to Alembic later

app = FastAPI(title="Nutrieve LMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leads_router.router)

@app.get("/health")
def health():
    return {"ok": True}
```

Run:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

### Frontend flow (React + Tailwind)
- **Data model**: a unified `Lead` type with `type` in `['procurement','sales']`. When `type === 'sales'`, show `industry` field; otherwise hide it.
- **Key screens**:
  - Lead List (filters by `type`, `stage`, `status`, date picker for `next_follow_up_at` range).
  - Lead Create/Edit drawer.
  - Lead Detail timeline (activities).

Minimal client service:

```ts
// src/api/leads.ts
export type LeadPayload = {
  type: 'procurement' | 'sales';
  person_name: string;
  phone?: string;
  email?: string;
  company?: string;
  stage?: 'hot'|'warm'|'cold';
  status?: 'open'|'hold'|'wip'|'rejected'|'won'|'lost';
  next_follow_up_at?: string; // YYYY-MM-DD
  tentative_order_qty?: number;
  tentative_qty_unit?: string;
  industry?: 'fmcg'|'fnb'|'pharma'|'ayurvedic'|'others';
  notes?: string;
};

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function listLeads(params: Record<string, string | number | undefined> = {}) {
  const q = new URLSearchParams(Object.entries(params).filter(([,v]) => v !== undefined) as any).toString();
  const r = await fetch(`${BASE}/api/leads?${q}`);
  return r.json();
}

export async function createLead(payload: LeadPayload) {
  const r = await fetch(`${BASE}/api/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  return r.json();
}
```

Example usage in a form submit:
```ts
await createLead({
  type: 'sales',
  person_name: values.name,
  phone: values.phone,
  stage: values.stage,          // 'hot' | 'warm' | 'cold'
  status: 'open',
  next_follow_up_at: values.followUpDate, // '2025-09-15'
  tentative_order_qty: Number(values.qty),
  tentative_qty_unit: values.unit,
  industry: values.industry,    // only if sales
  notes: values.notes,
});
```

Tailwind UI: reuse your existing components; use a simple Badge color map for `stage` and `status`, and a left-side vertical timeline for `lead_activities`.

---

### Future dashboard plug-in
- **Keep API-first**: All metrics (conversion rate, next follow-ups, aging by stage) exposed via `/api/reports/...`. Frontends can be React, Vue, or embedded in BI tools.
- **Micro-frontend ready**: Mount dashboards as separate SPA at `/dashboard` consuming the same API. Authentication can be added later via JWT.
- **RBAC later**: Add `roles` and guards at route level (admin/manager/agent), filter leads by `owner_id` and team.
- **Migrations**: move `Base.metadata.create_all` to Alembic for production.

If you want, I can generate a zipped starter repo for the `backend/` folder based on this scaffold and a first set of SQL to initialize enums and tables.

- Created a full FastAPI scaffold with unified lead model supporting both Procurement and Sales flows, plus activities and filters.
- Included SQL schema, models, CRUD, routes, settings, requirements, and a minimal React client service to integrate immediately.

```sql
-- enums
CREATE TYPE lead_type AS ENUM ('procurement', 'sales');
CREATE TYPE lead_stage AS ENUM ('hot', 'warm', 'cold');
CREATE TYPE lead_status AS ENUM ('open', 'hold', 'wip', 'rejected', 'won', 'lost');
CREATE TYPE industry AS ENUM ('fmcg', 'fnb', 'pharma', 'ayurvedic', 'others');

-- users & roles (simple; expand later to full auth)
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent', -- 'admin' | 'manager' | 'agent'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- lead_sources lets you define Farmers, Mandi Broker, B2B, B2C, etc.
CREATE TABLE lead_sources (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,          -- e.g. Farmers, Mandi Broker, B2B, B2C
  category lead_type NOT NULL  -- ties the source to procurement/sales
);

-- leads (single table for both procurement & sales)
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  type lead_type NOT NULL,           -- procurement | sales
  source_id BIGINT REFERENCES lead_sources(id),
  company TEXT,                      -- org/firm if any
  person_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  pincode TEXT,

  stage lead_stage NOT NULL DEFAULT 'cold', -- hot (<30d), warm (45-60d), cold (>60d)
  next_follow_up_at DATE,
  status lead_status NOT NULL DEFAULT 'open',
  tentative_order_qty NUMERIC(18,3), -- kg/units etc; keep unit in a separate column if needed
  tentative_qty_unit TEXT,           -- e.g. kg/mt/units

  industry industry,                 -- only used for sales leads; nullable for procurement
  notes TEXT,

  owner_id BIGINT REFERENCES users(id),   -- assigned to agent
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- activities (timeline)
CREATE TABLE lead_activities (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  actor_id BIGINT REFERENCES users(id),
  kind TEXT NOT NULL,               -- 'note','call','visit','status_change','stage_change','follow_up'
  body TEXT,
  at TIMESTAMPTZ NOT NULL DEFAULT now(),
  meta JSONB                        -- optional extra fields
);

-- simple index set
CREATE INDEX ix_leads_type ON leads(type);
CREATE INDEX ix_leads_owner ON leads(owner_id);
CREATE INDEX ix_leads_next_fu ON leads(next_follow_up_at);
CREATE INDEX ix_leads_stage ON leads(stage);
CREATE INDEX ix_leads_status ON leads(status);
```

```plaintext
fastapi==0.115.0
uvicorn[standard]==0.30.6
SQLAlchemy==2.0.34
psycopg[binary]==3.2.1
pydantic==2.9.2
python-dotenv==1.0.1
```

```plaintext
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/nutrieve_lms
ALLOWED_ORIGINS=http://localhost:5173
```

```python
from pydantic import BaseModel
import os

class Settings(BaseModel):
    database_url: str = os.getenv("DATABASE_URL", "")
    allowed_origins: list[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

settings = Settings()
```

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .core.config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass
```

```python
from ..database import SessionLocal
from typing import Generator

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

```python
from sqlalchemy import Enum, ForeignKey, String, Text, Date, Numeric, JSON, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
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
    next_follow_up_at: Mapped[Date | None]
    status: Mapped[LeadStatus] = mapped_column(Enum(LeadStatus, name="lead_status", create_constraint=False), default=LeadStatus.open)
    tentative_order_qty: Mapped[float | None] = mapped_column(Numeric(18,3))
    tentative_qty_unit: Mapped[str | None]

    industry: Mapped[Industry | None] = mapped_column(Enum(Industry, name="industry", create_constraint=False))
    notes: Mapped[str | None] = mapped_column(Text)

    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[str] = mapped_column(server_default=text("now()"))
    updated_at: Mapped[str] = mapped_column(server_default=text("now()"))

    activities: Mapped[list["LeadActivity"]] = relationship(back_populates="lead", cascade="all, delete-orphan")

class LeadActivity(Base):
    __tablename__ = "lead_activities"
    id: Mapped[int] = mapped_column(primary_key=True)
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id", ondelete="CASCADE"))
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    kind: Mapped[str]
    body: Mapped[str | None] = mapped_column(Text)
    at: Mapped[str] = mapped_column(server_default=text("now()"))
    meta: Mapped[dict | None] = mapped_column(JSON)

    lead: Mapped[Lead] = relationship(back_populates="activities")
```

```python
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
```

```python
from sqlalchemy.orm import Session
from . import models, schemas

def list_leads(db: Session, *, skip=0, limit=20, filters: dict = {}):
    q = db.query(models.Lead)
    if t := filters.get("type"): q = q.filter(models.Lead.type == t)
    if s := filters.get("stage"): q = q.filter(models.Lead.stage == s)
    if st := filters.get("status"): q = q.filter(models.Lead.status == st)
    if owner := filters.get("owner_id"): q = q.filter(models.Lead.owner_id == owner)
    return q.order_by(models.Lead.next_follow_up_at.nulls_last()).offset(skip).limit(limit).all()

def get_lead(db: Session, lead_id: int):
    return db.query(models.Lead).get(lead_id)

def create_lead(db: Session, data: schemas.LeadCreate):
    obj = models.Lead(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

def update_lead(db: Session, lead_id: int, data: schemas.LeadUpdate):
    obj = db.query(models.Lead).get(lead_id)
    if not obj: return None
    for k,v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit(); db.refresh(obj)
    return obj

def delete_lead(db: Session, lead_id: int):
    obj = db.query(models.Lead).get(lead_id)
    if not obj: return False
    db.delete(obj); db.commit(); return True

def add_activity(db: Session, data: schemas.ActivityCreate):
    act = models.LeadActivity(**data.model_dump())
    db.add(act); db.commit(); db.refresh(act)
    return act

def list_activities(db: Session, lead_id: int):
    return db.query(models.LeadActivity).filter(models.LeadActivity.lead_id == lead_id).order_by(models.LeadActivity.at.desc()).all()
```

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..deps.db import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/leads", tags=["leads"])

@router.get("", response_model=list[schemas.LeadOut])
def list_leads(
    skip: int = 0,
    limit: int = 20,
    type: schemas.LeadType | None = Query(None),
    stage: schemas.LeadStage | None = Query(None),
    status: schemas.LeadStatus | None = Query(None),
    owner_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    return crud.list_leads(db, skip=skip, limit=limit, filters={"type":type,"stage":stage,"status":status,"owner_id":owner_id})

@router.post("", response_model=schemas.LeadOut, status_code=201)
def create_lead(payload: schemas.LeadCreate, db: Session = Depends(get_db)):
    return crud.create_lead(db, payload)

@router.get("/{lead_id}", response_model=schemas.LeadOut)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    obj = crud.get_lead(db, lead_id)
    if not obj: raise HTTPException(404, "Lead not found")
    return obj

@router.put("/{lead_id}", response_model=schemas.LeadOut)
def update_lead(lead_id: int, payload: schemas.LeadUpdate, db: Session = Depends(get_db)):
    obj = crud.update_lead(db, lead_id, payload)
    if not obj: raise HTTPException(404, "Lead not found")
    return obj

@router.delete("/{lead_id}", status_code=204)
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_lead(db, lead_id)
    if not ok: raise HTTPException(404, "Lead not found")

@router.get("/{lead_id}/activities", response_model=list[schemas.ActivityOut])
def get_activities(lead_id: int, db: Session = Depends(get_db)):
    return crud.list_activities(db, lead_id)

@router.post("/{lead_id}/activities", response_model=schemas.ActivityOut, status_code=201)
def post_activity(lead_id: int, payload: schemas.ActivityBase, db: Session = Depends(get_db)):
    return crud.add_activity(db, schemas.ActivityCreate(lead_id=lead_id, **payload.model_dump()))
```

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .routes import leads as leads_router
from .database import Base, engine

Base.metadata.create_all(bind=engine)  # for quick start; move to Alembic later

app = FastAPI(title="Nutrieve LMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leads_router.router)

@app.get("/health")
def health():
    return {"ok": True}
```

```shellscript
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

```typescript
// src/api/leads.ts
export type LeadPayload = {
  type: 'procurement' | 'sales';
  person_name: string;
  phone?: string;
  email?: string;
  company?: string;
  stage?: 'hot'|'warm'|'cold';
  status?: 'open'|'hold'|'wip'|'rejected'|'won'|'lost';
  next_follow_up_at?: string; // YYYY-MM-DD
  tentative_order_qty?: number;
  tentative_qty_unit?: string;
  industry?: 'fmcg'|'fnb'|'pharma'|'ayurvedic'|'others';
  notes?: string;
};

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function listLeads(params: Record<string, string | number | undefined> = {}) {
  const q = new URLSearchParams(Object.entries(params).filter(([,v]) => v !== undefined) as any).toString();
  const r = await fetch(`${BASE}/api/leads?${q}`);
  return r.json();
}

export async function createLead(payload: LeadPayload) {
  const r = await fetch(`${BASE}/api/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  return r.json();
}
```

```typescript
await createLead({
  type: 'sales',
  person_name: values.name,
  phone: values.phone,
  stage: values.stage,          // 'hot' | 'warm' | 'cold'
  status: 'open',
  next_follow_up_at: values.followUpDate, // '2025-09-15'
  tentative_order_qty: Number(values.qty),
  tentative_qty_unit: values.unit,
  industry: values.industry,    // only if sales
  notes: values.notes,
});
```

