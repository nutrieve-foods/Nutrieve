from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from ..deps.db import get_db
from ..models import User
from ..schema import UserCreate, UserLogin, User as UserSchema
from fastapi import Body
import random
from app.utils.email_service import send_email
router = APIRouter(prefix="/api/auth", tags=["auth"])

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = "nutrieve-super-secret-jwt-key-2024"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        # Check if already exists
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Extract raw password
        raw_pwd = (user.password or "").strip()

        # 1️⃣ Validate ASCII-only characters
        try:
            raw_pwd.encode("ascii")
        except UnicodeEncodeError:
            raise HTTPException(
                status_code=400,
                detail="Password must contain only letters, numbers, and ASCII symbols"
            )

        # 2️⃣ Validate length 8–16
        if len(raw_pwd) < 8 or len(raw_pwd) > 16:
            raise HTTPException(
                status_code=400,
                detail="Password must be 8 to 16 characters long"
            )

        # 3️⃣ Hash the clean password
        hashed_password = get_password_hash(raw_pwd)

        # Create new user
        db_user = User(
            name=user.name,
            email=user.email,
            phone=user.phone,
            password=hashed_password
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # Create JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.email},
            expires_delta=access_token_expires
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user.id,
                "name": db_user.name,
                "email": db_user.email,
                "phone": db_user.phone,
                "role": db_user.role
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")



@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    try:
        db_user = db.query(User).filter(User.email == user.email).first()

        clean_password = (
            user.password
                .encode("utf-8", "ignore")
                .decode("utf-8")
                .strip()
        )

        if not db_user or not verify_password(clean_password, db_user.password):

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user.id,
                "name": db_user.name,
                "email": db_user.email,
                "phone": db_user.phone,
                "role": db_user.role
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.post("/forgot-password")
def forgot_password(data: dict = Body(...), db: Session = Depends(get_db)):
    email = data.get("email", "").strip()

    user = db.query(User).filter(User.email.ilike(email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")

    otp = str(random.randint(100000, 999999))
    expiry = datetime.utcnow() + timedelta(minutes=10)

    user.reset_code = otp
    user.reset_expiry = expiry
    db.commit()

    send_email(
    to_email=email,
    subject="Your Nutrieve Password Reset Code",
    body=f"Your OTP for resetting your Nutrieve password is: {otp}\nThis code will expire in 10 minutes."
)


    return {"message": "OTP sent to email"}


@router.post("/reset-password")
def reset_password(data: dict = Body(...), db: Session = Depends(get_db)):
    email = data.get("email", "").strip()
    otp = data.get("otp")
    new_password = data.get("new_password")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")

    if not user.reset_code or user.reset_code != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > user.reset_expiry:
        raise HTTPException(status_code=400, detail="OTP expired")

    hashed_password = get_password_hash(new_password)

    user.password = hashed_password
    user.reset_code = None
    user.reset_expiry = None
    db.commit()

    return {"message": "Password reset successful"}

@router.get("/me", response_model=UserSchema)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user