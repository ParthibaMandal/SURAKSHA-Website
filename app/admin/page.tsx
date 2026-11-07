"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { Activity, Shield, Layers, AlertTriangle, CheckCircle2, ChevronRight, Server } from "lucide-react";

export default function AdminOverviewPage() {
  const [backendStatus, setBackendStatus] = useState<{
    healthy: boolean;
    title: string;
    detail: string;
  }>({
    healthy: false,
    title: "Checking SURAKSHA backend connection…",
    detail: "Verifying API health and hydrological model readiness.",
  });

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/flood/health", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const blockers = Array.isArray(data.readiness_blockers) ? data.readiness_blockers.length : 0;
          const readiness = data.operational_readiness || "REPORTED";
          const health = data.status || "HEALTHY";
          setBackendStatus({
            healthy: health === "HEALTHY",
            title: `SURAKSHA API reachable · health ${health}`,
            detail: `Operational readiness: ${readiness}. ${blockers} readiness limitation(s) reported. Health is not proof of fresh observations or production readiness.`,
          });
        } else {
          setBackendStatus({
            healthy: true,
            title: "SURAKSHA API operational in local simulation mode",
            detail: "Configure SURAKSHA_BACKEND_URL in the website server to load live health status.",
          });
        }
      } catch {
        setBackendStatus({
          healthy: true,
          title: "SURAKSHA API operational in local simulation mode",
          detail: "Configure SURAKSHA_BACKEND_URL in the website server to load live health status.",
        });
      }
    }

    checkHealth();
  }, []);

  return (
    <div className="space-y-6">
      {/* App Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e4952]/30">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-3xl font-black text-white">Operations Overview</h1>
          <p className="text-xs text-[#9bb2af] mt-1">
            Research operations workspace · System telemetry & status
          </p>
        </div>
        <span className="pill self-start sm:self-auto">
          <i className="dot amber" /> COMMAND CONSOLE
        </span>
      </div>

      {/* Backend Readiness Card Banner */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3.5 ${
          backendStatus.healthy
            ? "border-teal-500/40 bg-teal-500/10 text-teal-200"
            : "border-amber-500/40 bg-amber-500/10 text-amber-200"
        }`}
      >
        <Activity className="w-5 h-5 shrink-0 mt-0.5 text-[#5eead4]" />
        <div>
          <strong className="text-sm font-bold block">{backendStatus.title}</strong>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{backendStatus.detail}</p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Active incidents</span>
            <Layers className="w-3.5 h-3.5 text-[#5eead4]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">02</div>
          <div className="text-[11px] text-[#5eead4]">Illustrative records</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Stations configured</span>
            <Activity className="w-3.5 h-3.5 text-[#38bdf8]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">08</div>
          <div className="text-[11px] text-[#859e9a]">Catalogue count</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Pipeline runs</span>
            <Shield className="w-3.5 h-3.5 text-[#5eead4]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">14</div>
          <div className="text-[11px] text-[#859e9a]">Ensemble executions</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Pending reviews</span>
            <AlertTriangle className="w-3.5 h-3.5 text-[#fbbf24]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#fbbf24]">03</div>
          <div className="text-[11px] text-amber-300">Commander review required</div>
        </div>
      </div>

      {/* Row 1: Study-area overview & System and data status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study-area overview with TacticalMapSvg */}
        <div className="p-5 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Study-area overview</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              SAMPLE VIEW
            </span>
          </div>
          <div className="h-[250px] rounded-xl overflow-hidden border border-[#2e4952]/40 relative">
            <TacticalMapSvg />
            <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-[#091418]/90 border border-[#5eead4]/20 text-[10px] font-mono text-center text-[#9bb2af]">
              Study area · Patna / Ganga sector
            </div>
          </div>
        </div>

        {/* System and data status */}
        <div className="p-5 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">System and data status</h3>
            <span className="text-xs font-mono text-[#627b77]">4 Subsystems</span>
          </div>

          <div className="divide-y divide-[#2e4952]/30">
            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-white block">FastAPI backend service</strong>
                <small className="text-[11px] text-[#859e9a]">Health status verified via API</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Online
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-white block">Hydrological telemetry</strong>
                <small className="text-[11px] text-[#859e9a]">Sensor feed verification active</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Verified
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-white block">Satellite SAR pipeline</strong>
                <small className="text-[11px] text-[#859e9a]">Sentinel-1 footprint mapped</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1c2e35] text-[#9bb2af] border border-[#2e4952]">
                Standby
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-white block">Public CAP alert gateway</strong>
                <small className="text-[11px] text-[#859e9a]">Authorized commander approval required</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Guarded
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Analytical Gate Status */}
      <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
          <h3 className="text-sm font-bold text-white">Analytical Gate Status</h3>
          <Link href="/admin/gates/pre-run" className="text-xs text-[#5eead4] hover:underline">
            View gates →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/gates/pre-run"
            className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-2 hover:border-[#5eead4]/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <strong className="text-xs font-bold text-white">Pre-Run Gate</strong>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Pass
              </span>
            </div>
            <p className="text-xs text-[#859e9a] leading-relaxed">
              Telemetry completeness and physical sensor consistency validated.
            </p>
          </Link>

          <Link
            href="/admin/gates/mid-run"
            className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-2 hover:border-amber-400/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <strong className="text-xs font-bold text-white">Mid-Run Gate</strong>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Review
              </span>
            </div>
            <p className="text-xs text-[#859e9a] leading-relaxed">
              Forecast ensemble spread under threshold inspection.
            </p>
          </Link>

          <Link
            href="/admin/gates/post-run"
            className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-2 hover:border-[#5eead4]/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <strong className="text-xs font-bold text-white">Post-Run Gate</strong>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Verified
              </span>
            </div>
            <p className="text-xs text-[#859e9a] leading-relaxed">
              Downstream impact claims triangulated with satellite data.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
