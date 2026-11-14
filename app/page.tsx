"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DigitalTwinScene } from "@/components/three/DigitalTwinScene";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [, setIsSurgeActive] = useState(false);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative z-10 pt-14 pb-20 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <FadeIn delay={0.05}>
              <div className="eyebrow">Flood Intelligence and Decision Support</div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#f0f7f6] leading-[1.14]">
                Know the rise.
                <br />
                Understand the risk.
                <br />
                Prepare the response.
              </h1>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="text-base text-[#9bb2af] leading-relaxed max-w-xl">
                SURAKSHA integrates hydrological signals, geospatial evidence and response intelligence into one connected view for flood risk along the Ganga corridor.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/platform">
                  <Button
                    size="lg"
                    className="font-semibold text-xs uppercase tracking-wider"
                  >
                    Explore the platform
                  </Button>
                </Link>

                <Link href="/demo-lab">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-medium text-xs border-[#1c2c34] text-[#f0f7f6] hover:bg-[#0f1d24]"
                  >
                    Open simulation lab
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Meta Tags Strip */}
            <FadeIn delay={0.25}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-[#1c2c34] text-xs text-[#9bb2af]">
                <span>Flood-focused research prototype</span>
                <span>Human-reviewed alert workflow</span>
                <span>Evidence-led intelligence</span>
              </div>
            </FadeIn>
          </div>

          {/* Right Hero Column: 3D Digital Twin Visual */}
          <div className="lg:col-span-6">
            <FadeIn delay={0.15} yOffset={20}>
              <DigitalTwinScene onSurgeStateChange={(surge) => setIsSurgeActive(surge)} />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Product Interface & Operational Telemetry Matrix (Screen 2: Real Product Picture + Real Data) */}
      <section className="relative z-10 py-16 border-t border-[#1c2c34] max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f7f6] tracking-tight">
                From fragmented signals to a clearer picture.
              </h2>
            </div>
            <p className="text-sm text-[#9bb2af] max-w-md leading-relaxed">
              Riverine flooding requires structured telemetry, physical hydrodynamic modeling and supervisory verification across each stage of analysis.
            </p>
          </div>

          {/* Real Platform Interface Screenshot */}
          <div className="mb-10 rounded-lg border border-[#1c2c34] bg-[#071115] overflow-hidden shadow-lg">
            <div className="px-5 py-3 border-b border-[#1c2c34] bg-[#050d11] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-[#f0f7f6]">
                SURAKSHA Operations Workspace, Patna Study Reach
              </span>
              <span className="text-[#9bb2af]">
                Telemetry datum: 49.82 m nominal, ensemble 24h forecast envelope
              </span>
            </div>
            <div className="relative">
              <img
                src="/images/suraksha-interface.png"
                alt="SURAKSHA Hydrological Intelligence Platform Interface"
                className="w-full h-auto object-cover max-h-[520px]"
              />
            </div>
          </div>

          {/* Operational Specification Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-[#1c2c34] bg-[#071115] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#f0f7f6] mb-2">
                  Signal Ingestion
                </h3>
                <p className="text-xs text-[#9bb2af] leading-relaxed mb-4">
                  Streams river stage from CWC monitoring stations in the Middle Ganga reach alongside IMD rainfall grids and satellite SAR backscatter indices.
                </p>
                <div className="space-y-1.5 text-xs border-t border-[#1c2c34] pt-3 text-[#9bb2af]">
                  <div className="flex justify-between">
                    <span>Gauge sampling:</span>
                    <span className="text-[#f0f7f6]">15-minute intervals</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base gauge elevation:</span>
                    <span className="text-[#f0f7f6]">49.82 m normal datum</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Telemetry sources:</span>
                    <span className="text-[#f0f7f6]">3 river station feeds</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[#1c2c34]">
                <Link
                  href="/methodology"
                  className="text-xs font-semibold text-[#08a2be] hover:underline"
                >
                  Review data methodology
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-[#1c2c34] bg-[#071115] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#f0f7f6] mb-2">
                  Predictive Modeling
                </h3>
                <p className="text-xs text-[#9bb2af] leading-relaxed mb-4">
                  Pairs 1D hydrodynamic channel calculations with 2D digital elevation depression filling across 6h, 24h and 72h forecast horizons.
                </p>
                <div className="space-y-1.5 text-xs border-t border-[#1c2c34] pt-3 text-[#9bb2af]">
                  <div className="flex justify-between">
                    <span>Simulation horizon:</span>
                    <span className="text-[#f0f7f6]">6h surge, 24h envelope</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Physics checks:</span>
                    <span className="text-[#f0f7f6]">Mass conservation</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ensemble variance:</span>
                    <span className="text-[#f0f7f6]">Flagged above 0.45 m</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[#1c2c34]">
                <Link
                  href="/platform"
                  className="text-xs font-semibold text-[#08a2be] hover:underline"
                >
                  Inspect architecture
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-[#1c2c34] bg-[#071115] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#f0f7f6] mb-2">
                  Supervised Response
                </h3>
                <p className="text-xs text-[#9bb2af] leading-relaxed mb-4">
                  Generates CAP v1.2 structured incident summaries and citizen advisories strictly governed by human verification gates.
                </p>
                <div className="space-y-1.5 text-xs border-t border-[#1c2c34] pt-3 text-[#9bb2af]">
                  <div className="flex justify-between">
                    <span>Advisory standard:</span>
                    <span className="text-[#f0f7f6]">OASIS CAP v1.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verification policy:</span>
                    <span className="text-[#f0f7f6]">Supervisory sign-off</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operational gates:</span>
                    <span className="text-[#f0f7f6]">3 validation checkpoints</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[#1c2c34]">
                <Link
                  href="/alerts-safety"
                  className="text-xs font-semibold text-[#08a2be] hover:underline"
                >
                  Inspect alert safeguards
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Event Lifecycle Section */}
      <section className="relative z-10 py-16 border-t border-[#1c2c34] max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f7f6] tracking-tight">
                One platform across three phases.
              </h2>
            </div>
            <p className="text-sm text-[#9bb2af] max-w-md leading-relaxed">
              Incidents transition from preparedness through active surge to post-event evaluation. Operational views configure to each stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-[#1c2c34] bg-[#071115] p-6">
              <h3 className="text-lg font-bold text-[#f0f7f6] mb-2">Pre-event preparedness</h3>
              <p className="text-xs text-[#9bb2af] leading-relaxed">
                Tracks baseline gauge data, reviews catchment rain projections and evaluates exposure before river stages breach advisory levels.
              </p>
            </div>

            <div className="rounded-lg border border-[#1c2c34] bg-[#071115] p-6">
              <h3 className="text-lg font-bold text-[#f0f7f6] mb-2">Active event response</h3>
              <p className="text-xs text-[#9bb2af] leading-relaxed">
                Monitors stage escalation past warning thresholds, updates mapped inundation extents and manages verified incident alerts.
              </p>
            </div>

            <div className="rounded-lg border border-[#1c2c34] bg-[#071115] p-6">
              <h3 className="text-lg font-bold text-[#f0f7f6] mb-2">Post-event analysis</h3>
              <p className="text-xs text-[#9bb2af] leading-relaxed">
                Compares observed peak marks against model predictions, documents response timelines and refines hydrodynamic calibration.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Scientific Oversight Section */}
      <section className="relative z-10 py-16 border-t border-[#1c2c34] max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f7f6] tracking-tight">
                Supervisory validation gates.
              </h2>
            </div>
            <p className="text-sm text-[#9bb2af] max-w-md leading-relaxed">
              Three analytical gates verify sensor inputs, model consistency and alert claims before any output is recommended to emergency coordinators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/gates/pre-run" className="block group">
              <div className="rounded-lg border border-[#1c2c34] bg-[#071115] p-6 hover:border-[#08a2be]/60 transition-colors h-full">
                <h3 className="text-base font-bold text-[#f0f7f6] mb-2 group-hover:text-[#08a2be] transition-colors">
                  Pre-Run Gate: Sensor Integrity
                </h3>
                <p className="text-xs text-[#9bb2af] leading-relaxed">
                  Checks gauge telemetry health, identifies missing values and verifies upstream catchment boundaries before running forecast models.
                </p>
              </div>
            </Link>

            <Link href="/admin/gates/mid-run" className="block group">
              <div className="rounded-lg border border-[#1c2c34] bg-[#071115] p-6 hover:border-[#08a2be]/60 transition-colors h-full">
                <h3 className="text-base font-bold text-[#f0f7f6] mb-2 group-hover:text-[#08a2be] transition-colors">
                  Mid-Run Gate: Physics Verification
                </h3>
                <p className="text-xs text-[#9bb2af] leading-relaxed">
                  Audits conservation of mass in hydrodynamic models, flags ensemble spread divergence and flags unphysical stage spikes.
                </p>
              </div>
            </Link>

            <Link href="/admin/gates/post-run" className="block group">
              <div className="rounded-lg border border-[#1c2c34] bg-[#071115] p-6 hover:border-[#08a2be]/60 transition-colors h-full">
                <h3 className="text-base font-bold text-[#f0f7f6] mb-2 group-hover:text-[#08a2be] transition-colors">
                  Post-Run Gate: Decision Plausibility
                </h3>
                <p className="text-xs text-[#9bb2af] leading-relaxed">
                  Cross-checks inundation extent claims against local topography and records confidence intervals before human supervisory review.
                </p>
              </div>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Study Context Section */}
      <section className="relative z-10 py-16 border-t border-[#1c2c34] max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="eyebrow">Study Context</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f7f6] tracking-tight">
                Patna Study Section, Ganga Basin.
              </h2>
              <p className="text-sm text-[#9bb2af] leading-relaxed">
                Initial research focuses on riverine flood risk along the Ganga corridor in Bihar, centered on the Patna reach (river stage 49.82 m base datum) with upstream tributary indicators.
              </p>

              {/* Tag row */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["Ganga river system", "Patna, Bihar", "Upstream hydrology", "Flood-only scope"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded text-xs font-medium bg-[#071115] text-[#9bb2af] border border-[#1c2c34]"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

              <div>
                <Link href="/study-area">
                  <Button variant="outline" className="text-xs border-[#1c2c34] text-[#f0f7f6]">
                    Explore study area
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-lg border border-[#1c2c34] bg-[#071115] overflow-hidden shadow-lg">
                <TacticalMapSvg />
                <div className="p-3 bg-[#050d11] border-t border-[#1c2c34] text-center text-xs text-[#627b77] font-sans">
                  Illustrative study area graphic, not an active government flood map.
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Simulation CTA & Research Notice */}
      <section className="relative z-10 py-16 border-t border-[#1c2c34] max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="p-4 rounded border border-[#f59e0b]/30 bg-[#071115] text-xs text-[#fef08a] leading-relaxed mb-8">
            <strong className="text-white">Notice:</strong> SURAKSHA is an academic research and decision-support prototype, not an official warning authority. Model outputs carry inherent uncertainty and must not substitute for authorized government flood directives.
          </div>

          <div className="rounded-lg border border-[#1c2c34] bg-[#071115] p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#f0f7f6]">
                Evaluate system response under flood conditions.
              </h2>
              <p className="text-xs sm:text-sm text-[#9bb2af]">
                Run a controlled simulation scenario using calibrated synthetic hydrological inputs.
              </p>
            </div>

            <Link href="/demo-lab" className="shrink-0">
              <Button
                size="lg"
                className="font-semibold text-xs uppercase tracking-wider"
              >
                Launch demo lab
              </Button>
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
