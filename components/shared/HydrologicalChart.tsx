"use client";

import React from "react";

interface HydrologicalChartProps {
  isSurge?: boolean;
}

export const HydrologicalChart: React.FC<HydrologicalChartProps> = ({ isSurge = false }) => {
  return (
    <div className="w-full relative overflow-hidden rounded-xl border border-cyan-500/20 bg-suraksha-950/70 p-4">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          HYDROLOGICAL STAGE TREND (24H FORECAST ENVELOPE)
        </span>
        <span className={isSurge ? "text-amber-400 font-bold" : "text-teal-400"}>
          {isSurge ? "DANGER CEILING APPROACHING" : "NOMINAL DISCHARGE"}
        </span>
      </div>

      <svg viewBox="0 0 560 180" className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="chartWave" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor={isSurge ? "#fbbf24" : "#5eead4"} stopOpacity=".45" />
            <stop offset="0.7" stopColor={isSurge ? "#d97706" : "#14b8a6"} stopOpacity=".15" />
            <stop offset="1" stopColor="#061014" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Reference Lines */}
        {[30, 70, 110, 150].map((y) => (
          <line
            key={y}
            x1="25"
            x2="550"
            y1={y}
            y2={y}
            stroke="rgba(94, 234, 212, 0.12)"
            strokeDasharray="4 6"
          />
        ))}

        {/* Filled Area Trend */}
        <path
          d={
            isSurge
              ? "M25 125 C70 115 90 98 125 90 S180 75 220 70 275 60 310 52 350 40 395 32 450 25 490 28 530 22 550 20 L550 160 L25 160Z"
              : "M25 133 C70 128 90 116 125 121 S180 99 220 106 275 93 310 98 350 68 395 79 450 52 490 58 530 33 550 37 L550 160 L25 160Z"
          }
          fill="url(#chartWave)"
          className="transition-all duration-700 ease-out"
        />

        {/* Glowing Trend Curve */}
        <path
          d={
            isSurge
              ? "M25 125 C70 115 90 98 125 90 S180 75 220 70 275 60 310 52 350 40 395 32 450 25 490 28 530 22 550 20"
              : "M25 133 C70 128 90 116 125 121 S180 99 220 106 275 93 310 98 350 68 395 79 450 52 490 58 530 33 550 37"
          }
          fill="none"
          stroke={isSurge ? "#fbbf24" : "#5eead4"}
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />

        {/* Warning / Alert Threshold Line */}
        <path
          d="M25 65 C100 65 160 65 220 65 S330 65 395 65 480 65 550 65"
          fill="none"
          stroke="#ef4444"
          strokeDasharray="6 6"
          strokeWidth="1.8"
        />
        <text x="450" y="58" fill="#f87171" fontSize="9.5" fontWeight="600">
          DANGER THRESHOLD (51.50m)
        </text>

        {/* Key Active Hydrological Point with Ripple */}
        <circle
          cx="395"
          cy={isSurge ? "32" : "79"}
          r="10"
          fill="none"
          stroke={isSurge ? "#fbbf24" : "#5eead4"}
          strokeWidth="1.5"
          className="animate-ping"
        />
        <circle
          cx="395"
          cy={isSurge ? "32" : "79"}
          r="5"
          fill="#f0fdfa"
          stroke={isSurge ? "#b45309" : "#0d9488"}
          strokeWidth="2.5"
        />

        {/* Time Stamps */}
        <g fill="#7d9b96" fontSize="9.5" fontWeight="600">
          <text x="25" y="174">06:00 (T-18h)</text>
          <text x="155" y="174">12:00 (T-12h)</text>
          <text x="285" y="174">18:00 (T-6h)</text>
          <text x="405" y="174">00:00 (NOW)</text>
          <text x="500" y="174">+06:00 (PEAK)</text>
        </g>
      </svg>
    </div>
  );
};

