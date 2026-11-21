# Flood Subsystem: 7-Agent Architecture Specifications

## 1. Architectural Overview
The SURAKSHA Flood Subsystem (`SURAKSHA-MOD-01-FLOOD`) is governed by an orchestrated LangGraph Directed Acyclic Graph (DAG) consisting of **7 specialized agents**. The agents strictly decouple data ingestion, physical modeling, statistical risk assessment, civil protection impacts, and semantic ground-truth verification.

```
       [ DataAgent ]           [ WeatherAgent ]
             │                         │
             └────────────┬────────────┘
                          ▼
                  [ ForecastAgent ]           [ SatelliteAgent ]
                          │                           │
                          └────────────┬──────────────┘
                                       ▼
                                 [ RiskAgent ]
                                       │
                                       ▼
                                [ ImpactAgent ]
                                       │
                                       ▼
                              [ VerificationAgent ]
                                       │
                                       ▼
                              [ Final Validated State ]
```

---

## 2. Agent Catalog & Contracts

### 2.1 Data Agent (`data_agent.py`)
* **Role**: Hydrological telemetry ingestion, CWC gauge QA, and physical plausibility verification.
* **Semantic Intelligence**: Uses TypeSafe Jev `Noul` (`noul_sensor_fault_plausible`) to detect sensor drift, negative discharge, or unphysical gauge spikes ($>1.5\text{ m/hr}$).
* **Input State**: `river_stages`, `cwc_gauge_telemetry`.
* **Output State**: `current_conditions` (`water_level_m`, `danger_level_m`, `rate_of_rise_m_per_hr`, `sensor_health_flag`).
* **Source**: `src/suraksha/disasters/flood/agents/data_agent.py`.

### 2.2 Weather Agent (`weather_agent.py`)
* **Role**: Atmospheric telemetry aggregation, catchment rainfall hyetographs, and antecedent saturation tracking.
* **Calculations**: Computes $API_{3d} = \sum_{t=1}^3 0.85^t R_t$ and $API_{7d} = \sum_{t=1}^7 0.85^t R_t$.
* **Input State**: `precipitation_timeseries`, `basin_catchment_id`.
* **Output State**: `weather_summary` (`precipitation_mm_24h`, `api_3d`, `api_7d`, `soil_moisture_level`).
* **Source**: `src/suraksha/disasters/flood/agents/weather_agent.py`.

### 2.3 Satellite Agent (`satellite_agent.py`)
* **Role**: Sentinel-1 SAR radar backscatter analysis, water index segmentation, and change detection.
* **Input State**: `spatial_bbox`, `acquisition_timestamp`.
* **Output State**: `satellite_extent` (`geojson_polygon`, `inundation_area_km2`, `confidence_level`, `sensor_source`).
* **Source**: `src/suraksha/disasters/flood/agents/satellite_agent.py`.

### 2.4 Forecast Agent (`forecast_agent.py`)
* **Role**: Multi-horizon stage height prediction ($t+6\text{h}$, $t+12\text{h}$, $t+24\text{h}$) using the benchmarked winner from the forecasting model pool.
* **Model Ladder Integration**: Leverages the selected production model evaluated across Persistence, ARIMA, SARIMA, GRU, Causal LSTM, and Hybrid BiLSTM.
* **Input State**: `lookback_features`, `current_conditions`, `weather_summary`.
* **Output State**: `forecast_horizons` (`predicted_stage_6h`, `predicted_stage_12h`, `predicted_stage_24h`, `peak_timing_hours`, `model_used`).
* **Source**: `src/suraksha/disasters/flood/agents/forecast_agent.py`.

### 2.5 Risk Agent (`risk_agent.py`)
* **Role**: Calibrated machine learning flood hazard evaluation using trained XGBoost / GradientBoosting.
* **Output Calibration**: Produces a strictly bounded probability $P(\text{Flood}) \in [0.0, 1.0]$, categorical severity (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`), and top explainable drivers.
* **Input State**: `forecast_horizons`, `current_conditions`, `weather_summary`, `district_metadata`.
* **Output State**: `risk_assessment` (`risk_score`, `severity`, `threshold_breach_expected`, `drivers`).
* **Source**: `src/suraksha/disasters/flood/agents/risk_agent.py`.

### 2.6 Impact Agent (`impact_agent.py`)
* **Role**: Civil infrastructure exposure overlay, critical facility impact assessment, and evacuation shelter routing.
* **Input State**: `satellite_extent`, `risk_assessment`, `infrastructure_geodb`.
* **Output State**: `impact_assessment` (`affected_hospitals`, `affected_substations`, `affected_schools`, `population_at_risk`, `recommended_shelters`).
* **Source**: `src/suraksha/disasters/flood/agents/impact_agent.py`.

### 2.7 Verification Agent (`verification_agent.py`)
* **Role**: External reality corroboration against live news feeds, CWC disaster bulletins, and NDMA alerts.
* **TypeSafe Jev Integration**: Employs Jev `Score` (`score_grounding_confidence`) and Jev `Choice` (`choice_corroboration_status`) to assess whether real-time external evidence supports or contradicts the mathematical risk prediction.
* **Input State**: `risk_assessment`, `forecast_horizons`, `district_id`, `station_id`.
* **Output State**: `grounding_verification` (`corroborated`, `grounding_confidence`, `external_evidence`, `discrepancy_note`).
* **Source**: `src/suraksha/disasters/flood/agents/verification_agent.py`.
