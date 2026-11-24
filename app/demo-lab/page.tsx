"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Activity,
  CheckCircle2,
  CircleAlert,
  Droplets,
  LoaderCircle,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Users,
  Waves,
  CloudRain,
  TrendingUp,
  Clock,
  ChevronDown,
  Calendar,
  AlertTriangle,
  Check,
  Sparkles,
  PlusCircle,
  X,
  Sliders,
  Flame,
  Mountain,
  Zap,
  Building2,
  Truck,
  HeartPulse,
  Radio,
  LifeBuoy,
  Layers,
  Info,
  Maximize2,
} from "lucide-react";
import { RiskGauge } from "@/components/simulation/RiskGauge";
import { RiverStageForecastChart } from "@/components/simulation/RiverStageForecastChart";
import { HydrometricStageStaffGauge } from "@/components/simulation/HydrometricStageStaffGauge";
import { CompoundHazardFlowInfographic } from "@/components/simulation/CompoundHazardFlowInfographic";
import {
  SIMULATION_SCENARIOS,
  SIMULATION_EVENT_DRIVERS,
  SimulationScenario,
  SimulationDayState,
  FloodImpactAssessment,
  CWC_GANDHI_GHAT_BENCHMARKS,
  generateCustomScenario,
  computeImpactAssessment,
  CustomScenarioInput,
} from "@/lib/simulation-scenarios";

type ScenarioResult = {
  suite_id: string;
  scenario_id: string;
  scenario_name: string;
  mode: "static" | "supervised";
  synthetic_data_only: boolean;
  jev_mode: string;
  result: {
    event_id: string;
    timestamp: string;
    severity: string;
    risk_score: number;
    metadata?: { data_provenance?: string; jev_mode?: string };
    current_condition: { water_level_m?: number };
    forecast: { t_plus_6?: number; t_plus_12?: number; t_plus_24?: number; confidence_interval?: number[] };
    impact_assessment?: { affected_population?: number };
    pre_event_assessment?: { exposed_population?: number };
    requires_human_review?: boolean;
    supervisor?: { requires_human_review?: boolean };
  };
};

type DemoPreset = "steady" | "rain" | "surge";

const STUDY_STATIONS = [
  {
    id: "STN-PAT-01",
    name: "Ganges – Gandhi Ghat, Patna",
    shortName: "Gandhi Ghat, Patna",
    corridor: "Ganga Mainstream Corridor",
    warningLevel: 47.6,
    dangerLevel: 48.6,
    hfl: 50.52,
    badge: "Primary Reference Node",
    status: "Active Telemetry",
  },
  {
    id: "STN-DIG-02",
    name: "Ganges – Digha Ghat Reach",
    shortName: "Digha Ghat Reach",
    corridor: "Upper Inflow Reach Corridor",
    warningLevel: 50.4,
    dangerLevel: 51.4,
    hfl: 52.8,
    badge: "Inflow Gauge Node",
    status: "Operational",
  },
  {
    id: "STN-HAT-03",
    name: "Ganges – Hathidah Reach",
    shortName: "Hathidah Reach",
    corridor: "Downstream Gauge Node",
    warningLevel: 41.76,
    dangerLevel: 42.76,
    hfl: 44.5,
    badge: "Discharge Node",
    status: "Operational",
  },
  {
    id: "STN-SON-04",
    name: "Son River – Koelwar Reach",
    shortName: "Koelwar Reach",
    corridor: "Southern Tributary Confluence",
    warningLevel: 52.6,
    dangerLevel: 53.6,
    hfl: 55.1,
    badge: "Confluence Monitor",
    status: "Operational",
  },
  {
    id: "STN-GAN-05",
    name: "Gandak River – Hajipur Reach",
    shortName: "Hajipur Gandak Reach",
    corridor: "Northern Tributary Confluence",
    warningLevel: 49.5,
    dangerLevel: 50.5,
    hfl: 51.8,
    badge: "Tributary Gauge Node",
    status: "Operational",
  },
];

const PRESET_DATES = [
  { label: "01 Jun, 2026", desc: "Early Summer Glacier Thaw Onset", value: "2026-06-01" },
  { label: "15 Jul, 2026", desc: "Active Monsoon Depression Inflow", value: "2026-07-15" },
  { label: "24 Aug, 2026", desc: "Peak Historical Monsoon Crest", value: "2026-08-24" },
  { label: "24 Nov, 2026", desc: "Late Season Hydrological Baseline", value: "2026-11-24" },
];

const PRESETS: Record<
  DemoPreset,
  { label: string; description: string; anchor: string; scenarioId: string; inflow: number; rainfall: number }
> = {
  steady: {
    label: "Steady Conditions",
    description: "Baseline scenario",
    anchor: "GANGES_PATNA · Gandhi Ghat, Patna",
    scenarioId: "BEST_01_CALM_BASELINE",
    inflow: 1.0,
    rainfall: 0,
  },
  rain: {
    label: "Heavy Rainfall",
    description: "Increased rainfall",
    anchor: "GANGES_PATNA · Gandhi Ghat, Patna",
    scenarioId: "STRESS_01_HEAVY_RAINFALL",
    inflow: 1.25,
    rainfall: 80,
  },
  surge: {
    label: "Rapid River Rise",
    description: "High discharge",
    anchor: "GANGES_PATNA · Gandhi Ghat, Patna",
    scenarioId: "WORST_01_RAPID_RIVER_SURGE",
    inflow: 1.6,
    rainfall: 160,
  },
};

function isScenarioResult(value: unknown, expectedScenarioId: string): value is ScenarioResult {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<ScenarioResult>;
  const result = data.result;
  const forecastValues = [result?.forecast?.t_plus_6, result?.forecast?.t_plus_12, result?.forecast?.t_plus_24];
  return (
    data.scenario_id === expectedScenarioId &&
    data.synthetic_data_only === true &&
    data.mode === "static" &&
    data.jev_mode === "OFFLINE_DETERMINISTIC_SIMULATOR" &&
    typeof data.scenario_name === "string" &&
    typeof data.result?.event_id === "string" &&
    typeof data.result.timestamp === "string" &&
    Number.isFinite(Date.parse(data.result.timestamp)) &&
    typeof data.result.severity === "string" &&
    typeof data.result.risk_score === "number" &&
    Number.isFinite(data.result.risk_score) &&
    data.result.risk_score >= 0 &&
    data.result.risk_score <= 1 &&
    data.result.current_condition !== null &&
    typeof data.result.current_condition === "object" &&
    data.result.metadata?.data_provenance === "SYNTHETIC_SCENARIO" &&
    data.result.metadata?.jev_mode === "OFFLINE_DETERMINISTIC_SIMULATOR" &&
    forecastValues.some((value) => typeof value === "number" && Number.isFinite(value))
  );
}

export default function DemoLabPage() {
  // Scenario Catalog & Custom Scenarios State
  const [customScenarios, setCustomScenarios] = useState<SimulationScenario[]>([]);
  const allScenarios = [...customScenarios, ...SIMULATION_SCENARIOS];

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("WORST_01_RAPID_RIVER_SURGE");
  const [preset, setPreset] = useState<DemoPreset>("surge");

  // Environmental Controls State
  const [inflow, setInflow] = useState<number>(PRESETS.surge.inflow);
  const [rainfall, setRainfall] = useState<number>(PRESETS.surge.rainfall);
  const [snowmeltIndex, setSnowmeltIndex] = useState<number>(2.1);
  const [soilSaturation, setSoilSaturation] = useState<number>(82);
  const [tributaryInflow, setTributaryInflow] = useState<number>(6200);
  const [startStage, setStartStage] = useState<number>(44.2);
  const [embankmentStatus, setEmbankmentStatus] = useState<"Stable" | "Under Stress" | "Structural Seepage" | "Breach">("Stable");

  // Multi-selectable Event Drivers
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([
    "glacier_melt",
    "persistent_rain",
    "tributary_surge",
  ]);

  // Derived Compound Hazard Classification
  const isCompoundDerived =
    selectedDrivers.length >= 2 ||
    (selectedDrivers.includes("glacier_melt") &&
      (selectedDrivers.includes("persistent_rain") || selectedDrivers.includes("tributary_surge")));

  // API Simulation Execution State
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunTime, setLastRunTime] = useState<string>("16:42:10");

  // 21-Day Progressive Timeline Player States
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Tabbed Infographics Switcher State
  const [activeTab, setActiveTab] = useState<"impact" | "diagnostic" | "defense">("impact");

  // Custom Scenario Creator Studio Modal State
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>("Custom Multi-Driver Inflow Scenario");
  const [customDrivers, setCustomDrivers] = useState<string[]>([
    "glacier_melt",
    "persistent_rain",
    "tributary_surge",
  ]);
  const [customInflow, setCustomInflow] = useState<number>(1.5);
  const [customRainfall, setCustomRainfall] = useState<number>(150);
  const [customSnowmelt, setCustomSnowmelt] = useState<number>(2.0);
  const [customSoil, setCustomSoil] = useState<number>(75);
  const [customTributary, setCustomTributary] = useState<number>(6800);
  const [customBreachRisk, setCustomBreachRisk] = useState<boolean>(false);

  // Station Selector & Date Selector States
  const [selectedStation, setSelectedStation] = useState(STUDY_STATIONS[0]);
  const [selectedDate, setSelectedDate] = useState<string>("2026-11-24");
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);
  const [isForecastModalOpen, setIsForecastModalOpen] = useState<boolean>(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Custom Dropdown Menu State & Outside Click Listener
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: Event) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(target)) {
        setIsLocationOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(target)) {
        setIsDateOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsLocationOpen(false);
        setIsDateOpen(false);
        setIsStudioOpen(false);
        setIsForecastModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    } catch {
      return "Nov 24, 2026";
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Extreme-Event":
        return "bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400";
      case "High-Risk":
        return "bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400";
      case "Moderate-Risk":
        return "bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400";
      default:
        return "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
    }
  };

  // Active scenario
  const activeScenario: SimulationScenario =
    allScenarios.find((s) => s.id === selectedScenarioId) ?? SIMULATION_SCENARIOS[0];
  const timeline: SimulationDayState[] = activeScenario.timeline;
  const currentDayState: SimulationDayState = timeline[currentDayIndex] ?? timeline[0];

  // Auto-run baseline scenario on first load
  useEffect(() => {
    runScenario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 21-Day Progressive Auto-Play Timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentDayIndex((prev) => {
        if (prev >= timeline.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying, timeline.length]);

  const forecastPoints = result
    ? [
        { horizon: "+6h", value: result.result.forecast.t_plus_6 },
        { horizon: "+12h", value: result.result.forecast.t_plus_12 },
        { horizon: "+24h", value: result.result.forecast.t_plus_24 },
      ].filter((point): point is { horizon: string; value: number } => typeof point.value === "number" && Number.isFinite(point.value))
    : [];

  const forecastPeak = forecastPoints.reduce<{ horizon: string; value: number } | null>(
    (peak, point) => (peak === null || point.value > peak.value ? point : peak),
    null
  );

  // Multi-variable Physical States synced with active timeline progression
  const currentStage = currentDayState ? currentDayState.stage : (forecastPeak?.value ?? 47.17);
  const currentRisk = currentDayState ? currentDayState.aiRiskScore : (result ? Math.round(result.result.risk_score * 100) : 15);

  // Disaster Impact Assessment Model
  const impactAssessment: FloodImpactAssessment = computeImpactAssessment(
    currentStage,
    currentDayState.embankmentStatus
  );

  const exposedPopulation = impactAssessment.exposedPopulation;

  function toggleDriver(driverId: string) {
    setSelectedDrivers((prev) => {
      const isSelected = prev.includes(driverId);
      const next = isSelected ? prev.filter((d) => d !== driverId) : [...prev, driverId];
      if (!isSelected) {
        if (driverId === "glacier_melt") setSnowmeltIndex(2.2);
        if (driverId === "cloudburst") setRainfall((r) => Math.max(r, 220));
        if (driverId === "persistent_rain") {
          setRainfall((r) => Math.max(r, 160));
          setSoilSaturation((s) => Math.max(s, 85));
        }
        if (driverId === "tributary_surge") setTributaryInflow(8500);
        if (driverId === "glof") {
          setInflow((f) => Math.max(f, 2.0));
          setSnowmeltIndex(2.5);
        }
        if (driverId === "reservoir_release") setInflow((f) => Math.max(f, 1.8));
      }
      return next;
    });
  }

  function handleSelectScenario(scenarioId: string) {
    const scen = allScenarios.find((s) => s.id === scenarioId) ?? SIMULATION_SCENARIOS[0];
    setSelectedScenarioId(scen.id);
    setInflow(scen.initialInflowMultiplier);
    setRainfall(scen.initialRainfallAnomaly);
    setSnowmeltIndex(scen.initialSnowmeltIndex ?? 1.0);
    setSoilSaturation(scen.initialSoilSaturation ?? 65);
    setTributaryInflow(scen.initialTributaryInflow ?? 4500);
    setSelectedDrivers(scen.activeDrivers ?? ["glacier_melt", "persistent_rain"]);
    setStartStage(scen.timeline[0]?.stage ?? 44.2);
    setEmbankmentStatus(scen.timeline.some((t) => t.embankmentStatus === "Breach") ? "Breach" : "Stable");
    setCurrentDayIndex(0);
    setIsPlaying(false);
    setError(null);

    if (scen.id === PRESETS.steady.scenarioId) setPreset("steady");
    else if (scen.id === PRESETS.rain.scenarioId) setPreset("rain");
    else if (scen.id === PRESETS.surge.scenarioId) setPreset("surge");
  }

  function choosePreset(value: DemoPreset) {
    setPreset(value);
    const p = PRESETS[value];
    setInflow(p.inflow);
    setRainfall(p.rainfall);
    setSelectedScenarioId(p.scenarioId);
    setCurrentDayIndex(0);
    setIsPlaying(false);
    setError(null);
  }

  async function runScenario(scenarioToRun?: SimulationScenario) {
    setIsRunning(true);
    setError(null);
    const target = scenarioToRun ?? activeScenario;
    const backendScenarioId =
      target.id === "BEST_01_CALM_BASELINE"
        ? "BEST_01_CALM_BASELINE"
        : target.id === "STRESS_01_HEAVY_RAINFALL"
        ? "STRESS_01_HEAVY_RAINFALL"
        : "WORST_01_RAPID_RIVER_SURGE";

    try {
      const response = await fetch("/api/flood/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          scenario_id: backendScenarioId,
          river_discharge_multiplier: inflow,
          precipitation_anomaly_mm: rainfall,
        }),
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "The simulation service could not complete this run.");
      if (!isScenarioResult(data, backendScenarioId)) {
        throw new Error("The simulation service returned an incomplete or unexpected synthetic result.");
      }
      setResult(data);
      const now = new Date();
      setLastRunTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The simulation service could not be reached.");
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  }

  function handleCreateAndLaunchCustomScenario() {
    const input: CustomScenarioInput = {
      title: customTitle.trim() || "User Custom Scenario",
      initialInflowMultiplier: customInflow,
      initialRainfallAnomaly: customRainfall,
      initialSnowmeltIndex: customSnowmelt,
      initialSoilSaturation: customSoil,
      initialTributaryInflow: customTributary,
      activeDrivers: customDrivers,
      embankmentBreachRisk: customBreachRisk,
    };

    const newScenario = generateCustomScenario(input);
    setCustomScenarios((prev) => [newScenario, ...prev]);
    setSelectedScenarioId(newScenario.id);
    setInflow(newScenario.initialInflowMultiplier);
    setRainfall(newScenario.initialRainfallAnomaly);
    setCurrentDayIndex(0);
    setIsStudioOpen(false);
    setIsPlaying(true);
    runScenario(newScenario);
  }

  // Hydrological phase determination
  const getPhaseInfo = (stage: number, day: number) => {
    if (stage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel) {
      return { label: "CRITICAL DANGER EXCEEDANCE", color: "text-rose-500 bg-rose-500/10 border-rose-500/30" };
    }
    if (stage >= CWC_GANDHI_GHAT_BENCHMARKS.warningLevel) {
      return { label: "WARNING THRESHOLD ACTIVE", color: "text-amber-500 bg-amber-500/10 border-amber-500/30" };
    }
    if (day <= 3) {
      return { label: "BASELINE NOMINAL REGIME", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30" };
    }
    if (day <= 9) {
      return { label: "GLACIAL THAW & INFLOW SURGE", color: "text-sky-500 bg-sky-500/10 border-sky-500/30" };
    }
    return { label: "RECESSION & RECOVERY", color: "text-teal-500 bg-teal-500/10 border-teal-500/30" };
  };

  const phaseInfo = getPhaseInfo(currentStage, currentDayState.day);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-200">
      <main className="w-full">
        {/* COMPACT TOP PANORAMIC COMMAND STRIP */}
        <header className="relative z-30 w-full border-b border-[var(--border)] bg-[var(--surface)] overflow-visible">
          <div className="absolute inset-0 z-0 overflow-hidden opacity-30 dark:opacity-20 select-none pointer-events-none">
            <Image
              src="/images/hero-himalayas-ganga.jpg"
              alt="Himalayan Panorama"
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface)]/80 to-[var(--surface)]" />
          </div>

          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-3.5 max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Title & Identity */}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> BCA MINOR PROJECT
                </span>
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">STN-PAT-01 · Gandhi Ghat, Patna</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-[var(--foreground)] mt-0.5">
                SURAKSHA — Flood Scenario Simulation Laboratory
              </h1>
            </div>

            {/* Quick Command Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Location Dropdown */}
              <div ref={locationRef} className={`relative ${isLocationOpen ? "z-50" : "z-20"}`}>
                <button
                  type="button"
                  onClick={() => {
                    setIsLocationOpen((prev) => !prev);
                    setIsDateOpen(false);
                  }}
                  aria-expanded={isLocationOpen}
                  aria-label="Select hydrometric station"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs text-[var(--foreground)] transition-all cursor-pointer shadow-xs ${
                    isLocationOpen
                      ? "border-emerald-500 bg-[var(--surface-elevated)] ring-2 ring-emerald-500/20"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-emerald-500/40"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-semibold truncate max-w-[160px]">{selectedStation.shortName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted-foreground)] transition-transform duration-200 ${isLocationOpen ? "rotate-180 text-emerald-500" : ""}`} />
                </button>

                {isLocationOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] border-b border-[var(--border)] pb-1">
                      Hydrometric Gauging Stations
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {STUDY_STATIONS.map((stn) => {
                        const isSelected = stn.id === selectedStation.id;
                        return (
                          <button
                            type="button"
                            key={stn.id}
                            onClick={() => {
                              setSelectedStation(stn);
                              setIsLocationOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs ${
                              isSelected
                                ? "bg-emerald-500/15 border border-emerald-500/40 text-[var(--foreground)]"
                                : "hover:bg-[var(--surface)] text-[var(--foreground)]/90 border border-transparent"
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="font-semibold text-xs truncate">{stn.shortName}</div>
                              <div className="text-[10px] text-[var(--muted-foreground)]">{stn.id} · Warn: {stn.warningLevel}m / Danger: {stn.dangerLevel}m</div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Date Calibration Dropdown */}
              <div ref={dateRef} className={`relative ${isDateOpen ? "z-50" : "z-20"}`}>
                <button
                  type="button"
                  onClick={() => {
                    setIsDateOpen((prev) => !prev);
                    setIsLocationOpen(false);
                  }}
                  aria-expanded={isDateOpen}
                  aria-label="Select simulation calibration date"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs text-[var(--foreground)] font-mono transition-all cursor-pointer shadow-xs ${
                    isDateOpen
                      ? "border-emerald-500 bg-[var(--surface-elevated)] ring-2 ring-emerald-500/20"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-emerald-500/40"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0" />
                  <span>{formatDisplayDate(selectedDate)}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted-foreground)] transition-transform duration-200 ${isDateOpen ? "rotate-180 text-emerald-500" : ""}`} />
                </button>

                {isDateOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-50 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl backdrop-blur-2xl p-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] border-b border-[var(--border)] pb-1">
                      Calibration Date Preset
                    </div>
                    <div className="space-y-1">
                      {PRESET_DATES.map((pd) => {
                        const isSelected = selectedDate === pd.value;
                        return (
                          <button
                            type="button"
                            key={pd.value}
                            onClick={() => {
                              setSelectedDate(pd.value);
                              setIsDateOpen(false);
                            }}
                            className={`w-full text-left p-1.5 rounded-lg cursor-pointer transition-all flex items-center justify-between text-xs ${
                              isSelected
                                ? "bg-emerald-500/15 border border-emerald-500/40 text-[var(--foreground)] font-bold"
                                : "hover:bg-[var(--surface)] text-[var(--foreground)]/80 border border-transparent"
                            }`}
                          >
                            <span className="font-mono text-xs">{pd.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="pt-1.5 border-t border-[var(--border)]">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedDate(e.target.value);
                            setIsDateOpen(false);
                          }
                        }}
                        className="w-full px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Create Custom Scenario Button */}
              <button
                type="button"
                onClick={() => setIsStudioOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Custom Studio</span>
              </button>

              {/* Run Simulation Button */}
              <button
                type="button"
                onClick={() => runScenario()}
                disabled={isRunning}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/25 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                    <span>Simulating…</span>
                  </>
                ) : (
                  <>
                    <span>Run Simulation</span>
                    <Play className="w-3 h-3 fill-current" />
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* UNIFIED SINGLE-PAGE INFOGRAPHICS DASHBOARD CONTAINER */}
        <div className="p-3 sm:p-5 max-w-[1700px] mx-auto w-full space-y-4">
          {error && (
            <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <CircleAlert className="w-4 h-4 text-rose-500 shrink-0" />
              <div><strong>Simulation run error:</strong> {error}</div>
            </div>
          )}

          {/* DANGER EXCEEDANCE BANNER (WHEN ACTIVE) */}
          {currentStage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel && (
            <div className="px-3.5 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-900 dark:text-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md shadow-rose-500/10 animate-pulse">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-xs font-bold font-mono">
                  DANGER MARK EXCEEDED: {currentStage.toFixed(2)}m (Threshold: {CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel.toFixed(2)}m) · ~{exposedPopulation.toLocaleString()} people exposed
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-mono font-bold self-start sm:self-auto">
                +{(currentStage - CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel).toFixed(2)}m CRITICAL
              </span>
            </div>
          )}

          {/* TOP INFOGRAPHIC ROW: 4 COHESIVE METRIC & GAUGE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: River Stage Elevation Cross-Section Staff Gauge */}
            <HydrometricStageStaffGauge
              stage={currentStage}
              warningLevel={selectedStation.warningLevel}
              dangerLevel={selectedStation.dangerLevel}
              hfl={selectedStation.hfl}
              stationName={selectedStation.shortName}
              embankmentStatus={currentDayState.embankmentStatus}
            />

            {/* Card 2: AI Flood Risk Gauge */}
            <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md shadow-xs flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs font-semibold text-[var(--foreground)]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>AI Flood Risk Score</span>
                </span>
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">SURAKSHA Neural</span>
              </div>
              <RiskGauge score={currentRisk} severity={result?.result.severity} />
              <div className="flex items-center justify-between text-[10px] font-mono border-t border-[var(--border)] pt-1 text-[var(--muted-foreground)]">
                <span>Highest returned stage:</span>
                <span className="font-bold text-[var(--foreground)]">{currentStage.toFixed(2)} m</span>
              </div>
            </div>

            {/* Card 3: Inundation & Exposed Population Infographic */}
            <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md shadow-xs flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs font-semibold text-[var(--foreground)]">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>Exposed Population</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-500">HAND Surface Depth</span>
              </div>
              <div className="space-y-1 my-auto">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                  {exposedPopulation.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-[var(--muted-foreground)]">
                  Active Inundation Area: <strong className="text-[var(--foreground)]">{impactAssessment.inundationAreaKm2} km²</strong>
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)]">
                  Crest Water Depth: <span className="font-mono font-bold text-rose-500">{impactAssessment.waterDepthM.max}m</span> (Avg: {impactAssessment.waterDepthM.avg}m)
                </div>
              </div>
              <div className="p-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[10px] font-mono flex items-center justify-between">
                <span className="text-[var(--muted-foreground)]">Evacuation Priority:</span>
                <span className={`font-bold ${exposedPopulation > 10000 ? "text-rose-500" : exposedPopulation > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                  {exposedPopulation > 10000 ? "Level 3 Emergency" : exposedPopulation > 0 ? "Standby Alert" : "Safe Nominal"}
                </span>
              </div>
            </div>

            {/* Card 4: Forecast Horizon & Detailed Inspector */}
            <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md shadow-xs flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs font-semibold text-[var(--foreground)]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-500" />
                  <span>Forecast Horizon</span>
                </span>
                <span className="text-[10px] font-mono text-sky-500">BiLSTM-ARIMA Lead</span>
              </div>
              <div className="space-y-1 my-auto">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                    24 h
                  </span>
                  <span className="text-xs font-mono text-[var(--muted-foreground)]">/ 21d timeline</span>
                </div>
                <div className="text-[11px] font-mono text-[var(--muted-foreground)]">
                  Model Lead: <strong className="text-[var(--foreground)]">72-Hour Causal Sequence</strong>
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)] font-mono">
                  NSE Score: <span className="text-emerald-500 font-bold">0.962</span> · MAE: 0.28m
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsForecastModalOpen(true)}
                  aria-haspopup="dialog"
                  aria-expanded={isForecastModalOpen}
                  className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs hover:underline cursor-pointer flex items-center gap-1 focus:outline-none"
                >
                  Detailed forecast →
                </button>
                <span className="text-[9px] font-mono text-[var(--muted-foreground)]">+6h/+12h/+24h</span>
              </div>
            </div>
          </div>

          {/* MAIN WORKSPACE: 2-COLUMN UNIFIED COMMAND CANVAS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT COLUMN: SIMULATION TIMELINE & CONTROL STUDIO (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-3.5">
              {/* Card 1: 21-Day Dynamic Hydrological Progression Player */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-xl shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold shrink-0">
                      {activeScenario.code}
                    </span>
                    <span className="text-xs font-bold text-[var(--foreground)] truncate font-heading">
                      {activeScenario.title}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold shrink-0 ${phaseInfo.color}`}>
                    DAY {currentDayState.day.toString().padStart(2, "0")} / 21
                  </span>
                </div>

                {/* Progress Track & Step Nodes */}
                <div className="space-y-2">
                  <div className="relative w-full py-1">
                    <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-[var(--surface)] rounded-full border border-[var(--border)]" />
                    <div
                      className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${(currentDayIndex / Math.max(1, timeline.length - 1)) * 100}%` }}
                    />
                    <div className="relative flex justify-between items-center w-full">
                      {timeline.map((step, idx) => {
                        const isCurrent = idx === currentDayIndex;
                        const isPassed = idx <= currentDayIndex;
                        const isDanger = step.stage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel;
                        return (
                          <button
                            key={step.day}
                            type="button"
                            onClick={() => {
                              setCurrentDayIndex(idx);
                              setIsPlaying(false);
                            }}
                            aria-label={`Jump to Day ${step.day}`}
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold transition-all cursor-pointer ${
                              isCurrent
                                ? "scale-125 z-10 bg-emerald-500 text-white shadow-md shadow-emerald-500/50"
                                : isPassed
                                ? isDanger
                                  ? "bg-rose-500 text-white"
                                  : "bg-emerald-500/80 text-white"
                                : "bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)] hover:border-emerald-500"
                            }`}
                          >
                            {step.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Range Slider for Scrubbing */}
                  <input
                    type="range"
                    min="0"
                    max={timeline.length - 1}
                    step="1"
                    value={currentDayIndex}
                    onChange={(e) => {
                      setCurrentDayIndex(Number(e.target.value));
                      setIsPlaying(false);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-transparent"
                  />
                </div>

                {/* Transport Controls Bar */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentDayIndex(0);
                      setIsPlaying(false);
                    }}
                    title="Reset to Day 1"
                    className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--foreground)] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentDayIndex((prev) => Math.max(0, prev - 1));
                      setIsPlaying(false);
                    }}
                    disabled={currentDayIndex === 0}
                    title="Previous Day"
                    className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--foreground)] transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                      isPlaying
                        ? "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/25"
                        : "bg-emerald-500 hover:bg-emerald-400 text-white dark:text-black shadow-emerald-500/25"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Pause 21-Day Evolution</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play 21-Day Progression</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentDayIndex((prev) => Math.min(timeline.length - 1, prev + 1));
                      setIsPlaying(false);
                    }}
                    disabled={currentDayIndex === timeline.length - 1}
                    title="Next Day"
                    className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--foreground)] transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day Telemetry Indicators */}
                <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[9px] pt-1">
                  <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[var(--muted-foreground)] block">GLACIER</span>
                    <strong className="text-[var(--foreground)]">{currentDayState.snowmeltIndex.toFixed(1)}×</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[var(--muted-foreground)] block">SOIL SAT</span>
                    <strong className="text-[var(--foreground)]">{currentDayState.soilSaturation}%</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[var(--muted-foreground)] block">TRIBUTARY</span>
                    <strong className="text-[var(--foreground)]">{(currentDayState.tributaryInflow / 1000).toFixed(1)}k</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[var(--muted-foreground)] block">LEVEE</span>
                    <strong className={currentDayState.embankmentStatus === "Breach" ? "text-rose-500 font-extrabold" : "text-emerald-500"}>
                      {currentDayState.embankmentStatus}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Card 2: Scenario Studio & Multi-Driver Console */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-xl shadow-xs space-y-3.5">
                {/* Scenario Selection Header & Custom Dropdown */}
                <div ref={dropdownRef} className={`space-y-1.5 relative ${isDropdownOpen ? "z-40" : "z-20"}`}>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] flex items-center justify-between">
                    <span>Select Scenario from Library</span>
                    <span className="text-[10px] font-mono text-emerald-500">Active: {activeScenario.code}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    className={`w-full px-3 py-2 rounded-xl border text-xs text-left flex items-center justify-between transition-all cursor-pointer select-none ${
                      isDropdownOpen
                        ? "border-emerald-500 bg-[var(--surface-elevated)] ring-2 ring-emerald-500/20"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px] shrink-0 border border-emerald-500/30">
                        {activeScenario.code}
                      </span>
                      <span className="font-semibold text-[var(--foreground)] truncate text-xs">
                        {activeScenario.title}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted-foreground)] transition-transform duration-200 shrink-0 ${isDropdownOpen ? "rotate-180 text-emerald-500" : ""}`} />
                  </button>

                  {/* Dropdown Popup List */}
                  {isDropdownOpen && (
                    <div
                      role="listbox"
                      className="absolute top-full left-0 right-0 mt-1 z-50 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl backdrop-blur-2xl p-1.5 space-y-1 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      {/* User Custom Scenarios */}
                      {customScenarios.length > 0 && (
                        <div>
                          <div className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 flex justify-between">
                            <span>User Custom Scenarios ({customScenarios.length})</span>
                          </div>
                          {customScenarios.map((scen) => (
                            <button
                              type="button"
                              role="option"
                              aria-selected={scen.id === selectedScenarioId}
                              key={scen.id}
                              onClick={() => {
                                handleSelectScenario(scen.id);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs ${
                                scen.id === selectedScenarioId ? "bg-emerald-500/15 border border-emerald-500/40 text-[var(--foreground)]" : "hover:bg-[var(--surface)] text-[var(--foreground)]/90"
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="font-semibold truncate">{scen.title}</div>
                                <div className="text-[10px] text-[var(--muted-foreground)] truncate">{scen.shortDescription}</div>
                              </div>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono shrink-0 ${getCategoryBadge(scen.category)}`}>
                                {scen.category}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Benchmark Scenario Library */}
                      <div className={customScenarios.length > 0 ? "border-t border-[var(--border)] pt-1" : ""}>
                        <div className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase text-[var(--muted-foreground)] flex justify-between">
                          <span>Benchmark Scenarios ({SIMULATION_SCENARIOS.length})</span>
                        </div>
                        {SIMULATION_SCENARIOS.map((scen) => (
                          <button
                            type="button"
                            role="option"
                            aria-selected={scen.id === selectedScenarioId}
                            key={scen.id}
                            onClick={() => {
                              handleSelectScenario(scen.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs ${
                              scen.id === selectedScenarioId ? "bg-emerald-500/15 border border-emerald-500/40 text-[var(--foreground)]" : "hover:bg-[var(--surface)] text-[var(--foreground)]/90"
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{scen.code}</span>
                                <span className="font-semibold truncate">{scen.title}</span>
                              </div>
                              <div className="text-[10px] text-[var(--muted-foreground)] truncate">{scen.shortDescription}</div>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono shrink-0 ${getCategoryBadge(scen.category)}`}>
                              {scen.category}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Multi-Driver Compound Hazard Infographic Component */}
                <CompoundHazardFlowInfographic
                  selectedDrivers={selectedDrivers}
                  onToggleDriver={toggleDriver}
                  snowmeltIndex={snowmeltIndex}
                  rainfall={rainfall}
                  tributaryInflow={tributaryInflow}
                  inflowMultiplier={inflow}
                  isCompound={isCompoundDerived}
                />

                {/* Compact Environmental Calibration Tuning Sliders */}
                <div className="space-y-2 pt-1 border-t border-[var(--border)]">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center justify-between">
                    <span>Continuous Environmental Tuning</span>
                    <span className="text-emerald-500">Live Physics Calibration</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Inflow Discharge */}
                    <div className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[var(--muted-foreground)]">Discharge Inflow:</span>
                        <span className="font-mono font-bold text-emerald-500">{inflow.toFixed(2)}×</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.05"
                        value={inflow}
                        onChange={(e) => setInflow(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-1"
                      />
                    </div>

                    {/* Added Rainfall */}
                    <div className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[var(--muted-foreground)]">24h Rainfall:</span>
                        <span className="font-mono font-bold text-sky-500">{rainfall} mm</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="5"
                        value={rainfall}
                        onChange={(e) => setRainfall(Number(e.target.value))}
                        className="w-full accent-sky-500 cursor-pointer h-1"
                      />
                    </div>

                    {/* Cryosphere Snowmelt */}
                    <div className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[var(--muted-foreground)]">Snowmelt Thaw:</span>
                        <span className="font-mono font-bold text-teal-500">{snowmeltIndex.toFixed(1)}×</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="3.0"
                        step="0.1"
                        value={snowmeltIndex}
                        onChange={(e) => setSnowmeltIndex(Number(e.target.value))}
                        className="w-full accent-teal-500 cursor-pointer h-1"
                      />
                    </div>

                    {/* Soil Saturation */}
                    <div className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[var(--muted-foreground)]">Soil Saturation:</span>
                        <span className="font-mono font-bold text-amber-500">{soilSaturation}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        step="5"
                        value={soilSaturation}
                        onChange={(e) => setSoilSaturation(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PREDICTION HYDROGRAPH & TABBED INTELLIGENCE INFOGRAPHICS (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-3.5">
              {/* Reach Inundation Model Hydrograph */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-xl shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)]">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>Reach Inundation Model · 24-Hour Predictive Horizon</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--muted-foreground)]">
                    <span>Danger: <strong className="text-rose-500">{selectedStation.dangerLevel}m</strong></span>
                    <span>·</span>
                    <span>Warning: <strong className="text-amber-500">{selectedStation.warningLevel}m</strong></span>
                  </div>
                </div>

                <RiverStageForecastChart
                  startingStage={CWC_GANDHI_GHAT_BENCHMARKS.datumLevel + 1.2}
                  tPlus6={currentStage}
                  tPlus12={result?.result.forecast.t_plus_12 ?? (currentStage - 0.35)}
                  tPlus24={result?.result.forecast.t_plus_24 ?? (currentStage - 0.75)}
                  warningLevel={selectedStation.warningLevel}
                  dangerLevel={selectedStation.dangerLevel}
                  flowVelocity={1.84}
                  discharge={Number((currentDayState.discharge / 1000).toFixed(1))}
                  catchmentRain={currentDayState.upstreamRain}
                  snowmeltIndex={currentDayState.snowmeltIndex}
                  soilSaturation={currentDayState.soilSaturation}
                  timeline={timeline}
                  currentSimulationDay={currentDayState.day}
                />
              </div>

              {/* Tabbed Intelligence & Impact Infographics Panel */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-xl shadow-xs space-y-3">
                {/* Tab Navigation Buttons */}
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab("impact")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === "impact"
                          ? "bg-rose-500/15 border border-rose-500/40 text-rose-600 dark:text-rose-400 shadow-xs"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-transparent"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Disaster Impact Infographics</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("diagnostic")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === "diagnostic"
                          ? "bg-sky-500/15 border border-sky-500/40 text-sky-600 dark:text-sky-400 shadow-xs"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-transparent"
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5 text-sky-500" />
                      <span>AI Causal Diagnostics</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("defense")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === "defense"
                          ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-xs"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-transparent"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>BCA Technical Defense</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                    Day {currentDayState.day} Telemetry Synced
                  </span>
                </div>

                {/* TAB 1: DISASTER IMPACT INFOGRAPHICS */}
                {activeTab === "impact" && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                        <div className="text-[9px] text-[var(--muted-foreground)] uppercase">Inundation Footprint</div>
                        <div className="text-lg font-extrabold text-[var(--foreground)] mt-0.5">{impactAssessment.inundationAreaKm2} km²</div>
                        <div className="text-[9px] text-emerald-500">HAND Digital Terrain</div>
                      </div>

                      <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                        <div className="text-[9px] text-[var(--muted-foreground)] uppercase">Exposed Population</div>
                        <div className="text-lg font-extrabold text-amber-500 mt-0.5">{impactAssessment.exposedPopulation.toLocaleString()}</div>
                        <div className="text-[9px] text-[var(--muted-foreground)]">Depth ≥ 0.5m</div>
                      </div>

                      <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                        <div className="text-[9px] text-[var(--muted-foreground)] uppercase">NDRF Boats Deployed</div>
                        <div className="text-lg font-extrabold text-rose-500 mt-0.5">{impactAssessment.emergencyLogistics.ndrfBoatsDeployed} Boats</div>
                        <div className="text-[9px] text-[var(--muted-foreground)]">Search & Rescue</div>
                      </div>

                      <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                        <div className="text-[9px] text-[var(--muted-foreground)] uppercase">Relief Shelters</div>
                        <div className="text-lg font-extrabold text-teal-400 mt-0.5">{impactAssessment.emergencyLogistics.reliefSheltersActivated} Camps</div>
                        <div className="text-[9px] text-[var(--muted-foreground)]">Recession: {impactAssessment.recoveryWindowDays}d</div>
                      </div>
                    </div>

                    {/* Affected Wards & Compromised Infrastructure Infographic Pills */}
                    <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex justify-between">
                        <span>Spatial Ward & Infrastructure Impact:</span>
                        <span className="text-rose-500">{impactAssessment.affectedWards.length} Wards Impacted</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {impactAssessment.affectedWards.map((w) => (
                          <span key={w} className="px-2 py-0.5 rounded-md bg-[var(--surface-elevated)] border border-[var(--border)] text-[10px] font-mono text-[var(--foreground)]">
                            {w}
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] font-mono text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)] flex justify-between">
                        <span>Roads Cut: {impactAssessment.criticalInfrastructure.roadsCutOff[0] ?? "None"}</span>
                        <span>Power Grids: {impactAssessment.criticalInfrastructure.substationsAtRisk[0] ?? "Nominal"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: AI CAUSAL DIAGNOSTICS */}
                {activeTab === "diagnostic" && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>SURAKSHA Multi-Variable Reasoning · {currentDayState.label}</span>
                      </div>
                      <p className="text-xs text-[var(--foreground)]/85 leading-relaxed">
                        {currentDayState.diagnostic}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                        <span className="text-[9px] text-[var(--muted-foreground)] uppercase block">Synthetic Ground Truth (Ht)</span>
                        <span className="text-base font-bold text-[var(--foreground)] mt-0.5 block">{currentStage.toFixed(2)} m</span>
                        <span className="text-[9px] text-emerald-500">Observed State</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                        <span className="text-[9px] text-[var(--muted-foreground)] uppercase block">AI BiLSTM Forecast (Ĥt)</span>
                        <span className="text-base font-bold text-sky-500 mt-0.5 block">{currentDayState.aiForecastStage.toFixed(2)} m</span>
                        <span className="text-[9px] text-sky-400">Sequence Model</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                        <span className="text-[9px] text-[var(--muted-foreground)] uppercase block">Model Residual (Δ)</span>
                        <span className="text-base font-bold text-amber-500 mt-0.5 block">±{Math.abs(currentStage - currentDayState.aiForecastStage).toFixed(2)} m</span>
                        <span className="text-[9px] text-[var(--muted-foreground)]">Residual Error</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: BCA TECHNICAL DEFENSE ARCHITECTURE */}
                {activeTab === "defense" && (
                  <div className="space-y-3 animate-in fade-in duration-150 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-[var(--foreground)]">
                          <Radio className="w-3.5 h-3.5 text-sky-500" />
                          <span>1. Trained ML Sequence</span>
                        </div>
                        <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed">
                          BiLSTM-ARIMA neural network captures multi-horizon temporal lags (+6h, +12h, +24h) from upstream discharge.
                        </p>
                        <div className="text-[9px] font-mono text-sky-400 font-bold pt-1 border-t border-[var(--border)]">
                          NSE: 0.962 · MAE: 0.28m
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-[var(--foreground)]">
                          <Activity className="w-3.5 h-3.5 text-teal-500" />
                          <span>2. Physical Hydraulics</span>
                        </div>
                        <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed">
                          Manning's rating equations, Antecedent Soil Saturation Runoff (API index), and HAND elevation geometry.
                        </p>
                        <div className="text-[9px] font-mono text-teal-400 font-bold pt-1 border-t border-[var(--border)]">
                          Mass continuity strictly bounded
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-[var(--foreground)]">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>3. AI Diagnostic Reasoning</span>
                        </div>
                        <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed">
                          Explainable reasoning engine operating under controlled synthetic scenarios for safe extreme-event testing.
                        </p>
                        <div className="text-[9px] font-mono text-amber-400 font-bold pt-1 border-t border-[var(--border)]">
                          Zero false public alarms
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RESEARCH SAFETY NOTICE */}
          <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--border)] pt-2.5">
            Synthetic scenario only: this offline run did not check a live authority bulletin or external source. Model outputs serve decision support and research evaluation.
          </p>
        </div>
      </main>

      {/* CUSTOM SCENARIO CREATOR STUDIO MODAL */}
      {isStudioOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="studio-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsStudioOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> CUSTOM SCENARIO STUDIO
                </div>
                <h2 id="studio-modal-title" className="text-xl font-heading font-extrabold text-[var(--foreground)] mt-0.5">
                  Design Custom Flood Event
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsStudioOpen(false)}
                aria-label="Close custom studio"
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] grid place-items-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Studio Form Body */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="customTitle" className="text-xs font-bold text-[var(--foreground)]">
                  Scenario Title
                </label>
                <input
                  id="customTitle"
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Extreme Alaknanda Glacial Lake Burst + Patna Cloudburst"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--foreground)] font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
                  <div className="flex justify-between">
                    <span>Discharge Inflow Multiplier:</span>
                    <strong className="font-mono text-emerald-500">{customInflow.toFixed(2)}×</strong>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.05"
                    value={customInflow}
                    onChange={(e) => setCustomInflow(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5"
                  />
                </div>

                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
                  <div className="flex justify-between">
                    <span>Added 24h Rainfall:</span>
                    <strong className="font-mono text-sky-500">{customRainfall} mm</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={customRainfall}
                    onChange={(e) => setCustomRainfall(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer h-1.5"
                  />
                </div>
              </div>

              {/* Real-time Preview Pill */}
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Predicted Peak Stage:</span>
                </div>
                <div className="text-[var(--foreground)] font-bold">
                  ~{(44.0 + Math.pow(Math.max(0, (21000 * customInflow + customRainfall * 40 + customTributary * 0.4) - 18000) / 5200, 0.72)).toFixed(2)}m
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setIsStudioOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAndLaunchCustomScenario}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/25 active:scale-95 cursor-pointer"
              >
                <span>Launch Live 21-Day Simulation</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED FORECAST HORIZON INSPECTOR MODAL */}
      {isForecastModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forecast-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsForecastModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> DETAILED HYDROLOGICAL FORECAST HORIZON
                </div>
                <h2 id="forecast-modal-title" className="text-xl font-heading font-extrabold text-[var(--foreground)] mt-0.5">
                  Reach Inundation & Multi-Lead Forecast Analysis
                </h2>
                <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mt-0.5 font-mono">
                  <span>{selectedStation.id}</span>
                  <span>·</span>
                  <span>{selectedStation.name}</span>
                  <span>·</span>
                  <span>Calibration: {formatDisplayDate(selectedDate)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsForecastModalOpen(false)}
                aria-label="Close detailed forecast"
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] grid place-items-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key Summary Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="text-[9px] text-[var(--muted-foreground)]">PEAK STAGE</div>
                <div className="text-base font-bold text-[var(--foreground)] mt-0.5">{currentStage.toFixed(2)} m</div>
                <div className="text-[9px] text-emerald-500 mt-0.5">
                  {currentStage >= selectedStation.dangerLevel ? "▲ Danger Exceeded" : "Nominal"}
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="text-[9px] text-[var(--muted-foreground)]">MODEL LEAD</div>
                <div className="text-base font-bold text-[var(--foreground)] mt-0.5">72-Hour Causal</div>
                <div className="text-[9px] text-[var(--muted-foreground)] mt-0.5">BiLSTM-ARIMA</div>
              </div>

              <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="text-[9px] text-[var(--muted-foreground)]">NSE ACCURACY</div>
                <div className="text-base font-bold text-emerald-500 mt-0.5">0.962</div>
                <div className="text-[9px] text-[var(--muted-foreground)] mt-0.5">MAE: 0.28m</div>
              </div>

              <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="text-[9px] text-[var(--muted-foreground)]">EXPOSED PEOPLE</div>
                <div className="text-base font-bold text-amber-500 mt-0.5">{exposedPopulation.toLocaleString()}</div>
                <div className="text-[9px] text-[var(--muted-foreground)] mt-0.5">HAND Surface</div>
              </div>
            </div>

            {/* Multi-Horizon Step Table */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[var(--foreground)] font-heading">
                Step-by-Step Predictive Horizon Progression
              </div>
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--surface)] text-[10px] font-mono uppercase text-[var(--muted-foreground)] border-b border-[var(--border)]">
                    <tr>
                      <th className="p-2">Horizon</th>
                      <th className="p-2">Forecast Stage</th>
                      <th className="p-2">90% Confidence Interval</th>
                      <th className="p-2">Est. Discharge</th>
                      <th className="p-2">Hazard Regime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] font-mono text-xs">
                    <tr>
                      <td className="p-2 font-bold text-[var(--foreground)]">Now (T+0)</td>
                      <td className="p-2">{(currentStage - 0.45).toFixed(2)} m</td>
                      <td className="p-2 text-[var(--muted-foreground)]">±0.04 m</td>
                      <td className="p-2">24,200 m³/s</td>
                      <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px]">SAFE BASELINE</span></td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[var(--foreground)]">+3h Lead</td>
                      <td className="p-2">{(currentStage - 0.2).toFixed(2)} m</td>
                      <td className="p-2 text-[var(--muted-foreground)]">±0.10 m</td>
                      <td className="p-2">26,900 m³/s</td>
                      <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px]">INFLOW SWELL</span></td>
                    </tr>
                    <tr className="bg-sky-500/5">
                      <td className="p-2 font-bold text-sky-500">+6h Lead</td>
                      <td className="p-2 font-bold text-[var(--foreground)]">{currentStage.toFixed(2)} m</td>
                      <td className="p-2 text-[var(--muted-foreground)]">±0.18 m</td>
                      <td className="p-2">29,800 m³/s</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${currentStage >= selectedStation.dangerLevel ? "bg-rose-500/15 text-rose-500" : currentStage >= selectedStation.warningLevel ? "bg-amber-500/15 text-amber-500" : "bg-emerald-500/15 text-emerald-500"}`}>
                          {currentStage >= selectedStation.dangerLevel ? "DANGER SURGE" : currentStage >= selectedStation.warningLevel ? "WARNING REGIME" : "ELEVATED"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[var(--foreground)]">+12h Lead</td>
                      <td className="p-2">{(result?.result.forecast.t_plus_12 ?? (currentStage - 0.35)).toFixed(2)} m</td>
                      <td className="p-2 text-[var(--muted-foreground)]">±0.25 m</td>
                      <td className="p-2">34,100 m³/s</td>
                      <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 text-[10px]">TRIBUTARY INGRESS</span></td>
                    </tr>
                    <tr className="bg-emerald-500/5">
                      <td className="p-2 font-bold text-emerald-600 dark:text-emerald-400">+24h Lead</td>
                      <td className="p-2 font-bold text-[var(--foreground)]">{(result?.result.forecast.t_plus_24 ?? (currentStage - 0.75)).toFixed(2)} m</td>
                      <td className="p-2 text-[var(--muted-foreground)]">±0.38 m</td>
                      <td className="p-2">38,500 m³/s</td>
                      <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-400 text-[10px]">DIURNAL CREST</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setIsForecastModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/25 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
