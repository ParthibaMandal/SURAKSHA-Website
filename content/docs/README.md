# SURAKSHA: Enterprise Flood Intelligence Platform Documentation

Welcome to the **SURAKSHA** Engineering Knowledge System. 

SURAKSHA (सुरक्षा) is an enterprise-grade flood intelligence and civil defense early-warning platform that couples real-time hydrological telemetry, deep learning forecasting, satellite Earth observation, and AI agent supervisory orchestration to automate flood detection, risk estimation, and emergency response across vulnerable Indian river basins (anchored on the **Ganges River Basin at Patna, Bihar**).

---

## 🗺️ Master Documentation Navigation

SURAKSHA organizes its engineering and scientific documentation across **16 structured knowledge domains**, anchored by the **[Central Knowledge Map](/docs?doc=01-getting-started--suraksha-knowledge-map)**:

```text
docs/
│
├── README.md                                  # [THIS FILE] Master navigation portal
├── SURAKSHA-KNOWLEDGE-MAP.md                  # Central end-to-end traceability map
│
├── 01_PROJECT_FOUNDATION/                     # Identity, mission, charter, problem statement & scope
│   ├── project-charter.md                     # Formal project charter and mandate
│   ├── problem-statement.md                   # Critical gaps in existing flood monitoring
│   ├── project-scope.md                       # Patna operational anchor vs. future basin expansions
│   └── terminology-and-glossary.md            # Standardized scientific & AI definitions
│
├── 02_PRODUCT_AND_REQUIREMENTS/               # Functional & non-functional specifications
│   ├── functional-requirements.md             # Traceable requirements (FR-001 through FR-050)
│   ├── user-personas.md                       # Civil defense commanders, responders, hydrologists
│   └── requirements-traceability.md           # Bidirectional requirements-to-tests matrix
│
├── 03_DOMAIN_AND_FLOOD_KNOWLEDGE/             # Hydrology, river behavior & flood science
│   ├── flood-science-overview.md              # Physics of monsoon riverine & urban inundation
│   ├── hydrological-fundamentals.md           # River stage, discharge, rating curves & API indices
│   ├── glacial-melt-and-runoff.md             # Himalayan headwaters (Gangotri, Kedarnath, Kosi)
│   └── flood-thresholds.md                    # CWC Warning, Danger & HFL vertical datums (MSL)
│
├── 04_SYSTEM_ARCHITECTURE/                    # C4 models, DAG orchestration, state & ADRs
│   ├── architecture-overview.md               # 2-Tier platform core vs. disaster plugin architecture
│   ├── system-master-specification.md         # Master Specification 1: Global system contract
│   └── architecture-decisions/                # Architecture Decision Records (ADRs)
│       ├── ADR-001-modular-monolith.md        # Monolith vs. Microservices rationale
│       ├── ADR-002-three-gate-supervisor.md   # 3-Gate Jev supervisory control plane
│       └── ADR-003-fastapi-backend.md         # FastAPI asynchronous ASGI framework
│
├── 05_DATA_ENGINEERING/                       # Data pipelines, provenance & quality audits
│   ├── data-source-registry.md                # CWC, IMD, GEE, ERA5-Land, GloFAS registry
│   ├── data-lineage.md                        # Raw, processed, and fixture data pipelines
│   ├── data-quality-framework.md              # 14-point audit framework & sanity checks
│   └── data-dictionary.md                     # Comprehensive variable schemas and units
│
├── 06_GEOSPATIAL_INTELLIGENCE/                # Satellite radar, optical cryosphere & DEMs
│   ├── sentinel-1-processing.md               # GEE Sentinel-1 C-band SAR backscatter (-16 dB)
│   ├── cryosphere-processors.md               # Nagler wet-snow radar & Sentinel-2 NDSI snowlines
│   ├── hand-methodology.md                    # Height Above Nearest Drainage hydraulic modeling
│   └── permanent-water-masking.md             # JRC Global Surface Water (>80%) subtraction
│
├── 07_AI_AND_MACHINE_LEARNING/                # Neural & statistical forecasting models
│   ├── forecasting-methodology.md             # Probabilistic champion-challenger model ladder
│   ├── uncertainty-estimation.md              # P10, P50, P90 quantile formulation & calibration
│   └── model-cards/                           # Formal model cards
│       ├── sarima.md                          # Statsmodels seasonal autoregressive model
│       └── bilstm.md                          # Bidirectional LSTM with temporal attention
│
├── 08_AGENTIC_INTELLIGENCE/                   # Multi-agent LangGraph orchestration & Jev
│   ├── agentic-architecture.md                # 7-Agent DAG topology & state immutability
│   ├── agent-specifications.md                # QA, Weather, Satellite, Forecast, Risk, Impact, Verify
│   └── jev/                                   # TypeSafe Jev System One supervisory policies
│       ├── supervisor-decision-policy.md      # 5 bounded actions & deterministic fallbacks
│       └── claim-verification.md              # 5-tier claim verification taxonomy
│
├── 09_BACKEND_AND_API/                        # REST gateway, routing & data contracts
│   ├── backend-architecture.md                # FastAPI ASGI application runtime
│   ├── api-reference.md                       # REST endpoints (/health, /simulate, /alerts)
│   └── openapi.yaml                           # Authoritative OpenAPI 3.1 specification
│
├── 10_APPLICATION_AND_USER_EXPERIENCE/        # Web dashboard & interactive GIS mapping
│   ├── dashboard-specification.md             # Leaflet.js map, gauge cards, time-series graphs
│   └── user-flows.md                          # Civil defense response & distress workflows
│
├── 11_RISK_SAFETY_AND_SECURITY/               # Governance, life-safety & secret management
│   ├── safety-overview.md                     # Scientific Value Governance Invariant
│   ├── alert-governance.md                    # CAP v1.2 generation vs. legal civil defense orders
│   └── secret-management.md                   # Git-ignored credentials & service account isolation
│
├── 12_TESTING_AND_VALIDATION/                 # Verification strategy, test suites & replays
│   ├── testing-strategy.md                    # 243-test suite hierarchy (Unit, Invariant, API)
│   └── scenario-library.md                    # Historical flood replay (Patna 2021) & flash surges
│
├── 13_DEPLOYMENT_AND_INFRASTRUCTURE/          # Runtimes, environment variables & offline execution
│   └── environment-configuration.md           # Python 3.14+, virtualenv & `.env` configuration
│
├── 14_MONITORING_AND_OPERATIONS/              # Health probes, diagnostics & runbooks
│   ├── service-health.md                      # Readiness probes & model pre-loading checks
│   └── operational-runbooks/                  # Emergency recovery runbooks (GEE, CWC, Jev)
│
├── 15_RESEARCH_AND_EXPERIMENTATION/           # Benchmark methodology, results & reproducibility
│   ├── benchmark-methodology.md               # 9-metric comparative research methodology
│   └── comparative-analysis.md                # Adaptive 3-Gate vs. Static Pipeline benchmark results
│
├── 16_PROJECT_MANAGEMENT/                     # Coding standards, decision logs & roadmaps
│   ├── coding-standards.md                    # Pydantic v2, numerical safety & offline-first rules
│   └── decision-log.md                        # Chronological architectural decision records
│
└── templates/                                 # Standard documentation templates
    └── DOCUMENT_TEMPLATE.md                   # 16-section standard document template
```

---

## 🚀 Quick Start for Developers & Researchers

1. **Understand the Mission**: Read the **[Project Charter](/docs?doc=01-getting-started--project-charter)** and **[Project Scope](/docs?doc=01-getting-started--project-scope)**.
2. **Trace the Pipeline**: Explore the **[Central Knowledge Map](/docs?doc=01-getting-started--suraksha-knowledge-map)** to see how telemetry flows into neural models, Jev gates, and CAP alerts.
3. **Inspect the Architecture**: Review **[System Architecture Overview](/docs?doc=04-system-architecture--architecture-overview)** and the **[Three-Gate Jev Supervisor ADR](/docs?doc=04-system-architecture--adr-002-three-gate-supervisor)**.
4. **Run the Full Test Suite**:
   ```powershell
   pytest tests/ -q
   ```
5. **Verify System Health**: Query the FastAPI endpoint (`GET /api/v1/flood/health`) to confirm that SARIMA is preloaded, Earth Engine is authenticated via Service Account, and CWC telemetry sources are configured.
