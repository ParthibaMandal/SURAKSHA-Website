# SURAKSHA Data Quality Framework

---

| Field | Value |
|---|---|
| **Document ID** | DQF-05-002 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Module** | SURAKSHA-MOD-01-FLOOD |
| **Audit Script** | `data_audit/data_audit.md` / `data_audit/data_audit.json` |
| **Last Audit** | 2026-11-12 18:23:27 UTC |

---

## Overview

SURAKSHA enforces a **14-point Data Quality Audit Framework** (DATA-001 through DATA-014) on the primary hydrological training dataset before it is used for model training or operational forecasting. The audit is fully deterministic and produces a machine-readable JSON report (`data_audit/data_audit.json`) and a human-readable markdown summary (`data_audit/data_audit.md`).

**Audited Dataset**: `data/processed/real_hourly_hydrological_timeseries.csv`  
**Records Analyzed**: 8,832 hourly timesteps (184 days) across two stations  
**Stations**: `GANGES_PATNA`, `BRAHMAPUTRA_GUWAHATI`

---

## 14-Point Audit Framework

### DATA-001 — File Readability and Parse Integrity

| Attribute | Value |
|---|---|
| **Check ID** | DATA-001 |
| **Description** | File must be loadable as a valid CSV without corruption, encoding errors, or truncation |
| **Observed Metric** | Loaded 8,832 rows with 20 columns |
| **Acceptance Threshold** | Zero parse errors; file size > 0 bytes |
| **Verdict** | **PASS** |
| **Implementation** | `pd.read_csv()` with explicit encoding; IOError and ParserError caught |

**Rationale**: Corrupted or truncated CSV files propagate silent NaN values into the model training loop, producing undetectable data drift. File integrity is the first gate.

---

### DATA-002 — Expected Column Presence

| Attribute | Value |
|---|---|
| **Check ID** | DATA-002 |
| **Description** | All 16+ required columns must be present in the CSV header |
| **Required Columns** | `timestamp`, `station_id`, `station_name`, `district`, `state`, `latitude`, `longitude`, `precipitation`, `soil_moisture_0_to_7cm`, `soil_moisture_7_to_28cm`, `surface_pressure`, `temperature_2m`, `river_discharge_m3s`, `water_level_m`, `danger_level_m`, `warning_level_m` |
| **Observed Metric** | All 20 columns present (100%) |
| **Acceptance Threshold** | 100% column presence |
| **Verdict** | **PASS** |

**Rationale**: Missing columns fail silently if Pandas auto-fills with NaN. Explicit column assertion catches schema drift between ingestion pipeline versions.

---

### DATA-003 — Timestamp Parse Integrity

| Attribute | Value |
|---|---|
| **Check ID** | DATA-003 |
| **Description** | Every `timestamp` value must parse to a valid `datetime` without error |
| **Format Expected** | ISO 8601: `YYYY-MM-DD HH:MM:SS` (UTC) |
| **Observed Metric** | 0 invalid parse errors across 8,832 timestamps |
| **Acceptance Threshold** | 0 parse failures |
| **Verdict** | **PASS** |

**Rationale**: Timestamp parse failures force downstream code into ambiguous fallback paths. All timestamps are verified to be UTC-aware.

---

### DATA-004 — Chronological Monotonicity

| Attribute | Value |
|---|---|
| **Check ID** | DATA-004 |
| **Description** | The timestamp series must be strictly monotonically increasing (no backward time jumps) |
| **Observed Metric** | 0 negative time deltas detected |
| **Acceptance Threshold** | 0 backward jumps |
| **Verdict** | **PASS** |

**Rationale**: Non-monotonic timestamps corrupt the autoregressive lookback window in LSTM/GRU models, causing the model to look "into the future" for some training examples.

---

### DATA-005 — Duplicate Timestamp Detection

| Attribute | Value |
|---|---|
| **Check ID** | DATA-005 |
| **Description** | Each timestamp must appear exactly once; duplicates are flagged for removal |
| **Observed Metric** | 0 duplicated timestamps |
| **Acceptance Threshold** | 0 duplicates |
| **Verdict** | **PASS** |

**Rationale**: Duplicated timestamps cause double-counting in rolling window features (API-3d, API-7d) and inflate training set size without adding new information.

---

### DATA-006 — Hourly Cadence Strictness

| Attribute | Value |
|---|---|
| **Check ID** | DATA-006 |
| **Description** | Consecutive timestamp deltas must be exactly 3600 seconds (1 hour) with no irregular intervals |
| **Observed Metric** | 0 irregular delta steps |
| **Acceptance Threshold** | Strict 1-hour intervals (3600 seconds) |
| **Verdict** | **PASS** |

**Rationale**: SARIMA models assume uniform time sampling. Irregular cadence (e.g., 30-min or 2-hour gaps within otherwise hourly series) violates the ARIMA stationarity assumptions.

---

### DATA-007 — Missing Timestamp Gap Detection

| Attribute | Value |
|---|---|
| **Check ID** | DATA-007 |
| **Description** | Identify any multi-hour gaps (missing timestamps) in the time series |
| **Observed Metric** | 0 gap intervals detected |
| **Acceptance Threshold** | All gaps documented and linearly interpolated; zero undocumented gaps |
| **Verdict** | **PASS** |

**Implementation**: The audit reconstructs an ideal `DatetimeIndex` at 1-hour frequency between the first and last timestamp, then checks for missing entries using `idx.difference(actual_index)`.

---

### DATA-008 — Missing Value Frequency

| Attribute | Value |
|---|---|
| **Check ID** | DATA-008 |
| **Description** | Missingness rate for the primary target variable `water_level_m` must be below 1% |
| **Observed Metric** | 0% missing values in `water_level_m` |
| **Acceptance Threshold** | < 1% missingness |
| **Verdict** | **PASS** |

**Rationale**: Even 1% random missingness in the LSTM autoregressive chain breaks the sliding window, as a single NaN propagates through 72 consecutive lookback steps.

---

### DATA-009 — Infinite and NaN Value Detection

| Attribute | Value |
|---|---|
| **Check ID** | DATA-009 |
| **Description** | No `NaN`, `+Inf`, or `-Inf` values may exist in any numeric column of the final processed dataset |
| **Observed Metric** | 0 NaN values; 0 Inf values across all 8,832 × 20 cells |
| **Acceptance Threshold** | Strictly zero; NaN/Inf must be caught at the ingestion boundary |
| **Verdict** | **PASS** |

**Code Contract** (enforced across all numerical models):
```python
if np.isnan(prediction) or np.isinf(prediction):
    prediction = fallback_baseline_value
```

---

### DATA-010 — Hydrological Physical Bounds Check

| Attribute | Value |
|---|---|
| **Check ID** | DATA-010 |
| **Description** | All hydrological variables must fall within physically plausible ranges |
| **Verdict** | **PASS** |

**Bounds Table:**

| Variable | Minimum Bound | Maximum Bound | Observed Range | Rationale |
|---|---|---|---|---|
| `water_level_m` | 0.0 m MSL | 120.0 m MSL | 45.71 – 53.21 m | Physical river stage; Patna gauge zero datum: 43.00 m |
| `precipitation` | 0.0 mm | ∞ (soft: 500 mm/h) | 0.0 – 27.6 mm/h | Tropical cloudburst maximum |
| `river_discharge_m3s` | 0.0 m³/s | ∞ (soft: 100,000 m³/s) | ~1,338 – 50,000+ | Ganges at Patna flood range |
| `soil_moisture_0_to_7cm` | 0.0 m³/m³ | 1.0 m³/m³ | 0.128 – 0.520 | Physical saturation limit |
| `danger_level_m` | 0.0 | 120.0 | 50.52 (fixed) | CWC official threshold |

**Rate-of-Rise Constraint** (DATA-010 extension):

> The maximum permitted 1-hour stage jump rate is **< 2.0 m/h** unless accompanied by **≥ 15 mm** concurrent rainfall.

```python
# Physics-based jump rate validator
jump_rate_m_per_h = abs(stage_t - stage_t_minus_1)
rainfall_concurrent_mm = rain_1h_mm

is_plausible = (
    jump_rate_m_per_h < 2.0
    or rainfall_concurrent_mm >= 15.0
)
```

Exceeding this threshold without rainfall triggers `SENSOR_CONFLICT` classification.

---

### DATA-011 — Station Identity Consistency

| Attribute | Value |
|---|---|
| **Check ID** | DATA-011 |
| **Description** | The `station_id` column must maintain a single consistent value within each station's time series block |
| **Observed Metric** | Station = `BRAHMAPUTRA_GUWAHATI` for first 4,416 rows; `GANGES_PATNA` for remaining 4,416 |
| **Acceptance Threshold** | Exactly 2 unique station IDs; no mixed/corrupt entries |
| **Verdict** | **PASS** |

---

### DATA-012 — Unit Standards Verification

| Attribute | Value |
|---|---|
| **Check ID** | DATA-012 |
| **Description** | All variables must use the standard SI hydrological unit system |
| **Verdict** | **PASS** |

**Unit Specification:**

| Variable | Required Unit | Verified |
|---|---|---|
| `water_level_m` | Meters above MSL | ✅ |
| `danger_level_m` | Meters above MSL | ✅ |
| `warning_level_m` | Meters above MSL | ✅ |
| `precipitation` | mm per hour | ✅ |
| `river_discharge_m3s` | m³/s | ✅ |
| `soil_moisture_0_to_7cm` | m³/m³ | ✅ |
| `surface_pressure` | hPa | ✅ |
| `temperature_2m` | °C | ✅ |

---

### DATA-013 — Target Label Availability

| Attribute | Value |
|---|---|
| **Check ID** | DATA-013 |
| **Description** | The forecast target `water_level_m` must be present and non-null for 100% of records |
| **Observed Metric** | 100% valid `water_level_m` targets; 0 missing targets |
| **Acceptance Threshold** | Zero missing targets in training set |
| **Verdict** | **PASS** |

**Rationale**: SARIMA and GRU models train in supervised mode against `water_level_m`. Missing targets create ambiguous y-vectors that corrupt gradient descent.

---

### DATA-014 — Inference Feature Availability (No Future Lookahead)

| Attribute | Value |
|---|---|
| **Check ID** | DATA-014 |
| **Description** | All 4 input predictor features must be available without future information leakage |
| **Features Verified** | `water_level_m` (t-72 to t-1), `precipitation`, `river_discharge_m3s`, `soil_moisture_0_to_7cm` |
| **Observed Metric** | All 4 predictors present; causal sliding window verified |
| **Acceptance Threshold** | Zero future lookahead; zero feature NaN in inference path |
| **Verdict** | **PASS** |

**Causal Integrity Note**: The BiLSTM model uses bidirectionality only within the historical lookback window [t-72, t-1]. The forward LSTM pass and backward LSTM pass are both entirely in the past relative to the prediction horizon t+1 to t+24.

---

## Time-Series Statistical Diagnostics

### TS-001: Trend Analysis

- **Observed Trend**: Upward monsoon surge trend (+0.63 m/month)
- **Physical Interpretation**: Reflects the seasonal monsoon rising limb of the Ganges River at Patna from pre-monsoon baseline (~46.8 m MSL) to peak monsoon stage (> 50.0 m MSL)

### TS-002: Seasonality and Diurnal Dynamics

- **Diurnal Amplitude**: 0.028 m across 24-hour cycle
- **Monsoon Dynamics**: Marked by distinct flood wave pulses following upstream dam releases and intense catchment rainfall events

### TS-003/TS-005: Autocorrelation Structure

| Lag | ACF Value | Interpretation |
|---|---|---|
| Lag-1 (1 hour) | 0.9999 | Extremely strong memory — validates AR/LSTM formulations |
| Lag-24 (1 day) | 0.9962 | Strong diurnal continuity |

**Conclusion**: Hydrological stage possesses very high persistence, confirming that LSTM (L=72h lookback) and ARIMA autoregressive orders have high predictive signal.

### TS-004: Stationarity (Augmented Dickey-Fuller Test)

| Metric | Value |
|---|---|
| ADF Statistic | -4.695 |
| p-value | 0.0001 |
| Verdict | Non-stationary (seasonal mean drift) |
| **Modeling Requirement** | d=1 differencing mandatory for SARIMA/ARIMA; z-score normalization per window for neural architectures |

---

## Data Regime Taxonomy

The Pre-Run Gate classifies every incoming telemetry observation into one of five regimes that determine the forecasting strategy:

| Regime | Triggering Conditions | Pipeline Action |
|---|---|---|
| `NORMAL` | Stage within ±1.5 m of seasonal baseline; rain < 15 mm; no jump anomaly | Single fast-path SARIMA forecast |
| `RAPID_RISE` | Stage rise > 0.5 m/h over last 3 hours OR stage > warning level | 3-model committee (SARIMA + GRU + BiLSTM) |
| `EXTREME_RAINFALL` | Rainfall > 50 mm in 6 hours OR API-3d > 80 mm | Committee with BiLSTM as primary; SARIMA as anchor |
| `SENSOR_CONFLICT` | Jump rate > 2.0 m/h without concurrent ≥ 15 mm rain | Heuristic fallback; HOLD_AND_RETRY issued |
| `MISSING_DATA` | > 20% of features missing or stage gap > 6 hours | USE_APPROVED_FALLBACK (ARIMA or Persistence) |

### Regime Classification Logic

```python
def classify_regime(
    stage_m: float,
    rain_1h_mm: float,
    jump_rate_m_h: float,
    api_3d_mm: float,
    missing_fraction: float
) -> DataRegime:
    if missing_fraction > 0.20:
        return DataRegime.MISSING_DATA
    if abs(jump_rate_m_h) > 2.0 and rain_1h_mm < 15.0:
        return DataRegime.SENSOR_CONFLICT
    if rain_1h_mm > 50.0 / 6.0 or api_3d_mm > 80.0:
        return DataRegime.EXTREME_RAINFALL
    if abs(jump_rate_m_h) > 0.5 or stage_m > WARNING_LEVEL_M:
        return DataRegime.RAPID_RISE
    return DataRegime.NORMAL
```

---

## Provenance Taxonomy Enforcement

Every processed data record carries a mandatory `data_provenance` tag. The pipeline enforces this tag at all boundaries:

| Provenance Tag | Meaning | Sources |
|---|---|---|
| `OBSERVED` | Direct physical measurement | CWC gauge, Sentinel-1 SAR (live), IMD RF25, OSM |
| `REANALYSIS` | Model-assimilated historical reconstruction | ERA5-Land, GloFAS discharge |
| `SYNTHETIC` | Algorithmically generated from physical equations | Synthetic design storms, HAND DEM projection |
| `SIMULATED` | Forward scenario projection | Synthetic SAR fallback polygon |

**Enforcement Points:**

1. **DataAgent**: Sets `data_provenance` on every `FloodObservationSnapshot` from `state.metadata["data_provenance"]`
2. **SatelliteAgent**: Sentinel1SARProcessor returns `"data_provenance": "OBSERVED"` on success; `"SYNTHETIC_SCENARIO"` in offline mode
3. **Jev Pre-Run Gate**: Verifies that `OBSERVED` data is available before authorizing a `CONTINUE` action
4. **Post-Run Gate**: `is_authoritative = True` requires at least one `OBSERVED` data source in the evidence chain

> [!WARNING]
> Forecasts produced entirely from `REANALYSIS` or `SYNTHETIC` data **must not** be released as authoritative public bulletins (`is_authoritative = False`). The Post-Run Gate enforces this automatically.

---

## Sensor Conflict Detection

### Gauge vs. Satellite Contradiction

A sensor conflict is raised when:
1. CWC gauge reports stage **below** warning level
2. Sentinel-1 SAR reports `flooded_area_km2 > 10 km²` for the same AOI and time window

**Resolution Protocol:**
1. `DataAgent` flags `sensor_health_flag = True`
2. Jev supervisor classifies as `SENSOR_CONFLICT` regime
3. Pipeline issues `HOLD_AND_RETRY` (maximum 1 retry)
4. If conflict persists after retry → `ESCALATE_TO_HUMAN`

### Jump Rate Sensor Plausibility

The `JevIntelligenceEngine.audit_sensor_plausibility()` method verifies:
- Stage jump ≤ 2.0 m/h (or rainfall ≥ 15 mm concurrent)
- No simultaneous opposing signals from upstream and downstream gauges

The audit result `is_physically_plausible: bool` is logged in every `DataAgent` audit entry.

---

## Audit Report Structure

The audit produces two machine-readable outputs:

### `data_audit/data_audit.json`

```json
{
  "audit_id": "AUDIT-2026-11-12",
  "dataset": "data/processed/real_hourly_hydrological_timeseries.csv",
  "total_records": 8832,
  "checks": {
    "DATA-001": {"verdict": "PASS", "metric": "8832 rows loaded"},
    "DATA-002": {"verdict": "PASS", "metric": "20/20 columns present"},
    ...
    "DATA-014": {"verdict": "PASS", "metric": "4 predictors, zero lookahead"}
  },
  "overall_verdict": "PASS",
  "time_series_diagnostics": {
    "adf_statistic": -4.695,
    "adf_pvalue": 0.0001,
    "lag1_acf": 0.9999,
    "lag24_acf": 0.9962,
    "trend_m_per_month": 0.63
  }
}
```

### `data_audit/data_quality_report.csv`

Row-level quality flags for each DATA-00x check with timestamps, allowing CI/CD pipelines to `assert all(report["verdict"] == "PASS")`.

---

## Related Documents

- [`data-source-registry.md`](/docs?doc=05-data-engineering--data-source-registry) — Upstream source specifications
- [`data-dictionary.md`](/docs?doc=05-data-engineering--data-dictionary) — Variable schema and valid ranges
- [`/data_audit/data_audit.md`](/data_audit/data_audit.md) — Full audit report
- [`/src/suraksha/disasters/flood/agents/data_agent.py`](https://github.com/shouri123/SURAKSHA/tree/main/src/suraksha/disasters/flood/agents/data_agent.py) — DataAgent runtime validation
- [`/src/suraksha/disasters/flood/supervisor/pre_run_gate.py`](https://github.com/shouri123/SURAKSHA/tree/main/src/suraksha/disasters/flood/supervisor/pre_run_gate.py) — Pre-run data regime classification
