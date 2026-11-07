export interface RiverStation {
  id: string;
  name: string;
  basin: string;
  currentStage: number;
  dangerLevel: number;
  warningLevel: number;
  trend: string;
  status: "NORMAL" | "ADVISORY" | "WARNING" | "DANGER";
  latitude: number;
  longitude: number;
  lastUpdated: string;
}

export interface SupervisoryGate {
  id: "pre-run" | "mid-run" | "post-run";
  name: string;
  tagline: string;
  status: "PASSED" | "REVIEWING" | "WARNING";
  description: string;
  metrics: { label: string; value: string; pass: boolean }[];
  checks: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  projectedStage: number;
  surgeLevel: "NORMAL" | "WARNING" | "CRITICAL";
  leadTimeHours: number;
  peakHour: number;
  confidence: number;
}

export const STATIONS: RiverStation[] = [
  {
    id: "STN-PAT-01",
    name: "Patna - Digha Ghat",
    basin: "Ganga Mainstream",
    currentStage: 49.82,
    warningLevel: 50.2,
    dangerLevel: 51.5,
    trend: "+0.42 m / 6h",
    status: "NORMAL",
    latitude: 25.652,
    longitude: 85.105,
    lastUpdated: "12m ago",
  },
  {
    id: "STN-PAT-02",
    name: "Patna - Gandhi Ghat",
    basin: "Ganga Mainstream",
    currentStage: 48.95,
    warningLevel: 49.5,
    dangerLevel: 50.8,
    trend: "+0.28 m / 6h",
    status: "NORMAL",
    latitude: 25.621,
    longitude: 85.172,
    lastUpdated: "5m ago",
  },
  {
    id: "STN-SON-01",
    name: "Koelwar Gauge",
    basin: "Son Sub-basin",
    currentStage: 53.12,
    warningLevel: 53.5,
    dangerLevel: 54.8,
    trend: "+0.85 m / 6h",
    status: "ADVISORY",
    latitude: 25.584,
    longitude: 84.798,
    lastUpdated: "8m ago",
  },
  {
    id: "STN-GAN-01",
    name: "Lalganj Station",
    basin: "Gandak Tributary",
    currentStage: 52.4,
    warningLevel: 52.0,
    dangerLevel: 53.2,
    trend: "+1.15 m / 6h",
    status: "WARNING",
    latitude: 25.867,
    longitude: 85.184,
    lastUpdated: "2m ago",
  },
  {
    id: "STN-PUN-01",
    name: "Sripalpur Station",
    basin: "Punpun Basin",
    currentStage: 50.6,
    warningLevel: 51.0,
    dangerLevel: 52.0,
    trend: "+0.15 m / 6h",
    status: "NORMAL",
    latitude: 25.521,
    longitude: 85.092,
    lastUpdated: "18m ago",
  },
];

export const SUPERVISORY_GATES: SupervisoryGate[] = [
  {
    id: "pre-run",
    name: "Gate 1: Pre-Run Ingestion Validation",
    tagline: "Sensory & Telemetry Health",
    status: "PASSED",
    description: "Evaluates acoustic gauge streams, satellite altimetry, radar precipitation feeds, and rejects sensor drift or anomalous spikes before numerical modeling.",
    metrics: [
      { label: "Reporting Gauges", value: "18 / 18 active", pass: true },
      { label: "Telemetry Latency", value: "38 seconds", pass: true },
      { label: "Outlier Rejection Rate", value: "0.02%", pass: true },
      { label: "Precipitation Grid Resolution", value: "0.05° ERA5/IMD", pass: true },
    ],
    checks: [
      "Physical limits check: Stage rates <= 1.8 m/hr",
      "Sensor battery voltage > 11.8V nominal",
      "Doppler radar precipitation boundary continuity confirmed",
      "Zero missing telemetry windows in preceding 6 hours",
    ],
  },
  {
    id: "mid-run",
    name: "Gate 2: Mid-Run Numerical Stability",
    tagline: "Mass Balance & Hydrodynamic Integrity",
    status: "PASSED",
    description: "Verifies 2D shallow water conservation laws, Courant-Friedrichs-Lewy stability criteria, and ensures deep learning surrogate predictions preserve fluid continuity.",
    metrics: [
      { label: "Courant CFL Number", value: "0.41 (stable < 0.7)", pass: true },
      { label: "Global Mass Conservation Error", value: "0.04%", pass: true },
      { label: "Surrogate Divergence", value: "< 0.003 RMS", pass: true },
      { label: "Iteration Convergence", value: "4.2 ms / step", pass: true },
    ],
    checks: [
      "No negative water depths in flood plain cells",
      "Backwater curve monotonicity verified at confluence points",
      "Wave celerity respects de Saint-Venant hydraulic limits",
      "Hydraulic jump shock capture remains non-oscillatory",
    ],
  },
  {
    id: "post-run",
    name: "Gate 3: Post-Run Plausibility & Supervisory Signoff",
    tagline: "Forecast Reasonability & Human Oversight",
    status: "PASSED",
    description: "Compares projected hydrographs against historical envelope benchmarks and automated risk thresholds, demanding operator confirmation prior to broad dissemination.",
    metrics: [
      { label: "Nash-Sutcliffe Efficiency (NSE)", value: "0.912", pass: true },
      { label: "Peak Arrival Uncertainty", value: "± 22 minutes", pass: true },
      { label: "Lead Time Horizon", value: "72 hours forward", pass: true },
      { label: "Operator Verification", value: "Verified by Shift Hydro-Analyst", pass: true },
    ],
    checks: [
      "Peak stage does not violate historical 100-year inundation ceiling",
      "Alert severity matches state disaster management operational matrices",
      "Public siren/cell-broadcast triggers require cryptographic operator signature",
      "Uncertainty envelope displayed with 90% confidence boundaries",
    ],
  },
];

export const SYNTHETIC_SCENARIOS: Scenario[] = [
  {
    id: "SCEN-01",
    title: "Monsoon Baseline Run (Normal Flow)",
    description: "Standard seasonal monsoon discharge across the middle Ganga basin. River channels maintain stable freeboard below advisory thresholds.",
    projectedStage: 49.82,
    surgeLevel: "NORMAL",
    leadTimeHours: 72,
    peakHour: 48,
    confidence: 96,
  },
  {
    id: "SCEN-02",
    title: "Himalayan Cloudburst & Gandak Inundation",
    description: "Extreme precipitation in upstream catchments causing surge pulses downstream of Lalganj barrage with rapid cresting within 18 hours.",
    projectedStage: 52.32,
    surgeLevel: "WARNING",
    leadTimeHours: 36,
    peakHour: 18,
    confidence: 89,
  },
  {
    id: "SCEN-03",
    title: "Dual-Basin Confluence Super-Flood",
    description: "Simultaneous cresting of Son and Ganga rivers generating backwater pooling at Patna confluence with low-lying urban sector inundation.",
    projectedStage: 53.85,
    surgeLevel: "CRITICAL",
    leadTimeHours: 24,
    peakHour: 12,
    confidence: 84,
  },
  {
    id: "SCEN-04",
    title: "Post-Peak Flood Recession & Drainage",
    description: "Upstream precipitation cessation with steady channel drawdown and safe residual floodplain drainage through agricultural sluices.",
    projectedStage: 48.2,
    surgeLevel: "NORMAL",
    leadTimeHours: 96,
    peakHour: 72,
    confidence: 94,
  },
];

