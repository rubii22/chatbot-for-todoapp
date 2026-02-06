"""
Authentication endpoints for the Todo AI Chatbot
Handles user registration, login, and session management
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
import hashlib
import jwt
import os
from datetime import datetime, timedelta
from ..db import get_user_by_email, create_user
from ..models.models import User

router = APIRouter()

# Secret for JWT tokens (in production, use a strong secret from environment)
SECRET_KEY = os.getenv("JWT_SECRET", "your-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str


def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return hash_password(plain_password) == hashed_password


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str):
    """Decode a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None


async def get_current_user(token: str = Depends(lambda: None)):
    """Get the current user from the token"""
    if token is None:
        return None

    payload = decode_token(token)
    if payload is None:
        return None

    user_id = payload.get("sub")
    if user_id is None:
        return None

    return user_id


@router.post("/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Login endpoint"""
    user = await get_user_by_email(request.email)

    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/auth/signup", response_model=UserResponse)
async def signup(request: RegisterRequest):
    """Signup endpoint"""
    # Normalize email to lowercase to avoid case-sensitivity issues
    email = request.email.lower().strip()

    # Check if user already exists
    existing_user = await get_user_by_email(email)
    if existing_user:
        print(
            f"DEBUG: User with email '{email}' already exists (ID: {existing_user.id})"
        )
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    password_hash = hash_password(request.password)

    # Create the user
    try:
        user_id = await create_user(request.name, email, password_hash)
        print(f"DEBUG: Created new user with ID: {user_id}, email: {email}")
    except Exception as e:
        print(f"DEBUG: Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

    # Fetch and return the created user
    created_user = await get_user_by_email(email)

    return UserResponse(
        id=created_user.id, name=created_user.name, email=created_user.email
    )


@router.get("/auth/me", response_model=UserResponse)
async def get_current_user_profile(authorization: Optional[str] = Header(None)):
    """Get current user profile"""
    from ..db import get_user_by_id

    # Get token from Authorization header
    if authorization is None:
        raise HTTPException(
            status_code=401, detail="Not authenticated - No authorization header"
        )

    # Remove Bearer prefix if present
    token = authorization
    if token.startswith("Bearer "):
        token = token[7:]

    print(f"DEBUG: Received token: {token[:20]}...")  # Log first 20 chars

    payload = decode_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id_str = payload.get("sub")
    if user_id_str is None:
        raise HTTPException(status_code=401, detail="Invalid token - no user ID")

    try:
        user_id = int(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=401, detail="Invalid token - invalid user ID format"
        )

    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return UserResponse(id=user.id, name=user.name, email=user.email)


@router.get("/auth/session")
async def get_session(current_user: str = Depends(get_current_user)):
    """Get current session information"""
    if current_user:
        return {"user": {"id": current_user}}
    return {"user": None}
