# SURAKSHA Platform Implementation Plan

**Purpose:** Translate the “Suraksha Simulation Design” conversation into an implementation sequence grounded in this website checkout.

**Repository reviewed:** `SURAKSHA-Website`, branch `codex/fix-ui-theme-routes`, commit `dd883ac`.

**Target architecture:** Keep the existing Next.js website on Vercel, the SURAKSHA Python/FastAPI engine on Railway, and Supabase as the identity and application-data platform. This plan does not authorize database, provider, deployment, or production-data changes.

## Product direction

SURAKSHA should connect four user needs: monitor river and weather conditions; understand forecasts and risk; run clearly labeled hypothetical scenarios; and support accountable human response. Glacier intelligence is an upstream analysis module that informs downstream flood analysis when validated data and model support exist.

The public site introduces the platform. Operational users work in authenticated workspaces. Scientific numbers must always carry provenance, timestamp, units, location, and status. Observed, forecast, modelled, and synthetic values must not be blended or presented as interchangeable. Model outputs support human decisions; they do not autonomously issue public warnings or operate infrastructure.

## Current website evidence

- The website is Next.js 14 / React 18 / TypeScript / Tailwind and deploys separately from the engine. `package.json` currently has Supabase SSR/JS, Three.js, Framer Motion, and GSAP; it does not include the proposed MapLibre, deck.gl, ECharts, TanStack Query, or form-validation packages.
- `/demo-lab` already loads synthetic scenario presets and posts to the same-origin `/api/flood/scenarios` route. That route fetches `/api/v1/flood/demo/scenarios` and executes `/api/v1/flood/demo/scenarios/{id}/run?mode=static`, with numeric validation and a 30-second timeout. The current page expects a specific result shape. This is a narrower existing integration than a general simulation/job API.
- `/api/flood/health`, `/stations`, `/alerts`, `/gates`, and `/sos` are website-side proxy routes. Their behavior and authentication requirements must be reviewed endpoint by endpoint before treating them as production integration.
- Supabase SSR and browser clients plus an auth context exist. The auth context previously upserted profiles and accepted role-bearing metadata; Phase 1 implementation now removes client-side role assignment and profile writes, with server workspace guards and role-gated SOS routes.
- The checked-in initial Supabase migration defines profiles, stations, observations, alerts, supervisory gates, and citizen SOS reports. Some policies in that migration are broad (including public reads and an unrestricted SOS insert). This is code evidence, not confirmation of the currently deployed Supabase schema or policies.
- `design-plans/faculty-simulation-lab.md` already documents an earlier response-contract mismatch. It refers to `POST /api/v1/scenarios/run`; the current website proxy instead targets `/api/v1/flood/demo/scenarios/...`. Resolve this against the Railway implementation before writing or changing either API.
- `README.md` describes an older MySQL/SQLite and independent JWT backend, which conflicts with the current Supabase integration and separate Railway engine. Architecture docs also have mixed generations. Update documentation only after verifying both repositories and deployed configuration.
- The website checkout does not contain the Railway engine repository. The referenced conversation reports engine capabilities and a Supabase project, but those live claims are not independently verified by this checkout. Treat endpoints, tables, auth behavior, job duration, and live PostGIS status as audit questions.

## Verified audit results and implementation status (2026-11-24)

Read-only checks confirmed the active Supabase project matches the website configuration. Its public schema has the six tables in the checked-in baseline, RLS enabled, no PostGIS extension, and no migration history recorded. The live policies still expose all SOS rows to public readers, allow public SOS inserts, permit broad authenticated writes to stations/alerts, and let users update their own full profile row (including role). The Supabase security advisor also reported an executable SECURITY DEFINER auth trigger with a mutable search path and missing indexes on three foreign keys. These are live findings; they are not fixed by editing local SQL and require a reviewed migration rollout.

The separate FastAPI repository confirms the canonical demo catalog/run paths are `/api/v1/flood/demo/scenarios` and `/api/v1/flood/demo/scenarios/{id}/run?mode=static|supervised`; the older `/api/v1/scenarios/run` reference is stale. The request uses the `input` field. Synthetic demo routes are disabled in production. Write requests under `/api/v1/flood/` require an operator API key when configured, with a 32-character minimum in production; the website proxy does not currently forward this secret. The engine stores demo review requests in process memory. Its current SOS path is `/api/v1/flood/citizen/sos`; no `/api/v1/sos/queue` route was found. The website's stale proxy/fake queue behavior must not be represented as a live engine workflow.

The website implementation batch is pushed to the GitHub branch: removed demo-password/admin auto-provisioning, metadata/email-based privilege assignment, client profile upserts, and citizen-selected signup roles; added server session/profile checks to workspace layouts; routed SOS submission through an authenticated Supabase handler; restricted SOS creation to citizens and queue reads to admin/operators; removed fake dispatch/resolve behavior and local-only alert state advancement. The service-integrity pass removed false healthy/station fallbacks, made unsupported gates and alert feeds unavailable, removed fabricated admin dashboard metrics, and labeled synthetic hydrographs. The API explorer now shows verified engine routes and operator-key/demo-mode constraints. Fourteen website regression tests cover these no-false-success behaviors, profile fail-closed handling, generated API docs, and the simulation proxy contract.

Documentation was corrected in commit `68cf38f`: README, architecture, API, database notes, and roadmap now describe the verified Next.js/Supabase/FastAPI boundaries and known gaps. `npm test` passed (10 tests) and `npm run build` passed (compile, typecheck, static generation; Google Fonts download warning only). The checked-in baseline migration was hardened locally but has not been applied to Supabase. No production database, Vercel, or Railway changes have been made.

Outstanding release blockers: audit the remaining generated architecture/security/environment docs against the current engine and website, and validate/apply the forward RLS migration against a disposable/staging database before the live policy inventory. A temporary Supabase branch was approved at `$0.01344/hour`, but branch creation was rejected because this project is not on a Pro plan; no branch was created. The migration at `supabase/migrations/20261124090000_lock_down_public_data_access.sql` remains unapplied. Also fix the separate engine's identity/operator-key integration (the demo proxy does not currently forward the configured operator key, and demo runs are disabled in engine production); implement a durable audited alert-review path before re-enabling approval controls; decide persistent job/SOS/alert audit semantics with owners; and validate the SOS UI/API under seeded staging identities.

The generated `/docs` API reference now has a website-owned override so syncs preserve the verified contract. Its station metadata was corrected to `GANGES_PATNA` with 49.5 m warning and 50.5 m danger thresholds. A regression test checks the published doc, sync override, station metadata, and removal of retired route examples.

The simulation lab now labels and submits its actual editable variables: the multiplier scales synthetic `current_condition.river_discharge_m3s`, rainfall is added to `rainfall_24h_mm`, and the unused supervision flag was removed. The proxy rejects unknown fields, non-synthetic catalogs, and scenario inputs missing either numeric source value instead of silently ignoring a slider. The UI accepts only matching static synthetic responses with `SYNTHETIC_SCENARIO` provenance and the offline simulator mode; the highest returned horizon is shown accurately and live corroboration is not claimed. A test executes the Next.js route with mocked engine responses and verifies transformed values, no catalog mutation, rejection of ignored fields, and errors for missing input. Two FastAPI synthetic-demo integration tests in the engine checkout also passed.

The prototype-era `docs/SURAKSHA_IMPLEMENTATION_ROADMAP.md` was replaced with a current summary linking back to this plan; its obsolete plain-HTML/local-bridge and separate-database assumptions no longer describe the repository. Remaining documentation verification is focused on archival scientific design/specification material, where proposed architectures must be distinguished from implemented capabilities.

The citizen profile, saved-location, and notification pages were audited for false persistence claims. The profile now reads the authenticated name/email and removes invented password/session/MFA facts; profile edits and language storage are identified as unavailable. Location rows and notifications are explicitly session-only previews, unsupported editing is disabled, and the UI no longer claims that preferences or locations were saved or delivered. A regression test guards these constraints. Durable location subscriptions, profile editing, and notification delivery still require approved schema, RLS, and service contracts.

The dead login “Forgot password?” action now opens a Supabase email-reset request page, and the existing PKCE callback exchanges the recovery code before a session-protected password update page is shown. The reset flow validates matching passwords, handles expired/invalid callback codes, uses generic email confirmation text, and rejects unsafe callback `next` destinations. Email delivery and the production redirect allowlist still require verification in the Supabase Auth dashboard; the hosted end-to-end email cycle has not been exercised.

The simulation proxy now forwards `SURAKSHA_OPERATOR_API_KEY` server-side when configured in the environment, satisfying the FastAPI operator-write middleware requirement without leaking keys to the client. Canonical TypeScript contract definitions for all FastAPI Pydantic models (stations, observations, pipeline execution, demo catalog/runs, and citizen SOS) were consolidated in `types/contracts.ts` and `lib/contracts.ts`. The operations station catalogue view was hardened: fabricated "100% reporting", "continuous stream", and "optimal health" metrics were removed, read-only configuration boundaries were labeled, and real engine station metadata is dynamically ingested with truthful offline fallbacks. Documentation synchronization now preserves deterministic newline formatting across environments.

## Target system boundaries

```text
Browser
  -> Next.js pages and same-origin server routes (Vercel)
       -> authenticate Supabase session and authorize role
       -> allowlisted, versioned FastAPI calls (Railway)
       -> Supabase data access under explicit RLS/service boundaries
            -> simulation records, audit events, approved alert drafts
FastAPI / existing SURAKSHA engine
  -> deterministic scientific computation, validation, model orchestration
  -> job lifecycle for work exceeding a normal request budget
  -> structured outputs with provenance and supervisory results
```

Keep domain calculations in the existing engine. Do not add a second backend, identity provider, or database. Do not expose service-role credentials or machine-to-machine secrets in browser code. Avoid introducing Redis/Celery until measured run duration/concurrency requires a durable worker queue; if it does, choose one explicit job architecture with persistent state rather than layering queues pre-emptively.

## Delivery phases

### Phase 0 — Establish the real integration boundary

**Work**

- Read-only audit both GitHub repositories at the deployed commits and inspect the FastAPI app/router, Pydantic schemas, scenario catalog, persistence, auth dependencies, CORS, and Railway start/deploy settings.
- Inventory Vercel and Railway environment-variable *names and purpose* without printing secret values. Confirm website `SURAKSHA_BACKEND_URL`, origin allowlists, callback URLs, and which project/environment they belong to.
- Read the live Supabase schema, RLS policies, extensions, and auth role/profile behavior read-only; compare them with checked-in migrations. Confirm whether the engine accesses Supabase directly, whether PostGIS is enabled, and which credentials it uses.
- Trace every website API route through the actual browser call, Next.js proxy, engine route, and any Supabase write. Record auth, side effects, timeout, response schema, provenance, and owner.
- Choose canonical scenario endpoints. Reconcile `/api/v1/flood/demo/scenarios...` with `/api/v1/scenarios/run` and the separate API reference docs; do not implement from an illustrative example.

**Exit:** A checked-in integration map lists canonical endpoints and actual request/response schemas; a data-flow and role matrix is agreed; no unresolved mismatch is hidden behind mock success.

### Phase 1 — Contracts, security, and data foundations

**Work**

- Make the FastAPI/Pydantic contract authoritative and version it. Publish or generate matching TypeScript types for station, observation, scenario-run request, synchronous response, asynchronous job status, forecast, uncertainty, impact, geometry, gates, and errors.
- Define identity flow: Supabase session is verified on a Next.js server boundary; role/jurisdiction is derived from trusted server-side profile/claims; Railway validates user JWTs or a documented server-to-server identity assertion and enforces route permissions. Select one secure pattern after auditing current engine support.
- Establish a least-privilege role matrix for guest, citizen, operator, hydrologist, and admin. Review all server actions/API routes for auth, ownership, role checks, CSRF where relevant, input size/range limits, rate limits, and audit logging.
- Reconcile RLS policies with the role matrix. Tighten overly broad access through reviewed migrations and add policy tests. Restrict citizen SOS read/update; validate and minimize its personal/location data. Keep alert creation, approval, and dispatch distinct.
- Define a common provenance envelope: `observed | forecast | modelled | synthetic`, provider/source, station/geometry ID, measured/generated timestamp, units/datum, freshness/quality flags, model and API version, execution mode, and validation status.
- Decide record ownership and retention for simulations, results, alert drafts, operator decisions, and audit events. Store structured metadata and small GeoJSON in Postgres where appropriate; put large raster assets in object storage and persist metadata/links. Enable PostGIS only after confirming its need and migration/backup plan.

**Exit:** Contract tests pass across FastAPI and Next.js; unauthenticated and wrong-role requests are denied; RLS tests verify each role; data provenance survives request/response/storage; schema changes are additive, reviewed, and reversible.

### Phase 2 — Complete the Simulation Lab around real engine results

**Work**

- Keep the current `/demo-lab` entry and presets as the initial vertical slice. Keep synthetic preset inputs unmistakably labeled and separate from operational observations.
- Align the UI form precisely with the canonical Pydantic request; expose only supported variables. Provide understandable presets (routine, heavy rainfall, rapid rise) plus validated advanced inputs, units, basin/station, and horizon. Do not imply inputs are used if the request omits them.
- Implement a narrow same-origin proxy for catalog/run/status/result. Validate schema and bounds on both server and engine. Forward the authenticated identity only when required; keep secrets server-side; sanitize upstream errors; apply idempotency against duplicate submissions.
- Decide sync vs async from measured engine runtime. Keep a bounded synchronous path only for predictably short runs; for longer jobs, return a job ID and persist state (`queued`, `running`, `completed`, `failed`, `cancelled`), timestamps, retry policy, and safe progress updates. Add Redis/worker infrastructure only if the measured requirement justifies it.
- Render only returned values. Begin with peak stage/risk/recommendation and the actual Pre/Mid/Post-Run checks. Add a time-series chart only after the API supplies forecast points and uncertainty; add threshold comparison only after station/datum/threshold provenance is confirmed. Never fabricate a successful result after an API error.
- Store run inputs, output, provenance, engine/model version, mode, gate results, actor, timestamps, and any alert draft reference. Decide whether public demos persist at all; otherwise isolate anonymous synthetic runs and rate-limit them.
- Add scenario comparison and run history after the single-run contract is stable. Compare only like-for-like station, horizon, datum, model version, and provenance, and disclose differences.

**Exit:** Each preset causes one run; invalid values are rejected; results match the service response; offline/unavailable states are truthful; duplicate requests do not create duplicate records; refresh/history is reliable; no operational alert is dispatched by a demo run.

### Phase 3 — Intelligence Dashboard and operational data surfaces

**Work**

- Build one operational overview from canonical observations, forecasts, risk, stations, active alerts, service health, and recent simulations. Show source, time, unit/datum, and stale/unavailable state on each measure.
- Consolidate shared station definitions and remove sample/live conflicts between public preview, dashboard, map, citizen views, and engine catalog. Never use a synthetic fixture as an observed value.
- Add historical and forecast hydrographs only from explicit series APIs, with missing-data gaps and uncertainty semantics represented honestly.
- Add source/service health and last-success status so unavailable providers degrade to clearly marked cached/sample data rather than “healthy live” status.

**Exit:** Dashboard cards and charts are traceable to APIs; stale, missing, synthetic, and live states are distinct; disabling a provider never produces a false live label.

### Phase 4 — Flood Intelligence and geospatial impact

**Work**

- Introduce a real 2D map in the flood-intelligence workspace using MapLibre GL JS if the data and licensing/source requirements are confirmed. Preserve the current schematic as an explicitly illustrative fallback, not a live GIS map.
- Define distinct map layers and legend styles for gauges/observations, modelled flood extents, satellite-observed extents, river/terrain, settlements, infrastructure, and shelters. Never imply a forecast polygon is satellite-observed.
- Implement layer visibility, legend, time selection, basin/station filtering, feature detail, spatial query boundaries, attribution, and missing-layer states.
- Compute exposure only in the authoritative backend/geospatial pipeline from versioned, documented datasets. Include dataset date, resolution, uncertainty, and method. Avoid presenting estimated population/infrastructure counts as verified census or real-time facts.
- Add deck.gl only if volume/animation needs exceed MapLibre layer performance; use ECharts only if existing chart primitives do not meet the needed interactions and accessibility. Add Turf only for justified client-side GeoJSON operations; authoritative impact calculations remain server-side.

**Exit:** Map layers have provenance and distinct observed/modelled semantics; feature queries and exposure totals match backend fixtures; attribution and no-data behavior are reviewed.

### Phase 5 — Glacier Intelligence (separate, evidence-gated module)

**Work**

- Define supported glacier catalogue/geographic scope, observation periods, imagery sources, data licenses, quality rules, and model-supported melt/runoff indicators with the scientific owner.
- Start with catalogue, source/date metadata, and historical comparison for validated imagery. Add glacier-boundary change, glacial-lake area, or melt contribution only where reproducible validated pipelines exist.
- Link upstream records to a downstream basin/station through an explainable relationship; do not turn glacier change into an unsupported near-term flood alarm.
- Keep uncertainty, cloud cover/data gaps, CRS, resolution, and measured-vs-modelled status visible. Use object storage for large raster products and PostGIS for queryable vector metadata/geometries where approved.

**Exit:** Every visible glacier product has verified source, date, method, quality, license, and uncertainty; downstream relationship is documented and not stated as causal certainty.

### Phase 6 — Alerts, response, and role-specific workspaces

**Work**

- Separate generated alert draft, human approval, and dispatch into explicit audited transitions. Require authorized role and confirmation for external dispatch. Keep CAP validation and rejected/needs-review evidence visible.
- Complete operator workflows for station review, incidents, SOS queue, SITREP, gates, and approvals with validated inputs, permission checks, pending/loading/success/error states, duplicate protection, and audit trail.
- Complete citizen alerts, saved locations, safety checklist, notifications, and SOS with privacy minimization, ownership, consent/retention policy, accessibility, and reliable feedback. Do not test against real personal/operational records.
- Align identity and route guards so guest, citizen, operator, hydrologist, and admin see valid destinations and actions. Replace demo identities with explicit demo labels and separate demo sessions from real operator sessions.

**Exit:** Role matrix is enforced server-side and by RLS; approval and dispatch cannot be bypassed; all user actions have documented persistence and failure behavior; sensitive flows pass seeded staging tests.

### Phase 7 — Observability, performance, release, and documentation

**Work**

- Add correlated request/run IDs across browser, Next.js, Railway, and Supabase without logging secrets or unnecessary personal data. Track API latency, provider freshness, job outcomes, and schema errors; define alerts and operational runbooks.
- Add frontend and backend unit/contract/integration tests, migration/RLS tests, role authorization tests, simulation golden fixtures/invariants, and end-to-end staging flows. Test timeout, provider outages, stale data, retry, duplicate request, and partial geospatial output.
- Add Sentry or another error monitor only after data scrubbing and access/retention are configured. Establish performance budgets for chart/map layers and long-running jobs.
- Update README, architecture, API, setup, security, deployment, data lineage, and roadmap docs against code at pinned commits. Remove obsolete MySQL/SQLite/JWT directions and generated docs drift. Add CI checks for contract drift and route/API inventory.
- Deploy in sequence: engine preview/staging, database migration preview/review, website preview, role-based acceptance, then a monitored production rollout with rollback plan. Do not couple an unrelated Vercel UI release to unverified engine/database changes.

**Exit:** CI green in both repositories; security, role, mobile/accessibility, and degraded-service acceptance complete; data owner signs off sources/thresholds; migrations backed up and reversible; rollout/rollback documented.

## Suggested dependency choices

| Need | Plan |
|---|---|
| Existing website foundation | Keep Next.js, TypeScript, Tailwind, Supabase SSR/JS, Framer Motion, GSAP. |
| Validation/contracts | Use FastAPI/Pydantic as source of truth; generate/validate TypeScript contracts. Add Zod/React Hook Form only where reusable client forms need them. |
| Maps | Add MapLibre GL JS for a real 2D GIS surface after data/attribution requirements are settled. |
| Large spatial rendering | Add deck.gl only if measured map data/performance requires it. |
| Scientific charts | Evaluate ECharts against current chart components first; adopt only for missing required interactions. |
| API state | Start with server route + existing React state. Add TanStack Query if cache/retry/invalidation complexity warrants it. |
| Long jobs | Start with current Railway capability; add durable queue/Redis only after measured execution/concurrency needs. |
| Raster/spatial data | Existing Supabase/Postgres first; confirm PostGIS and storage. Do not add another database or store large rasters as table blobs. |

## Cross-cutting acceptance criteria

- One canonical and versioned contract exists for every website-to-engine action, with contract tests in both repositories.
- No privileged credential is shipped to the browser; every write route has a tested identity/role decision and rate limit appropriate to its effect.
- RLS tests demonstrate correct ownership and least privilege; migrations are forward-only or include a documented rollback strategy.
- Every number/map feature is labeled by source, time, unit/datum, quality, and observed/forecast/modelled/synthetic status.
- UI states for loading, empty, stale, partial, unavailable, invalid input, and completed output are accessible and do not masquerade as success.
- Risk, threshold, warning, CAP, and evacuation language is approved by a domain owner; automated output cannot dispatch or actuate by itself.
- Desktop, mobile, keyboard, screen-reader labeling, contrast, and reduced motion are reviewed for the public, simulation, citizen, and admin surfaces.

## Decisions and blockers to close in Phase 0

1. Which Railway commit and service URL back the current Vercel deployment, and what exact `/api/v1` route set is live?
2. Does Railway already verify Supabase JWTs, use a machine key, or access Supabase directly? Which requests are persisted today?
3. What are the deployed Supabase tables, RLS policies, PostGIS status, storage buckets, and data retention rules? How do these differ from local migrations?
4. Which role owns public synthetic simulation runs, and should anonymous runs create any persistent record or alert draft?
5. Which station ID, vertical datum, thresholds, observation feeds, and glacier datasets are approved sources for production-like views?
6. What simulation latency and concurrency are expected? Use measurements to decide whether a job queue is required.
7. Who approves CAP drafts, what is the dispatch channel, and which actions are strictly human-authorized?

## Recommended starting slice

Start with **Phase 0 plus Phase 1, then complete `/demo-lab` as the first end-to-end vertical slice**. It exercises identity, request validation, engine integration, long-run handling, persistence, provenance, and result visualization without starting with a broad map redesign. Once that slice passes staging, reuse its verified station, provenance, role, and API contracts for the dashboard, GIS, response, and glacier modules.
