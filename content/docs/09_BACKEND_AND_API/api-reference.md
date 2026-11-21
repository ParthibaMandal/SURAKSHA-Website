# SURAKSHA REST API Reference

| Field | Value |
|---|---|
| **Document ID** | API-09-002 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Base URL** | `http://localhost:8000/api/v1/flood` |
| **Source Implementation** | `src/suraksha/disasters/flood/api/routes.py` |

---

## 1. Endpoint Overview

| Method | Endpoint | Summary | Auth |
|---|---|---|---|
| `GET` | `/health` | Subsystem health, model readiness, telemetry status | None |
| `GET` | `/stations` | List configured hydrological gauge stations | None |
| `GET` | `/stations/{station_id}` | Station metadata, warning/danger/HFL levels | None |
| `GET` | `/stations/{station_id}/modelled-discharge` | 7-day GloFAS/Open-Meteo forward discharge | None |
| `POST` | `/pipeline/run` | Execute 7-agent scientific pipeline (supervised/static) | Optional / Operator |
| `POST` | `/alert/generate` | Generate OASIS CAP v1.2 XML & JSON alert payload | Operator |
| `POST` | `/sitrep` | Generate disaster management Situation Report (SITREP) | Operator |
| `POST` | `/advisory` | Generate persona-targeted flood advisory (farmers, public) | None |
| `POST` | `/citizen/sos` | Ingest and NLP-triage citizen distress SOS report | None |
| `GET` | `/demo/scenarios` | List verified synthetic stress-test scenarios | None |
| `POST` | `/demo/scenarios/{id}/run` | Execute end-to-end pipeline against scenario | None |

---

## 2. Endpoint Details

### 2.1 `GET /api/v1/flood/health`
Returns runtime status, loaded model checkpoints, and data provider configurations.

**Response Schema (`200 OK`)**:
```json
{
  "status": "HEALTHY",
  "operational_readiness": "OPERATIONAL",
  "subsystem": "SURAKSHA-MOD-01-FLOOD",
  "supervisor": {
    "mode": "Jev-Supervised Multi-Stage Scientific Architecture",
    "three_gates": ["Pre-Run Gate", "Mid-Run Gate", "Post-Run Gate"],
    "committee_models": ["SARIMA", "GRU", "Hybrid BiLSTM"],
    "fast_fallbacks": ["ARIMA", "Persistence"],
    "supported_modes": ["supervised", "static"]
  },
  "production_forecaster": {
    "model_name": "SARIMA(1,1,1)x(1,0,1,24)",
    "is_trained": true,
    "execution_ready": true,
    "lifecycle": "Pre-loaded in-memory (No runtime fitting delay)"
  },
  "production_risk_model": {
    "engine": "CalibratedThresholdRiskEngine",
    "is_trained": true
  },
  "station_catalog": {
    "total_stations": 2,
    "basins": ["Ganges", "Brahmaputra"]
  }
}
```

### 2.2 `POST /api/v1/flood/pipeline/run`
Executes the scientific flood DAG.

**Request Payload (`PipelineRunRequest`)**:
```json
{
  "station_id": "GANGES_PATNA",
  "water_level_m": 48.75,
  "rainfall_24h_mm": 65.4,
  "soil_saturation": 0.85,
  "river_discharge_m3s": 38500.0,
  "execution_mode": "supervised"
}
```

**Response Payload (`200 OK`)**:
```json
{
  "run_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "execution_mode": "supervised",
  "data_regime": "RAPID_RISE",
  "forecast": {
    "horizon_hours": 24,
    "predicted_stage_m": 49.32,
    "lower_bound_m": 48.85,
    "upper_bound_m": 49.79,
    "champion_model": "SARIMA_111_101_24"
  },
  "geospatial": {
    "inundated_area_km2": 42.8,
    "permanent_water_km2": 18.2,
    "sensor_status": "GEE_LIVE"
  },
  "risk": {
    "score": 0.82,
    "category": "HIGH"
  },
  "impact": {
    "affected_population": 85400,
    "critical_facilities_at_risk": 12
  },
  "supervisory_verdict": {
    "is_authoritative": true,
    "requires_human_escalation": false,
    "jev_actions_invoked": ["RUN_CHALLENGER_MODEL"]
  }
}
```

### 2.3 `POST /api/v1/flood/citizen/sos`
Triage raw distress messages from citizens during an active flood.

**Request**:
```json
{
  "message": "Water has entered our ground floor near Danapur station, 4 people stranded on roof.",
  "contact_phone": "+91-9876543210",
  "reported_location": "Danapur, Patna",
  "latitude": 25.63,
  "longitude": 85.04
}
```
