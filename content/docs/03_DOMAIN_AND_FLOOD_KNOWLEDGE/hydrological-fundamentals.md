# Hydrological Fundamentals: Mathematical Foundations

**Document ID:** DOC-03-002  
**Category:** 03 — Domain and Flood Knowledge  
**Status:** VERIFIED  
**Last Updated:** 2026-11-21  
**Maintainer:** SURAKSHA Science Team

---

## Table of Contents

1. [River Stage: Definition and Measurement](#1-river-stage-definition-and-measurement)
2. [Discharge: Flow Rate and Cross-Section](#2-discharge-flow-rate-and-cross-section)
3. [Manning's Equation](#3-mannings-equation)
4. [The Rating Curve](#4-the-rating-curve)
5. [Antecedent Precipitation Index](#5-antecedent-precipitation-index)
6. [Soil Moisture and Infiltration](#6-soil-moisture-and-infiltration)
7. [Muskingum Channel Routing](#7-muskingum-channel-routing)
8. [Flood Frequency Analysis](#8-flood-frequency-analysis)
9. [Application in SURAKSHA Models](#9-application-in-suraksha-models)
10. [Variable Reference Table](#10-variable-reference-table)

---

## 1. River Stage: Definition and Measurement

### 1.1 Definition

**River stage** h(t) is the water surface elevation at a gauge station measured above a vertical datum, as a function of time t.

```
h(t)  [m MSL]  =  gauge reading  +  datum correction
```

At **Gandhi Ghat (CWC 023-MDGANG)**:
- Datum: **Mean Sea Level (MSL)**, Kolkata Port Trust vertical datum
- Current stage stored as: `FloodState.current_condition.water_level_m` [m MSL]
- `NWDP_LEVEL_DATUM = MSL` → datum offset = 0.0 m (no correction required)
- Physical valid range enforced by SURAKSHA: **[0.0, 120.0] m MSL**

### 1.2 Stage vs. Depth vs. Head

| Concept | Symbol | Units | Description |
|---------|--------|-------|-------------|
| River stage | h(t) | m MSL | Absolute water surface elevation above datum |
| Water depth | d(t) | m | Height of water above channel bed at gauge |
| Hydraulic head | H | m | Pressure head + elevation head (Bernoulli) |
| Stage anomaly | Δh | m | Departure from long-term seasonal mean |

**Relationship:**
```
d(t) = h(t) - z_bed
```
where z_bed is the elevation of the channel bed at the gauge section (m MSL).

### 1.3 Rate of Stage Change

The 1-hour stage jump rate is a critical safety signal in SURAKSHA:

```
dh/dt ≈ [h(t) - h(t-1)] / Δt
```

Where Δt = 1 hour. SURAKSHA's `DeterministicPolicyEngine.validate_physics_telemetry()` enforces:

```python
if jump_1h_m > 2.0 and rainfall_24h_mm < 15.0:
    # Sensor anomaly: physically impossible surge without rainfall
    return False, "Stage surge indicates sensor glitch"
```

This is a hard physical constraint: a natural river cannot rise >2 m/hr without at least 15 mm of antecedent rainfall in the Bihar geological context.

---

## 2. Discharge: Flow Rate and Cross-Section

### 2.1 Basic Discharge Formula

River discharge Q (volumetric flow rate, m³/s) is defined as:

```
Q(t) = A(h) × V̄(h)
```

Where:
- **A(h)** = cross-sectional area of flow [m²] — a function of stage h
- **V̄(h)** = cross-sectional mean flow velocity [m/s] — also a function of h

### 2.2 Velocity Profile (Logarithmic Law)

The vertical velocity profile in an open channel follows a logarithmic distribution:

```
u(z) = (u* / κ) × ln(z / z₀)
```

Where:
- u(z) = velocity at height z above bed [m/s]
- u* = shear velocity = √(τ₀/ρ) [m/s]
- κ = Von Kármán constant ≈ 0.41 (dimensionless)
- z₀ = roughness length [m]
- τ₀ = bed shear stress [N/m²]
- ρ = water density ≈ 1000 kg/m³

**Mean velocity** integrated over depth:
```
V̄ = (u* / κ) × [ln(d / z₀) - 1]
```

### 2.3 Flow Momentum and Flood Hazard

The specific momentum M per unit width w:

```
M/w = Q²/(g × A) + A × ȳ
```

Where ȳ is the centroid depth. High momentum values correspond to high hydrodynamic force on structures and are used by SURAKSHA's consequence engine to assess bridge/road washout risk.

---

## 3. Manning's Equation

### 3.1 Formula

Manning's equation relates discharge to channel geometry and roughness:

```
Q = (1/n) × A × R^(2/3) × S^(1/2)
```

Where:
- **Q** = discharge [m³/s]
- **n** = Manning's roughness coefficient [s·m^(-1/3)] (dimensionless in practical use)
- **A** = flow cross-sectional area [m²]
- **R** = hydraulic radius = A/P [m], where P = wetted perimeter [m]
- **S** = energy slope ≈ channel bed slope for uniform flow [m/m, dimensionless]

### 3.2 Manning's n Values for Ganges Context

| Channel Condition | Manning's n | Notes |
|------------------|-------------|-------|
| Clean, straight main channel | 0.025–0.030 | Low flow, Ganges dry season |
| Winding main channel with vegetation | 0.035–0.045 | Typical monsoon flow |
| Floodplain with crops | 0.040–0.060 | Bihar agricultural floodplain |
| Floodplain with heavy brush | 0.070–0.100 | Riparian vegetation zones |
| Urban inundation (roads, structures) | 0.080–0.150 | Patna urban flooding estimate |

### 3.3 Velocity Calculation from Manning's

Rearranging for mean velocity:

```
V̄ = (1/n) × R^(2/3) × S^(1/2)
```

**Example at Gandhi Ghat (approximate):**
- Stage h = 49.0 m MSL (above danger level)
- Cross-sectional area A ≈ 8,500 m² (from bathymetric survey estimate)
- Wetted perimeter P ≈ 1,200 m → R = 8500/1200 ≈ 7.1 m
- Bed slope S ≈ 0.000065 (6.5 × 10⁻⁵, typical Gangetic gradient near Patna)
- Manning's n ≈ 0.035

```
V̄ = (1/0.035) × 7.1^(2/3) × (0.000065)^(1/2)
   = 28.57 × 3.72 × 0.00807
   ≈ 0.86 m/s
Q  = 8500 × 0.86 ≈ 7,310 m³/s
```

This is in the range of moderate flood conditions at Patna.

---

## 4. The Rating Curve

### 4.1 Definition

A **rating curve** (stage-discharge relationship) is a site-specific empirical function derived from field measurement campaigns:

```
Q = a × (h - h₀)^b
```

Where:
- **Q** = discharge [m³/s]
- **h** = stage [m MSL]
- **h₀** = effective gauge datum intercept (stage at zero flow) [m MSL]
- **a** = site-specific coefficient [m³/(s·m^b)]
- **b** = site-specific exponent, typically 1.5–2.5 for Gangetic rivers

### 4.2 Parameter Estimation

The power-law rating curve is linearized by taking logarithms:

```
log(Q) = log(a) + b × log(h - h₀)
```

Parameters a, b, h₀ are estimated by **least-squares regression** on field-measured (h, Q) pairs from current metering campaigns conducted by CWC.

### 4.3 Multi-Segment Rating Curves

Real rivers have compound rating curves — different segments apply at different stage ranges because channel geometry changes (floodplain activation, different n values):

```
                       ⎧ a₁(h - h₀)^b₁    for h < h_fp  (in-channel)
Q(h) = ⎨
                       ⎩ a₂(h - h₀)^b₂    for h ≥ h_fp  (floodplain active)
```

Where h_fp = floodplain inundation threshold ≈ 47.5–48.0 m MSL at Patna.

### 4.4 Rating Curve Limitations

> [!WARNING]
> SURAKSHA currently uses an implicit rating curve embedded in the SARIMA/GRU/BiLSTM training data. The models learn the h↔Q relationship from ERA5+GloFAS historical data. The models do **not** explicitly implement a CWC-calibrated rating curve equation. This is a known limitation for operational deployment — a CWC-authenticated rating curve should replace ERA5-inferred discharge values.

---

## 5. Antecedent Precipitation Index

### 5.1 Definition

The **Antecedent Precipitation Index** (API) quantifies the soil moisture state accumulated from prior rainfall events, weighted by a recession factor:

```
API_k^d = Σₜ₌₀ᵈ (Kᵗ × Rₜ)
```

Where:
- **API_k^d** = k-day API [mm]
- **K** = daily recession factor (dimensionless), typically 0.80–0.90 for Gangetic alluvium
- **Rₜ** = rainfall on day t prior to current observation [mm/day]
- **d** = number of days in lookback window

### 5.2 SURAKSHA Implementation

**3-day API (API₃ᵈ):**

```python
API_3d = R₀ + 0.85 × R₁ + 0.85² × R₂ + 0.85³ × R₃
       = R₀ + 0.85 × R₁ + 0.7225 × R₂ + 0.6141 × R₃
```

Where R₀ = current-day rainfall, R₁ = yesterday's rainfall, etc.

**7-day API (API₇ᵈ):**

```python
API_7d = Σₜ₌₀⁷ (0.85ᵗ × Rₜ)
```

Both `api_3d` and `api_7d` are computed fields in `data/processed/real_hourly_hydrological_timeseries.csv` and are features in SURAKSHA's XGBoost risk model.

### 5.3 API Thresholds and Flood Risk

| API₃ᵈ Value (mm) | Soil State | Flood Risk Implication |
|-----------------|-----------|------------------------|
| 0–15 | Dry / field dry | Rainfall largely absorbed; low runoff generation |
| 15–40 | Moist | Moderate runoff; Warning Level risk if >80mm rainfall |
| 40–80 | Wet | High runoff; Danger Level risk with moderate rainfall |
| >80 | Saturated | Near-total runoff conversion; extreme flood risk |

### 5.4 Comparison with SCS Curve Number Method

The SCS-CN method (USDA Soil Conservation Service) is an alternative API-based approach:

```
S = (25400 / CN) - 254    [mm, potential maximum retention]
Q_runoff = (P - 0.2S)² / (P + 0.8S)    for P > 0.2S
```

Where CN (curve number) ranges from 30 (highly permeable) to 100 (impervious). Bihar agricultural alluvium has CN ≈ 65–80. This method is used in some NDMA district-level flood models but is not directly implemented in SURAKSHA v1.

---

## 6. Soil Moisture and Infiltration

### 6.1 Green-Ampt Infiltration Model

The Green-Ampt model describes infiltration rate f(t) as:

```
f(t) = K_s × (1 + (ψ × Δθ) / F(t))
```

Where:
- **K_s** = saturated hydraulic conductivity [mm/hr]
- **ψ** = soil suction head at the wetting front [mm]
- **Δθ** = initial soil moisture deficit = θ_s - θ_i (porosity minus initial moisture)
- **F(t)** = cumulative infiltration at time t [mm]

As the soil saturates (θ_i → θ_s, Δθ → 0):

```
f(t) → K_s    (steady-state saturated infiltration = hydraulic conductivity)
```

For Bihar alluvium:
- K_s ≈ 15–40 mm/hr (high permeability Gangetic loam)
- During monsoon active spells with cumulative rain > 100mm: K_s effective ≈ 2–5 mm/hr

### 6.2 Field Capacity and Wilting Point

| Soil Parameter | Symbol | Value (Bihar alluvium) | Units |
|---------------|--------|------------------------|-------|
| Porosity | η | 0.42–0.48 | m³/m³ |
| Field capacity | θ_fc | 0.28–0.35 | m³/m³ |
| Wilting point | θ_wp | 0.12–0.18 | m³/m³ |
| Saturation | θ_s | 0.42–0.48 | m³/m³ |

**When θ > θ_fc:** Gravitational drainage is dominant; soil is above field capacity.  
**When θ → θ_s:** Saturation excess runoff begins; Hortonian overland flow initiates.

### 6.3 SURAKSHA Soil Saturation Field

SURAKSHA stores `soil_saturation` as a normalized ratio [0, 1]:

```
soil_saturation = (θ - θ_wp) / (θ_s - θ_wp)
```

Values sourced from ERA5-Land surface soil moisture (0–7 cm layer). A value of 1.0 indicates complete saturation — any further rainfall generates 100% surface runoff.

---

## 7. Muskingum Channel Routing

### 7.1 Principle

**Muskingum routing** propagates a flood hydrograph from an upstream point to a downstream gauge, accounting for:
- **Translation:** Time lag due to wave travel
- **Attenuation:** Reduction in peak flow due to channel storage

### 7.2 Muskingum Equations

The storage equation in a channel reach:

```
S = K × [x × I + (1-x) × Q]
```

Where:
- **S** = channel storage [m³]
- **K** = travel time parameter [hr] — the residence time of a flood wave in the reach
- **x** = weighting factor [0, 0.5] — 0 = maximum attenuation (reservoir), 0.5 = no attenuation (pure translation)
- **I** = inflow [m³/s]
- **Q** = outflow [m³/s]

The routing difference equations:

```
Q(t+1) = C₀ × I(t+1) + C₁ × I(t) + C₂ × Q(t)
```

Where the Muskingum coefficients are:

```
C₀ = (-Kx + 0.5Δt) / D
C₁ = (Kx + 0.5Δt) / D
C₂ = (K - Kx - 0.5Δt) / D
D  = K - Kx + 0.5Δt
```

And C₀ + C₁ + C₂ = 1.0 (conservation of mass check).

### 7.3 Parameter Values for Ganges Reaches

| Reach | From | To | K (hr) | x | Notes |
|-------|------|----|--------|---|-------|
| Upper Ganges | Hardwar | Patna | ~72 | 0.20 | Long reach, high attenuation |
| Gandak confluence | Sonepur | Patna | ~12–18 | 0.15 | Short reach |
| Ghaghra confluence | Doriganj | Patna | ~24 | 0.18 | Medium reach |
| Kosi confluence | Kosi Barrage | Patna | ~36–48 | 0.22 | Tortuous channel |

**Note:** These values are approximate illustrative estimates. SURAKSHA's neural network models (GRU, BiLSTM) implicitly learn a data-driven equivalent of Muskingum routing during training on ERA5+GloFAS data — they capture the lag-attenuation behavior without explicitly parameterizing K and x.

### 7.4 Implicit Routing in SURAKSHA Forecasting

SURAKSHA's sequence models process historical time windows of:
- Gandhi Ghat stage h(t-N)...h(t) [input sequence]
- API₃ᵈ, API₇ᵈ, soil_saturation [catchment state features]
- rainfall_24h_mm [precipitation forcing]

The GRU and BiLSTM architectures encode the routing memory through their recurrent hidden states — functionally equivalent to the Muskingum storage term S. The models learn the routing parameters implicitly from data.

---

## 8. Flood Frequency Analysis

### 8.1 Annual Maximum Series (AMS)

Flood frequency analysis uses historical records of annual peak discharges/stages:

```
h_max(year i) = max[h(t)] for all t in year i
```

The AMS is fitted to a **probability distribution** to estimate return periods.

### 8.2 Log-Pearson Type III Distribution

Standard USGS/CWC method for flood frequency:

```
log(Q) = x̄ + K_T × s
```

Where:
- x̄ = mean of log(Q) values
- s = standard deviation of log(Q) values  
- K_T = frequency factor for return period T and skewness coefficient g

The **return period** T and **exceedance probability** p are related:

```
p = 1/T    (annual probability of exceedance)
```

### 8.3 Gandhi Ghat Return Period Estimates

Based on CWC historical records (1958–2024, ~66 years):

| Return Period | Approximate Stage (m MSL) | Approximate Q (m³/s) |
|--------------|--------------------------|---------------------|
| 2-year | 47.0–47.5 | ~25,000 |
| 5-year | 48.0–48.5 | ~35,000 |
| 10-year | 48.8–49.2 | ~45,000 |
| 25-year | 49.5–50.0 | ~58,000 |
| 50-year | 50.1–50.5 | ~68,000 |
| 100-year | 50.6–51.0 | ~78,000 |

> [!NOTE]
> These estimates assume stationarity of the flood frequency distribution. Non-stationarity due to climate change, land use change, and channel modification means true return periods may be shorter than historical estimates suggest.

---

## 9. Application in SURAKSHA Models

### 9.1 SARIMA Model

**SARIMA(p,d,q)(P,D,Q)_s** captures seasonal autoregressive patterns in stage time series:

```
Φ_P(B^s) × φ_p(B) × (1-B)^d × (1-B^s)^D × h_t = Θ_Q(B^s) × θ_q(B) × ε_t + drift
```

Where:
- **B** = backshift operator: B × h_t = h_{t-1}
- **φ_p(B)** = non-seasonal AR polynomial of order p
- **Φ_P(B^s)** = seasonal AR polynomial of order P at seasonality s
- **d, D** = non-seasonal and seasonal differencing orders
- **θ_q, Θ_Q** = moving average polynomials
- **ε_t** = white noise residuals
- **s** = seasonality (24 hours for hourly data)
- **drift** = trend term (`trend="c"` configuration resolves bias toward trend)

The fitted SARIMA captures the daily tidal/diurnal pattern in Ganges stage and autoregressive persistence.

### 9.2 GRU (Gated Recurrent Unit)

The GRU processes the stage time series with explicit gating:

**Update gate:** z_t = σ(W_z × [h_{t-1}, x_t])  
**Reset gate:** r_t = σ(W_r × [h_{t-1}, x_t])  
**Candidate:** h̃_t = tanh(W × [r_t ⊙ h_{t-1}, x_t])  
**Output:** h_t = (1 - z_t) ⊙ h_{t-1} + z_t ⊙ h̃_t

Where x_t is the feature vector at time t (stage, rainfall, soil moisture, discharge, API indices).

GRU avoids the vanishing gradient problem of vanilla RNNs, allowing it to remember relevant conditions (heavy rainfall events) over multi-day time windows.

### 9.3 Hybrid BiLSTM

The Bidirectional LSTM processes sequences in both forward and backward temporal directions:

**Forward LSTM:** h⃗_t = LSTM(h⃗_{t-1}, x_t)  
**Backward LSTM:** h⃖_t = LSTM(h⃖_{t+1}, x_t)  
**Combined:** h_t = [h⃗_t ; h⃖_t] (concatenation)

The bidirectional architecture allows the model to use future context (within the input window) to better understand current conditions — particularly useful for detecting the peak of a hydrograph within the lookback window.

**Output rescaling (mandatory):**
```python
predicted_m = (normalized_pred * target_std) + target_mean
predicted_m = max(0.0, min(predicted_m, 55.0))  # Physical bounds clamp
```

### 9.4 XGBoost Risk Model

The risk model maps the full feature vector to a calibrated probability score [0, 1]:

**Feature vector includes:**
- h_t (current stage)
- rainfall_24h_mm
- api_3d, api_7d
- soil_saturation
- river_discharge_m3s
- stage_to_danger_ratio
- inundation_area_km2 (from SAR)

**Output:**
```python
risk_score = xgb_model.predict_proba(X)[1]  # P(flood event | features)
risk_score = np.clip(risk_score, 0.0, 1.0)
```

Platt scaling or isotonic regression is applied post-hoc for calibration (reliability diagram verification).

---

## 10. Variable Reference Table

| Symbol | Name | Units | SURAKSHA Field | Valid Range |
|--------|------|-------|----------------|-------------|
| h(t) | River stage | m MSL | `water_level_m` | [0, 120] |
| Q(t) | Discharge | m³/s | `river_discharge_m3s` | [0, 150000] |
| A(h) | Cross-sectional area | m² | — | > 0 |
| V̄(h) | Mean velocity | m/s | — | [0, 5] |
| n | Manning's roughness | s·m^(-1/3) | — | [0.01, 0.15] |
| R | Hydraulic radius | m | — | > 0 |
| S | Energy slope | m/m | — | (0, 0.01) |
| a | Rating curve coefficient | — | — | > 0 |
| b | Rating curve exponent | — | — | [1.5, 2.5] |
| h₀ | Zero-flow stage | m MSL | — | site-specific |
| K | Muskingum travel time | hr | — | > 0 |
| x | Muskingum weight | — | — | [0, 0.5] |
| API₃ᵈ | 3-day antecedent precip | mm | `api_3d` | [0, 500] |
| API₇ᵈ | 7-day antecedent precip | mm | `api_7d` | [0, 1000] |
| P | Rainfall | mm/day | `rainfall_24h_mm` / 24 | [0, 300] |
| ET | Evapotranspiration | mm/day | — | [0, 10] |
| θ | Volumetric soil moisture | m³/m³ | `soil_moisture_0_to_7cm` | [0, 0.5] |
| C | Runoff coefficient | — | — | [0, 1] |
| K_s | Saturated hydraulic cond | mm/hr | — | [1, 100] |
| ε | NaN/division guard | — | — | 1e-7 |
| dh/dt | Stage rise rate | m/hr | `jump_1h_m` (metadata) | [-5, 5] |

---

*Related documents: [flood-science-overview.md](./flood-science-overview.md) | [flood-thresholds.md](./flood-thresholds.md) | [glacial-melt-and-runoff.md](./glacial-melt-and-runoff.md)*
