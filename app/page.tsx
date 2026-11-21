"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HimalayasToPlainsHero } from "@/components/hero/HimalayasToPlainsHero";
import { PatnaCommandWorkspacePreview } from "@/components/console/PatnaCommandWorkspacePreview";
import { DigitalTwinScene } from "@/components/three/DigitalTwinScene";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { HydrologicalChart } from "@/components/shared/HydrologicalChart";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Activity, Radio, Cpu, Layers } from "lucide-react";

export default function HomePage() {
  const [isSurgeActive, setIsSurgeActive] = useState(false);

  return (
    <div className="relative bg-[#090C10] text-[#F8FAFC]">
      {/* 1. Himalayas to Plains Early Warning Hero Section */}
      <HimalayasToPlainsHero />

      {/* 2. Operations Console & Architecture (Real Glassmorphic Patna Workspace Preview) */}
      <section className="relative z-10 py-12 sm:py-16 border-t border-white/10 w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 max-w-7xl">
            <div>
              <div className="eyebrow">OPERATIONAL ARCHITECTURE</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Operations console and pipeline architecture.
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Real-time gauge telemetry streams, 1D/2D hydrodynamic forecast models, and CAP v1.2 incident dispatch unified in one supervisory interface.
            </p>
          </div>

          {/* Real Glassmorphic Patna Command Console Preview */}
          <div className="mb-8 w-full">
            <PatnaCommandWorkspacePreview />
          </div>

          {/* Operational Metrics and Verification Standards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#10161F]/70 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] mb-3">
                  <Radio className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Telemetry Ingestion</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Streams river-stage observations from CWC basin gauges and IMD precipitation grids across the Middle Ganga catchment.
                </p>
                <div className="space-y-2 text-xs border-t border-white/10 pt-3 text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Sampling cadence:</span>
                    <span className="text-white">15-minute intervals</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active gauge feeds:</span>
                    <span className="text-white">3 reference stations</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packet timeout:</span>
                    <span className="text-white">&lt; 30 minutes</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10">
                <Link href="/admin/stations" className="text-xs font-semibold text-[#06B6D4] hover:text-[#38BDF8] flex items-center gap-1">
                  <span>View station telemetry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#10161F]/70 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#14B8A6]/15 border border-[#14B8A6]/30 flex items-center justify-center text-[#14B8A6] mb-3">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Hydrodynamic Modeling</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Pairs 1D river-channel calculations with 2D floodplain depression filling for corridor inundation mapping.
                </p>
                <div className="space-y-2 text-xs border-t border-white/10 pt-3 text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Forecast horizons:</span>
                    <span className="text-white">6h, 24h, 72h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ensemble members:</span>
                    <span className="text-white">10 hydrological runs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence bounds:</span>
                    <span className="text-white">90% prediction interval</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10">
                <Link href="/platform" className="text-xs font-semibold text-[#14B8A6] hover:text-[#2DD4BF] flex items-center gap-1">
                  <span>Review model pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#10161F]/70 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] mb-3">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Human-in-the-Loop Sign-off</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Enforces automated physics and plausibility checks before any public CAP v1.2 advisory is released.
                </p>
                <div className="space-y-2 text-xs border-t border-white/10 pt-3 text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Advisory protocol:</span>
                    <span className="text-white">OASIS CAP v1.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analytical checkpoints:</span>
                    <span className="text-white">3 sequential gates</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dispatch policy:</span>
                    <span className="text-white">Commander authorization</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10">
                <Link href="/alerts-safety" className="text-xs font-semibold text-[#38BDF8] hover:text-white flex items-center gap-1">
                  <span>Inspect alert safeguards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 3. Scientific Hydrograph & Interactive 3D Basin Twin Preview */}
      <section className="relative z-10 py-14 sm:py-16 border-t border-white/10 w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#10161F]/80 backdrop-blur-xl space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="eyebrow">RIVER FORECASTING COMMITTEE</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  River-stage hydrograph, forecast uncertainty, and thresholds.
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Patna Study Section (STN-PAT-01 · Gandhi Ghat). Toggle between 6h, 24h, and 72h horizons or trigger a surge in the 3D twin to test telemetry responses.
                </p>
              </div>
              <Link href="/admin/forecasts">
                <Button variant="outline" size="sm" className="text-xs font-semibold rounded-full border-white/20 text-white hover:bg-white/10">
                  Open Forecasting Workspace →
                </Button>
              </Link>
            </div>

            {/* Equal-height items-stretch grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 flex">
                <HydrologicalChart isSurge={isSurgeActive} />
              </div>
              <div className="lg:col-span-5 flex">
                <DigitalTwinScene onSurgeStateChange={(surge) => setIsSurgeActive(surge)} />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 4. Event Lifecycle (Prepare, Respond, Recover) */}
      <section className="relative z-10 py-14 sm:py-16 border-t border-white/10 w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 max-w-7xl">
            <div>
              <div className="eyebrow">DISASTER RESPONSE CYCLE</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Three phases of operational flood response.
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Early warning protocols and command views for rising, cresting, and receding river levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-[#10161F]/70 backdrop-blur-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#06B6D4]">Phase 1: Prepare</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-slate-300 border border-white/15">
                  Pre-Event
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Preparedness</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Continuous baseline gauge telemetry, upstream catchment rainfall projections, and ward preparedness checklists before river stages reach warning marks.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-[#10161F]/70 backdrop-blur-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F59E0B]">Phase 2: Respond</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Active Event
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Response</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Active incident command, Sentinel-1 SAR inundation updates, commander-authorized CAP v1.2 advisories, and citizen SOS rescue dispatch.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#10161F]/70 backdrop-blur-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Phase 3: Recover</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-slate-300 border border-white/15">
                  Post-Event
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Recovery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Post-event SITREP archival, observed peak vs. forecast NSE evaluation, and safe return clearance for affected floodplain wards.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 5. Scientific Oversight (Pre-Run, Mid-Run, Post-Run Analytical Gates) */}
      <section className="relative z-10 py-14 sm:py-16 border-t border-white/10 w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 max-w-7xl">
            <div>
              <div className="eyebrow">HUMAN-IN-THE-LOOP SAFETY</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Supervisory analytical gates.
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Three sequential verification stages enforced before any public advisory dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/gates/pre-run" className="block group">
              <div className="rounded-2xl border border-white/10 bg-[#10161F]/70 backdrop-blur-xl p-6 hover:border-[#06B6D4]/50 transition-colors h-full flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#06B6D4]">Pre-Run Check</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#06B6D4]/15 text-[#38BDF8] border border-[#06B6D4]/30">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#06B6D4] transition-colors">
                    Sensor and Input Integrity
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Audits gauge quorum, packet freshness (&lt;15 min), and physical river-stage bounds before initiating forecast runs.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#06B6D4] flex items-center gap-1">
                  <span>Inspect Pre-Run invariants</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            <Link href="/admin/gates/mid-run" className="block group">
              <div className="rounded-2xl border border-white/10 bg-[#10161F]/70 backdrop-blur-xl p-6 hover:border-[#14B8A6]/50 transition-colors h-full flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#14B8A6]">Mid-Run Check</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#14B8A6]/15 text-[#2DD4BF] border border-[#14B8A6]/30">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#14B8A6] transition-colors">
                    Ensemble and Physics Verification
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Verifies hydrodynamic mass conservation, Courant step convergence, and 90% ensemble spread stability.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#14B8A6] flex items-center gap-1">
                  <span>Inspect Mid-Run invariants</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            <Link href="/admin/gates/post-run" className="block group">
              <div className="rounded-2xl border border-white/10 bg-[#10161F]/70 backdrop-blur-xl p-6 hover:border-[#38BDF8]/50 transition-colors h-full flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#38BDF8]">Post-Run Check</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    Consequence and CAP Readiness
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cross-checks inundation polygons against local elevation and stages OASIS CAP v1.2 drafts for human sign-off.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#38BDF8] flex items-center gap-1">
                  <span>Inspect Post-Run invariants</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* 6. Study Area (Ganga Corridor & Patna CWC Gandhi Ghat Benchmarks) */}
      <section className="relative z-10 py-14 sm:py-16 border-t border-white/10 w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="eyebrow">CWC GANDHI GHAT BENCHMARKS</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Patna study section, Middle Ganga basin.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Calibrated to Central Water Commission (CWC) hydrology records for the Patna urban reach at Gandhi Ghat: 46.20 m normal baseline, 47.60 m warning, 48.60 m danger, and 50.52 m record high flood level (HFL), integrating confluences with the Sone, Gandak, and Punpun rivers.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Ganga river system",
                  "Patna · Gandhi Ghat",
                  "Sone & Gandak confluences",
                  "CWC Danger: 48.60 m",
                  "CWC Warning: 47.60 m",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs bg-white/5 text-slate-300 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <Link href="/study-area">
                  <Button variant="outline" className="text-xs font-semibold rounded-full border-white/20 text-white hover:bg-white/10">
                    Explore Study Area Details
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-[#10161F]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
                <TacticalMapSvg />
                <div className="p-3.5 bg-[#090C10]/80 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Study area schematic, Patna reach (25.61°N, 85.14°E)</span>
                  <span className="text-slate-300 font-mono">CWC Gandhi Ghat Gauges</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 7. Bottom CTA Band (Clean Title Case & Pill Geometry) */}
      <section className="relative z-10 py-16 sm:py-20 border-t border-white/10 w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 text-xs text-slate-300 leading-relaxed mb-8 flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-semibold text-[10px]">
              DISCLAIMER
            </span>
            <span>
              <strong>Research-Prototype Prototype:</strong> SURAKSHA is an academic flood-intelligence research prototype, not an official government warning authority. Model outputs carry inherent uncertainty and must never substitute for official civil-defence directives.
            </span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#10161F]/80 backdrop-blur-xl p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Test controlled flood scenarios in the Simulation Lab.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Adjust synthetic river-stage and rainfall inputs, inspect ensemble hydrograph responses, and step through Pre-Run, Mid-Run, and Post-Run verification gates.
              </p>
            </div>

            {/* Title Case Pill Buttons (Replacing boxy ALL-CAPS #2F6BFF) */}
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link href="/demo-lab">
                <button
                  type="button"
                  className="px-6 py-3 rounded-full bg-white text-[#090C10] font-semibold text-xs sm:text-sm hover:bg-neutral-100 transition-all shadow-xl shadow-black/40 flex items-center gap-2 cursor-pointer"
                >
                  <span>Open Simulation Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/admin">
                <button
                  type="button"
                  className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer"
                >
                  <span>Operations Portal</span>
                </button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
