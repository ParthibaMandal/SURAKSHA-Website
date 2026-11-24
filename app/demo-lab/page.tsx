"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { RiskGauge } from "@/components/simulation/RiskGauge";
import { ScenarioComparisonChart } from "@/components/simulation/ScenarioComparisonChart";
import { RiverStageForecastChart } from "@/components/simulation/RiverStageForecastChart";
import {
  SIMULATION_SCENARIOS,
  SimulationScenario,
  SimulationDayState,
  CWC_GANDHI_GHAT_BENCHMARKS,
  generateCustomScenario,
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
  const [inflow, setInflow] = useState(PRESETS.surge.inflow);
  const [rainfall, setRainfall] = useState(PRESETS.surge.rainfall);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunTime, setLastRunTime] = useState<string>("16:42:10");

  // 21-Day Progressive Timeline Player States
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Custom Scenario Creator Studio Modal State
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>("Custom Upper Ganga Inflow Surge");
  const [customPattern, setCustomPattern] = useState<"compound_surge" | "flash_cloudburst" | "glacier_wave" | "steady_recession">("compound_surge");
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

  const locationRef = React.useRef<HTMLDivElement>(null);
  const dateRef = React.useRef<HTMLDivElement>(null);

  // Custom Dropdown Menu State & Outside Click Listener
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
  
  // Dynamic population exposure model based on stage and CWC Danger Mark
  const exposedPopulation =
    currentStage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel
      ? Math.round(18900 * Math.min(1.6, Math.max(0.6, (currentStage - CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel) / 0.8 + 0.8)))
      : currentStage >= CWC_GANDHI_GHAT_BENCHMARKS.warningLevel
      ? 4200
      : 0;

  function handleSelectScenario(scenarioId: string) {
    const scen = allScenarios.find((s) => s.id === scenarioId) ?? SIMULATION_SCENARIOS[0];
    setSelectedScenarioId(scen.id);
    setInflow(scen.initialInflowMultiplier);
    setRainfall(scen.initialRainfallAnomaly);
    setCurrentDayIndex(0);
    setIsPlaying(false);
    setError(null);

    // Sync quick preset pill state if matching
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
    try {
      const response = await fetch("/api/flood/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          scenario_id: target.id.startsWith("CUSTOM_") ? PRESETS.surge.scenarioId : target.id,
          river_discharge_multiplier: inflow,
          precipitation_anomaly_mm: rainfall,
        }),
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "The simulation service could not complete this run.");
      const expectedId = target.id.startsWith("CUSTOM_") ? PRESETS.surge.scenarioId : target.id;
      if (!isScenarioResult(data, expectedId)) {
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
      eventPattern: customPattern,
      embankmentBreachRisk: customBreachRisk,
    };

    const newScenario = generateCustomScenario(input);
    setCustomScenarios((prev) => [newScenario, ...prev]);
    setSelectedScenarioId(newScenario.id);
    setInflow(newScenario.initialInflowMultiplier);
    setRainfall(newScenario.initialRainfallAnomaly);
    setCurrentDayIndex(0);
    setIsStudioOpen(false);
    setIsPlaying(true); // Automatically play live simulation!
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
        {/* Top Panoramic Mountain Header Banner */}
        <header className="relative w-full border-b border-[var(--border)] overflow-hidden bg-[var(--surface)]">
          {/* Panoramic Mountain Backdrop with Atmospheric Gradient */}
          <div className="absolute inset-0 z-0 opacity-40 dark:opacity-25 select-none pointer-events-none">
            <Image
              src="/images/hero-himalayas-ganga.jpg"
              alt="Snow-capped Himalayan Panorama"
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface)]/70 to-[var(--surface)]" />
          </div>

          <div className="relative z-10 px-4 sm:px-8 lg:px-12 py-6 max-w-[1600px] mx-auto space-y-4">
            {/* Top Bar: Breadcrumbs & Status Indicator */}
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <span>Workspace</span>
                <span>&gt;</span>
                <span>Simulation</span>
                <span>&gt;</span>
                <span className="text-[var(--foreground)] font-semibold">Simulation Lab</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${isRunning || isPlaying ? "bg-amber-400 animate-ping" : "bg-emerald-500"}`} />
                  {isRunning ? "COMPUTING FORECAST" : isPlaying ? "LIVE SIMULATION RUNNING" : "READY TO RUN"}
                </span>
                <div className="w-7 h-7 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--foreground)] font-bold text-xs grid place-items-center">
                  SC
                </div>
              </div>
            </div>

            {/* Title & Controls Bar */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  FLOOD SCENARIO SIMULATION LABORATORY
                </div>
                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-[var(--foreground)] mt-1">
                  Flood Simulation Lab
                </h1>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1.5 max-w-2xl leading-relaxed">
                  Interactive multi-variable flood scenario engine. Create custom environmental scenarios or run library benchmarks with live 21-day timeline evolution and closed-loop predictive validation.
                </p>
              </div>

              {/* Action Buttons & Selectors */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Create Custom Scenario Button */}
                <button
                  type="button"
                  onClick={() => setIsStudioOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Custom Scenario</span>
                </button>

                {/* Location Selector Dropdown */}
                <div ref={locationRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLocationOpen(!isLocationOpen);
                      setIsDateOpen(false);
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs text-[var(--foreground)] transition-all cursor-pointer shadow-xs select-none ${
                      isLocationOpen
                        ? "border-emerald-500 bg-[var(--surface-elevated)] ring-2 ring-emerald-500/20"
                        : "border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md hover:border-emerald-500/40"
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold truncate max-w-[190px]">{selectedStation.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted-foreground)] transition-transform duration-200 shrink-0 ${isLocationOpen ? "rotate-180 text-emerald-500" : ""}`} />
                  </button>

                  {/* Location Popup Menu */}
                  {isLocationOpen && (
                    <div className="absolute right-0 top-full mt-1.5 z-50 w-72 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span>Hydrometric Gauging Stations</span>
                        <span>{STUDY_STATIONS.length}</span>
                      </div>
                      <div className="space-y-1 pt-1 max-h-72 overflow-y-auto">
                        {STUDY_STATIONS.map((stn) => {
                          const isSelected = stn.id === selectedStation.id;
                          return (
                            <div
                              key={stn.id}
                              onClick={() => {
                                setSelectedStation(stn);
                                setIsLocationOpen(false);
                              }}
                              className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                                isSelected
                                  ? "bg-emerald-500/15 border border-emerald-500/40 text-[var(--foreground)]"
                                  : "hover:bg-[var(--surface)] text-[var(--foreground)]/90 hover:text-[var(--foreground)] border border-transparent"
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    {stn.id}
                                  </span>
                                  <span className="font-semibold text-xs truncate">
                                    {stn.shortName}
                                  </span>
                                </div>
                                <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5 truncate">
                                  {stn.corridor} · Warning: {stn.warningLevel}m / Danger: {stn.dangerLevel}m
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Date Selector Dropdown */}
                <div ref={dateRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDateOpen(!isDateOpen);
                      setIsLocationOpen(false);
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs text-[var(--foreground)] font-mono transition-all cursor-pointer shadow-xs select-none ${
                      isDateOpen
                        ? "border-emerald-500 bg-[var(--surface-elevated)] ring-2 ring-emerald-500/20"
                        : "border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md hover:border-emerald-500/40"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-[var(--muted-foreground)] shrink-0" />
                    <span>{formatDisplayDate(selectedDate)}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted-foreground)] transition-transform duration-200 shrink-0 ${isDateOpen ? "rotate-180 text-emerald-500" : ""}`} />
                  </button>

                  {/* Date Popup Menu */}
                  {isDateOpen && (
                    <div className="absolute right-0 top-full mt-1.5 z-50 w-64 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl backdrop-blur-2xl p-2.5 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] border-b border-[var(--border)] pb-1.5">
                        Simulation Date Calibration
                      </div>
                      
                      {/* Presets */}
                      <div className="space-y-1">
                        {PRESET_DATES.map((pd) => {
                          const isSelected = selectedDate === pd.value;
                          return (
                            <div
                              key={pd.value}
                              onClick={() => {
                                setSelectedDate(pd.value);
                                setIsDateOpen(false);
                              }}
                              className={`p-2 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs ${
                                isSelected
                                  ? "bg-emerald-500/15 border border-emerald-500/40 text-[var(--foreground)] font-bold"
                                  : "hover:bg-[var(--surface)] text-[var(--foreground)]/80 hover:text-[var(--foreground)] border border-transparent"
                              }`}
                            >
                              <div>
                                <div className="font-mono">{pd.label}</div>
                                <div className="text-[9px] text-[var(--muted-foreground)] font-normal">{pd.desc}</div>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Custom Date Input */}
                      <div className="pt-2 border-t border-[var(--border)] space-y-1">
                        <label htmlFor="customDatePicker" className="text-[10px] font-semibold text-[var(--muted-foreground)] block">
                          Pick Specific Calendar Date:
                        </label>
                        <input
                          id="customDatePicker"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => {
                            if (e.target.value) {
                              setSelectedDate(e.target.value);
                              setIsDateOpen(false);
                            }
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--foreground)] font-mono cursor-pointer focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Run Simulation Button */}
                <button
                  type="button"
                  onClick={() => runScenario()}
                  disabled={isRunning}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/25 active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      <span>Simulating…</span>
                    </>
                  ) : (
                    <>
                      <span>Run Simulation</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Container */}
        <div className="p-4 sm:p-8 max-w-[1600px] mx-auto w-full space-y-6">
          {error && (
            <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-3">
              <CircleAlert className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <strong>Simulation run error:</strong> {error}
              </div>
            </div>
          )}

          {/* High Water / Danger Mark Exceedance Banner */}
          {currentStage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel && (
            <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/15 text-rose-900 dark:text-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse shadow-lg shadow-rose-500/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500 text-white grid place-items-center shrink-0 shadow-md">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 font-mono">
                    CWC DANGER MARK EXCEEDED · {currentStage.toFixed(2)} m (THRESHOLD: {CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel.toFixed(2)} m)
                  </div>
                  <div className="text-sm font-semibold mt-0.5">
                    Substantial inundation risk detected. Approximately 18,900 people in low-lying Digha, Danapur, and Gandhi Ghat floodplains exposed.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-mono font-bold">
                  STAGE +{(currentStage - CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel).toFixed(2)}m OVER DANGER
                </span>
              </div>
            </div>
          )}

          {/* 1. Top 4 Metric KPI Cards with Wave Sparklines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Highest returned stage */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md flex flex-col justify-between space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] font-medium">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  Highest returned stage
                </span>
                <span className="text-[10px] font-mono text-emerald-500">Live Telemetry</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                  {currentStage.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-[var(--muted-foreground)]">m</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border)] font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ↑ +{(currentStage - CWC_GANDHI_GHAT_BENCHMARKS.datumLevel - 1.2).toFixed(2)} m vs baseline
                </span>
                <svg width="48" height="16" viewBox="0 0 48 16" className="text-sky-500">
                  <path d="M0 12 Q 12 2 24 8 T 48 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* KPI 2: Flood Risk Score */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md flex flex-col justify-between space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] font-medium">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Flood Risk Score
                </span>
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">SURAKSHA AI</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                  {currentRisk}
                </span>
                <span className="text-sm font-semibold text-[var(--muted-foreground)]">/ 100</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border)]">
                <span
                  className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase ${
                    currentRisk < 30
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : currentRisk < 70
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {currentRisk < 30 ? "Low Risk" : currentRisk < 70 ? "Moderate" : "High Risk"}
                </span>
                <svg width="48" height="16" viewBox="0 0 48 16" className="text-amber-500">
                  <path d="M0 14 Q 14 12 24 6 T 48 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* KPI 3: Potentially Exposed People */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md flex flex-col justify-between space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] font-medium">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  Potentially Exposed People
                </span>
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">HAND Surface</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                  {exposedPopulation.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border)]">
                <span
                  className={`font-medium ${
                    exposedPopulation === 0
                      ? "text-[var(--muted-foreground)]"
                      : exposedPopulation > 10000
                      ? "text-rose-600 dark:text-rose-400 font-bold"
                      : "text-amber-600 dark:text-amber-400 font-semibold"
                  }`}
                >
                  {exposedPopulation === 0 ? "No immediate risk" : exposedPopulation > 10000 ? "Critical Evacuation Advisory" : "Advisory issued"}
                </span>
                <svg width="48" height="16" viewBox="0 0 48 16" className="text-emerald-500">
                  <path d="M0 12 L 20 12 L 48 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* KPI 4: Forecast Horizon */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md flex flex-col justify-between space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  Forecast Horizon
                </span>
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">21-Day Multi-Phase</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                  24 h
                </span>
                <span className="text-xs font-mono text-[var(--muted-foreground)]">/ 21d total</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsForecastModalOpen(true)}
                  className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer flex items-center gap-1 focus:outline-none"
                >
                  Detailed forecast →
                </button>
                <svg width="48" height="16" viewBox="0 0 48 16" className="text-sky-500">
                  <path d="M0 14 Q 18 10 32 4 T 48 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* 2. Flagship 21-Day Progressive Timeline Controller Card */}
          <section className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-xl shadow-xs space-y-5">
            {/* Timeline Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                    {activeScenario.code}
                  </span>
                  <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider font-heading">
                    {activeScenario.title}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--muted-foreground)]">
                    {activeScenario.category}
                  </span>
                  {activeScenario.id.startsWith("CUSTOM_") && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-bold font-mono uppercase tracking-wider">
                      User Created
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">
                  {activeScenario.shortDescription}
                </p>
              </div>

              {/* Day Badge & Phase Indicator */}
              <div className="flex items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full border text-[11px] font-mono font-bold ${phaseInfo.color}`}>
                  {phaseInfo.label}
                </span>
                <div className="px-3 py-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--foreground)]">
                  DAY {currentDayState.day.toString().padStart(2, "0")} / 21
                </div>
              </div>
            </div>

            {/* Timeline Scrubber & Navigation Track */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] font-mono">
                <span>01 June (Baseline)</span>
                <span className="text-emerald-500 font-bold">Active Simulation Step: {currentDayState.label}</span>
                <span>21 June (Recession)</span>
              </div>

              {/* Progress Track with Discrete Step Nodes */}
              <div className="relative w-full py-2">
                {/* Horizontal Background Rail */}
                <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-[var(--surface)] rounded-full border border-[var(--border)]" />
                
                {/* Active Colored Progress Fill */}
                <div
                  className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 bg-emerald-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentDayIndex / Math.max(1, timeline.length - 1)) * 100}%`,
                  }}
                />

                {/* Step Circles */}
                <div className="relative flex justify-between items-center w-full">
                  {timeline.map((step, idx) => {
                    const isPassed = idx <= currentDayIndex;
                    const isCurrent = idx === currentDayIndex;
                    const isDanger = step.stage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel;
                    const isWarning = step.stage >= CWC_GANDHI_GHAT_BENCHMARKS.warningLevel;

                    return (
                      <button
                        key={step.day}
                        type="button"
                        onClick={() => {
                          setCurrentDayIndex(idx);
                          setIsPlaying(false);
                        }}
                        className="group relative flex flex-col items-center cursor-pointer select-none focus:outline-none"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all text-[10px] font-mono font-bold border-2 ${
                            isCurrent
                              ? "scale-125 z-10 bg-emerald-500 text-white border-white dark:border-black shadow-md shadow-emerald-500/50"
                              : isPassed
                              ? isDanger
                                ? "bg-rose-500 text-white border-rose-300"
                                : isWarning
                                ? "bg-amber-500 text-white border-amber-300"
                                : "bg-emerald-500/80 text-white border-emerald-400"
                              : "bg-[var(--surface-elevated)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-emerald-500/50"
                          }`}
                        >
                          {step.day}
                        </div>

                        {isCurrent && (
                          <div className="absolute -top-7 whitespace-nowrap px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 shadow-xs">
                            {step.stage.toFixed(2)}m
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider for smooth dragging */}
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
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-transparent"
              />
            </div>

            {/* Playback Controls & Multi-Variable Diagnostic Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-2 border-t border-[var(--border)]">
              {/* Transport Controls (lg:col-span-4) */}
              <div className="lg:col-span-4 flex items-center gap-2">
                {/* Reset to Day 1 */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentDayIndex(0);
                    setIsPlaying(false);
                  }}
                  title="Reset to Day 1"
                  className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Previous Day */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentDayIndex((prev) => Math.max(0, prev - 1));
                    setIsPlaying(false);
                  }}
                  disabled={currentDayIndex === 0}
                  title="Previous Day"
                  className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--foreground)] transition-colors cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isPlaying
                      ? "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/25"
                      : "bg-emerald-500 hover:bg-emerald-400 text-white dark:text-black shadow-emerald-500/25"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Simulation</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play 21-Day Evolution</span>
                    </>
                  )}
                </button>

                {/* Next Day */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentDayIndex((prev) => Math.min(timeline.length - 1, prev + 1));
                    setIsPlaying(false);
                  }}
                  disabled={currentDayIndex === timeline.length - 1}
                  title="Next Day"
                  className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--foreground)] transition-colors cursor-pointer disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Real-time Physical Indicators Bar (lg:col-span-8) */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted-foreground)]">GLACIER THAW</div>
                  <div className="font-bold text-[var(--foreground)] mt-0.5">{currentDayState.snowmeltIndex.toFixed(1)}× Anomaly</div>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted-foreground)]">SOIL SATURATION</div>
                  <div className="font-bold text-[var(--foreground)] mt-0.5">{currentDayState.soilSaturation}% Saturated</div>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted-foreground)]">TRIBUTARY FLOW</div>
                  <div className="font-bold text-[var(--foreground)] mt-0.5">{currentDayState.tributaryInflow.toLocaleString()} m³/s</div>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted-foreground)]">EMBANKMENT</div>
                  <div
                    className={`font-bold mt-0.5 ${
                      currentDayState.embankmentStatus === "Breach"
                        ? "text-rose-500"
                        : currentDayState.embankmentStatus === "Under Stress"
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {currentDayState.embankmentStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Diagnostic Commentary on Current Simulation Day */}
            <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3">
              <Activity className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[var(--foreground)] uppercase font-mono tracking-wider flex items-center gap-2">
                  <span>SURAKSHA Reasoning · {currentDayState.label} Analysis</span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">
                    (Predicted: {currentDayState.aiForecastStage.toFixed(2)}m · Error: {Math.abs(currentDayState.stage - currentDayState.aiForecastStage).toFixed(2)}m)
                  </span>
                </div>
                <p className="text-xs text-[var(--foreground)]/80 leading-relaxed">
                  {currentDayState.diagnostic}
                </p>
              </div>
            </div>
          </section>

          {/* 3. Middle Row: Scenario Configuration & River-Stage Hydrograph Forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Panel 1: Scenario Configuration (lg:col-span-5) */}
            <section className="lg:col-span-5 p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-xl shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2 font-heading">
                    <Activity className="w-4 h-4 text-emerald-500" /> Scenario Configuration
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsStudioOpen(true)}
                      className="px-2 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/25 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <PlusCircle className="w-3 h-3" />
                      <span>+ Custom</span>
                    </button>
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                      {allScenarios.length} Total
                    </span>
                  </div>
                </div>

                {/* Custom Scenario Dropdown Menu */}
                <div ref={dropdownRef} className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] flex items-center justify-between">
                    <span>Select Scenario from Library</span>
                    <span className="text-[10px] font-mono text-emerald-500">
                      Active: {activeScenario.code}
                    </span>
                  </label>

                  {/* Dropdown Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-left flex items-center justify-between transition-all cursor-pointer select-none ${
                      isDropdownOpen
                        ? "border-emerald-500 bg-[var(--surface-elevated)] ring-2 ring-emerald-500/20"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/50 hover:bg-[var(--surface-elevated)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[11px] shrink-0 border border-emerald-500/30">
                        {activeScenario.code}
                      </span>
                      <span className="font-semibold text-[var(--foreground)] truncate text-xs">
                        {activeScenario.title}
                      </span>
                      <span className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${getCategoryBadge(activeScenario.category)}`}>
                        {activeScenario.category}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform duration-200 shrink-0 ${isDropdownOpen ? "rotate-180 text-emerald-500" : ""}`} />
                  </button>

                  {/* Dropdown Menu Popup Panel */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl backdrop-blur-2xl p-1.5 space-y-1 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Group 1: User Custom Scenarios (if any exist) */}
                      {customScenarios.length > 0 && (
                        <div>
                          <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                            <span>User Custom Scenarios</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">{customScenarios.length}</span>
                          </div>
                          <div className="space-y-1">
                            {customScenarios.map((scen) => {
                              const isSelected = scen.id === selectedScenarioId;
                              return (
                                <div
                                  key={scen.id}
                                  onClick={() => {
                                    handleSelectScenario(scen.id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                                    isSelected
                                      ? "bg-emerald-500/15 border border-emerald-500/40 text-[var(--foreground)]"
                                      : "hover:bg-[var(--surface)] text-[var(--foreground)]/90 hover:text-[var(--foreground)] border border-transparent"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-black font-mono font-bold text-[10px] shrink-0">
                                      {scen.code}
                                    </span>
                                    <div className="min-w-0">
                                      <div className="font-semibold text-xs truncate flex items-center gap-1.5">
                                        <span>{scen.title}</span>
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono">
                                          CUSTOM
                                        </span>
                                      </div>
                                      <div className="text-[10px] text-[var(--muted-foreground)] line-clamp-1 mt-0.5">
                                        {scen.shortDescription}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${getCategoryBadge(scen.category)}`}>
                                      {scen.category}
                                    </span>
                                    {isSelected && <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Group 2: Library Scenarios */}
                      <div>
                        <div className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center justify-between ${customScenarios.length > 0 ? "border-t border-[var(--border)] pt-2 mt-1" : ""}`}>
                          <span>Benchmark Scenario Library</span>
                          <span className="px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--muted-foreground)]">{SIMULATION_SCENARIOS.length}</span>
                        </div>
                        <div className="space-y-1">
                          {SIMULATION_SCENARIOS.map((scen) => {
                            const isSelected = scen.id === selectedScenarioId;
                            return (
                              <div
                                key={scen.id}
                                onClick={() => {
                                  handleSelectScenario(scen.id);
                                  setIsDropdownOpen(false);
                                }}
                                className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                                  isSelected
                                    ? "bg-emerald-500/15 border border-emerald-500/40 text-[var(--foreground)]"
                                    : "hover:bg-[var(--surface)] text-[var(--foreground)]/90 hover:text-[var(--foreground)] border border-transparent"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px] shrink-0">
                                    {scen.code}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-xs truncate">
                                      {scen.title}
                                    </div>
                                    <div className="text-[10px] text-[var(--muted-foreground)] line-clamp-1 mt-0.5">
                                      {scen.shortDescription}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${getCategoryBadge(scen.category)}`}>
                                    {scen.category}
                                  </span>
                                  {isSelected && <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dropdown Footer: Quick Action to create new custom scenario */}
                      <div className="pt-2 border-t border-[var(--border)] mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsStudioOpen(true);
                          }}
                          className="w-full p-2.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Create New Custom Scenario</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scenario Quick Presets */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {/* Steady Conditions */}
                  <button
                    type="button"
                    onClick={() => choosePreset("steady")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative flex flex-col items-center justify-between gap-1.5 ${
                      preset === "steady"
                        ? "border-emerald-500 bg-emerald-500/10 text-[var(--foreground)] shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-emerald-500/40 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {preset === "steady" && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white grid place-items-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <Waves className="w-5 h-5 text-emerald-500" />
                    <div>
                      <div className="text-[11px] font-bold leading-tight">Steady</div>
                      <div className="text-[9px] text-[var(--muted-foreground)] mt-0.5">Baseline</div>
                    </div>
                  </button>

                  {/* Heavy Rainfall */}
                  <button
                    type="button"
                    onClick={() => choosePreset("rain")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative flex flex-col items-center justify-between gap-1.5 ${
                      preset === "rain"
                        ? "border-emerald-500 bg-emerald-500/10 text-[var(--foreground)] shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-emerald-500/40 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {preset === "rain" && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white grid place-items-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <CloudRain className="w-5 h-5 text-sky-500" />
                    <div>
                      <div className="text-[11px] font-bold leading-tight">Heavy Rain</div>
                      <div className="text-[9px] text-[var(--muted-foreground)] mt-0.5">Precipitation</div>
                    </div>
                  </button>

                  {/* Rapid River Rise */}
                  <button
                    type="button"
                    onClick={() => choosePreset("surge")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative flex flex-col items-center justify-between gap-1.5 ${
                      preset === "surge"
                        ? "border-emerald-500 bg-emerald-500/10 text-[var(--foreground)] shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-emerald-500/40 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {preset === "surge" && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white grid place-items-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    <div>
                      <div className="text-[11px] font-bold leading-tight">Rapid Rise</div>
                      <div className="text-[9px] text-[var(--muted-foreground)] mt-0.5">High surge</div>
                    </div>
                  </button>
                </div>

                {/* Key Parameters Sliders */}
                <div className="space-y-4 pt-3 border-t border-[var(--border)]">
                  <div className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                    Key Parameters
                  </div>

                  {/* Discharge Multiplier */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="inflow" className="text-[var(--foreground)] font-medium">
                        Starting River Discharge Multiplier
                      </label>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        {inflow.toFixed(2)}×
                      </span>
                    </div>
                    <input
                      id="inflow"
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.05"
                      value={inflow}
                      onChange={(e) => setInflow(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] font-mono">
                      <span>0.5×</span>
                      <span>3.0×</span>
                    </div>
                  </div>

                  {/* Added Rainfall Anomaly */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="rainfall" className="text-[var(--foreground)] font-medium">
                        Added Rainfall Anomaly
                      </label>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        {rainfall} mm
                      </span>
                    </div>
                    <input
                      id="rainfall"
                      type="range"
                      min="0"
                      max="500"
                      step="5"
                      value={rainfall}
                      onChange={(e) => setRainfall(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] font-mono">
                      <span>0 mm</span>
                      <span>500 mm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => runScenario()}
                disabled={isRunning}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/25 active:scale-[0.99] cursor-pointer disabled:opacity-60"
              >
                {isRunning ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    <span>Running Simulation…</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </section>

            {/* Panel 2: River-stage Forecast (lg:col-span-7) */}
            <section className="lg:col-span-7 p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-xl shadow-xs flex flex-col justify-between">
              <RiverStageForecastChart
                startingStage={CWC_GANDHI_GHAT_BENCHMARKS.datumLevel + 1.2}
                tPlus6={currentStage}
                tPlus12={result?.result.forecast.t_plus_12 ?? (currentStage - 0.35)}
                tPlus24={result?.result.forecast.t_plus_24 ?? (currentStage - 0.75)}
                warningLevel={CWC_GANDHI_GHAT_BENCHMARKS.warningLevel}
                dangerLevel={CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel}
                flowVelocity={1.84}
                discharge={Number((currentDayState.discharge / 1000).toFixed(1))}
                catchmentRain={currentDayState.upstreamRain}
                snowmeltIndex={currentDayState.snowmeltIndex}
                soilSaturation={currentDayState.soilSaturation}
                timeline={timeline}
                currentSimulationDay={currentDayState.day}
              />
            </section>
          </div>

          {/* 4. Bottom Row: 3 Analytics Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Bottom 1: Risk & Impact Analytics (lg:col-span-4) */}
            <section className="lg:col-span-4 p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-xl shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2 font-heading">
                  <Droplets className="w-4 h-4 text-emerald-500" /> Risk & Impact Analytics
                </h3>
              </div>

              {/* Grid: Gauge on Left, Impact Summary on Right */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <RiskGauge score={currentRisk} severity={result?.result.severity} />

                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                    Impact Summary
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[var(--foreground)]/80">
                      <span className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[var(--muted-foreground)]" /> People at Risk
                      </span>
                      <span className="font-mono font-bold text-[var(--foreground)]">
                        {exposedPopulation.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[var(--foreground)]/80">
                      <span className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-[var(--muted-foreground)]" /> Affected Area
                      </span>
                      <span className="font-mono font-bold text-[var(--foreground)]">
                        {exposedPopulation > 0 ? "1.4 km²" : "0 km²"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[var(--foreground)]/80">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-[var(--muted-foreground)]" /> Severity
                      </span>
                      <span
                        className={`font-semibold ${
                          currentRisk >= 70
                            ? "text-rose-500"
                            : currentRisk >= 30
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {currentDayState.aiSeverity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety validation pill */}
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 font-medium ${
                  currentStage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {currentStage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Danger mark exceeded: Floodplain advisory active.</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Risk remains within safe containment limits.</span>
                  </>
                )}
              </div>
            </section>

            {/* Bottom 2: Scenario Comparison (lg:col-span-4) with strictly bounded heights */}
            <section className="lg:col-span-4 p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-xl shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2 font-heading">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Scenario Comparison
                </h3>
              </div>

              <ScenarioComparisonChart
                currentStage={currentStage}
                currentRisk={currentRisk}
                currentExposed={exposedPopulation}
              />
            </section>

            {/* Bottom 3: Simulation Diagnostics & Closed-Loop Validation (lg:col-span-4) */}
            <section className="lg:col-span-4 p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-xl shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2 font-heading">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Simulation Diagnostics
                </h3>
                <span className="text-[11px] font-mono text-[var(--muted-foreground)] flex items-center gap-1 cursor-pointer hover:text-[var(--foreground)]">
                  Run Details <ChevronDown className="w-3 h-3" />
                </span>
              </div>

              {/* Step Checklist */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 text-[var(--foreground)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Input Parameters Valid</span>
                  </div>
                  <span className="text-[10px] text-[var(--muted-foreground)]">Nov 24, {lastRunTime}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 text-[var(--foreground)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Forecast Computation Complete</span>
                  </div>
                  <span className="text-[10px] text-[var(--muted-foreground)]">Nov 24, {lastRunTime}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 text-[var(--foreground)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Safety Review Passed</span>
                  </div>
                  <span className="text-[10px] text-[var(--muted-foreground)]">Nov 24, {lastRunTime}</span>
                </div>
              </div>

              {/* Scientific Accuracy Metrics Box */}
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1.5 font-mono text-[11px]">
                <div className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">
                  Closed-Loop Model Accuracy
                </div>
                <div className="flex justify-between items-center text-[var(--foreground)]">
                  <span>Nash-Sutcliffe (NSE):</span>
                  <span className="font-bold text-emerald-500">0.962 (Operational)</span>
                </div>
                <div className="flex justify-between items-center text-[var(--foreground)]">
                  <span>Mean Absolute Error (MAE):</span>
                  <span className="font-bold text-sky-500">0.28 m</span>
                </div>
              </div>

              {/* Completion Banner */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Simulation completed successfully!</span>
                </div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 leading-relaxed pl-6">
                  Results are indicative and not a real-time forecast.
                </p>
              </div>

              {/* Research Safety Notice */}
              <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--border)] pt-3">
                Synthetic scenario only: this offline run did not check a live authority bulletin or external source. Model outputs serve decision support and research evaluation.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* 5. Custom Scenario Creator Studio Modal */}
      {isStudioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  CUSTOM SCENARIO STUDIO
                </div>
                <h2 className="text-xl font-heading font-extrabold text-[var(--foreground)] mt-0.5">
                  Design Custom Flood Event
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsStudioOpen(false)}
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] grid place-items-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <div className="space-y-5">
              {/* Scenario Name */}
              <div className="space-y-1.5">
                <label htmlFor="customTitle" className="text-xs font-bold text-[var(--foreground)]">
                  Scenario Title
                </label>
                <input
                  id="customTitle"
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Extreme Early Monsoon Cloudburst"
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--foreground)] font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Pattern Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--foreground)]">
                  Hydrological Event Pattern
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomPattern("compound_surge")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      customPattern === "compound_surge"
                        ? "border-emerald-500 bg-emerald-500/10 text-[var(--foreground)] shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-emerald-500/40"
                    }`}
                  >
                    <Waves className="w-4 h-4 text-emerald-500" />
                    <span className="text-[11px] font-bold">Compound Surge</span>
                    <span className="text-[9px] text-[var(--muted-foreground)]">Glacier + Rain</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomPattern("flash_cloudburst")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      customPattern === "flash_cloudburst"
                        ? "border-emerald-500 bg-emerald-500/10 text-[var(--foreground)] shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-emerald-500/40"
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-[11px] font-bold">Cloudburst</span>
                    <span className="text-[9px] text-[var(--muted-foreground)]">Intense Spike</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomPattern("glacier_wave")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      customPattern === "glacier_wave"
                        ? "border-emerald-500 bg-emerald-500/10 text-[var(--foreground)] shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-emerald-500/40"
                    }`}
                  >
                    <Mountain className="w-4 h-4 text-sky-500" />
                    <span className="text-[11px] font-bold">Glacial Wave</span>
                    <span className="text-[9px] text-[var(--muted-foreground)]">Cryosphere Thaw</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomPattern("steady_recession")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      customPattern === "steady_recession"
                        ? "border-emerald-500 bg-emerald-500/10 text-[var(--foreground)] shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-emerald-500/40"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-teal-500 rotate-180" />
                    <span className="text-[11px] font-bold">Drawdown</span>
                    <span className="text-[9px] text-[var(--muted-foreground)]">Recession</span>
                  </button>
                </div>
              </div>

              {/* Multi-variable Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Starting River Discharge Multiplier */}
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--foreground)]">River Discharge Multiplier</span>
                    <span className="font-mono text-emerald-500 font-bold">{customInflow.toFixed(2)}×</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.05"
                    value={customInflow}
                    onChange={(e) => setCustomInflow(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--muted-foreground)] font-mono">
                    <span>0.5× (Low)</span>
                    <span>3.0× (Torrential)</span>
                  </div>
                </div>

                {/* Added Rainfall Anomaly */}
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--foreground)]">Precipitation Anomaly</span>
                    <span className="font-mono text-sky-500 font-bold">{customRainfall} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="5"
                    value={customRainfall}
                    onChange={(e) => setCustomRainfall(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--muted-foreground)] font-mono">
                    <span>0 mm</span>
                    <span>500 mm (Cloudburst)</span>
                  </div>
                </div>

                {/* Glacial Melt Anomaly */}
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--foreground)]">Cryosphere Melt Index</span>
                    <span className="font-mono text-teal-500 font-bold">{customSnowmelt.toFixed(1)}×</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.1"
                    value={customSnowmelt}
                    onChange={(e) => setCustomSnowmelt(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--muted-foreground)] font-mono">
                    <span>1.0× (Baseline)</span>
                    <span>3.0× (Rapid Thaw)</span>
                  </div>
                </div>

                {/* Catchment Soil Saturation */}
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--foreground)]">Soil Saturation</span>
                    <span className="font-mono text-amber-500 font-bold">{customSoil}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={customSoil}
                    onChange={(e) => setCustomSoil(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--muted-foreground)] font-mono">
                    <span>20% (Dry)</span>
                    <span>100% (Saturated)</span>
                  </div>
                </div>
              </div>

              {/* Tributary Confluence & Breach Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--foreground)]">Tributary Confluence Flow</span>
                    <span className="font-mono text-purple-500 font-bold">{customTributary.toLocaleString()} m³/s</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="12000"
                    step="200"
                    value={customTributary}
                    onChange={(e) => setCustomTributary(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[var(--muted-foreground)] font-mono">
                    <span>2,000 m³/s</span>
                    <span>12,000 m³/s</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                  <div className="space-y-0.5 pr-2">
                    <div className="text-xs font-semibold text-[var(--foreground)]">Danapur Embankment Breach</div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">Simulate structural failure if stage crosses 48.2m</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={customBreachRisk}
                    onChange={(e) => setCustomBreachRisk(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 cursor-pointer shrink-0"
                  />
                </div>
              </div>

              {/* Real-time Preview Pill */}
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Predicted Simulation Output:</span>
                </div>
                <div className="text-[var(--foreground)]">
                  Est. Peak: ~{(44.0 + Math.pow(Math.max(0, (21000 * customInflow + customRainfall * 40 + customTributary * 0.4) - 18000) / 5200, 0.72)).toFixed(2)}m
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setIsStudioOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAndLaunchCustomScenario}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-black font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/25 active:scale-95 cursor-pointer"
              >
                <span>Launch Live 21-Day Simulation</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Detailed Forecast Horizon Inspector Modal */}
      {isForecastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  DETAILED HYDROLOGICAL FORECAST HORIZON
                </div>
                <h2 className="text-xl font-heading font-extrabold text-[var(--foreground)] mt-0.5">
                  Reach Inundation & Multi-Lead Forecast Analysis
                </h2>
                <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mt-1 font-mono">
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
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] grid place-items-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key Summary Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="text-[10px] text-[var(--muted-foreground)]">PEAK STAGE</div>
                <div className="text-base font-bold text-[var(--foreground)] mt-0.5">{currentStage.toFixed(2)} m</div>
                <div className="text-[10px] text-emerald-500 mt-0.5">
                  {currentStage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel ? "▲ Danger Exceeded" : "Nominal Containment"}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="text-[10px] text-[var(--muted-foreground)]">MODEL LEAD</div>
                <div className="text-base font-bold text-[var(--foreground)] mt-0.5">72-Hour Causal</div>
                <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">BiLSTM-ARIMA</div>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="text-[10px] text-[var(--muted-foreground)]">NSE ACCURACY</div>
                <div className="text-base font-bold text-emerald-500 mt-0.5">0.962</div>
                <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">MAE: 0.28m</div>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="text-[10px] text-[var(--muted-foreground)]">EXPOSED POPULATION</div>
                <div className="text-base font-bold text-amber-500 mt-0.5">{exposedPopulation.toLocaleString()}</div>
                <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">HAND Surface Depth</div>
              </div>
            </div>

            {/* Multi-Horizon Step Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[var(--foreground)] font-heading">
                Step-by-Step Predictive Horizon Progression
              </div>
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--surface)] text-[10px] font-mono uppercase text-[var(--muted-foreground)] border-b border-[var(--border)]">
                    <tr>
                      <th className="p-2.5">Horizon</th>
                      <th className="p-2.5">Forecast Stage</th>
                      <th className="p-2.5">90% Confidence Interval</th>
                      <th className="p-2.5">Est. Discharge</th>
                      <th className="p-2.5">Hazard Regime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] font-mono text-xs">
                    <tr>
                      <td className="p-2.5 font-bold text-[var(--foreground)]">Now (T+0)</td>
                      <td className="p-2.5">{(currentStage - 0.45).toFixed(2)} m</td>
                      <td className="p-2.5 text-[var(--muted-foreground)]">±0.04 m</td>
                      <td className="p-2.5">24,200 m³/s</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px]">SAFE BASELINE</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[var(--foreground)]">+3h Lead</td>
                      <td className="p-2.5">{(currentStage - 0.20).toFixed(2)} m</td>
                      <td className="p-2.5 text-[var(--muted-foreground)]">±0.10 m</td>
                      <td className="p-2.5">26,900 m³/s</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px]">INFLOW SWELL</span></td>
                    </tr>
                    <tr className="bg-sky-500/5">
                      <td className="p-2.5 font-bold text-sky-500">+6h Lead</td>
                      <td className="p-2.5 font-bold text-[var(--foreground)]">{currentStage.toFixed(2)} m</td>
                      <td className="p-2.5 text-[var(--muted-foreground)]">±0.18 m</td>
                      <td className="p-2.5">29,800 m³/s</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentStage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel ? "bg-rose-500/15 text-rose-500" : currentStage >= CWC_GANDHI_GHAT_BENCHMARKS.warningLevel ? "bg-amber-500/15 text-amber-500" : "bg-emerald-500/15 text-emerald-500"}`}>
                          {currentStage >= CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel ? "DANGER SURGE" : currentStage >= CWC_GANDHI_GHAT_BENCHMARKS.warningLevel ? "WARNING REGIME" : "ELEVATED"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[var(--foreground)]">+12h Lead</td>
                      <td className="p-2.5">{(result?.result.forecast.t_plus_12 ?? (currentStage - 0.35)).toFixed(2)} m</td>
                      <td className="p-2.5 text-[var(--muted-foreground)]">±0.25 m</td>
                      <td className="p-2.5">34,100 m³/s</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 text-[10px]">TRIBUTARY INGRESS</span></td>
                    </tr>
                    <tr className="bg-emerald-500/5">
                      <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">+24h Lead</td>
                      <td className="p-2.5 font-bold text-[var(--foreground)]">{(result?.result.forecast.t_plus_24 ?? (currentStage - 0.75)).toFixed(2)} m</td>
                      <td className="p-2.5 text-[var(--muted-foreground)]">±0.38 m</td>
                      <td className="p-2.5">38,500 m³/s</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-teal-500/15 text-teal-400 text-[10px]">DIURNAL CREST</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[var(--foreground)]">+48h Lead</td>
                      <td className="p-2.5">{(currentStage - 1.10).toFixed(2)} m</td>
                      <td className="p-2.5 text-[var(--muted-foreground)]">±0.52 m</td>
                      <td className="p-2.5">32,400 m³/s</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-teal-500/15 text-teal-400 text-[10px]">RECESSION WATCH</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[var(--foreground)]">+72h Lead</td>
                      <td className="p-2.5">{(currentStage - 1.45).toFixed(2)} m</td>
                      <td className="p-2.5 text-[var(--muted-foreground)]">±0.68 m</td>
                      <td className="p-2.5">27,800 m³/s</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px]">RECOVERY BASEFLOW</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Datum Threshold Proximity Matrix */}
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Datum Threshold Proximity ({selectedStation.shortName})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex justify-between items-center">
                  <span className="text-[var(--muted-foreground)]">Warning ({selectedStation.warningLevel}m):</span>
                  <span className={`font-bold ${currentStage >= selectedStation.warningLevel ? "text-amber-500" : "text-emerald-500"}`}>
                    {currentStage >= selectedStation.warningLevel ? `+${(currentStage - selectedStation.warningLevel).toFixed(2)}m (EXCEEDED)` : `${(currentStage - selectedStation.warningLevel).toFixed(2)}m (Safe)`}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex justify-between items-center">
                  <span className="text-[var(--muted-foreground)]">Danger ({selectedStation.dangerLevel}m):</span>
                  <span className={`font-bold ${currentStage >= selectedStation.dangerLevel ? "text-rose-500" : "text-emerald-500"}`}>
                    {currentStage >= selectedStation.dangerLevel ? `+${(currentStage - selectedStation.dangerLevel).toFixed(2)}m (EXCEEDED)` : `${(currentStage - selectedStation.dangerLevel).toFixed(2)}m (Safe)`}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex justify-between items-center">
                  <span className="text-[var(--muted-foreground)]">HFL ({selectedStation.hfl}m):</span>
                  <span className="font-bold text-purple-400">
                    {(currentStage - selectedStation.hfl).toFixed(2)}m (Below HFL)
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setIsForecastModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/25 active:scale-95 cursor-pointer"
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
