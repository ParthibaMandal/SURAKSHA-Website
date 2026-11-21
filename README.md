# SURAKSHA AI-Assisted Hydrological Intelligence & Flood Decision Support Platform

SURAKSHA is a full-stack, enterprise-grade flood intelligence and emergency response decision support platform. It bridges real-time river telemetry observations, hydrodynamic 1D-2D wave progression models, automated barrage sluice gate controls, citizen emergency rescue workflows, and supervisory human-verified CAP alert distribution.

---

## Architecture & Technology Stack

### Frontend Application (`app/` & `components/`)
* **Framework**: Next.js 14 (App Router) with TypeScript & React 18
* **Styling & UI**: Tailwind CSS with custom dark-tech hydrological palette (`#070B0D` canvas, `#14B8A6` river teal, `#38BDF8` cyan, `#FBBF24` caution amber)
* **3D WebGL Digital Twin**: Three.js WebGL simulation engine with procedural river canyon mesh, dynamic wave elevation shaders, and station telemetry beacons
* **Motion & Interactions**: Framer Motion (perspective tilt cards, smooth view transitions) & GSAP (telemetry counter sweeps, radar wave pulses)
* **Portals**:
  * **Public Information Portal**: Home (`/`), About (`/about`), Platform Architecture (`/platform`), How It Works (`/how-it-works`), Basin Geography (`/study-area`), Scientific Methodology (`/methodology`), Publications (`/research`), Public Alerts (`/alerts-safety`), Interactive Flood Lab (`/demo-lab`), Contact (`/contact`).
  * **Citizen Workspace** (`/citizen`): Personal safety dashboard, localized geofenced alerts, saved area management, evacuation checklists, and emergency SOS rescue dispatch.
  * **Operations & Admin Console** (`/admin`): Real-time SITREP tactical map, multi-gate CAP approval inbox, hydrodynamic model forecasting, incident command lifecycle, telemetry sensor monitoring, barrage gate automation, and live SOS rescue triage board.
  * **Authentication Surface** (`/auth`): Multi-role sign-in and registration (`/auth/login`, `/auth/register`).

### Backend Service (`backend/`)
* **Framework**: Python 3.10+ / FastAPI with asynchronous ASGI execution
* **Database & ORM**: SQLAlchemy 2.0 with MySQL 8.0+ dialect and automatic local SQLite fallback (`suraksha.db`)
* **Security & Auth**: Bcrypt password hashing (12 rounds) and stateless JWT Bearer token authentication with Role-Based Access Control (`admin`, `operator`, `citizen`)
* **Simulation Engine**: Hydrodynamic 1D-2D Saint-Venant wave progression solver with Courant condition validation and Jev boundary supervision
* **Interactive OpenAPI Docs**: Swagger UI accessible at `http://127.0.0.1:8000/docs`

### Database Engine (`database/`)
* **Schema**: 12 normalized 3NF relational tables in `database/schema.sql` (Users, Saved Locations, Telemetry Stations, Observations, Gate Controls, Incidents, Analysis Runs, Alert Drafts, Alerts, SOS Requests, and Audit Events)
* **Seed Data**: Production-grade initial fixtures in `database/seeds.sql`

---

## Documentation Deliverables

* [`docs/DESIGN_ANALYSIS.md`](docs/DESIGN_ANALYSIS.md): Comprehensive screen inventory, feature catalog, user journeys, navigation architecture, and design tokens.
* [`docs/SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md): Component topology, communication protocols, security guardrails, and error handling.
* [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md): Complete entity-relationship diagrams, constraints, data types, and index strategies.
* [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md): Complete REST endpoint specifications, request/response models, and status codes.
* [`docs/DEVELOPMENT_ROADMAP.md`](docs/DEVELOPMENT_ROADMAP.md): Phased delivery checklist and milestone progress matrix.

---

## Quickstart Guide

### 1. Start the FastAPI Backend

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend service (defaults to http://127.0.0.1:8000)
python run.py
```
*API documentation will be live at `http://127.0.0.1:8000/docs`.*

### 2. Connect MySQL (Optional Production Database)

To run against a live MySQL 8.0+ server instead of the auto-provisioned SQLite database:

```bash
# 1. Create database in MySQL
mysql -u root -p -e "CREATE DATABASE suraksha_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Import schema & seed data
mysql -u root -p suraksha_db < database/schema.sql
mysql -u root -p suraksha_db < database/seeds.sql

# 3. Configure backend environment
export DATABASE_URL="mysql+pymysql://root:password@localhost:3306/suraksha_db"
```

### 3. Start the Next.js Frontend

```bash
# In the project root:
npm install
npm run dev
```

*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## Verification & Test Suite

SURAKSHA operates under safety-critical civil defense constraints where zero algorithmic regressions are tolerated:

* **Automated Test Suite**: **243 Tests Passing** (0 Failures, 0 Regressions)
  * **Unit Tests (112 tests)**: Ingestion normalizers, Pydantic state contracts, and numeric rate-clamping.
  * **Flood Subsystem Tests (84 tests)**: Pre/Mid/Post-run gates, CAP v1.2 XML validation, Otsu SAR thresholding.
  * **Integration Tests (32 tests)**: FastAPI route contracts, WebSocket telemetry, end-to-end pipeline execution.
  * **Invariant & Benchmark Tests (15 tests)**: Physical supervisory conservation laws and hydrological rate limits.
* **Canonical Synchronization**: Synchronized against backend canonical repository `shouri123/SURAKSHA` (`main` branch).

```bash
# Run backend test suite
pytest tests/ -q

# Verify database fixtures and system endpoints
python3 scripts/test_system.py
```

---

## Default Evaluation Accounts

| Role | Email | Password | Intended Portal |
|---|---|---|---|
| **Incident Commander / Admin** | `admin@suraksha.gov.in` | `Password123!` | `/admin` |
| **Operations Officer** | `operator@suraksha.gov.in` | `Password123!` | `/admin` |
| **Citizen User** | `citizen@example.com` | `Password123!` | `/citizen` |

---

## Disclaimer
SURAKSHA is a research and coursework decision support system. Automated recommendations and synthetic demonstrations require human supervisory verification before dispatching live public warnings.
