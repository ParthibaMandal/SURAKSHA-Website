"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  Play,
  Radio,
  Cpu,
  Bell,
  ShieldCheck,
  X,
  ExternalLink,
  ChevronRight,
  Activity,
} from "lucide-react";

export const HimalayasToPlainsHero: React.FC = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

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
              ORBITAL SATELLITE TRACKING ARC (Sky Overlays)
             ========================================================================= */}
          <svg
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
        <div className="w-full px-6 sm:px-10 lg:px-14 h-full relative z-10 pt-24 sm:pt-28 pb-6 flex flex-col justify-between">
          {/* Top Block */}
          <div className="max-w-2xl lg:max-w-[620px] flex flex-col items-start">
            {/* Real-Time Flood Intelligence Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white/90 shadow-lg mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-medium tracking-wide">Real-Time Flood Intelligence · Simulated Preview</span>
              <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
            </div>

            {/* Main Headline (Pure Monochrome White & Silver) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-bold tracking-tight text-white leading-[1.08] mb-4">
              From the Himalayas<br />
              to the Plains —<br />
              <span className="text-white">
                We Track. You Prepare.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed mb-6">
              Satellite. Sensors. AI. — A complete flood early warning system, from source to shore.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-5 mb-4">
              {/* Primary: Explore Platform */}
              <Link
                href="/platform"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-100 transition-all duration-200 shadow-xl shadow-black/40 group"
              >
                <span>Explore the Platform</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              {/* Secondary: Watch Demo */}
              <button
                type="button"
                onClick={() => setIsDemoOpen(true)}
                className="inline-flex items-center gap-3 text-sm font-medium text-white/90 hover:text-white transition-colors group cursor-pointer"
              >
                <span className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center transition-all duration-200 shadow-lg">
                  <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                </span>
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              BOTTOM BLOCK: Feature Highlights Row & Scroll Indicator
             ========================================================================= */}
          <div className="w-full max-w-2xl flex flex-col gap-5 pt-4">
            {/* 4-Item Feature Highlights Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5 border-t border-white/15 w-full">
              {/* 1. Satellite Monitoring */}
              <div className="flex flex-col gap-1.5">
                <Radio className="w-5 h-5 text-white" />
                <span className="text-xs font-semibold text-white/90 leading-tight">
                  Satellite<br />Monitoring
                </span>
              </div>

              {/* 2. AI-Powered Forecasting */}
              <div className="flex flex-col gap-1.5">
                <Cpu className="w-5 h-5 text-white" />
                <span className="text-xs font-semibold text-white/90 leading-tight">
                  AI-Powered<br />Forecasting
                </span>
              </div>

              {/* 3. Early Alerts */}
              <div className="flex flex-col gap-1.5">
                <Bell className="w-5 h-5 text-white" />
                <span className="text-xs font-semibold text-white/90 leading-tight">
                  Early<br />Alerts
                </span>
              </div>

              {/* 4. Safer Communities */}
              <div className="flex flex-col gap-1.5">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-xs font-semibold text-white/90 leading-tight">
                  Safer<br />Communities
                </span>
              </div>
            </div>

            {/* Scroll to Explore Bar */}
            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center gap-2.5 text-[11px] font-medium text-white/60 tracking-wider">
                <span className="w-3.5 h-5 rounded-full border border-white/30 flex items-start justify-center p-0.5">
                  <span className="w-1 h-1.5 rounded-full bg-white animate-bounce" />
                </span>
                <span>Scroll to explore</span>
              </div>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WATCH DEMO MODAL
         ========================================================================= */}
      {isDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#0A0A0A] p-6 shadow-2xl text-white">
            {/* Close button */}
            <button
              onClick={() => setIsDemoOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close demo"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-4 pr-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/15 text-xs font-mono font-medium mb-2">
                <Activity className="w-3.5 h-3.5 text-white" /> SURAKSHA HYDROLOGICAL INTELLIGENCE
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                Early Warning Operations Walkthrough
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                From Himalayan glacial melt to Gangetic floodplain inundation: experience the live digital twin and decision support system.
              </p>
            </div>

            {/* Video / Interactive Preview Frame */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black mb-6 group">
              <video
                src="/videos/hero-himalayas-ganga.mp4"
                poster="/images/hero-himalayas-ganga.jpg"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl text-black mb-3">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Interactive Demo Simulation</h4>
                <p className="text-xs text-zinc-300 max-w-md">
                  Explore hydrodynamic reach routing, automated CAP alert generation, and gauge ensemble validation in our sandbox lab.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setIsDemoOpen(false)}
                className="px-5 py-2.5 rounded-full border border-white/15 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Close Preview
              </button>
              <Link
                href="/demo-lab"
                onClick={() => setIsDemoOpen(false)}
                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/20 text-xs text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <span>Open Simulation Lab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/platform"
                onClick={() => setIsDemoOpen(false)}
                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-100 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-lg"
              >
                <span>Launch Digital Twin</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
