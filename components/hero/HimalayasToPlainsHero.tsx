"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Radio,
  Cpu,
  Bell,
  ShieldCheck,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

export const HimalayasToPlainsHero: React.FC = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const orbitalArcRef = useRef<SVGSVGElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (orbitalArcRef.current) {
      const paths = orbitalArcRef.current.querySelectorAll("path, ellipse");
      gsap.fromTo(
        paths,
        { strokeDashoffset: 100, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 0.42,
          duration: 2.2,
          ease: "power2.out",
          stagger: 0.25,
        }
      );
    }
  }, []);

  return (
    <>
      <section className="relative h-screen min-h-[700px] w-full flex flex-col justify-between overflow-x-hidden overflow-y-hidden bg-[#110805] text-[#F5F5DC]">
        {/* =========================================================================
            BACKGROUND HERO VIDEO (User Provided Asset)
           ========================================================================= */}
        <div className="absolute inset-0 z-0 w-full overflow-hidden">
          <video
            src="/videos/hero-himalayas-ganga.mp4"
            poster="/images/hero-himalayas-ganga.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-[center_35%] scale-[1.01]"
          />

          {/* Burnt Sienna Warm Vignette & Gradient Overlays for High Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#110805]/92 via-[#1A0D09]/55 to-transparent w-full md:w-[62%]" />

          {/* Top Navbar Shadow */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#110805]/85 via-[#110805]/30 to-transparent" />

          {/* Bottom Blend to Page Background (#110805) */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#110805] via-[#110805]/75 to-transparent" />

          {/* =========================================================================
              ORBITAL SATELLITE TRACKING ARC (Burnt Sienna & Sandy Brown Sky Overlays)
             ========================================================================= */}
          <svg
            ref={orbitalArcRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-35 hidden sm:block"
            viewBox="0 0 1440 800"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Dashed Orbital Trajectory Arc */}
            <path
              d="M 680 180 C 880 70, 1140 50, 1420 160"
              stroke="#F4A460"
              strokeWidth="1.1"
              strokeDasharray="4 6"
            />
            <path
              d="M 720 220 C 940 110, 1200 90, 1440 210"
              stroke="#E35336"
              strokeWidth="0.85"
              strokeDasharray="3 8"
              opacity="0.7"
            />
            {/* Subtle orbital coordinates projection ring */}
            <ellipse
              cx="1100"
              cy="160"
              rx="280"
              ry="95"
              stroke="#F5F5DC"
              strokeWidth="0.6"
              strokeDasharray="2 6"
              opacity="0.3"
              transform="rotate(-10 1100 160)"
            />
          </svg>
        </div>

        {/* =========================================================================
            HERO MAIN CONTENT (Full Width Edge-to-Edge Container)
           ========================================================================= */}
        <div
          ref={heroContentRef}
          className="w-full px-6 sm:px-10 lg:px-14 h-full relative z-10 pt-24 sm:pt-28 pb-6 flex flex-col justify-between"
        >
          {/* Top Block */}
          <div className="max-w-2xl lg:max-w-[640px] flex flex-col items-start">
            {/* Main Headline (Warm Beige #F5F5DC & Sandy Brown #F4A460) */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[60px] font-heading font-semibold tracking-tight text-[#F5F5DC] leading-[1.08] mb-4 text-balance"
            >
              From the Himalayas<br />
              to the Plains —<br />
              <span className="text-[#F4A460]">We Track. You Prepare.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#F5F5DC]/85 max-w-xl font-normal leading-relaxed mb-6 text-pretty"
            >
              Satellite observations, river-stage sensors, and physics-guided modeling across the Middle Ganga corridor.
            </motion.p>

            {/* Call to Action Buttons (Animated Burnt Sienna Glassmorphism) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mb-4"
            >
              {/* Primary Glass Button: Explore Platform */}
              <Link
                href="/platform"
                className="btn-glass-primary px-7 py-3.5 text-sm font-semibold text-[#F5F5DC] group cursor-pointer"
              >
                <span className="relative z-10">Explore the Platform</span>
                <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>

              {/* Secondary Glass Button: Watch Demo */}
              <button
                type="button"
                onClick={() => setIsDemoOpen(true)}
                className="btn-glass-secondary pl-2.5 pr-6 py-2 text-sm font-medium text-[#F5F5DC] group cursor-pointer"
              >
                <span className="relative z-10 w-9 h-9 rounded-full bg-[#E35336]/30 group-hover:bg-[#E35336]/50 border border-[#F4A460]/60 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-inner">
                  <Play className="w-3.5 h-3.5 fill-[#F5F5DC] text-[#F5F5DC] ml-0.5 transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="relative z-10">Watch Demo</span>
              </button>
            </motion.div>
          </div>

          {/* =========================================================================
              BOTTOM BLOCK: Feature Highlights Row & Scroll Indicator
             ========================================================================= */}
          <div className="w-full max-w-2xl flex flex-col gap-5 pt-4">
            {/* 4-Item Feature Highlights Row (Animated Burnt Sienna Glass Icons) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-5 border-t border-[#A0522D]/45 w-full"
            >
              {/* 1. Satellite Monitoring */}
              <div className="group flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 hover:bg-[#A0522D]/15">
                <span className="icon-glass w-10 h-10 rounded-xl shrink-0">
                  <Radio className="w-4 h-4 text-[#F5F5DC] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                </span>
                <span className="text-xs font-semibold text-[#F5F5DC] leading-tight">
                  Satellite<br />Monitoring
                </span>
              </div>

              {/* 2. AI-Powered Forecasting */}
              <div className="group flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 hover:bg-[#A0522D]/15">
                <span className="icon-glass w-10 h-10 rounded-xl shrink-0" style={{ animationDelay: "0.6s" }}>
                  <Cpu className="w-4 h-4 text-[#F5F5DC] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                </span>
                <span className="text-xs font-semibold text-[#F5F5DC] leading-tight">
                  AI-Powered<br />Forecasting
                </span>
              </div>

              {/* 3. Early Alerts */}
              <div className="group flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 hover:bg-[#A0522D]/15">
                <span className="icon-glass w-10 h-10 rounded-xl shrink-0" style={{ animationDelay: "1.2s" }}>
                  <Bell className="w-4 h-4 text-[#F5F5DC] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                </span>
                <span className="text-xs font-semibold text-[#F5F5DC] leading-tight">
                  Early<br />Alerts
                </span>
              </div>

              {/* 4. Safer Communities */}
              <div className="group flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 hover:bg-[#A0522D]/15">
                <span className="icon-glass w-10 h-10 rounded-xl shrink-0" style={{ animationDelay: "1.8s" }}>
                  <ShieldCheck className="w-4 h-4 text-[#F5F5DC] transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="text-xs font-semibold text-[#F5F5DC] leading-tight">
                  Safer<br />Communities
                </span>
              </div>
            </motion.div>

            {/* Scroll to Explore Bar */}
            <div className="flex items-center gap-4 w-full">
              <span className="text-[11px] font-medium text-[#F4A460] tracking-wider uppercase">
                Scroll to explore
              </span>
              <div className="flex-1 h-[1px] bg-[#A0522D]/45" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WATCH DEMO MODAL
         ========================================================================= */}
      <AnimatePresence>
        {isDemoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#110805]/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl rounded-2xl border border-[#A0522D]/55 bg-[#1A0D09] p-6 text-[#F5F5DC] shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setIsDemoOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full border border-[#A0522D]/50 bg-[#24120C] text-[#F5F5DC]/80 hover:text-[#F5F5DC] hover:border-[#F4A460] transition-colors cursor-pointer"
                aria-label="Close demo"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="mb-4 pr-10">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-[#A0522D]/50 bg-[#24120C] text-[#F4A460] text-xs font-medium mb-2">
                  OPERATIONAL DEMO
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-semibold text-[#F5F5DC]">
                  Early Warning Operations Walkthrough
                </h3>
                <p className="text-xs sm:text-sm text-[#F5F5DC]/75 mt-1">
                  From Himalayan glacial melt to Gangetic floodplain inundation: experience the live digital twin and decision support system.
                </p>
              </div>

              {/* Video Frame */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-[#A0522D]/50 bg-[#110805] mb-6">
                <video
                  src="/videos/hero-himalayas-ganga.mp4"
                  poster="/images/hero-himalayas-ganga.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110805]/80 via-transparent to-transparent" />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#A0522D]/35">
                <button
                  onClick={() => setIsDemoOpen(false)}
                  className="btn-glass-secondary px-5 py-2.5 text-xs text-[#F5F5DC] cursor-pointer"
                >
                  <span className="relative z-10">Close Preview</span>
                </button>
                <Link
                  href="/demo-lab"
                  onClick={() => setIsDemoOpen(false)}
                  className="btn-glass-secondary px-5 py-2.5 text-xs text-[#F5F5DC] group"
                >
                  <span className="relative z-10">Open Simulation Lab</span>
                  <ExternalLink className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/platform"
                  onClick={() => setIsDemoOpen(false)}
                  className="btn-glass-primary px-6 py-2.5 text-xs font-semibold text-[#F5F5DC] group"
                >
                  <span className="relative z-10">Launch Digital Twin</span>
                  <ChevronRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
