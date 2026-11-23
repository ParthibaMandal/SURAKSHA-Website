"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HimalayasToPlainsHero } from "@/components/hero/HimalayasToPlainsHero";
import { PatnaCommandWorkspacePreview } from "@/components/console/PatnaCommandWorkspacePreview";
import { DigitalTwinScene } from "@/components/three/DigitalTwinScene";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { HydrologicalChart } from "@/components/shared/HydrologicalChart";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { ArrowRight, Radio, Cpu, Shield } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";

export default function HomePage() {
  const [isSurgeActive, setIsSurgeActive] = useState(false);
  const matrixRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = matrixRef.current;
    if (!root || prefersReducedMotion) return;

    const context = gsap.context(() => {
      const cards = root.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    }, root);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="relative bg-black text-white">
      {/* 1. Himalayas to Plains Early Warning Hero Section */}
      <HimalayasToPlainsHero />

      {/* 2. Operations Console & Architecture */}
      <section className="relative z-10 py-12 sm:py-16 border-t border-[#1F2823] w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 max-w-7xl">
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-white tracking-tight text-balance">
                Operations console and pipeline architecture.
              </h2>
            </div>
            <p className="text-sm text-[#9BA5A0] max-w-md leading-relaxed text-pretty">
              Real-time gauge telemetry streams, 1D/2D hydrodynamic forecast models, and CAP v1.2 incident dispatch unified in one supervisory interface.
            </p>
          </div>

          {/* Patna Command Console Preview */}
          <div className="mb-8 w-full">
            <PatnaCommandWorkspacePreview />
          </div>

          {/* Operational Pipeline Matrix with Animated Glass Icons */}
          <div
            ref={matrixRef}
            className="rounded-2xl border border-[#1F2823] bg-[#0D100E] divide-y divide-[#1F2823] lg:divide-y-0 lg:divide-x lg:grid lg:grid-cols-3"
          >
            <div className="group p-6 flex flex-col justify-between">
              <div>
                <div className="icon-glass w-10 h-10 rounded-xl text-white mb-3.5">
                  <Radio className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-sm font-semibold text-white block">Telemetry Ingestion</span>
                <p className="text-xs text-[#9BA5A0] leading-relaxed mt-2 mb-4">
                  Streams river-stage observations from CWC basin gauges and IMD precipitation grids across the Middle Ganga catchment.
                </p>
                <dl className="space-y-2 text-xs border-t border-[#1F2823] pt-3 text-[#9BA5A0]">
                  <div className="flex justify-between">
                    <dt className="text-[#6A7771]">Sampling cadence:</dt>
                    <dd className="text-white font-mono">15-minute intervals</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#6A7771]">Active gauge feeds:</dt>
                    <dd className="text-white font-mono">3 reference stations</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#6A7771]">Packet timeout:</dt>
                    <dd className="text-white font-mono">&lt; 30 minutes</dd>
                  </div>
                </dl>
              </div>
              <div className="pt-4 mt-4 border-t border-[#1F2823]">
                <Link href="/admin/stations" className="text-xs font-medium text-white hover:text-[#10B981] transition-colors">
                  View station telemetry →
                </Link>
              </div>
            </div>

            <div className="group p-6 flex flex-col justify-between">
              <div>
                <div className="icon-glass w-10 h-10 rounded-xl text-white mb-3.5" style={{ animationDelay: "0.7s" }}>
                  <Cpu className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-sm font-semibold text-white block">Hydrodynamic Modeling</span>
                <p className="text-xs text-[#9BA5A0] leading-relaxed mt-2 mb-4">
                  Pairs 1D river-channel calculations with 2D floodplain depression filling for corridor inundation mapping.
                </p>
                <dl className="space-y-2 text-xs border-t border-[#1F2823] pt-3 text-[#9BA5A0]">
                  <div className="flex justify-between">
                    <dt className="text-[#6A7771]">Forecast horizons:</dt>
                    <dd className="text-white font-mono">6h, 24h, 72h</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#6A7771]">Ensemble members:</dt>
                    <dd className="text-white font-mono">10 hydrological runs</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#6A7771]">Confidence bounds:</dt>
                    <dd className="text-white font-mono">90% prediction interval</dd>
                  </div>
                </dl>
              </div>
              <div className="pt-4 mt-4 border-t border-[#1F2823]">
                <Link href="/platform" className="text-xs font-medium text-white hover:text-[#10B981] transition-colors">
                  Review model pipeline →
                </Link>
              </div>
            </div>

            <div className="group p-6 flex flex-col justify-between">
              <div>
                <div className="icon-glass w-10 h-10 rounded-xl text-white mb-3.5" style={{ animationDelay: "1.4s" }}>
                  <Shield className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-sm font-semibold text-white block">Human-in-the-Loop Sign-off</span>
                <p className="text-xs text-[#9BA5A0] leading-relaxed mt-2 mb-4">
                  Enforces automated physics and plausibility checks before any public CAP v1.2 advisory is released.
                </p>
                <dl className="space-y-2 text-xs border-t border-[#1F2823] pt-3 text-[#9BA5A0]">
                  <div className="flex justify-between">
                    <dt className="text-[#6A7771]">Advisory protocol:</dt>
                    <dd className="text-white font-mono">OASIS CAP v1.2</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#6A7771]">Analytical checkpoints:</dt>
                    <dd className="text-white font-mono">3 sequential gates</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#6A7771]">Dispatch policy:</dt>
                    <dd className="text-white font-mono">Commander authorization</dd>
                  </div>
                </dl>
              </div>
              <div className="pt-4 mt-4 border-t border-[#1F2823]">
                <Link href="/alerts-safety" className="text-xs font-medium text-white hover:text-[#10B981] transition-colors">
                  Inspect alert safeguards →
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 3. Scientific Hydrograph & Interactive 3D Basin Twin Preview */}
      <section className="relative z-10 py-14 sm:py-16 border-t border-[#1F2823] w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="p-6 sm:p-8 rounded-lg border border-[#1F2823] bg-[#0D100E] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1F2823]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-white tracking-tight">
                  River-stage hydrograph, forecast uncertainty, and thresholds.
                </h2>
                <p className="text-xs text-[#9BA5A0] mt-1">
                  Patna Study Section (STN-PAT-01, Gandhi Ghat). Toggle between 6h, 24h, and 72h horizons or trigger a surge in the 3D twin to test telemetry responses.
                </p>
              </div>
              <Link href="/admin/forecasts">
                <Button variant="outline" size="sm" className="text-xs font-medium">
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
      <section className="relative z-10 py-14 sm:py-16 border-t border-[#1F2823] w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 max-w-7xl">
            <div>
              <div className="eyebrow">DISASTER RESPONSE CYCLE</div>
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-white tracking-tight text-balance">
                Three phases of operational flood response.
              </h2>
            </div>
            <p className="text-sm text-[#9BA5A0] max-w-md leading-relaxed text-pretty">
              Early warning protocols and command views for rising, cresting, and receding river levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="rounded-lg border border-[#1F2823] bg-[#0D100E] p-6 space-y-3 transition-colors hover:border-[#10B981]/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Phase 1: Prepare</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#141816] text-[#9BA5A0] border border-[#1F2823]">
                  Pre-Event
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">Preparedness</h3>
              <p className="text-xs text-[#9BA5A0] leading-relaxed">
                Continuous baseline gauge telemetry, upstream catchment rainfall projections, and ward preparedness checklists before river stages reach warning marks.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="rounded-lg border border-[#F59E0B]/30 bg-[#0D100E] p-6 space-y-3 transition-colors hover:border-[#F59E0B]/60"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F59E0B]">Phase 2: Respond</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25">
                  Active Event
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">Response</h3>
              <p className="text-xs text-[#9BA5A0] leading-relaxed">
                Active incident command, Sentinel-1 SAR inundation updates, commander-authorized CAP v1.2 advisories, and citizen SOS rescue dispatch.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="rounded-lg border border-[#1F2823] bg-[#0D100E] p-6 space-y-3 transition-colors hover:border-[#10B981]/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Phase 3: Recover</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#141816] text-[#9BA5A0] border border-[#1F2823]">
                  Post-Event
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">Recovery</h3>
              <p className="text-xs text-[#9BA5A0] leading-relaxed">
                Post-event SITREP archival, observed peak vs. forecast NSE evaluation, and safe return clearance for affected floodplain wards.
              </p>
            </motion.div>
          </div>
        </FadeIn>
      </section>

      {/* 5. Scientific Oversight (Pre-Run, Mid-Run, Post-Run Analytical Gates) */}
      <section className="relative z-10 py-14 sm:py-16 border-t border-[#1F2823] w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 max-w-7xl">
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-white tracking-tight text-balance">
                Supervisory analytical gates.
              </h2>
            </div>
            <p className="text-sm text-[#9BA5A0] max-w-md leading-relaxed text-pretty">
              Three sequential verification stages enforced before any public advisory dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/gates/pre-run" className="block group">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="rounded-lg border border-[#1F2823] bg-[#0D100E] p-6 hover:border-[#10B981]/50 transition-colors h-full flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Pre-Run Check</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    Sensor and Input Integrity
                  </h3>
                  <p className="text-xs text-[#9BA5A0] leading-relaxed">
                    Audits gauge quorum, packet freshness (&lt;15 min), and physical river-stage bounds before initiating forecast runs.
                  </p>
                </div>
                <span className="text-xs font-medium text-[#9BA5A0] group-hover:text-white transition-colors">
                  Inspect Pre-Run invariants →
                </span>
              </motion.div>
            </Link>

            <Link href="/admin/gates/mid-run" className="block group">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="rounded-lg border border-[#1F2823] bg-[#0D100E] p-6 hover:border-[#10B981]/50 transition-colors h-full flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Mid-Run Check</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    Ensemble and Physics Verification
                  </h3>
                  <p className="text-xs text-[#9BA5A0] leading-relaxed">
                    Verifies hydrodynamic mass conservation, Courant step convergence, and 90% ensemble spread stability.
                  </p>
                </div>
                <span className="text-xs font-medium text-[#9BA5A0] group-hover:text-white transition-colors">
                  Inspect Mid-Run invariants →
                </span>
              </motion.div>
            </Link>

            <Link href="/admin/gates/post-run" className="block group">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="rounded-lg border border-[#1F2823] bg-[#0D100E] p-6 hover:border-[#10B981]/50 transition-colors h-full flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Post-Run Check</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25">
                      PASS
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    Consequence and CAP Readiness
                  </h3>
                  <p className="text-xs text-[#9BA5A0] leading-relaxed">
                    Cross-checks inundation polygons against local elevation and stages OASIS CAP v1.2 drafts for human sign-off.
                  </p>
                </div>
                <span className="text-xs font-medium text-[#9BA5A0] group-hover:text-white transition-colors">
                  Inspect Post-Run invariants →
                </span>
              </motion.div>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* 6. Study Area (Ganga Corridor & Patna CWC Gandhi Ghat Benchmarks) */}
      <section className="relative z-10 py-14 sm:py-16 border-t border-[#1F2823] w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-white tracking-tight text-balance">
                Patna study section, Middle Ganga basin.
              </h2>
              <p className="text-sm text-[#9BA5A0] leading-relaxed text-pretty">
                Calibrated to Central Water Commission (CWC) hydrology records for the Patna urban reach at Gandhi Ghat: 46.20 m normal baseline, 47.60 m warning, 48.60 m danger, and 50.52 m record high flood level (HFL), integrating confluences with the Sone, Gandak, and Punpun rivers.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Ganga river system",
                  "Patna, Gandhi Ghat",
                  "Sone & Gandak confluences",
                  "CWC Danger: 48.60 m",
                  "CWC Warning: 47.60 m",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded text-xs bg-[#141816] text-[#9BA5A0] border border-[#1F2823]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <Link href="/study-area">
                  <Button variant="outline" className="text-xs font-medium">
                    Explore Study Area Details
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-lg border border-[#1F2823] bg-[#0D100E] overflow-hidden">
                <TacticalMapSvg />
                <div className="p-3.5 bg-[#080A09] border-t border-[#1F2823] flex items-center justify-between text-xs text-[#9BA5A0]">
                  <span>Study area schematic, Patna reach (25.61°N, 85.14°E)</span>
                  <span className="text-[#9BA5A0] font-mono">CWC Gandhi Ghat Gauges</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 7. Bottom CTA Band */}
      <section className="relative z-10 py-16 sm:py-20 border-t border-[#1F2823] w-full px-6 sm:px-10 lg:px-14">
        <FadeIn>
          <div className="p-4 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/5 text-xs text-[#9BA5A0] leading-relaxed mb-8 flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] font-mono font-semibold text-[10px]">
              DISCLAIMER
            </span>
            <span>
              <strong className="text-white">Research Prototype:</strong> SURAKSHA is an academic flood-intelligence research prototype, not an official government warning authority. Model outputs carry inherent uncertainty and must never substitute for official civil-defence directives.
            </span>
          </div>

          <div className="rounded-lg border border-[#1F2823] bg-[#0D100E] p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-white tracking-tight">
                Test controlled flood scenarios in the Simulation Lab.
              </h2>
              <p className="text-xs sm:text-sm text-[#9BA5A0] leading-relaxed">
                Adjust synthetic river-stage and rainfall inputs, inspect ensemble hydrograph responses, and step through Pre-Run, Mid-Run, and Post-Run verification gates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 shrink-0">
              <Link href="/demo-lab">
                <button
                  type="button"
                  className="btn-glass-primary px-6 py-3 text-xs sm:text-sm font-semibold text-white group cursor-pointer"
                >
                  <span className="relative z-10">Open Simulation Lab</span>
                  <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </Link>
              <Link href="/admin">
                <button
                  type="button"
                  className="btn-glass-secondary px-6 py-3 text-xs sm:text-sm font-semibold text-white cursor-pointer"
                >
                  <span className="relative z-10">Operations Portal</span>
                </button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
