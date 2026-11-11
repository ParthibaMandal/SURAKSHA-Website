from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class AlertDraftOut(BaseModel):
    id: str
    run_id: Optional[str] = None
    headline: str
    description: str
    severity: str
    urgency: str
    certainty: str
    area_desc: str
    recommended_actions: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AlertApproveRequest(BaseModel):
    decision: str = Field(..., pattern="^(APPROVE|REJECT)$")
    commander_comments: str = Field(..., min_length=3)
    effective_hours: int = Field(default=24, ge=1, le=72)

class AlertOut(BaseModel):
    id: str
    draft_id: Optional[str] = None
    cap_identifier: str
    headline: str
    description: str
    severity: str
    urgency: str
    area_desc: str
    approved_by: str
    approved_at: datetime
    expires_at: datetime
    status: str

    class Config:
        from_attributes = True

