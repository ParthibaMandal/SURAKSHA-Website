# SURAKSHA Flood Subsystem: Operational Turnkey Finalization Specification

## 1. Executive Overview

This operational specification defines the final turnkey deployment architecture for the **SURAKSHA Flood Subsystem (`SURAKSHA-MOD-01-FLOOD`)**. 

Having completed and benchmarked the scientific core (hydrological time-series forecasters, calibrated XGBoost risk models, and Sentinel-1 SAR processors), this tier packages the subsystem into an enterprise-grade, deployable civil defense early warning service. It provides:
1. **Model Checkpoint Persistence & Registry**: Dynamic empirical benchmark selection and zero runtime fitting delay.
2. **Pan-India CWC Station Catalog**: Multi-basin gauge metadata, datums, and danger levels across the Ganges, Brahmaputra, Mahanadi, Godavari, Krishna, and Yamuna basins.
3. **NDMA OASIS CAP v1.2 Exporter**: Standardized Alert Recommendations with authority-in-the-loop governance.
4. **FastAPI Production Service**: High-performance REST API with OpenAPI documentation and startup artifact pre-loading.
5. **24/7 Telemetry Polling Scheduler**: Non-blocking ingestion engine with automated threshold-surge escalation.
6. **1D-to-2D HAND Hydrodynamic Solver**: Physics-based Height Above Nearest Drainage surface inundation mapping.

---

## 2. Platform Architecture: The Two Operational Flows

SURAKSHA flood intelligence operates via two cleanly separated pipelines:

```text
========================================================================================
1. SCIENTIFIC & PREDICTIVE FLOW (Deterministic DAG)
========================================================================================
Telemetry Ingestion
   │
   ├── Weather (IMD / ERA5)
   ├── River Gauges (CWC)
   └── Satellite Radar (Sentinel-1 SAR GEE)
          │
          ▼
     Forecast Agent (Candidate Benchmark Ladder)
          │
   ┌──────┼──────────────────────────────┐
   ▼      ▼       ▼       ▼       ▼      ▼
Persistence ARIMA SARIMA GRU    LSTM  Hybrid BiLSTM
   └──────┬──────────────────────────────┘
          ▼
   Empirical Benchmark Ladder Evaluation (Lowest RMSE / Highest NSE)
          ▼
   Selected Production Model (Loaded in-memory from ModelCheckpointRegistry)
          ▼
      Risk Agent (Calibrated XGBoost / GradientBoosting)
          ▼
     Impact Agent (Spatial Infrastructure & Shelter Overlays)
          ▼
   Authoritative Standardized FloodState Contract
          │
          │
========================================================================================
2. OPERATIONAL & INTELLIGENCE FLOW (Civil Defense & Authority Loop)
========================================================================================
   Authoritative FloodState
          │
          ├────────────────────────────────────────┬──────────────────────────────────┐
          │                                        │                                  │
          ▼                                        ▼                                  ▼
Alert Recommendation                      TypeSafe Jev Tier                   1D-to-2D HAND Solver
(OASIS CAP v1.2 / NDMA Sachet)       (System One Decision Primitives)    (DEM Surface Depth Matrix)
          │                                        │                                  │
          ▼                                        ├── Commander SITREP Briefing      ▼
Authority Workflow Boundary                        ├── Citizen SOS Distress Triage  GeoJSON Flood Mask
   [ DDMA / NDMA Duty Officer ]                    └── Public Action Advisories     & Street Depths
          │
          ├── Authorize / Sign Off
          └── Reject / Calibrate
          │
          ▼
   Public Emergency Broadcast
   (NDMA Sachet Portal / SMS / Sirens)
```

---

## 3. Model Lifecycle & Zero Runtime Fitting Delay

To guarantee sub-second API responses and high reliability during civil defense emergencies, **no runtime model fitting occurs**.

```text
OFFLINE / RETRAINING LIFECYCLE:
Telemetry Archive -> Multi-Horizon Training -> Candidate Benchmark Ladder -> Model Registry -> Serialized Checkpoints (.pkl, .pt)
                                                                                                      │
SERVICE STARTUP LIFECYCLE:                                                                            │
FastAPI Lifespan Startup ◄────────────────────────────────────────────────────────────────────────────┘
   │
   ├── Pre-load designated Production Forecaster into memory (<50ms)
   ├── Pre-load Calibrated XGBoost Risk Model into memory (<10ms)
   └── Pre-load Pan-India CWC Station Registry (<5ms)
   │
REQUEST RUNTIME LIFECYCLE:
Client Request -> In-Memory Matrix Inference (Forward Pass Only) -> Response (<100ms)
```

### Dynamic Benchmark Selection
The production forecaster is **never hardcoded**. `ModelCheckpointRegistry` reads the evaluation metrics from `ForecastLadderBenchmark` across candidate models and dynamically binds the top performer to the `production_forecaster` key.

---

## 4. Pan-India CWC Station Catalog

The basin catalog (`src/suraksha/disasters/flood/basins/data/cwc_stations.json`) provides real-world hydrological benchmarks:

| Station ID | River | Basin | State | District | Danger Level (m) | Warning Level (m) | Record HFL (m) |
|---|---|---|---|---|---|---|---|
| `GANGES_PATNA` | Ganges | Ganges | Bihar | Patna | 50.50 | 49.50 | 52.52 |
| `GANGES_VARANASI` | Ganges | Ganges | UP | Varanasi | 71.26 | 70.26 | 73.90 |
| `GANGES_PRAYAGRAJ` | Ganges | Ganges | UP | Prayagraj | 84.73 | 83.73 | 88.03 |
| `GANGES_FARAKKA` | Ganges | Ganges | West Bengal | Murshidabad | 22.25 | 21.22 | 24.71 |
| `BRAHMAPUTRA_GUWAHATI` | Brahmaputra | Brahmaputra | Assam | Kamrup Metro | 49.68 | 48.68 | 51.46 |
| `BRAHMAPUTRA_DIBRUGARH` | Brahmaputra | Brahmaputra | Assam | Dibrugarh | 105.70 | 104.70 | 106.48 |
| `BRAHMAPUTRA_TEZPUR` | Brahmaputra | Brahmaputra | Assam | Sonitpur | 65.23 | 64.23 | 66.81 |
| `MAHANADI_CUTTACK` | Mahanadi | Mahanadi | Odisha | Cuttack | 22.50 | 21.00 | 24.38 |
| `MAHANADI_SAMBALPUR` | Mahanadi | Mahanadi | Odisha | Sambalpur | 192.00 | 189.50 | 194.20 |
| `GODAVARI_POLAVARAM` | Godavari | Godavari | AP | Eluru | 28.00 | 25.50 | 31.85 |
| `GODAVARI_RAJAHMUNDRY` | Godavari | Godavari | AP | East Godavari | 15.50 | 13.75 | 18.25 |
| `KRISHNA_VIJAYAWADA` | Krishna | Krishna | AP | NTR | 17.80 | 16.50 | 20.45 |
| `YAMUNA_DELHI_ORB` | Yamuna | Ganges | Delhi | Central Delhi | 205.33 | 204.50 | 208.66 |

---

## 5. OASIS CAP v1.2 & NDMA Sachet Interoperability

The alerting module (`src/suraksha/disasters/flood/alerting/cap_generator.py`) generates valid **OASIS Common Alerting Protocol v1.2** XML and JSON payloads.

### Authority-in-the-Loop Principle
All automated pipeline runs emit `<status>Draft</status>` or `<status>Actual</status>` with `authority_approval_required: true`. Automated forecasts and risk classifications do not trigger blind public evacuations; they provide actionable staging packages to the District Emergency Operations Center (DEOC) for authorized dispatch.

---

## 6. Production REST API Endpoints

The FastAPI service exposes:
- **`GET /api/v1/flood/health`**: Health status, in-memory model versions, and loaded station count.
- **`GET /api/v1/flood/stations`**: Pan-India station catalog with basin/state query filters.
- **`GET /api/v1/flood/stations/{station_id}`**: Gauge metadata and danger marks.
- **`POST /api/v1/flood/pipeline/run`**: Executes the 6-agent scientific workflow and returns `FloodState`.
- **`POST /api/v1/flood/alerts/cap-recommendation`**: Outputs OASIS CAP v1.2 XML or JSON alert recommendations.
- **`POST /api/v1/flood/intelligence/sitrep`**: Generates commander briefing using TypeSafe Jev.
- **`POST /api/v1/flood/intelligence/triage-sos`**: Categorizes and prioritizes citizen emergency calls.
- **`POST /api/v1/flood/intelligence/advisory`**: Returns customized civil defense directives.
