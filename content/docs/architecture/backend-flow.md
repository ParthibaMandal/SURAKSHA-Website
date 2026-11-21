# SURAKSHA Backend & Agent Execution Flow

## 1. Multi-Agent Disaster Pipeline Flow

SURAKSHA pipelines are modeled as explicit Directed Acyclic Graphs (DAGs) compiled with **LangGraph**. The workflow enforces sensory parallelism followed by predictive aggregation:

```mermaid
flowchart TD
    Trigger(["Telemetry Event Received<br/>(e.g., Rainfall Alert / Gauge Surge)"]) --> Dispatcher["Hazard Dispatcher / Orchestrator"]
    
    subgraph SENSORY_TIER ["1. Sensory Tier (Parallel)"]
        Dispatcher --> DataAgent["Data / Ingestion Agent<br/>(River stages, gauges, GloFAS)"]
        Dispatcher --> WeatherAgent["Weather Agent<br/>(ERA5 / IMD radar precipitation)"]
        Dispatcher --> SatelliteAgent["Satellite Agent<br/>(Sentinel-1 SAR GEE backscatter)"]
    end

    DataAgent & WeatherAgent --> ForecastAgent["2. Forecast Agent<br/>(72h -> 24h Causal LSTM)"]
    
    ForecastAgent --> RiskAgent["3. Risk Agent<br/>(District Susceptibility + Non-Linear Risk GB)"]
    
    RiskAgent & SatelliteAgent --> ImpactAgent["4. Impact Agent<br/>(Asset Exposure, Shelters, Road Network)"]
    
    ImpactAgent --> Output(["Publish Standardized Hazard State & Alerts"])
```

## 2. Deterministic State Progression
All agents interact by reading and augmenting a typed state contract (`FloodState` inheriting from `BaseHazardState`). No hidden side-effects occur outside the shared state transitions.
