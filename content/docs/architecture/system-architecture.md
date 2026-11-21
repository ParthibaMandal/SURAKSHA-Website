# SURAKSHA Global System Architecture

## Architectural Philosophy: Platform Core vs Disaster Subsystems

The SURAKSHA platform strictly isolates **shared platform infrastructure** from **hazard-specific intelligence logic**.

```text
src/suraksha/
│
├── core/                                # REUSABLE PLATFORM FOUNDATION
│   ├── contracts/                       # Universal base schemas
│   │   ├── base_hazard.py               # BaseHazardState, SeverityLevel, CoordinatePoint
│   │   └── telemetry.py                 # TelemetryEvent, ModelEvaluationRecord
│   ├── geospatial/                      # Shared geospatial infrastructure
│   │   └── earth_engine_client.py       # Reusable GEE auth, session management, CRS transforms
│   ├── registry/                        # Model & Subsystem Discovery
│   │   └── hazard_registry.py           # Pluggable Hazard Module Registry
│   └── orchestration/                   # Base Agent & Pipeline Engine
│       └── graph_engine.py              # LangGraph orchestration baseline
│
└── disasters/                           # HAZARD SPECIALIZATION MODULES
    └── flood/                           # MODULE 01 (FLOOD)
        ├── contracts/                   # FloodState, RiverStageData, FloodForecast
        ├── geospatial/                  # Sentinel-1 SAR Otsu/Lee Extractor
        ├── models/                      # CausalLSTM, BiLSTMHybrid, DistrictRiskClassifier
        ├── agents/                      # ForecastAgent, RiskAgent, SatelliteAgent, ImpactAgent
        └── workflow.py                  # LangGraph DAG definition
```

### Key Separation of Concerns
1. **Core Independence**: `suraksha.core` has zero dependencies on any specific disaster implementation. It defines interfaces and common utilities.
2. **Subsystem Autonomy**: Each disaster subsystem (such as `suraksha.disasters.flood`) imports from `suraksha.core` and encapsulates its own domain models, data transforms, and LangGraph workflow nodes.
3. **Pluggable Registration**: Hazard modules register themselves in `suraksha.core.registry.hazard_registry`, allowing the central dispatcher to dynamically trigger the appropriate disaster pipeline based on incoming telemetry.
