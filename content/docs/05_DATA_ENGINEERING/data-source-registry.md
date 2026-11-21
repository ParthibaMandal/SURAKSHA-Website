# SURAKSHA Data Source Registry

---

| Field | Value |
|---|---|
| **Document ID** | DSR-05-001 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Module** | SURAKSHA-MOD-01-FLOOD |
| **Last Audit** | November 2026 |
| **Maintained By** | Data Engineering Team |

---

## Overview

The SURAKSHA Disaster Intelligence Platform ingests data from eight authoritative upstream providers, each serving a distinct role in the flood forecasting pipeline. This registry documents every data source with its provenance, authentication requirements, offline fallback strategy, and provenance category.

**Provenance Categories:**

| Category | Definition |
|---|---|
| `OBSERVED` | Direct physical measurement from an in-situ sensor or satellite acquisition |
| `REANALYSIS` | Numerical model output assimilated with historical observations (e.g., ERA5) |
| `SYNTHETIC` | Deterministically computed from physical equations; not directly observed |
| `SIMULATED` | Scenario-based forward projection using numerical weather/hydraulic models |

---

## Source Registry

### DSR-01 — CWC Gandhi Ghat River Gauge (023-MDGANG)

| Attribute | Value |
|---|---|
| **Provider** | Central Water Commission (CWC), Government of India — National Water Data Portal (NWDP) |
| **Internal Station ID** | `GANGES_PATNA` |
| **CWC Gauge Code** | `023-MDGANG` |
| **Station Name** | Gandhi Ghat Gauge, Patna (Digha/Gandhi Ghat) |
| **Purpose** | Primary river stage telemetry for Ganges at Patna — the operational flood-watch anchor |
| **Measurement Variable** | River Stage Height (`water_level_m`) in meters above sea level (MSL) |
| **Spatial Resolution** | Point measurement: `25.61° N, 85.14° E` |
| **Geographic Coverage** | Patna, Bihar — lower Ganga mainstem (340 km from mouth at Farakka) |
| **Temporal Resolution** | 1-hour intervals (operational real-time) |
| **Temporal Coverage** | Continuous since 1954; digital record available from 2000 |
| **Licensing** | Government open data — CWC NWDP public access |
| **Authentication** | Web scraping (`https://nwdp.nic.in/`) — no API key; session-based |
| **Offline Fallback** | ERA5-Land/GloFAS reanalysis stage proxy (`river_discharge_m3s` → stage conversion using rating curve) |
| **Provenance Category** | `OBSERVED` |
| **Key Thresholds** | Warning: 49.52 m MSL · Danger: 50.52 m MSL · Historic Flood Level (HFL): 52.52 m MSL |
| **Notes** | CWC publishes bulletin updates every 6 hours during flood season (June–October). The SURAKSHA pipeline uses the hourly interval reanalysis proxy as the primary training dataset; CWC live scraping activates in production deployment. |

---

### DSR-02 — IMD Gridded Rainfall (RF25 / rfp25)

| Attribute | Value |
|---|---|
| **Provider** | India Meteorological Department (IMD) |
| **Dataset Identifier** | `RF25_ind2025_rfp25` (NetCDF + GRD format) |
| **Purpose** | Daily gridded observed rainfall for forcing hydrological models and antecedent precipitation index (API) computation |
| **Variables** | `precipitation` (mm/day) at 0.25° × 0.25° grid |
| **Spatial Resolution** | 0.25 degree (≈27.5 km at the equator) |
| **Geographic Coverage** | All-India spatial domain: `6.5° N–38.5° N, 66.5° E–100.5° E` |
| **Temporal Resolution** | Daily (accumulation 03:00 UTC to 03:00 UTC next day) |
| **Temporal Coverage** | 1901–present; rfp25 is the 2025 operational product |
| **Data Format** | NetCDF-4 (`.nc`) + IMD binary GRD (`.grd`) |
| **Licensing** | IMD open research access; citation required |
| **Authentication** | IMD FTP server (`ftp.imd.gov.in`) — institutional credentials required for bulk historical downloads |
| **Offline Fallback** | ERA5-Land `total_precipitation` at 0.1° resolution via Open-Meteo API |
| **Provenance Category** | `OBSERVED` |
| **Notes** | The `data/new datasets/RF25_ind2025_rfp25.nc` and `.grd` files contain the 2025 monsoon season data. The SURAKSHA pipeline extracts the Patna sub-district grid cell at `25.5°–25.75° N, 85.0°–85.25° E`. |

---

### DSR-03 — Copernicus ERA5-Land Reanalysis (Hourly)

| Attribute | Value |
|---|---|
| **Provider** | European Centre for Medium-Range Weather Forecasts (ECMWF) — Copernicus Climate Change Service (C3S) |
| **Dataset Identifier** | `ERA5-Land` hourly reanalysis |
| **Internal Alias** | `era5_patna_himalayan_catchments` |
| **Purpose** | Authoritative meteorological reanalysis for model training: precipitation, temperature, soil moisture, surface pressure |
| **Variables** | `precipitation` (mm/h), `soil_moisture_0_to_7cm` (m³/m³), `soil_moisture_7_to_28cm` (m³/m³), `surface_pressure` (hPa), `temperature_2m` (°C) |
| **Spatial Resolution** | 0.1 degree (≈9 km), land-only |
| **Geographic Coverage** | Patna basin: `25.61° N, 85.14° E`; Himalayan catchment grid: 14 grid cells across the Upper Ganga basin |
| **Temporal Resolution** | 1 hour (UTC) |
| **Temporal Coverage** | 1950–2024 (complete); training subset: **May 1 – October 31, 2024** (4,416 hours) |
| **Data Format** | NetCDF-4; accessed via Open-Meteo Historical Archive API (JSON/CSV) |
| **Licensing** | Copernicus Open Access — Creative Commons Attribution 4.0 International (CC-BY 4.0) |
| **Authentication** | Open-Meteo API (no key required for historical); Copernicus CDS API key (`~/.cdsapirc`) for direct download |
| **Offline Fallback** | Locally cached `data/processed/real_hourly_hydrological_timeseries.csv` (pre-ingested) |
| **Provenance Category** | `REANALYSIS` |
| **Notes** | ERA5-Land achieves sub-daily accuracy for South Asian monsoon precipitation. The SURAKSHA pipeline ingests via the Open-Meteo Historical API endpoint: `https://archive-api.open-meteo.com/v1/archive`. The ADF stationarity test on the ingested stage series confirms non-stationarity (ADF = -4.695, p < 0.0001), mandating d=1 differencing in SARIMA models. |

---

### DSR-04 — GloFAS River Discharge (Copernicus)

| Attribute | Value |
|---|---|
| **Provider** | Global Flood Awareness System (GloFAS) — Copernicus Emergency Management Service (CEMS), ECMWF |
| **Dataset Identifier** | GloFAS Historical Discharge Reanalysis |
| **Internal Variable** | `river_discharge_m3s` (m³/s) |
| **Purpose** | Continuous river discharge time series for the Ganges at Patna and Brahmaputra at Guwahati, used as a hydrological state variable and GRU/LSTM model input feature |
| **Variables** | `river_discharge_m3s` — volumetric flow rate |
| **Spatial Resolution** | 0.1 degree (routed to gauge station point) |
| **Geographic Coverage** | Ganges at Patna (`25.61° N, 85.14° E`), Brahmaputra at Guwahati (`26.18° N, 91.73° E`) |
| **Temporal Resolution** | 1 hour |
| **Temporal Coverage** | May 1, 2024 – October 31, 2024 |
| **Data Format** | JSON (Open-Meteo Flood API) |
| **Licensing** | Copernicus Open Access — CC-BY 4.0 |
| **Authentication** | Open-Meteo Flood API: `https://flood-api.open-meteo.com/v1/flood` — no key required |
| **Offline Fallback** | Cached `data/processed/real_hourly_hydrological_timeseries.csv` |
| **Provenance Category** | `REANALYSIS` |
| **Notes** | GloFAS discharge is the hydrological backbone of the training dataset. At Patna, observed discharge ranges from ~1,338 m³/s (pre-monsoon) to >50,000 m³/s at peak flood. The model uses discharge as an input feature but does not forecast it directly — stage height is the primary forecast target. |

---

### DSR-05 — Sentinel-1 SAR via Google Earth Engine

| Attribute | Value |
|---|---|
| **Provider** | European Space Agency (ESA) — Copernicus Programme; served via Google Earth Engine (GEE) |
| **GEE Collection** | `COPERNICUS/S1_GRD` |
| **Purpose** | Cloud-penetrating SAR imagery for active flood inundation extent mapping during monsoon conditions |
| **Variables** | VV backscatter (dB), VH backscatter (dB); derived: `flooded_area_km2`, `geojson` polygon |
| **Sensor** | Sentinel-1A/B C-Band SAR, 5.405 GHz center frequency |
| **Instrument Mode** | Interferometric Wide Swath (IW) |
| **Polarization** | VV (primary for open water detection); VH available |
| **Spatial Resolution** | 10 m pixel spacing (GRD product) |
| **Geographic Coverage** | Patna AOI bounding box: `[85.00, 25.45, 85.35, 25.75]` |
| **Temporal Resolution** | ~6-day revisit (Sentinel-1A alone); ~3-day with A+B constellation |
| **Temporal Coverage** | 2014–present |
| **Licensing** | Copernicus Legal Notice — free open access for all users |
| **Authentication** | Google Earth Engine service account (JSON key) → `EE_SERVICE_ACCOUNT` environment variable; `earthengine authenticate` CLI |
| **Offline Fallback** | Synthetic SAR polygon generator (`_generate_simulated_sar_extent`) with provenance tag `SYNTHETIC_SCENARIO`; cached `data/processed/satellite_flood_extent_patna.geojson` |
| **Provenance Category** | `OBSERVED` (live GEE) / `SYNTHETIC` (offline fallback) |
| **Water Detection Threshold** | -16.0 dB (conservative; unvalidated against labeled Patna masks) |
| **Notes** | The pipeline always retains `scene_ids` for auditability. Permanent water subtraction uses JRC/GSW1_4 occurrence > 80%. The `classification_status` field is explicitly set to `UNVALIDATED_SURFACE_WATER_PROXY` until local validation is complete. |

---

### DSR-06 — JRC Global Surface Water (GSW1.4)

| Attribute | Value |
|---|---|
| **Provider** | Joint Research Centre (JRC), European Commission |
| **GEE Collection** | `JRC/GSW1_4/GlobalSurfaceWater` |
| **Purpose** | Permanent water body masking — eliminates the Ganges river channel from SAR flood extent polygons |
| **Band Used** | `occurrence` (percentage of months water was present, 1984–2021) |
| **Threshold** | > 80% occurrence → classified as permanent water |
| **Spatial Resolution** | 30 m |
| **Geographic Coverage** | Global |
| **Temporal Coverage** | 1984–2021 (occurrence composite) |
| **Licensing** | European Commission open access |
| **Authentication** | Google Earth Engine (same credentials as DSR-05) |
| **Offline Fallback** | When JRC data unavailable, `permanent_water_mask=False` is used; flood_mask equals raw SAR water_mask (risk of false positives from permanent channel) |
| **Provenance Category** | `OBSERVED` (Landsat-derived long-term composite) |
| **Notes** | The occurrence band value represents the percentage of months in the 1984–2021 Landsat time series during which water was present. The 80% threshold is deliberately conservative: it retains ephemeral seasonal channels in the flood extent to avoid missing legitimate inundation. |

---

### DSR-07 — OpenStreetMap Infrastructure Catalog

| Attribute | Value |
|---|---|
| **Provider** | OpenStreetMap (OSM) — OpenStreetMap Foundation (OSMF) |
| **Internal Dataset** | `data/processed/critical_infrastructure_exposure.csv` / `.json` |
| **New Datasets** | `data/new datasets/osm_patna_target_aoi_infrastructure.csv` |
| **Purpose** | Critical infrastructure exposure layer: hospitals, schools, shelters, bridges, power substations, water treatment plants |
| **Record Count** | 126 georeferenced critical assets across 7 vulnerable districts |
| **Variables** | `asset_id`, `asset_type`, `latitude`, `longitude`, `elevation_m`, `capacity_beds`, `inundation_threshold_m`, `district`, `state` |
| **Spatial Resolution** | Point geometry (lat/lon) |
| **Geographic Coverage** | Patna, Kamrup Metro, Cuttack, Wayanad, Gorakhpur, Darbhanga, Puri |
| **Temporal Coverage** | Static snapshot (October 2026 OSM export) |
| **Licensing** | Open Database License (ODbL) 1.0 — attribution required |
| **Authentication** | Overpass API (no key); Nominatim API (no key; rate-limited) |
| **Offline Fallback** | Cached CSV/JSON file; Impact Agent reads from filesystem |
| **Provenance Category** | `OBSERVED` (crowd-sourced but authoritative for infrastructure location) |
| **Notes** | The Impact Agent uses PostGIS-style spatial operations (`ST_Intersects`, `ST_DWithin`) over this catalog to compute exposed facilities within the flood polygon. Elevation data is supplemented from Copernicus DEM GLO-30. |

---

### DSR-08 — NDMA / IndoFloods District Vulnerability

| Attribute | Value |
|---|---|
| **Provider** | National Disaster Management Authority (NDMA), Government of India; IndoFloods v3 research dataset |
| **Raw Data Path** | `data/raw/indofloods/` |
| **Processed Data** | `data/processed/district_risk_training_data.csv` |
| **Files** | `DFSI.csv` (744 districts), `District_FloodedArea.csv` (732 districts), `District_FloodImpact.csv` (732 districts), `India_Flood_Inventory_v3.csv` (6,876 events, 1967–2023) |
| **Purpose** | District-level flood susceptibility, historical inundation exposure, and human vulnerability priors for the Risk Agent training dataset |
| **Variables** | `district_flood_susceptibility_index` (DFSI), `historical_flooded_area_km2`, `affected_population`, `crop_damage_crore_inr`, `mortality_count`, `district_id`, `state_name` |
| **Spatial Resolution** | Administrative district level (India has ~748 districts) |
| **Geographic Coverage** | All-India (prioritized on Bihar, Assam, Odisha, UP, Uttarakhand) |
| **Temporal Coverage** | 1967–2023 (inventory); 2000–2023 for vulnerability metrics |
| **Licensing** | NDMA government open data; IndoFloods CC-BY research license |
| **Authentication** | No API; static CSV download |
| **Offline Fallback** | Always available as cached raw files |
| **Provenance Category** | `OBSERVED` (historical census + administrative records) |
| **Notes** | The Risk Agent training dataset integrates DFSI with continuous physics-informed features (stage anomaly, API, soil saturation). The resulting `district_risk_training_data.csv` has 4,896 rows across 816 districts with zero missing values. The GradientBoosting risk model achieves >90% accuracy on the validation split. |

---

## Authentication Summary Matrix

| Source | Method | Secret Variable | Fallback Available |
|---|---|---|---|
| CWC NWDP | Web scraping (session) | None | ✅ ERA5 proxy |
| IMD RF25 | FTP + HTTP download | IMD institutional credentials | ✅ ERA5-Land |
| ERA5-Land | Open-Meteo API (no key) | `CDS_API_KEY` for direct CDS | ✅ Cached CSV |
| GloFAS | Open-Meteo Flood API (no key) | None | ✅ Cached CSV |
| Sentinel-1 / GEE | GEE Service Account | `EE_SERVICE_ACCOUNT` | ✅ Synthetic polygon |
| JRC GSW | GEE (same as above) | `EE_SERVICE_ACCOUNT` | ✅ No-mask mode |
| OpenStreetMap | Overpass/Nominatim (no key) | None | ✅ Cached JSON |
| IndoFloods | Static CSV (no API) | None | ✅ Always available |

> [!CAUTION]
> **Never commit** `EE_SERVICE_ACCOUNT` JSON credentials, `CDS_API_KEY`, or any IMD FTP credentials to source control. All secrets must be loaded from environment variables.

---

## Provenance Category Summary

| Source | Category | Rationale |
|---|---|---|
| CWC Gandhi Ghat gauge | `OBSERVED` | Physical in-situ sensor measurement |
| IMD RF25 gridded rainfall | `OBSERVED` | Gauge-network interpolated daily product |
| ERA5-Land | `REANALYSIS` | ECMWF 4D-Var data assimilation, model-estimated |
| GloFAS discharge | `REANALYSIS` | Hydrological routing model, assimilation-driven |
| Sentinel-1 SAR (live GEE) | `OBSERVED` | Direct satellite acquisition |
| Sentinel-1 (offline fallback) | `SYNTHETIC` | Synthetic polygon generator |
| JRC Global Surface Water | `OBSERVED` | Landsat-derived long-term composite |
| OpenStreetMap | `OBSERVED` | Crowd-sourced geographic database |
| IndoFloods / NDMA | `OBSERVED` | Administrative historical records |

---

## Related Documents

- [`data-quality-framework.md`](./data-quality-framework.md) — 14-point audit checks for all ingested data
- [`data-lineage.md`](./data-lineage.md) — End-to-end ingestion pipeline and data flow diagrams
- [`data-dictionary.md`](./data-dictionary.md) — Variable schema for the processed timeseries
- [`/data/DATA_PROVENANCE.md`](/data/DATA_PROVENANCE.md) — Authoritative provenance specification
- [`/src/suraksha/disasters/flood/geospatial/s1_sar_processor.py`](/src/suraksha/disasters/flood/geospatial/s1_sar_processor.py) — SAR processor implementation
