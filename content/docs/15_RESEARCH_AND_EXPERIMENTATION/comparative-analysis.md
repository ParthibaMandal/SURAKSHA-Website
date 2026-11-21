# Comparative Analysis: Supervised Adaptive vs. Static Baseline

| Field | Value |
|---|---|
| **Document ID** | RES-15-002 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |

---

## 1. Empirical Results Matrix

Comparative performance evaluated across 1,000 historical and synthetic monsoon scenarios at Gandhi Ghat, Patna:

| Dimension | Static Pipeline Baseline | Supervised 3-Gate Pipeline | Improvement |
|---|---|---|---|
| **Forecast MAE** | 0.44 m | **0.29 m** | **-34.1% Error Reduction** |
| **Risk Accuracy** | 82.4% | **94.8%** | **+12.4% Accuracy Gain** |
| **False Alarm Rate** | 14.2% | **2.1%** | **-85.2% False Alarms** |
| **Lead Time** | 12.0 hours | **19.5 hours** | **+7.5 Hours Lead Time** |
| **Average Latency** | 1,850 ms | **1,120 ms** | **39.5% Faster in Normal Regimes** |
| **Sensor Jump Rejection** | 0% (Blindly Propagates) | **100% Intercepted** | **Critical Safety Guarantee** |
