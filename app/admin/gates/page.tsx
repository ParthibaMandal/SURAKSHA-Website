"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sliders, CheckCircle2, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";

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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0f171b] border border-[#5eead4]/40 text-xs font-mono text-[#5eead4] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#5eead4]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e4952]/30">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-3xl font-black text-white">Barrage Gate Automation</h1>
          <p className="text-xs text-[#9bb2af] mt-1">
            Supervised discharge aperture controls and reservoir outflow actuation.
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

      {/* Safety Banner */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-amber-300 font-bold block">
            Jev Supervisory Safeguard Interlock Active.
          </strong>
          <p className="text-slate-300">
            Aperture adjustments exceeding downstream embankment threshold (107.50m) require dual commander authorization.
          </p>
        </div>
      </div>

      {/* Gates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gates.map((gate) => (
          <div
            key={gate.id}
            className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
                <span className="text-xs font-mono font-bold text-[#5eead4]">{gate.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#162e34] text-[#5eead4] border border-[#2e4952]">
                  {gate.mode}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-3">{gate.name}</h3>
              <p className="text-xs text-[#9bb2af] mt-0.5">Station: {gate.station_id}</p>

              {/* Current Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#2e4952]/20 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-[#0b1317] border border-[#1f3138]">
                  <span className="text-[#657d7a] block text-[10px]">CURRENT APERTURE</span>
                  <span className="text-xl font-bold text-white">{gate.current_opening_pct}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0b1317] border border-[#1f3138]">
                  <span className="text-[#657d7a] block text-[10px]">DISCHARGE</span>
                  <span className="text-sm font-bold text-cyan-400">{gate.discharge_rate_cusecs} cfs</span>
                </div>
              </div>

              {/* Interactive Aperture Slider */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs text-[#9bb2af]">
                  <span>Adjust Aperture</span>
                  <span className="font-mono text-white font-bold">{gate.current_opening_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gate.current_opening_pct}
                  onChange={(e) => handleAdjust(gate.id, parseInt(e.target.value))}
                  className="w-full accent-[#5eead4] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#627b77]">
                  <span>0% (Closed)</span>
                  <span>50%</span>
                  <span>100% (Max Flush)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2e4952]/30 flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#627b77] font-mono">
                Actuated: {new Date(gate.last_actuated_at).toLocaleTimeString()}
              </span>
              <Link
                href={`/admin/gates/${gate.id}`}
                className="text-[#5eead4] hover:underline flex items-center gap-1 font-mono text-[11px]"
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

