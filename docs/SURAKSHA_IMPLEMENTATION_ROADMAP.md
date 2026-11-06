# SURAKSHA End-to-End Implementation Roadmap

## Project goal

Complete SURAKSHA as a coherent flood-intelligence minor project: a public information website, a citizen-facing web application, an operator/admin console, and a Flood Lab that demonstrates the existing scientific pipeline. The site must distinguish working features, synthetic demonstrations, and planned integrations. It is a research/coursework system, not an official emergency service.

## System boundary

```text
Browser
  └─ SURAKSHA Website (HTML interface now; evolve to modular React/Next.js if needed)
       └─ Same-origin server/BFF (website session, validation, rate limits, audit)
            └─ SURAKSHA FastAPI backend (flood pipeline, models, gates, stations)
                 ├─ TypeSafe Jev (server-side credential; optional live supervisor)
                 ├─ PostgreSQL + PostGIS (accounts and durable operations records)
                 ├─ Redis / worker (optional later: queues, cache, event delivery)
                 └─ verified observation providers (only after source and datum checks)
```

The GitHub `SURAKSHA` backend contains the scientific flood subsystem and a FastAPI API. The separate `SURAKSHA-Website` GitHub repository was empty when implementation began. The local website checkout contains the flood prototype and design assets, alongside unrelated generated FigCraft files and previously incorrect cybersecurity README/design-system text. Keep the flood project as the product scope and reconcile the repository before publishing changes.

## Delivery phases and order

### Phase 0 — Project baseline and honest demo (started)

- [x] Preserve the supplied responsive flood website prototype and page concepts.
- [x] Replace the website README's unrelated cybersecurity description.
- [x] Add a no-dependency Node server with a read-only same-origin bridge for backend health and station metadata.
- [x] Add a localhost-only, opt-in Flood Lab bridge for the backend's synthetic scenario catalog and supervised/static demo runs; operator credential stays server-side.
- [x] Document the whole-project scope and phased sequence in this file.
- [x] Connect operations health and station catalogue views to the bridge; label health separately from readiness and catalog metadata separately from feed freshness.
- [x] Connect Flood Lab scenario selection and run output to the backend demo API; show synthetic provenance and offline Jev mode.
- [x] Preview public homepage, Flood Lab, and Stations page in a local desktop browser; verified the backend-unconfigured state is explicit.
- [ ] Preview mobile breakpoints and exercise API-backed flows with a configured backend.
- [ ] Reconcile the local root with the GitHub website repository.
- [x] Inspect generated FigCraft renders: they show an unrelated cybersecurity concept and are explicitly excluded as flood-site design references; retained without deletion pending repository cleanup.

**Exit criteria:** the website starts locally, reports backend unavailable accurately when unconfigured, and displays backend health/catalog data when configured. Simulation pages remain explicitly synthetic.

### Phase 1 — API and scientific demonstration

- [ ] Run the FastAPI backend locally with its supported Python version and optional dependencies.
- [x] Wire the website to the backend synthetic scenario catalog/run contract through an opt-in local bridge.
- [x] Map returned synthetic run, forecast, risk, gate, and human-review fields into the Flood Lab and retain the full response for inspection.
- [ ] Confirm `/api/v1/flood/health`, `/api/v1/flood/stations`, and known station detail responses.
- [ ] Exercise named synthetic scenarios through the backend's demo scenario endpoints, not hand-authored frontend output.
- [ ] Record run ID, scenario ID, input provenance, execution mode, Jev mode, model execution/fallback status, Pre/Mid/Post gate results, forecast horizon/units, risk/impact evidence, and human-review outcome.
- [ ] Make failure, timeout, degraded provider, missing satellite evidence, and untrained-model states visible.
- [ ] Keep production/backend writes protected. The only current POST bridge is an opt-in synthetic demo run, limited to a loopback-bound local server with the operator key held server-side; do not expose pipeline, CAP approval, SOS intake, or review-decision routes to public browsers before identity, roles, CSRF protection, and audit exist.
- [ ] Confirm any benchmark claims against archived data and reproducible scripts before presenting them as project results.

**Exit criteria:** a reviewer can pick a scenario, execute the real backend workflow, inspect evidence and model provenance, and tell live Jev from the deterministic offline simulator.

### Phase 2 — Public website and information architecture

- [ ] Home: purpose, study region, what SURAKSHA does, data freshness, clear research-prototype status.
- [ ] About, Platform, How It Works, Study Area, Research/Validation, Methodology, Alerts & Safety, Contact.
- [ ] Public Alerts: published/approved alerts only; empty, stale, and unavailable states; source, issue time, expiry, geography, certainty, and instructions.
- [ ] Public Stations: verified catalog metadata and data-source descriptions; do not imply catalog presence means a live feed is connected.
- [ ] Accessibility: semantic headings, keyboard navigation, visible focus, reduced motion, labels, contrast, and mobile layouts.
- [ ] Content review: no invented certifications, uptime, current readings, official affiliation, or unsupported accuracy numbers.

**Exit criteria:** visitors can understand the project, evidence limits, public alert status, and safe next steps without seeing demo values represented as live information.

### Phase 3 — Identity and secure application foundation

- [ ] Select and document account ownership, privacy rules, deployment target, and email provider.
- [ ] Add server-side registration, login, logout, email verification, password reset, and session revocation.
- [ ] Store password hashes using a current password-hashing scheme; use `HttpOnly`, `Secure`, `SameSite` session cookies and CSRF protections.
- [ ] Add roles: Citizen, Operator, Incident Commander, Super Admin. Default to least privilege; admin invitation/MFA required.
- [ ] Enforce authorization in backend/server handlers, not only by hiding UI links.
- [ ] Store secrets only in deployment secret storage. The Jev API key and service-to-service credential must never enter browser code, HTML, local storage, or public build variables.

**Exit criteria:** accounts and roles are persisted, protected actions reject unauthenticated/unauthorized requests, and session/security behavior is documented.

### Phase 4 — Database, incidents, alerts, and audit

Start with PostgreSQL. Add PostGIS for spatial queries and geometries. Use migrations and explicit retention policy.

| Entity | Essential fields / relationship |
|---|---|
| `users` | id, name, normalized email, password hash, verification, status, created/updated timestamps |
| `roles`, `user_roles` | role definitions and assignments; scope assignments by district/incident where applicable |
| `sessions` | hashed session token, user, expiry, revocation metadata |
| `saved_locations` | user, label, coordinates or geometry, district, consent and timestamps |
| `stations` | backend station identifier, name, basin, coordinates, units/datum, source metadata |
| `observations` | station/source, measured value/unit, observed/received timestamps, quality flags, provenance |
| `analysis_runs` | scenario/incident, input snapshot, mode, model versions/executions, gate outputs, Jev mode, status, timestamps |
| `incidents` | reference, area, phase, owner, status, linked runs and timeline |
| `alert_drafts`, `alerts` | CAP content, evidence/run, approver, approval rationale, issue/expiry, geometry, publication status |
| `alert_deliveries` | alert, channel/provider, recipient scope, delivery receipt/status, retry metadata |
| `sos_requests` | encrypted/minimized personal data, location, triage result, assigned team, status, retention deadline |
| `audit_events` | actor, action, resource, result, timestamp, request ID; append-only access policy |
| `notifications` | user, related alert/incident, channel, delivery/read state |

- [ ] Add migrations, indexes, data retention and deletion rules, backup/restore procedure.
- [ ] Use transactions for approvals and state transitions; preserve immutable run/evidence snapshots.
- [ ] Store sensitive SOS contact/location details with strict role checks and short retention.
- [ ] Do not duplicate model artifacts or scientific state in the website database unless the backend contract requires it.

**Exit criteria:** citizen and operator records survive restart, have traceable ownership, and sensitive actions create audit events.

### Phase 5 — Citizen application

- [ ] Account/profile and secure session.
- [ ] Citizen dashboard with selected location and verified local alerts.
- [ ] Saved locations and alert subscriptions.
- [ ] Alert detail with issue/expiry time, affected boundary, source/evidence summary, and clear protective guidance.
- [ ] Safety Centre content available without login and usable on mobile/low bandwidth.
- [ ] Notification preferences and delivery history.
- [ ] SOS form only after secure server intake, privacy notice, triage contract, role-limited operator workflow, and verified escalation process exist. State clearly that it is not a replacement for local emergency services.

**Exit criteria:** a citizen can manage locations and preferences, receive authorized published alerts, and inspect alert history; no frontend-only mock claims successful delivery.

### Phase 6 — Operator/admin application

- [ ] Overview: backend readiness, feed freshness, incidents, recent analysis runs, and pending reviews.
- [ ] Incident register, assignment and event-phase timeline.
- [ ] Stations and source status with unit/datum and last successful observation.
- [ ] Pre-Run, Mid-Run, Post-Run evidence and decision views linked to actual run IDs.
- [ ] Forecast and risk pages with model provenance, units, horizons, uncertainty, fallback labels, and evidence limitations.
- [ ] Alert draft review and human approval/reject/defer with mandatory rationale and role checks.
- [ ] SOS triage queue only for authorized responders; assignment and status history.
- [ ] SITREP generation from a specified incident/run; preview, revision and export.
- [ ] User/role management, audit search, system settings and integration status.

**Exit criteria:** operators can trace an incident from source data through analysis to a human-approved communication, with audit history for each privileged action.

### Phase 7 — Notifications, live updates, and operational integrations

- [ ] Add one delivery channel at a time (email first, then approved SMS/push provider).
- [ ] Queue delivery with retries, idempotency, provider receipts, rate limits and opt-in preferences.
- [ ] Publish only approved, unexpired alerts; withdrawal/correction must be supported.
- [ ] Use Server-Sent Events or WebSockets for authenticated operations updates only after authorization and reconnect semantics exist.
- [ ] Keep background polling and ingestion in backend workers, not browser timers.
- [ ] Add provider health/freshness probes and alert operators when feeds are stale.

**Exit criteria:** delivery status is observable and retry-safe; stale inputs do not silently become current warnings.

### Phase 8 — Release hardening and minor-project submission

- [ ] HTTPS, restrictive CORS, CSRF protections, input validation, rate limits, dependency review, secret rotation.
- [ ] Logs and metrics with request IDs; redact credentials and unnecessary personal information.
- [ ] Database backup/restore rehearsal, deployment rollback instructions, health/readiness checks.
- [ ] Accessibility and responsive review; manual end-to-end walkthrough of public, citizen, operator, and Flood Lab paths.
- [ ] Document setup, architecture, API contracts, database ERD, threat model, limitations, evaluation method, screenshots, and demo script.
- [ ] Prepare a clear presentation distinguishing implemented, simulated, and planned capabilities.

**Exit criteria:** another person can set up the project from documentation, reproduce the demo, inspect evidence, and understand what is not production-ready.

## API integration contract

The current backend exposes these relevant routes under `/api/v1/flood`:

| Route | Website use | Access rule |
|---|---|---|
| `GET /health` | Backend and model/provider readiness summary | Read-only; show status and blockers separately |
| `GET /stations` | Public catalog view | Read-only; catalog does not prove telemetry freshness |
| `GET /stations/{station_id}` | Station details | Read-only |
| `GET /stations/{station_id}/modelled-discharge` | Supplemental forecast view | Label provider and forecast, never as gauge observation |
| `POST /pipeline/run` | Protected operator analysis | Do not expose until authenticated, authorized server route exists |
| `GET /demo/scenarios` | Flood Lab scenario catalog | Synthetic-only; backend may disable demo in production |
| `POST /demo/scenarios/{scenario_id}/run` | Flood Lab real scenario run | Protected write; gate behind authorized research/operator session |
| `POST /demo/reviews/{event_id}/decision` | Research demo review | Protected write and audit; never equivalent to public alert approval |
| `POST /alerts/cap-recommendation` | Create draft CAP recommendation | Protected write; draft only |
| `POST /intelligence/sitrep` | Generate SITREP draft | Protected and tied to run/incident |
| `POST /intelligence/triage-sos` | Analyze a distress message | Sensitive protected route; no public exposure without secure intake and policy |
| `POST /intelligence/advisory` | Draft persona-specific advisory | Draft only; human publication approval required |

Website bridge rules: same-origin calls, strict route allowlist, short timeouts, bounded error messages, no arbitrary URL forwarding, and no backend credential in JavaScript. Only read-only health/catalog endpoints are bridged in the current increment. Backend POST actions remain unavailable from the site until identity, roles, CSRF protection, and audit are implemented.

## API key and identity rules

- TypeSafe/Jev key: backend-to-provider secret for live supervisory judgments.
- Website service credential: server-to-backend credential, if required by deployment; store in a secret manager.
- Citizen identity: individual user session, never a shared API key.
- Operator identity: individual session + role/scope checks + MFA for privileged roles.
- External developer keys: out of minor-project first release unless explicitly required; if later added, scope, hash, expiry, revoke, rate-limit and audit them.

## Suggested technology choices

- **Current frontend increment:** existing HTML/CSS/JavaScript prototype served by Node 20 built-in HTTP server; no dependency installation required.
- **Frontend evolution (only when component complexity justifies it):** Next.js/React + TypeScript, keeping the same-origin BFF and design language. Avoid a rewrite before validating backend contracts.
- **Scientific backend:** existing Python/FastAPI service and model package; preserve existing model and gate code.
- **Persistence:** PostgreSQL + PostGIS with migrations once auth/incident workflows begin.
- **Optional later infrastructure:** Redis/worker for queues and delivery; managed email/SMS/push provider; error monitoring and backups.

## Current status: first increment

Implemented in this checkout: README correction, local Node server, read-only health/station bridge, opt-in localhost-only synthetic scenario catalog/run bridge, prototype pages, and this roadmap. The public page, Flood Lab, and station views were previewed in a local browser; the backend is not configured in this workspace, so actual API responses and backend scenario execution remain unverified. Remaining Phase 0 work includes reconciling this uncommitted checkout with the GitHub website repository. The implementation does not yet include identity, persistence, citizen notifications, public alert publication, or production operator sessions. The local Flood Lab run bridge is a coursework demo aid, not a production authorization system.
