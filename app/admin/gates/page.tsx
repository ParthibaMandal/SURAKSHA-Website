"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";

interface GateItem {
  id: string;
  station_id: string;
  name: string;
  current_opening_pct: number;
  recommended_opening_pct?: number | null;
  discharge_rate_cusecs: number;
  mode: string;
  last_actuated_at: string;
}

export default function AdminGatesIndexPage() {
  const [gates, setGates] = useState<GateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const fetchGates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/flood/gates", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setGates(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGates();
  }, []);

  const handleAdjust = (gateId: string, newPct: number) => {
    setGates((prev) =>
      prev.map((g) =>
        g.id === gateId
          ? {
              ...g,
              current_opening_pct: newPct,
              discharge_rate_cusecs: Math.round(newPct * 380),
              last_actuated_at: new Date().toISOString(),
            }
          : g
      )
    );
    setToast(`Gate ${gateId} actuated to ${newPct}% aperture.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#292925] border border-[#06B6D4]/40 text-xs font-mono text-[#D8CBB3] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CBB3]/15">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D8CBB3] tracking-tight">
            Analytical Gates & Barrage Control
          </h1>
          <p className="text-xs text-[#A69B88] mt-1">
            Review Pre-Run, Mid-Run, and Post-Run verification gates and barrage discharge apertures.
          </p>
        </div>
        <button
          onClick={fetchGates}
          disabled={loading}
          className="btn secondary small flex items-center gap-2 self-start sm:self-auto text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Telemetry
        </button>
      </div>

      {/* Analytical Verification Gates Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: "pre-run",
            step: "GATE 01",
            name: "Pre-Run Verification",
            desc: "Sensor quorum, timestamp freshness, and physical range bounds prior to forecasting.",
            status: "PASS",
          },
          {
            id: "mid-run",
            step: "GATE 02",
            name: "Mid-Run Verification",
            desc: "Ensemble stability, Courant-Friedrichs-Lewy step convergence, and uncertainty spread.",
            status: "PASS",
          },
          {
            id: "post-run",
            step: "GATE 03",
            name: "Post-Run Verification",
            desc: "Stage threshold crossing audit, SAR water-mask agreement, and CAP v1.2 readiness.",
            status: "PASS",
          },
        ].map((g) => (
          <Link
            key={g.id}
            href={`/admin/gates/${g.id}`}
            className="p-5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] hover:border-[#06B6D4]/50 transition-colors flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[#06B6D4] uppercase tracking-wider">
                  {g.step}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
                  {g.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#D8CBB3]">{g.name}</h3>
              <p className="text-xs text-[#A69B88] mt-1 leading-relaxed">{g.desc}</p>
            </div>
            <span className="text-[11px] font-mono text-[#06B6D4]">Open gate audit →</span>
          </Link>
        ))}
      </div>

      {/* Safety Banner */}
      <div className="p-4 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#D8CBB3] flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-[#EDE4D3] font-bold block">
            Jev Supervisory Safeguard Interlock Active (SYNTHETIC SIMULATION)
          </strong>
          <p className="text-[#A69B88]">
            Aperture adjustments exceeding downstream embankment threshold (51.80 m) require dual commander authorization.
          </p>
        </div>
      </div>

      {/* Physical Barrage Gates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gates.map((gate) => (
          <div
            key={gate.id}
            className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/10">
                <span className="text-xs font-mono font-bold text-[#06B6D4]">{gate.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#33332E] text-[#D8CBB3] border border-[#D8CBB3]/20">
                  {gate.mode} · SAMPLE
                </span>
              </div>
              <h3 className="text-base font-bold text-[#D8CBB3] mt-3">{gate.name}</h3>
              <p className="text-xs text-[#A69B88] mt-0.5">Station: {gate.station_id}</p>

              {/* Current Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#D8CBB3]/10 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-[#1E1E1C] border border-[#D8CBB3]/12">
                  <span className="text-[#A69B88] block text-[10px]">CURRENT APERTURE</span>
                  <span className="text-xl font-bold text-[#EDE4D3]">{gate.current_opening_pct}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#1E1E1C] border border-[#D8CBB3]/12">
                  <span className="text-[#A69B88] block text-[10px]">DISCHARGE</span>
                  <span className="text-sm font-bold text-[#06B6D4]">{gate.discharge_rate_cusecs} cfs</span>
                </div>
              </div>

              {/* Interactive Aperture Slider */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs text-[#A69B88]">
                  <span>Adjust Aperture</span>
                  <span className="font-mono text-[#D8CBB3] font-bold">{gate.current_opening_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gate.current_opening_pct}
                  onChange={(e) => handleAdjust(gate.id, parseInt(e.target.value))}
                  className="w-full accent-[#06B6D4] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#A69B88]">
                  <span>0% (Closed)</span>
                  <span>50%</span>
                  <span>100% (Max Flush)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D8CBB3]/10 flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#A69B88] font-mono">
                Actuated: {new Date(gate.last_actuated_at).toLocaleTimeString()}
              </span>
              <Link
                href={`/admin/gates/${gate.id}`}
                className="text-[#06B6D4] hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                Inspect telemetry →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
