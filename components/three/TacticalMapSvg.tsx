"use client";

import React from "react";

export const TacticalMapSvg: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[280px] overflow-hidden select-none bg-[#1E1E1C]">
      <svg
        viewBox="0 0 640 360"
        className="w-full h-full object-cover"
        role="img"
        aria-label="Ganga Basin Geospatial Schematic Map — Patna Study Area"
      >
        <defs>
          <pattern id="sandGridDots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#D8CBB3" opacity="0.18" />
          </pattern>
          <linearGradient id="electricRiverChannel" x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.92" />
            <stop offset="60%" stopColor="#4B80FF" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Charcoal Base & Topographic Grid */}
        <rect width="640" height="360" fill="#1E1E1C" />
        <rect width="640" height="360" fill="url(#sandGridDots)" />

        {/* Coordinate Graticule Lines */}
        <line x1="160" y1="0" x2="160" y2="360" stroke="#D8CBB3" strokeOpacity="0.06" strokeDasharray="3 5" />
        <line x1="360" y1="0" x2="360" y2="360" stroke="#D8CBB3" strokeOpacity="0.06" strokeDasharray="3 5" />
        <line x1="520" y1="0" x2="520" y2="360" stroke="#D8CBB3" strokeOpacity="0.06" strokeDasharray="3 5" />
        <line x1="0" y1="120" x2="640" y2="120" stroke="#D8CBB3" strokeOpacity="0.06" strokeDasharray="3 5" />
        <line x1="0" y1="240" x2="640" y2="240" stroke="#D8CBB3" strokeOpacity="0.06" strokeDasharray="3 5" />

        {/* Topographic Elevation Contours (Sand Muted) */}
        <path
          d="M0 295 Q140 215 245 248 T485 212 T640 145"
          stroke="#D8CBB3"
          strokeOpacity="0.16"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M15 35 Q170 98 310 56 T585 42"
          stroke="#D8CBB3"
          strokeOpacity="0.16"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M75 355 Q205 298 345 328 T605 288"
          stroke="#D8CBB3"
          strokeOpacity="0.13"
          strokeWidth="1.2"
          fill="none"
        />

        {/* 100-Year Floodplain Inundation Envelope (Blue-Tinted Charcoal) */}
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="#2F6BFF"
          strokeOpacity="0.12"
          strokeWidth="56"
          fill="none"
        />
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="#2F6BFF"
          strokeOpacity="0.22"
          strokeWidth="28"
          fill="none"
        />

        {/* Primary Ganga River Channel (Electric Blue) */}
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="url(#electricRiverChannel)"
          strokeWidth="11"
          fill="none"
        />

        {/* Subtle Animated Hydrodynamic Flow Vector */}
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="#EDE4D3"
          strokeOpacity="0.7"
          strokeWidth="1.8"
          fill="none"
          strokeDasharray="10 16"
          className="animate-[flowStream_14s_linear_infinite]"
        />

        {/* Gandak Tributary Feeder (North) */}
        <path
          d="M205 -10 C225 52 212 104 252 146"
          stroke="#2F6BFF"
          strokeOpacity="0.75"
          strokeWidth="4.5"
          fill="none"
        />
        {/* Son Sub-Basin Feeder (South-West) */}
        <path
          d="M95 365 C135 280 155 215 190 165"
          stroke="#D8CBB3"
          strokeOpacity="0.45"
          strokeWidth="3.5"
          fill="none"
        />

        {/* Station 1: STN-PAT-01 (Patna Study Sector - Primary Node) */}
        <circle cx="360" cy="128" r="12" fill="#2F6BFF" fillOpacity="0.18" />
        <circle cx="360" cy="128" r="5.5" fill="#2F6BFF" stroke="#1E1E1C" strokeWidth="1.5" />
        <rect x="372" y="111" width="144" height="32" rx="4" fill="#292925" stroke="#D8CBB3" strokeOpacity="0.25" />
        <text x="380" y="124" fill="#EDE4D3" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">
          Patna Study Sector
        </text>
        <text x="380" y="136" fill="#2F6BFF" fontSize="8.5" fontWeight="600" fontFamily="JetBrains Mono, monospace">
          STN-PAT-01 (49.82m)
        </text>

        {/* Station 2: STN-GAN-01 (Lalganj Warning Node - Amber Semantic State) */}
        <circle cx="242" cy="108" r="9" fill="#F59E0B" fillOpacity="0.2" />
        <circle cx="242" cy="108" r="4.5" fill="#F59E0B" stroke="#1E1E1C" strokeWidth="1.5" />
        <text x="128" y="102" fill="#FBBF24" fontSize="8.5" fontWeight="600" fontFamily="JetBrains Mono, monospace">
          STN-GAN-01 (52.40m WARN)
        </text>

        {/* Station 3: STN-SON-01 (Koelwar Node) */}
        <circle cx="172" cy="196" r="4.5" fill="#D8CBB3" stroke="#1E1E1C" strokeWidth="1.5" />
        <text x="64" y="210" fill="#D8CBB3" fontSize="8.5" fontWeight="500" fontFamily="JetBrains Mono, monospace">
          STN-SON-01 (53.12m)
        </text>

        {/* Station 4: Downstream Reach */}
        <circle cx="485" cy="176" r="4.5" fill="#2F6BFF" stroke="#1E1E1C" strokeWidth="1.5" />
        <text x="496" y="180" fill="#A69B88" fontSize="8.5" fontWeight="500" fontFamily="JetBrains Mono, monospace">
          STN-MOK-04 (47.90m)
        </text>

        {/* Basin Header Legend inside Map */}
        <text
          x="20"
          y="26"
          fill="#D8CBB3"
          fontSize="10"
          fontWeight="700"
          letterSpacing="1.2"
          fontFamily="Inter, sans-serif"
        >
          Ganga Basin, Patna Reach (25.61°N, 85.14°E)
        </text>
        <text
          x="20"
          y="40"
          fill="#A69B88"
          fontSize="8.5"
          fontFamily="Inter, sans-serif"
        >
          Schematic geospatial layer, illustrative research extent
        </text>
      </svg>
    </div>
  );
};
