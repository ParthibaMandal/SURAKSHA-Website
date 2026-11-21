# System Architecture Overview: SURAKSHA Platform

## Document Metadata
- **Document ID**: `SRK-DOC-04-001`
- **Version**: `1.0.0`
- **Status**: `VERIFIED`
- **Owner**: `SURAKSHA Core Architecture Team`
- **Created Date**: `2026-11-21`
- **Last Updated**: `2026-11-21`
- **Last Verified Against Commit**: `HEAD`
- **Applicable Module**: `Platform Core & All Hazard Subsystems`
- **Related Documents**: `[Master Knowledge Map](/docs?doc=01-getting-started--suraksha-knowledge-map)`, `[ADR-001](/docs?doc=04-system-architecture--adr-001-modular-monolith)`, `[ADR-002](/docs?doc=04-system-architecture--adr-002-three-gate-supervisor)`

---

## 1. Architectural Philosophy: The Two-Tier System

SURAKSHA enforces a clean two-tier architectural separation:

```text
src/suraksha/
│
├── core/                                # PLATFORM CORE (Zero disaster-specific logic)
│   ├── contracts/                       # Base schemas: BaseHazardState, SeverityLevel, CoordinatePoint
│   ├── intelligence/                    # TypeSafe Jev System One client, question prompts, and offline mocks
│   ├── geospatial/                      # EarthEngineClient, CRS projections, spatial bounding boxes
│   ├── registry/                        # HazardRegistry (Pluggable subsystem discovery)
│   └── alerting/                        # Common Alerting Protocol (CAP v1.2) XML generators
│
└── disasters/                           # DISASTER SUBSYSTEM PLUGINS
    ├── flood/                           # MODULE 01 (Active Reference Implementation: Patna, Bihar)
    ├── cyclone/                         # MODULE 02 (Planned Future Extension)
    ├── earthquake/                      # MODULE 03 (Planned Future Extension)
    └── ...
```

### Strict Architectural Boundaries
1. **Core Zero-Dependency Rule**: `suraksha.core` must **never** import from `suraksha.disasters.*`. The core provides generic abstractions, shared geospatial clients, alerting engines, and base contracts.
2. **Subsystem Independence**: Disaster plugins never import from each other directly. Shared tools exist exclusively in `suraksha.core`.
3. **Pluggable Registration**: Every disaster plugin registers itself dynamically at import time with `HazardRegistry.register()`.

---

## 2. C4 Architecture Models

### Level 1: System Context Diagram (C1)

```mermaid
flowchart TD
    subgraph USERS ["External Actors"]
        U1["Civil Defense Commander<br/>(SDMA / NDRF)"]
        U2["Research Hydrologist<br/>(CWC / Academic)"]
        U3["At-Risk Citizen<br/>(Vulnerable Population)"]
    end

    subgraph SURAKSHA_SYS ["SURAKSHA Flood Intelligence Platform"]
        SYS["SURAKSHA Core & Flood Subsystem<br/>• Multi-Agent LangGraph DAG<br/>• 3-Gate Jev Supervisory Control Plane<br/>• Neural & Statistical Forecasting Engine<br/>• Google Earth Engine SAR Extent Processor"]
    end

    subgraph EXT_SYSTEMS ["External Telemetry & Cloud Services"]
        E1["Central Water Commission (CWC)<br/>River Stage & Danger Datums"]
        E2["India Meteorological Dept (IMD)<br/>Gridded Rainfall & Storm Alerts"]
        E3["Google Earth Engine (GEE)<br/>Sentinel-1 SAR & Sentinel-2 Cryosphere"]
        E4["TypeSafe Jev System One<br/>Cloud Supervisory AI"]
        E5["Disaster Messaging Network<br/>OASIS CAP v1.2 Cell Broadcasts"]
    end

    E1 -->|Hourly Gauge Stage| SYS
    E2 -->|Precipitation Grids| SYS
    E3 -->|C-Band Radar & Optical Tiles| SYS
    SYS <-->|Supervisory Evaluation| E4
    SYS -->|CAP v1.2 XML Alerts| E5

    U1 <-->|SITREP Briefings & Triage| SYS
    U2 <-->|Model Diagnostics & Benchmarks| SYS
    E5 -->|Evacuation Orders| U3
```

---

### Level 2: Container Architecture Diagram (C2)

```mermaid
flowchart TD
    subgraph CLIENT_TIER ["Presentation & Client Applications"]
        DASH["Interactive Web Dashboard<br/>(Leaflet.js + Chart.js + HTML5)"]
        CLI["Researcher CLI & Benchmark Runner<br/>(Python / PowerShell)"]
    end

    subgraph BACKEND_CONTAINER ["SURAKSHA Application Runtime (FastAPI ASGI)"]
        API["FastAPI REST Gateway<br/>(/api/v1/flood/*)"]
        REG["Hazard & Model Registry<br/>(Pluggable Discovery)"]
        ORCH["Multi-Agent Workflow DAG<br/>(LangGraph / State Management)"]
        MODELS["In-Memory Specialist Models<br/>(SARIMA, GRU, BiLSTM, GradientBoosting)"]
    end

    subgraph STORAGE_TIER ["Persistence & File Assets"]
        CSV["Processed Hydrological Timeseries<br/>(CSV / Parquet)"]
        CKPT["Trained Checkpoints<br/>(sarima_checkpoint.pkl, etc.)"]
        LOGS["Audit Trails & JSONL Transcripts"]
    end

    subgraph CLOUD_EXT ["External APIs"]
        GEE["Google Earth Engine API"]
        JEV["TypeSafe System One API"]
    end

    DASH <-->|HTTP / JSON / GeoJSON| API
    CLI <-->|Direct In-Process / HTTP| API

    API --> REG --> ORCH
    ORCH <--> MODELS
    MODELS <--> CKPT
    ORCH <--> CSV
    ORCH --> LOGS

    ORCH <--> GEE
    ORCH <--> JEV
```

---

### Level 3: Component Architecture (Flood Subsystem C3)

The 7-Agent DAG execution is organized into three supervisory gates:

```mermaid
flowchart TD
    subgraph GATE1 ["Gate 1: Pre-Run Gate"]
        QA["DataQAAgent<br/>Physics Bounds Check: [0, 120m]"]
        WEA["WeatherAgent<br/>Rainfall & Catchment Runoff Index"]
        P1["Jev Regime Classifier<br/>NORMAL | RAPID_RISE | CONFLICT | MISSING"]
    end

    subgraph GATE2 ["Gate 2: Mid-Run Gate"]
        SAT["SatelliteAgent<br/>Sentinel-1 SAR Inundation Extent"]
        FC["ForecastAgent<br/>SARIMA + GRU + Hybrid BiLSTM"]
        P2["Jev Committee Adjudication<br/>Spread Check: Δ <= 0.40m"]
    end

    subgraph GATE3 ["Gate 3: Post-Run Gate"]
        RISK["RiskAgent<br/>Calibrated Gradient Boosting Risk Score"]
        IMP["ImpactAgent<br/>HAND Depth & OpenStreetMap Exposure"]
        VER["VerificationAgent<br/>4-Way Triangulation & CAP Generation"]
        P3["Jev Release Certification<br/>Authoritative Release vs. Escalation"]
    end

    QA --> WEA --> P1
    P1 --> SAT
    P1 --> FC
    SAT --> P2
    FC --> P2
    P2 --> RISK --> IMP --> VER --> P3
```

---

## 3. The Scientific Value Governance Invariant

1. **Calculations are Specialist-Owned**: Hydrological, meteorological, statistical, and neural models strictly and exclusively own all numerical outputs (predicted stage, river discharge, inundated acreage, damage probabilities).
2. **Supervisory Boundary**: **TypeSafe Jev System One** acts as a supervisory decision layer across explicit lifecycle gates. Jev is strictly **forbidden** from modifying, overriding, interpolating, or fabricating numerical predictions.
3. **Bounded Decision Set**: All supervisory verdicts emitted by Jev deterministically map to one of five actions:
   * `CONTINUE`: Telemetry and claims are verified; proceed along workflow.
   * `HOLD_AND_RETRY`: Transient anomaly detected; retry agent (maximum 1 retry per agent).
   * `RUN_CHALLENGER_MODEL`: Model divergence detected; summon alternative model from whitelist.
   * `USE_APPROVED_FALLBACK`: Corrupt or missing telemetry; switch to approved fallback model.
   * `ESCALATE_TO_HUMAN`: Critical cross-agent contradiction; flag for civil defense officer review.

