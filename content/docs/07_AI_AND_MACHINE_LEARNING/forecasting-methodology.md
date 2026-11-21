# Forecasting Methodology: Champion-Challenger Model Ladder

<!-- Status: VERIFIED — content derived from /src/suraksha/disasters/flood/models/forecasting/ -->

| Field | Value |
|-------|-------|
| **Category** | 07 — AI & Machine Learning |
| **Status** | VERIFIED |
| **Last Updated** | 2026-11-21 |
| **Maintainer** | SURAKSHA Flood Subsystem Team |
| **Source files** | `/src/suraksha/disasters/flood/models/forecasting/` |

---

## 1. Motivation: Why a Ladder Architecture?

A single-model production system exhibits three critical failure modes in the hydrological domain:

1. **Distribution shift fragility**: A model trained on past monsoon seasons may perform poorly during unprecedented precipitation events outside its training distribution.
2. **Cold-start failures**: Statistical models require sufficient fitted history; neural models need loaded checkpoint weights. A single model that fails to load leaves the pipeline blind.
3. **No reference baseline**: Without a naive baseline, there is no way to determine whether a model is adding value or degrading predictions.

The **champion-challenger ladder** addresses all three failure modes:
- Every candidate is benchmarked under identical conditions.
- The highest-NSE candidate becomes the **production champion**.
- Each champion has an explicit **fallback chain** to the next-best model.
- The naive **Persistence baseline** serves as the irreducible minimum benchmark.

> [!IMPORTANT]
> The ladder benchmark is an *offline* process that selects the champion. At runtime, the production champion executes; it only degrades to its fallback if its checkpoint is unavailable or prediction raises an exception.

---

## 2. Candidate Pool

The ladder evaluates **6 candidates** in ascending order of model complexity:

| # | Model | Class | Framework | Architecture |
|---|-------|-------|-----------|-------------|
| 1 | **Persistence** | Baseline | NumPy | y(t+H) = y(t) |
| 2 | **ARIMA(2,1,1)** | Statistical | statsmodels | Autoregressive Integrated Moving Average |
| 3 | **SARIMA(1,1,1)×(1,0,1)₂₄** | Statistical | statsmodels SARIMAX | Seasonal ARIMA with 24h diurnal seasonality |
| 4 | **GRU-2layer-h32** | Deep Learning | PyTorch | Gated Recurrent Unit, 2 layers, hidden_dim=32 |
| 5 | **Causal LSTM-2layer-h32** | Deep Learning | PyTorch | Unidirectional LSTM, 2 layers, hidden_dim=32 |
| 6 | **Hybrid BiLSTM+1DCNN** | Deep Learning (Research) | PyTorch | Bidirectional LSTM + 1D Temporal CNN |

> [!NOTE]
> The hidden dimension in the production checkpoints is **32** (not 64), as found in the actual model instantiation: `HydrologicalGRUModel(input_dim=4, hidden_dim=32, num_layers=2)`. The briefing description of "h64" is a documentation approximation; the verified code uses `hidden_dim=32`.

### Source files
- Persistence: [`/src/suraksha/disasters/flood/models/forecasting/persistence.py`](/src/suraksha/disasters/flood/models/forecasting/persistence.py)
- ARIMA & SARIMA: [`/src/suraksha/disasters/flood/models/forecasting/arima_sarima.py`](/src/suraksha/disasters/flood/models/forecasting/arima_sarima.py)
- GRU: [`/src/suraksha/disasters/flood/models/forecasting/gru.py`](/src/suraksha/disasters/flood/models/forecasting/gru.py)
- Causal LSTM: [`/src/suraksha/disasters/flood/models/forecasting/causal_lstm.py`](/src/suraksha/disasters/flood/models/forecasting/causal_lstm.py)
- Hybrid BiLSTM: [`/src/suraksha/disasters/flood/models/forecasting/bilstm_hybrid.py`](/src/suraksha/disasters/flood/models/forecasting/bilstm_hybrid.py)
- Benchmark runner: [`/src/suraksha/disasters/flood/models/forecasting/benchmark_ladder.py`](/src/suraksha/disasters/flood/models/forecasting/benchmark_ladder.py)

---

## 3. Input Feature Specification

All deep learning candidates and the statistical models share the same **input lookback window**:

```
X ∈ ℝ^(72 × 4)   — 72-hour lookback window × 4 input features
```

| Index | Feature | Unit | Physical meaning |
|-------|---------|------|-----------------|
| 0 | `water_level_m` | m MSL | Observed river stage height at CWC Gandhi Ghat gauge |
| 1 | `precipitation` | mm/hr | Catchment-averaged hourly precipitation |
| 2 | `river_discharge_m3s` | m³/s | River discharge rate from upstream gauges |
| 3 | `soil_moisture_0_to_7cm` | m³/m³ | ERA5-Land surface soil moisture (0–7 cm depth) |

**Output specification:**

```
ŷ ∈ {t+6h, t+12h, t+24h}   — predicted stage height in metres MSL
```

Three separate scalar predictions are issued for the 6-hour, 12-hour, and 24-hour forecast horizons.

> [!IMPORTANT]
> The lookback window is **strictly historical** — the model only observes past data up to and including the current timestep t. No future observations or concurrent targets are included in the input tensor. This causal integrity applies equally to all candidates including the BiLSTM.

---

## 4. Model Descriptions and Mathematical Formulations

### 4.1 Candidate 1: Persistence Baseline

The simplest possible forecast: the river stage at all future horizons equals its current value.

$$\hat{y}(t+H) = y(t) \quad \forall H \in \{6, 12, 24\}$$

**Purpose**: The persistence baseline is the minimum benchmark that any model must beat. If a sophisticated model cannot outperform persistence, it provides no operational value. All ladder candidates must achieve a higher NSE than persistence.

**Fallback**: This is the terminal fallback — it always succeeds and requires no fitting.

---

### 4.2 Candidate 2: ARIMA(2,1,1)

**ARIMA** (Autoregressive Integrated Moving Average) models the differenced time series as a function of its own lagged values and lagged forecast errors.

**Model specification**: ARIMA(p=2, d=1, q=1) with `trend="t"` (linear drift)

The general ARIMA(p,d,q) model for the d-th differenced series $\Delta^d y_t$:

$$\phi(B) \Delta^d y_t = \theta(B) \varepsilon_t$$

Where:
- $B$ is the backshift operator: $B y_t = y_{t-1}$
- $\phi(B) = 1 - \phi_1 B - \phi_2 B^2$ (AR polynomial, p=2)
- $\theta(B) = 1 + \theta_1 B$ (MA polynomial, q=1)
- $\Delta y_t = y_t - y_{t-1}$ (first difference, d=1)
- $\varepsilon_t \sim \mathcal{N}(0, \sigma^2)$ is white noise

**Training details**:
- Fit on the trailing **500 hours** of training series (sliding window for stability)
- Implemented via `statsmodels.tsa.arima.model.ARIMA`

**Rain-surge proportional scaling** applied post-prediction:

```
rain_surge = min(1.20, mean_rain_12h × 0.008)
ŷ(t+6)  += rain_surge × 0.35
ŷ(t+12) += rain_surge × 0.65
ŷ(t+24) += rain_surge × 1.00
```

**Autoregressive momentum fallback** (when fitted model unavailable):

```
δ = y(t) - y(t-6)   # 6-hour momentum
ŷ(t+6)  = y(t) + 0.25δ + rain_surge × 0.35
ŷ(t+12) = y(t) + 0.50δ + rain_surge × 0.65
ŷ(t+24) = y(t) + 0.80δ + rain_surge × 1.00
```

**Physical output clamping**: $\hat{y}(t+H) \in [0.0\text{ m},\ 55.0\text{ m MSL}]$

---

### 4.3 Candidate 3: SARIMA(1,1,1)×(1,0,1)₂₄

**SARIMA** (Seasonal ARIMA) extends ARIMA with a seasonal component that captures the **24-hour diurnal cycle** of monsoon rainfall and evapotranspiration.

**Model specification**: SARIMA(1,1,1)×(1,0,1)₂₄ with `trend="c"` (constant drift)

The SARIMA model combines non-seasonal and seasonal polynomials:

$$\Phi(B^s) \phi(B) \Delta^D_s \Delta^d y_t = \Theta(B^s) \theta(B) \varepsilon_t$$

Where:
- $s = 24$ (seasonal period: 24 hours)
- $\phi(B) = 1 - \phi_1 B$ (non-seasonal AR, p=1)
- $\theta(B) = 1 + \theta_1 B$ (non-seasonal MA, q=1)
- $\Phi(B^{24}) = 1 - \Phi_1 B^{24}$ (seasonal AR, P=1)
- $\Theta(B^{24}) = 1 + \Theta_1 B^{24}$ (seasonal MA, Q=1)
- $\Delta y_t = y_t - y_{t-1}$ (d=1 differencing)
- $D = 0$ (no seasonal differencing)

**Training details**:
- Fit on trailing **300 hours** (memory-efficient fit window)
- `enforce_stationarity=False`, `maxiter=20`
- Implemented via `statsmodels.tsa.statespace.sarimax.SARIMAX`

**Seasonal lag estimation fallback**:

```
lag_24h_diff = y(t) - y(t-25)
ŷ(t+6)  = y(t) + 0.15 × lag_24h_diff + rain_surge × 0.35
ŷ(t+12) = y(t) + 0.35 × lag_24h_diff + rain_surge × 0.65
ŷ(t+24) = y(t) + 0.60 × lag_24h_diff + rain_surge × 1.00
```

**Physical output clamping**: $\hat{y}(t+H) \in [0.0\text{ m},\ 55.0\text{ m MSL}]$

---

### 4.4 Candidate 4: GRU-2layer-h32

A **Gated Recurrent Unit** (GRU) network that processes the full 72-hour multivariate lookback window sequentially.

**Architecture**:
```
Input  → GRU(input_dim=4, hidden_dim=32, num_layers=2, batch_first=True)
       → FC(hidden_dim=32, out_dim=3)
Output → [ŷ(t+6), ŷ(t+12), ŷ(t+24)]
```

**GRU update equations** at timestep t:

$$z_t = \sigma(W_z x_t + U_z h_{t-1} + b_z)$$
$$r_t = \sigma(W_r x_t + U_r h_{t-1} + b_r)$$
$$\tilde{h}_t = \tanh(W_h x_t + U_h (r_t \odot h_{t-1}) + b_h)$$
$$h_t = (1 - z_t) \odot h_{t-1} + z_t \odot \tilde{h}_t$$

Where $z_t$ is the update gate, $r_t$ is the reset gate, $\sigma$ is sigmoid.

**Training**:
- Optimizer: Adam (lr=0.01)
- Loss: MSE
- Epochs: 6, batch_size=128
- Z-score normalization: $(X - \mu) / (\sigma + 10^{-6})$
- Output rescaled: $\hat{y} = \hat{y}_{norm} \times \sigma_y + \mu_y$

---

### 4.5 Candidate 5: Causal LSTM-2layer-h32

A **unidirectional LSTM** (Long Short-Term Memory) with strict causal masking — no information from future timesteps is ever accessed.

**Architecture**:
```
Input  → LSTM(input_dim=4, hidden_dim=32, num_layers=2, batch_first=True)
       → FC(hidden_dim=32, out_dim=3)
Output → [ŷ(t+6), ŷ(t+12), ŷ(t+24)]
```

**LSTM equations** at timestep t:

$$f_t = \sigma(W_f [h_{t-1}, x_t] + b_f)$$
$$i_t = \sigma(W_i [h_{t-1}, x_t] + b_i)$$
$$\tilde{C}_t = \tanh(W_C [h_{t-1}, x_t] + b_C)$$
$$C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t$$
$$o_t = \sigma(W_o [h_{t-1}, x_t] + b_o)$$
$$h_t = o_t \odot \tanh(C_t)$$

Where $f_t$, $i_t$, $o_t$ are forget, input, and output gates; $C_t$ is the cell state.

**Training**: Same as GRU (Adam, MSE, 8 epochs, z-score normalization/rescaling).

**Causal integrity**: Only the hidden state at the **final timestep** t (i.e., `out[:, -1, :]`) is passed to the linear decoder head. The model never accesses t+1 through t+24 during inference.

---

### 4.6 Candidate 6: Hybrid BiLSTM+1DCNN (Research)

An advanced research candidate combining a **bidirectional LSTM encoder** with a **1D temporal CNN** residual stream and a **causal multi-horizon decoder**.

**Architecture**:
```
Input (72×4) ──────┬────────────────────────────────────────────────────┐
                   │ BiLSTM(4→32, num_layers=2, bidirectional=True)     │ 
                   │ → lstm_out[:, -1, :] ∈ ℝ^64                       │
                   │                                                     │
                   └─ Conv1d(4→64, kernel=3, pad=1) + ReLU              │
                      → conv_out[:, -1, :] ∈ ℝ^64                      │
                                                                        │
Cat([lstm_out, conv_out]) ∈ ℝ^128 ──→ FC(128→3) ──→ [t+6, t+12, t+24] │
```

> [!IMPORTANT]
> **BiLSTM causal integrity**: The bidirectionality operates **within the historical lookback window only** (t-72 to t). The forward pass reads the 72-hour window left-to-right; the backward pass reads it right-to-left. Neither direction crosses the **prediction boundary at t**. No future observations are included in the input. The decoder outputs are **causally valid** forward predictions.

**Training**: Adam, MSE, 8 epochs, batch_size=128.

**Status**: Labeled `"Hybrid BiLSTM (Research)"` — experimental, pending real-time exogenous validation.

---

## 5. Benchmark Evaluation and Champion Selection

### 5.1 Evaluation Protocol

```python
# ForecastLadderBenchmark.run_benchmark()
# Source: /src/suraksha/disasters/flood/models/forecasting/benchmark_ladder.py

for model in [Persistence, ARIMA, SARIMA, GRU, CausalLSTM, HybridBiLSTM]:
    model.fit(X_train, y_train)
    metrics = model.evaluate(X_test, y_test_24h)
    # Reports: rmse_24h, mae_24h, nse_24h

df_results = sort_by(nse_24h, descending=True)
winner = df_results.iloc[0]  # Highest NSE becomes production champion
```

### 5.2 Selection Criterion: Nash-Sutcliffe Efficiency (NSE)

The **Nash-Sutcliffe Efficiency** is the primary model selection criterion because it measures skill relative to the climatological mean — a model with NSE=0 is no better than the mean, while NSE=1 is a perfect forecast.

$$\text{NSE} = 1 - \frac{\sum_{t=1}^{T} (y_t - \hat{y}_t)^2}{\sum_{t=1}^{T} (y_t - \bar{y})^2}$$

Where:
- $y_t$ is the observed stage at time t
- $\hat{y}_t$ is the predicted stage at time t
- $\bar{y}$ is the mean observed stage over the evaluation period
- NSE ∈ (-∞, 1], where NSE=1 is perfect, NSE=0 equals mean-flow prediction, NSE<0 is worse than mean

**Interpretation thresholds** (WMO hydrological model performance):

| NSE Range | Interpretation |
|-----------|---------------|
| > 0.75 | Very good |
| 0.65–0.75 | Good |
| 0.50–0.65 | Satisfactory |
| < 0.50 | Unsatisfactory |

### 5.3 Supplementary Metrics

The benchmark also computes:

| Metric | Formula | Unit |
|--------|---------|------|
| **MAE** | $\frac{1}{T}\sum \|y_t - \hat{y}_t\|$ | m |
| **RMSE** | $\sqrt{\frac{1}{T}\sum (y_t - \hat{y}_t)^2}$ | m |

---

## 6. Fallback Chain

The runtime fallback chain ensures the pipeline never fails to produce a forecast:

```
Production Champion (highest NSE)
    │
    ├─ Checkpoint unavailable / prediction fails?
    │
    ▼
Hybrid BiLSTM+1DCNN
    │
    ▼
GRU-2layer-h32
    │
    ▼
SARIMA(1,1,1)×(1,0,1)₂₄
    │
    ▼
ARIMA(2,1,1)
    │
    ▼
Persistence  ← Always succeeds; terminal fallback
```

> [!WARNING]
> Each fallback step degrades forecast quality. When the pipeline falls back to **Persistence**, the `forecast_confidence` field in `ForecastMultiHorizonState` is set to `"LOW"` and the execution status becomes `"PERSISTENCE_BASELINE_FALLBACK"`. All downstream agents receive this degraded confidence signal.

Fallback triggering conditions (from `ForecastAgent`):
- `fitted_model is None` → `fallback_reason = "fitted_statistical_state_missing"`
- `model is None or not checkpoint_state_loaded` → `fallback_reason = "trained_network_weights_missing"`
- `is_trained == False` → `fallback_reason = "checkpoint_not_marked_trained"`
- Prediction raises exception → `fallback_reason = "prediction_failed:<ExceptionType>"`

---

## 7. Checkpoint Registry

Production checkpoints are stored at:

```
/src/suraksha/disasters/flood/models/checkpoints/
├── arima_checkpoint.pkl
├── causal_lstm_checkpoint.pkl
├── gru_checkpoint.pkl
├── hybrid_bilstm_(research)_checkpoint.pkl
├── persistence_checkpoint.pkl
├── risk_classifier_calibrated.pkl
├── sarima_checkpoint.pkl
└── registry_metadata.json
```

The checkpoint registry (`registry_metadata.json`) records which model is the active production champion and its benchmark metadata.

---

## 8. Runtime Model Routing

At runtime, the **MidRunGate** routes to different models based on the **data regime** classified at the Pre-Run Gate:

| Data Regime | Strategy | Models Executed |
|------------|---------|----------------|
| `NORMAL` | `SARIMA` | 1 (SARIMA only) |
| `RAPID_RISE` | `ENSEMBLE` | 3 (SARIMA + GRU + Causal LSTM committee) |
| `EXTREME_RAINFALL` | `ENSEMBLE` | 3 (committee) |
| `SENSOR_CONFLICT` | `ENSEMBLE` | 3 (committee, with heightened scrutiny) |
| `MISSING_DATA` | `FALLBACK` | 1 (ARIMA or Persistence) |
| `SATELLITE_UNAVAILABLE` | `SARIMA` | 1 |

The **ForecastCommitteeVerdict** in `SupervisorState` records all committee predictions and the spread adjudication.

---

## 9. Training Dataset

| Property | Value |
|----------|-------|
| **Dataset** | ERA5-Land/GloFAS hourly reanalysis, Open-Meteo Historical API |
| **Period** | May–October 2024 (peak monsoon season) |
| **Duration** | 4,416 hours per station |
| **Gauge** | CWC Gandhi Ghat, Patna (023-MDGANG) |
| **Target** | 24-hour lead water level (m MSL) |
| **Train/Test split** | Chronological (no data leakage) |

> [!CAUTION]
> The training dataset is **ERA5-Land reanalysis** (not live CWC gauge observations). Reanalysis data is modelled/assimilated, not purely measured. NSE scores computed on reanalysis-derived test sets are **not** equivalent to validation on independently observed gauge data. All benchmark results carry this important caveat.
