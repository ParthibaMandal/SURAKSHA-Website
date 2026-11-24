# SURAKSHA Website Delivery Roadmap

This roadmap tracks verified website and service integration work. Older documents claimed complete MySQL schemas, JWT identity, gate actuation, and alert lifecycle features that are not present in the deployed architecture; those claims have been removed.

## Completed in this repository

- Supabase Auth-backed sessions and role checks sourced from `profiles.role`.
- Removed demo credentials, implicit demo provisioning, and role selection during registration.
- Citizen SOS submission routed through a server handler with validation and session-owned citizen IDs; operations queue reads are role-gated.
- Removed fake SOS lifecycle controls and false local alert progression.
- Replaced misleading healthy/station fallbacks with explicit unavailable or reference states.
- API explorer aligned to actual FastAPI routes and operator-key/demo-mode constraints.
- Updated README and architecture/API/database docs to describe actual services and feature boundaries.

## Remaining phases

### 1. Database authorization (highest security priority)

- Tighten production RLS for SOS, profiles, stations, alerts, gates, and observations.
- Prevent self-service role changes; establish an admin-only role assignment path.
- Harden trigger functions and grants, add missing FK indexes, and establish migration history.
- Exercise direct Supabase access as anon, citizen, operator, and admin after migration.

### 2. Service integration contracts

- Decide and implement an authenticated website-to-engine pattern for operator-key-protected writes; keep secrets server-only.
- Define durable contracts for gate telemetry/control, alert persistence and approval, and SOS triage/lifecycle before enabling those controls.
- Ensure demo workflows stay disabled on production engine deployments and make this limitation clear in the UI.

### 3. UI completion and usability

- Audit every route, tab, button, theme, responsive state, and keyboard path against implemented contracts.
- Keep every action functional or explicitly unavailable with a useful explanation.
- Verify empty, loading, error, and permission-denied states using representative service responses.

### 4. Verification and release

- Run unit tests and production build; add/maintain focused coverage for auth, role boundaries, API validation, and unavailable states.
- Manually exercise high-priority flows in light/dark themes and desktop/mobile layouts.
- Review the deployment preview and runtime logs; confirm configuration before production promotion.

## Release guardrails

- No fabricated operational data or success messages.
- No direct gate actuation without an independently verified and authorized actuator integration.
- No public exposure of SOS contact/location data.
- No production RLS changes without reviewed migrations and role-based verification.
