"use client";

import React, { useState } from "react";
import { Brain, CheckCircle2, TrendingUp, BarChart2, Shield, Activity, ArrowRight } from "lucide-react";

interface ModelSpec {
  id: string;
  name: string;
  tier: "Champion (Production)" | "Challenger (Validated)" | "Baseline";
  architecture: string;
  leadTime: string;
  nse: number;
  rmseMeters: number;
  maeMeters: number;
  latencyMs: number;
  inputFeatures: string[];
  trainingPeriod: string;
  evaluationSurges: string;
  pros: string[];
  cons: string[];
}

const MODELS: ModelSpec[] = [
  {
    id: "bilstm",
    name: "Hybrid BiLSTM + 1D CNN",
    tier: "Challenger (Validated)",
    architecture: "1D Conv (feature extraction) + Bidirectional LSTM (temporal dynamics) + Dense Head",
    leadTime: "72 hours (hourly steps)",
    nse: 0.88,
    rmseMeters: 0.14,
    maeMeters: 0.09,
    latencyMs: 18,
    inputFeatures: [
      "Gandhi Ghat Gauge Level (t-72h..t)",
      "Upstream Discharge (Buxar, Son River)",
      "IMD Gridded Catchment Precipitation",
      "Snowline Isotherm & Cryosphere Degree-Day Melt",
    ],
    trainingPeriod: "2018 - 2022 CWC Telemetry (Monsoon Months)",
    evaluationSurges: "2023 Patna Monsoon Surge Replay",
    pros: [
      "Captures non-linear upstream convective rainfall impacts 24 hours earlier",
      "Bidirectional context prevents stage prediction lag during rapid hydrograph rise",
      "Robust to intermittent single-hour sensor noise via 1D Conv smoothing",
    ],
    cons: [
      "Higher compute footprint than SARIMA (18ms vs 4ms)",
      "Requires Jev Mid-Run gate to verify neural hidden state stability",
    ],
  },
  {
    id: "sarima",
    name: "SARIMA (Production Champion)",
    tier: "Champion (Production)",
    architecture: "SARIMA(2, 1, 2) × (1, 1, 1)_24 with exogenous upstream covariates",
    leadTime: "48 hours (hourly steps)",
    nse: 0.82,
    rmseMeters: 0.19,
    maeMeters: 0.13,
    latencyMs: 4,
    inputFeatures: [
      "Target Gauge Stage Time Series",
      "Lagged Upstream Discharge Vector",
    ],
    trainingPeriod: "2018 - 2022 CWC Telemetry",
    evaluationSurges: "2023 Patna Monsoon Surge Replay",
    pros: [
      "Zero cold-start risk, analytically bounded confidence intervals",
      "Extreme fast execution (< 4ms latency per horizon)",
      "100% physically interpretable parameter weights",
    ],
    cons: [
      "Slight lag when sudden flash-floods emerge from unregulated tributaries",
      "Underestimates peak stage by ~6% in extreme 50-year return events",
    ],
  },
  {
    id: "persistence",
    name: "Persistence & Climatology Baseline",
    tier: "Baseline",
    architecture: "h(t+k) = h(t) + historical median rate of change",
    leadTime: "24 hours",
    nse: 0.54,
    rmseMeters: 0.48,
    maeMeters: 0.38,
    latencyMs: 1,
    inputFeatures: ["Latest available gauge observation h(t)"],
    trainingPeriod: "Decadal Historical Mean",
    evaluationSurges: "Standard Benchmark Baseline",
    pros: [
      "Guaranteed execution even during full sensor blackout",
      "Acts as safety floor in Jev Gate 1 fallback",
    ],
    cons: [
      "Cannot forecast trend reversals or sudden flood crests",
      "Error scales exponentially with lead time",
    ],
  },
];

export function InteractiveModelCard() {
  const [selectedModelId, setSelectedModelId] = useState<string>("bilstm");
  const selectedModel = MODELS.find((m) => m.id === selectedModelId) || MODELS[0];

  return (
    <div className="space-y-8 my-8">
      {/* Model Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MODELS.map((model) => {
          const isSelected = model.id === selectedModelId;
          return (
            <div
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-[#0A0A0A] border-[#FFFFFF] shadow-lg shadow-[#FFFFFF]/10 ring-1 ring-[#FFFFFF]"
                  : "bg-[#242421] border-[#A1A1AA]/15 hover:border-[#A1A1AA]/30"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                      model.tier.includes("Champion")
                        ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                        : model.tier.includes("Challenger")
                        ? "bg-[#3B82F6]/15 text-[#E4E4E7] border-[#3B82F6]/30"
                        : "bg-[#A69B88]/15 text-[#A69B88] border-[#A69B88]/30"
                    }`}
                  >
                    {model.tier}
                  </span>
                  <span className="text-xs font-mono text-[#FFFFFF] font-bold">
                    NSE: {model.nse}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#FFFFFF]">
                  {model.name}
                </h4>

                <p className="text-xs text-[#A69B88] line-clamp-2">
                  {model.architecture}
                </p>
              </div>

              <div className="pt-4 border-t border-[#A1A1AA]/10 mt-4 flex items-center justify-between text-xs">
                <span className="text-[#A69B88]">RMSE: <strong className="text-[#FFFFFF]">{model.rmseMeters} m</strong></span>
                <span className="text-[#A69B88]">Latency: <strong className="text-[#FFFFFF]">{model.latencyMs} ms</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Model Detail Visualizer */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[#A1A1AA]/20 bg-[#242421] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#A1A1AA]/15">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#FFFFFF] uppercase font-bold">
                Model Evaluation & Verification Specification
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/15 text-[#10B981]">
                Test Suite Verified
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#FFFFFF]">
              {selectedModel.name}
            </h3>
            <p className="text-xs text-[#A69B88] mt-0.5">
              {selectedModel.architecture}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#A69B88] font-mono block">Evaluated Horizon</span>
            <span className="text-sm font-bold text-[#FFFFFF] font-mono">{selectedModel.leadTime}</span>
          </div>
        </div>

        {/* Metric Gauges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#000000] border border-[#A1A1AA]/10">
            <span className="text-[11px] font-mono text-[#A69B88] uppercase block">
              Nash-Sutcliffe (NSE)
            </span>
            <div className="text-2xl font-bold text-[#10B981] font-mono mt-1">
              {selectedModel.nse}
            </div>
            <div className="w-full bg-[#0A0A0A] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#10B981] h-full rounded-full"
                style={{ width: `${selectedModel.nse * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#A1A1AA]/10">
            <span className="text-[11px] font-mono text-[#A69B88] uppercase block">
              RMSE Accuracy
            </span>
            <div className="text-2xl font-bold text-[#E4E4E7] font-mono mt-1">
              {selectedModel.rmseMeters} m
            </div>
            <span className="text-[10px] text-[#A69B88] mt-1 block">Root Mean Square Error</span>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#A1A1AA]/10">
            <span className="text-[11px] font-mono text-[#A69B88] uppercase block">
              Mean Absolute Error
            </span>
            <div className="text-2xl font-bold text-[#FFFFFF] font-mono mt-1">
              {selectedModel.maeMeters} m
            </div>
            <span className="text-[10px] text-[#A69B88] mt-1 block">Average stage error</span>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#A1A1AA]/10">
            <span className="text-[11px] font-mono text-[#A69B88] uppercase block">
              Inference Latency
            </span>
            <div className="text-2xl font-bold text-[#F59E0B] font-mono mt-1">
              {selectedModel.latencyMs} ms
            </div>
            <span className="text-[10px] text-[#A69B88] mt-1 block">Per-station execution</span>
          </div>
        </div>

        {/* Input Covariates & Features */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#A69B88] block">
            Model Input Features & Covariates
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedModel.inputFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#000000] border border-[#A1A1AA]/10 flex items-center gap-2.5 text-xs text-[#FFFFFF]"
              >
                <div className="w-2 h-2 rounded-full bg-[#FFFFFF] shrink-0" />
                <span className="font-mono">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparative Advantages & Edge Cases */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#10B981]/5 border border-[#10B981]/20 space-y-2">
            <span className="text-xs font-mono font-bold text-[#10B981] uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Hydrological Strengths</span>
            </span>
            <ul className="space-y-1.5 text-xs text-[#A1A1AA]">
              {selectedModel.pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#10B981] mt-0.5">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#F59E0B]/5 border border-[#F59E0B]/20 space-y-2">
            <span className="text-xs font-mono font-bold text-[#F59E0B] uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>Operational Constraints</span>
            </span>
            <ul className="space-y-1.5 text-xs text-[#A1A1AA]">
              {selectedModel.cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#F59E0B] mt-0.5">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

