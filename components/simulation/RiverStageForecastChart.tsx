"use client";

import React, { useState } from "react";

interface RiverStageForecastChartProps {
  tPlus6?: number;
  tPlus12?: number;
  tPlus24?: number;
  startingStage?: number;
  warningLevel?: number;
  dangerLevel?: number;
}

export const RiverStageForecastChart: React.FC<RiverStageForecastChartProps> = ({
  tPlus6 = 47.17,
  tPlus12 = 46.80,
  tPlus24 = 45.90,
  startingStage = 44.20,
  warningLevel = 48.60,
  dangerLevel = 49.20,
}) => {
  const [horizon, setHorizon] = useState<"6h" | "24h" | "72h">("24h");
  const [activePoint, setActivePoint] = useState<number | null>(1); // default highlight +6h

  // Data nodes for the curve based on horizon
  const points = React.useMemo(() => {
    if (horizon === "6h") {
      return [
        { label: "Now", value: startingStage, x: 70, y: 0 },
        { label: "+2h", value: Number((startingStage + (tPlus6 - startingStage) * 0.45).toFixed(2)), x: 190, y: 0 },
        { label: "+4h", value: Number((startingStage + (tPlus6 - startingStage) * 0.85).toFixed(2)), x: 310, y: 0 },
        { label: "+6h", value: tPlus6, x: 430, y: 0 },
      ];
    }
    if (horizon === "72h") {
      return [
        { label: "Now", value: startingStage, x: 70, y: 0 },
        { label: "+12h", value: tPlus12, x: 190, y: 0 },
        { label: "+24h", value: tPlus24, x: 310, y: 0 },
        { label: "+72h", value: Number(Math.max(43.5, tPlus24 - 1.2).toFixed(2)), x: 430, y: 0 },
      ];
    }
    // 24h default (matching image 1)
    return [
      { label: "Now", value: startingStage, x: 70, y: 0 },
      { label: "+6h", value: tPlus6, x: 190, y: 0 },
      { label: "+12h", value: tPlus12, x: 310, y: 0 },
      { label: "+24h", value: tPlus24, x: 430, y: 0 },
    ];
  }, [horizon, startingStage, tPlus6, tPlus12, tPlus24]);

  // Coordinate mapping: Stage range 43m to 50m mapped to Y coordinate (height 180, pad 25)
  const minY = 43.0;
  const maxY = 50.0;
  const mapY = (val: number) => 170 - ((val - minY) / (maxY - minY)) * 140;

  // Calculate SVG curve paths
  const mappedPoints = points.map((p) => ({ ...p, y: mapY(p.value) }));
  const warningMarkY = mapY(47.60); // Warning mark from home page graph
  const dangerMarkY = mapY(warningLevel); // 48.60m Danger/Warning threshold

  // Smooth Bezier path string
  const p0 = mappedPoints[0];
  const p1 = mappedPoints[1];
  const p2 = mappedPoints[2];
  const p3 = mappedPoints[3];

  const pathD = `M ${p0.x} ${p0.y} C ${p0.x + 60} ${p0.y - 15}, ${p1.x - 50} ${p1.y}, ${p1.x} ${p1.y} S ${p2.x - 50} ${p2.y}, ${p2.x} ${p2.y} S ${p3.x - 50} ${p3.y}, ${p3.x} ${p3.y}`;
  const areaD = `${pathD} L ${p3.x} 185 L ${p0.x} 185 Z`;

  // 90% Prediction Band polygon ribbon
  const bandUpperD = `M ${p0.x} ${p0.y - 6} C ${p0.x + 60} ${p0.y - 22}, ${p1.x - 50} ${p1.y - 12}, ${p1.x} ${p1.y - 12} S ${p2.x - 50} ${p2.y - 14}, ${p2.x} ${p2.y - 14} S ${p3.x - 50} ${p3.y - 16}, ${p3.x} ${p3.y - 16}`;
  const bandLowerD = `L ${p3.x} ${p3.y + 14} C ${p3.x - 50} ${p3.y + 14}, ${p2.x + 50} ${p2.y + 12}, ${p2.x} ${p2.y + 12} S ${p1.x + 50} ${p1.y + 10}, ${p1.x} ${p1.y + 10} S ${p0.x + 60} ${p0.y + 6}, ${p0.x} ${p0.y + 6} Z`;
  const bandD = `${bandUpperD} ${bandLowerD}`;

  return (
    <div className="w-full flex flex-col justify-between h-full space-y-3 font-sans">
      {/* Top Header & Horizon Switcher */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white">River-stage Forecast</span>
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10 text-xs">
          {(["6h", "24h", "72h"] as const).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHorizon(h)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                horizon === h ? "bg-white text-black font-bold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Hydrograph Viewport */}
      <div className="relative w-full h-[180px] bg-black/40 rounded-xl border border-white/5 p-2 overflow-visible">
        <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="hydroFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Horizontal Stage Grid Lines & Labels */}
          {[50, 49, 48, 47, 46, 45].map((lvl) => {
            const y = mapY(lvl);
            return (
              <g key={lvl}>
                <line x1="45" y1={y} x2="480" y2={y} stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />
                <text x="35" y={y + 3.5} fill="rgba(255, 255, 255, 0.35)" fontSize="9" textAnchor="end" fontFamily="monospace">
                  {lvl}
                </text>
              </g>
            );
          })}

          {/* Amber Warning Mark (47.60m) */}
          <line
            x1="45"
            y1={warningMarkY}
            x2="480"
            y2={warningMarkY}
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.85"
          />

          {/* Red Danger Threshold Line (48.60m) */}
          <line
            x1="45"
            y1={dangerMarkY}
            x2="480"
            y2={dangerMarkY}
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* 90% Prediction Band (Home Page Hydrograph Uncertainty) */}
          <path d={bandD} fill="url(#confidenceBand)" />

          {/* Shaded Area Under Main Curve */}
          <path d={areaD} fill="url(#hydroFill)" />

          {/* Main Stage Trajectory Curve */}
          <path d={pathD} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />

          {/* Data Points with Values */}
          {mappedPoints.map((pt, idx) => {
            const isHighlight = pt.label === "+6h" || activePoint === idx;
            return (
              <g
                key={pt.label}
                className="cursor-pointer group select-none"
                onClick={() => setActivePoint(idx)}
                onMouseEnter={() => setActivePoint(idx)}
              >
                {/* Highlight Capsule Badge for +6h (Matching Image 1) */}
                {isHighlight ? (
                  <g transform={`translate(${pt.x}, ${pt.y - 14})`}>
                    <rect
                      x="-24"
                      y="-12"
                      width="48"
                      height="18"
                      rx="9"
                      fill="#10B981"
                      stroke="#FFFFFF"
                      strokeWidth="1.2"
                      className="filter drop-shadow-sm"
                    />
                    <text
                      x="0"
                      y="1"
                      fill="#000000"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {pt.value.toFixed(2)} m
                    </text>
                  </g>
                ) : (
                  /* Standard Node Value Text */
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    fill="rgba(255, 255, 255, 0.75)"
                    fontSize="9.5"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {pt.value.toFixed(1)} m
                  </text>
                )}

                {/* Point Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHighlight ? "5" : "3.5"}
                  fill={isHighlight ? "#10B981" : "#FFFFFF"}
                  stroke="#09090B"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />

                {/* X-Axis Time Label */}
                <text x={pt.x} y="196" fill="rgba(255, 255, 255, 0.45)" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-zinc-400 pt-1 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Forecast</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-2 rounded bg-sky-400/20 border border-sky-400/40" />
          <span>90% Band</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-0.5 border-b-2 border-dashed border-amber-400" />
          <span>Warning (47.60m)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-0.5 border-b-2 border-dashed border-red-500" />
          <span>Danger (48.60m)</span>
        </div>
      </div>
    </div>
  );
};
