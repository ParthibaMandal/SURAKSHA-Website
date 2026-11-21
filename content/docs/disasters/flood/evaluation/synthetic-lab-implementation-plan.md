# SURAKSHA Flood Lab: Implementation Plan

**Status:** implemented and demonstrated locally  
**Objective:** make the private, offline Flood Lab demonstrate real pipeline execution, explicit synthetic provenance, supervisory decisions, model/fallback identity, and repeatable scenario evaluation. This is a research/demo workflow, not the separate public website or an operational warning service.

## Gravitas planning record

```json
{
  "planning": "deep",
  "context_depth": "dependency",
  "verification_depth": "impact",
  "delegation": "none",
  "reason_codes": ["multi-file", "shared-workflow", "dirty-worktree", "safety-gates", "synthetic-provenance"]
}
```

The Gravitas CLI is not installed in this environment; this record is the equivalent explicit planning judgment. The checkout already contains uncommitted Flood Lab changes. Preserve and extend them; do not reset, stage, or replace unrelated user work.

## Reconnaissance findings

- The private dashboard is served by `GET /demo`; synthetic scenario endpoints are under `/api/v1/flood/demo/*` and are already disabled when the app is marked production.
- The catalog currently contains 13 synthetic cases. Only the active inundation case has a short snapshot list; the ordinary cases have no dense history or seven-day rainfall series.
- Forecast input assembly already accepts `FloodObservationSnapshot` records and produces a 72-row, four-feature model matrix. Forecast logs distinguish evidence-backed input from synthesized fallback input.
- `JevIntelligenceEngine` has a REST helper, but its decisions currently use only the SDK branch. The deterministic offline policy already exists.
- The demo pipeline forces Jev offline at its gates and verification agent, but `DataAgent` constructs a fresh, environment-configured Jev client itself. The satellite agent can also invoke Earth Engine when credentials are present.
- The post-run path passes `impact_assessment.affected_area_km2` to the cross-agent gate as satellite extent. That mixes a modeled exposure estimate with an observation.
- The ensemble currently fabricates deterministic numbers when a committee checkpoint is missing, but exposes only the candidate names and forecasts, not which checkpoints ran versus which candidates used heuristic substitutes.
- The dashboard renders three gate summaries and top-level results. Agent logs are present in the pipeline state but are not rendered as an execution timeline.
- Existing scenario suite records expected/actual checks, synthetic-reference error, review status, and latency. A forecast ladder CSV exists, but the scenario suite does not compare each scenario against Persistence using the same input window.

## Scope and constraints

1. Work only on the private Flood Lab and its experiment assets. Do not edit the public website or add a production route for the lab.
2. Keep the current backend process running. Do not change its port, restart it, or enable external feeds for the synthetic demonstration.
3. Synthetic inputs and simulated satellite output must be visibly labeled as synthetic; no synthetic output may be described as a live observation or official warning.
4. The known future/reference trajectory is evaluation-only. It must not be inserted into `FloodState`, observation snapshots, or forecast-model features.
5. Preserve the existing local changes and maintain backward compatibility for old `FloodObservationSnapshot` payloads.

## Implementation phases

### Phase 1 — Make the offline boundary real

- Pass the pipeline's explicitly offline Jev client into Data Agent sensor auditing.
- Give the private demo an explicit offline SAR path that cannot call Earth Engine, even if credentials happen to exist on the machine.
- Keep the existing live pathway opt-in and report its actual integration mode and fallback reason. Do not claim live Jev when a deterministic simulator produced the decision.

### Phase 2 — Give scenarios complete, traceable inputs

- Create a reproducible 72-hour synthetic hydrograph for each scenario with stage, rainfall, discharge, and soil saturation at every hour.
- Mark each generated snapshot and scenario metadata as `SYNTHETIC_SCENARIO`; give every scenario a fixed seed and a seven-day daily rainfall sequence for API3d/API7d.
- Keep each scenario's future evaluation reference outside the model input.
- Extend snapshot provenance compatibly, including labels for observed, scenario-synthetic, simulator-fallback, and unknown data.

### Phase 3 — Correct observation and release-gate semantics

- Feed the post-run consistency gate only an explicit satellite inundation observation with known provenance.
- If there is no qualifying observation, record it as unavailable; never substitute estimated exposed area or a default SAR fallback polygon as observed extent.
- Preserve human escalation and make the reason and release hold visible in the audit output.

### Phase 4 — Report what actually executed

- Record per-agent output/status from the existing `agent_logs`; do not hardcode green completion badges.
- Record per-model execution identity, checkpoint/trained status, per-horizon prediction, or the exact deterministic fallback used.
- Show input provenance, fallback use, and Jev simulator/live mode in the result and audit JSON.

### Phase 5 — Make scenario evaluation useful for a review

- Extend the repeatable scenario runner to report expected behavior versus actual behavior and check-by-check pass/fail.
- Compare each executed forecast with the scenario's synthetic reference and a Persistence forecast built from the same 72-hour feature matrix.
- Report model execution/fallback, forecast spread, latency, and limitations. Label all aggregate scores as performance on a controlled synthetic simulator, not real flood accuracy.
- Add a dashboard agent/model execution trace sourced from returned logs and supervisor decisions.

## Acceptance criteria

- An offline lab run cannot make Jev or Earth Engine network calls, regardless of local credentials.
- Every case provides a deterministic, provenance-marked 72-hour four-feature history and a separate evaluation reference.
- Post-run consistency never treats estimated impact area as observed satellite extent.
- The returned run contains actual agent logs and an explicit trained-checkpoint-versus-fallback record for every forecast candidate.
- The scenario report includes check results and a same-window Persistence comparison without passing target values into the forecaster.
- The dashboard shows those actual results and keeps synthetic/live status distinct.
- Existing public APIs and lifecycle inputs remain backward-compatible.

## Verification plan

- Python syntax compilation passed for the changed pipeline, agent, contract, supervisor, API, and benchmark modules. Dashboard JavaScript passed `node --check`; the scenario catalog parsed and all 13 cases exposed a fixed-seed 72-hour history plus seven daily rain totals.
- The repeatable benchmark completed 13/13 supervised cases with expected-behavior checks passing and all 13 static comparison runs observed, with zero execution errors. The JSON/CSV artifacts record candidate execution, fallback use, provenance, synthetic-reference error, Persistence error, review status, and latency.
- The updated dashboard was opened at `http://127.0.0.1:8001/demo`. Browser execution showed a calm case and a rapid-surge case. The surge result showed the committee route, 2.05 m spread, the fallback and trained candidates, human review escalation, and the evaluation-only reference comparison.
- The pre-existing API remained healthy on port 8000 throughout. Its process had already loaded the older source, so it continues to serve the prior version. A second API process was started on port 8001 to serve and demonstrate this implementation; no running process was stopped.
- No unit/integration test runner was invoked. Offline behavior was verified by the explicit offline client and SAR constructor paths, benchmark mode, returned offline labels, and the local browser execution. No external Jev or Earth Engine request was made.

## Implemented outcome

- Added `build_scenario_input` to generate deterministic stage, rainfall, discharge, and soil histories from the scenario seed. Scenario future references remain a separate API response field and are not copied into `FloodState`.
- Added provenance-compatible observation snapshots and propagated input provenance through model-context assembly and forecasts.
- Forced the demo data and satellite agents through explicit offline paths. The post-run gate only compares a supplied satellite extent when the snapshot has qualifying provenance; impact estimates and synthetic SAR fallback outputs are not treated as observations.
- Exposed committee candidate execution and fallback reasons, per-agent logs, and synthetic/live mode in the result payload and dashboard.
- Extended the scenario runner to use the generated hydrograph and compare outputs to the synthetic target and a Persistence forecast built from the same 72-hour observation window.
- Kept all changes within the private Flood Lab. Public site, CWC/IMD live ingestion, real glacier-to-Bihar routing, and operational warning claims remain out of scope.

## Out of scope

- Connecting CWC/NWDP, IMD, Sentinel/GEE, public alerts, or production delivery.
- Claiming real-world forecast skill from synthetic-reference scores.
- Rebuilding the public site, implementing dam/reservoir routing, or adding a new hosted Jev model.
