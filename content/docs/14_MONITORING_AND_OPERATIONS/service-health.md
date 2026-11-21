# Service Health, Observability & SLOs

| Field | Value |
|---|---|
| **Document ID** | OPS-14-001 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |

---

## 1. Service Level Objectives (SLOs)

| Metric | Target SLO | Monitoring Method |
|---|---|---|
| **API Availability** | 99.9% Uptime during monsoon season (June–Oct) | Prometheus synthetic HTTP ping |
| **End-to-End Pipeline Latency** | $<5.0$ seconds per run | `agent_logs` execution latency tracker |
| **SAR Segmentation Turnaround**| $<30$ seconds upon Sentinel-1 pass | Cloud Logging GEE event monitor |
| **Telemetry Ingestion Freshness**| $<60$ minutes from CWC observation | Ingestion timestamp delta probe |
