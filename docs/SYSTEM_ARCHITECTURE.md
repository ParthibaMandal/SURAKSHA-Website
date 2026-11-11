# SURAKSHA System Architecture Specification

## 1. Architectural Topology Overview

SURAKSHA follows a decoupled, 3-tier reactive architecture engineered for resilience under degraded connectivity and high concurrency during crisis events:

```
[ Client Layer (Next.js 14 App Router / React 18) ]
       │                                     ▲
       │  JSON / REST (HTTPS)                │  SSE / Polling
       ▼                                     │
[ BFF / API Gateway (Next.js Edge Handlers & Session Proxy) ]
       │
       │  Internal Service-to-Service REST
       ▼
[ Application & Analytics Core (Python FastAPI) ]
       ├── Hydrological Ingestion & Physics Engine
       ├── Jev Supervisory Boundary Validation
       ├── Common Alerting Protocol (CAP) Engine
       ├── Auth, RBAC & Audit Middleware
       └── Async Background Task Runner
       │
       ▼
[ Persistence Layer (MySQL 8.0+ / SQLite Auto-Fallback) ]
       ├── Users, Roles & Geofences
       ├── Telemetry Stations & Observations
       ├── Hydrological Scenarios & Predictions
       ├── Incidents & Situational Reports (SITREP)
       ├── CAP Alerts & Public Advisories
       ├── SOS Assistance Intake Queue
       └── Cryptographically Sealed Audit Log
```

---

## 2. Component Subsystems

### A. Frontend Layer (Next.js 14 / React 18 / Tailwind CSS)
* **Rendering Strategy**: Hybrid architecture using Static Site Generation (SSG) for academic research and methodology pages, combined with Client-Side Hydration (CSR) for real-time operations dashboards and citizen tracking.
* **Component Primitives**: Built on Tailwind CSS, Framer Motion transitions, Lucide React iconography, and Three.js WebGL canvas for 3D digital river mesh simulation.
* **State Management**: React state hooks (`useState`, `useEffect`, `useCallback`) alongside local storage session caching with automatic reconnection fallbacks.
* **Resilience Pattern**: Built-in graceful degradation — if the live FastAPI backend is unreachable or unconfigured, the frontend automatically falls back to deterministic local mock simulations and informs the user with an explicit warning banner.

### B. Backend Engine (Python 3.10+ / FastAPI)
* **Framework**: FastAPI with asynchronous ASGI execution (`uvicorn`), offering automatic OpenAPI/Swagger documentation, strict request/response serialization via Pydantic v2, and sub-10ms response times.
* **Authentication Subsystem**:
  * Passwords hashed using `bcrypt` (12 rounds).
  * Stateless JWT authentication (`python-jose`) with configurable token expiry (24 hours).
  * Role-Based Access Control (RBAC) enforced via FastAPI dependency injection:
    * `ROLE_PUBLIC`: Read-only access to published alerts and catalog metadata.
    * `ROLE_CITIZEN`: Manage personal geofences, file SOS assistance requests, view personalized alerts.
    * `ROLE_OPERATOR`: Execute scenarios, modify barrage gate discharges, triage SOS requests.
    * `ROLE_INCIDENT_COMMANDER` / `ROLE_ADMIN`: Sign off and approve public CAP alerts, view audit logs, adjust model thresholds.
* **Physics & AI Simulation Module**:
  * Implements synthetic hydrodynamic wave progression models based on Saint-Venant 1D shallow water equations.
  * Evaluates Pre-Run, Mid-Run, and Post-Run boundary sanity checks.
  * Supervised Jev Validator ensures gate discharge recommendations do not exceed downstream embankment capacity.

### C. Database Architecture (MySQL 8.0+ with SQLite Auto-Fallback)
* **ORM Engine**: SQLAlchemy 2.0 with connection pooling (`pool_size=10`, `max_overflow=20`, `pool_pre_ping=True`).
* **Relational Schema**: 12 normalized tables with strict foreign key constraints, cascade rules, and B-tree indexes on foreign keys, timestamps, and status fields.
* **Zero-Setup Resilience**: Automatically provisions a local SQLite database (`suraksha.db`) if MySQL credentials are not provided in the environment, ensuring the system boots instantly in any development or evaluation setting.

---

## 3. Communication Protocols & Security Guardrails

### A. Data Flow Security
1. **Never Hardcode Credentials**: All secrets (JWT Secret Key, Database URL, Operator API Key, SMTP tokens) are loaded strictly via environment variables.
2. **CORS Enforcement**: Configured to whitelist authorized frontend origins (`http://localhost:3000`, `http://127.0.0.1:3000`, and custom production domain).
3. **Audit Ledger**: All state changes to barrage gates, emergency alert publications, and SOS triage outcomes append an entry to the `audit_events` table recording user ID, IP address, action code, and JSON diff payload.
4. **Data Minimization for SOS**: Citizen phone numbers and exact coordinates are strictly restricted to users with `ROLE_OPERATOR` or `ROLE_ADMIN` and purged upon incident closure.

### B. Error Handling & Logging
* Centralized HTTP exception handlers intercept validation errors and return standard RFC 7807 problem details:
  ```json
  {
    "status": 422,
    "error": "Unprocessable Entity",
    "detail": "River discharge value cannot be negative.",
    "timestamp": "2026-11-11T17:15:00Z"
  }
  ```
* Standard structured JSON logging with request correlation IDs across all endpoints.

