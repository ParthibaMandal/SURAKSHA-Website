from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class GateOut(BaseModel):
    id: str
    station_id: str
    name: str
    current_opening_pct: int
    recommended_opening_pct: Optional[int] = None
    discharge_rate_cusecs: float
    mode: str
    last_actuated_at: datetime

    class Config:
        from_attributes = True

class GateActuate(BaseModel):
    target_opening_pct: int = Field(..., ge=0, le=100)
    override_reason: str = Field(..., min_length=5)

