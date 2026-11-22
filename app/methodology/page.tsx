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
      state: "SAMPLE / VERIFY",
      stateType: "warning",
    },
    {
      family: "IMD / rainfall sources",
      use: "Observed and forecast precipitation context",
      meta: "Product, resolution, issue time, valid time",
      state: "SAMPLE / VERIFY",
      stateType: "warning",
    },
    {
      family: "Copernicus ERA5-Land",
      use: "Historical meteorological context",
      meta: "Variable, grid, time range, licence",
      state: "RESEARCH DATASET",
      stateType: "neutral",
    },
    {
      family: "GloFAS",
      use: "Large-scale river discharge forecast context",
      meta: "Version, forecast cycle, lead time",
      state: "RESEARCH DATASET",
      stateType: "neutral",
    },
    {
      family: "Sentinel-1 SAR",
      use: "Flood extent mapping under cloud cover",
      meta: "Acquisition time, orbit, processing chain",
      state: "SAMPLE / VERIFY",
      stateType: "warning",
    },
    {
      family: "Terrain / DEM",
      use: "Topography and terrain-derived analysis",
      meta: "Product, resolution, vertical datum",
      state: "SAMPLE / VERIFY",
      stateType: "warning",
    },
  ];

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">DATA & METHODOLOGY</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#A1A1AA] tracking-tight">
            Every signal needs a source and a timestamp.
          </h1>
          <p className="text-base text-[#A69B88] mt-4 leading-relaxed">
            The platform preserves data lineage from ingestion through model output. The table below outlines source families and their integration readiness.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] p-6 space-y-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#A1A1AA]/15 text-[#A69B88] uppercase text-[10px]">
                  <th className="py-3 px-4">Source Family</th>
                  <th className="py-3 px-4">Potential Use</th>
                  <th className="py-3 px-4">Required Metadata</th>
                  <th className="py-3 px-4">Integration State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A1A1AA]/10">
                {sources.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#141414]/50">
                    <td className="py-3 px-4 font-bold text-[#FFFFFF] font-sans">{s.family}</td>
                    <td className="py-3 px-4 text-[#A1A1AA]">{s.use}</td>
                    <td className="py-3 px-4 text-[#A69B88]">{s.meta}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          s.stateType === "warning"
                            ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                            : "bg-[#141414] text-[#A1A1AA] border-[#A1A1AA]/20"
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
          <div className="p-6 sm:p-8 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
            <h3 className="text-lg font-bold text-[#FFFFFF]">Explicit Data Provenance States</h3>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Observed (<span className="font-mono text-[#A1A1AA]">LIVE</span>), sample (<span className="font-mono text-[#A1A1AA]">SAMPLE</span>), synthetic (<span className="font-mono text-[#A1A1AA]">SYNTHETIC</span>), stale (<span className="font-mono text-[#A1A1AA]">STALE</span>), and unavailable (<span className="font-mono text-[#A1A1AA]">UNAVAILABLE</span>) records are visually distinct across all views.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="p-6 sm:p-8 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
            <h3 className="text-lg font-bold text-[#FFFFFF]">Data Lineage</h3>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Retains source identifiers, retrieval timestamps, processing versions, physical units, spatial reference systems, and transformation history throughout the lifecycle.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
