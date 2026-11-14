"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DigitalTwinScene } from "@/components/three/DigitalTwinScene";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { HydrologicalChart } from "@/components/shared/HydrologicalChart";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Cpu,
  Globe,
  Layers,
  ShieldCheck,
  Radio,
  ArrowRight,
} from "lucide-react";

const CAPABILITY_CARDS = [
  {
    title: "Hydrological Ingestion",
    tag: "TELEMETRY",
    icon: Radio,
    desc: "Ingests 15-minute river-stage observations across CWC basin gauges alongside IMD catchment rainfall grids and telemetry freshness checks.",
  },
  {
    title: "Forecasting Committee",
    tag: "ENSEMBLE",
    icon: Cpu,
    desc: "Executes multi-horizon (6h, 24h, 72h) hydrodynamic ensemble predictions with 90% confidence intervals and mass-conservation checks.",
  },
  {
    title: "Geospatial Intelligence",
    tag: "SAR + DEM",
    icon: Globe,
    desc: "Combines Sentinel-1 SAR backscatter water masks with digital elevation contours to map corridor inundation envelopes.",
  },
  {
    title: "Consequence Assessment",
    tag: "EXPOSURE",
    icon: Layers,
    desc: "Evaluates ward-level floodplain exposure, critical embankment freeboard, and shelter readiness along the Patna urban reach.",
  },
  {
    title: "Supervisory Gates",
    tag: "VERIFICATION",
    icon: ShieldCheck,
    desc: "Enforces Pre-Run, Mid-Run, and Post-Run analytical verification gates so corrupted telemetry or divergent runs never trigger false alarms.",
  },
  {
    title: "Response Intelligence",
    tag: "CAP v1.2",
    icon: Activity,
    desc: "Produces OASIS CAP v1.2 advisories, SITREP dossiers, and citizen SOS triage queues governed strictly by human commander approval.",
  },
];

export default function HomePage() {
  const [isSurgeActive, setIsSurgeActive] = useState(false);

  return (
    <div className="relative bg-[#1E1E1C] text-[#D8CBB3]">
      {/* 1. Hero Section */}
      <section className="relative z-10 pt-12 pb-20 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <FadeIn delay={0.05}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#292925] border border-[#D8CBB3]/20 text-[11px] font-mono text-[#D8CBB3]">
                <span className="w-2 h-2 rounded-full bg-[#2F6BFF]" />
                GANGA BASIN · FLOOD INTELLIGENCE & DISASTER RESPONSE
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-[#D8CBB3] leading-[1.12]">
                Understand the rise.
                <br />
                Anticipate the risk.
                <br />
                <span className="text-[#EDE4D3]">Coordinate the response.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="text-base text-[#A69B88] leading-relaxed max-w-xl">
                SURAKSHA is a scientific flood-intelligence and emergency-response decision-support platform. It unifies hydrological station telemetry, ensemble flood forecasting, Sentinel-1 geospatial evidence, and human-governed CAP advisories for the Ganga corridor in Bihar.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link href="/platform">
                  <Button
                    size="lg"
                    className="font-semibold text-xs uppercase tracking-wider bg-[#2F6BFF] text-white hover:bg-[#4B80FF]"
                  >
                    Explore Platform
                  </Button>
                </Link>

                <Link href="/demo-lab">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-semibold text-xs uppercase tracking-wider"
                  >
                    Launch Simulation
                  </Button>
                </Link>

                <Link
                  href="/admin"
                  className="text-xs font-mono text-[#2F6BFF] hover:underline px-2 py-2 flex items-center gap-1"
                >
                  Open Command Centre <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeIn>

            {/* Meta Provenance Strip */}
            <FadeIn delay={0.25}>
              <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[#D8CBB3]/15 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-[#A69B88] block">BASE DATUM</span>
                  <span className="text-[#EDE4D3] font-bold">49.82 m (Patna)</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A69B88] block">ANALYTICAL GATES</span>
                  <span className="text-[#2F6BFF] font-bold">Pre · Mid · Post</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A69B88] block">ALERT GOVERNANCE</span>
                  <span className="text-[#EDE4D3] font-bold">Human-Approved</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Hero Column: River-Basin Monitoring Interface / Geospatial Preview */}
          <div className="lg:col-span-6">
            <FadeIn delay={0.15} yOffset={20}>
              <DigitalTwinScene onSurgeStateChange={(surge) => setIsSurgeActive(surge)} />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. Platform Capabilities (6 Required Cards) */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="eyebrow">PLATFORM CAPABILITIES</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#D8CBB3] tracking-tight">
                Six integrated layers of flood intelligence.
              </h2>
            </div>
            <p className="text-sm text-[#A69B88] max-w-md leading-relaxed">
              Every stage of the pipeline—from gauge ingestion to CAP v1.2 advisory dispatch—preserves data provenance and uncertainty bounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITY_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] hover:border-[#2F6BFF]/40 transition-colors flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-[#1E1E1C] border border-[#D8CBB3]/15 grid place-items-center text-[#2F6BFF]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1E1E1C] text-[#D8CBB3] border border-[#D8CBB3]/20">
                        {card.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#EDE4D3]">{card.title}</h3>
                    <p className="text-xs text-[#A69B88] leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-[#D8CBB3]/10 flex items-center justify-between text-[11px] font-mono text-[#2F6BFF]">
                    <span>Verified module</span>
                    <Link href="/platform" className="hover:underline">
                      Inspect →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </section>

      {/* Scientific Hydrograph Preview Section */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="p-6 sm:p-8 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D8CBB3]/12">
              <div>
                <div className="eyebrow">SCIENTIFIC DATA VISUALIZATION</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#D8CBB3]">
                  River-Stage Hydrograph, Forecast Uncertainty & Thresholds
                </h2>
                <p className="text-xs text-[#A69B88] mt-1">
                  Patna Study Section (STN-PAT-01) · Toggle between 6h, 24h, and 72h horizons or trigger a surge in the 3D basin above.
                </p>
              </div>
              <Link href="/admin/forecasts">
                <Button variant="outline" size="sm" className="text-xs font-mono">
                  Open Forecasting Workspace →
                </Button>
              </Link>
            </div>

            <HydrologicalChart isSurge={isSurgeActive} />
          </div>
        </FadeIn>
      </section>

      {/* 3. Event Lifecycle (Prepare, Respond, Recover) */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="eyebrow">EVENT LIFECYCLE</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#D8CBB3] tracking-tight">
                Structured across Prepare, Respond, and Recover.
              </h2>
            </div>
            <p className="text-sm text-[#A69B88] max-w-md leading-relaxed">
              Operational and citizen views adapt as river stage approaches warning (50.50 m) and danger (51.80 m) thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#2F6BFF]">PHASE 01 · PREPARE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1E1E1C] text-[#D8CBB3] border border-[#D8CBB3]/20">
                  Pre-Event
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#EDE4D3]">Prepare</h3>
              <p className="text-xs text-[#A69B88] leading-relaxed">
                Continuous baseline gauge telemetry, upstream catchment rainfall projections, and ward preparedness checklists before river stages reach warning marks.
              </p>
            </div>

            <div className="rounded-xl border border-[#F59E0B]/30 bg-[#292925] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#F59E0B]">PHASE 02 · RESPOND</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                  Active Event
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#EDE4D3]">Respond</h3>
              <p className="text-xs text-[#A69B88] leading-relaxed">
                Active incident command, Sentinel-1 SAR inundation updates, commander-authorized CAP v1.2 advisories, and citizen SOS rescue dispatch.
              </p>
            </div>

            <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#D8CBB3]">PHASE 03 · RECOVER</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1E1E1C] text-[#D8CBB3] border border-[#D8CBB3]/20">
                  Post-Event
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#EDE4D3]">Recover</h3>
              <p className="text-xs text-[#A69B88] leading-relaxed">
                Post-event SITREP archival, observed peak vs. forecast NSE evaluation, and safe return clearance for affected floodplain wards.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 4. Scientific Oversight (Pre-Run, Mid-Run, Post-Run Analytical Gates) */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="eyebrow">SCIENTIFIC OVERSIGHT</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#D8CBB3] tracking-tight">
                Pre-Run, Mid-Run, and Post-Run analytical gates.
              </h2>
            </div>
            <p className="text-sm text-[#A69B88] max-w-md leading-relaxed">
              Every pipeline cycle passes three automated verification checkpoints before presenting recommendations to a human commander.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/gates/pre-run" className="block group">
              <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-6 hover:border-[#2F6BFF] transition-colors h-full flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#2F6BFF]">GATE 01 · PRE-RUN</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#EDE4D3] group-hover:text-[#2F6BFF] transition-colors">
                    Pre-Run Gate: Sensor & Input Integrity
                  </h3>
                  <p className="text-xs text-[#A69B88] leading-relaxed">
                    Audits gauge quorum, packet freshness (&lt;15 min), and physical river-stage bounds before initiating forecast runs.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#2F6BFF]">Inspect Pre-Run invariants →</span>
              </div>
            </Link>

            <Link href="/admin/gates/mid-run" className="block group">
              <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-6 hover:border-[#2F6BFF] transition-colors h-full flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#2F6BFF]">GATE 02 · MID-RUN</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#EDE4D3] group-hover:text-[#2F6BFF] transition-colors">
                    Mid-Run Gate: Ensemble & Physics Verification
                  </h3>
                  <p className="text-xs text-[#A69B88] leading-relaxed">
                    Verifies hydrodynamic mass conservation, Courant step convergence, and 90% ensemble spread stability.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#2F6BFF]">Inspect Mid-Run invariants →</span>
              </div>
            </Link>

            <Link href="/admin/gates/post-run" className="block group">
              <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-6 hover:border-[#2F6BFF] transition-colors h-full flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#2F6BFF]">GATE 03 · POST-RUN</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#EDE4D3] group-hover:text-[#2F6BFF] transition-colors">
                    Post-Run Gate: Consequence & CAP Readiness
                  </h3>
                  <p className="text-xs text-[#A69B88] leading-relaxed">
                    Cross-checks inundation polygons against local elevation and stages OASIS CAP v1.2 drafts for human sign-off.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#2F6BFF]">Inspect Post-Run invariants →</span>
              </div>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* 5. Study Area (Ganga Corridor & Patna/Bihar Research Context) */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="eyebrow">STUDY AREA CONTEXT</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#D8CBB3] tracking-tight">
                Patna Study Section, Ganga River Basin.
              </h2>
              <p className="text-sm text-[#A69B88] leading-relaxed">
                Research and calibration focus on riverine flood dynamics along the middle Ganga corridor in Bihar, centered on the Patna urban reach (49.82 m nominal stage, 50.50 m warning, 51.80 m danger) and its confluences with the Sone, Gandak, and Punpun rivers.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Ganga river system",
                  "Patna, Bihar",
                  "Sone & Gandak confluences",
                  "River stage 49.82 m datum",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs font-mono bg-[#292925] text-[#D8CBB3] border border-[#D8CBB3]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <Link href="/study-area">
                  <Button variant="outline" className="text-xs">
                    Explore Study Area Details
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] overflow-hidden shadow-lg">
                <TacticalMapSvg />
                <div className="p-3 bg-[#1E1E1C] border-t border-[#D8CBB3]/15 flex items-center justify-between text-xs text-[#A69B88] font-mono">
                  <span>STUDY AREA SCHEMATIC · PATNA REACH (25.61°N, 85.14°E)</span>
                  <span className="text-[#D8CBB3]">ILLUSTRATIVE MAP (NOT LIVE)</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 6. Interactive Demonstration & Research Prototype Disclaimer */}
      <section className="relative z-10 py-16 border-t border-[#D8CBB3]/15 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="p-4 rounded-xl border border-[#F59E0B]/35 bg-[#292925] text-xs text-[#D8CBB3] leading-relaxed mb-8">
            <strong className="text-[#EDE4D3]">Research-Prototype Disclaimer:</strong> SURAKSHA is an academic flood-intelligence and decision-support research prototype, not an official government warning authority. Model outputs, synthetic scenarios, and sample telemetry carry inherent uncertainty and must never substitute for official civil-defence directives.
          </div>

          <div className="rounded-xl border border-[#D8CBB3]/20 bg-[#292925] p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <div className="eyebrow">INTERACTIVE DEMONSTRATION</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#EDE4D3]">
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
