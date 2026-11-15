"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BasinScrollStoryHero } from "@/components/hero/BasinScrollStoryHero";
import { DigitalTwinScene } from "@/components/three/DigitalTwinScene";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { HydrologicalChart } from "@/components/shared/HydrologicalChart";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isSurgeActive, setIsSurgeActive] = useState(false);

  return (
    <div className="relative bg-[#1E1E1C] text-[#D8CBB3]">
      {/* 1. Cinematic 5-Beat Pinned Scroll Fly-In Hero Section */}
      <BasinScrollStoryHero />

      {/* 2. Operations Console & Architecture (Real Product Picture + Operational Telemetry Breakdown) */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#EDE4D3] tracking-tight">
                Operations console and pipeline architecture.
              </h2>
            </div>
            <p className="text-sm text-[#A69B88] max-w-md leading-relaxed">
              Real-time gauge telemetry streams, 1D/2D hydrodynamic forecast models, and CAP v1.2 incident dispatch unified in one supervisory interface.
            </p>
          </div>

          {/* Real Platform Interface Screenshot */}
          <div className="mb-8 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] overflow-hidden shadow-lg">
            <div className="px-5 py-3 border-b border-[#D8CBB3]/12 bg-[#1E1E1C] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-[#EDE4D3]">
                SURAKSHA Command Workspace: Patna Middle Ganga Reach
              </span>
              <span className="text-[#A69B88]">
                Gauge datum: <span className="font-mono text-[#EDE4D3]">49.82 m</span> normal, <span className="font-mono text-[#F59E0B]">50.50 m</span> warning, <span className="font-mono text-[#EF4444]">51.80 m</span> danger
              </span>
            </div>
            <div className="relative">
              <img
                src="/images/suraksha-interface.png"
                alt="SURAKSHA Flood Intelligence Platform Interface"
                className="w-full h-auto object-cover max-h-[520px]"
                loading="eager"
              />
            </div>
          </div>

          {/* Operational Metrics and Verification Standards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#EDE4D3] mb-2">Telemetry Ingestion</h3>
                <p className="text-xs text-[#A69B88] leading-relaxed mb-4">
                  Streams river-stage observations from CWC basin gauges and IMD precipitation grids across the Middle Ganga catchment.
                </p>
                <div className="space-y-2 text-xs border-t border-[#D8CBB3]/12 pt-3 text-[#A69B88]">
                  <div className="flex justify-between">
                    <span>Sampling cadence:</span>
                    <span className="text-[#EDE4D3] font-mono">15-minute intervals</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active gauge feeds:</span>
                    <span className="text-[#EDE4D3] font-mono">3 reference stations</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packet timeout:</span>
                    <span className="text-[#EDE4D3] font-mono">&lt; 30 minutes</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[#D8CBB3]/12">
                <Link href="/admin/stations" className="text-xs font-semibold text-[#2F6BFF] hover:underline">
                  View station telemetry →
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#EDE4D3] mb-2">Hydrodynamic Modeling</h3>
                <p className="text-xs text-[#A69B88] leading-relaxed mb-4">
                  Pairs 1D river-channel calculations with 2D floodplain depression filling for corridor inundation mapping.
                </p>
                <div className="space-y-2 text-xs border-t border-[#D8CBB3]/12 pt-3 text-[#A69B88]">
                  <div className="flex justify-between">
                    <span>Forecast horizons:</span>
                    <span className="text-[#EDE4D3] font-mono">6h, 24h, 72h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ensemble members:</span>
                    <span className="text-[#EDE4D3] font-mono">10 hydrological runs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence bounds:</span>
                    <span className="text-[#EDE4D3] font-mono">90% prediction interval</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[#D8CBB3]/12">
                <Link href="/platform" className="text-xs font-semibold text-[#2F6BFF] hover:underline">
                  Review model pipeline →
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#EDE4D3] mb-2">Human-in-the-Loop Sign-off</h3>
                <p className="text-xs text-[#A69B88] leading-relaxed mb-4">
                  Enforces automated physics and plausibility checks before any public CAP v1.2 advisory is released.
                </p>
                <div className="space-y-2 text-xs border-t border-[#D8CBB3]/12 pt-3 text-[#A69B88]">
                  <div className="flex justify-between">
                    <span>Advisory protocol:</span>
                    <span className="text-[#EDE4D3] font-mono">OASIS CAP v1.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analytical checkpoints:</span>
                    <span className="text-[#EDE4D3] font-mono">3 sequential gates</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dispatch policy:</span>
                    <span className="text-[#EDE4D3] font-mono">Commander authorization</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[#D8CBB3]/12">
                <Link href="/alerts-safety" className="text-xs font-semibold text-[#2F6BFF] hover:underline">
                  Inspect alert safeguards →
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 3. Scientific Hydrograph & Interactive 3D Basin Twin Preview */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="p-6 sm:p-8 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D8CBB3]/12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#EDE4D3]">
                  River-stage hydrograph, forecast uncertainty, and thresholds.
                </h2>
                <p className="text-xs text-[#A69B88] mt-1">
                  Patna Study Section (STN-PAT-01). Toggle between 6h, 24h, and 72h horizons or trigger a surge in the 3D twin to test telemetry responses.
                </p>
              </div>
              <Link href="/admin/forecasts">
                <Button variant="outline" size="sm" className="text-xs font-semibold">
                  Open Forecasting Workspace →
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <HydrologicalChart isSurge={isSurgeActive} />
              </div>
              <div className="lg:col-span-5">
                <DigitalTwinScene onSurgeStateChange={(surge) => setIsSurgeActive(surge)} />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 4. Event Lifecycle (Prepare, Respond, Recover) */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#EDE4D3] tracking-tight">
                Three phases of operational flood response.
              </h2>
            </div>
            <p className="text-sm text-[#A69B88] max-w-md leading-relaxed">
              Early warning protocols and command views for rising, cresting, and receding river levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2F6BFF]">Phase 1: Prepare</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1E1E1C] text-[#D8CBB3] border border-[#D8CBB3]/20">
                  Pre-Event
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#EDE4D3]">Preparedness</h3>
              <p className="text-xs text-[#A69B88] leading-relaxed">
                Continuous baseline gauge telemetry, upstream catchment rainfall projections, and ward preparedness checklists before river stages reach warning marks.
              </p>
            </div>

            <div className="rounded-xl border border-[#F59E0B]/30 bg-[#292925] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F59E0B]">Phase 2: Respond</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                  Active Event
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#EDE4D3]">Response</h3>
              <p className="text-xs text-[#A69B88] leading-relaxed">
                Active incident command, Sentinel-1 SAR inundation updates, commander-authorized CAP v1.2 advisories, and citizen SOS rescue dispatch.
              </p>
            </div>

            <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#D8CBB3]">Phase 3: Recover</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1E1E1C] text-[#D8CBB3] border border-[#D8CBB3]/20">
                  Post-Event
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#EDE4D3]">Recovery</h3>
              <p className="text-xs text-[#A69B88] leading-relaxed">
                Post-event SITREP archival, observed peak vs. forecast NSE evaluation, and safe return clearance for affected floodplain wards.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 5. Scientific Oversight (Pre-Run, Mid-Run, Post-Run Analytical Gates) */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#EDE4D3] tracking-tight">
                Supervisory analytical gates.
              </h2>
            </div>
            <p className="text-sm text-[#A69B88] max-w-md leading-relaxed">
              Three sequential verification stages enforced before any advisory dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/gates/pre-run" className="block group">
              <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-6 hover:border-[#2F6BFF] transition-colors h-full flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2F6BFF]">Pre-Run Check</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#EDE4D3] group-hover:text-[#2F6BFF] transition-colors">
                    Sensor and Input Integrity
                  </h3>
                  <p className="text-xs text-[#A69B88] leading-relaxed">
                    Audits gauge quorum, packet freshness (&lt;15 min), and physical river-stage bounds before initiating forecast runs.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#2F6BFF]">Inspect Pre-Run invariants →</span>
              </div>
            </Link>

            <Link href="/admin/gates/mid-run" className="block group">
              <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-6 hover:border-[#2F6BFF] transition-colors h-full flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2F6BFF]">Mid-Run Check</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#EDE4D3] group-hover:text-[#2F6BFF] transition-colors">
                    Ensemble and Physics Verification
                  </h3>
                  <p className="text-xs text-[#A69B88] leading-relaxed">
                    Verifies hydrodynamic mass conservation, Courant step convergence, and 90% ensemble spread stability.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#2F6BFF]">Inspect Mid-Run invariants →</span>
              </div>
            </Link>

            <Link href="/admin/gates/post-run" className="block group">
              <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-6 hover:border-[#2F6BFF] transition-colors h-full flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2F6BFF]">Post-Run Check</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#EDE4D3] group-hover:text-[#2F6BFF] transition-colors">
                    Consequence and CAP Readiness
                  </h3>
                  <p className="text-xs text-[#A69B88] leading-relaxed">
                    Cross-checks inundation polygons against local elevation and stages OASIS CAP v1.2 drafts for human sign-off.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#2F6BFF]">Inspect Post-Run invariants →</span>
              </div>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* 6. Study Area (Ganga Corridor & Patna/Bihar Research Context) */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#EDE4D3] tracking-tight">
                Patna study section, Middle Ganga basin.
              </h2>
              <p className="text-sm text-[#A69B88] leading-relaxed">
                Research and calibration focus on riverine flood dynamics along the middle Ganga corridor in Bihar, centered on the Patna urban reach (49.82 m nominal stage, 50.50 m warning, 51.80 m danger) and its confluences with the Sone, Gandak, and Punpun rivers.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Ganga river system",
                  "Patna, Bihar",
                  "Sone and Gandak confluences",
                  "River stage 49.82 m datum",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs bg-[#292925] text-[#D8CBB3] border border-[#D8CBB3]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <Link href="/study-area">
                  <Button variant="outline" className="text-xs font-semibold">
                    Explore Study Area Details
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] overflow-hidden shadow-lg">
                <TacticalMapSvg />
                <div className="p-3 bg-[#1E1E1C] border-t border-[#D8CBB3]/15 flex items-center justify-between text-xs text-[#A69B88]">
                  <span>Study area schematic, Patna reach (25.61°N, 85.14°E)</span>
                  <span className="text-[#D8CBB3]">Illustrative research map (not official civil defence)</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 7. Interactive Demonstration & Research Prototype Disclaimer */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="p-4 rounded-xl border border-[#F59E0B]/35 bg-[#292925] text-xs text-[#D8CBB3] leading-relaxed mb-8">
            <strong className="text-[#EDE4D3]">Research-Prototype Disclaimer:</strong> SURAKSHA is an academic flood-intelligence and decision-support research prototype, not an official government warning authority. Model outputs, synthetic scenarios, and sample telemetry carry inherent uncertainty and must never substitute for official civil-defence directives.
          </div>

          <div className="rounded-xl border border-[#D8CBB3]/20 bg-[#292925] p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#EDE4D3]">
                Test controlled flood scenarios in the Simulation Lab.
              </h2>
              <p className="text-xs sm:text-sm text-[#A69B88] leading-relaxed">
                Adjust synthetic river-stage and rainfall inputs, inspect ensemble hydrograph responses, and step through Pre-Run, Mid-Run, and Post-Run verification gates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/demo-lab">
                <Button
                  size="lg"
                  className="font-semibold text-xs uppercase tracking-wider bg-[#2F6BFF] text-white hover:bg-[#4B80FF]"
                >
                  Open Simulation Lab
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline" className="font-semibold text-xs uppercase tracking-wider">
                  Operations Portal
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
