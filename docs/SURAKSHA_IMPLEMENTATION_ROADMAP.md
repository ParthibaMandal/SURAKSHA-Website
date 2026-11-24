# SURAKSHA Implementation Roadmap

This document replaces the original prototype-era roadmap. The old version described a plain HTML site, a local Node bridge, a separate PostgreSQL/PostGIS identity store, and backend workflows that are not part of the verified application. Use the current [platform implementation plan](../design-plans/suraksha-platform-implementation-plan.md) as the detailed source of truth.

## Verified system boundary

- **Website:** Next.js on Vercel; it owns the public site, authenticated workspaces, session-aware API routes, and UI.
- **Identity and application data:** Supabase Auth and Postgres. Role authorization is checked on the server and must also be enforced by reviewed RLS policies.
- **Scientific engine:** a separate FastAPI service on Railway. Its verified synthetic scenario routes are documented in [API documentation](API_DOCUMENTATION.md).
- **Not verified as production workflows:** live gauge feeds, durable simulation jobs, gate control, alert approval/dispatch, and SOS triage lifecycle.

The public site and synthetic lab are research interfaces, not official emergency services. Synthetic output, observed data, forecasts, model estimates, and published alerts must remain clearly distinguishable.

## Completed implementation slices

- Removed implicit demo credentials and self-selected signup roles; removed client-side profile role writes.
- Added server session/profile checks to protected workspaces and role-checked SOS endpoints.
- Removed fabricated dispatch, resolve, local alert progression, and false service-health fallbacks.
- Aligned API documentation and the simulation lab with the verified FastAPI contracts and synthetic provenance.
- Added regression coverage for authorization boundaries, unavailable states, API documentation, and the simulation proxy contract.

## Remaining work, in dependency order

### 1. Security and data authorization

- Validate the forward-only RLS migration against a disposable or staging Supabase database.
- Verify anon, citizen, operator, and admin privileges, including ownership boundaries and trigger behavior.
- Establish migration history, trusted role assignment, SOS retention, and audit requirements.
- Do not apply the unvalidated migration to production. The approved temporary branch could not be created because the project does not support branching on its current plan.

### 2. Website-to-engine integration

- Decide how server-side engine writes authenticate without exposing operator credentials to browsers.
- Validate seeded staging identities through signup/session, workspace access, and SOS flows.
- Define durable simulation, SOS triage, and alert review records before exposing workflows that imply persistence.
- Keep demo scenario execution disabled where the engine is configured for production.

### 3. User experience and accessibility

- Exercise all routes, tabs, buttons, theme variants, responsive layouts, and keyboard paths against their actual behavior.
- Make unsupported actions unavailable with a clear explanation; cover loading, empty, stale, error, and permission-denied states.
- Keep the schematic flood view illustrative until a sourced and attributed geospatial data contract is approved.

### 4. Operational readiness

- Add correlated request/run identifiers, privacy-safe observability, service freshness indicators, and runbooks.
- Expand website and engine contract tests, migration/RLS tests, and seeded staging acceptance flows.
- Review the Vercel preview and both service configurations before any production rollout; document rollback steps.

## Release guardrails

- Never represent synthetic or unavailable data as live, and never claim a successful persisted action unless the authoritative service confirms it.
- Do not expose service-role or operator credentials in browser code or public build variables.
- Do not expose private SOS details publicly or enable alert dispatch/gate control without verified authorization, audit, and human approval.
- Require verified data provenance, timestamps, units/datum, uncertainty, and source attribution for operational measurements and maps.
