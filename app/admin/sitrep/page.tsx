"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSitrepPage() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0f171b] border border-[#5eead4]/40 text-xs font-mono text-[#5eead4] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#5eead4]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e4952]/30">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-3xl font-black text-white">SITREP Reports</h1>
          <p className="text-xs text-[#9bb2af] mt-1">
            Generate and export comprehensive situational reports for incidents.
          </p>
        </div>
        <button
          onClick={() => showToast("Generating report...")}
          className="btn primary small self-start sm:self-auto flex items-center gap-1.5"
        >
          Generate SITREP <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Two Columns: Generated Reports vs Report Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generated Reports */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Generated Reports</h3>
            <span className="text-xs font-mono text-[#627b77]">2 Dossiers</span>
          </div>

          <div className="divide-y divide-[#2e4952]/30">
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">SITREP-2026-04 · Patna Flood Situation</strong>
                <small className="text-[11px] text-[#859e9a]">Generated 06 Nov 2026 · 14:00 UTC</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Finalized
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">SITREP-2026-03 · Upper Catchment Precipitation</strong>
                <small className="text-[11px] text-[#859e9a]">Generated 05 Nov 2026 · 22:00 UTC</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1c2e35] text-[#9bb2af] border border-[#2e4952]">
                Archived
              </span>
            </div>
          </div>
        </div>

        {/* Report Structure */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Report Structure</h3>
            <span className="text-xs font-mono text-teal-400">Standard Spec</span>
          </div>

          <div className="divide-y divide-[#2e4952]/30">
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block">Hydrological summary</strong>
                <small className="text-[#859e9a]">Stage observations and forecast trends</small>
              </div>
              <span className="text-xs font-mono text-[#5eead4]">Included</span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block">Geospatial extent</strong>
                <small className="text-[#859e9a]">Sentinel-1 inundation polygons</small>
              </div>
              <span className="text-xs font-mono text-[#5eead4]">Included</span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block">Human impact analysis</strong>
                <small className="text-[#859e9a]">Affected structures and population estimate</small>
              </div>
              <span className="text-xs font-mono text-[#5eead4]">Included</span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block">Operational readiness</strong>
                <small className="text-[#859e9a]">Gate verdicts and supervisor actions</small>
              </div>
              <span className="text-xs font-mono text-[#5eead4]">Included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
