from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup")
def signup(payload: dict):
    # Stub: accept any email/password, return fake user
    email = payload.get("email")
    if not email:
        raise HTTPException(400, "email required")
    return {"id": 1, "name": payload.get("name") or "User", "email": email, "token": "dev-token"}


@router.post("/login")
def login(payload: dict):
    email = payload.get("email")
    if not email:
        raise HTTPException(400, "email required")
    return {"id": 1, "name": "User", "email": email, "token": "dev-token"}


