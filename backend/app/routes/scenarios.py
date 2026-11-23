from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.scenario import AnalysisRun
from backend.app.models.alert import AlertDraft
from backend.app.schemas.scenario import ScenarioRunRequest, ScenarioRunResponse
from backend.app.services.flood_simulator import SCENARIO_CATALOG, simulate_hydrodynamic_run

router = APIRouter(prefix="/scenarios", tags=["Flood Lab Physics Simulation"])

@router.get("", response_model=List[Dict[str, Any]])
def get_scenario_catalog():
    catalog = []
    for sc_id, data in SCENARIO_CATALOG.items():
        catalog.append({
            "scenario_id": sc_id,
            "name": data["name"],
            "basin": data["basin"],
            "base_stage_m": data["base_stage_m"],
            "danger_threshold_m": data["base_danger_m"],
            "baseline_risk": data["base_risk"],
        })
    return catalog

@router.post("/run", response_model=ScenarioRunResponse)
def run_scenario(payload: ScenarioRunRequest, db: Session = Depends(get_db)):
    result = simulate_hydrodynamic_run(
        scenario_id=payload.scenario_id,
        upstream_multiplier=payload.upstream_inflow_multiplier,
        precipitation_mm=payload.precipitation_anomaly_mm,
        enable_jev=payload.enable_jev_supervision,
    )

    # Persist simulation run to database
    run = AnalysisRun(
        id=result["run_id"],
        scenario_name=result["scenario_name"],
        model_type=result["model_type"],
        pre_gate_pass=result["pre_gate_check"]["passed"],
        mid_gate_pass=result["mid_gate_check"]["passed"],
        post_gate_pass=result["post_gate_check"]["passed"],
        jev_status=result["jev_status"],
        peak_forecast_m=result["peak_forecast_m"],
        inundation_risk_index=result["inundation_risk_index"],
        executed_at=result["executed_at"],
    )
    db.add(run)

    # Automatically generate a pending CAP Alert Draft for the Incident Commander
    draft = AlertDraft(
        id=result["draft_id"],
        run_id=run.id,
        headline=f"Flood Stage Advisory: {result['scenario_name']}",
        description=f"Hydrodynamic model crest forecast reaches {result['peak_forecast_m']}m. Sluice gate aperture recommendation set to {result['recommended_gate_discharge_pct']}%.",
        severity="WARNING" if result["peak_forecast_m"] > 51.0 else "ADVISORY",
        urgency="EXPECTED",
        certainty="LIKELY",
        area_desc="Riparian lowlands and agricultural floodplains within target basin",
        recommended_actions="Initiate voluntary relocation of low-elevation assets and stage emergency pumps.",
        status="PENDING_REVIEW",
    )
    db.add(draft)
    db.commit()

    return result

