from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class ScenarioRunRequest(BaseModel):
    scenario_id: str
    upstream_inflow_multiplier: float = Field(default=1.0, ge=0.5, le=3.0)
    precipitation_anomaly_mm: float = Field(default=0.0, ge=0.0, le=500.0)
    enable_jev_supervision: bool = True

class ScenarioRunResponse(BaseModel):
    run_id: str
    scenario_id: str
    scenario_name: str
    status: str
    model_type: str
    pre_gate_check: Dict[str, Any]
    mid_gate_check: Dict[str, Any]
    post_gate_check: Dict[str, Any]
    jev_status: str
    peak_forecast_m: float
    inundation_risk_index: float
    recommended_gate_discharge_pct: int
    cap_draft_generated: bool
    draft_id: Optional[str] = None
    executed_at: datetime

