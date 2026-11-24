"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ShieldCheck } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  const fetchGates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/flood/gates", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Gate telemetry is unavailable.");
      setGates(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gate telemetry is unavailable.");
      setGates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGates();
  }, []);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#A1A1AA]/15">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#A1A1AA] tracking-tight">
            Analytical Gates & Barrage Control
          </h1>
          <p className="text-xs text-[#A69B88] mt-1">
            Reference checklists for Pre-Run, Mid-Run, and Post-Run verification. Live gate telemetry is not connected.
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

      {error && <div role="alert" className="rounded-xl border border-amber-300/25 bg-amber-300/[0.06] p-4 text-sm text-amber-100">{error}</div>}

      {/* Analytical Verification Gate Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: "pre-run",
            step: "GATE 01",
            name: "Pre-Run Verification",
            desc: "Sensor quorum, timestamp freshness, and physical range bounds prior to forecasting.",
            status: "REFERENCE",
          },
          {
            id: "mid-run",
            step: "GATE 02",
            name: "Mid-Run Verification",
            desc: "Ensemble stability, Courant-Friedrichs-Lewy step convergence, and uncertainty spread.",
            status: "REFERENCE",
          },
          {
            id: "post-run",
            step: "GATE 03",
            name: "Post-Run Verification",
            desc: "Stage threshold crossing audit, SAR water-mask agreement, and CAP v1.2 readiness.",
            status: "REFERENCE",
          },
        ].map((g) => (
          <Link
            key={g.id}
            href={`/admin/gates/${g.id}`}
            className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] hover:border-[#FFFFFF]/50 transition-colors flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[#FFFFFF] uppercase tracking-wider">
                  {g.step}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#FFFFFF]/15 text-[#FFFFFF] border border-[#FFFFFF]/30">
                  {g.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#A1A1AA]">{g.name}</h3>
              <p className="text-xs text-[#A69B88] mt-1 leading-relaxed">{g.desc}</p>
            </div>
            <span className="text-[11px] font-mono text-[#FFFFFF]">Open gate audit →</span>
          </Link>
        ))}
      </div>

      {/* Safety Banner */}
      <div className="p-4 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#A1A1AA] flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-[#FFFFFF] font-bold block">
            Reference safeguards only · no actuator interlock is connected
          </strong>
          <p className="text-[#A69B88]">
            No barrage control or actuator endpoint is connected. This screen cannot read or change physical gate equipment.
          </p>
        </div>
      </div>

      {/* Physical Barrage Gates Grid */}
      {gates.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gates.map((gate) => (
          <div
            key={gate.id}
            className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/10">
                <span className="text-xs font-mono font-bold text-[#FFFFFF]">{gate.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#141414] text-[#A1A1AA] border border-[#A1A1AA]/20">
                  {gate.mode} · SAMPLE
                </span>
              </div>
              <h3 className="text-base font-bold text-[#A1A1AA] mt-3">{gate.name}</h3>
              <p className="text-xs text-[#A69B88] mt-0.5">Station: {gate.station_id}</p>

              {/* Current Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#A1A1AA]/10 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-[#000000] border border-[#A1A1AA]/12">
                  <span className="text-[#A69B88] block text-[10px]">CURRENT APERTURE</span>
                  <span className="text-xl font-bold text-[#FFFFFF]">{gate.current_opening_pct}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#000000] border border-[#A1A1AA]/12">
                  <span className="text-[#A69B88] block text-[10px]">DISCHARGE</span>
                  <span className="text-sm font-bold text-[#FFFFFF]">{gate.discharge_rate_cusecs} cfs</span>
                </div>
              </div>

              <p className="mt-5 rounded-lg border border-[#A1A1AA]/12 bg-black p-3 text-xs text-[#A69B88]">Read-only telemetry display. No control operations are available.</p>
            </div>

            <div className="pt-3 border-t border-[#A1A1AA]/10 flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#A69B88] font-mono">
                Actuated: {new Date(gate.last_actuated_at).toLocaleTimeString()}
              </span>
              <Link
                href={`/admin/gates/${gate.id}`}
                className="text-[#FFFFFF] hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                Inspect telemetry →
              </Link>
            </div>
          </div>
        ))}
      </div>}
      {!loading && !error && gates.length === 0 && <p className="rounded-xl border border-dashed border-[#A1A1AA]/20 p-6 text-center text-sm text-[#A69B88]">No gate telemetry is available.</p>}
    </div>
  );
}
