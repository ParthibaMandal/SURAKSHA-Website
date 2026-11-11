# SURAKSHA REST API Documentation

## Base URL
* Local FastAPI Server: `http://127.0.0.1:8000/api/v1`
* Next.js BFF Proxy: `http://localhost:3000/api/flood`

All request payloads and responses use standard `application/json; charset=utf-8`.

---

## 1. Authentication & Identity (`/auth`)

### `POST /auth/register`
Create a new citizen account.
* **Payload**:
  ```json
  {
    "email": "citizen@example.com",
    "password": "SecurePassword123!",
    "full_name": "Ramesh Kumar",
    "phone_number": "+91-9876543210",
    "district": "Patna"
  }
  ```
* **Response `201 Created`**:
  ```json
  {
    "id": 1,
    "email": "citizen@example.com",
    "full_name": "Ramesh Kumar",
    "role": "citizen",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### `POST /auth/login`
Authenticate existing user and issue JWT bearer token.
* **Payload**:
  ```json
  {
    "email": "operator@suraksha.gov.in",
    "password": "OperatorSecretPassword!"
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": 2,
      "email": "operator@suraksha.gov.in",
      "full_name": "Dr. Ananya Sharma",
      "role": "operator"
    }
  }
  ```

### `GET /auth/me`
Retrieve currently authenticated user profile from bearer token.

---

## 2. Telemetry & Stations (`/stations`)

### `GET /stations`
List all river gauge telemetry stations with current readings and health metrics.
* **Query Parameters**:
  * `basin` (optional): Filter by river basin name (e.g. `Middle Ganga`).
  * `status` (optional): `ACTIVE`, `DEGRADED`, `OFFLINE`.
* **Response `200 OK`**:
  ```json
  [
    {
      "id": "STN-PAT-01",
      "name": "Digha Ghat, Patna",
      "river": "Ganga",
      "basin": "Middle Ganga",
      "latitude": 25.642,
      "longitude": 85.105,
      "warning_level_m": 50.20,
      "danger_level_m": 51.50,
      "hfl_m": 52.52,
      "current_level_m": 49.85,
      "status": "ACTIVE",
      "quality_flag": "VERIFIED",
      "last_observed_at": "2026-11-11T16:30:00Z"
    }
  ]
  ```

### `GET /stations/{id}/observations`
Retrieve historical time-series stage and discharge readings for a specific station.

---

## 3. Barrage Gate Control (`/gates`)

### `GET /gates`
List all barrage gate control points and current discharge settings.

### `POST /gates/{id}/actuate`
Modify aperture setting for a specific sluice gate bay. (Requires `ROLE_OPERATOR` or `ROLE_ADMIN`).
* **Payload**:
  ```json
  {
    "target_opening_pct": 65,
    "override_reason": "Pre-crest reservoir leveling per physical model recommendations",
    "operator_key": "OP-SEC-984"
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "gate_id": "GATE-VAL-04",
    "previous_opening_pct": 40,
    "current_opening_pct": 65,
    "estimated_discharge_cusecs": 28400.00,
    "actuated_at": "2026-11-11T17:10:00Z",
    "audit_event_id": 4821
  }
  ```

---

## 4. Flood Lab Scenarios & Physics Simulation (`/scenarios`)

### `GET /scenarios`
List available synthetic benchmark hydrographs and historical flood scenarios.

### `POST /scenarios/{id}/run`
Execute hydrodynamic 1D-2D wave progression model with Jev boundary validation.
* **Payload**:
  ```json
  {
    "upstream_inflow_multiplier": 1.25,
    "precipitation_anomaly_mm": 120.0,
    "enable_jev_supervision": true
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "run_id": "RUN-89214",
    "scenario_id": "SCEN-KOSI-BREACH",
    "status": "COMPLETED",
    "pre_gate_check": { "passed": true, "mass_balance_error_pct": 0.02 },
    "mid_gate_check": { "passed": true, "courant_number": 0.84 },
    "post_gate_check": { "passed": true, "crest_forecast_m": 51.85 },
    "jev_status": "LIVE_SUPERVISED",
    "recommended_gate_discharge_pct": 75,
    "inundation_risk_index": 0.82,
    "cap_draft_generated": true,
    "draft_id": "DFT-2026-092"
  }
  ```

---

## 5. CAP Alert Approvals & Public Feeds (`/alerts`)

### `GET /alerts/public`
Retrieve verified, published Common Alerting Protocol (CAP) flood warnings. Open to the public.

### `GET /alerts/drafts`
List pending alert drafts awaiting Incident Commander sign-off. (Requires `ROLE_OPERATOR` or `ROLE_ADMIN`).

### `POST /alerts/drafts/{id}/approve`
Sign off and publish a flood alert to the public feed and dispatch geofenced citizen alerts.
* **Payload**:
  ```json
  {
    "decision": "APPROVE",
    "commander_comments": "Verified against gauge cluster 04 readings. Embankment patrol dispatched.",
    "effective_hours": 24
  }
  ```

---

## 6. Citizen SOS Rescue Intake (`/sos`)

### `POST /sos/submit`
Citizen emergency rescue dispatch request. Accessible by authenticated users or emergency public callers.
* **Payload**:
  ```json
  {
    "citizen_name": "Sunita Devi",
    "phone_number": "+91-9876543210",
    "emergency_type": "TRAPPED_WATER",
    "severity": "CRITICAL",
    "people_count": 4,
    "latitude": 25.6214,
    "longitude": 85.1432,
    "landmark_address": "Near primary health center, Ward 12, Kurji, Patna",
    "additional_notes": "Water rising above ground floor window sill. 1 infant and 1 elderly person present."
  }
  ```
* **Response `201 Created`**:
  ```json
  {
    "sos_id": "SOS-8492",
    "status": "PENDING",
    "assigned_district": "Patna Urban",
    "dispatch_priority": "PRIORITY_1_CRITICAL",
    "submitted_at": "2026-11-11T17:12:00Z",
    "message": "Your SOS has been logged into the tactical rescue queue. Keep your phone line clear."
  }
  ```

### `GET /sos/queue`
Retrieve active rescue queue for triage and dispatch assignment. (Requires `ROLE_OPERATOR` or `ROLE_ADMIN`).

### `PATCH /sos/{id}/status`
Update rescue triage progress (`DISPATCHED`, `RESCUED`, `RESOLVED`) and assign team.

