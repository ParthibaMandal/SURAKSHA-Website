"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Terminal,
  Copy,
  Check,
  Archive,
  Network,
  BookmarkCheck,
  Users2,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Cpu,
  Eye,
  Sliders,
  Layers,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function HorizonLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeObjective, setActiveObjective] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const objectives = [
    {
      id: 0,
      title: "Choose an objective",
      tag: "SPATIAL STRATEGY",
      desc: "Define spatial tension, typographic scale, and structural balance before introducing stylistic treatment.",
      reach: "18,274",
      engagement: "+12.4%",
      efficiency: "9.8 / 10",
      bars: [35, 52, 44, 78, 62, 95, 84, 90, 72, 88, 65, 92],
    },
    {
      id: 1,
      title: "Generate Insights",
      tag: "OCULAR ANALYSIS",
      desc: "Execute algorithmic scans of ocular heatmaps and visual cadence to eliminate friction in reading flow.",
      reach: "24,810",
      engagement: "+18.9%",
      efficiency: "9.9 / 10",
      bars: [42, 65, 58, 82, 74, 88, 92, 98, 86, 94, 80, 96],
    },
    {
      id: 2,
      title: "Validate at scale",
      tag: "HEURISTIC AUDIT",
      desc: "Cross-check against WCAG AAA contrast ratios, optical baseline grids, and dynamic viewport scalers.",
      reach: "31,450",
      engagement: "+23.1%",
      efficiency: "10.0 / 10",
      bars: [55, 70, 64, 89, 81, 94, 96, 100, 91, 97, 88, 99],
    },
  ];

  const codeSnippet = `import { Horizon, LayoutEngine } from "@horizon/core";

export const StudioLayout = () => {
  const layout = LayoutEngine.compose({
    theme: "minimalist-dark",
    contrast: "wcag-aaa",
    baselineGrid: 4,
    spatialTension: "harmonic",
  });

  return (
    <Horizon.Canvas layout={layout} viewport="dynamic">
      <Horizon.TypographicScale ratio={1.25} />
      <Horizon.SpatialGrid columns={12} gap="fluid" />
      <Horizon.Telemetry onInspect={(m) => console.log(m)} />
    </Horizon.Canvas>
  );
};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const toolMatrix = [
    {
      icon: Archive,
      title: "Structured Libraries",
      desc: "Curated component tokens, layout templates, and typographic primitives engineered for seamless composability.",
    },
    {
      icon: Network,
      title: "Knowledge Graph",
      desc: "Interconnected design rationale linking typography, spatial scale, and responsive motion vectors across surfaces.",
    },
    {
      icon: BookmarkCheck,
      title: "Citation Tracking",
      desc: "Trace every design decision back to empirical ergonomics, Swiss print history, and accessibility benchmarks.",
    },
    {
      icon: Users2,
      title: "Peer Collaboration",
      desc: "Synchronous feedback loops, spatial canvas annotations, and version-controlled design system approvals.",
    },
  ];

  const brandLogos = [
    "KINFOLK",
    "CEREAL",
    "MUSEUM",
    "VOGUE",
    "MONOCLE",
    "ARCH",
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-[#f3f4f6] font-sans antialiased selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      {/* Subtle global ambient background noise / glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent blur-[140px]" />
      </div>

      {/* =========================================================================
          1. FLOATING NAVIGATION BAR
         ========================================================================= */}
      <header className="fixed top-6 inset-x-0 z-50 max-w-4xl mx-auto px-4">
        <nav className="backdrop-blur-xl bg-[#121214]/80 border border-white/10 rounded-full py-2.5 px-6 shadow-2xl shadow-black/80 flex items-center justify-between transition-all">
          {/* Brand Logo */}
          <Link
            href="/horizon"
            className="flex items-center gap-2.5 text-white font-medium tracking-tight text-sm group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white group-hover:scale-125 transition-transform duration-300" />
            <span className="tracking-wider uppercase text-xs font-semibold">
              Horizon
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-400">
            <a
              href="#overview"
              className="hover:text-white transition-colors duration-200"
            >
              Overview
            </a>
            <a
              href="#manifesto"
              className="hover:text-white transition-colors duration-200"
            >
              Philosophy
            </a>
            <a
              href="#capabilities"
              className="hover:text-white transition-colors duration-200"
            >
              Capabilities
            </a>
            <a
              href="#tools"
              className="hover:text-white transition-colors duration-200"
            >
              Toolkit
            </a>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <a
              href="#get-started"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-black bg-white hover:bg-neutral-200 transition-colors duration-200 shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-neutral-400 hover:text-white p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-3 p-5 rounded-2xl bg-[#121214]/95 border border-white/10 backdrop-blur-2xl flex flex-col gap-4 text-sm text-neutral-300 shadow-2xl"
            >
              <a
                href="#overview"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                Overview
              </a>
              <a
                href="#manifesto"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                Philosophy
              </a>
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                Capabilities
              </a>
              <a
                href="#tools"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                Toolkit
              </a>
              <div className="pt-2 border-t border-neutral-800">
                <a
                  href="#get-started"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center block py-2 rounded-full text-xs font-semibold bg-white text-black"
                >
                  Get Started Today
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="relative z-10 pt-28 pb-20">
        {/* =========================================================================
            2. HERO SECTION (FRAMED PICTURE-WINDOW VIEW)
           ========================================================================= */}
        <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 mb-24">
          <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/10 relative shadow-2xl bg-[#0e0e10] min-h-[580px] sm:min-h-[660px] flex flex-col justify-between p-6 sm:p-12 md:p-16 text-center items-center">
            {/* Background Cinematic Mountain Photography */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-[1.02] transform transition-transform duration-1000 ease-out"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85')`,
              }}
            />

            {/* Framed Cinematic Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-black/45 to-black/35" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/70 pointer-events-none" />

            {/* Top Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-neutral-300 bg-black/40 backdrop-blur-md border border-white/15"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>HORIZON · EDITION 01</span>
            </motion.div>

            {/* Center Display Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative z-10 my-auto py-10 max-w-4xl mx-auto"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-md">
                Master the Art of Minimalist Design in the Modern Era
              </h1>
              <p className="mt-6 text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow">
                A rigorous, multi-disciplinary studio curriculum exploring
                spatial architecture, purposeful reduction, and the grammar of
                negative space.
              </p>
            </motion.div>

            {/* Bottom Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative z-10 flex flex-col sm:flex-row items-center gap-4"
            >
              <a
                href="#get-started"
                className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-black bg-white hover:bg-neutral-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center gap-2 group"
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 sm:border-l sm:border-white/20 sm:pl-4">
                Self-paced Studio · 12 Modules
              </span>
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            3. MANIFESTO & SOCIAL PROOF
           ========================================================================= */}
        <section
          id="manifesto"
          className="max-w-6xl mx-auto px-4 sm:px-6 mb-28"
        >
          {/* Two-Column Manifesto Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-baseline pb-16 border-b border-neutral-800">
            <div className="md:col-span-3">
              <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                THE PHILOSOPHY
              </span>
            </div>
            <div className="md:col-span-9">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-neutral-200 leading-snug tracking-tight">
                This comprehensive course{" "}
                <span className="text-white font-medium">
                  strips away the unnecessary
                </span>
                , focusing on core principles of{" "}
                <span className="text-white font-medium">spatial relationship</span>
                , typography, and purposeful white space.
              </p>
            </div>
          </div>

          {/* Partner / Brand Ticker */}
          <div className="pt-10 flex flex-wrap items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
            {brandLogos.map((brand) => (
              <span
                key={brand}
                className="text-xs sm:text-sm font-bold tracking-[0.25em] text-neutral-400 hover:text-white transition-colors duration-200 uppercase"
              >
                {brand}
              </span>
            ))}
          </div>
        </section>

        {/* =========================================================================
            4. FEATURE BLOCK 1 (ANALYTICS & SMART INSIGHTS)
           ========================================================================= */}
        <section
          id="capabilities"
          className="max-w-6xl mx-auto px-4 sm:px-6 mb-32"
        >
          {/* Section Header */}
          <div className="mb-14">
            <div className="text-[10px] sm:text-xs font-mono font-semibold tracking-widest uppercase text-neutral-500 mb-2">
              CORE CAPABILITIES 01
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white max-w-2xl">
              Everything you need to master your workflow
            </h2>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Interactive List / Accordion */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-white/10" />
                <span>Smart Insights</span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Gain real-time clarity across spatial balance, optical density,
                and readability metrics before shipping high-stakes design work.
              </p>

              {/* Interactive Tabs */}
              <div className="mt-4 flex flex-col divide-y divide-neutral-800 border-y border-neutral-800">
                {objectives.map((item) => {
                  const isActive = activeObjective === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveObjective(item.id)}
                      className={`text-left py-4.5 px-2 transition-all flex flex-col gap-1.5 group relative ${
                        isActive ? "text-white" : "text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold tracking-tight">
                          {item.title}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isActive
                              ? "rotate-90 text-white"
                              : "text-neutral-600 group-hover:translate-x-1"
                          }`}
                        />
                      </div>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-neutral-400 leading-normal pr-4 pt-1"
                        >
                          {item.desc}
                        </motion.p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: macOS-Style Glass Card Visualization */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-[#101014]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                {/* Top macOS Window Control Dots */}
                <div className="flex items-center justify-between pb-5 border-b border-neutral-800 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="text-[11px] font-mono text-neutral-500 ml-2">
                      telemetry-dashboard.v2
                    </span>
                  </div>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded">
                    LIVE STREAM
                  </span>
                </div>

                {/* Metric Counter Pills */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                  <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                      Total Reach
                    </div>
                    <div className="text-base sm:text-xl font-bold text-white tracking-tight">
                      {objectives[activeObjective].reach}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-2.5 h-2.5" />
                      <span>+14.2%</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                      Engagement
                    </div>
                    <div className="text-base sm:text-xl font-bold text-white tracking-tight">
                      {objectives[activeObjective].engagement}
                    </div>
                    <div className="text-[10px] font-mono text-white mt-1">
                      Optimal
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                      Efficiency
                    </div>
                    <div className="text-base sm:text-xl font-bold text-white tracking-tight">
                      {objectives[activeObjective].efficiency}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-1">
                      Peak score
                    </div>
                  </div>
                </div>

                {/* Stylized Vertical Bar Chart Visualization */}
                <div className="relative pt-6 pb-2">
                  <div className="flex items-end justify-between gap-1.5 sm:gap-3 h-44 border-b border-neutral-800 px-2">
                    {objectives[activeObjective].bars.map((height, idx) => (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-2 group relative"
                      >
                        {/* Tooltip on Hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-1.5 py-0.5 rounded bg-white text-black text-[10px] font-mono font-semibold pointer-events-none whitespace-nowrap">
                          {height}%
                        </div>
                        {/* Vertical Bar */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.03 }}
                          className={`w-full rounded-t-sm transition-all duration-300 ${
                            idx === 7 || idx === 11
                              ? "bg-gradient-to-t from-cyan-500 to-white shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                              : "bg-neutral-700/60 group-hover:bg-neutral-500"
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Horizontal Axis Micro-Ticks */}
                  <div className="flex justify-between text-[10px] font-mono text-neutral-600 pt-2.5 px-2">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:59</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. INTERSTITIAL VISUAL QUOTE BANNER
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-32">
          <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/10 relative shadow-2xl h-[360px] sm:h-[420px] flex items-center justify-center p-8 sm:p-14 text-center">
            {/* Background Landscape Photo */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85')`,
              }}
            />
            {/* Atmospheric overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

            {/* Typography */}
            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 mb-4 block">
                MAXIM OF REDUCTION
              </span>
              <p className="text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-tight">
                “Embrace the whitespace and find clarity in simplicity.”
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. FEATURE BLOCK 2 (CODE & EXECUTION ENGINE)
           ========================================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-32">
          {/* Section Header */}
          <div className="mb-14">
            <div className="text-[10px] sm:text-xs font-mono font-semibold tracking-widest uppercase text-neutral-500 mb-2">
              CORE CAPABILITIES 02
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white max-w-2xl">
              Built for developers who value precision
            </h2>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Workflow Step Items */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <p className="text-sm text-neutral-400 leading-relaxed">
                Code that mirrors architectural intent. Seamlessly integrate
                type-safe layout models into React, Next.js, and modern bundlers.
              </p>

              <div className="space-y-4 mt-2">
                <div className="p-4 rounded-xl bg-neutral-900/50 border border-white/5 flex gap-4 items-start">
                  <span className="font-mono text-xs text-neutral-500 mt-0.5">
                    01
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Component Architecture
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Declarative primitives built with atomic tokens and zero
                      external bloat.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/50 border border-white/5 flex gap-4 items-start">
                  <span className="font-mono text-xs text-neutral-500 mt-0.5">
                    02
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Zero-Runtime CSS
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Compile-time safety with ultra-fast layout computation and
                      sub-millisecond paints.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/50 border border-white/5 flex gap-4 items-start">
                  <span className="font-mono text-xs text-neutral-500 mt-0.5">
                    03
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Continuous Telemetry
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Automated regression testing for fluid layouts across all
                      standard viewports.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dark Terminal Window Mockup */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-[#0d0d10] p-6 shadow-2xl relative overflow-hidden font-mono text-xs">
                {/* Window Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="text-[11px] text-neutral-400 ml-2">
                      horizon-runtime.ts
                    </span>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors text-[10px]"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Syntax Highlighted Code Display */}
                <pre className="text-neutral-300 overflow-x-auto leading-relaxed py-2 selection:bg-neutral-800">
                  <code>
                    <span className="text-purple-400">import</span> &#123; Horizon,
                    LayoutEngine &#125; <span className="text-purple-400">from</span>{" "}
                    <span className="text-emerald-300">&quot;@horizon/core&quot;</span>;
                    {"\n\n"}
                    <span className="text-purple-400">export const</span>{" "}
                    <span className="text-yellow-300">StudioLayout</span> = () =&gt; &#123;
                    {"\n"}
                    {"  "}
                    <span className="text-purple-400">const</span> layout ={" "}
                    <span className="text-yellow-300">LayoutEngine</span>.
                    <span className="text-blue-400">compose</span>(&#123;
                    {"\n"}
                    {"    "}theme:{" "}
                    <span className="text-emerald-300">&quot;minimalist-dark&quot;</span>,
                    {"\n"}
                    {"    "}contrast:{" "}
                    <span className="text-emerald-300">&quot;wcag-aaa&quot;</span>,
                    {"\n"}
                    {"    "}baselineGrid: <span className="text-orange-400">4</span>,
                    {"\n"}
                    {"    "}spatialTension:{" "}
                    <span className="text-emerald-300">&quot;harmonic&quot;</span>,
                    {"\n"}
                    {"  "}&#125;);
                    {"\n\n"}
                    {"  "}
                    <span className="text-purple-400">return</span> ({"\n"}
                    {"    "}&lt;<span className="text-white">Horizon.Canvas</span> layout=&#123;layout&#125; viewport=
                    <span className="text-emerald-300">&quot;dynamic&quot;</span>&gt;{"\n"}
                    {"      "}&lt;<span className="text-white">Horizon.TypographicScale</span> ratio=&#123;
                    <span className="text-orange-400">1.25</span>&#125; /&gt;{"\n"}
                    {"      "}&lt;<span className="text-white">Horizon.SpatialGrid</span> columns=&#123;
                    <span className="text-orange-400">12</span>&#125; gap=
                    <span className="text-emerald-300">&quot;fluid&quot;</span> /&gt;{"\n"}
                    {"      "}&lt;<span className="text-white">Horizon.Telemetry</span> onInspect=&#123;(m) =&gt;{" "}
                    <span className="text-blue-400">console</span>.
                    <span className="text-blue-400">log</span>(m)&#125; /&gt;{"\n"}
                    {"    "}&lt;/<span className="text-white">Horizon.Canvas</span>&gt;{"\n"}
                    {"  "});{"\n"}
                    &#125;;
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. FOUR-COLUMN TOOL MATRIX
           ========================================================================= */}
        <section id="tools" className="max-w-6xl mx-auto px-4 sm:px-6 mb-32">
          {/* Section Header */}
          <div className="mb-14 text-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500 mb-2 block">
              ENGINEERING PRIMITIVES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              Advanced tools for modern scholarship
            </h2>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {toolMatrix.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#101012] border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold text-white tracking-tight mb-2">
                      {card.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            8. BOTTOM CTA BANNER (FRAMED LANDSCAPE CARD)
           ========================================================================= */}
        <section
          id="get-started"
          className="max-w-7xl mx-auto px-4 sm:px-6 mb-24"
        >
          <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/10 relative shadow-2xl min-h-[440px] flex flex-col items-center justify-center text-center p-8 sm:p-14">
            {/* Background Mountain Photo */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2400&q=85')`,
              }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                TAKE THE NEXT STEP
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Ready to elevate your digital experience?
              </h2>
              <p className="text-sm text-neutral-300 max-w-lg leading-relaxed">
                Join thousands of architects, designers, and engineers crafting
                timeless digital interfaces with purposeful restraint.
              </p>
              <a
                href="#overview"
                className="mt-3 px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-black bg-white hover:bg-neutral-200 transition-all duration-300 shadow-xl flex items-center gap-2 group"
              >
                <span>Start now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            9. EDITORIAL FOOTER & LEARN WATERMARK
           ========================================================================= */}
        <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 border-t border-neutral-900 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
            <div>
              <p className="text-xl sm:text-2xl font-light text-neutral-300 tracking-tight">
                Embrace the minimal.{" "}
                <span className="text-white font-normal">
                  Focus on what matters.
                </span>
              </p>
              <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>All Systems Operational · Horizon Studio v2.4</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
              <a
                href="#overview"
                className="hover:text-white transition-colors"
              >
                Documentation
              </a>
              <a
                href="#manifesto"
                className="hover:text-white transition-colors"
              >
                Manifesto
              </a>
              <a
                href="#capabilities"
                className="hover:text-white transition-colors"
              >
                Changelog
              </a>
              <a href="#tools" className="hover:text-white transition-colors">
                Privacy
              </a>
              <Link href="/" className="hover:text-white transition-colors">
                Back to Suraksha
              </Link>
            </div>
          </div>

          {/* Bottom Copyright & Massive Learn Watermark */}
          <div className="relative pt-12 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-600 border-t border-neutral-900/60">
            <p>© 2026 Horizon Studio. Crafted with relentless reduction.</p>
            <p className="mt-2 sm:mt-0 font-mono text-[11px]">
              Designed for Antigravity IDE
            </p>

            {/* Giant "Learn" Background Typographic Watermark */}
            <div className="absolute -bottom-8 left-0 select-none pointer-events-none text-[100px] sm:text-[160px] md:text-[210px] font-black text-white/[0.02] tracking-tighter leading-none -z-10">
              Learn
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

