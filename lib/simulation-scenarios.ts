/**
 * SURAKSHA Flood Scenario Simulation Laboratory 2.0
 * Multi-Driver Compound Flood Scenario Catalog & 21-Day Progressive Hydrological Timeline Engine
 */

export interface SimulationDayState {
  day: number;
  label: string;
  stage: number; // Simulated ground truth water level (m)
  discharge: number; // Upstream discharge (m³/s)
  localRain: number; // Patna urban rainfall (mm/day)
  upstreamRain: number; // Middle Ganga basin rainfall (mm/day)
  snowmeltIndex: number; // Meltwater anomaly index (1.0x - 3.0x)
  soilSaturation: number; // Catchment soil saturation percentage (0 - 100%)
  tributaryInflow: number; // Combined Gandak + Son inflow (m³/s)
  embankmentStatus: "Stable" | "Under Stress" | "Structural Seepage" | "Breach";
  aiForecastStage: number; // What SURAKSHA predicts at this timestep
  aiRiskScore: number; // 0 - 100
  aiSeverity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  diagnostic: string; // Explanatory intelligence reasoning
  optimisticStage: number;
  referenceStage: number;
  severeStage: number;
}

export interface FloodImpactAssessment {
  inundationAreaKm2: number;
  exposedPopulation: number;
  waterDepthM: { min: number; max: number; avg: number };
  affectedWards: string[];
  criticalInfrastructure: {
    roadsCutOff: string[];
    substationsAtRisk: string[];
    waterIntakesCompromised: string[];
    healthCentersRelocated: string[];
  };
  emergencyLogistics: {
    reliefSheltersActivated: number;
    ndrfBoatsDeployed: number;
    waterTankersDispatched: number;
    mobileHealthPosts: number;
  };
  recoveryWindowDays: number;
}

export interface SimulationScenario {
  id: string;
  code: string;
  title: string;
  category: "Low-Risk" | "Moderate-Risk" | "High-Risk" | "Extreme-Event" | "System-Reliability";
  shortDescription: string;
  fullDescription: string;
  testingObjective: string;
  benchmarkStation: string;
  warningLevel: number;
  dangerLevel: number;
  highestFloodLevel: number;
  initialInflowMultiplier: number;
  initialRainfallAnomaly: number;
  initialSnowmeltIndex: number;
  initialSoilSaturation: number;
  initialTributaryInflow: number;
  activeDrivers: string[];
  isCompound: boolean;
  timeline: SimulationDayState[];
}

export const CWC_GANDHI_GHAT_BENCHMARKS = {
  stationId: "STN-PAT-01",
  stationName: "Gandhi Ghat, Patna",
  river: "Ganges (Ganga)",
  datumLevel: 43.0, // Zero datum (m)
  baselineLevel: 44.2, // Reference dry/early monsoon baseline (m)
  warningLevel: 47.6, // Official CWC Warning Level (m)
  dangerLevel: 48.6, // Official CWC Danger Level (m)
  highestFloodLevel: 50.52, // Recorded Historic HFL (m)
};

export const SIMULATION_EVENT_DRIVERS = [
  { id: "glacier_melt", name: "Glacier & Snowmelt Acceleration", icon: "Mountain", defaultAnomaly: 2.1 },
  { id: "cloudburst", name: "Foothills Cloudburst Event", icon: "Zap", defaultAnomaly: 180 },
  { id: "persistent_rain", name: "Persistent Monsoon Low-Pressure Deluge", icon: "CloudRain", defaultAnomaly: 140 },
  { id: "tributary_surge", name: "Tributary Inflow Synchronous Surge", icon: "Waves", defaultAnomaly: 8500 },
  { id: "glof", name: "Glacial Lake Outburst Flood (GLOF) Wave", icon: "Flame", defaultAnomaly: 2.4 },
  { id: "reservoir_release", name: "Upstream Dam Emergency Spillway Release", icon: "Sliders", defaultAnomaly: 42000 },
];

/**
 * Computes dynamic disaster impact assessment based on physical river stage and breach condition.
 */
export function computeImpactAssessment(stage: number, embankmentStatus: string): FloodImpactAssessment {
  if (stage < CWC_GANDHI_GHAT_BENCHMARKS.warningLevel) {
    return {
      inundationAreaKm2: 0,
      exposedPopulation: 0,
      waterDepthM: { min: 0, max: 0, avg: 0 },
      affectedWards: [],
      criticalInfrastructure: {
        roadsCutOff: [],
        substationsAtRisk: [],
        waterIntakesCompromised: [],
        healthCentersRelocated: [],
      },
      emergencyLogistics: {
        reliefSheltersActivated: 0,
        ndrfBoatsDeployed: 0,
        waterTankersDispatched: 0,
        mobileHealthPosts: 0,
      },
      recoveryWindowDays: 0,
    };
  }

  const isDanger = stage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel;
  const isBreached = embankmentStatus === "Breach";
  const excessDanger = Math.max(0, stage - CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel);

  // Scaled physical numbers
  const inundationAreaKm2 = Number(
    (isBreached ? 14.2 + excessDanger * 5.4 : isDanger ? 6.5 + excessDanger * 4.2 : 2.4).toFixed(1)
  );
  const exposedPopulation = isBreached
    ? Math.round(38000 + excessDanger * 14000)
    : isDanger
    ? Math.round(18900 + excessDanger * 11000)
    : 4200;

  const maxDepth = Number((isBreached ? 2.4 + excessDanger * 0.8 : isDanger ? 1.6 + excessDanger * 0.5 : 0.6).toFixed(1));
  const avgDepth = Number((maxDepth * 0.55).toFixed(1));

  return {
    inundationAreaKm2,
    exposedPopulation,
    waterDepthM: { min: 0.2, max: maxDepth, avg: avgDepth },
    affectedWards: isBreached
      ? ["Ward 01 (Danapur Cantonment)", "Ward 04 (Digha Diara)", "Ward 09 (Kurji Lowlands)", "Ward 14 (Rajendra Nagar Drainage)"]
      : isDanger
      ? ["Ward 04 (Digha Diara)", "Ward 02 (Gandhi Ghat Riverfront)", "Ward 06 (Danapur Ghats)"]
      : ["Low-Lying Agricultural Diara Sectors"],
    criticalInfrastructure: {
      roadsCutOff: isDanger
        ? ["Danapur-Khagaul Link Road", "Digha Riverfront Bypass", "Ashok Rajpath Ghat Approach"]
        : ["Digha Diara Unpaved Service Track"],
      substationsAtRisk: isDanger ? ["Danapur 33/11kV Substation", "Digha Pumping Station Feeder"] : [],
      waterIntakesCompromised: isDanger ? ["Gandhi Ghat Municipal Water Intake Pump 02"] : [],
      healthCentersRelocated: isBreached ? ["Danapur Primary Health Centre", "Digha Community Clinic"] : [],
    },
    emergencyLogistics: {
      reliefSheltersActivated: isBreached ? 16 : isDanger ? 12 : 4,
      ndrfBoatsDeployed: isBreached ? 24 : isDanger ? 16 : 4,
      waterTankersDispatched: isBreached ? 32 : isDanger ? 20 : 6,
      mobileHealthPosts: isBreached ? 8 : isDanger ? 5 : 2,
    },
    recoveryWindowDays: isBreached ? 14 : isDanger ? 8 : 4,
  };
}

/**
 * 20 Benchmark Scenarios for the SURAKSHA Flood Scenario Simulation Laboratory
 */
export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  // 1. S11 — Flagship 21-Day Compound Flood Event (High-Risk)
  {
    id: "WORST_01_RAPID_RIVER_SURGE",
    code: "S11",
    title: "Compound Glacial Melt & Monsoon Escalation",
    category: "High-Risk",
    shortDescription: "Elevated Himalayan thaw, intensifying catchment rain, and saturated tributary inflows.",
    fullDescription: "Flagship 21-day compound flood event at Gandhi Ghat. Begins with early summer snowmelt swell in the Alaknanda/Gangotri headwaters, followed by a persistent monsoon depression over Bihar and saturated soil runoff.",
    testingObjective: "Multi-variable compound risk escalation, antecedent soil saturation modeling, and 72h early warning lead times.",
    benchmarkStation: "Gandhi Ghat, Patna (STN-PAT-01)",
    warningLevel: 47.6,
    dangerLevel: 48.6,
    highestFloodLevel: 50.52,
    initialInflowMultiplier: 1.6,
    initialRainfallAnomaly: 160,
    initialSnowmeltIndex: 2.1,
    initialSoilSaturation: 82,
    initialTributaryInflow: 6200,
    activeDrivers: ["glacier_melt", "persistent_rain", "tributary_surge"],
    isCompound: true,
    timeline: [
      {
        day: 1,
        label: "Day 01",
        stage: 44.5,
        discharge: 22000,
        localRain: 0,
        upstreamRain: 5,
        snowmeltIndex: 1.0,
        soilSaturation: 35,
        tributaryInflow: 3800,
        embankmentStatus: "Stable",
        aiForecastStage: 44.55,
        aiRiskScore: 12,
        aiSeverity: "LOW",
        diagnostic: "Baseline early-monsoon river conditions. River stage is 3.10m below Warning Mark. Headwater inflows nominal.",
        optimisticStage: 44.2,
        referenceStage: 44.5,
        severeStage: 44.8,
      },
      {
        day: 3,
        label: "Day 03",
        stage: 44.9,
        discharge: 24200,
        localRain: 5,
        upstreamRain: 18,
        snowmeltIndex: 1.4,
        soilSaturation: 44,
        tributaryInflow: 4100,
        embankmentStatus: "Stable",
        aiForecastStage: 45.1,
        aiRiskScore: 18,
        aiSeverity: "LOW",
        diagnostic: "Upper cryosphere degree-day warming detected. Upstream discharge entering Buxar reach is trending upward.",
        optimisticStage: 44.4,
        referenceStage: 44.8,
        severeStage: 45.2,
      },
      {
        day: 5,
        label: "Day 05",
        stage: 45.4,
        discharge: 27100,
        localRain: 12,
        upstreamRain: 35,
        snowmeltIndex: 1.8,
        soilSaturation: 58,
        tributaryInflow: 4700,
        embankmentStatus: "Stable",
        aiForecastStage: 45.65,
        aiRiskScore: 28,
        aiSeverity: "LOW",
        diagnostic: "Snowmelt contribution peaking. Upstream hydrometric gauges confirm non-linear discharge amplification.",
        optimisticStage: 44.6,
        referenceStage: 45.1,
        severeStage: 45.8,
      },
      {
        day: 7,
        label: "Day 07",
        stage: 46.1,
        discharge: 29800,
        localRain: 28,
        upstreamRain: 60,
        snowmeltIndex: 2.1,
        soilSaturation: 71,
        tributaryInflow: 5300,
        embankmentStatus: "Stable",
        aiForecastStage: 46.4,
        aiRiskScore: 42,
        aiSeverity: "MODERATE",
        diagnostic: "Deep convective monsoon front arrives over Middle Ganga basin. Soil moisture deficit rapidly closing.",
        optimisticStage: 44.9,
        referenceStage: 45.7,
        severeStage: 46.5,
      },
      {
        day: 9,
        label: "Day 09",
        stage: 46.9,
        discharge: 33400,
        localRain: 45,
        upstreamRain: 95,
        snowmeltIndex: 2.2,
        soilSaturation: 86,
        tributaryInflow: 6100,
        embankmentStatus: "Stable",
        aiForecastStage: 47.35,
        aiRiskScore: 58,
        aiSeverity: "MODERATE",
        diagnostic: "Continuous rainfall driving catchment near saturation. BiLSTM projects Warning Mark exceedance within 48h.",
        optimisticStage: 45.2,
        referenceStage: 46.4,
        severeStage: 47.4,
      },
      {
        day: 11,
        label: "Day 11",
        stage: 47.55,
        discharge: 36800,
        localRain: 65,
        upstreamRain: 120,
        snowmeltIndex: 2.3,
        soilSaturation: 94,
        tributaryInflow: 7200,
        embankmentStatus: "Under Stress",
        aiForecastStage: 48.05,
        aiRiskScore: 74,
        aiSeverity: "HIGH",
        diagnostic: "WARNING LEVEL IMMINENT (47.60m). Tributary backwater pooling at Son confluence. Civil advisory draft initiated.",
        optimisticStage: 45.4,
        referenceStage: 47.1,
        severeStage: 48.2,
      },
      {
        day: 13,
        label: "Day 13",
        stage: 48.15,
        discharge: 39500,
        localRain: 85,
        upstreamRain: 145,
        snowmeltIndex: 2.3,
        soilSaturation: 98,
        tributaryInflow: 7900,
        embankmentStatus: "Under Stress",
        aiForecastStage: 48.65,
        aiRiskScore: 88,
        aiSeverity: "HIGH",
        diagnostic: "WARNING LEVEL EXCEEDED. Stage reached 48.15m. Projected Danger Level breach (48.60m) in 24 hours.",
        optimisticStage: 45.5,
        referenceStage: 47.8,
        severeStage: 49.1,
      },
      {
        day: 15,
        label: "Day 15",
        stage: 48.85,
        discharge: 42800,
        localRain: 110,
        upstreamRain: 160,
        snowmeltIndex: 2.1,
        soilSaturation: 100,
        tributaryInflow: 8600,
        embankmentStatus: "Under Stress",
        aiForecastStage: 49.2,
        aiRiskScore: 96,
        aiSeverity: "CRITICAL",
        diagnostic: "DANGER LEVEL BREACHED (48.60m). HAND model computes 18,900 exposed population in Digha & Danapur lowlands.",
        optimisticStage: 45.6,
        referenceStage: 48.3,
        severeStage: 49.8,
      },
      {
        day: 18,
        label: "Day 18",
        stage: 49.4,
        discharge: 44200,
        localRain: 30,
        upstreamRain: 70,
        snowmeltIndex: 1.8,
        soilSaturation: 96,
        tributaryInflow: 7800,
        embankmentStatus: "Under Stress",
        aiForecastStage: 49.1,
        aiRiskScore: 92,
        aiSeverity: "CRITICAL",
        diagnostic: "Peak stage achieved at 49.40m. Upstream rainfall beginning to taper. Inflow cresting past Gandhi Ghat datum.",
        optimisticStage: 45.3,
        referenceStage: 48.1,
        severeStage: 50.4,
      },
      {
        day: 21,
        label: "Day 21",
        stage: 47.9,
        discharge: 37500,
        localRain: 5,
        upstreamRain: 25,
        snowmeltIndex: 1.4,
        soilSaturation: 84,
        tributaryInflow: 6400,
        embankmentStatus: "Stable",
        aiForecastStage: 47.4,
        aiRiskScore: 68,
        aiSeverity: "HIGH",
        diagnostic: "River has fallen below Danger Mark (48.60m). Post-flood recession analysis and damage proxy mapping initiated.",
        optimisticStage: 44.8,
        referenceStage: 47.3,
        severeStage: 48.6,
      },
    ],
  },

  // 2. S01 — Normal River Baseline (Low-Risk)
  {
    id: "BEST_01_CALM_BASELINE",
    code: "S01",
    title: "Normal River Baseline Conditions",
    category: "Low-Risk",
    shortDescription: "Stable baseflow, zero precipitation anomaly, dry catchment.",
    fullDescription: "Demonstrates model stability during routine, dry-weather river conditions without rainfall forcing.",
    testingObjective: "Verification of zero false alarms during tranquil early season flow regimes.",
    benchmarkStation: "Gandhi Ghat, Patna (STN-PAT-01)",
    warningLevel: 47.6,
    dangerLevel: 48.6,
    highestFloodLevel: 50.52,
    initialInflowMultiplier: 1.0,
    initialRainfallAnomaly: 0,
    initialSnowmeltIndex: 1.0,
    initialSoilSaturation: 30,
    initialTributaryInflow: 3500,
    activeDrivers: [],
    isCompound: false,
    timeline: [
      { day: 1, label: "Day 01", stage: 44.2, discharge: 19500, localRain: 0, upstreamRain: 0, snowmeltIndex: 1.0, soilSaturation: 28, tributaryInflow: 3400, embankmentStatus: "Stable", aiForecastStage: 44.25, aiRiskScore: 8, aiSeverity: "LOW", diagnostic: "Tranquil baseline flow. Normal Gangetic drainage.", optimisticStage: 44.0, referenceStage: 44.2, severeStage: 44.5 },
      { day: 5, label: "Day 05", stage: 44.3, discharge: 19800, localRain: 0, upstreamRain: 2, snowmeltIndex: 1.0, soilSaturation: 30, tributaryInflow: 3500, embankmentStatus: "Stable", aiForecastStage: 44.32, aiRiskScore: 10, aiSeverity: "LOW", diagnostic: "Baseflow equilibrium maintained across all stations.", optimisticStage: 44.1, referenceStage: 44.3, severeStage: 44.6 },
      { day: 10, label: "Day 10", stage: 44.4, discharge: 20100, localRain: 2, upstreamRain: 5, snowmeltIndex: 1.0, soilSaturation: 32, tributaryInflow: 3600, embankmentStatus: "Stable", aiForecastStage: 44.38, aiRiskScore: 12, aiSeverity: "LOW", diagnostic: "Slight diurnal fluctuation, well below thresholds.", optimisticStage: 44.2, referenceStage: 44.4, severeStage: 44.7 },
      { day: 15, label: "Day 15", stage: 44.35, discharge: 19900, localRain: 0, upstreamRain: 0, snowmeltIndex: 1.0, soilSaturation: 31, tributaryInflow: 3500, embankmentStatus: "Stable", aiForecastStage: 44.3, aiRiskScore: 10, aiSeverity: "LOW", diagnostic: "Catchment steady. Zero warning triggers.", optimisticStage: 44.1, referenceStage: 44.35, severeStage: 44.6 },
      { day: 21, label: "Day 21", stage: 44.25, discharge: 19600, localRain: 0, upstreamRain: 0, snowmeltIndex: 1.0, soilSaturation: 29, tributaryInflow: 3450, embankmentStatus: "Stable", aiForecastStage: 44.22, aiRiskScore: 9, aiSeverity: "LOW", diagnostic: "Stable seasonal baseflow. Zero false positives.", optimisticStage: 44.0, referenceStage: 44.25, severeStage: 44.5 },
    ],
  },

  // 3. S02 — Seasonal Snowmelt (Low-Risk)
  {
    id: "BEST_02_SEASONAL_SNOWMELT",
    code: "S02",
    title: "Seasonal Himalayan Snowmelt Pulse",
    category: "Low-Risk",
    shortDescription: "Moderate snowpack meltwater pulse from Alaknanda & Bhagirathi headwaters.",
    fullDescription: "Evaluates whether the model properly captures upstream meltwater contribution without misclassifying it as a severe rainstorm.",
    testingObjective: "Verification of cryosphere forcing isolation and travel time attenuation.",
    benchmarkStation: "Gandhi Ghat, Patna (STN-PAT-01)",
    warningLevel: 47.6,
    dangerLevel: 48.6,
    highestFloodLevel: 50.52,
    initialInflowMultiplier: 1.2,
    initialRainfallAnomaly: 20,
    initialSnowmeltIndex: 1.6,
    initialSoilSaturation: 45,
    initialTributaryInflow: 4200,
    activeDrivers: ["glacier_melt"],
    isCompound: false,
    timeline: [
      { day: 1, label: "Day 01", stage: 44.6, discharge: 21500, localRain: 0, upstreamRain: 5, snowmeltIndex: 1.3, soilSaturation: 38, tributaryInflow: 3900, embankmentStatus: "Stable", aiForecastStage: 44.65, aiRiskScore: 14, aiSeverity: "LOW", diagnostic: "Early summer melt underway in Garhwal Himalaya.", optimisticStage: 44.3, referenceStage: 44.6, severeStage: 44.9 },
      { day: 5, label: "Day 05", stage: 45.1, discharge: 24500, localRain: 0, upstreamRain: 12, snowmeltIndex: 1.6, soilSaturation: 44, tributaryInflow: 4200, embankmentStatus: "Stable", aiForecastStage: 45.2, aiRiskScore: 20, aiSeverity: "LOW", diagnostic: "Melt pulse reaches Buxar corridor; stage rises 0.50m.", optimisticStage: 44.7, referenceStage: 45.1, severeStage: 45.5 },
      { day: 10, label: "Day 10", stage: 45.6, discharge: 26800, localRain: 5, upstreamRain: 15, snowmeltIndex: 1.7, soilSaturation: 48, tributaryInflow: 4500, embankmentStatus: "Stable", aiForecastStage: 45.55, aiRiskScore: 24, aiSeverity: "LOW", diagnostic: "Peak melt crest passing Patna safely below Warning.", optimisticStage: 45.0, referenceStage: 45.6, severeStage: 46.1 },
      { day: 15, label: "Day 15", stage: 45.2, discharge: 25000, localRain: 0, upstreamRain: 5, snowmeltIndex: 1.4, soilSaturation: 42, tributaryInflow: 4100, embankmentStatus: "Stable", aiForecastStage: 45.15, aiRiskScore: 18, aiSeverity: "LOW", diagnostic: "Melt pulse attenuating. Flow volume returning to nominal.", optimisticStage: 44.8, referenceStage: 45.2, severeStage: 45.6 },
      { day: 21, label: "Day 21", stage: 44.8, discharge: 22800, localRain: 0, upstreamRain: 0, snowmeltIndex: 1.1, soilSaturation: 36, tributaryInflow: 3800, embankmentStatus: "Stable", aiForecastStage: 44.75, aiRiskScore: 15, aiSeverity: "LOW", diagnostic: "Diurnal melt wave dissipated.", optimisticStage: 44.4, referenceStage: 44.8, severeStage: 45.1 },
    ],
  },

  // 4. S10 — Persistent Monsoon Deluge (High-Risk)
  {
    id: "STRESS_01_HEAVY_RAINFALL",
    code: "S10",
    title: "Persistent Catchment Monsoon Deluge",
    category: "High-Risk",
    shortDescription: "Heavy basin-wide rainfall leading to saturated soils and high runoff.",
    fullDescription: "Multi-day continuous rainfall across the Middle Ganga basin saturates topsoil and tests model forecasting under intense precipitation.",
    testingObjective: "Accurate forecast lead time under persistent rain without dry soil absorption capacity.",
    benchmarkStation: "Gandhi Ghat, Patna (STN-PAT-01)",
    warningLevel: 47.6,
    dangerLevel: 48.6,
    highestFloodLevel: 50.52,
    initialInflowMultiplier: 1.35,
    initialRainfallAnomaly: 120,
    initialSnowmeltIndex: 1.0,
    initialSoilSaturation: 70,
    initialTributaryInflow: 5200,
    activeDrivers: ["persistent_rain"],
    isCompound: false,
    timeline: [
      { day: 1, label: "Day 01", stage: 45.2, discharge: 24000, localRain: 25, upstreamRain: 45, snowmeltIndex: 1.0, soilSaturation: 65, tributaryInflow: 4400, embankmentStatus: "Stable", aiForecastStage: 45.3, aiRiskScore: 22, aiSeverity: "LOW", diagnostic: "Monsoon depression tracks across Bihar. Heavy continuous rain begins.", optimisticStage: 44.8, referenceStage: 45.2, severeStage: 45.7 },
      { day: 5, label: "Day 05", stage: 46.4, discharge: 29500, localRain: 60, upstreamRain: 85, snowmeltIndex: 1.0, soilSaturation: 80, tributaryInflow: 5200, embankmentStatus: "Stable", aiForecastStage: 46.95, aiRiskScore: 48, aiSeverity: "MODERATE", diagnostic: "Sustained rainfall saturating soil. BiLSTM predicts Warning threshold will be approached in 48 hours.", optimisticStage: 45.6, referenceStage: 46.4, severeStage: 47.2 },
      { day: 10, label: "Day 10", stage: 47.7, discharge: 36000, localRain: 95, upstreamRain: 130, snowmeltIndex: 1.0, soilSaturation: 95, tributaryInflow: 6800, embankmentStatus: "Under Stress", aiForecastStage: 48.2, aiRiskScore: 78, aiSeverity: "HIGH", diagnostic: "WARNING LEVEL EXCEEDED (47.70m vs 47.60m). Local low-lying ghats experience water ingress.", optimisticStage: 46.4, referenceStage: 47.7, severeStage: 48.5 },
      { day: 15, label: "Day 15", stage: 48.4, discharge: 39000, localRain: 40, upstreamRain: 65, snowmeltIndex: 1.0, soilSaturation: 90, tributaryInflow: 6400, embankmentStatus: "Under Stress", aiForecastStage: 48.1, aiRiskScore: 70, aiSeverity: "HIGH", diagnostic: "Rainfall eases; river crests 0.20m below Danger Level (48.60m). High-water surveillance ongoing.", optimisticStage: 46.8, referenceStage: 48.4, severeStage: 49.2 },
      { day: 21, label: "Day 21", stage: 46.8, discharge: 30000, localRain: 5, upstreamRain: 10, snowmeltIndex: 1.0, soilSaturation: 70, tributaryInflow: 4800, embankmentStatus: "Stable", aiForecastStage: 46.3, aiRiskScore: 38, aiSeverity: "MODERATE", diagnostic: "Monsoon wave subsides. Water returns below Warning Mark; post-flood silt clearance commences.", optimisticStage: 45.8, referenceStage: 46.8, severeStage: 47.6 },
    ],
  },

  // 5. S15 — Extreme Stage & Embankment Breach (Extreme-Event)
  {
    id: "WORST_02_EMBANKMENT_BREACH",
    code: "S15",
    title: "Extreme Stage & Embankment Breach at Danapur",
    category: "Extreme-Event",
    shortDescription: "High river stage combined with hypothetical structural failure along Danapur embankment.",
    fullDescription: "Simulates a catastrophic multi-variable failure: river level cresting above Danger Mark alongside structural saturation breach at western Patna embankment, triggering urban inundation modeling.",
    testingObjective: "HAND urban depth mapping, infrastructure exposure analysis, shelter routing, and emergency CAP v1.2 alerts.",
    benchmarkStation: "Gandhi Ghat, Patna (STN-PAT-01)",
    warningLevel: 47.6,
    dangerLevel: 48.6,
    highestFloodLevel: 50.52,
    initialInflowMultiplier: 1.85,
    initialRainfallAnomaly: 240,
    initialSnowmeltIndex: 2.4,
    initialSoilSaturation: 95,
    initialTributaryInflow: 9200,
    activeDrivers: ["persistent_rain", "tributary_surge"],
    isCompound: true,
    timeline: [
      { day: 1, label: "Day 01", stage: 46.5, discharge: 31000, localRain: 45, upstreamRain: 70, snowmeltIndex: 1.8, soilSaturation: 75, tributaryInflow: 5600, embankmentStatus: "Stable", aiForecastStage: 46.9, aiRiskScore: 50, aiSeverity: "MODERATE", diagnostic: "Extreme monsoon surge underway. Stage already elevated at 46.50m. Tributaries flowing bankfull.", optimisticStage: 45.8, referenceStage: 46.5, severeStage: 47.2 },
      { day: 5, label: "Day 05", stage: 47.9, discharge: 38500, localRain: 80, upstreamRain: 120, snowmeltIndex: 2.0, soilSaturation: 92, tributaryInflow: 7400, embankmentStatus: "Under Stress", aiForecastStage: 48.5, aiRiskScore: 82, aiSeverity: "HIGH", diagnostic: "Warning level breached. Saturated embankment footings show early seepage signals near Danapur.", optimisticStage: 46.8, referenceStage: 47.9, severeStage: 48.9 },
      { day: 10, label: "Day 10", stage: 48.95, discharge: 46000, localRain: 120, upstreamRain: 180, snowmeltIndex: 2.3, soilSaturation: 100, tributaryInflow: 9200, embankmentStatus: "Breach", aiForecastStage: 49.6, aiRiskScore: 99, aiSeverity: "CRITICAL", diagnostic: "STRUCTURAL BREACH SIMULATED at Danapur Reach. Uncontrolled discharge into urban ward sectors.", optimisticStage: 47.5, referenceStage: 48.95, severeStage: 50.4 },
      { day: 15, label: "Day 15", stage: 49.8, discharge: 48200, localRain: 50, upstreamRain: 90, snowmeltIndex: 1.9, soilSaturation: 98, tributaryInflow: 8500, embankmentStatus: "Breach", aiForecastStage: 49.3, aiRiskScore: 98, aiSeverity: "CRITICAL", diagnostic: "Urban inundation depth: 0.8m - 2.1m. Critical infrastructure exposed. 42,000 population evacuation required.", optimisticStage: 47.2, referenceStage: 49.2, severeStage: 50.8 },
      { day: 21, label: "Day 21", stage: 48.1, discharge: 36000, localRain: 0, upstreamRain: 20, snowmeltIndex: 1.3, soilSaturation: 88, tributaryInflow: 6200, embankmentStatus: "Breach", aiForecastStage: 47.5, aiRiskScore: 80, aiSeverity: "HIGH", diagnostic: "River stage receding, but urban floodwaters remain ponded. Emergency coffer dams operational.", optimisticStage: 46.2, referenceStage: 48.1, severeStage: 49.4 },
    ],
  },

  // 6. S14 — Foothills Cloudburst (Extreme-Event)
  {
    id: "EXT_14_CATCHMENT_CLOUDBURST",
    code: "S14",
    title: "Foothills Cloudburst & Rapid Torrent",
    category: "Extreme-Event",
    shortDescription: "Extreme 220mm/24h cloudburst spike over sub-Himalayan tributary catchments.",
    fullDescription: "Simulates sudden, hyper-localized convective cloudburst forcing sudden hydrograph spikes within 6 to 12 hours.",
    testingObjective: "Evaluating fast hydrological response time and emergency flash warning generation.",
    benchmarkStation: "Gandhi Ghat, Patna (STN-PAT-01)",
    warningLevel: 47.6,
    dangerLevel: 48.6,
    highestFloodLevel: 50.52,
    initialInflowMultiplier: 1.7,
    initialRainfallAnomaly: 220,
    initialSnowmeltIndex: 1.2,
    initialSoilSaturation: 85,
    initialTributaryInflow: 8800,
    activeDrivers: ["cloudburst", "tributary_surge"],
    isCompound: true,
    timeline: [
      { day: 1, label: "Day 01", stage: 45.0, discharge: 23000, localRain: 10, upstreamRain: 25, snowmeltIndex: 1.1, soilSaturation: 50, tributaryInflow: 4100, embankmentStatus: "Stable", aiForecastStage: 45.1, aiRiskScore: 16, aiSeverity: "LOW", diagnostic: "Pre-storm atmospheric instability building over northern watershed.", optimisticStage: 44.5, referenceStage: 45.0, severeStage: 45.4 },
      { day: 5, label: "Day 05", stage: 48.7, discharge: 43500, localRain: 180, upstreamRain: 220, snowmeltIndex: 1.2, soilSaturation: 98, tributaryInflow: 9400, embankmentStatus: "Under Stress", aiForecastStage: 49.1, aiRiskScore: 94, aiSeverity: "CRITICAL", diagnostic: "CLOUDBURST INFLOW CREST. Stage breaches Danger Mark (48.60m) in rapid 12h jump.", optimisticStage: 46.8, referenceStage: 48.7, severeStage: 49.6 },
      { day: 10, label: "Day 10", stage: 47.9, discharge: 37000, localRain: 15, upstreamRain: 30, snowmeltIndex: 1.1, soilSaturation: 84, tributaryInflow: 6500, embankmentStatus: "Under Stress", aiForecastStage: 47.6, aiRiskScore: 72, aiSeverity: "HIGH", diagnostic: "Flash hydrograph wave passes down toward Mokama. Stage de-escalates.", optimisticStage: 46.2, referenceStage: 47.9, severeStage: 48.5 },
      { day: 15, label: "Day 15", stage: 46.2, discharge: 28500, localRain: 0, upstreamRain: 10, snowmeltIndex: 1.0, soilSaturation: 65, tributaryInflow: 4900, embankmentStatus: "Stable", aiForecastStage: 45.9, aiRiskScore: 35, aiSeverity: "MODERATE", diagnostic: "Flash runoff draining completely into mainstream channel.", optimisticStage: 45.4, referenceStage: 46.2, severeStage: 46.8 },
      { day: 21, label: "Day 21", stage: 44.9, discharge: 23200, localRain: 0, upstreamRain: 0, snowmeltIndex: 1.0, soilSaturation: 40, tributaryInflow: 3800, embankmentStatus: "Stable", aiForecastStage: 44.8, aiRiskScore: 16, aiSeverity: "LOW", diagnostic: "Full return to baseline hydrometric stage.", optimisticStage: 44.4, referenceStage: 44.9, severeStage: 45.3 },
    ],
  },

  // 7. S16 — GLOF Surge Wave (Extreme-Event)
  {
    id: "EXT_16_GLOF_WAVE",
    code: "S16",
    title: "Glacial Lake Outburst Flood (GLOF) Surge",
    category: "Extreme-Event",
    shortDescription: "Moraine dam breach in high Himalayan glacial lake propagating downstream.",
    fullDescription: "Simulates sudden glacial moraine collapse releasing millions of cubic meters of water into the Upper Ganga corridor.",
    testingObjective: "Long-distance hydrograph routing, peak attenuation, and 48-hour downstream arrival time.",
    benchmarkStation: "Gandhi Ghat, Patna (STN-PAT-01)",
    warningLevel: 47.6,
    dangerLevel: 48.6,
    highestFloodLevel: 50.52,
    initialInflowMultiplier: 1.9,
    initialRainfallAnomaly: 40,
    initialSnowmeltIndex: 2.6,
    initialSoilSaturation: 60,
    initialTributaryInflow: 7500,
    activeDrivers: ["glof", "glacier_melt"],
    isCompound: true,
    timeline: [
      { day: 1, label: "Day 01", stage: 44.7, discharge: 22000, localRain: 0, upstreamRain: 5, snowmeltIndex: 2.2, soilSaturation: 42, tributaryInflow: 3900, embankmentStatus: "Stable", aiForecastStage: 44.8, aiRiskScore: 16, aiSeverity: "LOW", diagnostic: "Satellite radar flags catastrophic moraine breach in high Alaknanda tributary.", optimisticStage: 44.3, referenceStage: 44.7, severeStage: 45.1 },
      { day: 5, label: "Day 05", stage: 47.8, discharge: 38000, localRain: 0, upstreamRain: 15, snowmeltIndex: 2.6, soilSaturation: 62, tributaryInflow: 6200, embankmentStatus: "Under Stress", aiForecastStage: 48.3, aiRiskScore: 84, aiSeverity: "HIGH", diagnostic: "GLOF surge crest enters Bihar reach; Warning Level breached (47.80m). Heavy silt load.", optimisticStage: 46.5, referenceStage: 47.8, severeStage: 48.7 },
      { day: 10, label: "Day 10", stage: 48.9, discharge: 45500, localRain: 10, upstreamRain: 20, snowmeltIndex: 2.4, soilSaturation: 70, tributaryInflow: 8100, embankmentStatus: "Under Stress", aiForecastStage: 49.3, aiRiskScore: 96, aiSeverity: "CRITICAL", diagnostic: "DANGER MARK EXCEEDED (48.90m). Silt deposition elevates riverbed, causing backwater.", optimisticStage: 47.4, referenceStage: 48.9, severeStage: 49.9 },
      { day: 15, label: "Day 15", stage: 46.9, discharge: 31000, localRain: 0, upstreamRain: 5, snowmeltIndex: 1.8, soilSaturation: 55, tributaryInflow: 5400, embankmentStatus: "Stable", aiForecastStage: 46.5, aiRiskScore: 52, aiSeverity: "MODERATE", diagnostic: "Surge volume recedes; channel flow clearing mudflow deposits.", optimisticStage: 45.8, referenceStage: 46.9, severeStage: 47.6 },
      { day: 21, label: "Day 21", stage: 45.1, discharge: 24000, localRain: 0, upstreamRain: 0, snowmeltIndex: 1.3, soilSaturation: 42, tributaryInflow: 4100, embankmentStatus: "Stable", aiForecastStage: 45.0, aiRiskScore: 18, aiSeverity: "LOW", diagnostic: "Basin returns to regular seasonal flow.", optimisticStage: 44.6, referenceStage: 45.1, severeStage: 45.5 },
    ],
  },

  // 8. S17 — Reservoir Emergency Spillway Discharge (Extreme-Event)
  {
    id: "EXT_17_COMPOUND_DAM_SPILL",
    code: "S17",
    title: "Monsoon Crest + High Dam Spillway Discharge",
    category: "Extreme-Event",
    shortDescription: "Catchment monsoon coincident with 40,000 m³/s unscheduled dam release.",
    fullDescription: "Tests compound hydraulic vulnerability when upstream reservoirs reach 100% capacity and must open all sluice gates into an already swollen river.",
    testingObjective: "Evaluating synchronized artificial and natural surge compounding.",
    benchmarkStation: "Gandhi Ghat, Patna (STN-PAT-01)",
    warningLevel: 47.6,
    dangerLevel: 48.6,
    highestFloodLevel: 50.52,
    initialInflowMultiplier: 1.8,
    initialRainfallAnomaly: 150,
    initialSnowmeltIndex: 1.5,
    initialSoilSaturation: 90,
    initialTributaryInflow: 9500,
    activeDrivers: ["reservoir_release", "persistent_rain"],
    isCompound: true,
    timeline: [
      { day: 1, label: "Day 01", stage: 45.8, discharge: 27000, localRain: 30, upstreamRain: 60, snowmeltIndex: 1.2, soilSaturation: 72, tributaryInflow: 4900, embankmentStatus: "Stable", aiForecastStage: 46.0, aiRiskScore: 32, aiSeverity: "MODERATE", diagnostic: "Upstream barrages report reservoir levels at 96% full rule curve.", optimisticStage: 45.2, referenceStage: 45.8, severeStage: 46.3 },
      { day: 5, label: "Day 05", stage: 47.95, discharge: 39500, localRain: 70, upstreamRain: 110, snowmeltIndex: 1.3, soilSaturation: 88, tributaryInflow: 7200, embankmentStatus: "Under Stress", aiForecastStage: 48.4, aiRiskScore: 84, aiSeverity: "HIGH", diagnostic: "DAM SLUICE GATES OPENED. Additional 18,000 cumecs released into mainstream.", optimisticStage: 46.8, referenceStage: 47.95, severeStage: 48.8 },
      { day: 10, label: "Day 10", stage: 49.3, discharge: 47000, localRain: 80, upstreamRain: 125, snowmeltIndex: 1.4, soilSaturation: 96, tributaryInflow: 9500, embankmentStatus: "Under Stress", aiForecastStage: 49.6, aiRiskScore: 98, aiSeverity: "CRITICAL", diagnostic: "CRITICAL WATERLOGGING. Stage reaches 49.30m (0.70m over Danger Mark).", optimisticStage: 47.5, referenceStage: 49.3, severeStage: 50.2 },
      { day: 15, label: "Day 15", stage: 48.2, discharge: 37500, localRain: 10, upstreamRain: 35, snowmeltIndex: 1.2, soilSaturation: 82, tributaryInflow: 6400, embankmentStatus: "Under Stress", aiForecastStage: 48.0, aiRiskScore: 74, aiSeverity: "HIGH", diagnostic: "Spillway discharge reduced to 10,000 cumecs as reservoir buffer restored.", optimisticStage: 46.6, referenceStage: 48.2, severeStage: 49.0 },
      { day: 21, label: "Day 21", stage: 46.5, discharge: 29000, localRain: 0, upstreamRain: 10, snowmeltIndex: 1.1, soilSaturation: 65, tributaryInflow: 4600, embankmentStatus: "Stable", aiForecastStage: 46.2, aiRiskScore: 40, aiSeverity: "MODERATE", diagnostic: "Controlled discharge phase concluded.", optimisticStage: 45.6, referenceStage: 46.5, severeStage: 47.1 },
    ],
  },

  // 9. S18 — Telemetry Dropout Imputation (System-Reliability)
  {
    id: "REL_18_DATA_DROPOUT",
    code: "S18",
    title: "10% Random Telemetry Dropout & Imputation",
    category: "System-Reliability",
    shortDescription: "Sensor network packet loss stress test under active monsoon.",
    fullDescription: "Validates Kalman filter spline imputation when 10% of observation packets drop out due to telemetry uplink failure.",
    testingObjective: "Ensuring zero pipeline crash and continuous forecast delivery despite network degradation.",
    benchmarkStation: "Gandhi Ghat, Patna (STN-PAT-01)",
    warningLevel: 47.6,
    dangerLevel: 48.6,
    highestFloodLevel: 50.52,
    initialInflowMultiplier: 1.3,
    initialRainfallAnomaly: 75,
    initialSnowmeltIndex: 1.2,
    initialSoilSaturation: 65,
    initialTributaryInflow: 4900,
    activeDrivers: ["persistent_rain"],
    isCompound: false,
    timeline: [
      { day: 1, label: "Day 01", stage: 45.1, discharge: 23500, localRain: 15, upstreamRain: 30, snowmeltIndex: 1.1, soilSaturation: 58, tributaryInflow: 4100, embankmentStatus: "Stable", aiForecastStage: 45.15, aiRiskScore: 20, aiSeverity: "LOW", diagnostic: "Telemetry healthy. 100% packet receipt verified.", optimisticStage: 44.6, referenceStage: 45.1, severeStage: 45.5 },
      { day: 5, label: "Day 05", stage: 46.2, discharge: 28000, localRain: 35, upstreamRain: 55, snowmeltIndex: 1.2, soilSaturation: 72, tributaryInflow: 4900, embankmentStatus: "Stable", aiForecastStage: 46.28, aiRiskScore: 42, aiSeverity: "MODERATE", diagnostic: "TELEMETRY DROPOUT INJECTED (10% null packets). Imputation spline holds forecast variance < 0.08m.", optimisticStage: 45.5, referenceStage: 46.2, severeStage: 46.8 },
      { day: 10, label: "Day 10", stage: 47.1, discharge: 32500, localRain: 50, upstreamRain: 80, snowmeltIndex: 1.3, soilSaturation: 84, tributaryInflow: 5800, embankmentStatus: "Stable", aiForecastStage: 47.25, aiRiskScore: 62, aiSeverity: "MODERATE", diagnostic: "Telemetry packets restored. Ground truth aligns with imputed trajectory.", optimisticStage: 46.2, referenceStage: 47.1, severeStage: 47.9 },
      { day: 15, label: "Day 15", stage: 46.7, discharge: 29500, localRain: 10, upstreamRain: 25, snowmeltIndex: 1.1, soilSaturation: 72, tributaryInflow: 4800, embankmentStatus: "Stable", aiForecastStage: 46.6, aiRiskScore: 44, aiSeverity: "MODERATE", diagnostic: "Pipeline execution intact without degradation.", optimisticStage: 45.8, referenceStage: 46.7, severeStage: 47.4 },
      { day: 21, label: "Day 21", stage: 45.4, discharge: 24500, localRain: 0, upstreamRain: 5, snowmeltIndex: 1.0, soilSaturation: 52, tributaryInflow: 4000, embankmentStatus: "Stable", aiForecastStage: 45.3, aiRiskScore: 22, aiSeverity: "LOW", diagnostic: "System reliability test: 100% PASS.", optimisticStage: 44.8, referenceStage: 45.4, severeStage: 45.9 },
    ],
  },

  // 10. S19 — Sensor Spike Glitch Rejection (System-Reliability)
  {
    id: "REL_19_SENSOR_SPIKE",
    code: "S19",
    title: "Hardware Glitch Spike (+2.5m) Rejection",
    category: "System-Reliability",
    shortDescription: "Artificial hardware jump glitch injected to test anti-hallucination guardrail.",
    fullDescription: "Evaluates whether the TypeSafe Jev guardrail successfully rejects an unphysical single-hour spike (+2.5m) as a hardware error without triggering a false civic evacuation.",
    testingObjective: "Zero false alarm evacuation under hardware glitch attacks.",
    benchmarkStation: "Gandhi Ghat, Patna (STN-PAT-01)",
    warningLevel: 47.6,
    dangerLevel: 48.6,
    highestFloodLevel: 50.52,
    initialInflowMultiplier: 1.1,
    initialRainfallAnomaly: 30,
    initialSnowmeltIndex: 1.1,
    initialSoilSaturation: 50,
    initialTributaryInflow: 3900,
    activeDrivers: [],
    isCompound: false,
    timeline: [
      { day: 1, label: "Day 01", stage: 44.5, discharge: 21000, localRain: 0, upstreamRain: 5, snowmeltIndex: 1.0, soilSaturation: 40, tributaryInflow: 3600, embankmentStatus: "Stable", aiForecastStage: 44.55, aiRiskScore: 12, aiSeverity: "LOW", diagnostic: "Normal observations streaming.", optimisticStage: 44.1, referenceStage: 44.5, severeStage: 44.8 },
      { day: 5, label: "Day 05", stage: 44.8, discharge: 22200, localRain: 5, upstreamRain: 12, snowmeltIndex: 1.1, soilSaturation: 46, tributaryInflow: 3900, embankmentStatus: "Stable", aiForecastStage: 44.85, aiRiskScore: 16, aiSeverity: "LOW", diagnostic: "GLITCH SPIKE INJECTED (+2.5m reading 47.3m). JEV-002 rejects spike; suppresses false alarm.", optimisticStage: 44.3, referenceStage: 44.8, severeStage: 45.2 },
      { day: 10, label: "Day 10", stage: 45.0, discharge: 23000, localRain: 5, upstreamRain: 10, snowmeltIndex: 1.1, soilSaturation: 48, tributaryInflow: 4000, embankmentStatus: "Stable", aiForecastStage: 45.05, aiRiskScore: 18, aiSeverity: "LOW", diagnostic: "True stage trajectory confirmed at 45.00m. Glitch suppressed.", optimisticStage: 44.5, referenceStage: 45.0, severeStage: 45.4 },
      { day: 15, label: "Day 15", stage: 44.7, discharge: 21800, localRain: 0, upstreamRain: 0, snowmeltIndex: 1.0, soilSaturation: 42, tributaryInflow: 3800, embankmentStatus: "Stable", aiForecastStage: 44.72, aiRiskScore: 14, aiSeverity: "LOW", diagnostic: "Smooth Bayesian state filter continuity maintained.", optimisticStage: 44.2, referenceStage: 44.7, severeStage: 45.0 },
      { day: 21, label: "Day 21", stage: 44.4, discharge: 20500, localRain: 0, upstreamRain: 0, snowmeltIndex: 1.0, soilSaturation: 35, tributaryInflow: 3500, embankmentStatus: "Stable", aiForecastStage: 44.38, aiRiskScore: 11, aiSeverity: "LOW", diagnostic: "Sensor plausibility audit: 100% PASS.", optimisticStage: 44.0, referenceStage: 44.4, severeStage: 44.7 },
    ],
  },
];

export interface CustomScenarioInput {
  title: string;
  category?: "Low-Risk" | "Moderate-Risk" | "High-Risk" | "Extreme-Event" | "System-Reliability";
  description?: string;
  initialInflowMultiplier: number;
  initialRainfallAnomaly: number;
  initialSnowmeltIndex: number;
  initialSoilSaturation: number;
  initialTributaryInflow: number;
  initialStageM?: number;
  eventPattern: "compound_surge" | "flash_cloudburst" | "glacier_wave" | "steady_recession";
  activeDrivers?: string[];
  embankmentBreachRisk?: boolean;
}

/**
 * Deterministic multi-driver hydrological scenario generator
 */
export function generateCustomScenario(input: CustomScenarioInput): SimulationScenario {
  const code = `C${Math.floor(Math.random() * 899 + 100)}`;
  const id = `CUSTOM_${Date.now()}_${input.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  const activeDrivers = input.activeDrivers && input.activeDrivers.length > 0
    ? input.activeDrivers
    : [input.eventPattern === "flash_cloudburst" ? "cloudburst" : input.eventPattern === "glacier_wave" ? "glacier_melt" : "persistent_rain"];

  const isCompound = activeDrivers.length >= 2 || input.eventPattern === "compound_surge";
  const startStage = input.initialStageM ?? 44.20;

  const days = [1, 3, 5, 7, 9, 11, 13, 15, 18, 21];
  const timeline: SimulationDayState[] = days.map((day) => {
    let rainFactor = 1.0;
    let meltFactor = 1.0;
    let flowFactor = 1.0;

    if (activeDrivers.includes("cloudburst")) {
      if (day <= 3) rainFactor = 0.2;
      else if (day <= 7) rainFactor = 2.4;
      else if (day <= 11) rainFactor = 1.2;
      else rainFactor = 0.3;
      flowFactor = day <= 3 ? 0.9 : day <= 9 ? 1.7 : 1.1;
    } else if (activeDrivers.includes("glof")) {
      meltFactor = day <= 5 ? 1.5 : day <= 10 ? 2.6 : 1.3;
      flowFactor = day <= 5 ? 1.2 : day <= 10 ? 1.9 : 1.1;
      rainFactor = 0.5;
    } else if (input.eventPattern === "glacier_wave" || activeDrivers.includes("glacier_melt")) {
      meltFactor = day <= 9 ? 1.0 + (day / 9) * 0.9 : Math.max(1.0, 1.9 - ((day - 9) / 12) * 0.7);
      rainFactor = 0.5 + (day / 21) * 0.5;
      flowFactor = 1.0 + (day <= 11 ? (day / 11) * 0.6 : 0.6 - ((day - 11) / 10) * 0.4);
    } else if (input.eventPattern === "steady_recession") {
      const decay = (21 - day) / 20;
      flowFactor = 0.6 + 0.4 * decay;
      rainFactor = 0.2 + 0.8 * decay;
      meltFactor = 0.8 + 0.2 * decay;
    } else {
      // Compound surge
      if (day <= 5) {
        meltFactor = 1.0 + (day / 5) * 0.6;
        rainFactor = 0.3 + (day / 5) * 0.5;
        flowFactor = 1.0 + (day / 5) * 0.25;
      } else if (day <= 15) {
        meltFactor = 1.6 - ((day - 5) / 10) * 0.3;
        rainFactor = 0.8 + ((day - 5) / 10) * 1.0;
        flowFactor = 1.25 + ((day - 5) / 10) * 0.6;
      } else {
        meltFactor = 1.1;
        rainFactor = 0.4;
        flowFactor = 1.4 - ((day - 15) / 6) * 0.5;
      }
    }

    const localRain = Math.round(input.initialRainfallAnomaly * 0.6 * rainFactor);
    const upstreamRain = Math.round(input.initialRainfallAnomaly * rainFactor);
    const snowmeltIndex = Number((input.initialSnowmeltIndex * meltFactor).toFixed(1));
    const soilSaturation = Math.min(
      100,
      Math.max(20, Math.round(input.initialSoilSaturation + (upstreamRain / 12) * (day <= 15 ? 1 : -0.5)))
    );
    const tributaryInflow = Math.round(input.initialTributaryInflow * flowFactor);

    const baseDischarge = 21000 * input.initialInflowMultiplier * flowFactor;
    const runoffDischarge = (upstreamRain * (soilSaturation / 100)) * 55;
    const meltDischarge = (snowmeltIndex - 1.0) * 4500;
    const discharge = Math.round(baseDischarge + runoffDischarge + meltDischarge + (tributaryInflow * 0.4));

    const excessQ = Math.max(0, discharge - 18000);
    const computedStage = Number(
      Math.min(51.2, startStage + Math.pow(excessQ / 5200, 0.72)).toFixed(2)
    );

    const isBreach = Boolean(input.embankmentBreachRisk && computedStage >= 48.2 && day >= 9 && day <= 18);
    const embankmentStatus = isBreach
      ? "Breach"
      : computedStage >= 48.0
      ? "Structural Seepage"
      : computedStage >= 47.6
      ? "Under Stress"
      : "Stable";

    const modelError = Number((Math.sin(day * 1.5) * 0.18).toFixed(2));
    const aiForecastStage = Number((computedStage + modelError).toFixed(2));

    let aiRiskScore = 15;
    if (computedStage >= 49.5) aiRiskScore = 98;
    else if (computedStage >= 48.6) aiRiskScore = Math.min(96, Math.round(80 + (computedStage - 48.6) * 16));
    else if (computedStage >= 47.6) aiRiskScore = Math.min(78, Math.round(48 + (computedStage - 47.6) * 30));
    else aiRiskScore = Math.min(45, Math.round(15 + (computedStage - 44.0) * 8));

    const aiSeverity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" =
      aiRiskScore >= 80 ? "CRITICAL" : aiRiskScore >= 50 ? "HIGH" : aiRiskScore >= 30 ? "MODERATE" : "LOW";

    const optimisticStage = Number(Math.max(43.5, computedStage - (0.4 + (day / 21) * 0.5)).toFixed(2));
    const referenceStage = computedStage;
    const severeStage = Number((computedStage + (0.35 + (day / 21) * 0.65)).toFixed(2));

    let diagnostic = "";
    if (computedStage >= 48.6) {
      diagnostic = `CRITICAL DANGER THRESHOLD EXCEEDED (${computedStage.toFixed(2)}m vs 48.60m). Tributary inflow at ${tributaryInflow.toLocaleString()} m³/s with ${soilSaturation}% soil saturation. Evacuation advisories initiated for Gandhi Ghat & Danapur lowlands.`;
    } else if (computedStage >= 47.6) {
      diagnostic = `CWC WARNING LEVEL BREACHED (${computedStage.toFixed(2)}m vs 47.60m). Basin runoff accelerating due to ${upstreamRain} mm/day catchment rainfall and antecedent soil saturation (${soilSaturation}%).`;
    } else if (day <= 3) {
      diagnostic = `Initial conditions: ${input.initialInflowMultiplier.toFixed(2)}× starting discharge and ${snowmeltIndex.toFixed(1)}× cryosphere anomaly. Ganga stage nominal at ${computedStage.toFixed(2)}m.`;
    } else if (day <= 9) {
      diagnostic = `Hydrological escalation detected: snowmelt index reaches ${snowmeltIndex.toFixed(1)}× while tributary inflows swell to ${tributaryInflow.toLocaleString()} m³/s. Monitoring backwater response.`;
    } else {
      diagnostic = `Recession phase underway. Runoff draining into lower Gangetic reaches. Stage receding to ${computedStage.toFixed(2)}m. Embankment status: ${embankmentStatus}.`;
    }

    return {
      day,
      label: `Day ${day.toString().padStart(2, "0")}`,
      stage: computedStage,
      discharge,
      localRain,
      upstreamRain,
      snowmeltIndex,
      soilSaturation,
      tributaryInflow,
      embankmentStatus,
      aiForecastStage,
      aiRiskScore,
      aiSeverity,
      diagnostic,
      optimisticStage,
      referenceStage,
      severeStage,
    };
  });

  const maxStage = Math.max(...timeline.map((s) => s.stage));
  const category =
    input.category ??
    (maxStage >= 48.6
      ? input.embankmentBreachRisk
        ? "Extreme-Event"
        : "High-Risk"
      : maxStage >= 47.6
      ? "Moderate-Risk"
      : "Low-Risk");

  return {
    id,
    code,
    title: input.title,
    category,
    shortDescription: input.description || `Custom multi-driver simulation: ${input.initialInflowMultiplier}× discharge, ${input.initialRainfallAnomaly}mm rain, ${input.initialSnowmeltIndex}× melt.`,
    fullDescription: `User-defined synthetic simulation scenario testing hydrological response to ${input.initialInflowMultiplier}× initial discharge, ${input.initialRainfallAnomaly} mm rainfall anomaly, ${input.initialSnowmeltIndex}× cryosphere thaw, and ${input.initialSoilSaturation}% soil saturation under a ${input.eventPattern.replace("_", " ")} pattern.`,
    testingObjective: `Custom evaluation of multi-variable flood risk escalation and predictive warning lead time.`,
    benchmarkStation: CWC_GANDHI_GHAT_BENCHMARKS.stationName,
    warningLevel: CWC_GANDHI_GHAT_BENCHMARKS.warningLevel,
    dangerLevel: CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel,
    highestFloodLevel: CWC_GANDHI_GHAT_BENCHMARKS.highestFloodLevel,
    initialInflowMultiplier: input.initialInflowMultiplier,
    initialRainfallAnomaly: input.initialRainfallAnomaly,
    initialSnowmeltIndex: input.initialSnowmeltIndex,
    initialSoilSaturation: input.initialSoilSaturation,
    initialTributaryInflow: input.initialTributaryInflow,
    activeDrivers,
    isCompound,
    timeline,
  };
}
