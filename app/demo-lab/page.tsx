"use client";

import React, { useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { HydrologicalChart } from "@/components/shared/HydrologicalChart";
import {
  Shield,
  Droplets,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface ScenarioData {
  stage: string;
  rain: string;
  gate: string;
  review: string;
  n: string;
  pre: string;
  mid: string;
  post: string;
  isSurge: boolean;
}

const SCENARIOS: Record<string, ScenarioData> = {
  normal: {
    stage: "49.12",
    rain: "2",
    gate: "Pass (Nominal)",
    review: "Normal monitoring",
    n: "Baseline scenario: Hydrograph inputs remain within seasonal average. Zero threshold breaches predicted over 48h horizon.",
    pre: "Telemetry quality checks passed across all 8 basin stations.",
    mid: "Ensemble disagreement: 0.04 m (High agreement).",
    post: "Downstream corroboration verified.",
    isSurge: false,
  },
  rain: {
    stage: "50.45",
    rain: "45",
    gate: "Pass (Watch)",
    review: "Advisory review",
    n: "Heavy rainfall scenario: Upstream precipitation spikes detected. Catchment runoff model predicts rapid stage increase in 18 hours.",
    pre: "Input verified with IMD radar precipitation data.",
    mid: "Ensemble spread indicates possible 0.6 m rise in downstream sector.",
    post: "Satellite extent comparison flagged for human inspection.",
    isSurge: true,
  },
  rise: {
    stage: "52.30",
    rain: "85",
    gate: "Review (Critical)",
    review: "Escalate to Commander",
    n: "Rapid river-rise scenario: Gauges indicate stage approaching high flood danger mark. Rate of rise: +0.35 m/hour.",
    pre: "Telemetry flagged rate-of-rise threshold exceeded.",
    mid: "Ensemble indicates warning level breach in Sector 04 within 12h.",
    post: "Immediate commander-authorized CAP advisory recommended.",
    isSurge: true,
  },
  sensor: {
    stage: "49.95",
    rain: "18",
    gate: "Hold (Degraded)",
    review: "Manual review",
    n: "Sensor conflict scenario: Station 03 and Station 04 report divergent stage readings (+1.4 m difference). Pipeline paused to prevent false alerts.",
    pre: "Sensor consistency check flagged divergence.",
    mid: "Secondary satellite SAR fallback invoked.",
    post: "Physical inspection dispatched before advisory release.",
    isSurge: false,
  },
  satellite: {
    stage: "49.80",
    rain: "12",
    gate: "Degraded",
    review: "Limited spatial data",
    n: "Satellite unavailable scenario: Cloud cover restricts optical sensors. SAR synthetic aperture radar pipeline active in fallback mode.",
    pre: "Optical feed marked degraded.",
    mid: "Proceeding with hydrological gauge committee only.",
    post: "Spatial confidence adjusted to 0.72.",
    isSurge: false,
  },
};

export default function DemoLabPage() {
  const [selectedKey, setSelectedKey] = useState<string>("normal");
  const [studyContext, setStudyContext] = useState<string>("patna");
  const [stageInput, setStageInput] = useState<string>(SCENARIOS.normal.stage);
  const [rainInput, setRainInput] = useState<string>(SCENARIOS.normal.rain);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<ScenarioData>(SCENARIOS.normal);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleScenarioChange = (key: string) => {
    setSelectedKey(key);
    const preset = SCENARIOS[key];
    setStageInput(preset.stage);
    setRainInput(preset.rain);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const base = SCENARIOS[selectedKey];
      const numericStage = parseFloat(stageInput) || 49.12;
      const numericRain = parseFloat(rainInput) || 2;
      const isSurge = base.isSurge || numericStage >= 50.5 || numericRain >= 40;
      setActiveData({
        ...base,
        stage: `${numericStage.toFixed(2)} m`,
        rain: `${numericRain} mm/hr`,
        isSurge,
      });
      setIsRunning(false);
      showToast("Synthetic simulation pipeline executed.");
    }, 350);
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col gap-8">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#292925] border border-[#2F6BFF]/40 text-xs font-mono text-[#D8CBB3] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2F6BFF]" /> {toastMessage}
        </div>
      )}

      {/* Page Hero */}
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">SIMULATION LAB · SYNTHETIC ENVIRONMENT</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#D8CBB3] tracking-tight">
            Explore controlled flood scenarios.
          </h1>
          <p className="text-sm sm:text-base text-[#A69B88] mt-3 leading-relaxed">
            Configure synthetic river-stage and rainfall parameters to inspect how SURAKSHA’s forecasting committee and Pre-Run, Mid-Run, and Post-Run verification gates evaluate flood evidence. Every value on this page is labeled <span className="font-mono text-[#EDE4D3]">SYNTHETIC</span> and is not an official government forecast.
          </p>
        </div>
      </FadeIn>

      {/* Configuration Panel */}
      <FadeIn delay={0.1}>
        <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D8CBB3]/12">
            <div>
              <h3 className="text-base font-bold text-[#EDE4D3]">Scenario & Parameter Configuration</h3>
              <p className="text-xs text-[#A69B88]">
                Select a preset or customize river-stage and rainfall inputs
              </p>
            </div>
            <span className="pill self-start sm:self-auto">
              <i className="dot amber" /> DATA: SYNTHETIC SIMULATION
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-[#D8CBB3] uppercase tracking-wider">
                Scenario Selector
              </label>
              <select
                value={selectedKey}
                onChange={(e) => handleScenarioChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs font-medium text-[#D8CBB3] focus:outline-none focus:border-[#2F6BFF]"
              >
                <option value="normal">Normal river conditions</option>
                <option value="rain">Heavy rainfall upstream</option>
                <option value="rise">Rapid river rise (Surge)</option>
                <option value="sensor">Conflicting sensor data</option>
                <option value="satellite">Satellite unavailable</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-[#D8CBB3] uppercase tracking-wider">
                Study-Area Selector
              </label>
              <select
                value={studyContext}
                onChange={(e) => setStudyContext(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs font-medium text-[#D8CBB3] focus:outline-none focus:border-[#2F6BFF]"
              >
                <option value="patna">Ganga Basin · Patna Reach</option>
                <option value="sone">Sone Confluence · Maner</option>
                <option value="gandak">Gandak Reach · Hajipur</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-[#D8CBB3] uppercase tracking-wider">
                River-Stage Input (m)
              </label>
              <input
                type="number"
                step="0.05"
                value={stageInput}
                onChange={(e) => setStageInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs font-mono text-[#EDE4D3] focus:outline-none focus:border-[#2F6BFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-[#D8CBB3] uppercase tracking-wider">
                Rainfall Input (mm/hr)
              </label>
              <input
                type="number"
                step="1"
                value={rainInput}
                onChange={(e) => setRainInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs font-mono text-[#EDE4D3] focus:outline-none focus:border-[#2F6BFF]"
              />
            </div>

            <div>
              <Button
                onClick={handleRun}
                disabled={isRunning}
                className="w-full h-[40px] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
              >
                {isRunning ? (
                  "Running..."
                ) : (
                  <>
                    Run Simulation <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* 4 Forecast Output Stat Cards */}
      <FadeIn delay={0.15}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A69B88]">
              <span>River-stage input</span>
              <Droplets className="w-4 h-4 text-[#2F6BFF]" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#EDE4D3]">
              {activeData.stage.includes("m") ? activeData.stage : `${activeData.stage} m`}
            </div>
            <div className="text-[11px] font-mono text-[#A69B88]">SYNTHETIC · {studyContext.toUpperCase()}</div>
          </div>

          <div className="p-5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A69B88]">
              <span>Rainfall input</span>
              <Activity className="w-4 h-4 text-[#2F6BFF]" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#EDE4D3]">
              {activeData.rain.includes("mm") ? activeData.rain : `${activeData.rain} mm/hr`}
            </div>
            <div className="text-[11px] font-mono text-[#A69B88]">SYNTHETIC HYETOGRAPH</div>
          </div>

          <div className="p-5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A69B88]">
              <span>Gate decision</span>
              <Shield className="w-4 h-4 text-[#2F6BFF]" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#2F6BFF]">{activeData.gate}</div>
            <div className="text-[11px] font-mono text-[#A69B88]">Analytical gate verdict</div>
          </div>

          <div className="p-5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A69B88]">
              <span>Supervisory state</span>
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="text-xl font-extrabold font-mono text-[#F59E0B]">{activeData.review}</div>
            <div className="text-[11px] font-mono text-[#A69B88]">Not an official warning</div>
          </div>
        </div>
      </FadeIn>

      {/* Hydrograph Chart Section */}
      <FadeIn delay={0.2}>
        <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D8CBB3]/12">
            <div>
              <h3 className="text-base font-bold text-[#EDE4D3]">
                Simulated Ensemble Hydrograph & Rainfall Response
              </h3>
              <p className="text-xs text-[#A69B88]">
                Observed stage, Electric Blue forecast curve, 90% confidence spread, Warning (50.5m) & Danger (51.8m) lines
              </p>
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[#33332E] text-[#D8CBB3] border border-[#D8CBB3]/20">
              SYNTHETIC HYDROGRAPH
            </span>
          </div>
          <HydrologicalChart isSurge={activeData.isSurge} />
        </div>
      </FadeIn>

      {/* Two Columns: Gate Review Cards vs Scenario Response Pathway */}
      <FadeIn delay={0.25}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Forecast Outputs & Gate Review Cards */}
          <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
              <h3 className="text-base font-bold text-[#EDE4D3]">
                Pre-Run, Mid-Run & Post-Run Gate Review
              </h3>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                SYNTHETIC
              </span>
            </div>

            <p className="text-xs text-[#D8CBB3] leading-relaxed">{activeData.n}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl border border-[#D8CBB3]/15 bg-[#1E1E1C] space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-[#2F6BFF] block">GATE 01 · PRE-RUN</span>
                <strong className="text-xs font-bold text-[#EDE4D3] block">Input Integrity</strong>
                <p className="text-[11px] text-[#A69B88] leading-normal">{activeData.pre}</p>
              </div>

              <div className="p-4 rounded-xl border border-[#D8CBB3]/15 bg-[#1E1E1C] space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-[#2F6BFF] block">GATE 02 · MID-RUN</span>
                <strong className="text-xs font-bold text-[#EDE4D3] block">Model Convergence</strong>
                <p className="text-[11px] text-[#A69B88] leading-normal">{activeData.mid}</p>
              </div>

              <div className="p-4 rounded-xl border border-[#D8CBB3]/15 bg-[#1E1E1C] space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-[#2F6BFF] block">GATE 03 · POST-RUN</span>
                <strong className="text-xs font-bold text-[#EDE4D3] block">CAP Readiness</strong>
                <p className="text-[11px] text-[#A69B88] leading-normal">{activeData.post}</p>
              </div>
            </div>
          </div>

          {/* Right Panel: Scenario Response Pathway */}
          <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
              <h3 className="text-base font-bold text-[#EDE4D3]">Scenario Response Pathway</h3>
              <small className="text-xs font-mono text-[#A69B88]">Decision-Support Pipeline</small>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#2F6BFF]/15 border border-[#2F6BFF]/30 grid place-items-center text-xs font-mono font-bold text-[#2F6BFF] shrink-0">
                  01
                </div>
                <div>
                  <strong className="text-xs font-bold text-[#EDE4D3] block">
                    Pre-Run Input Quality Check
                  </strong>
                  <p className="text-xs text-[#A69B88] mt-0.5 leading-relaxed">
                    Verify station quorum, gauge timestamp freshness, and physical river-stage bounds before executing ensemble forecasts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#2F6BFF]/15 border border-[#2F6BFF]/30 grid place-items-center text-xs font-mono font-bold text-[#2F6BFF] shrink-0">
                  02
                </div>
                <div>
                  <strong className="text-xs font-bold text-[#EDE4D3] block">
                    Mid-Run Ensemble & Spatial Analysis
                  </strong>
                  <p className="text-xs text-[#A69B88] mt-0.5 leading-relaxed">
                    Compute 6h/24h/72h stage trajectories, 90% confidence intervals, and Sentinel-1 SAR inundation polygons.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#2F6BFF]/15 border border-[#2F6BFF]/30 grid place-items-center text-xs font-mono font-bold text-[#2F6BFF] shrink-0">
                  03
                </div>
                <div>
                  <strong className="text-xs font-bold text-[#EDE4D3] block">
                    Post-Run Human-in-the-Loop Oversight
                  </strong>
                  <p className="text-xs text-[#A69B88] mt-0.5 leading-relaxed">
                    Stage OASIS CAP v1.2 draft advisories for human commander authorization before public broadcast.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Notice Banner */}
      <div className="notice">
        <strong className="text-[#EDE4D3]">Simulation Disclaimer:</strong> This simulation demonstrates scientific decision-support interface behaviour only; it does not dispatch public alerts or replace authoritative government emergency management protocols.
      </div>
    </div>
  );
}
