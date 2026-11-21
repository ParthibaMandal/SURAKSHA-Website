# Project Charter: SURAKSHA Flood Intelligence Platform

## Document Metadata
- **Document ID**: `SRK-DOC-01-001`
- **Version**: `1.0.0`
- **Status**: `VERIFIED`
- **Owner**: `SURAKSHA Core Architecture Team`
- **Created Date**: `2026-11-21`
- **Last Updated**: `2026-11-21`
- **Last Verified Against Commit**: `HEAD`
- **Applicable Module**: `Platform Core & SURAKSHA-MOD-01-FLOOD`
- **Related Documents**: `[Project Scope](/docs?doc=01-getting-started--project-scope)`, `[Problem Statement](/docs?doc=01-getting-started--problem-statement)`, `[System Architecture](/docs?doc=04-system-architecture--architecture-overview)`

---

## 1. Project Identity & Purpose
* **Project Name**: SURAKSHA (सुरक्षा — Sanskrit/Hindi for *Protection*, *Safety*, and *Security*).
* **Primary Mission**: To provide an autonomous, scientific, multi-agent civil defense decision-support and early-warning intelligence platform for catastrophic riverine and urban flood events in India.
* **Target Operational Baseline**: The **Ganges River Basin at Patna (Digha – Gandhi Ghat – Danapur corridor, Bihar)**, anchored on high-frequency gauge observations at Gandhi Ghat (`023-MDGANG`).

---

## 2. Technical Identity & Classification
SURAKSHA is a hybrid cyber-physical platform combining:
1. **Hydrological & Meteorological Telemetry Processing**: Real-time river stage, discharge, gridded rainfall, and antecedent moisture indexing.
2. **Earth Observation & Cryosphere Monitoring**: Google Earth Engine integration with Sentinel-1 SAR (C-band radar for cloud-penetrating inundation mapping) and Sentinel-2 optical cryosphere snowline analysis.
3. **Multi-Horizon Probabilistic Neural & Statistical Forecasting**: Champion-challenger model ladder (`SARIMA`, `GRU`, `Hybrid BiLSTM`) producing calibrated stage predictions at 6h, 12h, and 24h horizons.
4. **Agentic Supervisory Governance**: Multi-agent orchestration governed by **TypeSafe Jev System One** across a 3-gate lifecycle (Pre-Run, Mid-Run, Post-Run) enforcing the strict **Scientific Value Governance Invariant** (models own numerical values; Jev supervises decisions and audits claims).
5. **Civil Defense Alert Distribution**: Automated OASIS Common Alerting Protocol (CAP v1.2) XML generation and Commander SITREP briefings.

---

## 3. Core Engineering & Scientific Invariants
1. **Specialist Model Numerical Ownership**: Neural, statistical, and hydraulic models exclusively compute numerical outputs (river stage, discharge, inundated area, damage probability). LLM supervisory agents are strictly prohibited from manufacturing or modifying numbers.
2. **Deterministic Bounded Supervisor Actions**: All supervisor verdicts deterministically resolve into five bounded actions: `CONTINUE`, `HOLD_AND_RETRY`, `RUN_CHALLENGER_MODEL`, `USE_APPROVED_FALLBACK`, or `ESCALATE_TO_HUMAN`.
3. **Offline-First Resilience**: All external integrations (Google Earth Engine, CWC scrapers, TypeSafe API) maintain high-fidelity deterministic offline mocks and fallbacks for air-gapped emergency deployments.
4. **Dual Execution Modes**: Pipelines support both adaptive `supervised` mode and non-branching `static` mode for reproducible empirical benchmarking.
5. **Zero Regressions Standard**: Every modification must pass the full 243+ automated test suite before merge.

---

## 4. Key Stakeholders & Operational Beneficiaries
* **Civil Defense Authorities**: State Disaster Management Authorities (BSDMA), National Disaster Response Force (NDRF), and District Magistrates.
* **Hydrological Researchers**: Central Water Commission (CWC) analysts and disaster management scientists.
* **Frontline Emergency Responders**: Evacuation coordinators and rescue dispatchers.
* **Vulnerable Citizenry**: Communities situated along riparian floodplains receiving localized, actionable CAP alerts.

