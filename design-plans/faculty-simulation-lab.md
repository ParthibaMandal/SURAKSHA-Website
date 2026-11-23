# Present a trustworthy faculty simulation lab

Written against: `b52e5385c4765af80683c5f0fc9a1f2b6820fd07`

## Evidence chain

- Surface: `/demo-lab` at `app/demo-lab/page.tsx`.
- Problem: The visible Run button only waits 300 ms and displays a toast. The result cards and review gates are calculated locally from stage and rainfall, while the hydrograph uses fixed sample arrays and is toggled by a boolean. This does not demonstrate a result returned by the connected SURAKSHA service.
- Design evidence: The page already names the task “Simulation Lab” and labels values “SIMULATED PREVIEW.” Preserve that identity and keep the simulation status visible. The user's brief calls for a faculty-facing story centered on meaningful inputs and outputs, with model architecture names hidden.
- Owner: `app/demo-lab/page.tsx`; `components/shared/HydrologicalChart.tsx` owns the current illustrative chart.
- Scope and affected surfaces: `/demo-lab`, its server-side API bridge, and the scenario run API contract. Leave other site surfaces unchanged.
- Uncertainty: The supplied Vercel page could not be fetched by the available web reader. Source inspection is the basis for this plan. The current Railway deployment's live route shape and mode still need verification. In this repository, the frontend calls `/api/v1/flood/health`, while FastAPI mounts `/api/v1/scenarios` and exposes `/health`; the simulation page currently makes no API call.

## Design decision

Turn the page into a short, presenter-led workflow: choose a basin scenario, adjust a small set of understandable conditions, run the service once, and explain its returned forecast, risk, recommendation, and review checks. Use a clear status and timestamp so the audience can tell which values came from the completed run. Keep engineering architecture out of the main view. Do not imply live observations or an AI-assisted calculation when the returned service mode is deterministic/offline or the inputs are synthetic.

## Reuse

- Reuse the existing dark SURAKSHA shell, `FadeIn`, `Button`, and `HydrologicalChart` composition where its data contract can be made truthful.
- Exemplar: `app/demo-lab/page.tsx` for the surface's existing identity; `components/shared/HydrologicalChart.tsx` for the current threshold and series visualization.
- Use the current `ScenarioRunRequest`/`ScenarioRunResponse` contract in `backend/app/schemas/scenario.py`. The response currently contains peak stage, risk index, recommended gate opening, three checks, run ID, and draft ID, but it does not contain a forecast time series or uncertainty range.

## Changes

1. `app/demo-lab/page.tsx`
   - Change: Restructure the page into a compact `Scenario setup` area and a prominent `Run result` area. Offer three presenter-friendly presets (routine conditions, heavy rainfall, rapid rise), plus a clearly labeled advanced section for basin, upstream inflow multiplier, and precipitation anomaly. Map labels and units to the backend fields; do not present the current stage/rainfall sliders as a complete forecast request when they are not sent to the service.
   - Change: On Run, call a same-origin Next.js route that proxies to `POST /api/v1/scenarios/run`. Keep the backend URL server-side in `SURAKSHA_BACKEND_URL`; this API connection does not require an operator key. Validate the run response and display actionable loading, success, and connection/error states; remove the local 300 ms “pipeline executed” simulation and the client-side threshold evaluator as the source of results.
   - Change: Lead with four returned values: forecast peak (m), flood risk (percentage, derived only from the returned 0–1 value), recommended gate opening (%), and review outcome. Under these, show the three returned checks as plain labels such as `Input checks`, `Calculation checks`, and `Safety review`, each with Passed/Needs review and its actual returned metric when useful. Include completed time, run ID, and draft ID in a compact provenance row.
   - Change: Replace the static hydrograph with a peak-versus-threshold visual only when the selected scenario's threshold has been verified and is present in the service response/catalog. Do not draw a time-series curve, confidence band, or observed gauge trace unless the API returns those values. If no verified threshold or series is available, show the peak as a clear numeric result and explain that a time-series view is not available for this run.
   - Change: Keep a visible `Synthetic scenario` / `Illustrative inputs` label when presets are used. Show `Decision support mode` from the API response; only say a live supervisor or AI service participated when the API confirms that mode. Remove “VERIFIED” when it is merely static UI text.
   - Preserve: The Simulation Lab name, CWC/source attribution when verified, user-controlled scenario selection, dark visual identity, and explicit distinction between a simulation and an operational warning.
   - Verify: Each preset produces exactly one backend run; displayed outputs match the response; refresh or API failure never silently replaces the result with fabricated success; and demo-generated alert drafts are labeled as drafts awaiting human review.

2. `app/api/flood/scenarios/route.ts` (new server-side bridge; or an existing server route if the implementation finds one)
   - Change: Proxy only the scenario catalog and run endpoints needed by `/demo-lab`; accept the supported request fields, enforce numeric limits matching the Pydantic schema, apply a timeout, and return sanitized upstream errors. Read the Railway origin from `SURAKSHA_BACKEND_URL`; do not require or forward a second API key.
   - Verify: Requests reach the configured backend origin, invalid values receive a clear client error, and an unavailable backend is shown as unavailable rather than returning mock results.

3. `backend/app/routes/scenarios.py` and Railway environment configuration
   - Change: Use the existing public scenario endpoint without adding an operator-key requirement. Confirm the Railway deployment exposes `/api/v1/scenarios` and `/api/v1/scenarios/run`; configure the website's `SURAKSHA_BACKEND_URL` to that service origin.
   - Note: The current `/api/v1/scenarios/run` handler writes an `AnalysisRun` and a pending `AlertDraft` on every call. If the lab is opened to general public traffic, decide whether to rate-limit it or provide a non-persisting preview endpoint.
   - Change: Reconcile scenario thresholds with the station/source of truth before displaying a danger comparison. Current page benchmarks say Gandhi Ghat warning/danger at 47.60/48.60 m; seeded station and scenario catalog values differ. Never silently combine these values.
   - Verify: A successful demo run records the actual mode, creates one reviewable draft, and exposes the corresponding IDs.

## Scope

- Inherit: Only the `/demo-lab` visitor flow and its same-origin server-side scenario bridge.
- Verify: The backend run creates persistent records and a pending alert draft; the correct Railway service and environment variables are deployed; basin labels, units, and thresholds match the data owner.
- Exclude: LSTM/BiLSTM/model architecture names in the presentation UI, unverified live-data claims, fabricated forecast curves or confidence intervals, actual gate actuation, public CAP dispatch, and redesign of the admin console.

## Validation

- Product: Run each presenter preset and confirm the faculty can answer: what conditions were supplied, what peak/risk was returned, what recommendation followed, and which checks passed or need review.
- Interface: Review ready, running, complete, invalid-input, backend-unavailable, and non-live/deterministic states at desktop presentation size and a narrow mobile viewport. Check that the result and simulation disclaimer remain visible without scrolling through implementation details.
- System: Confirm scenario requests use the same-origin server bridge; secrets never enter browser bundles; no client-side fallback renders a false successful run; no chart claims unsupported by the response appear.
- Repository: Run the existing project type/build checks after implementation; no commands run as part of this plan.

## Stop conditions

- Stop before presenting live/AI-backed results if Railway's deployed API does not implement the scenario endpoints or reports deterministic/offline mode.
- Stop before threshold visualization until a data owner confirms the Gandhi Ghat station, datum, and warning/danger values and the scenario catalog matches them.
- Before broad public promotion, decide whether persistent run/draft creation needs a rate limit or a non-persisting demo endpoint.
- Stop before showing any timeline or uncertainty band until the API supplies a real forecast series and its interpretation.

## Design documentation

- After acceptance and validation: Record the chosen faculty-demo result hierarchy and the rule for labeling synthetic inputs in the surface-local design documentation if one exists; no documentation owner was established during this source-only review.
