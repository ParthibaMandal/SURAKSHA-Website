# SURAKSHA Data Architecture & Lineage Specification

## 1. Overview & Data Tier Hierarchy

The SURAKSHA platform enforces strict tier isolation across its datasets to ensure immutability of raw records, reproducible feature pipelines, and zero git repository bloat.

```text
data/
├── raw/                      # Immutable raw upstream archives & inventories
│   ├── indofloods/           # National susceptibility & historical flood catalogs
│   │   ├── DFSI.csv
│   │   ├── District_FloodedArea.csv
│   │   ├── District_FloodImpact.csv
│   │   ├── India_Flood_Inventory_v3.csv
│   │   └── variables_description_indofloods.pdf
│   └── urban_flood_benchmark/ # Hydrodynamic 1D pipe + 2D overland mesh data
│       ├── 1d_nodes_dynamic_all.csv
│       ├── 2d_nodes_dynamic_all.csv
│       ├── timesteps.csv
│       └── urban-flood-modelling.zip
├── processed/                # Standardized arrays, ML matrices & GeoJSON polygons
│   ├── real_hourly_hydrological_timeseries.csv
│   ├── district_risk_training_data.csv
│   ├── critical_infrastructure_exposure.csv/.json
│   ├── historical_replay_scenarios.csv/.json
│   ├── satellite_flood_extent_patna.geojson
│   ├── synthetic_design_storms.csv
│   └── urban_flood_continuous_timeseries.csv
└── fixtures/                 # Micro test datasets for CI/CD unit & integration tests
```

---

## 2. Lineage & Transformation Pipelines

```mermaid
flowchart TD
    subgraph RAW ["Tier 1: Raw Upstream Ingestion"]
        R1["NDMA & IndoFloods Catalogs<br/>(data/raw/indofloods/)"]
        R2["Copernicus GloFAS & ERA5<br/>(Open-Meteo REST Archive)"]
        R3["Sentinel-1 SAR C-Band<br/>(COPERNICUS/S1_GRD)"]
        R4["Urban Hydrodynamic Mesh<br/>(data/raw/urban_flood_benchmark/)"]
    end

    subgraph PIPELINES ["Tier 2: Processing & Extraction Pipelines"]
        P1["experiments/flood/pipelines/upgrade_datasets.py"]
        P2["experiments/flood/pipelines/fetch_real_hourly_hydrology.py"]
        P3["src/suraksha/disasters/flood/geospatial/s1_sar_processor.py"]
        P4["experiments/flood/pipelines/build_all_datasets.py"]
    end

    subgraph PROCESSED ["Tier 3: Standardized Processed Datasets"]
        D1["district_risk_training_data.csv<br/>(816 districts, physics-informed)"]
        D2["real_hourly_hydrological_timeseries.csv<br/>(4,416 hrs/station, ERA5 + GloFAS)"]
        D3["satellite_flood_extent_patna.geojson<br/>(Otsu/Lee flood boundary polygon)"]
        D4["urban_flood_continuous_timeseries.csv<br/>(5-min continuous time-series)"]
        D5["historical_replay_scenarios.csv/.json<br/>(79 positive + 50 negative)"]
        D6["critical_infrastructure_exposure.csv/.json<br/>(126 georeferenced assets)"]
    end

    R1 --> P1 --> D1
    R1 --> P4 --> D5
    R1 --> P4 --> D6
    R2 --> P2 --> D2
    R3 --> P3 --> D3
    R4 --> P4 --> D4
```

---

## 3. Storage Governance & Git Hygiene

1. **Large Binary Management**:
   - Files exceeding 50MB (such as `urban-flood-modelling.zip` at 153MB and `sample_submission.csv` at 1.08GB) are strictly excluded from source control via `.gitignore`.
2. **Processed Dataset Versioning**:
   - Processed CSV and GeoJSON files used by core benchmarks are maintained in `data/processed/`.
3. **Reproducibility**:
   - All processed files are fully deterministically reproducible by executing `experiments/flood/pipelines/build_all_datasets.py` and `upgrade_datasets.py`.
