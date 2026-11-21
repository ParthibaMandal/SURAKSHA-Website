# SURAKSHA Data Lineage & Provenance Architecture

| Field | Value |
|---|---|
| **Document ID** | DLN-05-003 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Module** | SURAKSHA-MOD-01-FLOOD |

---

## 1. End-to-End Data Flow

The SURAKSHA data architecture guarantees strict traceability from raw ingestion to public alert dissemination. Every data point is tagged with its provenance classification (`OBSERVED`, `REANALYSIS`, `SYNTHETIC`, or `SIMULATED`).

```mermaid
flowchart TD
    subgraph Ingestion ["1. Data Ingestion Tier"]
        CWC["CWC River Telemetry (023-MDGANG)<br/>[OBSERVED]"]
        IMD["IMD / Open-Meteo Weather<br/>[OBSERVED/REANALYSIS]"]
        GEE["Sentinel-1 SAR Backscatter<br/>[OBSERVED]"]
        JRC["JRC Global Surface Water<br/>[OBSERVED]"]
    end

    subgraph PreRun ["2. Pre-Run Gate (Supervisory)"]
        QA["Physics Validation & Jump Detection<br/>|Δh/Δt| ≤ 2.0 m/h"]
        Regime["Data Regime Classifier<br/>NORMAL | RAPID_RISE | EXTREME_RAINFALL"]
    end

    subgraph ForecastTier ["3. Forecasting & Geospatial Tier"]
        SARIMA["SARIMA Champion Model<br/>[SYNTHETIC]"]
        BiLSTM["Hybrid BiLSTM Challenger<br/>[SYNTHETIC]"]
        SAR["Otsu SAR Flood Segmenter<br/>[SYNTHETIC]"]
        HAND["HAND Inundation Depth Model<br/>[SIMULATED]"]
    end

    subgraph MidRun ["4. Mid-Run Gate (Supervisory)"]
        Adjudicate["Committee Spread Adjudication<br/>Δ ≤ 0.40 m"]
        ClaimQA["Agent Claim Verification<br/>5-Tier Taxonomy"]
    end

    subgraph ImpactTier ["5. Risk & Impact Assessment"]
        RiskEng["Calibrated Risk Evaluator<br/>Sigmoid Multi-Factor Curve"]
        ImpactEng["OSM Infrastructure & Population Exposure<br/>Spatial Overlay"]
    end

    subgraph PostRun ["6. Post-Run Gate & Release"]
        Triangulate["4-Way Triangulation<br/>SAR ↔ Forecast ↔ Risk ↔ Population"]
        CAP["CAP v1.2 XML Alert Generator<br/>Public Dissemination"]
        Dashboard["FastAPI & Civil Defense Dashboard"]
    end

    CWC --> QA
    IMD --> QA
    QA --> Regime
    Regime --> SARIMA
    Regime --> BiLSTM
    GEE --> SAR
    JRC --> SAR
    SAR --> HAND
    SARIMA --> Adjudicate
    BiLSTM --> Adjudicate
    Adjudicate --> ClaimQA
    ClaimQA --> RiskEng
    HAND --> ImpactEng
    RiskEng --> Triangulate
    ImpactEng --> Triangulate
    Triangulate --> CAP
    Triangulate --> Dashboard
```

---

## 2. Provenance Transformation Rules

1. **Raw Telemetry**: Ingested directly from CWC NWDP (`OBSERVED`) or Open-Meteo reanalysis (`REANALYSIS`).
2. **Quality Scrubbing**: Data Agent removes non-physical negative stages ($<0.0$ m) and fills transient gaps ($<3$ hours) using cubic splines, logging imputed points with confidence penalties ($\Delta C = -0.05$).
3. **Forecasting**: Statistical and neural models produce 24-hour forward projections (`SYNTHETIC`). Predictions must be accompanied by 90% confidence intervals.
4. **Geospatial Processing**: Raw SAR backscatter (dB) is converted to water probability raster using Lee filter and Otsu thresholding. Subtraction of JRC permanent water produces net flood extent.
5. **Alert Release**: Alerts are generated only when verified by the Post-Run Gate (`is_authoritative = True`). Unverified alerts are held for human civil defense escalation.
