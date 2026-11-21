# Cryosphere & Glacial Hydrology Processors

| Field | Value |
|---|---|
| **Document ID** | GEO-06-002 |
| **Version** | 1.0.0 |
| **Status** | VERIFIED |
| **Module** | SURAKSHA-MOD-01-FLOOD |
| **Source Implementations** | `src/suraksha/disasters/flood/geospatial/s1_cryosphere_processor.py`<br/>`src/suraksha/disasters/flood/geospatial/s2_snowline_processor.py` |

---

## 1. Scientific Rationale

The Ganges river system is fed by glacial meltwater originating in the upper Himalayan catchments (Bhagirathi, Alaknanda, Mandakini). During early monsoon (May–June) and severe cloudburst events (e.g. Kedarnath 2013, Chamoli 2021), rapid cryosphere dynamics directly influence baseline river discharge arriving at Patna downstream:

1. **Wet Snow Surges**: Liquid water content in snowpacks drastically lowers radar backscatter and accelerates melt runoff.
2. **Glacial Lake Outburst Floods (GLOFs)**: Moraine dam breaches produce catastrophic flood waves traveling down the Ganga corridor.
3. **Snowline Migration**: Elevation tracking of transient snowlines provides antecedent catchment storage estimates.

---

## 2. Sentinel-1 SAR Cryosphere Processor (`s1_cryosphere_processor.py`)

### 2.1 Wet Snow Detection Physics
Liquid water in snow dramatically increases the dielectric constant, attenuating the radar signal and causing a sharp drop in backscatter relative to frozen, dry winter snow:
$$\Delta \sigma^0 = \sigma^0_{\text{observed}} - \sigma^0_{\text{reference dry}} \le -3.0\text{ dB}$$
Pixels exhibiting $\Delta \sigma^0 \le -3.0\text{ dB}$ across elevations above 3,000m are classified as active melting snowpack.

---

## 3. Sentinel-2 Optical Snowline Processor (`s2_snowline_processor.py`)

### 3.1 Normalized Difference Snow Index (NDSI)
Optical detection uses Sentinel-2 MSI Bands 3 (Green, 560 nm) and 11 (SWIR-1, 1610 nm):
$$\text{NDSI} = \frac{\text{Green} - \text{SWIR}}{\text{Green} + \text{SWIR}} = \frac{B_3 - B_{11}}{B_3 + B_{11}}$$
Snow exhibits high reflectance in visible wavelengths but strong absorption in shortwave infrared.
- **Pure Snow**: $\text{NDSI} \ge 0.42$
- **Mixed Ice / Slush**: $0.25 \le \text{NDSI} < 0.42$
- **Cloud Masking**: QA60 cloud bitmask and Cirrus band (Band 10) eliminate cloud false positives.

### 3.2 Transient Snowline Elevation Extraction
Using the Copernicus 30m GLO-30 DEM, the processor computes the 10th percentile elevation of the contiguous snowpack mask, establishing the current **Transient Snowline (TSL)** in meters MSL.
