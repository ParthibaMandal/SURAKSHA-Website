from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class SOSSubmitRequest(BaseModel):
    citizen_name: str = Field(..., min_length=2, max_length=150)
    phone_number: str = Field(..., min_length=8, max_length=30)
    emergency_type: str = Field(default="TRAPPED_WATER")
    severity: str = Field(default="CRITICAL")
    people_count: int = Field(default=1, ge=1, le=100)
    latitude: float
    longitude: float
    landmark_address: str = Field(..., min_length=5)
    additional_notes: Optional[str] = None

class SOSTriageUpdate(BaseModel):
    status: str = Field(..., pattern="^(PENDING|DISPATCHED|RESCUED|RESOLVED)$")
    assigned_team: Optional[str] = None
    notes: Optional[str] = None

class SOSOut(BaseModel):
    id: str
    user_id: Optional[int] = None
    citizen_name: str
    phone_number: str
    emergency_type: str
    severity: str
    people_count: int
    latitude: float
    longitude: float
    landmark_address: str
    status: str
    assigned_team: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

