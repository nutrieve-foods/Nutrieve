from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..deps.db import get_db
from .. import crud
from .. import schema as schemas

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