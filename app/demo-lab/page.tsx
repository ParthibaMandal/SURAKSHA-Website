"use client";

import React, { useState, useMemo } from "react";
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
  Sliders,
  Play,
} from "lucide-react";

// CWC Gandhi Ghat Benchmarks:
// Baseline Normal: 46.20 m | Warning: 47.60 m | Danger: 48.60 m | HFL: 50.52 m
function evaluateGandhiGhatState(stageM: number, rainMmHr: number) {
  if (stageM >= 48.60 || rainMmHr >= 50) {
    return {
      gate: "Breach (Danger)",
      review: "Escalate to Commander (CAP Alert)",
      statusClass: "danger",
      isSurge: true,
      pre: "Telemetry flagged: river stage exceeded CWC danger mark (48.60 m).",
      mid: `Ensemble projects peak stage at ${(stageM + 0.45).toFixed(2)} m (Breach above 48.60 m threshold).`,
      post: "Immediate commander-authorized OASIS CAP v1.2 advisory required.",
      n: "Critical flood breach scenario: Gauges indicate stage exceeding CWC Gandhi Ghat danger mark (48.60 m MSL). Automated incident alerts triggered for low-lying urban wards.",
    };
  } else if (stageM >= 47.60 || rainMmHr >= 30) {
    return {
      gate: "Review (Watch)",
      review: "Advisory Review (Stage Rising)",
      statusClass: "watch",
      isSurge: true,
      pre: "Input verified with IMD radar precipitation data.",
      mid: `Ensemble spread indicates possible ${(stageM + 0.35).toFixed(2)} m rise approaching danger mark.`,
      post: "Satellite SAR extent comparison flagged for supervisory inspection.",
      n: "Rising stage watch scenario: Heavy upstream precipitation pushes reach stage across CWC warning threshold (47.60 m MSL). Ward advisories on standby.",
    };
  } else {
    return {
      gate: "Pass (Nominal)",
      review: "Nominal Monitoring",
      statusClass: "nominal",
      isSurge: false,
      pre: "Telemetry quality checks passed across all 8 basin stations.",
      mid: "Ensemble disagreement: 0.04 m (High physical agreement).",
      post: "Downstream corridor corroboration verified.",
      n: "Baseline scenario: Hydrograph inputs remain within seasonal average. Zero threshold breaches predicted over 48h horizon.",
    };
  }
}

interface ScenarioPreset {
  name: string;
  stage: number;
  rain: number;
}

const PRESETS: Record<string, ScenarioPreset> = {
  normal: { name: "Normal river conditions", stage: 46.40, rain: 4 },
  rain: { name: "Heavy rainfall upstream", stage: 47.75, rain: 35 },
  rise: { name: "Rapid river rise (Surge)", stage: 48.95, rain: 65 },
  sensor: { name: "Conflicting sensor data", stage: 47.10, rain: 12 },
  satellite: { name: "Satellite unavailable", stage: 46.85, rain: 8 },
};

export default function DemoLabPage() {
  const [selectedKey, setSelectedKey] = useState<string>("normal");
  const [studyContext, setStudyContext] = useState<string>("patna");
  const [stageInput, setStageInput] = useState<number>(46.40);
  const [rainInput, setRainInput] = useState<number>(4);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Shared CWC Gandhi Ghat Evaluator
  const evaluation = useMemo(() => {
    return evaluateGandhiGhatState(stageInput, rainInput);
  }, [stageInput, rainInput]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePresetChange = (key: string) => {
    setSelectedKey(key);
    const p = PRESETS[key];
    if (p) {
      setStageInput(p.stage);
      setRainInput(p.rain);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      showToast("Hydrological verification pipeline executed.");
    }, 300);
  };

  return (
    <div className="w-full bg-[#000000] text-[#FFFFFF] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 flex flex-col gap-8">
        {/* Toast popup */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-[#0A0A0A] border border-[#FFFFFF]/40 text-xs font-mono text-white shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" /> {toastMessage}
          </div>
        )}

        {/* Page Hero */}
        <FadeIn>
          <div className="max-w-3xl space-y-3">
            <div className="eyebrow">SIMULATION LAB · SYNTHETIC ENVIRONMENT</div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Explore controlled flood scenarios.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Configure synthetic river-stage and rainfall parameters to inspect how SURAKSHA’s forecasting committee and Pre-Run, Mid-Run, and Post-Run verification gates evaluate flood evidence. Every value is calibrated to CWC Gandhi Ghat benchmarks (Warning: 47.60 m, Danger: 48.60 m).
            </p>
          </div>
        </FadeIn>

        {/* Configuration Panel */}
        <FadeIn delay={0.1}>
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">Scenario & Parameter Configuration</h3>
                <p className="text-xs text-slate-400">
                  Select a preset or fine-tune sliders to inspect live CWC threshold transitions
                </p>
              </div>
              <span className="pill self-start sm:self-auto bg-amber-500/10 text-amber-300 border-amber-500/30">
                <i className="dot amber" /> SIMULATED PREVIEW
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              {/* Preset Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  Scenario Preset
                </label>
                <select
                  value={selectedKey}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#000000] text-xs font-medium text-white focus:outline-none focus:border-[#FFFFFF] cursor-pointer"
                >
                  <option value="normal">Normal river conditions (46.40m)</option>
                  <option value="rain">Heavy rainfall upstream (47.75m)</option>
                  <option value="rise">Rapid river rise / Surge (48.95m)</option>
                  <option value="sensor">Conflicting sensor data (47.10m)</option>
                  <option value="satellite">Satellite unavailable (46.85m)</option>
                </select>
              </div>

              {/* River Stage Slider + Readout */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                    River Stage (m MSL)
                  </label>
                  <span className="text-xs font-mono font-bold text-[#FFFFFF]">
                    {stageInput.toFixed(2)} m
                  </span>
                </div>
                <input
                  type="range"
                  min="45.00"
                  max="51.00"
                  step="0.05"
                  value={stageInput}
                  onChange={(e) => setStageInput(parseFloat(e.target.value))}
                  className="w-full accent-[#FFFFFF] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>45.0m (Min)</span>
                  <span className="text-amber-400">47.6m (Warn)</span>
                  <span className="text-rose-400">48.6m (Danger)</span>
                  <span>51.0m</span>
                </div>
              </div>

              {/* Rainfall Slider + Readout */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Rainfall (mm/hr)
                  </label>
                  <span className="text-xs font-mono font-bold text-[#E4E4E7]">
                    {rainInput} mm/hr
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={rainInput}
                  onChange={(e) => setRainInput(parseInt(e.target.value))}
                  className="w-full accent-[#E4E4E7] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>0 mm/h</span>
                  <span>30 mm/h</span>
                  <span>50 mm/h</span>
                  <span>100 mm/h</span>
                </div>
              </div>

              {/* Run Trigger */}
              <div>
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={isRunning}
                  className="w-full h-[42px] rounded-full font-semibold text-xs bg-white text-[#000000] hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  {isRunning ? (
                    "Evaluating..."
                  ) : (
                    <>
                      <span>Execute Verification</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 4 Forecast Output Stat Cards - Driven by Shared Evaluator */}
        <FadeIn delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0A0A0A]/70 backdrop-blur-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>River-Stage Input</span>
                <Droplets className="w-4 h-4 text-[#FFFFFF]" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-white">
                {stageInput.toFixed(2)} m
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                CWC GANDHI GHAT · {stageInput >= 48.60 ? "DANGER" : stageInput >= 47.60 ? "WARNING" : "NORMAL"}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0A0A0A]/70 backdrop-blur-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Rainfall Intensity</span>
                <Activity className="w-4 h-4 text-[#E4E4E7]" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-white">
                {rainInput} mm/hr
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                IMD RADAR PRECIPITATION
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0A0A0A]/70 backdrop-blur-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Gate Decision</span>
                <Shield className="w-4 h-4 text-[#E4E4E7]" />
              </div>
              <div
                className={`text-2xl font-extrabold font-mono ${
                  evaluation.statusClass === "danger"
                    ? "text-rose-400"
                    : evaluation.statusClass === "watch"
                    ? "text-amber-400"
                    : "text-[#FFFFFF]"
                }`}
              >
                {evaluation.gate}
              </div>
              <div className="text-[11px] font-mono text-slate-400">Sequential gate review</div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0A0A0A]/70 backdrop-blur-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Supervisory State</span>
                <AlertTriangle
                  className={`w-4 h-4 ${
                    evaluation.statusClass === "danger" ? "text-rose-400" : "text-amber-400"
                  }`}
                />
              </div>
              <div
                className={`text-lg font-bold font-mono ${
                  evaluation.statusClass === "danger"
                    ? "text-rose-400"
                    : evaluation.statusClass === "watch"
                    ? "text-amber-400"
                    : "text-slate-200"
                }`}
              >
                {evaluation.review}
              </div>
              <div className="text-[11px] font-mono text-slate-400">Human-in-the-loop gate</div>
            </div>
          </div>
        </FadeIn>

        {/* Hydrograph Chart Section */}
        <FadeIn delay={0.2}>
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">
                  Simulated Ensemble Hydrograph & Threshold Response
                </h3>
                <p className="text-xs text-slate-400">
                  Observed stage, cyan forecast curve (#FFFFFF), 90% confidence spread, Warning (47.60m) & Danger (48.60m)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-white/5 text-slate-300 border border-white/15">
                CWC Gandhi Ghat Model
              </span>
            </div>
            <HydrologicalChart isSurge={evaluation.isSurge} />
          </div>
        </FadeIn>

        {/* Two Columns: Gate Review Cards vs Scenario Response Pathway */}
        <FadeIn delay={0.25}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel: Forecast Outputs & Gate Review Cards */}
            <div className="p-6 rounded-3xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white">
                  Pre-Run, Mid-Run & Post-Run Gate Review
                </h3>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#FFFFFF]/15 text-[#E4E4E7] border border-[#FFFFFF]/30">
                  VERIFIED
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{evaluation.n}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-2xl border border-white/10 bg-[#000000]/60 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#FFFFFF] block">GATE 01 · PRE-RUN</span>
                  <strong className="text-xs font-bold text-white block">Input Integrity</strong>
                  <p className="text-[11px] text-slate-400 leading-normal">{evaluation.pre}</p>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-[#000000]/60 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#E4E4E7] block">GATE 02 · MID-RUN</span>
                  <strong className="text-xs font-bold text-white block">Model Convergence</strong>
                  <p className="text-[11px] text-slate-400 leading-normal">{evaluation.mid}</p>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-[#000000]/60 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#E4E4E7] block">GATE 03 · POST-RUN</span>
                  <strong className="text-xs font-bold text-white block">CAP Readiness</strong>
                  <p className="text-[11px] text-slate-400 leading-normal">{evaluation.post}</p>
                </div>
              </div>
            </div>

            {/* Right Panel: Scenario Response Pathway */}
            <div className="p-6 rounded-3xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white">Scenario Response Pathway</h3>
                <small className="text-xs font-mono text-slate-400">Decision-Support Pipeline</small>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-[#FFFFFF]/15 border border-[#FFFFFF]/30 grid place-items-center text-xs font-mono font-bold text-[#FFFFFF] shrink-0">
                    01
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-white block">
                      Pre-Run Input Quality Check
                    </strong>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Verify station quorum, gauge timestamp freshness (&lt;15m), and physical river-stage bounds before executing ensemble forecasts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-[#E4E4E7]/15 border border-[#E4E4E7]/30 grid place-items-center text-xs font-mono font-bold text-[#E4E4E7] shrink-0">
                    02
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-white block">
                      Mid-Run Physics & Mass Conservation
                    </strong>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Check 1D channel routing and 2D depression filling for numerical convergence, mass conservation, and Courant stability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-[#E4E4E7]/15 border border-[#E4E4E7]/30 grid place-items-center text-xs font-mono font-bold text-[#E4E4E7] shrink-0">
                    03
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-white block">
                      Post-Run Human-Governed CAP Advisory
                    </strong>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Corroborate satellite SAR inundation polygons with local elevation, staging OASIS CAP v1.2 alerts for commander authorization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
