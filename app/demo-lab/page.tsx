"use client";

import React, { useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { PlayCircle, Shield, Droplets, Activity, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

interface ScenarioData {
  stage: string;
  rain: string;
  gate: string;
  review: string;
  n: string;
  pre: string;
  mid: string;
  post: string;
}

const SCENARIOS: Record<string, ScenarioData> = {
  normal: {
    stage: "49.12 m",
    rain: "Baseline 2mm",
    gate: "Pass (Nominal)",
    review: "Normal monitoring",
    n: "Baseline scenario: Hydrograph inputs remain within seasonal average. Zero threshold breaches predicted over 48h horizon.",
    pre: "Telemetry quality checks passed across all 8 basin stations.",
    mid: "Ensemble disagreement: 0.04m (High agreement).",
    post: "Downstream corroboration verified.",
  },
  rain: {
    stage: "50.45 m",
    rain: "Elevated 45mm",
    gate: "Pass (Watch)",
    review: "Advisory review",
    n: "Heavy rainfall scenario: Upstream precipitation spikes detected. Catchment runoff model predicts rapid stage increase in 18 hours.",
    pre: "Input verified with IMD radar precipitation data.",
    mid: "Ensemble spread indicates possible 0.6m rise in downstream sector.",
    post: "Satellite extent comparison flagged for human inspection.",
  },
  rise: {
    stage: "52.30 m",
    rain: "Intense 85mm",
    gate: "Review (Critical)",
    review: "Escalate to Commander",
    n: "Rapid river-rise scenario: Gauges indicate stage approaching high flood danger mark. Rate of rise: +0.35 m/hour.",
    pre: "Telemetry flagged rate-of-rise threshold exceeded.",
    mid: "Ensemble indicates warning level breach in sector 4 within 12h.",
    post: "Immediate dual-authorization CAP advisory recommended.",
  },
  sensor: {
    stage: "Conflicting",
    rain: "Telemetry Lag",
    gate: "Hold (Degraded)",
    review: "Manual review",
    n: "Sensor conflict scenario: Station 03 and Station 04 report divergent stage readings (+1.4m difference). Pipeline paused to prevent false alerts.",
    pre: "Sensor consistency check flagged divergence.",
    mid: "Secondary satellite SAR fallback invoked.",
    post: "Physical inspection dispatched before advisory release.",
  },
  satellite: {
    stage: "49.80 m",
    rain: "Baseline",
    gate: "Degraded",
    review: "Limited spatial data",
    n: "Satellite unavailable scenario: Cloud cover restricts optical sensors. SAR synthetic aperture radar pipeline active in fallback mode.",
    pre: "Optical feed marked degraded.",
    mid: "Proceeding with hydrological gauge committee only.",
    post: "Spatial confidence adjusted to 0.72.",
  },
};

export default function DemoLabPage() {
  const [selectedKey, setSelectedKey] = useState<string>("normal");
  const [studyContext, setStudyContext] = useState<string>("patna");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<ScenarioData>(SCENARIOS.normal);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setActiveData(SCENARIOS[selectedKey]);
      setIsRunning(false);
      showToast("Simulation pipeline executed successfully.");
    }, 400);
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-10">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0f171b] border border-[#5eead4]/40 text-xs font-mono text-[#5eead4] shadow-2xl shadow-black/80 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#5eead4]" /> {toastMessage}
        </div>
      )}

      {/* Page Hero */}
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">Interactive demo lab</div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#f0f7f6] tracking-tight">
            Explore controlled flood scenarios.
          </h1>
          <p className="text-base text-[#9bb2af] mt-4 leading-relaxed">
            Choose a synthetic scenario to see how a decision-support interface organises the evidence. Every value on this page is illustrative and is not an official forecast.
          </p>
        </div>
      </FadeIn>

      {/* Configuration Panel */}
      <FadeIn delay={0.1}>
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2e4952]/40">
            <div>
              <h3 className="text-lg font-bold text-white">Scenario configuration</h3>
              <p className="text-xs text-[#9bb2af]">All generated inputs are synthetic simulations</p>
            </div>
            <span className="pill self-start sm:self-auto">
              <i className="dot amber" /> SIMULATION LAB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5 space-y-1.5">
              <label className="text-xs font-bold text-[#9bb2af] uppercase tracking-wider">
                Scenario
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs font-medium text-white focus:outline-none focus:border-[#5eead4]"
              >
                <option value="normal">Normal river conditions</option>
                <option value="rain">Heavy rainfall upstream</option>
                <option value="rise">Rapid river rise</option>
                <option value="sensor">Missing / conflicting sensor data</option>
                <option value="satellite">Satellite unavailable</option>
              </select>
            </div>

            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-[#9bb2af] uppercase tracking-wider">
                Study context
              </label>
              <select
                value={studyContext}
                onChange={(e) => setStudyContext(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs font-medium text-white focus:outline-none focus:border-[#5eead4]"
              >
                <option value="patna">Patna / Ganga (illustrative)</option>
                <option value="generic">Generic river reach (illustrative)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <Button
                onClick={handleRun}
                disabled={isRunning}
                className="w-full h-[42px] rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                {isRunning ? (
                  "Running pipeline..."
                ) : (
                  <>
                    Run synthetic scenario <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* 4 Stat Cards */}
      <FadeIn delay={0.2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9bb2af]">
              <span>River-stage input</span>
              <Droplets className="w-4 h-4 text-[#5eead4]" />
            </div>
            <div className="text-2xl font-black font-mono text-white">{activeData.stage}</div>
            <div className="text-[11px] text-[#627b77]">Synthetic scenario label</div>
          </div>

          <div className="p-5 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9bb2af]">
              <span>Rainfall input</span>
              <Activity className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <div className="text-2xl font-black font-mono text-white">{activeData.rain}</div>
            <div className="text-[11px] text-[#627b77]">Simulated indicator</div>
          </div>

          <div className="p-5 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9bb2af]">
              <span>Pre-Run decision</span>
              <Shield className="w-4 h-4 text-[#5eead4]" />
            </div>
            <div className="text-2xl font-black font-mono text-[#5eead4]">{activeData.gate}</div>
            <div className="text-[11px] text-[#627b77]">Illustrative gate response</div>
          </div>

          <div className="p-5 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9bb2af]">
              <span>Review state</span>
              <AlertTriangle className="w-4 h-4 text-[#fbbf24]" />
            </div>
            <div className="text-2xl font-black font-mono text-[#fbbf24]">{activeData.review}</div>
            <div className="text-[11px] text-[#627b77]">Not an official warning</div>
          </div>
        </div>
      </FadeIn>

      {/* Two Columns: Illustrative Output vs Scenario Response Path */}
      <FadeIn delay={0.3}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Output & Gates */}
          <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/40">
              <h3 className="text-base font-bold text-white">Illustrative output</h3>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                SYNTHETIC
              </span>
            </div>

            <p className="text-xs text-[#9bb2af] leading-relaxed min-h-[44px]">
              {activeData.n}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-1">
                <strong className="text-xs font-bold text-white block">Pre-Run Gate</strong>
                <p className="text-[11px] text-[#859e9a] leading-normal">{activeData.pre}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-1">
                <strong className="text-xs font-bold text-white block">Mid-Run Gate</strong>
                <p className="text-[11px] text-[#859e9a] leading-normal">{activeData.mid}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-1">
                <strong className="text-xs font-bold text-white block">Post-Run Gate</strong>
                <p className="text-[11px] text-[#859e9a] leading-normal">{activeData.post}</p>
              </div>
            </div>
          </div>

          {/* Right Panel: Scenario Response Path */}
          <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/40">
              <h3 className="text-base font-bold text-white">Scenario response path</h3>
              <small className="text-xs font-mono text-[#627b77]">Conceptual pipeline</small>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#162e34] border border-[#5eead4]/30 grid place-items-center text-xs font-bold text-[#5eead4] shrink-0">
                  1
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">Input quality check</strong>
                  <p className="text-xs text-[#9bb2af] mt-0.5 leading-relaxed">
                    Check data availability, sensor consistency and timestamp validity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#162e34] border border-[#5eead4]/30 grid place-items-center text-xs font-bold text-[#5eead4] shrink-0">
                  2
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">Ensemble analysis</strong>
                  <p className="text-xs text-[#9bb2af] mt-0.5 leading-relaxed">
                    Run forecast and spatial consequence calculations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#162e34] border border-[#5eead4]/30 grid place-items-center text-xs font-bold text-[#5eead4] shrink-0">
                  3
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">Human-in-the-loop oversight</strong>
                  <p className="text-xs text-[#9bb2af] mt-0.5 leading-relaxed">
                    Prepare draft advisories for authorized commander review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Notice Banner */}
      <div className="notice">
        <strong>Simulation Disclaimer:</strong> This simulation demonstrates interface behaviour only; it does not dispatch public alerts or replace authoritative emergency management protocols.
      </div>
    </div>
  );
}
