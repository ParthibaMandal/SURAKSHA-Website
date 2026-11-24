"use client";

import React from "react";

interface RiskGaugeProps {
  score: number; // 0 to 100
  severity?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, severity = "LOW" }) => {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));
  // Needle angle: 0 score = -90 deg (left), 50 score = 0 deg (top), 100 score = +90 deg (right)
  const needleAngle = -90 + (clampedScore / 100) * 180;

  const getRiskLabel = (s: number) => {
    if (s < 30) return "Low Risk";
    if (s < 70) return "Moderate Risk";
    return "High Risk";
  };

  const getRiskColor = (s: number) => {
    if (s < 30) return "#10B981"; // emerald
    if (s < 70) return "#F59E0B"; // amber
    return "#EF4444"; // red
  };

  return (
    <div className="flex flex-col items-center justify-center relative py-2">
      <svg
        viewBox="0 0 200 120"
        className="w-48 h-28 overflow-visible"
        aria-label={`Flood risk gauge showing ${clampedScore} out of 100`}
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Background Track Arc */}
        <path
          d="M 20 105 A 80 80 0 0 1 180 105"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Active Gradient Arc */}
        <path
          d="M 20 105 A 80 80 0 0 1 180 105"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (clampedScore / 100) * 251.2}
          className="transition-all duration-700 ease-out"
        />

        {/* Needle Pin */}
        <g
          transform={`translate(100, 105) rotate(${needleAngle})`}
          className="transition-transform duration-700 ease-out"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-68"
            stroke={getRiskColor(clampedScore)}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="7" fill="#FFFFFF" />
          <circle cx="0" cy="0" r="3.5" fill="#09090B" />
        </g>
      </svg>

      {/* Central Score Display */}
      <div className="text-center mt-1">
        <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {clampedScore} <span className="text-sm font-normal text-zinc-400">/ 100</span>
        </div>
        <div className="mt-1">
          <span
            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${getRiskColor(clampedScore)}20`,
              color: getRiskColor(clampedScore),
              border: `1px solid ${getRiskColor(clampedScore)}40`,
            }}
          >
            {getRiskLabel(clampedScore)}
          </span>
        </div>
      </div>
    </div>
  );
};
