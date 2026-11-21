# Runbook: Google Earth Engine (GEE) Unavailable

| Field | Value |
|---|---|
| **Document ID** | RBK-14-002 |
| **Severity** | High |
| **Target Audience** | Operations Engineers, Duty Hydrologists |

---

## 1. Symptoms & Error Codes
- `EEException: USER_PROJECT_DENIED`
- `EarthEngineClient.ensure_initialized() returns False`
- `SatelliteAgent status: UNAVAILABLE_DEGRADED`

---

## 2. Automated Fallback
The `SatelliteAgent` automatically activates `OfflineFallbackSAR`:
- Loads pre-computed flood boundary polygons for Gandhi Ghat (`data/processed/sentinel1_patna_gandhi_ghat_*.json`).
- Rescales extent based on current stage elevation.
- Pipeline execution continues without crashing.

---

## 3. Remediation Steps
1. Verify Google Cloud IAM roles: Service account must possess `roles/serviceusage.serviceUsageConsumer` and Earth Engine Resource Viewer permissions.
2. Check credential file existence: `Test-Path secrets/suraksha-service-account.json`.
3. Test connectivity: Run `python scripts/test_gee_live_extraction.py`.
