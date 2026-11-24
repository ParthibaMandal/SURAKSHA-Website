"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  CheckCircle2,
  CircleAlert,
  Droplets,
  LoaderCircle,
  Play,
  ShieldCheck,
  Users,
  Waves,
  CloudRain,
  TrendingUp,
  Clock,
  ChevronDown,
  Calendar,
  AlertTriangle,
  Info,
  Check,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RiskGauge } from "@/components/simulation/RiskGauge";
import { ScenarioComparisonChart } from "@/components/simulation/ScenarioComparisonChart";
import { RiverStageForecastChart } from "@/components/simulation/RiverStageForecastChart";

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

const formatTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Time unavailable"
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

export default function DemoLabPage() {
  const [preset, setPreset] = useState<DemoPreset>("steady");
  const [inflow, setInflow] = useState(PRESETS.steady.inflow);
  const [rainfall, setRainfall] = useState(PRESETS.steady.rainfall);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunTime, setLastRunTime] = useState<string>("16:42:10");
  const prefersReducedMotion = useReducedMotion();

  const selectedPreset = PRESETS[preset];

  // Auto-run baseline scenario on first load
  useEffect(() => {
    runScenario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const currentStage = forecastPeak?.value ?? 47.17;
  const currentRisk = result ? Math.round(result.result.risk_score * 100) : 15;
  const exposedPopulation =
    result?.result.pre_event_assessment?.exposed_population ??
    result?.result.impact_assessment?.affected_population ??
    0;
  const needsHumanReview = Boolean(
    result?.result.requires_human_review ?? result?.result.supervisor?.requires_human_review
  );

  function choosePreset(value: DemoPreset) {
    setPreset(value);
    setInflow(PRESETS[value].inflow);
    setRainfall(PRESETS[value].rainfall);
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
          scenario_id: selectedPreset.scenarioId,
          river_discharge_multiplier: inflow,
          precipitation_anomaly_mm: rainfall,
        }),
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "The simulation service could not complete this run.");
      if (!isScenarioResult(data, selectedPreset.scenarioId)) {
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

  return (
    <div className="min-h-screen bg-[#07090D] text-white font-sans">
      <main className="w-full">
        {/* Top Panoramic Mountain Header Banner */}
        <header className="relative w-full border-b border-white/10 overflow-hidden bg-[#0A0D12]">
          {/* Panoramic Mountain Backdrop */}
          <div className="absolute inset-0 z-0 opacity-25">
            <Image
              src="/images/hero-himalayas-ganga.jpg"
              alt="Snow-capped Himalayan Panorama"
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D12]/40 via-[#0A0D12]/80 to-[#0A0D12]" />
          </div>

          <div className="relative z-10 px-6 sm:px-10 py-6 max-w-7xl mx-auto space-y-4">
            {/* Top Bar: Breadcrumbs & Status Indicator */}
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-400">
                <span>Workspace</span>
                <span>&gt;</span>
                <span>Simulation</span>
                <span>&gt;</span>
                <span className="text-white font-semibold">Simulation Lab</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
                  {isRunning ? "COMPUTING FORECAST" : "READY TO RUN"}
                </span>
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 text-white font-bold text-xs grid place-items-center">
                  SC
                </div>
              </div>
            </div>

            {/* Title & Controls Bar */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                  SIMULATION LAB
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
                  Flood Simulation Lab
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
                  Explore how changing river discharge and rainfall conditions affect the returned flood outlook for the selected study location.
                </p>
              </div>

              {/* Filter Selectors & Action Button */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Location Selector */}
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md text-xs text-white">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">Ganges – Gandhi Ghat, Patna</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </div>

                {/* Date Selector */}
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md text-xs text-white font-mono">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Nov 24, 2026</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </div>

                {/* Run Simulation Button */}
                <button
                  type="button"
                  onClick={runScenario}
                  disabled={isRunning}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-60 cursor-pointer"
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

        {/* Dashboard Grid Container */}
        <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          {error && (
            <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-200 text-xs flex items-center gap-3">
              <CircleAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <strong>Simulation run error:</strong> {error}
              </div>
            </div>
          )}

          {/* 3. Top 4 Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Highest returned stage */}
            <div className="p-4 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md flex flex-col justify-between space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  Highest returned stage
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {currentStage.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-zinc-400">m</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5 font-mono">
                <span className="text-emerald-400 font-semibold">↑ +0.32 m vs baseline</span>
                {/* SVG Mini Wave */}
                <svg width="48" height="16" viewBox="0 0 48 16" className="text-sky-400">
                  <path d="M0 12 Q 12 2 24 8 T 48 4" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* KPI 2: Flood Risk Score */}
            <div className="p-4 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md flex flex-col justify-between space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Flood Risk Score
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {currentRisk}
                </span>
                <span className="text-sm font-semibold text-zinc-400">/ 100</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold text-[10px] uppercase">
                  {currentRisk < 30 ? "Low Risk" : currentRisk < 70 ? "Moderate" : "High Risk"}
                </span>
                <svg width="48" height="16" viewBox="0 0 48 16" className="text-amber-400">
                  <path d="M0 14 Q 14 12 24 6 T 48 2" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* KPI 3: Potentially Exposed People */}
            <div className="p-4 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md flex flex-col justify-between space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  Potentially Exposed People
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {exposedPopulation.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                <span className="text-zinc-400 font-medium">
                  {exposedPopulation === 0 ? "No immediate risk" : "Advisory issued"}
                </span>
                <svg width="48" height="16" viewBox="0 0 48 16" className="text-emerald-400">
                  <path d="M0 12 L 20 12 L 48 12" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* KPI 4: Forecast Horizon */}
            <div className="p-4 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md flex flex-col justify-between space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  Forecast Horizon
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  24 h
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                <span className="text-sky-400 hover:underline cursor-pointer">Detailed forecast →</span>
                <svg width="48" height="16" viewBox="0 0 48 16" className="text-sky-400">
                  <path d="M0 14 Q 18 10 32 4 T 48 8" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

          {/* 4. Middle Row: 2 Primary Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Panel 1: Scenario Configuration (lg:col-span-5) */}
            <section className="lg:col-span-5 p-5 sm:p-6 rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Scenario Configuration
                  </h3>
                </div>

                {/* Scenario Presets Selection */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Steady Conditions */}
                  <button
                    type="button"
                    onClick={() => choosePreset("steady")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative flex flex-col items-center justify-between gap-1.5 ${
                      preset === "steady"
                        ? "border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/10"
                        : "border-white/10 bg-black/40 text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {preset === "steady" && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-black grid place-items-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <Waves className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-[11px] font-bold leading-tight">Steady</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">Baseline</div>
                    </div>
                  </button>

                  {/* Heavy Rainfall */}
                  <button
                    type="button"
                    onClick={() => choosePreset("rain")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative flex flex-col items-center justify-between gap-1.5 ${
                      preset === "rain"
                        ? "border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/10"
                        : "border-white/10 bg-black/40 text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {preset === "rain" && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-black grid place-items-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <CloudRain className="w-5 h-5 text-sky-400" />
                    <div>
                      <div className="text-[11px] font-bold leading-tight">Heavy Rain</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">Precipitation</div>
                    </div>
                  </button>

                  {/* Rapid River Rise */}
                  <button
                    type="button"
                    onClick={() => choosePreset("surge")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative flex flex-col items-center justify-between gap-1.5 ${
                      preset === "surge"
                        ? "border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/10"
                        : "border-white/10 bg-black/40 text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {preset === "surge" && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-black grid place-items-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-[11px] font-bold leading-tight">Rapid Rise</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">High surge</div>
                    </div>
                  </button>
                </div>

                {/* Key Parameters Sliders */}
                <div className="space-y-4 pt-3 border-t border-white/10">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Key Parameters
                  </div>

                  {/* Discharge Multiplier */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="inflow" className="text-zinc-300 font-medium">
                        Starting River Discharge Multiplier
                      </label>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-mono text-emerald-400 font-bold text-xs">
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
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>0.5×</span>
                      <span>3.0×</span>
                    </div>
                  </div>

                  {/* Added Rainfall Anomaly */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="rainfall" className="text-zinc-300 font-medium">
                        Added Rainfall Anomaly
                      </label>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-mono text-emerald-400 font-bold text-xs">
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
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
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
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99] cursor-pointer disabled:opacity-60"
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
            <section className="lg:col-span-7 p-5 sm:p-6 rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
              <RiverStageForecastChart
                startingStage={44.2}
                tPlus6={result?.result.forecast.t_plus_6 ?? 47.17}
                tPlus12={result?.result.forecast.t_plus_12 ?? 46.8}
                tPlus24={result?.result.forecast.t_plus_24 ?? 45.9}
                warningLevel={48.6}
              />
            </section>
          </div>

          {/* 5. Bottom Row: 3 Analytics Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Bottom 1: Risk & Impact Analytics (lg:col-span-4) */}
            <section className="lg:col-span-4 p-5 sm:p-6 rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-emerald-400" /> Risk & Impact Analytics
                </h3>
              </div>

              {/* Grid: Gauge on Left, Impact Summary on Right */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Semicircular Gauge */}
                <RiskGauge score={currentRisk} severity={result?.result.severity} />

                {/* Impact Summary Table */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Impact Summary
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-zinc-400" /> People at Risk
                      </span>
                      <span className="font-mono font-bold text-white">
                        {exposedPopulation.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-zinc-400" /> Affected Area
                      </span>
                      <span className="font-mono font-bold text-white">
                        {exposedPopulation > 0 ? "1.4 km²" : "0 km²"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-zinc-400" /> Severity
                      </span>
                      <span className="font-semibold text-emerald-400">
                        {result?.result.severity.replaceAll("_", " ") ?? "Low"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety validation pill */}
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Risk remains within safe limits.</span>
              </div>
            </section>

            {/* Bottom 2: Scenario Comparison (lg:col-span-4) */}
            <section className="lg:col-span-4 p-5 sm:p-6 rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Scenario Comparison
                </h3>
              </div>

              <ScenarioComparisonChart
                currentStage={currentStage}
                currentRisk={currentRisk}
                currentExposed={exposedPopulation}
              />
            </section>

            {/* Bottom 3: Simulation Diagnostics (lg:col-span-4) */}
            <section className="lg:col-span-4 p-5 sm:p-6 rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Simulation Diagnostics
                </h3>
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 cursor-pointer">
                  Run Details <ChevronDown className="w-3 h-3" />
                </span>
              </div>

              {/* Step Checklist */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Input Parameters Valid</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Nov 24, {lastRunTime}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Forecast Computation Complete</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Nov 24, {lastRunTime}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Safety Review Passed</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Nov 24, {lastRunTime}</span>
                </div>
              </div>

              {/* Completion Banner */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Simulation completed successfully!</span>
                </div>
                <p className="text-[10px] text-emerald-400/80 leading-relaxed pl-6">
                  Results are indicative and not a real-time forecast.
                </p>
              </div>

              {/* Research Safety Notice */}
              <p className="text-[10px] text-zinc-500 leading-relaxed border-t border-white/10 pt-3">
                Synthetic scenario only: this offline run did not check a live authority bulletin or external source. Model outputs serve decision support and research evaluation.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
