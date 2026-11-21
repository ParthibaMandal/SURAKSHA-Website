# SURAKSHA Data Dictionary

| Field | Value |
|---|---|
| **Document ID** | DDC-05-002 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Module** | SURAKSHA-MOD-01-FLOOD |
| **Source Schema** | `src/suraksha/disasters/flood/contracts/flood_state.py` |

---

## 1. Overview

The SURAKSHA platform uses strongly typed data contracts defined via Pydantic v2 `BaseModel`. This document provides the comprehensive data dictionary for all pipeline schemas, field definitions, physical units, allowed ranges, nullability, and validation invariants.

---

## 2. Core State Schema: `FloodState`

`FloodState` is the centralized, immutable pipeline state container passed across the 7-agent DAG and through the 3 supervisory lifecycle gates.

### 2.1 Identifiers and Temporal Attributes

| Field Name | Type | Units | Range / Format | Nullable | Description |
|---|---|---|---|---|---|
| `run_id` | `str` | UUID | UUIDv4 string | No | Unique execution run identifier |
| `timestamp` | `datetime` | UTC | ISO 8601 | No | Pipeline execution initialization timestamp |
| `station_id` | `str` | String | Station code (e.g., `023-MDGANG`) | No | CWC / Internal hydrological station identifier |
| `basin` | `str` | Name | River basin (e.g., `Ganges`) | No | Monitored drainage basin |
| `execution_mode` | `str` | Enum | `supervised` \| `static` | No | Operational mode: adaptive 3-gate vs. linear |

### 2.2 Hydrological Telemetry

| Field Name | Type | Units | Range / Format | Nullable | Description |
|---|---|---|---|---|---|
| `water_level_m` | `float` | meters (MSL) | [0.0, 55.0] | No | Current river stage elevation above Mean Sea Level |
| `discharge_m3s` | `float` | $m^3/s$ | [0.0, 100,000.0] | Yes | River volumetric flow discharge rate |
| `stage_trend_1h` | `float` | m/h | [-5.0, 5.0] | Yes | 1-hour rate of change in stage elevation |
| `warning_level_m` | `float` | meters (MSL) | 47.60 (Gandhi Ghat) | No | Official CWC Warning Level threshold |
| `danger_level_m` | `float` | meters (MSL) | 48.60 (Gandhi Ghat) | No | Official CWC Danger Level threshold |
| `hfl_m` | `float` | meters (MSL) | 50.52 (Gandhi Ghat) | No | Historical Highest Flood Level (crest in 2016) |

### 2.3 Meteorological Observations

| Field Name | Type | Units | Range / Format | Nullable | Description |
|---|---|---|---|---|---|
| `rainfall_mm` | `float` | mm | [0.0, 500.0] | No | Current 1-hour observed precipitation |
| `rainfall_24h_mm` | `float` | mm | [0.0, 1000.0] | Yes | Antecedent 24-hour cumulative precipitation |
| `soil_moisture_pct`| `float` | % | [0.0, 100.0] | Yes | Catchment volumetric root-zone soil saturation |
| `upstream_rainfall_mean_mm` | `float` | mm | [0.0, 500.0] | Yes | Areal catchment rainfall over upstream reach |

### 2.4 Earth Observation & Geospatial Extents

| Field Name | Type | Units | Range / Format | Nullable | Description |
|---|---|---|---|---|---|
| `satellite_scene_id` | `str` | String | Sentinel-1 GRD ID | Yes | Unique Copernicus scene identifier |
| `inundation_area_km2` | `float` | $km^2$ | [0.0, 500.0] | No | SAR-derived flood extent (permanent water masked) |
| `permanent_water_km2`| `float` | $km^2$ | [0.0, 200.0] | Yes | Baseline surface water area from JRC GSW |
| `sensor_mode` | `str` | Enum | `GEE_LIVE` \| `OFFLINE_CALIBRATED` | No | Earth observation data acquisition mode |

### 2.5 Hydrological Forecasts

| Field Name | Type | Units | Range / Format | Nullable | Description |
|---|---|---|---|---|---|
| `forecast_stage_24h` | `float` | meters (MSL) | [0.0, 55.0] | No | Predicted river stage 24 hours ahead |
| `forecast_stage_lower_bound` | `float` | meters (MSL) | [0.0, 55.0] | No | 90% Confidence interval lower bound |
| `forecast_stage_upper_bound` | `float` | meters (MSL) | [0.0, 55.0] | No | 90% Confidence interval upper bound |
| `champion_model_name` | `str` | String | Model ID (e.g. `SARIMA_111_101_24`) | No | Model that produced the primary forecast |
| `committee_spread_m` | `float` | meters | [0.0, 10.0] | Yes | Divergence between ensemble models |

### 2.6 Risk and Socio-Economic Exposure

| Field Name | Type | Units | Range / Format | Nullable | Description |
|---|---|---|---|---|---|
| `risk_score` | `float` | Normalized | [0.0, 1.0] | No | Multi-factor calibrated flood risk score |
| `risk_category` | `str` | Enum | `LOW` \| `MODERATE` \| `HIGH` \| `CRITICAL` | No | Operational risk category |
| `affected_population` | `int` | Persons | [0, 5,000,000] | No | Estimated exposed population in inundated zone |
| `critical_infrastructure_count` | `int` | Facilities | [0, 10,000] | No | Hospitals, bridges, substations exposed |

### 2.7 Governance and Supervisory Metadata

| Field Name | Type | Units | Range / Format | Nullable | Description |
|---|---|---|---|---|---|
| `data_regime` | `str` | Enum | `NORMAL` \| `RAPID_RISE` \| `EXTREME_RAINFALL` \| `SENSOR_CONFLICT` | No | Telemetry classification from Pre-Run Gate |
| `is_authoritative` | `bool` | Boolean | `True` \| `False` | No | Whether released for public civil defense dissemination |
| `requires_human_escalation` | `bool` | Boolean | `True` \| `False` | No | Whether escalated to duty hydrologist / civil officer |
| `jev_verdicts` | `list[dict]`| JSON List | Supervisor action logs | No | Audit trail of supervisory interventions |
| `agent_logs` | `list[dict]`| JSON List | Agent execution logs | No | Immutable append-only audit trail of agent steps |
