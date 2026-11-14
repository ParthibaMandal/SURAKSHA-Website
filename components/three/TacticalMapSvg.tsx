"use client";

import React from "react";

export const TacticalMapSvg: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[300px] overflow-hidden select-none bg-[#091418]">
      <svg viewBox="0 0 640 360" className="w-full h-full object-cover">
        <defs>
          <pattern id="gridDots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#2d4850" opacity=".6" />
          </pattern>
          <linearGradient id="riverGlow" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#38bdf8" stopOpacity=".95" />
            <stop offset="0.5" stopColor="#5eead4" stopOpacity=".9" />
            <stop offset="1" stopColor="#14b8a6" stopOpacity=".6" />
          </linearGradient>
          <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect width="640" height="360" fill="#091418" />
        <rect width="640" height="360" fill="url(#gridDots)" />

        {/* Ambient terrain contour lines */}
        <path d="M0 290 Q140 210 240 245 T480 210 T640 140" stroke="#162e34" strokeWidth="1.5" fill="none" />
        <path d="M20 30 Q170 100 310 55 T580 40" stroke="#162e34" strokeWidth="1.5" fill="none" />
        <path d="M80 360 Q200 300 340 330 T600 290" stroke="#162e34" strokeWidth="1.5" fill="none" />

        {/* River channel deep background corridor */}
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="#13383a"
          strokeWidth="46"
          fill="none"
          opacity=".5"
        />
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="#1c4d50"
          strokeWidth="26"
          fill="none"
          opacity=".8"
        />

        {/* Main dynamic glowing river path with animated stroke */}
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="url(#riverGlow)"
          strokeWidth="14"
          fill="none"
          filter="url(#neonBlur)"
        />

        {/* Flowing water current dashes */}
        <path
          d="M-20 70 C90 110 90 185 210 162 S360 75 450 140 570 240 680 210"
          stroke="#f0fdfa"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="12 18"
          className="animate-[flowStream_12s_linear_infinite]"
        />

        {/* Secondary feeder tributary stream */}
        <path d="M180 -10 C210 50 190 100 245 145" stroke="#2dd4bf" strokeWidth="4" fill="none" opacity=".7" />
        <path
          d="M180 -10 C210 50 190 100 245 145"
          stroke="#ecfeff"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6 12"
          className="animate-[flowStream_8s_linear_infinite]"
        />

        {/* Sonar pulses on Patna & monitoring stations */}
        <circle cx="360" cy="170" r="10" fill="none" stroke="#5eead4" strokeWidth="1.5" className="animate-ping" />
        <circle cx="360" cy="170" r="6" fill="#5eead4" />
        <circle cx="360" cy="170" r="2.5" fill="#042f2e" />

        <circle cx="245" cy="145" r="5" fill="#fbbf24" />
        <circle cx="245" cy="145" r="9" fill="none" stroke="#fbbf24" strokeWidth="1" opacity=".7" />

        <circle cx="460" cy="202" r="5" fill="#38bdf8" />
        <circle cx="460" cy="202" r="10" fill="none" stroke="#38bdf8" strokeWidth="1" opacity=".6" />

        {/* Tactical labels */}
        <text x="376" y="166" fill="#f0fdfa" fontSize="11" fontWeight="700" letterSpacing="0.5">
          Patna Study Sector
        </text>
        <text x="65" y="88" fill="#5eead4" fontSize="11" fontWeight="700" letterSpacing="2">
          GANGA RIVER CHANNEL
        </text>
        <text x="215" y="130" fill="#fef08a" fontSize="9" fontWeight="600">
          Gauge 04 Live
        </text>
        <text x="474" y="218" fill="#99f6e4" fontSize="9" fontWeight="600">
          Downstream Node
        </text>
      </svg>
    </div>
  );
};

