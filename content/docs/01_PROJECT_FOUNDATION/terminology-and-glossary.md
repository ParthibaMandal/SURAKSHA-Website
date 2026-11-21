# Terminology and Glossary: SURAKSHA Knowledge Standards

## Document Metadata
- **Document ID**: `SRK-DOC-01-004`
- **Version**: `1.0.0`
- **Status**: `VERIFIED`
- **Owner**: `SURAKSHA Architecture & Hydrology Team`
- **Created Date**: `2026-11-21`
- **Last Updated**: `2026-11-21`
- **Last Verified Against Commit**: `HEAD`
- **Applicable Module**: `Platform Core & SURAKSHA-MOD-01-FLOOD`
- **Related Documents**: `[Project Charter](project-charter.md)`, `[Domain Knowledge](/docs/03_DOMAIN_AND_FLOOD_KNOWLEDGE/hydrological-fundamentals.md)`

---

## 1. Hydrological & Meteorological Terms
* **River Stage ($h_t$)**: The water surface elevation of a river at a specific gauging cross-section, measured in meters ($m$) relative to Mean Sea Level (MSL).
* **Mean Sea Level (MSL)**: The vertical geodetic datum used by the Survey of India and Central Water Commission for water surface elevation.
* **River Discharge ($Q_t$)**: The volume of water flowing through a river cross-section per unit time, expressed in cubic meters per second ($m^3/s$).
* **Rating Curve**: An empirical mathematical relationship $Q = a(h - h_0)^b$ used to convert measured stage height into discharge volume.
* **Warning Level**: The water level threshold ($47.60\text{ m}$ at Gandhi Ghat) at which riverbanks are saturated and initial flood advisories are issued.
* **Danger Level**: The critical water level threshold ($48.60\text{ m}$ at Gandhi Ghat) at which water overspills natural levees and threatens human settlements.
* **Highest Flood Level (HFL)**: The maximum historical stage recorded at a station ($50.52\text{ m}$ at Gandhi Ghat during the 2016 flood).
* **Antecedent Precipitation Index (API)**: A weighted index reflecting residual moisture stored in the soil from preceding days of rainfall (e.g. $\text{API}_{3d}$, $\text{API}_{7d}$).

---

## 2. Remote Sensing & Geospatial Terms
* **Synthetic Aperture Radar (SAR)**: Active radar imaging that emits microwave pulses (C-band, $5.4\text{ GHz}$) from orbit to map surface characteristics regardless of cloud cover, smoke, or solar illumination.
* **Backscatter Decibels ($\text{dB}$)**: The measured intensity of the radar pulse reflected back to the satellite sensor. Water surfaces scatter microwave energy forward like a specular mirror, resulting in low backscatter ($\le -16.0\text{ dB}$).
* **Nagler Wet-Snow Algorithm**: A dual-polarization SAR backscatter difference technique that detects liquid water inside ripening snowpacks when backscatter decreases by $\ge 3.0\text{ dB}$ relative to frozen reference conditions.
* **Snowline Altitude (SLA)**: The transient elevation boundary separating snow-covered ground from bare land, derived from Sentinel-2 optical imagery.
* **Normalized Difference Snow Index (NDSI)**: A satellite index $(Green - SWIR) / (Green + SWIR)$ used to map snow cover by distinguishing bright snow from clouds.
* **Height Above Nearest Drainage (HAND)**: A normalized terrain model representing the relative vertical elevation of every terrain pixel above the nearest hydraulic drainage flowpath, enabling rapid inundation depth calculations.

---

## 3. Machine Learning & Predictive Modeling Terms
* **Champion-Challenger Framework**: A production architecture where a primary baseline model (Champion) is continually evaluated against alternative specialized models (Challengers) under changing conditions.
* **SARIMA**: Seasonal Autoregressive Integrated Moving Average model capturing diurnal 24-hour cycles and hydro drift with low inference latency.
* **Hybrid BiLSTM**: Bidirectional Long Short-Term Memory neural network with temporal attention, designed to learn bidirectional historical trends in upstream rainfall and snowmelt without future-data leakage.
* **Quantile Forecast (P10 / P50 / P90)**: Probabilistic stage forecasts representing the 10th percentile (optimistic/lower bound), 50th percentile (expected/median), and 90th percentile (worst-case surge) boundaries.
* **Nash-Sutcliffe Efficiency (NSE)**: A normalized hydrological statistic $(- \infty \text{ to } 1.0)$ evaluating the relative predictive power of a hydrological forecast compared to the mean observed stage.

---

## 4. Supervisory AI & Governance Terms
* **TypeSafe Jev System One**: The cloud-based supervisory intelligence layer that evaluates pipeline regimes, adjudicates model spread, and certifies authoritative releases.
* **Scientific Value Governance Invariant**: The strict architectural constraint that numerical predictions remain 100% owned by specialist models; Jev cannot manufacture, interpolate, or override numbers.
* **Data Regime**: The operational state of incoming telemetry classified by Jev:
  * `NORMAL`: Steady flow, normal seasonal patterns.
  * `RAPID_RISE`: Stage rising $>0.30\text{ m/h}$; activates 3-model committee.
  * `EXTREME_RAINFALL`: Rainfall intensity $>15.0\text{ mm/h}$.
  * `SENSOR_CONFLICT`: Ground gauge and satellite contradict each other.
  * `MISSING_DATA`: Telemetry stream absent or corrupted; triggers fallback.
* **The 5 Bounded Actions**:
  1. `CONTINUE`: Inputs and claims verified; proceed along workflow.
  2. `HOLD_AND_RETRY`: Transient discrepancy; retry agent (maximum 1 retry).
  3. `RUN_CHALLENGER_MODEL`: Moderate divergence; execute whitelisted alternative model.
  4. `USE_APPROVED_FALLBACK`: Corrupt telemetry or sensor loss; switch to persistence/ARIMA.
  5. `ESCALATE_TO_HUMAN`: Critical contradiction or severe disagreement; halt for civil defense officer review.
* **Common Alerting Protocol (CAP v1.2)**: The international OASIS standard XML format used for emergency data exchange across public warning systems and cell broadcasts.

