# SURAKSHA Flood Intelligence Website

SURAKSHA is a flood intelligence and early-warning minor project. This repository contains the public website and application interface. The scientific pipeline and FastAPI service live in the separate [`shouri123/SURAKSHA`](https://github.com/shouri123/SURAKSHA) repository.

## Architecture & Technology Stack

- **Framework**: Next.js 14 (App Router) with TypeScript & React 18
- **Styling & UI**: Tailwind CSS with custom dark-tech hydrological palette & shadcn/ui component architecture
- **3D WebGL Digital Twin**: Dedicated modular Three.js engine (`lib/three/digital-twin-engine.ts`) & React component (`components/three/DigitalTwinScene.tsx`) with topographic canyon mesh, flowing waves, station telemetry beacons, particles, orbit controls, and real-time surge simulation
- **Motion & Interactions**: Framer Motion (3D perspective tilt cards, smooth view reveals) & GSAP (telemetry counter sweeps, radar wave pulses)
- **Portals**:
  - Public Information & Research Portal (Home, Platform, How It Works, Research, Alerts & Safety, Demo Lab, Study Area, Contact)
  - Citizen Portal (`/citizen`): Basin dashboard, saved locations, alerts, safety checklists, SOS preview
  - Operations Control Room (`/admin`): Real-time telemetry, 3-stage Supervisory Gates (Pre-run, Mid-run, Post-run), ensemble hydrographs, alert verification, and audit logs
- **Backend Bridge**: Next.js Route Handlers proxying `/api/flood/health` and `/api/flood/stations` to the FastAPI backend (`SURAKSHA_BACKEND_URL`).

## Run locally

Requires Node.js 20 or newer.

```powershell
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Production build & start
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000). To connect read-only data from a running backend, set `SURAKSHA_BACKEND_URL` (default: `http://127.0.0.1:8000`).

The original single-file static version is preserved as [`index.legacy.html`](index.legacy.html) and can still be run via `npm run legacy:server`.

The site checks `GET /api/v1/flood/health` and `GET /api/v1/flood/stations` through its same-origin server. The Flood Lab can also list and run the backend's synthetic scenario suite in an explicitly enabled local-only mode. That run path uses the backend operator key on the server; it is disabled on non-loopback hosts and in production. It calls the backend's synthetic demo route, which reports the deterministic offline Jev simulator, not live Jev. An unconfigured or unavailable backend is shown as such; the website will not substitute sample data and call it live.

### Run the backend-backed Flood Lab locally

In a separate checkout of [`shouri123/SURAKSHA`](https://github.com/shouri123/SURAKSHA), use its supported Python version (currently specified in that repository's `pyproject.toml`) and install the API/model extras:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".[api,dl]"
.\.venv\Scripts\python.exe -m uvicorn suraksha.disasters.flood.api.app:app --host 127.0.0.1 --port 8000
```

Copy `.env.example` to `.env` in this website folder. For the local demo run bridge only, generate a random 32+ character secret (for example, `python -c "import secrets; print(secrets.token_urlsafe(32))"`) and set the same `SURAKSHA_OPERATOR_API_KEY` in both the backend and website local environments. Then set `SURAKSHA_DEMO_ENABLED=true` in the website `.env` and start `node server.mjs`. The demo bridge is loopback-only, checks the browser origin, and is disabled under production settings. Never reuse a real provider API key as the operator secret, and do not use this demo bridge as production authentication.

## Project plan

See [the end-to-end implementation roadmap](docs/SURAKSHA_IMPLEMENTATION_ROADMAP.md) for the complete scope, phases, data model, API integration sequence, security boundaries, and completion checklist.

## Important status

This is a research and coursework project, not an official government warning channel or emergency dispatch service. The current account, incident, alert-approval, and SOS screens are interface previews. They do not create accounts, store records, publish warnings, or contact responders. Do not enter real personal or emergency information.
