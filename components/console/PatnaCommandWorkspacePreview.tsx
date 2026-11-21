"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Droplets,
  Layers,
  Radio,
  Shield,
  TrendingUp,
  Waves,
} from "lucide-react";

export const PatnaCommandWorkspacePreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"routing" | "sensors" | "gates">("routing");

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#10161F]/80 backdrop-blur-xl overflow-hidden shadow-2xl text-white">
      {/* Console Top Header Bar */}
      <div className="px-5 py-3.5 border-b border-white/10 bg-[#090C10]/70 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-bold tracking-tight text-white">
            SURAKSHA Command Workspace: Patna Middle Ganga Reach
          </span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#06B6D4]/15 text-[#38BDF8] border border-[#06B6D4]/30">
            STN-PAT-01 · Gandhi Ghat
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="hidden md:inline">
            Datum: <span className="text-white">46.20 m</span> baseline · <span className="text-amber-400">47.60 m</span> warning · <span className="text-rose-400">48.60 m</span> danger · <span className="text-slate-400">50.52 m</span> HFL
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-semibold">
            SYSTEM NOMINAL
          </span>
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Telemetry Gauges & Cyan Hydrograph Curve (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          {/* 4 Metric Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#090C10]/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">River Stage</span>
                <Droplets className="w-3.5 h-3.5 text-[#06B6D4]" />
              </div>
              <div className="text-xl font-bold font-mono text-white">47.12 m</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                <span>▲ +0.08 m/h</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-white/10 bg-[#090C10]/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Flow Velocity</span>
                <Waves className="w-3.5 h-3.5 text-[#14B8A6]" />
              </div>
              <div className="text-xl font-bold font-mono text-white">1.84 m/s</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">ADCP Acoustic</div>
            </div>

            <div className="p-3.5 rounded-xl border border-white/10 bg-[#090C10]/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Discharge</span>
                <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
              </div>
              <div className="text-xl font-bold font-mono text-white">31.4k</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">m³/s (Cumecs)</div>
            </div>

            <div className="p-3.5 rounded-xl border border-white/10 bg-[#090C10]/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Catchment Rain</span>
                <Radio className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold font-mono text-white">18.5</div>
              <div className="text-[10px] text-amber-400 font-mono mt-0.5">mm/hr (IMD)</div>
            </div>
          </div>

          {/* Interactive Reach Hydrodynamic Visualizer */}
          <div className="p-4 rounded-xl border border-white/10 bg-[#090C10]/50 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                <span className="font-semibold text-white">Reach Inundation Model · 24-Hour Horizon</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span>Warning: 47.60m</span>
                <span>·</span>
                <span className="text-rose-400">Danger: 48.60m</span>
              </div>
            </div>

            {/* SVG Visualizer with Cyan Curves & Flow Simulation */}
            <svg viewBox="0 0 540 140" className="w-full h-auto overflow-visible select-none" fill="none">
              <defs>
                <linearGradient id="consoleCyanGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="25" x2="520" y2="25" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" />
              <line x1="20" y1="65" x2="520" y2="65" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" />
              <line x1="20" y1="105" x2="520" y2="105" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" />

              {/* Danger Threshold Line (48.60m) */}
              <line x1="20" y1="38" x2="520" y2="38" stroke="#EF4444" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
              <text x="515" y="34" fill="#F87171" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="end">
                DANGER MARK 48.60m
              </text>

              {/* Warning Threshold Line (47.60m) */}
              <line x1="20" y1="72" x2="520" y2="72" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
              <text x="515" y="68" fill="#FBBF24" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="end">
                WARNING MARK 47.60m
              </text>

              {/* Filled Forecast Envelope */}
              <path
                d="M 20 102 C 120 98, 200 90, 280 82 C 360 74, 440 68, 520 62 L 520 125 L 20 125 Z"
                fill="url(#consoleCyanGlow)"
              />

              {/* Primary Cyan Forecast Curve */}
              <path
                d="M 20 102 C 120 98, 200 90, 280 82 C 360 74, 440 68, 520 62"
                stroke="#06B6D4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Observed Past Line (Solid White/Sand) */}
              <path
                d="M 20 102 C 100 100, 180 94, 260 85"
                stroke="#F8FAFC"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* NOW Marker */}
              <line x1="260" y1="18" x2="260" y2="125" stroke="rgba(255,255,255,0.25)" strokeDasharray="2 3" />
              <circle cx="260" cy="85" r="4.5" fill="#06B6D4" stroke="#090C10" strokeWidth="2" className="animate-pulse" />
              <text x="260" y="14" fill="#F8FAFC" fontSize="8.5" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">
                T+0 NOW
              </text>
            </svg>
          </div>
        </div>

        {/* Right Column: Supervisory Verification Gates & Dispatch (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#090C10]/60">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#06B6D4]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Supervisory Analytical Gates
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                3/3 PASSED
              </span>
            </div>

            {/* Sequential Gate Checkpoints */}
            <div className="space-y-3 pt-3 text-xs">
              {/* Gate 1 */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#06B6D4]">GATE 01</span>
                    <span className="font-semibold text-white">Input & Quorum Integrity</span>
                  </div>
                  <p className="text-[11px] text-slate-400">8/8 station telemetry packets fresh (&lt;15m)</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>

              {/* Gate 2 */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#14B8A6]">GATE 02</span>
                    <span className="font-semibold text-white">Hydrodynamic Convergence</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Mass conservation within 0.02%, Courant stable</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>

              {/* Gate 3 */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#38BDF8]">GATE 03</span>
                    <span className="font-semibold text-white">CAP v1.2 Protocol Staging</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Draft advisory staged for commander sign-off</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>
            </div>
          </div>

          {/* Console Action Buttons */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#090C10] font-semibold text-xs hover:bg-neutral-100 transition-all shadow-md group"
            >
              <span>Launch Command Centre</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/stations"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs text-white transition-colors"
            >
              <span>View All Stations</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

