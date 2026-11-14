"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DigitalTwinScene } from "@/components/three/DigitalTwinScene";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { TiltCard } from "@/components/motion/TiltCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Layers,
  ArrowRight,
  Activity,
  Droplets,
  Radio,
  PlayCircle,
  FileText,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const [isSurgeActive, setIsSurgeActive] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Atmospheric Background Glow Orbs from index.html */}
      <div className="hero-glow-orb -top-36 -right-20" />
      <div
        className="hero-glow-orb -bottom-24 -left-28"
        style={{
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.09), transparent 70%)",
        }}
      />

      {/* Hero Section matching index.html lines 1664-1729 */}
      <section className="relative z-10 pt-16 pb-20 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <FadeIn delay={0.1}>
              <div className="eyebrow">Flood Intelligence · Decision Support</div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight text-[#f0f7f6] leading-[1.12]">
                Know the rise.
                <br />
                <span className="gradient-text">Understand the risk.</span>
                <br />
                Prepare the response.
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-base text-[#9bb2af] leading-relaxed max-w-xl">
                SURAKSHA brings hydrological signals, geospatial evidence and response-oriented intelligence into one connected view — helping stakeholders understand what may be happening, where impacts could emerge and what deserves attention next.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/platform">
                  <Button
                    size="lg"
                    className="font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#5eead4] to-[#14b8a6] text-[#061110] hover:from-[#7cf0dd] hover:to-[#2dd4bf] shadow-[0_8px_25px_rgba(20,184,166,0.35)] flex items-center gap-2"
                  >
                    Explore the platform <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/demo-lab">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-semibold text-xs border-[rgba(94,234,212,0.22)] bg-[#16232a]/60 text-[#f0f7f6] hover:bg-[#1f333c] hover:border-[#5eead4]/50 flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4 text-[#5eead4]" />
                    Open simulation lab
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Meta Tags Strip from index.html line 1676 */}
            <FadeIn delay={0.5}>
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#2e4952]/40 text-xs text-[#9bb2af]">
                <span className="flex items-center gap-2">
                  <span className="dot" /> Flood-focused research prototype
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#5eead4]" /> Human-reviewed alert workflow
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#38bdf8]" /> Evidence-led intelligence
                </span>
              </div>
            </FadeIn>
          </div>

          {/* Right Hero Column: 3D Digital Twin Visual */}
          <div className="lg:col-span-6">
            <FadeIn delay={0.25} yOffset={25}>
              <DigitalTwinScene onSurgeStateChange={(surge) => setIsSurgeActive(surge)} />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Connected Pipeline Section matching index.html lines 1731-1761 */}
      <section className="relative z-10 py-16 border-t border-[#2e4952]/30 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="eyebrow">Connected Pipeline</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f0f7f6] tracking-tight">
                From fragmented signals
                <br />
                to a clearer picture.
              </h2>
            </div>
            <p className="text-sm text-[#9bb2af] max-w-md leading-relaxed">
              Flood situations evolve quickly. SURAKSHA is designed to bring observations, physical modelling, geospatial context and response considerations into a traceable workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeIn delay={0.1}>
              <TiltCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#5eead4]/10 border border-[#5eead4]/30 flex items-center justify-center text-[#5eead4] mb-4">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Observe the signals</h3>
                  <p className="text-xs text-[#9bb2af] leading-relaxed">
                    Bring together river-stage observations, rainfall, upstream indicators and satellite evidence with visible timestamps and data-quality context.
                  </p>
                </div>
                <div className="pt-6 mt-4 border-t border-[#2e4952]/40">
                  <Link
                    href="/methodology"
                    className="text-xs font-semibold text-[#5eead4] hover:underline inline-flex items-center gap-1 group"
                  >
                    Explore data methodology
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </TiltCard>
            </FadeIn>

            <FadeIn delay={0.2}>
              <TiltCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] mb-4">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Assess what may follow</h3>
                  <p className="text-xs text-[#9bb2af] leading-relaxed">
                    Connect forecast outputs with flood-risk, inundation and exposure analysis. Keep assumptions, uncertainty and evidence visible.
                  </p>
                </div>
                <div className="pt-6 mt-4 border-t border-[#2e4952]/40">
                  <Link
                    href="/platform"
                    className="text-xs font-semibold text-[#5eead4] hover:underline inline-flex items-center gap-1 group"
                  >
                    Explore capabilities
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </TiltCard>
            </FadeIn>

            <FadeIn delay={0.3}>
              <TiltCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/30 flex items-center justify-center text-[#fbbf24] mb-4">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Support the response</h3>
                  <p className="text-xs text-[#9bb2af] leading-relaxed">
                    Organise incidents, draft advisories, situation reports and citizen assistance workflows under human oversight.
                  </p>
                </div>
                <div className="pt-6 mt-4 border-t border-[#2e4952]/40">
                  <Link
                    href="/alerts-safety"
                    className="text-xs font-semibold text-[#5eead4] hover:underline inline-flex items-center gap-1 group"
                  >
                    Understand alert safeguards
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </TiltCard>
            </FadeIn>
          </div>
        </FadeIn>
      </section>

      {/* Event Lifecycle Section matching index.html lines 1763-1790 */}
      <section className="relative z-10 py-16 border-t border-[#2e4952]/30 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="eyebrow">Event Lifecycle</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f0f7f6] tracking-tight">
                One platform. Three moments.
              </h2>
            </div>
            <p className="text-sm text-[#9bb2af] max-w-md leading-relaxed">
              The same incident can move from preparedness to response and then recovery. The interface follows that lifecycle without confusing it with the analytical gates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] p-6 backdrop-blur-md">
              <div className="text-xs font-mono font-bold text-[#5eead4] tracking-wider mb-2">
                01 / PREPARE
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pre-event</h3>
              <p className="text-xs text-[#9bb2af] leading-relaxed">
                Monitor river and rainfall signals, review forecast scenarios, understand exposure and prepare response recommendations.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] p-6 backdrop-blur-md">
              <div className="text-xs font-mono font-bold text-[#38bdf8] tracking-wider mb-2">
                02 / RESPOND
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Active event</h3>
              <p className="text-xs text-[#9bb2af] leading-relaxed">
                Track changing conditions, inspect mapped evidence, coordinate incident information and review draft alerts.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] p-6 backdrop-blur-md">
              <div className="text-xs font-mono font-bold text-[#34d399] tracking-wider mb-2">
                03 / LEARN
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Post-event</h3>
              <p className="text-xs text-[#9bb2af] leading-relaxed">
                Compare observed impacts, document response actions, prepare reports and evaluate what the evidence supports.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Scientific Oversight Section matching index.html lines 1792-1816 */}
      <section className="relative z-10 py-16 border-t border-[#2e4952]/30 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="eyebrow">Scientific Oversight</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f0f7f6] tracking-tight">
                Supervisory checks at every stage.
              </h2>
            </div>
            <p className="text-sm text-[#9bb2af] max-w-md leading-relaxed">
              Three analytical gates review the quality and consistency of pipeline execution. They ensure transparent AI decision support governed by explicit rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/gates/pre-run" className="block group">
              <div className="rounded-2xl border border-[#2e4952]/50 bg-[#0f171b]/80 p-6 backdrop-blur-md hover:border-[#5eead4]/50 transition-all h-full">
                <div className="text-xs font-mono text-[#5eead4] font-bold mb-1">
                  01 · Pre-Run Gate
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#5eead4] transition-colors">
                  Input Quality & Sensor Checks
                </h3>
                <p className="text-xs text-[#9bb2af] leading-relaxed">
                  Checks input quality, missing observations, sensor conflicts and operating conditions before model execution.
                </p>
              </div>
            </Link>

            <Link href="/admin/gates/mid-run" className="block group">
              <div className="rounded-2xl border border-[#2e4952]/50 bg-[#0f171b]/80 p-6 backdrop-blur-md hover:border-[#38bdf8]/50 transition-all h-full">
                <div className="text-xs font-mono text-[#38bdf8] font-bold mb-1">
                  02 · Mid-Run Gate
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#38bdf8] transition-colors">
                  Model Disagreement & Physics
                </h3>
                <p className="text-xs text-[#9bb2af] leading-relaxed">
                  Reviews model outputs, disagreement, evidence support and whether escalation is needed.
                </p>
              </div>
            </Link>

            <Link href="/admin/gates/post-run" className="block group">
              <div className="rounded-2xl border border-[#2e4952]/50 bg-[#0f171b]/80 p-6 backdrop-blur-md hover:border-[#fbbf24]/50 transition-all h-full">
                <div className="text-xs font-mono text-[#fbbf24] font-bold mb-1">
                  03 · Post-Run Gate
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#fbbf24] transition-colors">
                  Plausibility & Human Review
                </h3>
                <p className="text-xs text-[#9bb2af] leading-relaxed">
                  Cross-checks downstream claims against available evidence and records confidence or human-review needs.
                </p>
              </div>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Study Context Section matching index.html lines 1818-1837 */}
      <section className="relative z-10 py-16 border-t border-[#2e4952]/30 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="eyebrow">Study Context</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Grounded in the Ganga basin context.
              </h2>
              <p className="text-sm text-[#9bb2af] leading-relaxed">
                The initial research focus is riverine flooding around the Ganga corridor in Bihar, with the Patna area as a key study context. Upstream catchment and cryosphere signals may be explored where suitable data and validation are available.
              </p>

              {/* Tag row matching index.html */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["Ganga river system", "Patna / Bihar", "Upstream context", "Flood-only scope"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-[#142329] text-[#c7dbd7] border border-[#2e4952]"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

              <div>
                <Link href="/study-area">
                  <Button variant="outline" className="text-xs flex items-center gap-2">
                    Explore study area <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-[#2e4952] overflow-hidden shadow-2xl relative">
                <TacticalMapSvg />
                <div className="p-3 bg-[#070b0e] border-t border-[#2e4952] text-center text-xs text-[#627b77] font-mono">
                  Illustrative study-area graphic · Not a live flood map
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Notice & Simulation CTA Band matching index.html lines 1839-1853 */}
      <section className="relative z-10 py-16 border-t border-[#2e4952]/30 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="p-5 rounded-2xl border border-[#fbbf24]/30 bg-[#fbbf24]/10 text-xs text-[#fef08a] leading-relaxed mb-8">
            <strong className="text-white">Important:</strong> SURAKSHA is a research and decision-support prototype, not an official warning authority or emergency service. Demonstrations may use synthetic data. Forecasts and model outputs are uncertain and must not replace guidance from authorised government agencies.
          </div>

          <div className="rounded-2xl border border-[rgba(94,234,212,0.3)] bg-gradient-to-r from-[#0d1e22] via-[#09151a] to-[#0d1e22] p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.65)]">
            <div className="space-y-2">
              <div className="eyebrow">Interactive Simulation</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                See how the system responds to a flood event.
              </h2>
              <p className="text-xs sm:text-sm text-[#9bb2af]">
                Try a controlled scenario using clearly labelled synthetic inputs and outputs.
              </p>
            </div>

            <Link href="/demo-lab" className="shrink-0">
              <Button
                size="lg"
                className="font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#5eead4] to-[#14b8a6] text-[#061110] hover:from-[#7cf0dd] hover:to-[#2dd4bf] shadow-[0_8px_25px_rgba(20,184,166,0.35)] flex items-center gap-2"
              >
                Launch demo lab <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
