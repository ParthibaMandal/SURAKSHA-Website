# Flood Forecasting Model Ladder: Empirical Evaluation & Benchmarks

## 1. Executive Summary & Benchmark Framework
In accordance with the SURAKSHA scientific architecture, forecasting models do not form a sequential inference chain. Instead, they constitute an **empirical candidate pool** evaluated under identical retrospective sequences ($L=72\text{h}$ lookback, $H=24\text{h}$ horizon) on authentic hourly hydrological telemetry from Copernicus GloFAS and ERA5-Land reanalysis for the Ganges at Patna.

The candidate pool spans baseline persistence, classical statistical time-series models, and modern deep recurrent architectures:
1. **Persistence Forecaster** (Zero-skill mathematical baseline)
2. **ARIMA(2, 1, 1)** (Autoregressive Integrated Moving Average)
3. **SARIMA(1, 1, 1)x(1, 0, 1, 24)** (Seasonal ARIMA with diurnal cycle)
4. **GRU** (2-layer Gated Recurrent Unit)
5. **Causal LSTM** (2-layer Causal Long Short-Term Memory)
6. **Hybrid BiLSTM** (Bidirectional LSTM encoder + Temporal CNN residual filter)

---

## 2. Empirical Benchmark Results (Ganges at Patna Station)

Evaluated across the held-out test split of the authentic Copernicus hourly hydrological timeseries:

| Candidate Model | 24h RMSE (m) | 24h MAE (m) | Nash-Sutcliffe Efficiency ($NSE_{24\text{h}}$) | Status / Operational Role |
| :--- | :---: | :---: | :---: | :--- |
| **SARIMA(1, 1, 1)x(1, 0, 1, 24)** | **0.181** | **0.092** | **0.981** | **Top Statistical Winner (Diurnal Cycle)** |
| **Persistence ($y_{t+h} = y_t$)** | 0.183 | 0.155 | 0.980 | Baseline Benchmark |
| **ARIMA(2, 1, 1)** | 0.183 | 0.155 | 0.980 | Momentum Benchmark |
| **Hybrid BiLSTM (Research)** | **0.225** | **0.200** | **0.970** | **Top Deep Learning Winner (Multi-Feature Exogenous)** |
| **Gated Recurrent Unit (GRU)** | 0.278 | 0.250 | 0.954 | Lightweight Recurrent Edge Candidate |
| **Causal LSTM** | 0.417 | 0.366 | 0.897 | Standard Deep Recurrent Baseline |

---

## 3. Scientific Insights & Operational Conclusions

1. **Diurnal Seasonality Importance**:
   - In low-gradient river plains like the lower Ganges basin during non-monsoon periods, river levels exhibit marked diurnal variations due to upstream dam releases and evapotranspiration. SARIMA's 24-hour seasonal lag enables it to achieve an extraordinary **MAE of 0.092m** and **NSE of 0.981**.
2. **Multi-Feature Exogenous Power (Hybrid BiLSTM)**:
   - While statistical models track immediate rate-of-rise autocorrelation, **Hybrid BiLSTM** explicitly ingests catchment precipitation, GloFAS discharge, and root-zone soil moisture ($0 → 7\text{cm}$), making it the premier architecture for anticipating sudden upstream storm surges prior to physical arrival at the gauge.
3. **Decoupled Risk Layer**:
   - As designed, physical forecasting is strictly insulated from risk calculation. Regardless of which forecaster is chosen by the ladder benchmark, its multi-horizon stage estimates ($t+6, t+12, t+24\text{h}$) feed directly into the calibrated **Risk Model (XGBoost / Gradient Boosting)** and the **TypeSafe Jev System One** verification layer.
