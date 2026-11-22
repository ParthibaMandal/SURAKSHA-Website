"use client";

import React from "react";

export const TacticalMapSvg: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[280px] overflow-hidden select-none bg-black">
      <svg
        viewBox="0 0 640 360"
        className="w-full h-full object-cover"
        role="img"
        aria-label="Ganga Basin Geospatial Schematic Map — Patna Study Area"
      >
        <defs>
          <pattern id="obsidianGridDots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#FFFFFF" opacity="0.10" />
          </pattern>
          <linearGradient id="silverRiverChannel" x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#E4E4E7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#A1A1AA" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Pure Black Base & Topographic Grid */}
        <rect width="640" height="360" fill="#000000" />
        <rect width="640" height="360" fill="url(#obsidianGridDots)" />

        {/* Coordinate Graticule Lines */}
        <line x1="160" y1="0" x2="160" y2="360" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="3 5" />
        <line x1="360" y1="0" x2="360" y2="360" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="3 5" />
        <line x1="520" y1="0" x2="520" y2="360" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="3 5" />
        <line x1="0" y1="120" x2="640" y2="120" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="3 5" />
        <line x1="0" y1="240" x2="640" y2="240" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="3 5" />

        {/* Topographic Elevation Contours */}
        <path
          d="M0 295 Q140 215 245 248 T485 212 T640 145"
          stroke="#FFFFFF"
          strokeOpacity="0.10"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M15 35 Q170 98 310 56 T585 42"
          stroke="#FFFFFF"
          strokeOpacity="0.10"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M75 355 Q205 298 345 328 T605 288"
          stroke="#FFFFFF"
          strokeOpacity="0.08"
          strokeWidth="1.2"
          fill="none"
        />

        {/* 100-Year Floodplain Inundation Envelope (Neutral Glass) */}
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="#FFFFFF"
          strokeOpacity="0.06"
          strokeWidth="56"
          fill="none"
        />
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="#FFFFFF"
          strokeOpacity="0.12"
          strokeWidth="28"
          fill="none"
        />

        {/* Primary Ganga River Channel (Monochrome Gradient) */}
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="url(#silverRiverChannel)"
          strokeWidth="10"
          fill="none"
        />

        {/* Subtle Animated Hydrodynamic Flow Vector */}
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="#FFFFFF"
          strokeOpacity="0.75"
          strokeWidth="1.8"
          fill="none"
          strokeDasharray="10 16"
          className="animate-[flowStream_14s_linear_infinite]"
        />

        {/* Gandak Tributary Feeder (North) */}
        <path
          d="M205 -10 C225 52 212 104 252 146"
          stroke="#E4E4E7"
          strokeOpacity="0.7"
          strokeWidth="4"
          fill="none"
        />
        {/* Son Sub-Basin Feeder (South-West) */}
        <path
          d="M95 365 C135 280 155 215 190 165"
          stroke="#A1A1AA"
          strokeOpacity="0.6"
          strokeWidth="3"
          fill="none"
        />

        {/* Station 1: STN-PAT-01 (Patna Study Sector - Primary Node) */}
        <circle cx="360" cy="128" r="14" fill="#FFFFFF" fillOpacity="0.15" />
        <circle cx="360" cy="128" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
        <rect x="374" y="110" width="148" height="34" rx="8" fill="#0A0A0A" fillOpacity="0.95" stroke="rgba(255,255,255,0.2)" />
        <text x="384" y="123" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">
          Patna · Gandhi Ghat
        </text>
        <text x="384" y="136" fill="#A1A1AA" fontSize="8.5" fontWeight="600" fontFamily="JetBrains Mono, monospace">
          STN-PAT-01 (46.85m MSL)
        </text>

        {/* Station 2: STN-GAN-01 (Lalganj Warning Node - Amber Semantic State) */}
        <circle cx="242" cy="108" r="10" fill="#F59E0B" fillOpacity="0.25" />
        <circle cx="242" cy="108" r="4.5" fill="#F59E0B" stroke="#000000" strokeWidth="1.5" />
        <rect x="118" y="94" width="120" height="20" rx="6" fill="#0A0A0A" fillOpacity="0.9" stroke="rgba(245,158,11,0.3)" />
        <text x="124" y="108" fill="#FBBF24" fontSize="8" fontWeight="600" fontFamily="JetBrains Mono, monospace">
          STN-GAN-01 (47.90m WARN)
        </text>

        {/* Station 3: STN-SON-01 (Koelwar Node) */}
        <circle cx="172" cy="196" r="4.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
        <rect x="58" y="202" width="110" height="18" rx="6" fill="#0A0A0A" fillOpacity="0.9" stroke="rgba(255,255,255,0.15)" />
        <text x="64" y="215" fill="#FFFFFF" fontSize="8" fontWeight="500" fontFamily="JetBrains Mono, monospace">
          STN-SON-01 (48.12m)
        </text>

        {/* Station 4: Downstream Reach (STN-MOK-04) - Offset cleanly ABOVE the river spline with dark glass scrim */}
        <circle cx="485" cy="176" r="4.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
        {/* Tether line from beacon up to offset pill */}
        <line x1="485" y1="172" x2="485" y2="152" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
        {/* Offset Dark Glass Pill Scrim matching hero HUD cards */}
        <rect x="435" y="132" width="118" height="20" rx="10" fill="#0A0A0A" fillOpacity="0.95" stroke="rgba(255,255,255,0.2)" />
        <text x="494" y="146" fill="#FFFFFF" fontSize="8" fontWeight="600" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
          STN-MOK-04 (43.10m)
        </text>

        {/* Basin Header Legend inside Map */}
        <text
          x="20"
          y="26"
          fill="#FFFFFF"
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
          fill="#71717A"
          fontSize="8"
          fontFamily="JetBrains Mono, monospace"
        >
          EPSG:4326 · CWC Gandhi Ghat Gauge Calibration
        </text>
      </svg>
    </div>
  );
};
