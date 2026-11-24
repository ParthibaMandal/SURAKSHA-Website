# SURAKSHA Website

SURAKSHA Website is the Next.js frontend for the SURAKSHA flood intelligence project. It combines public information pages, authenticated citizen and operations workspaces, selected Supabase-backed workflows, and a proxy to the separate SURAKSHA FastAPI engine.

## Current architecture

- **Web application:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS. Hosted on Vercel.
- **Identity and application data:** Supabase Auth and Postgres. User roles are read from the `profiles` table; role access is enforced in server layouts and API handlers.
- **Flood engine:** FastAPI hosted separately (Railway). The website reaches it through server-side routes using `SURAKSHA_BACKEND_URL`.
- **Tests:** Node's built-in test runner (`npm test`).

This repository does not contain the FastAPI engine or a MySQL/SQLite application backend. The engine repository is `shouri123/SURAKSHA`. The feature boundary and verified route contracts are in [API documentation](docs/API_DOCUMENTATION.md); database observations and known gaps are in [database notes](docs/DATABASE_SCHEMA.md).

## Run locally

Requirements: Node.js compatible with the installed Next.js version and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. To run the checks:

```bash
npm test
npm run build
```

Some pages need configured services to provide live data. Without them, the UI should report unavailable service status rather than imply live operational readiness.

## Environment

Configure environment variables in the local environment or the deployment platform. Never commit secret values.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL used by browser and server clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public/anon key; database access remains subject to RLS |
| `SURAKSHA_BACKEND_URL` | Base URL of the FastAPI engine, without an API path |

The application contains legacy fallback Supabase configuration in client setup; production deployments should explicitly set the correct project URL and anon key. No service-role key is needed or should be exposed to the browser.

## Implemented workflows and limits

- Authentication uses Supabase Auth. Workspace role comes from the user's `profiles.role` record, not email naming or user metadata.
- Citizen SOS creation writes a session-owned row to `citizen_sos_reports`; queue reads are restricted to admin/operator profiles.
- The engine proxy supports health, station metadata, and demo scenario catalog/run flows. Demo routes are synthetic and the engine blocks them in production mode.
- SOS case lifecycle management, gate telemetry/actuation, and persisted alert listing/approval are not integrated. Corresponding surfaces must not represent these operations as completed.
- Displayed illustrative/sample hydrographs are not live sensor observations or forecasts.

## Further documentation

- [Implementation plan and audit findings](design-plans/suraksha-platform-implementation-plan.md)
- [System architecture](docs/SYSTEM_ARCHITECTURE.md)
- [Verified API contracts](docs/API_DOCUMENTATION.md)
- [Database notes and security gaps](docs/DATABASE_SCHEMA.md)
- [Delivery roadmap](docs/DEVELOPMENT_ROADMAP.md)
