# Specialist Agent Specifications

| Field | Value |
|---|---|
| **Document ID** | AGT-08-002 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Module** | SURAKSHA-MOD-01-FLOOD |

---

## 1. Agent Inventory

| # | Agent Name | Class Name | Source File | Responsibilities |
|---|---|---|---|---|
| 1 | **Data Ingestion Agent** | `DataIngestionAgent` | `agents/data_agent.py` | Ingests CWC river telemetry, validates physical bounds, fills transient dropouts |
| 2 | **Weather Agent** | `WeatherAgent` | `agents/weather_agent.py` | Ingests IMD gridded precipitation, computes 24h cumulative rainfall & API |
| 3 | **Satellite Agent** | `SatelliteAgent` | `agents/satellite_agent.py` | Triggers GEE Sentinel-1 SAR extraction, applies Otsu segmentation & water mask |
| 4 | **Forecast Agent** | `ForecastAgent` | `agents/forecast_agent.py` | Executes SARIMA/BiLSTM/GRU models, generates 24h stage forecast & 90% CI |
| 5 | **Risk Assessment Agent**| `RiskAssessmentAgent` | `agents/risk_agent.py` | Computes calibrated risk score [0, 1] using dynamic stage-threshold curve |
| 6 | **Impact Assessment Agent**| `ImpactAssessmentAgent`| `agents/impact_agent.py` | Calculates flooded acreage, intersects with OSM population & infrastructure |
| 7 | **Verification Agent** | `VerificationAgent` | `agents/verification_agent.py` | Formats CAP v1.2 XML bulletin, logs audit trail, publishes final response |

---

## 2. Invariant Agent Contracts

- **Immutability**: Agents receive `FloodState` and return state delta dicts `{"water_level_m": ..., "agent_logs": [...]}`. Direct in-place mutation of the input state is strictly prohibited.
- **Audit Logging**: Every agent must append an entry to `agent_logs` containing execution timestamp, model version, runtime latency, and confidence score.
