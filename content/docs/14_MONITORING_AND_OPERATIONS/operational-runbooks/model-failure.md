# Runbook: Forecasting Model Runtime Failure

| Field | Value |
|---|---|
| **Document ID** | RBK-14-004 |
| **Severity** | Critical |

---

## 1. Automated Model Ladder Degradation Chain
If `SARIMA` fails or produces `NaN`:
$$\text{SARIMA} \longrightarrow \text{Hybrid BiLSTM} \longrightarrow \text{ARIMA(2,1,1)} \longrightarrow \text{Persistence Baseline}$$

The pipeline never halts; it emits the best available lower-tier model and notifies the operator.
