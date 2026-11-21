# Agentic Intelligence Architecture: 7-Agent Topology

| Field | Value |
|---|---|
| **Document ID** | AGT-08-001 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Module** | SURAKSHA-MOD-01-FLOOD |
| **Orchestration Framework** | LangGraph / StateGraph |

---

## 1. Topological Architecture

SURAKSHA abandons brittle monolithic pipelines in favor of an **Agentic Specialist DAG** supervised by three lifecycle decision gates:

```mermaid
flowchart TD
    Start([Pipeline Start]) --> Ingest[1. Data Ingestion Agent]
    Ingest --> Weather[2. Weather Agent]
    Weather --> Gate1{Pre-Run Gate<br/>Telemetry & Regime QA}
    
    Gate1 -->|Pass: NORMAL| SingleModel[4. Forecast Agent: Single Fast Path]
    Gate1 -->|Pass: RAPID_RISE| Committee[4. Forecast Agent: 3-Model Committee]
    Gate1 -->|Corrupt Sensor| FallbackModel[4. Forecast Agent: Persistence Fallback]
    
    Weather --> Sat[3. Satellite Agent<br/>SAR Inundation Extent]
    
    SingleModel --> Gate2{Mid-Run Gate<br/>Spread & Claim Verification}
    Committee --> Gate2
    FallbackModel --> Gate2
    
    Gate2 --> Risk[5. Risk Assessment Agent]
    Sat --> Impact[6. Impact Assessment Agent]
    Risk --> Gate3{Post-Run Gate<br/>4-Way Triangulation}
    Impact --> Gate3
    
    Gate3 -->|Verified| Verif[7. Verification & Release Agent<br/>CAP v1.2 Release]
    Gate3 -->|Contradiction| Escalate[Civil Defense Officer Escalation]
    
    Verif --> End([Published Alert])
    Escalate --> End
```

---

## 2. Dual Execution Modes

1. **Supervised Mode (`supervised`)**: The default production execution mode. The 3 gates dynamically evaluate data quality, summon model committees, adjust confidence intervals, and mandate human review upon sensor contradiction.
2. **Static Mode (`static`)**: A non-branching, deterministic baseline that executes all agents sequentially without supervisory intervention. Used for empirical research benchmarks and regression testing.
