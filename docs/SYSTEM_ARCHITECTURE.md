# SURAKSHA System Architecture

## Deployed components

```text
Browser
  └─ Next.js 14 website (Vercel)
       ├─ Supabase Auth + Postgres (session-aware server and browser clients)
       └─ server-side HTTP proxy ──> SURAKSHA FastAPI engine (Railway)
```

The website and engine are separate projects. The website owns the user-facing pages, Supabase session handling, role-gated workspaces, API routes, and presentation. The FastAPI service owns the flood engine contracts. It does not provide the legacy MySQL/SQLite, JWT, or gate-control system described in older specifications.

## Website identity and authorization

Supabase Auth manages sign-in and sessions. Application roles are loaded from `profiles.role`. Server layouts and relevant API handlers check the authenticated user and role before returning protected content or data. Never derive roles from email addresses or editable auth metadata. Supabase Row Level Security is an additional data boundary; application checks do not replace it.

Citizen SOS creation is submitted to the Next.js `/api/flood/sos` route. The server requires an authenticated citizen profile, validates input, and sets `citizen_id` from the authenticated user. The operations queue requires an authenticated `admin` or `operator` profile. This currently provides submission and queue reads, not dispatch or resolution lifecycle integration.

## Engine integration

`SURAKSHA_BACKEND_URL` configures the engine origin. Server-side routes call its `/api/v1/flood/...` endpoints with timeouts, no-store caching, and JSON response checks. An unreachable or misconfigured engine is returned as unavailable; it is not a healthy-state signal.

The engine has an operator-key guard for state-changing API methods when configured. Production requires a sufficiently long operator key (32+ characters). The website server proxy forwards this credential when configured server-side (`SURAKSHA_OPERATOR_API_KEY`), ensuring secrets never reach browser clients. Synthetic demo routes are explicitly unavailable when the engine runs in production mode.

Verified route details and the subset proxied by the site are documented in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Data ownership

Supabase Postgres stores website profiles, stations, observations, alerts, gates, and citizen SOS reports. The separate engine's own persistence and deployment configuration must be assessed in its repository; do not assume it shares the website database. The UI should distinguish persisted database data, engine responses, and illustrative/sample content.

## Reliability and safety boundaries

- Service errors must remain visible as unavailable/error states; never substitute a fabricated healthy signal or operational measurement.
- Demo scenarios and illustrative charts must be labeled as synthetic/reference content.
- No verified gate telemetry or actuator endpoint is available. Gate controls must not claim actuation.
- No verified persisted alert feed or approval lifecycle is integrated. CAP recommendation generation does not itself publish an alert.
- SOS queue read access is role-gated, but the production RLS policies still need remediation and independent validation.
- Any production schema or RLS change must be delivered as reviewed, versioned migrations and validated against the deployed project before release.
