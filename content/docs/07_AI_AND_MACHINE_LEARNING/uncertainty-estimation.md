# Uncertainty Estimation in SURAKSHA Flood Forecasting

<!-- Status: VERIFIED — derived from /src/suraksha/disasters/flood/contracts/flood_state.py and model code -->

| Field | Value |
|-------|-------|
| **Category** | 07 — AI & Machine Learning |
| **Status** | VERIFIED |
| **Last Updated** | 2026-11-21 |
| **Source files** | `/src/suraksha/disasters/flood/contracts/flood_state.py`, `/src/suraksha/disasters/flood/models/forecasting/` |

---

## 1. Overview

Hydrological stage forecasting is **inherently uncertain**. River stage predictions at 24-hour horizons carry compounding uncertainties from:

- **Input uncertainty**: Measurement error in gauge readings, interpolated or missing telemetry
- **Parameter uncertainty**: Model coefficients estimated from limited training data
- **Structural uncertainty**: The model's mathematical form does not perfectly represent real hydrodynamics
- **Initial condition uncertainty**: The true current state of the entire catchment is never fully observed
- **Forcing uncertainty**: Future precipitation is itself uncertain

SURAKSHA quantifies this uncertainty through two complementary mechanisms:
1. **P10/P50/P90 quantile forecasting** via the Patna Corridor Pipeline's probabilistic pool
2. **Committee ensemble spread** via the Mid-Run Gate's Forecast Committee

> [!CAUTION]
> The quantile intervals reported by SURAKSHA are **model-estimated uncertainties**, not statistically calibrated prediction bands unless explicitly verified against held-out observations. They reflect the spread of model outputs and historical residual variance — not guaranteed coverage probabilities verified against an independent validation set.

---

## 2. P10/P50/P90 Quantile Forecasting

### 2.1 Definition

SURAKSHA reports three quantile predictions for each forecast horizon:

| Quantile | Symbol | Interpretation |
|----------|--------|---------------|
| **P10** | 10th percentile | Optimistic (low-end) scenario; 10% probability the true value falls below this |
| **P50** | Median / Expected | Central expected scenario |
| **P90** | 90th percentile | Pessimistic (high-end) scenario; 10% probability the true value exceeds this |

The P10–P90 interval represents a **model-estimated 80% credible interval** for the forecast horizon.

> [!NOTE]
> In civil defense contexts, operational decisions are typically made against the **P90 scenario** (worst credible case) to maintain a safety margin. The Patna Corridor Pipeline explicitly supports `adopted_scenario = "EXPECTED_P50"` or `"WORST_P90"` as inputs to cascade consequence evaluation.

### 2.2 Mathematical Basis: SARIMA Prediction Intervals

For statistical models (ARIMA, SARIMA), prediction intervals derive from the **Gaussian residual variance** of the fitted SARIMAX model.

For a 1-step-ahead SARIMA forecast, the prediction interval is:

$$\hat{y}_{T+h} \pm z_{\alpha/2} \cdot \sigma_h$$

Where:
- $\hat{y}_{T+h}$ is the point forecast at horizon h
- $\sigma_h^2 = \sigma^2 \sum_{j=0}^{h-1} \psi_j^2$ is the h-step forecast error variance
- $\psi_j$ are the MA∞ coefficients of the model
- $\sigma^2$ is the residual variance estimated from the training fit
- $z_{\alpha/2}$ is the standard normal quantile (1.96 for 95% interval)

For a **95% confidence interval**:
$$\text{CI}_{95\%} = [\hat{y}_{T+h} - 1.96\sigma_h,\ \hat{y}_{T+h} + 1.96\sigma_h]$$

**Interpretation in hydrological context**: A 95% SARIMA prediction interval means that, *under the assumption that the model is correctly specified and that future residuals follow the same Gaussian distribution as training residuals*, the true stage height will fall within the interval with 95% probability. If the model is misspecified (e.g., during unprecedented surges), the true coverage probability may differ substantially from 95%.

> [!IMPORTANT]
> SURAKSHA's confidence interval stored in `ForecastMultiHorizonState.confidence_interval` is a simplified ±-bound: `[t24 - 0.25, t24 + 0.35]`. This asymmetric interval reflects the empirical observation that flood stage overshoots (upside) are operationally more consequential than undershoots (downside). It is **not** a formally derived prediction interval — it is an operational heuristic. Full SARIMA prediction intervals are only available through direct statsmodels output.

### 2.3 Mathematical Basis: Deep Learning Ensemble Spread

For deep learning candidates (GRU, Causal LSTM, Hybrid BiLSTM), there is no closed-form predictive distribution. Instead, uncertainty is estimated through **ensemble-based spread** when the Forecast Committee is active.

**Committee construction** (RAPID_RISE regime):
```
Committee = {SARIMA, GRU, Causal LSTM}
predictions_24h = {model_name: ŷ_24h for model in Committee}
spread_m = max(predictions_24h.values()) - min(predictions_24h.values())
```

**Quantile approximation from committee spread**:

$$\hat{P}_{50} = \text{mean}(\hat{y}_{SARIMA},\ \hat{y}_{GRU},\ \hat{y}_{LSTM})$$

$$\hat{P}_{10} = \hat{P}_{50} - k_{10} \cdot \text{spread\_m}$$

$$\hat{P}_{90} = \hat{P}_{50} + k_{90} \cdot \text{spread\_m}$$

Where $k_{10}$ and $k_{90}$ are empirically calibrated scaling factors (default: $k_{10} = 0.3$, $k_{90} = 0.7$). These derive from the skewed nature of flood stage distributions — the upper tail (flooding) is typically broader than the lower tail.

> [!WARNING]
> Ensemble spread is not equivalent to Bayesian posterior uncertainty. It reflects **inter-model disagreement**, which may be small even when all models are systematically wrong (e.g., during unprecedented events). The spread can be uninformative if all committee members share the same systematic bias.

---

## 3. The 95% Confidence Interval in Hydrological Context

A stated **95% confidence interval** for a river stage forecast carries several implicit assumptions that practitioners must understand:

### 3.1 What it means (correctly)
Under the assumption that:
- The underlying process is stationary (or stationarily seasonal) during the forecast window
- Residuals are approximately Gaussian and i.i.d.
- The model structure is correctly specified

...the interval is expected to contain the true stage observation 95 times in 100.

### 3.2 What it does NOT mean
- It does **not** mean the forecast will be correct within the interval during unprecedented rainfall events
- It does **not** account for model structural errors (e.g., SARIMA cannot capture backwater effects, embankment failures, or tributary flash floods)
- It does **not** constitute a probabilistic guarantee in the statistical sense unless verified against an independent validation set

### 3.3 Calibration Status

> [!CAUTION]
> As of November 2026, SURAKSHA's prediction intervals have **not been formally calibrated** against an independent held-out observation set from live CWC gauge data. The intervals are derived from ERA5-Land reanalysis residuals and committee spread. Users must not interpret these intervals as statistically guaranteed coverage bands until an independent calibration study is conducted.

**Recommended calibration protocol** (future work):
1. Collect ≥2 monsoon seasons of live CWC gauge data
2. Run SURAKSHA in hindcast mode (pseudo-real-time replay)
3. Compute empirical coverage probability: $P(\hat{y}_{P10} \le y_{obs} \le \hat{y}_{P90})$
4. Adjust scale factors $k_{10}$, $k_{90}$ until empirical coverage ≈ 80%

---

## 4. WMO Verification Metrics Commitment

SURAKSHA commits to reporting the following WMO-standard verification metrics for all operational forecasts:

### 4.1 Deterministic Skill Metrics

| Metric | Formula | Unit | Threshold (Good) |
|--------|---------|------|-----------------|
| **MAE** | $\frac{1}{N}\sum \|y_i - \hat{y}_i\|$ | m | < 0.30 m |
| **RMSE** | $\sqrt{\frac{1}{N}\sum (y_i - \hat{y}_i)^2}$ | m | < 0.45 m |
| **NSE** | $1 - \frac{\sum(y_i-\hat{y}_i)^2}{\sum(y_i-\bar{y})^2}$ | dimensionless | > 0.75 |
| **Volumetric Bias** | $\frac{\sum \hat{y}_i - \sum y_i}{\sum y_i} \times 100\%$ | % | ± 5% |

### 4.2 Probabilistic/Operational Metrics

| Metric | Definition | Unit | Threshold (Good) |
|--------|-----------|------|-----------------|
| **False Alarm Ratio (FAR)** | $\frac{\text{False alarms}}{\text{Total alarms issued}}$ | % | < 20% |
| **Lead-Time Gain** | Hours of advance warning above persistence baseline | hours | > 4h |

#### False Alarm Ratio

$$\text{FAR} = \frac{FP}{TP + FP}$$

Where:
- TP = True Positives (alerts correctly issued when stage exceeded danger mark)
- FP = False Positives (alerts issued when stage did not exceed danger mark)

Operationally, an alert is issued when the predicted 24-hour stage ≥ danger level (50.0 m MSL at Patna).

#### Lead-Time Gain

$$\text{LTG} = t_{\text{SURAKSHA alert}} - t_{\text{persistence alert}}$$

Positive LTG means SURAKSHA issued the alert earlier than the naive persistence baseline, giving civil defense authorities more time to act.

---

## 5. Uncertainty Propagation Through the Pipeline

Forecast uncertainty is not an isolated model output — it propagates through all downstream agents:

```
ForecastAgent
  ├─ ForecastMultiHorizonState.confidence_interval = [P10, P90]
  ├─ input_confidence = "LOW" | "MODERATE" | "HIGH"
  │
  ▼
RiskAgent
  ├─ risk_score = GradientBoosting(stage, rain, soil, discharge)
  ├─ severity = {NORMAL, LOW, MEDIUM, HIGH, EXTREME}
  │   (derived from risk_score with thresholds)
  │
  ▼
ImpactAgent
  ├─ affected_area_km2 = HAND_depth_map(ŷ_t24)
  ├─ affected_population = spatial_join(flood_polygon, population_grid)
  │   NOTE: Impact inherits full forecast uncertainty
  │
  ▼
VerificationAgent
  ├─ corroboration_probability = Jev.verify_against_search_evidence(...)
  └─ satellite_extent vs forecast_stage cross-check
```

> [!NOTE]
> The impact area is computed from the **P50 expected** forecast stage by default. Under RAPID_RISE regime with active committee, the system can optionally compute impact under P90 (worst case) to bound civil defense exposure estimates. See `/src/suraksha/disasters/flood/contracts/patna_contracts.py` for `ProbabilisticPrediction` schema.

---

## 6. Confidence Discounting

The pipeline applies explicit **confidence discounts** (Δ_C penalties) that reduce downstream trust:

| Trigger | Δ_C Applied | Location |
|---------|------------|----------|
| `CONDITIONALLY_SUPPORTED` claim | −0.10 | `MidRunGateVerdict.confidence_penalty` |
| `UNSUPPORTED` claim | Pipeline halt or retry | `SupervisorAction.HOLD_AND_RETRY` |
| `CONFLICTING` claims | Committee re-adjudication | `SupervisorAction.RUN_CHALLENGER_MODEL` |
| `INSUFFICIENT_EVIDENCE` | Human escalation | `SupervisorAction.ESCALATE_TO_HUMAN` |
| Synthetic lookback inputs | Degraded to `"LOW"` confidence | `forecast_input_confidence_discount` |
| Missing ratio > 30% | `MISSING_DATA` regime → FALLBACK | `PreRunGateVerdict.regime` |

The cumulative confidence discount is tracked in `PostRunGateVerdict.total_confidence_discount`.

---

## 7. Summary of Uncertainty Products

| Product | Method | When Available | Limitations |
|---------|--------|----------------|-------------|
| `confidence_interval` | ±-bound heuristic | Always | Not statistically calibrated |
| `spread_m` | Committee spread | RAPID_RISE/EXTREME regime | Reflects inter-model disagreement only |
| `P10/P50/P90` | Patna Corridor Pool | Full Patna digital twin run | Based on historical residuals |
| `forecast_confidence` | Degradation signal | Always | Categorical only: LOW/MODERATE/HIGH |
| NSE on benchmark data | Retrospective only | After benchmark run | Reanalysis-derived, not live-verified |
