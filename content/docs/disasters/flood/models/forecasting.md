# Flood Forecasting & Risk Models Architecture

## 1. Candidate Forecasting Model Ladder
The SURAKSHA Flood Subsystem treats hydrological time-series prediction not as a sequential pipeline of models, but as an empirical **candidate pool** benchmarked under identical conditions on historical gauge telemetry and Copernicus atmospheric data.

All forecasting models conform to `BaseFloodForecaster` (`src/suraksha/disasters/flood/models/forecasting/base.py`):
- **Input**: Lookback window of shape `(L=72 hours, F=4 features)`:
  - `water_level_m`
  - `precipitation`
  - `river_discharge_m3s`
  - `soil_moisture_0_to_7cm`
- **Output**: Multi-horizon projections:
  - `t_plus_6`: +6 hours water stage (m)
  - `t_plus_12`: +12 hours water stage (m)
  - `t_plus_24`: +24 hours water stage (m)

---

### Candidate 1: Persistence Forecaster (`persistence.py`)
* **Mathematical Baseline**: $\hat{y}_{t+h} = y_t$
* **Purpose**: Fundamental zero-skill benchmark against which all statistical and deep learning models are evaluated.

### Candidate 2: ARIMA (`arima_sarima.py`)
* **Specification**: $\text{ARIMA}(2, 1, 1)$ Autoregressive Integrated Moving Average.
* **Mechanism**: Models autocorrelation in hydrological rate-of-rise $\Delta y_t = y_t - y_{t-1}$.
* **Execution**: Fitted on historical series; applied out-of-sample via statespace filtering.

### Candidate 3: SARIMA (`arima_sarima.py`)
* **Specification**: $\text{SARIMA}(1, 1, 1) \times (1, 0, 1)_{24}$ Seasonal ARIMA.
* **Mechanism**: Captures 24-hour diurnal monsoon rainfall cycles and solar evapotranspiration fluctuations.

### Candidate 4: GRU Forecaster (`gru.py`)
* **Specification**: 2-layer Gated Recurrent Unit (`hidden_size=64`, `dropout=0.15`).
* **Mechanism**: Efficient gated recurrence with lower parameter footprint, ideal for rapid edge updates on remote river monitoring nodes.

### Candidate 5: Causal Multi-Horizon LSTM (`causal_lstm.py`)
* **Specification**: 2-layer Causal Long Short-Term Memory network (`hidden_size=64`, `dropout=0.20`).
* **Multi-Horizon Head**: Separate linear projection heads for +6h, +12h, and +24h lead times. Strictly causal past lookback without lookahead leakage.

### Candidate 6: Hybrid BiLSTM Forecaster (`bilstm_hybrid.py`)
* **Specification**: Bidirectional LSTM encoder across the 72-hour historical window + 1D Temporal Convolutional residual feature extractor + Multi-horizon decoder.
* **Mechanism**: Captures sudden upstream flash-flood surges and antecedent basin saturation simultaneously.

---

## 2. Benchmark Ladder Evaluator (`benchmark_ladder.py`)
The `ForecastLadderBenchmark` orchestrates parallel training and validation across the 6 candidate models on identical test sequences.
* **Evaluation Metrics**:
  - Root Mean Squared Error (RMSE) at 24h
  - Mean Absolute Error (MAE) at 24h
  - Nash-Sutcliffe Efficiency (NSE) at 24h:
    $$NSE = 1 - \frac{\sum (y_t - \hat{y}_t)^2}{\sum (y_t - \bar{y})^2}$$
* **Production Selection**: The candidate achieving the highest Nash-Sutcliffe Efficiency is automatically selected and registered into `ForecastAgent`.

---

## 3. Calibrated Risk Model (`src/suraksha/disasters/flood/models/risk/risk_model.py`)
Independent from the hydrological stage forecasting ladder, SURAKSHA employs a dedicated **Calibrated Risk Model** (XGBoost / Gradient Boosting) to translate physical stage heights and spatial vulnerability into operational disaster risk.

### Features Ingested:
1. `forecast_stage_24h`
2. `danger_level_m`
3. `stage_to_danger_ratio` ($y_{t+24} / y_{\text{danger}}$)
4. `rate_of_rise_m_per_hr`
5. `precipitation_24h_mm`
6. `antecedent_precipitation_3d` ($API_{3d}$)
7. `antecedent_precipitation_7d` ($API_{7d}$)
8. `soil_moisture_level`
9. `district_vulnerability_index`

### Model Outputs:
* `risk_score`: Continuous probability calibrated to $[0.0, 1.0]$.
* `severity`: Categorical classification (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
* `threshold_breach_expected`: Boolean indicating expected breach of danger or warning stage.
* `drivers`: Top 3 contributing features ordered by feature importance.
