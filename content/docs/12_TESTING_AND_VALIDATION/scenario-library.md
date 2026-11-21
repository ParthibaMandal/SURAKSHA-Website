# Synthetic Stress-Test Scenario Library

| Field | Value |
|---|---|
| **Document ID** | TST-12-002 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Scenarios Defined** | 10 Canonical Scenarios |
| **Source Implementation** | `src/suraksha/disasters/flood/testing/synthetic_hydrograph.py` |

---

## 1. Catalog of Scenarios

| # | Scenario ID | Hydrological Condition | Stress Test Purpose | Expected Pipeline Behavior |
|---|---|---|---|---|
| 1 | `NORMAL_MONSOON_STEADY` | Stage 45.2m, Rain 12mm/24h | Baseline normal operation | Fast-path SARIMA, risk `LOW`, no alerts |
| 2 | `CLOUDBURST_FLASH_FLOOD` | Rain 145mm/3h, rapid rise | Hydrometeorological shock | 3-model committee, risk `HIGH`, CAP Warning |
| 3 | `UPSTREAM_DAM_SURGE` | Discharge $+80\%$, no local rain | Upstream wave propagation | Detects discharge jump, predicts crest in 18h |
| 4 | `SENSOR_TELEMETRY_DROPOUT`| Gauge dead for 4 hours | Missing input resilience | Activates persistence fallback with warning |
| 5 | `RADAR_SHADOW_SMOKE` | Dense clouds + satellite glitch | GEE failure resilience | Activates offline calibrated SAR polygon |
| 6 | `DIVERGENT_MODEL_SPREAD` | SARIMA vs BiLSTM $\Delta > 0.85$m | Committee conflict handling | Flagged for human civil defense escalation |
| 7 | `FALSE_ALARM_SPIKE` | Sudden $+4.0$m single-hour blip | Sensor noise rejection | Pre-run gate rejects spike as physically invalid |
| 8 | `RECESSION_LIMB_POST_FLOOD`| Stage dropping from 49.8m | Post-event recovery | Tracks drainage rate, de-escalates alerts |
| 9 | `URBAN_DRAINAGE_LOCK` | River stage $>48.6$m + local rain | Sluice gate gravity lock | Computes compound urban backwater pooling |
| 10 | `EXTREME_2016_REPEAT` | Stage 50.52m (Historical HFL) | Catastrophic stress test | Emergency alert, full district evacuation plan |
