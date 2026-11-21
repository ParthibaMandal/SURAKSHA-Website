# Architectural & Scientific Decision Log

| Field | Value |
|---|---|
| **Document ID** | PM-16-002 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |

---

## 1. Chronological Decision Registry

| Decision ID | Date | Scope | Title & Summary | Status |
|---|---|---|---|---|
| **ADR-001** | Nov 2026 | Architecture | **Modular Monolith Architecture**: Decouple `suraksha.core` from disaster plugins (`disasters/flood`) | APPROVED |
| **ADR-002** | Nov 2026 | Intelligence | **Three-Gate Supervisory Lifecycle**: Implement Pre-Run, Mid-Run, and Post-Run Jev gates | APPROVED |
| **ADR-003** | Nov 2026 | API | **FastAPI Backend Standard**: High-concurrency async REST API with Pydantic contracts | APPROVED |
| **ADR-004** | Nov 2026 | Modeling | **SARIMA Production Champion**: Retain SARIMA with drift trend and runoff scaling over pure LSTM | APPROVED |
| **ADR-005** | Nov 2026 | Geospatial | **GEE Sentinel-1 with Calibrated Offline Fallback**: Enable mission-critical resilience | APPROVED |
