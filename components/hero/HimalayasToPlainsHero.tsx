"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Radio,
  Cpu,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";

export const HimalayasToPlainsHero: React.FC = () => {
  const orbitalArcRef = useRef<SVGSVGElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = orbitalArcRef.current;
    if (!root || prefersReducedMotion) return;

    const context = gsap.context(() => {
      const paths = root.querySelectorAll("path, ellipse");
      gsap.fromTo(
        paths,
        { strokeDashoffset: 100, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 0.35,
          duration: 2.2,
          ease: "power2.out",
          stagger: 0.25,
        }
      );
    }, root);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <>
      <section className="himalayas-hero relative h-screen min-h-[700px] w-full flex flex-col justify-between overflow-x-hidden overflow-y-hidden bg-black text-white">
        {/* =========================================================================
            BACKGROUND HERO VIDEO (User Provided Asset)
           ========================================================================= */}
        <div className="absolute inset-0 z-0 w-full overflow-hidden">
          <video
            src="/videos/hero-himalayas-ganga.mp4"
            poster="/images/hero-himalayas-ganga.jpg"
            autoPlay={!prefersReducedMotion}
            loop
            muted
            playsInline
            preload={prefersReducedMotion ? "none" : "metadata"}
            className="absolute inset-0 w-full h-full object-cover object-[center_35%] scale-[1.01]"
          />

          {/* Left Vignette & Gradient Overlays for High Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent w-full md:w-[60%]" />

          {/* Top Navbar Shadow */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/80 via-black/25 to-transparent" />

          {/* Bottom Blend to Page Background (#000000) */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black via-black/70 to-transparent" />

          {/* =========================================================================
              ORBITAL SATELLITE TRACKING ARC (Sky Overlays with GSAP)
             ========================================================================= */}
          <svg
            ref={orbitalArcRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-30 hidden sm:block"
            viewBox="0 0 1440 800"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Dashed Orbital Trajectory Arc */}
            <path
              d="M 680 180 C 880 70, 1140 50, 1420 160"
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <path
              d="M 720 220 C 940 110, 1200 90, 1440 210"
              stroke="#FFFFFF"
              strokeWidth="0.7"
              strokeDasharray="3 8"
              opacity="0.6"
            />
            {/* Subtle orbital coordinates projection ring */}
            <ellipse
              cx="1100"
              cy="160"
              rx="280"
              ry="95"
              stroke="#FFFFFF"
              strokeWidth="0.5"
              strokeDasharray="2 6"
              opacity="0.25"
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
            {/* Main Headline (IBM Plex Sans, tightened tracking, text-balance) */}
            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[60px] font-heading font-semibold tracking-tight text-white leading-[1.08] mb-4 text-balance"
            >
              From the Himalayas<br />
              to the Plains —<br />
              <span className="text-white">We Track. You Prepare.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#9BA5A0] max-w-xl font-normal leading-relaxed mb-6 text-pretty"
            >
              Satellite observations, river-stage sensors, and physics-guided modeling across the Middle Ganga corridor.
            </motion.p>

            {/* Call to Action Buttons (Animated Glassmorphism) */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mb-4"
            >
              {/* Primary Glass Button: Explore Platform */}
              <Link
                href="/platform"
                className="btn-glass-primary hero-cta-transparent px-7 py-3.5 text-sm font-semibold text-white group cursor-pointer"
              >
                <span className="relative z-10">Explore the Platform</span>
                <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>

            </motion.div>
          </div>

          {/* =========================================================================
              BOTTOM BLOCK: Feature Highlights Row & Scroll Indicator
             ========================================================================= */}
          <div className="w-full max-w-2xl flex flex-col gap-5 pt-4">
            {/* 4-Item Feature Highlights Row (Animated Glass Icons) */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.42 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-5 border-t border-white/15 w-full"
            >
              {/* 1. Satellite Monitoring */}
              <div className="group flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 hover:bg-white/[0.04]">
                <span className="icon-glass w-10 h-10 rounded-xl shrink-0">
                  <Radio className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                </span>
                <span className="text-xs font-semibold text-white/95 leading-tight">
                  Satellite<br />Monitoring
                </span>
              </div>

              {/* 2. AI-Powered Forecasting */}
              <div className="group flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 hover:bg-white/[0.04]">
                <span className="icon-glass w-10 h-10 rounded-xl shrink-0" style={{ animationDelay: "0.6s" }}>
                  <Cpu className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                </span>
                <span className="text-xs font-semibold text-white/95 leading-tight">
                  AI-Powered<br />Forecasting
                </span>
              </div>

              {/* 3. Early Alerts */}
              <div className="group flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 hover:bg-white/[0.04]">
                <span className="icon-glass w-10 h-10 rounded-xl shrink-0" style={{ animationDelay: "1.2s" }}>
                  <Bell className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                </span>
                <span className="text-xs font-semibold text-white/95 leading-tight">
                  Early<br />Alerts
                </span>
              </div>

              {/* 4. Safer Communities */}
              <div className="group flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 hover:bg-white/[0.04]">
                <span className="icon-glass w-10 h-10 rounded-xl shrink-0" style={{ animationDelay: "1.8s" }}>
                  <ShieldCheck className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="text-xs font-semibold text-white/95 leading-tight">
                  Safer<br />Communities
                </span>
              </div>
            </motion.div>

            {/* Scroll to Explore Bar */}
            <div className="flex items-center gap-4 w-full">
              <span className="text-[11px] font-medium text-[#6A7771] tracking-wider uppercase">
                Scroll to explore
              </span>
              <div className="flex-1 h-[1px] bg-[#1F2823]" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
