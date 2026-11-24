"use client";

import React, { useState } from "react";
import { Droplets, Waves, Activity, Radio } from "lucide-react";

interface RiverStageForecastChartProps {
  tPlus6?: number;
  tPlus12?: number;
  tPlus24?: number;
  startingStage?: number;
  warningLevel?: number;
  dangerLevel?: number;
  flowVelocity?: number;
  discharge?: number;
  catchmentRain?: number;
}

export const RiverStageForecastChart: React.FC<RiverStageForecastChartProps> = ({
  tPlus6 = 47.17,
  tPlus12 = 46.80,
  tPlus24 = 45.90,
  startingStage = 44.20,
  warningLevel = 48.60,
  dangerLevel = 49.20,
  flowVelocity = 1.84,
  discharge = 31.4,
  catchmentRain = 18.5,
}) => {
  const [horizon, setHorizon] = useState<"6h" | "24h" | "72h">("24h");
  const [activePoint, setActivePoint] = useState<number | null>(1); // default highlight +6h

  // Data nodes for the curve based on horizon
  const points = React.useMemo(() => {
    if (horizon === "6h") {
      return [
        { label: "Now", value: startingStage, x: 80, y: 0 },
        { label: "+2h", value: Number((startingStage + (tPlus6 - startingStage) * 0.45).toFixed(2)), x: 250, y: 0 },
        { label: "+4h", value: Number((startingStage + (tPlus6 - startingStage) * 0.85).toFixed(2)), x: 420, y: 0 },
        { label: "+6h", value: tPlus6, x: 580, y: 0 },
      ];
    }
    if (horizon === "72h") {
      return [
        { label: "Now", value: startingStage, x: 80, y: 0 },
        { label: "+12h", value: tPlus12, x: 250, y: 0 },
        { label: "+24h", value: tPlus24, x: 420, y: 0 },
        { label: "+72h", value: Number(Math.max(43.5, tPlus24 - 1.2).toFixed(2)), x: 580, y: 0 },
      ];
    }
    // 24h default
    return [
      { label: "Now", value: startingStage, x: 80, y: 0 },
      { label: "+6h", value: tPlus6, x: 250, y: 0 },
      { label: "+12h", value: tPlus12, x: 420, y: 0 },
      { label: "+24h", value: tPlus24, x: 580, y: 0 },
    ];
  }, [horizon, startingStage, tPlus6, tPlus12, tPlus24]);

  // Coordinate mapping: Stage range 43m to 50m mapped to Y coordinate
  const minY = 43.0;
  const maxY = 50.0;
  const mapY = (val: number) => 170 - ((val - minY) / (maxY - minY)) * 140;

  // Calculate SVG curve paths
  const mappedPoints = points.map((p) => ({ ...p, y: mapY(p.value) }));
  const warningMarkY = mapY(47.60); // 47.60m Warning mark
  const dangerMarkY = mapY(warningLevel); // 48.60m Danger threshold

  // Smooth Bezier path string
  const p0 = mappedPoints[0];
  const p1 = mappedPoints[1];
  const p2 = mappedPoints[2];
  const p3 = mappedPoints[3];

  const pathD = `M ${p0.x} ${p0.y} C ${p0.x + 80} ${p0.y - 15}, ${p1.x - 70} ${p1.y}, ${p1.x} ${p1.y} S ${p2.x - 70} ${p2.y}, ${p2.x} ${p2.y} S ${p3.x - 70} ${p3.y}, ${p3.x} ${p3.y}`;
  const areaD = `${pathD} L ${p3.x} 185 L ${p0.x} 185 Z`;

  // 90% Prediction Band polygon ribbon
  const bandUpperD = `M ${p0.x} ${p0.y - 6} C ${p0.x + 80} ${p0.y - 22}, ${p1.x - 70} ${p1.y - 12}, ${p1.x} ${p1.y - 12} S ${p2.x - 70} ${p2.y - 14}, ${p2.x} ${p2.y - 14} S ${p3.x - 70} ${p3.y - 16}, ${p3.x} ${p3.y - 16}`;
  const bandLowerD = `L ${p3.x} ${p3.y + 14} C ${p3.x - 70} ${p3.y + 14}, ${p2.x + 70} ${p2.y + 12}, ${p2.x} ${p2.y + 12} S ${p1.x + 70} ${p1.y + 10}, ${p1.x} ${p1.y + 10} S ${p0.x + 80} ${p0.y + 6}, ${p0.x} ${p0.y + 6} Z`;
  const bandD = `${bandUpperD} ${bandLowerD}`;

  return (
    <div className="w-full flex flex-col justify-between h-full space-y-4 font-sans">
      {/* 4 Telemetry Metrics Cards (Matching Image 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 sm:p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--muted-foreground)] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">River Stage</span>
            <Droplets className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[var(--foreground)]">
            {tPlus6.toFixed(2)} m
          </div>
          <div className="text-[10px] text-emerald-500 font-mono mt-0.5">▲ +0.08 m/h</div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--muted-foreground)] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Flow Velocity</span>
            <Waves className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[var(--foreground)]">
            {flowVelocity.toFixed(2)} m/s
          </div>
          <div className="text-[10px] text-[var(--muted-foreground)]/70 font-mono mt-0.5">ADCP Acoustic</div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--muted-foreground)] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Discharge</span>
            <Activity className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[var(--foreground)]">
            {discharge.toFixed(1)}k
          </div>
          <div className="text-[10px] text-[var(--muted-foreground)]/70 font-mono mt-0.5">m³/s (Cumecs)</div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--muted-foreground)] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Catchment Rain</span>
            <Radio className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[var(--foreground)]">
            {catchmentRain.toFixed(1)}
          </div>
          <div className="text-[10px] text-[var(--muted-foreground)]/70 font-mono mt-0.5">mm/hr (IMD)</div>
        </div>
      </div>

      {/* Top Header & Horizon Switcher */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-[var(--foreground)] font-heading">
            Reach Inundation Model · 24-Hour Horizon
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-[var(--muted-foreground)]">
            STN-PAT-01 · Gandhi Ghat
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)] text-xs">
          {(["6h", "24h", "72h"] as const).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHorizon(h)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                horizon === h
                  ? "bg-emerald-500 text-white font-bold shadow-xs"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {h.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Hydrograph Viewport */}
      <div className="relative w-full h-[200px] bg-[var(--surface)] rounded-xl border border-[var(--border)] p-2 overflow-visible">
        <svg viewBox="0 0 650 200" className="w-full h-full overflow-visible">
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
                <line x1="55" y1={y} x2="615" y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 3" />
                <text x="45" y={y + 3.5} fill="currentColor" opacity="0.4" fontSize="9" textAnchor="end" fontFamily="monospace">
                  {lvl}m
                </text>
              </g>
            );
          })}

          {/* Vertical T+0 Line */}
          <line x1="80" y1="20" x2="80" y2="185" stroke="currentColor" opacity="0.25" strokeWidth="1" strokeDasharray="3 3" />
          <text x="80" y="16" fill="currentColor" opacity="0.6" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
            T+0 NOW
          </text>

          {/* Amber Warning Mark (47.60m) */}
          <line
            x1="55"
            y1={warningMarkY}
            x2="615"
            y2={warningMarkY}
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.85"
          />
          <text x="615" y={warningMarkY - 4} fill="#F59E0B" fontSize="8" textAnchor="end" fontFamily="monospace" fontWeight="bold">
            WARNING MARK 47.60m
          </text>

          {/* Red Danger Threshold Line (48.60m) */}
          <line
            x1="55"
            y1={dangerMarkY}
            x2="615"
            y2={dangerMarkY}
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="615" y={dangerMarkY - 4} fill="#EF4444" fontSize="8" textAnchor="end" fontFamily="monospace" fontWeight="bold">
            DANGER MARK {warningLevel.toFixed(2)}m
          </text>

          {/* 90% Prediction Band (Uncertainty Envelope) */}
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
                {/* Highlight Capsule Badge for +6h */}
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
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    fill="currentColor"
                    opacity="0.75"
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
                <text x={pt.x} y="196" fill="currentColor" opacity="0.5" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-[var(--muted-foreground)] pt-1 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Stage Forecast</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-2 rounded bg-sky-400/20 border border-sky-400/40" />
          <span>90% Prediction Band</span>
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
