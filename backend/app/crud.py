from sqlalchemy.orm import Session
from . import models, schema

def list_leads(db: Session, *, skip: int = 0, limit: int = 20, filters: dict = {}):
    query = db.query(models.Lead)
    lead_type = filters.get("type")
    stage = filters.get("stage")
    status = filters.get("status")
    owner_id = filters.get("owner_id")

    if lead_type:
        query = query.filter(models.Lead.type == lead_type)
    if stage:
        query = query.filter(models.Lead.stage == stage)
    if status:
        query = query.filter(models.Lead.status == status)
    if owner_id:
        query = query.filter(models.Lead.owner_id == owner_id)

    return (
        query.order_by(models.Lead.next_follow_up_at.nulls_last())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_lead(db: Session, lead_id: int):
    return db.query(models.Lead).get(lead_id)


def create_lead(db: Session, data: schema.LeadCreate):
    obj = models.Lead(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_lead(db: Session, lead_id: int, data: schema.LeadUpdate):
    obj = db.query(models.Lead).get(lead_id)
    if not obj:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_lead(db: Session, lead_id: int) -> bool:
    obj = db.query(models.Lead).get(lead_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


def add_activity(db: Session, data: schema.ActivityCreate):
    act = models.LeadActivity(**data.model_dump())
    db.add(act)
    db.commit()
    db.refresh(act)
    return act


def list_activities(db: Session, lead_id: int):
    return (
        db.query(models.LeadActivity)
        .filter(models.LeadActivity.lead_id == lead_id)
        .order_by(models.LeadActivity.at.desc())
        .all()
    )


