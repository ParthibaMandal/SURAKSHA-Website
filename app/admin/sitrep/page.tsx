"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function AdminSitrepPage() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#292925] border border-[#2F6BFF]/40 text-xs font-mono text-[#D8CBB3] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2F6BFF]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CBB3]/15">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D8CBB3] tracking-tight">
            SITREP Reports
          </h1>
          <p className="text-xs text-[#A69B88] mt-1">
            Generate and export comprehensive situational reports for active and archived flood incidents.
          </p>
        </div>
        <button
          onClick={() => showToast("Generating situational report dossier...")}
          className="btn primary small self-start sm:self-auto flex items-center gap-1.5"
        >
          Generate SITREP <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Two Columns: Generated Reports vs Report Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generated Reports */}
        <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
            <h3 className="text-sm font-bold text-[#D8CBB3]">Generated Reports</h3>
            <span className="text-xs font-mono text-[#A69B88]">2 Dossiers · SAMPLE</span>
          </div>

          <div className="divide-y divide-[#D8CBB3]/10">
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-[#EDE4D3] block">SITREP-2026-04 · Patna Flood Situation</strong>
                <small className="text-[11px] text-[#A69B88] font-mono">Generated 06 Nov 2026 · 14:00 UTC</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                Finalized
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-[#EDE4D3] block">SITREP-2026-03 · Upper Catchment Precipitation</strong>
                <small className="text-[11px] text-[#A69B88] font-mono">Generated 05 Nov 2026 · 22:00 UTC</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#33332E] text-[#D8CBB3] border border-[#D8CBB3]/20">
                Archived
              </span>
            </div>
          </div>
        </div>

        {/* Report Structure */}
        <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
            <h3 className="text-sm font-bold text-[#D8CBB3]">Report Structure</h3>
            <span className="text-xs font-mono text-[#2F6BFF]">Standard Spec</span>
          </div>

          <div className="divide-y divide-[#D8CBB3]/10">
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-[#EDE4D3] block">Hydrological summary</strong>
                <small className="text-[#A69B88]">Stage observations and ensemble forecast trends</small>
              </div>
              <span className="text-xs font-mono text-[#2F6BFF]">Included</span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-[#EDE4D3] block">Geospatial extent</strong>
                <small className="text-[#A69B88]">Sentinel-1 SAR inundation polygons</small>
              </div>
              <span className="text-xs font-mono text-[#2F6BFF]">Included</span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-[#EDE4D3] block">Human impact analysis</strong>
                <small className="text-[#A69B88]">Affected structures and ward population estimate</small>
              </div>
              <span className="text-xs font-mono text-[#2F6BFF]">Included</span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-[#EDE4D3] block">Operational readiness</strong>
                <small className="text-[#A69B88]">Gate verdicts and supervisor actions</small>
              </div>
              <span className="text-xs font-mono text-[#2F6BFF]">Included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
