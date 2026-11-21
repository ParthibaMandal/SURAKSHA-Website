# Functional Requirements Specification

| Field | Value |
|---|---|
| **Document ID** | REQ-02-001 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Module** | SURAKSHA-MOD-01-FLOOD |

---

## 1. Scope & Categorization

SURAKSHA establishes 20 core Functional Requirements (FR-001 through FR-020) spanning telemetry ingestion, supervisory validation, forecasting, geospatial analysis, impact estimation, and alert distribution.

---

## 2. Requirements Matrix

| ID | Requirement Statement | Priority | Verification Method |
|---|---|---|---|
| **FR-001** | Ingest real-time river stage observations from CWC NWDP station gauges | Critical | Ingestion unit test |
| **FR-002** | Ingest IMD gridded precipitation and compute antecedent precipitation metrics | High | Weather agent integration test |
| **FR-003** | Ingest Open-Meteo GloFAS river discharge reanalysis and forecasts | Medium | Provider reachability test |
| **FR-004** | Deterministically validate physical rate-of-change bounds ($|\Delta h/\Delta t| \le 2.0$ m/h) | Critical | Pre-Run Gate invariant test |
| **FR-005** | Classify hydrological data into typed regimes (NORMAL, RAPID_RISE, etc.) | High | Policy engine test |
| **FR-006** | Generate 24-hour forward river stage forecasts using SARIMA champion model | Critical | Model benchmark evaluation |
| **FR-007** | Generate 90% confidence uncertainty envelopes for predicted stages | High | Forecast error distribution test |
| **FR-008** | Summon 3-model committee (SARIMA, GRU, BiLSTM) upon rapid surge detection | High | Mid-Run Gate execution test |
| **FR-009** | Adjudicate ensemble spread and trigger Jev System One arbitration when spread $>0.40$m | High | Mid-Run spread test |
| **FR-010** | Extract cloud-penetrating flood inundation extents via Sentinel-1 SAR on GEE | High | Satellite processor test |
| **FR-011** | Decouple permanent water bodies using JRC Global Surface Water 38-year baseline | High | Permanent water mask test |
| **FR-012** | Compute continuous flood depth using Height Above Nearest Drainage (HAND) | Medium | Geospatial elevation test |
| **FR-013** | Evaluate multi-factor calibrated flood risk score normalized to $[0.0, 1.0]$ | Critical | Risk engine test |
| **FR-014** | Estimate affected population and critical infrastructure via OSM overlay | High | Impact assessment test |
| **FR-015** | Perform 4-way cross-agent triangulation before authorizing public release | Critical | Post-Run Gate test |
| **FR-016** | Generate OASIS Common Alerting Protocol (CAP v1.2) XML and JSON payloads | Critical | XML schema validation test |
| **FR-017** | Provide automated SITREP PDF generation for disaster management officers | Medium | Sitrep generator test |
| **FR-018** | Triage incoming citizen SOS messages using NLP urgency scoring | Medium | Citizen distress ticket test |
| **FR-019** | Provide deterministic offline fallbacks for all external cloud APIs | Critical | Air-gapped pipeline test |
| **FR-020** | Maintain immutable append-only audit trail for all agent steps and Jev verdicts | Critical | State contract test |
