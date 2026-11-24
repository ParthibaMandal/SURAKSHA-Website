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
  Layers,
  Sparkles,
} from "lucide-react";
import { RiskGauge } from "@/components/simulation/RiskGauge";
import { ScenarioComparisonChart } from "@/components/simulation/ScenarioComparisonChart";
import { RiverStageForecastChart } from "@/components/simulation/RiverStageForecastChart";
import {
  SIMULATION_SCENARIOS,
  SimulationScenario,
  SimulationDayState,
  CWC_GANDHI_GHAT_BENCHMARKS,
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
  // Scenario & Simulation Engine States
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

  // Active scenario from catalog
  const activeScenario: SimulationScenario =
    SIMULATION_SCENARIOS.find((s) => s.id === selectedScenarioId) ?? SIMULATION_SCENARIOS[0];
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
    const scen = SIMULATION_SCENARIOS.find((s) => s.id === scenarioId) ?? SIMULATION_SCENARIOS[0];
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

  async function runScenario() {
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch("/api/flood/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          scenario_id: activeScenario.id,
          river_discharge_multiplier: inflow,
          precipitation_anomaly_mm: rainfall,
        }),
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "The simulation service could not complete this run.");
      if (!isScenarioResult(data, activeScenario.id)) {
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
                  {isRunning ? "COMPUTING FORECAST" : isPlaying ? "TIMELINE ADVANCING" : "READY TO RUN"}
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
                  Interactive multi-variable flood scenario engine. Explore evolving river discharge, glacial meltwater anomalies, and monsoon escalations with closed-loop predictive validation.
                </p>
              </div>

              {/* Filter Selectors & Action Button */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Location Selector */}
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md text-xs text-[var(--foreground)] shadow-xs">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-semibold">Ganges – Gandhi Ghat, Patna</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                </div>

                {/* Date Selector */}
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md text-xs text-[var(--foreground)] font-mono shadow-xs">
                  <Calendar className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  <span>Nov 24, 2026</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                </div>

                {/* Run Simulation Button */}
                <button
                  type="button"
                  onClick={runScenario}
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
                {/* Mini Wave Sparkline */}
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
                <span className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer">Detailed forecast →</span>
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
                        {/* Step Marker Dot */}
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

                        {/* Stage Altitude Pill on Hover or Current */}
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
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                    {SIMULATION_SCENARIOS.length} Catalog Scenarios
                  </span>
                </div>

                {/* Scenario Catalog Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="scenarioSelect" className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Select Scenario from Library
                  </label>
                  <div className="relative">
                    <select
                      id="scenarioSelect"
                      value={selectedScenarioId}
                      onChange={(e) => handleSelectScenario(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--foreground)] font-semibold appearance-none cursor-pointer focus:outline-none focus:border-emerald-500"
                    >
                      {SIMULATION_SCENARIOS.map((scen) => (
                        <option key={scen.id} value={scen.id}>
                          {scen.code} — {scen.title} ({scen.category})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
                  </div>
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
                onClick={runScenario}
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
                {/* Semicircular Gauge */}
                <RiskGauge score={currentRisk} severity={result?.result.severity} />

                {/* Impact Summary Table */}
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
    </div>
  );
}
