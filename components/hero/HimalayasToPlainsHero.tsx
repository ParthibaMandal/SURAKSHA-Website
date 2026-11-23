"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, X } from "lucide-react";
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
          opacity: 0.35,
          duration: 2.2,
          ease: "power2.out",
          stagger: 0.25,
        }
      );
    }
  }, []);

  return (
    <>
      <section className="relative h-screen min-h-[700px] w-full flex flex-col justify-between overflow-x-hidden overflow-y-hidden bg-black text-white">
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
        <div ref={heroContentRef} className="w-full px-6 sm:px-10 lg:px-14 h-full relative z-10 pt-24 sm:pt-28 pb-6 flex flex-col justify-between">
          {/* Top Block */}
          <div className="max-w-2xl lg:max-w-[640px] flex flex-col items-start">
            {/* Main Headline (IBM Plex Sans, tightened tracking, text-balance) */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[60px] font-heading font-semibold tracking-tight text-white leading-[1.08] mb-4 text-balance"
            >
              From the Himalayas<br />
              to the Plains —<br />
              <span className="text-white">
                We Track. You Prepare.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#9BA5A0] max-w-xl font-normal leading-relaxed mb-6 text-pretty"
            >
              Satellite observations, river-stage sensors, and physics-guided modeling across the Middle Ganga corridor.
            </motion.p>

            {/* Call to Action Buttons (Clean 6px radius, solid surfaces, no pill/blur) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3.5 mb-4"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/platform"
                  className="inline-flex items-center justify-center rounded-md bg-[#10B981] px-5 py-2.5 text-xs sm:text-sm font-semibold text-black hover:bg-[#0EA271] transition-colors shadow-lg shadow-[#10B981]/15"
                >
                  Explore the Platform
                </Link>
              </motion.div>

              <motion.button
                type="button"
                onClick={() => setIsDemoOpen(true)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#1F2823] bg-[#0D100E] px-4 py-2.5 text-xs sm:text-sm font-medium text-white hover:border-[#10B981]/50 hover:bg-[#141816] transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>
          </div>

          {/* =========================================================================
              BOTTOM BLOCK: Feature Highlights Row & Scroll Indicator
             ========================================================================= */}
          <div className="w-full max-w-2xl flex flex-col gap-5 pt-4">
            {/* 4-Item Feature Highlights Row (Text-first, no numbered pills, staggered motion reveal) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5 border-t border-[#1F2823] w-full"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#10B981] uppercase tracking-wider">Surface Observation</span>
                <span className="text-xs font-medium text-white leading-tight">
                  Satellite Monitoring
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#10B981] uppercase tracking-wider">Simulation Engine</span>
                <span className="text-xs font-medium text-white leading-tight">
                  Hydrodynamic Modeling
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#10B981] uppercase tracking-wider">CAP Protocol</span>
                <span className="text-xs font-medium text-white leading-tight">
                  Early Advisories
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#10B981] uppercase tracking-wider">Emergency Reach</span>
                <span className="text-xs font-medium text-white leading-tight">
                  Community Safety
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

      {/* =========================================================================
          WATCH DEMO MODAL (Clean solid surface, 8px radius, animated with Framer Motion)
         ========================================================================= */}
      <AnimatePresence>
        {isDemoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl rounded-lg border border-[#1F2823] bg-[#0D100E] p-6 text-white shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setIsDemoOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-md border border-[#1F2823] bg-[#141816] text-[#9BA5A0] hover:text-white hover:border-[#10B981]/40 transition-colors cursor-pointer"
                aria-label="Close demo"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="mb-4 pr-10">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-[#1F2823] bg-[#141816] text-[#9BA5A0] text-xs font-medium mb-2">
                  OPERATIONAL DEMO
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-semibold text-white">
                  Early Warning Operations Walkthrough
                </h3>
                <p className="text-xs sm:text-sm text-[#9BA5A0] mt-1">
                  From Himalayan glacial melt to Gangetic floodplain inundation: experience the live digital twin and decision support system.
                </p>
              </div>

              {/* Video Frame */}
              <div className="relative aspect-video rounded-md overflow-hidden border border-[#1F2823] bg-black mb-6">
                <video
                  src="/videos/hero-himalayas-ganga.mp4"
                  poster="/images/hero-himalayas-ganga.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#1F2823]">
                <button
                  onClick={() => setIsDemoOpen(false)}
                  className="rounded-md border border-[#1F2823] bg-[#141816] px-4 py-2 text-xs font-medium text-[#9BA5A0] hover:text-white transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
                <Link
                  href="/demo-lab"
                  onClick={() => setIsDemoOpen(false)}
                  className="rounded-md border border-[#1F2823] bg-[#141816] px-4 py-2 text-xs font-medium text-white hover:border-[#10B981]/50 transition-colors"
                >
                  Open Simulation Lab
                </Link>
                <Link
                  href="/platform"
                  onClick={() => setIsDemoOpen(false)}
                  className="rounded-md bg-[#10B981] px-5 py-2 text-xs font-semibold text-black hover:bg-[#0EA271] transition-colors"
                >
                  Launch Digital Twin
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
