# SURAKSHA Flood Intelligence Website

SURAKSHA is a flood intelligence and early-warning minor project. This repository contains the public website and application interface. The scientific pipeline and FastAPI service live in the separate [`shouri123/SURAKSHA`](https://github.com/shouri123/SURAKSHA) repository.

## Current implementation

- Responsive public information site and page navigation in `index.html`.
- Citizen and operations interface previews, with demo-only actions clearly labelled.
- Synthetic Flood Lab scenarios. They demonstrate interface states and do not claim to run the scientific backend.
- A Node.js server that securely serves assets with MIME headers, path traversal guards, and proxies only read-only health and station-catalog requests to the SURAKSHA backend.
- Standard web assets including PWA `manifest.json`, vector `favicon.svg`, and search crawler `robots.txt`.

## Run locally

Requires Node.js 20 or newer. No npm packages are required.

```powershell
node server.mjs
```

To run asset and template validation tests:

```powershell
npm test
```

Open `http://localhost:3000`. To connect read-only data from a running backend, set `SURAKSHA_BACKEND_URL` to its origin, for example `http://127.0.0.1:8000`, before starting the site server:

```powershell
$env:SURAKSHA_BACKEND_URL = "http://127.0.0.1:8000"
node server.mjs
```

Or copy `.env.example` to `.env` and edit the values. The server reads `.env` locally; do not commit `.env`.

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
