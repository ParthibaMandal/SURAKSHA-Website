# Website and Engine API Contracts

This reference describes the contracts verified in the website and the FastAPI engine source. The website proxy base is `/api/flood`; the engine base is `/api/v1/flood`. Exact response fields may evolve with the engine's Pydantic models, so consult its OpenAPI document for the deployed version.

## Website routes

| Method and path | Behavior |
|---|---|
| `GET /api/flood/health` | Proxies engine health. Returns unavailable if the engine URL is missing, the response is not JSON, or the service cannot be reached. |
| `GET /api/flood/stations` | Proxies station metadata. Does not provide historical observations through this route. |
| `GET /api/flood/scenarios` | Proxies the synthetic demo scenario catalog. The engine may reject this in production mode. |
| `POST /api/flood/scenarios` | Validates scenario ID, starting river discharge multiplier (`0.5`–`3`), and rainfall addition (`0`–`500` mm), applies them to catalog input and requests a static demo run. Synthetic; not an operational forecast. |
| `GET /api/flood/sos` | Reads up to 200 SOS reports for signed-in `admin` or `operator` profiles. |
| `POST /api/flood/sos` | Creates an SOS report for an authenticated `citizen`. Caller cannot choose `citizen_id`; the server binds it to the session. Returns `201` with the inserted report summary. |
| `GET /api/flood/gates` | `501`: gate telemetry is not connected. |
| `GET /api/flood/alerts` | `501`: no persisted public/draft alert list is connected. |

The website demo proxy defaults its engine origin to `http://127.0.0.1:8000` in local development. Health and station handlers instead require `SURAKSHA_BACKEND_URL`; set this variable consistently in deployments.

### Synthetic scenario-run request

```json
{
  "scenario_id": "BEST_01_CALM_BASELINE",
  "river_discharge_multiplier": 1.25,
  "precipitation_anomaly_mm": 80
}
```

`river_discharge_multiplier` scales the selected catalog scenario's starting `current_condition.river_discharge_m3s`; it does not change an upstream gauge or actuator. `precipitation_anomaly_mm` is added to the scenario's starting `rainfall_24h_mm`. Both source values must be present and numeric in the selected catalog entry, or the proxy rejects that run. The engine is called in static synthetic mode.

### SOS request

```json
{
  "citizen_name": "Example Citizen",
  "contact_phone": "+91 98765 43210",
  "location_name": "Near the community centre, Patna",
  "urgency": "HIGH",
  "description": "Water is entering the ground floor."
}
```

Validation: name 2–120 chars, phone 7–15 digits (accepted punctuation is limited), location 2–300 chars, description 2–2,000 chars, urgency `LOW`, `MEDIUM`, or `HIGH`. Responses include `401` when signed out, `403` for the wrong role, `400` for invalid input, and `503` when storage fails.

## Verified engine routes

The FastAPI router under `/api/v1/flood` exposes:

- `GET /health`
- `GET /stations`
- `GET /stations/{station_id}`
- `GET /stations/{station_id}/modelled-discharge`
- `POST /pipeline/run`
- `GET /demo/scenarios`
- `POST /demo/scenarios/{scenario_id}/run`
- `GET /demo/reviews`
- `POST /demo/reviews/{event_id}/decision`
- `POST /alerts/cap-recommendation`
- `POST /intelligence/sitrep`
- `POST /intelligence/triage-sos`
- `POST /intelligence/advisory`

All POST/PUT/PATCH/DELETE engine routes require `Authorization: Bearer <SURAKSHA_OPERATOR_API_KEY>` when an operator key is configured. Production requires a key of at least 32 characters. The website does not currently forward this credential, so state-changing engine calls are not integrated through the website. Demo routes call a demo-mode guard and are blocked in engine production mode.

`PipelineRunRequest` accepts a station ID, optional water level, 24-hour rainfall, soil saturation, river discharge, and execution mode (`static` or `supervised`); unrecognized fields are rejected. The demo scenario run accepts `{ "input": { ... } }`. See the engine's OpenAPI schema for exact types, bounds, and response bodies.

## Not implemented as website APIs

There is no verified website or engine route for gate telemetry/actuation, public alert listing, persisted draft approval, SOS dispatch/resolution, registration role selection, or historical station observations. Do not treat a CAP recommendation endpoint as an alert publication workflow. These capabilities require backend contracts and authorization design before UI integration.
