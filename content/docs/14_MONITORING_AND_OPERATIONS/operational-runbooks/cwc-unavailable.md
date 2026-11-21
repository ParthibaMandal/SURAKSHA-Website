# Runbook: CWC NWDP Telemetry Ingestion Down

| Field | Value |
|---|---|
| **Document ID** | RBK-14-003 |
| **Severity** | High |

---

## 1. Remediation Procedure
1. Check National Water Data Portal status: `curl -I https://nwdp.nic.in/`.
2. Inspect `scripts/probe_hydro_providers.py` output.
3. Switch primary stage source to Open-Meteo GloFAS discharge-stage proxy.
4. Log warning in supervisory audit trail: `DATA_FALLBACK_ACTIVE`.
