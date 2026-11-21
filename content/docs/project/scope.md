# SURAKSHA System Scope & Operational Focus

## 1. Targeted Domain Scope: Flood Intelligence

SURAKSHA is dedicated strictly and comprehensively to **Riverine & Urban Flood Intelligence, Early Warning, and Civil Defense Decision Support**.

The platform focuses on vulnerable Indian river basins with high-fidelity operational anchoring along the **Ganges River Basin at Patna (Digha – Gandhi Ghat – Danapur corridor, Bihar)**.

---

## 2. Core Functional Pillars

1. **Hydrological & Meteorological Telemetry Ingestion**:
   - Real-time hourly CWC river gauge feeds (water level $h_t$, danger thresholds, discharge $Q_t$).
   - High-density rainfall time series (precipitation $R_t$, antecedent precipitation indices API-3d, API-7d).
   - Dynamic catchment runoff scaling ($\Omega$) calibrated by IEEE GBFS non-redundant environmental factors (wetland, wasteland, evergreen forest, rainfall deviation).

2. **Satellite Earth Observation (SAR)**:
   - Cloud-penetrating Sentinel-1 SAR (C-band synthetic aperture radar) backscatter processing.
   - Refined Lee speckle filtering, Otsu adaptive dynamic thresholding, and permanent water body masking.

3. **Probabilistic Multi-Horizon Forecasting**:
   - Probabilistic Champion-Challenger model ladder (`SARIMA`, `GRU`, `Causal LSTM`, `Hybrid BiLSTM`).
   - Forecast horizons at $t+6\text{h}$, $t+12\text{h}$, and $t+24\text{h}$ with 95% confidence intervals (P10 best, P50 expected, P90 worst-case bounds).

4. **Consequence Modeling & Infrastructure Cascade**:
   - Hydraulic Height Above Nearest Drainage (HAND) inundation depth mapping.
   - Critical infrastructure facility breach analysis (transport bridges, hospitals, power substations, water treatment plants).
   - Cascading infrastructure dependency tracing and displaced population evacuation to safe-zone shelters.

5. **TypeSafe Jev Supervisory Governance**:
   - 3-gate supervisory control plane (**Pre-Run**, **Mid-Run**, **Post-Run**).
   - Strict scientific value governance invariant: numerical predictions are strictly model-owned; supervisory AI evaluates regimes, audits model spread $\Delta$, verifies claims, and certifies authoritative releases.

6. **Civil Defense Operational Automation**:
   - OASIS Common Alerting Protocol (CAP v1.2) XML dispatch.
   - Commander SITREP briefing generation.
   - Citizen SOS distress priority triage and route advisories.
