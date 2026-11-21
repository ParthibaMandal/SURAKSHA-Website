"use client";

import React, { useState } from "react";
import { HydrologicalChart } from "@/components/shared/HydrologicalChart";
import { Activity, Shield, Layers, AlertTriangle } from "lucide-react";

export default function AdminForecastsPage() {
  const [surgeMode, setSurgeMode] = useState(false);

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D8CBB3]/14">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE · HYDROLOGICAL ENSEMBLE</div>
          <h1 className="text-3xl font-extrabold text-[#D8CBB3]">Forecasts & Risk</h1>
          <p className="text-xs text-[#A69B88] mt-1">
            Inspect hydrological forecast ensemble curves, warning thresholds, rainfall hyetographs and uncertainty intervals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSurgeMode(!surgeMode)}
          className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold border transition-colors self-start sm:self-auto ${
            surgeMode
              ? "bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/50"
              : "bg-[#292925] text-[#D8CBB3] border-[#D8CBB3]/20 hover:bg-[#33332E]"
          }`}
        >
          {surgeMode ? "SCENARIO: SYNTHETIC SURGE (+2.50m)" : "SCENARIO: NOMINAL ENSEMBLE (+0.42m)"}
        </button>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Ensemble Mean Crest</span>
            <Activity className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#D8CBB3]">
            {surgeMode ? "52.32 m" : "50.24 m"}
          </div>
          <div className="text-[11px] font-mono text-[#06B6D4]">T+8h projected peak</div>
        </div>

        <div className="p-4 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>90% Confidence Spread</span>
            <Layers className="w-4 h-4 text-[#D8CBB3]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#D8CBB3]">
            {surgeMode ? "±0.53 m" : "±0.34 m"}
          </div>
          <div className="text-[11px] font-mono text-[#A69B88]">12-member committee</div>
        </div>

        <div className="p-4 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Nash–Sutcliffe (NSE)</span>
            <Shield className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#D8CBB3]">0.89</div>
          <div className="text-[11px] font-mono text-[#A69B88]">Validation benchmark</div>
        </div>

        <div className="p-4 rounded-xl border border-[#F59E0B]/35 bg-[#292925] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Threshold Margin</span>
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#FBBF24]">
            {surgeMode ? "+0.52 m (BREACH)" : "-0.26 m (WATCH)"}
          </div>
          <div className="text-[11px] font-mono text-[#FBBF24]">Warning level: 50.5m</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Hydrograph Forecast */}
        <div className="xl:col-span-8">
          <HydrologicalChart isSurge={surgeMode} />
        </div>

        {/* Right: Run Metadata & Risk Distribution */}
        <div className="xl:col-span-4 p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/14">
              <h2 className="text-sm font-bold text-[#D8CBB3]">Forecast Run Provenance</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#06B6D4]/18 text-[#06B6D4] border border-[#06B6D4]/35">
                SYNTHETIC RUN
              </span>
            </div>

            <div className="divide-y divide-[#D8CBB3]/12">
              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-[#D8CBB3] block">Run Identifier</strong>
                  <small className="text-[11px] font-mono text-[#A69B88]">SIM-2026-ENG-489</small>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1E1E1C] text-[#D8CBB3] border border-[#D8CBB3]/18">
                  Active
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-[#D8CBB3] block">Model Committee</strong>
                  <small className="text-[11px] font-mono text-[#A69B88]">
                    Saint-Venant 1D/2D + LSTM Ensemble
                  </small>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#06B6D4]/18 text-[#06B6D4] border border-[#06B6D4]/35">
                  Verified
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-[#D8CBB3] block">Forecast Horizon</strong>
                  <small className="text-[11px] font-mono text-[#A69B88]">+6H / +24H / +72H</small>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1E1E1C] text-[#D8CBB3] border border-[#D8CBB3]/18">
                  Nominal
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-[#D8CBB3] block">Input Provenance</strong>
                  <small className="text-[11px] font-mono text-[#A69B88]">
                    Sample CWC Gauge & Synthetic IMD Grid
                  </small>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#33332E] text-[#D8CBB3] border border-[#D8CBB3]/20">
                  Sample
                </span>
              </div>
            </div>
          </div>

          <div className="notice">
            Illustrative values for design preview, not a real forecast. Emergency alerts require human authorization.
          </div>
        </div>
      </div>
    </div>
  );
}
