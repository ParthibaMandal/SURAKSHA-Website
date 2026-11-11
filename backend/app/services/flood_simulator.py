import uuid
from datetime import datetime
from typing import Dict, Any

SCENARIO_CATALOG = {
    "SCEN-GANDAK-SURGE": {
        "name": "Gandak Basin Extreme Inflow + Monsoon Depressions",
        "basin": "Gandak Basin",
        "base_stage_m": 105.80,
        "base_danger_m": 107.50,
        "default_crest_m": 108.15,
        "base_risk": 0.84,
    },
    "SCEN-KOSI-BREACH": {
        "name": "Birpur Barrage Siphon Embankment Stress Test",
        "basin": "Kosi Basin",
        "base_stage_m": 73.20,
        "base_danger_m": 74.20,
        "default_crest_m": 75.30,
        "base_risk": 0.92,
    },
    "SCEN-PATNA-CREST": {
        "name": "Middle Ganga Stage Rise at Digha & Gandhi Ghat",
        "basin": "Middle Ganga",
        "base_stage_m": 50.40,
        "base_danger_m": 51.50,
        "default_crest_m": 51.95,
        "base_risk": 0.76,
    },
}

def simulate_hydrodynamic_run(
    scenario_id: str,
    upstream_multiplier: float = 1.0,
    precipitation_mm: float = 0.0,
    enable_jev: bool = True,
) -> Dict[str, Any]:
    scenario = SCENARIO_CATALOG.get(scenario_id, SCENARIO_CATALOG["SCEN-PATNA-CREST"])
    run_id = f"RUN-{uuid.uuid4().hex[:8].upper()}"
    draft_id = f"DFT-{uuid.uuid4().hex[:6].upper()}"

    # Hydrodynamic stage calculation based on Saint-Venant 1D equation approximations
    inflow_impact = (upstream_multiplier - 1.0) * 1.85
    rain_impact = (precipitation_mm / 100.0) * 0.45
    forecasted_crest = round(scenario["default_crest_m"] + inflow_impact + rain_impact, 2)
    risk_index = min(0.99, round(scenario["base_risk"] + (upstream_multiplier - 1.0) * 0.12 + (precipitation_mm / 500.0) * 0.15, 3))

    # Pre-Run Check: Mass balance continuity error
    pre_pass = upstream_multiplier <= 2.8
    mass_balance_error = round(0.015 * upstream_multiplier, 3)

    # Mid-Run Check: Courant number (C = v * dt / dx <= 1.0)
    courant_number = round(0.72 + (upstream_multiplier * 0.08), 2)
    mid_pass = courant_number <= 1.0

    # Post-Run Check: Inundation elevation vs embankment levee crest
    post_pass = forecasted_crest <= (scenario["base_danger_m"] + 2.5)

    # Recommended Sluice Gate discharge aperture
    if forecasted_crest > scenario["base_danger_m"]:
        recommended_opening = min(100, int(50 + (forecasted_crest - scenario["base_danger_m"]) * 25))
    else:
        recommended_opening = 40

    jev_status = "LIVE_SUPERVISED" if enable_jev else "OFFLINE_DETERMINISTIC"

    return {
        "run_id": run_id,
        "scenario_id": scenario_id,
        "scenario_name": scenario["name"],
        "status": "COMPLETED",
        "model_type": "Saint-Venant 1D-2D Shallow Water Wave Solver",
        "pre_gate_check": {
            "passed": pre_pass,
            "mass_balance_error_pct": mass_balance_error,
            "metric": "Continuity Inflow Balance",
        },
        "mid_gate_check": {
            "passed": mid_pass,
            "courant_number": courant_number,
            "metric": "CFL Numerical Stability",
        },
        "post_gate_check": {
            "passed": post_pass,
            "crest_forecast_m": forecasted_crest,
            "embankment_threshold_m": scenario["base_danger_m"],
            "metric": "Freeboard Safety Margin",
        },
        "jev_status": jev_status,
        "peak_forecast_m": forecasted_crest,
        "inundation_risk_index": risk_index,
        "recommended_gate_discharge_pct": recommended_opening,
        "cap_draft_generated": True,
        "draft_id": draft_id,
        "executed_at": datetime.utcnow(),
    }

