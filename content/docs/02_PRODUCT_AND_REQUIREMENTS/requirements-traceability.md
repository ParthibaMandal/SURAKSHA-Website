# Requirements Traceability Matrix

| Field | Value |
|---|---|
| **Document ID** | REQ-02-002 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |

---

## 1. Traceability Mapping

| Req ID | Component Module | Implementation Code | Test Suite Verification | API Route |
|---|---|---|---|---|
| **FR-001** | Ingestion Engine | `ingestion/cwc_ffs_provider.py` | `tests/unit/test_cwc_ffs_provider.py` | `GET /stations/{id}` |
| **FR-002** | Weather Agent | `agents/weather_agent.py` | `tests/unit/test_weather_agent.py` | `POST /pipeline/run` |
| **FR-003** | Hydrology Ingestion | `ingestion/providers.py` | `tests/unit/test_providers.py` | `GET /stations/{id}/modelled-discharge` |
| **FR-004** | Pre-Run Gate | `supervisor/pre_run_gate.py` | `tests/flood/test_flood_supervisor.py` | `POST /pipeline/run` |
| **FR-005** | Policy Engine | `supervisor/policy_engine.py` | `tests/flood/test_flood_supervisor.py` | `POST /pipeline/run` |
| **FR-006** | Forecast Agent | `models/forecasting/arima_sarima.py` | `tests/unit/test_forecasting.py` | `POST /pipeline/run` |
| **FR-007** | Forecast Engine | `models/forecasting/arima_sarima.py` | `tests/unit/test_forecasting.py` | `POST /pipeline/run` |
| **FR-008** | Mid-Run Gate | `supervisor/mid_run_gate.py` | `tests/flood/test_flood_supervisor.py` | `POST /pipeline/run` |
| **FR-009** | Jev Intelligence | `core/intelligence/` | `tests/unit/test_jev_engine.py` | `POST /pipeline/run` |
| **FR-010** | Satellite Agent | `geospatial/s1_sar_processor.py` | `tests/unit/test_s1_sar_processor.py` | `POST /pipeline/run` |
| **FR-011** | Change Detection | `geospatial/change_detection.py` | `tests/unit/test_change_detection.py` | `POST /pipeline/run` |
| **FR-012** | Inundation Model | `geospatial/inundation_extent.py` | `tests/unit/test_inundation_extent.py` | `POST /pipeline/run` |
| **FR-013** | Risk Agent | `agents/risk_agent.py` | `tests/unit/test_risk_agent.py` | `POST /pipeline/run` |
| **FR-014** | Impact Agent | `agents/impact_agent.py` | `tests/unit/test_impact_agent.py` | `POST /pipeline/run` |
| **FR-015** | Post-Run Gate | `supervisor/post_run_gate.py` | `tests/flood/test_flood_supervisor.py` | `POST /pipeline/run` |
| **FR-016** | Alerting Engine | `alerting/cap_generator.py` | `tests/unit/test_cap_generator.py` | `POST /alert/generate` |
| **FR-017** | SITREP Engine | `intelligence/sitrep_generator.py` | `tests/unit/test_sitrep_generator.py` | `POST /sitrep` |
| **FR-018** | Triage Engine | `intelligence/citizen_triage.py` | `tests/unit/test_citizen_triage.py` | `POST /citizen/sos` |
| **FR-019** | Offline Fallbacks| `core/geospatial/earth_engine_client.py` | `tests/flood/test_observation_lifecycle.py` | `GET /health` |
| **FR-020** | State Management| `contracts/flood_state.py` | `tests/unit/test_contracts.py` | `POST /pipeline/run` |
