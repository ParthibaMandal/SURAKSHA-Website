# SURAKSHA Flood Subsystem (Module 01)

## 1. Subsystem Overview

* **Module Code**: `SURAKSHA-MOD-01-FLOOD`
* **Status**: PRODUCTION READY (Jev-Supervised Scientific Workflow Architecture)
* **Lead Target**: Riverine & Urban Inundation Forecasting across Vulnerable Indian Basins (Ganges, Brahmaputra, Mahanadi, Godavari, Krishna).

The **SURAKSHA Flood Subsystem** integrates specialist hydrological, neural, and spatial models into a **Jev-Supervised Multi-Stage Scientific Workflow**. Numerical computations are strictly owned by specialized scientific models, while **TypeSafe Jev System One** provides bounded supervisory governance across three explicit lifecycle gates:

1. **Pre-Run Gate**: Sensory QA, deterministic physics checks (bounds: $[0, 120\text{m}]$, jump rate limits), data regime classification (`NORMAL`, `RAPID_RISE`, `EXTREME_RAINFALL`, `SENSOR_CONFLICT`, `MISSING_DATA`), and adaptive strategy routing.
2. **Mid-Run Gate**: Forecast Committee execution (`SARIMA + GRU + Hybrid BiLSTM` on rapid surges, `SARIMA` on normal, `ARIMA/Persistence` on fallbacks), spread adjudication, and individual agent claim verification.
3. **Post-Run Gate**: 4-way cross-agent triangulation (Satellite SAR vs Forecast Stage vs Calibrated Risk vs Impact Population), live search/CWC bulletin grounding, and authoritative release vs. human review escalation.
4. **Civil Defense Operational Automation**: SITREP briefing generation, citizen SOS distress triage, and persona-specific evacuation advisories.

---

## 2. Directory Structure

```text
docs/disasters/flood/
│
├── README.md                      # [THIS FILE] Flood subsystem master entry point
│
├── architecture/                  # Architectural DAG specifications & data flow
│   └── flood-architecture.md      # 3-Gate Jev-Supervised Scientific Workflow & Governance Matrix
│
├── models/                        # Scientific & deep learning model details
│   └── forecasting.md             # Forecasting candidate ladder & calibrated risk model
│
├── agents/                        # Detailed agent roles & state bindings
│   └── agent-specifications.md    # Complete 7-agent specifications
│
├── intelligence/                  # Semantic verification & operational AI
│   └── jev-integration.md         # TypeSafe Jev System One integration guide
│
└── evaluation/                    # Benchmarks & empirical validation
    └── forecasting-results.md     # Forecasting candidate ladder results
```

---

## 3. The 3-Gate Jev-Supervised Architecture

```text
                     TELEMETRY INGESTION (Sensors, Weather, SAR)
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │ 1. PRE-RUN GATE                       │
                     │    Physics QA + Jev Regime Classifier │
                     └───────────────────┬───────────────────┘
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         ▼                               ▼                               ▼
    [ NORMAL ]                    [ RAPID RISE ]                 [ DROPOUT/GLITCH ]
   SARIMA Model               Committee (SARIMA+GRU+BiLSTM)       Fallback (ARIMA/Persist)
         │                               │                               │
         └───────────────────────────────┼───────────────────────────────┘
                                         ▼
                     ┌───────────────────────────────────────┐
                     │ 2. MID-RUN GATE                       │
                     │    Committee Adjudication & Claim QA  │
                     └───────────────────┬───────────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │ 3. POST-RUN GATE                      │
                     │    4-Way Triangulation & Release Gate │
                     └───────────────────┬───────────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
               [ AUTHORITATIVE RELEASE ]       [ HUMAN ESCALATION ]
               - SITREP Decision Briefing      - Corrupt Telemetry Alarm
               - Citizen SOS Evacuation        - Cross-Agent Discordance
               - Public Action Advisories      - High Uncertainty Hold
```

---

## 4. Subsystem Operational Workflows

Executable operational workflow guides reside in [`src/suraksha/disasters/flood/workflows/`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/workflows/):

* [`flood-pipeline.md`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/workflows/flood-pipeline.md): Run the 7-Agent DAG across `supervised` and `static` modes.
* [`flood-benchmark.md`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/workflows/flood-benchmark.md): Run the Ganges-at-Patna 9-metric research benchmark.
* [`flood-validation.md`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/workflows/flood-validation.md): Validate CWC gauge telemetry, rating curves, and SAR extents.
* [`flood-replay.md`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/workflows/flood-replay.md): Replay historical extreme flood events (Patna 2021).
* [`flood-jev-supervision.md`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/workflows/flood-jev-supervision.md): Operational handbook for 3-gate flood supervision.

---

## 5. Primary Code Entry Points

* **State Contract**: [`src/suraksha/disasters/flood/contracts/flood_state.py`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/contracts/flood_state.py)
* **Supervisor Contracts & Policies**: [`src/suraksha/disasters/flood/supervisor/`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/supervisor/)
  * `contracts.py`: Gate verdicts, data regimes, supervisor actions, and claim verification schemas.
  * `policy_engine.py`: Deterministic physics checks, model whitelist constraints, spread thresholds.
  * `pre_run_gate.py`: Telemetry evidence QA and regime routing.
  * `mid_run_gate.py`: Committee execution and claim verification.
  * `post_run_gate.py`: Cross-agent triangulation and authoritative release certification.
* **Workflow Orchestrator**: [`src/suraksha/disasters/flood/workflow.py`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/workflow.py) (`FloodPipelineRunner` with dual `supervised` and `static` modes)
* **Candidate Forecasters**: [`src/suraksha/disasters/flood/models/forecasting/`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/models/forecasting/)
* **Calibrated Risk Model**: [`src/suraksha/disasters/flood/models/risk/risk_model.py`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/models/risk/risk_model.py)
* **The 7 Agents**: [`src/suraksha/disasters/flood/agents/`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/agents/)
* **TypeSafe Jev Intelligence**: [`src/suraksha/core/intelligence/jev_client.py`](file:///e:/SURAKSHA/src/suraksha/core/intelligence/jev_client.py)
* **Civil Protection Services**: [`src/suraksha/disasters/flood/intelligence/`](file:///e:/SURAKSHA/src/suraksha/disasters/flood/intelligence/)
* **Comparative Benchmark**: [`experiments/flood/benchmarks/run_adaptive_vs_static_pipeline_benchmark.py`](file:///e:/SURAKSHA/experiments/flood/benchmarks/run_adaptive_vs_static_pipeline_benchmark.py)
