# SURAKSHA Production Delivery Roadmap

This document outlines the phased engineering milestones executed to transform the Google Stitch design into a complete, full-stack, production-grade application.

---

## Milestone Progress Matrix

| Milestone | Scope & Deliverable | Status | Verification Criteria |
|---|---|---|---|
| **Phase 1** | Stitch Design System & Specification Audit | **COMPLETE** | `DESIGN_ANALYSIS.md` produced with full screen, component, and token inventory. |
| **Phase 2** | Full-Stack Architecture & Schemas | **COMPLETE** | `SYSTEM_ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, and `API_DOCUMENTATION.md` published. |
| **Phase 3** | Database Layer & Seed Fixtures | **COMPLETE** | Production-ready `database/schema.sql` (MySQL) and `database/seeds.sql` created. |
| **Phase 4** | Python FastAPI Backend Implementation | **IN PROGRESS** | Deploy modular FastAPI backend with SQLAlchemy models, Pydantic schemas, and REST routers. |
| **Phase 5** | Functional Integration & Frontend Polish | **QUEUED** | Wire up interactive SOS dispatch, gate adjustments, approval reviews, and auth sessions in Next.js. |
| **Phase 6** | End-to-End Verification & Documentation | **QUEUED** | Execute automated test runner, verify responsive layouts, and update `README.md`. |

---

## Detailed Task Checklist

### Phase 3 — Database Assets (`database/`)
- [x] Write `database/schema.sql` with 12 normalized 3NF tables, foreign keys, and indexes.
- [x] Write `database/seeds.sql` with realistic Ganga-Brahmaputra telemetry stations, sample users (admin, operator, citizen), active scenarios, barrage gates, CAP alerts, and SOS queue items.

### Phase 4 — Backend Implementation (`backend/`)
- [ ] Create `backend/requirements.txt` with FastAPI, Uvicorn, SQLAlchemy, Pydantic v2, Python-Jose, Passlib, and Bcrypt.
- [ ] Create `backend/app/database.py` with multi-dialect support (MySQL with SQLite automatic fallback).
- [ ] Implement SQLAlchemy ORM models in `backend/app/models/`.
- [ ] Implement Pydantic validation schemas in `backend/app/schemas/`.
- [ ] Implement REST routes:
  - `auth.py`
  - `stations.py`
  - `scenarios.py`
  - `gates.py`
  - `alerts.py`
  - `sos.py`
  - `incidents.py`
  - `audit.py`
- [ ] Wire routers into `backend/app/main.py` with CORS and error handlers.

### Phase 5 — Functional Integration
- [ ] Connect Next.js Citizen SOS form (`app/citizen/sos/page.tsx`) to submit live requests to `/api/flood/sos`.
- [ ] Connect Admin Approvals (`app/admin/approvals/page.tsx`) to approve/reject real alert drafts.
- [ ] Connect Admin Gates (`app/admin/gates/page.tsx`) to actuate real gate aperture percentages.
- [ ] Connect Flood Lab (`app/demo-lab/page.tsx`) to trigger real scenario simulation runs.
- [ ] Connect Auth pages (`app/auth/login/page.tsx` & `app/auth/register/page.tsx`) to handle real tokens and role switches.

### Phase 6 — Delivery & Run Guides
- [ ] Build automated test script in `scripts/test_system.py` to verify all REST endpoints.
- [ ] Author unified `README.md` with startup commands, environment configurations, and deployment steps.

