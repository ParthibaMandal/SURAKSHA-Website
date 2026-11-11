from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class ObservationBase(BaseModel):
    water_level_m: float
    discharge_m3s: Optional[float] = None
    rainfall_mm: float = 0.0
    quality_flag: str = "VERIFIED"
    observed_at: datetime

class ObservationOut(ObservationBase):
    id: int
    station_id: str

    class Config:
        from_attributes = True

class StationBase(BaseModel):
    id: str
    name: str
    river: str
    basin: str
    latitude: float
    longitude: float
    warning_level_m: float
    danger_level_m: float
    hfl_m: float
    current_level_m: float
    status: str = "ACTIVE"
    quality_flag: str = "VERIFIED"

class StationOut(StationBase):
    last_observed_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

