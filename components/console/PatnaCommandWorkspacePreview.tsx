"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Droplets,
  Radio,
  Shield,
  Waves,
} from "lucide-react";

export const PatnaCommandWorkspacePreview: React.FC = () => {
  return (
    <div className="w-full rounded-2xl border border-[#0284C7]/45 bg-[#081424] backdrop-blur-xl overflow-hidden shadow-2xl text-[#F0F9FF]">
      {/* Console Top Header Bar */}
      <div className="px-5 py-3.5 border-b border-[#0284C7]/30 bg-[#040B14] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0EA5E9]" />
          </span>
          <span className="font-semibold tracking-tight text-[#F0F9FF]">
            SURAKSHA Command Workspace: Patna Middle Ganga Reach
          </span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#0D1F36] text-[#38BDF8] border border-[#0284C7]/45">
            STN-PAT-01 · Gandhi Ghat
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-[#BAE6FD]/80">
          <span className="hidden md:inline">
            Datum: <span className="text-[#F0F9FF]">46.20 m</span> baseline ·{" "}
            <span className="text-[#F59E0B]">47.60 m</span> warning ·{" "}
            <span className="text-[#EF4444]">48.60 m</span> danger ·{" "}
            <span className="text-[#7DD3FC]">50.52 m</span> HFL
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/20 text-[#38BDF8] border border-[#0EA5E9]/45 text-[10px] font-semibold">
            SYSTEM NOMINAL
          </span>
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Telemetry Gauges & Hydrological Blue Hydrograph Curve (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          {/* 4 Metric Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-[#0284C7]/35 bg-[#040B14]/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#38BDF8] mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">River Stage</span>
                <Droplets className="w-3.5 h-3.5 text-[#0EA5E9]" />
              </div>
              <div className="text-xl font-bold font-mono text-[#F0F9FF]">47.12 m</div>
              <div className="text-[10px] text-[#38BDF8] font-mono mt-0.5 flex items-center gap-1">
                <span>▲ +0.08 m/h</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#0284C7]/35 bg-[#040B14]/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#38BDF8] mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Flow Velocity</span>
                <Waves className="w-3.5 h-3.5 text-[#38BDF8]" />
              </div>
              <div className="text-xl font-bold font-mono text-[#F0F9FF]">1.84 m/s</div>
              <div className="text-[10px] text-[#BAE6FD]/65 font-mono mt-0.5">ADCP Acoustic</div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#0284C7]/35 bg-[#040B14]/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#38BDF8] mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Discharge</span>
                <Activity className="w-3.5 h-3.5 text-[#0EA5E9]" />
              </div>
              <div className="text-xl font-bold font-mono text-[#F0F9FF]">31.4k</div>
              <div className="text-[10px] text-[#BAE6FD]/65 font-mono mt-0.5">m³/s (Cumecs)</div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#0284C7]/35 bg-[#040B14]/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#38BDF8] mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Catchment Rain</span>
                <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
              </div>
              <div className="text-xl font-bold font-mono text-[#F0F9FF]">18.5</div>
              <div className="text-[10px] text-[#BAE6FD]/65 font-mono mt-0.5">mm/hr (IMD)</div>
            </div>
          </div>

          {/* Reach Hydrodynamic Visualizer */}
          <div className="p-4 rounded-xl border border-[#0284C7]/35 bg-[#040B14]/75 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#0284C7]/25">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
                <span className="font-semibold text-[#F0F9FF]">Reach Inundation Model · 24-Hour Horizon</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#BAE6FD]/80">
                <span className="text-[#F59E0B]">Warning: 47.60m</span>
                <span>·</span>
                <span className="text-[#EF4444]">Danger: 48.60m</span>
              </div>
            </div>

            {/* SVG Visualizer with Hydrological Blue & Glacial Sky Curves */}
            <svg viewBox="0 0 540 140" className="w-full h-auto overflow-visible select-none" fill="none">
              <defs>
                <linearGradient id="consoleHydroGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="25" x2="520" y2="25" stroke="rgba(56,189,248,0.18)" strokeDasharray="3 4" />
              <line x1="20" y1="65" x2="520" y2="65" stroke="rgba(56,189,248,0.18)" strokeDasharray="3 4" />
              <line x1="20" y1="105" x2="520" y2="105" stroke="rgba(56,189,248,0.18)" strokeDasharray="3 4" />

              {/* Danger Threshold Line (48.60m) */}
              <line x1="20" y1="38" x2="520" y2="38" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
              <text x="515" y="34" fill="#EF4444" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="end">
                DANGER MARK 48.60m
              </text>

              {/* Warning Threshold Line (47.60m) */}
              <line x1="20" y1="72" x2="520" y2="72" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
              <text x="515" y="68" fill="#F59E0B" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="end">
                WARNING MARK 47.60m
              </text>

              {/* Filled Forecast Envelope */}
              <path
                d="M 20 102 C 120 98, 200 90, 280 82 C 360 74, 440 68, 520 62 L 520 125 L 20 125 Z"
                fill="url(#consoleHydroGlow)"
              />

              {/* Primary Forecast Curve (#38BDF8 Glacial Sky Blue) */}
              <path
                d="M 20 102 C 120 98, 200 90, 280 82 C 360 74, 440 68, 520 62"
                stroke="#38BDF8"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />

              {/* Observed Past Line (Solid Hydrological Blue #0EA5E9) */}
              <path
                d="M 20 102 C 100 100, 180 94, 260 85"
                stroke="#0EA5E9"
                strokeWidth="2.8"
                strokeLinecap="round"
              />

              {/* NOW Marker */}
              <line x1="260" y1="18" x2="260" y2="125" stroke="rgba(240,249,255,0.35)" strokeDasharray="2 3" />
              <circle cx="260" cy="85" r="4.5" fill="#F0F9FF" stroke="#0EA5E9" strokeWidth="2" className="animate-pulse" />
              <text x="260" y="14" fill="#F0F9FF" fontSize="8.5" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">
                T+0 NOW
              </text>
            </svg>
          </div>
        </div>

        {/* Right Column: Supervisory Verification Gates & Dispatch (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4 p-4 rounded-xl border border-[#0284C7]/35 bg-[#040B14]/80">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#0284C7]/25">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0EA5E9]" />
                <h4 className="text-xs font-semibold text-[#F0F9FF] uppercase tracking-wider font-mono">
                  Supervisory Analytical Gates
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#0EA5E9]/20 text-[#38BDF8] border border-[#0EA5E9]/45 font-semibold">
                3/3 PASSED
              </span>
            </div>

            {/* Sequential Gate Checkpoints */}
            <div className="space-y-3 pt-3 text-xs">
              {/* Gate 1 */}
              <div className="p-3 rounded-lg bg-[#081424] border border-[#0284C7]/30 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#38BDF8]">GATE 01</span>
                    <span className="font-semibold text-[#F0F9FF]">Input & Quorum Integrity</span>
                  </div>
                  <p className="text-[11px] text-[#BAE6FD]/75">8/8 station telemetry packets fresh (&lt;15m)</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
              </div>

              {/* Gate 2 */}
              <div className="p-3 rounded-lg bg-[#081424] border border-[#0284C7]/30 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#38BDF8]">GATE 02</span>
                    <span className="font-semibold text-[#F0F9FF]">Hydrodynamic Convergence</span>
                  </div>
                  <p className="text-[11px] text-[#BAE6FD]/75">Mass conservation within 0.02%, Courant stable</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
              </div>

              {/* Gate 3 */}
              <div className="p-3 rounded-lg bg-[#081424] border border-[#0284C7]/30 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#38BDF8]">GATE 03</span>
                    <span className="font-semibold text-[#F0F9FF]">CAP v1.2 Protocol Staging</span>
                  </div>
                  <p className="text-[11px] text-[#BAE6FD]/75">Draft advisory staged for commander sign-off</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
              </div>
            </div>
          </div>

          {/* Console Action Buttons */}
          <div className="pt-3 border-t border-[#0284C7]/25 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/admin"
              className="btn-glass-primary px-5 py-2.5 text-xs font-semibold text-[#F0F9FF] group"
            >
              <span className="relative z-10">Launch Command Centre</span>
              <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/stations"
              className="btn-glass-secondary px-4 py-2 text-xs text-[#F0F9FF]"
            >
              <span className="relative z-10">View All Stations</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
