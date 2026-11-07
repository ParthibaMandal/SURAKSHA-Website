import React from "react";
import { HydrologicalChart } from "@/components/shared/HydrologicalChart";

export const metadata = {
  title: "Forecasts & Risk | SURAKSHA Operations",
  description: "Inspect hydrological forecast ensemble curves, thresholds and uncertainty intervals.",
};

export default function AdminForecastsPage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="pb-4 border-b border-[#2e4952]/30">
        <div className="eyebrow">OPERATIONS WORKSPACE</div>
        <h1 className="text-3xl font-black text-white">Forecasts & Risk</h1>
        <p className="text-xs text-[#9bb2af] mt-1">
          Inspect hydrological forecast ensemble curves, thresholds and uncertainty intervals.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Hydrograph Forecast (Stage vs Time) */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Hydrograph Forecast (Stage vs Time)</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
              SIMULATED
            </span>
          </div>

          <div className="rounded-xl overflow-hidden border border-[#2e4952]/40 bg-[#091418]/60 p-2">
            <HydrologicalChart isSurge={false} />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-[#9bb2af]">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#5eead4] shadow-[0_0_8px_#5eead4]" />
              48-Hour Forecast Ensemble
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]" />
              Warning Threshold (142 m)
            </span>
          </div>
        </div>

        {/* Right: Run Metadata */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Run Metadata</h3>
            <span className="text-xs font-mono text-teal-400">Validated</span>
          </div>

          <div className="divide-y divide-[#2e4952]/30">
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">Run ID</strong>
                <small className="text-[11px] text-[#859e9a]">SIM-2026-ENG-489</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1c2e35] text-[#9bb2af] border border-[#2e4952]">
                Active
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">Model Version</strong>
                <small className="text-[11px] text-[#859e9a]">Jev Hydrology v2.4</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Verified
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">Forecast Horizon</strong>
                <small className="text-[11px] text-[#859e9a]">+48 Hours</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1c2e35] text-[#9bb2af] border border-[#2e4952]">
                Nominal
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">Input Provenance</strong>
                <small className="text-[11px] text-[#859e9a]">CWC & IMD GFS Ensemble</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Triangulated
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
