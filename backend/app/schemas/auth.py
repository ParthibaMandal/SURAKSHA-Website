from datetime import datetime
from typing import Optional
from pydantic import BaseModel

try:
    from pydantic import EmailStr
except Exception:
    EmailStr = str

class UserBase(BaseModel):
    email: str
    full_name: str
    phone_number: Optional[str] = None
    district: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None

