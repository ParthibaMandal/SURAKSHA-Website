import React from "react";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata = {
  title: "Data & Methodology | SURAKSHA",
  description: "Every signal needs a source and a timestamp. Source families, lineage, and integration readiness.",
};

export default function MethodologyPage() {
  const sources = [
    {
      family: "River gauge / CWC",
      use: "Stage, discharge and observed trend",
      meta: "Station ID, datum, units, timestamp, quality flag",
      state: "Verify access",
      stateType: "warning",
    },
    {
      family: "IMD / rainfall sources",
      use: "Observed and forecast precipitation context",
      meta: "Product, resolution, issue time, valid time",
      state: "Verify access",
      stateType: "warning",
    },
    {
      family: "Copernicus ERA5-Land",
      use: "Historical meteorological context",
      meta: "Variable, grid, time range, licence",
      state: "Research dataset",
      stateType: "neutral",
    },
    {
      family: "GloFAS",
      use: "Large-scale river discharge forecast context",
      meta: "Version, forecast cycle, lead time",
      state: "Research dataset",
      stateType: "neutral",
    },
    {
      family: "Sentinel-1 SAR",
      use: "Flood extent mapping under cloud cover",
      meta: "Acquisition time, orbit, processing chain",
      state: "Verify pipeline",
      stateType: "warning",
    },
    {
      family: "Terrain / DEM",
      use: "Topography and terrain-derived analysis",
      meta: "Product, resolution, vertical datum",
      state: "Verify dataset",
      stateType: "warning",
    },
  ];

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">Data & Methodology</div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#f0f7f6] tracking-tight">
            Every signal needs a source and a timestamp.
          </h1>
          <p className="text-base text-[#9bb2af] mt-4 leading-relaxed">
            The platform preserves data lineage from ingestion through model output. The table below outlines source families and their integration readiness.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="rounded-2xl border border-[#2e4952]/40 bg-[#0f171b]/80 p-6 space-y-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2e4952]/50 text-[#9bb2af]">
                  <th className="py-3 px-4">Source Family</th>
                  <th className="py-3 px-4">Potential Use</th>
                  <th className="py-3 px-4">Required Metadata</th>
                  <th className="py-3 px-4">Integration State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c2e35]">
                {sources.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#142329]/50">
                    <td className="py-3 px-4 font-bold text-white font-sans">{s.family}</td>
                    <td className="py-3 px-4 text-[#9bb2af]">{s.use}</td>
                    <td className="py-3 px-4 text-[#627b77]">{s.meta}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          s.stateType === "warning"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-[#142329] text-[#c7dbd7] border-[#2e4952]"
                        }`}
                      >
                        {s.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FadeIn delay={0.2}>
          <div className="p-6 sm:p-8 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
            <h3 className="text-lg font-bold text-white">Data states</h3>
            <p className="text-xs text-[#9bb2af] leading-relaxed">
              Observed, modelled, derived, manually entered and simulated records are visually distinct. A stale or unavailable source is never silently shown as current.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="p-6 sm:p-8 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
            <h3 className="text-lg font-bold text-white">Data lineage</h3>
            <p className="text-xs text-[#9bb2af] leading-relaxed">
              Retain source identifiers, retrieval timestamps, processing versions, units, spatial reference systems and transformation history throughout the lifecycle.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

