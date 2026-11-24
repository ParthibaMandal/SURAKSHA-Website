"use client";

import React, { useState } from "react";
import { Droplets, Waves, Activity, Radio, BarChart3, TrendingUp } from "lucide-react";
import { SimulationDayState, CWC_GANDHI_GHAT_BENCHMARKS } from "@/lib/simulation-scenarios";

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
  snowmeltIndex?: number;
  soilSaturation?: number;
  timeline?: SimulationDayState[];
  currentSimulationDay?: number;
}

export const RiverStageForecastChart: React.FC<RiverStageForecastChartProps> = ({
  tPlus6 = 47.17,
  tPlus12 = 46.80,
  tPlus24 = 45.90,
  startingStage = 44.20,
  warningLevel = CWC_GANDHI_GHAT_BENCHMARKS.warningLevel,
  dangerLevel = CWC_GANDHI_GHAT_BENCHMARKS.dangerLevel,
  flowVelocity = 1.84,
  discharge = 31.4,
  catchmentRain = 18.5,
  snowmeltIndex = 1.0,
  soilSaturation = 65,
  timeline,
  currentSimulationDay = 1,
}) => {
  const [horizon, setHorizon] = useState<"6h" | "24h" | "72h">("24h");
  const [chartMode, setChartMode] = useState<"forecast" | "trajectories">("forecast");
  const [activePoint, setActivePoint] = useState<number | null>(1); // default highlight +6h

  // Coordinate mapping: Stage range 43.0m to 51.5m mapped to Y coordinate (height span 160, top pad 35, baseline 195)
  const minY = 43.0;
  const maxY = 51.5;
  const mapY = (val: number) => 195 - ((Math.max(minY, Math.min(maxY, val)) - minY) / (maxY - minY)) * 160;

  const warningMarkY = mapY(warningLevel); // 47.60m
  const dangerMarkY = mapY(dangerLevel); // 48.60m
  const hflMarkY = mapY(CWC_GANDHI_GHAT_BENCHMARKS.highestFloodLevel); // 50.52m

  // 1. Data nodes for the 24h/6h/72h forecast curve
  // Forecast points with wide horizontal spacing and ample right margin (p3 at x=495, badges at x>=570)
  const forecastPoints = React.useMemo(() => {
    if (horizon === "6h") {
      return [
        { label: "Now", value: startingStage, x: 95, y: 0 },
        { label: "+2h", value: Number((startingStage + (tPlus6 - startingStage) * 0.45).toFixed(2)), x: 230, y: 0 },
        { label: "+4h", value: Number((startingStage + (tPlus6 - startingStage) * 0.85).toFixed(2)), x: 365, y: 0 },
        { label: "+6h", value: tPlus6, x: 495, y: 0 },
      ];
    }
    if (horizon === "72h") {
      return [
        { label: "Now", value: startingStage, x: 95, y: 0 },
        { label: "+12h", value: tPlus12, x: 230, y: 0 },
        { label: "+24h", value: tPlus24, x: 365, y: 0 },
        { label: "+72h", value: Number(Math.max(43.5, tPlus24 - 1.2).toFixed(2)), x: 495, y: 0 },
      ];
    }
    // 24h default
    return [
      { label: "Now", value: startingStage, x: 95, y: 0 },
      { label: "+6h", value: tPlus6, x: 230, y: 0 },
      { label: "+12h", value: tPlus12, x: 365, y: 0 },
      { label: "+24h", value: tPlus24, x: 495, y: 0 },
    ];
  }, [horizon, startingStage, tPlus6, tPlus12, tPlus24]);

  const mappedForecastPoints = forecastPoints.map((p) => ({ ...p, y: mapY(p.value) }));
  const p0 = mappedForecastPoints[0];
  const p1 = mappedForecastPoints[1];
  const p2 = mappedForecastPoints[2];
  const p3 = mappedForecastPoints[3];

  const forecastPathD = `M ${p0.x} ${p0.y} C ${p0.x + 80} ${p0.y - 15}, ${p1.x - 70} ${p1.y}, ${p1.x} ${p1.y} S ${p2.x - 70} ${p2.y}, ${p2.x} ${p2.y} S ${p3.x - 70} ${p3.y}, ${p3.x} ${p3.y}`;
  const forecastAreaD = `${forecastPathD} L ${p3.x} 195 L ${p0.x} 195 Z`;

  // 90% Prediction Band polygon ribbon
  const bandUpperD = `M ${p0.x} ${p0.y - 6} C ${p0.x + 80} ${p0.y - 22}, ${p1.x - 70} ${p1.y - 12}, ${p1.x} ${p1.y - 12} S ${p2.x - 70} ${p2.y - 14}, ${p2.x} ${p2.y - 14} S ${p3.x - 70} ${p3.y - 16}, ${p3.x} ${p3.y - 16}`;
  const bandLowerD = `L ${p3.x} ${p3.y + 14} C ${p3.x - 70} ${p3.y + 14}, ${p2.x + 70} ${p2.y + 12}, ${p2.x} ${p2.y + 12} S ${p1.x + 70} ${p1.y + 10}, ${p1.x} ${p1.y + 10} S ${p0.x + 80} ${p0.y + 6}, ${p0.x} ${p0.y + 6} Z`;
  const bandD = `${bandUpperD} ${bandLowerD}`;

  // 2. Trajectories for 21-day timeline comparison
  const trajectoryPoints = React.useMemo(() => {
    if (!timeline || timeline.length === 0) return null;
    const count = timeline.length;
    const xStart = 85;
    const xEnd = 525;
    const step = (xEnd - xStart) / Math.max(1, count - 1);

    return timeline.map((pt, idx) => ({
      ...pt,
      x: xStart + idx * step,
      yOptimistic: mapY(pt.optimisticStage),
      yReference: mapY(pt.referenceStage),
      ySevere: mapY(pt.severeStage),
      yActual: mapY(pt.stage),
    }));
  }, [timeline]);

  return (
    <div className="w-full flex flex-col justify-between h-full space-y-4 font-sans">
      {/* 4 Multi-Variable Telemetry Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 sm:p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[var(--muted-foreground)] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">River Stage</span>
            <Droplets className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[var(--foreground)]">
            {tPlus6.toFixed(2)} m
          </div>
          <div className="text-[10px] text-emerald-500 font-mono mt-0.5">▲ +0.08 m/h</div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[var(--muted-foreground)] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Discharge</span>
            <Waves className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[var(--foreground)]">
            {discharge.toFixed(1)}k
          </div>
          <div className="text-[10px] text-[var(--muted-foreground)]/70 font-mono mt-0.5">m³/s (Cumecs)</div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[var(--muted-foreground)] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Catchment Rain</span>
            <Radio className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[var(--foreground)]">
            {catchmentRain.toFixed(1)}
          </div>
          <div className="text-[10px] text-[var(--muted-foreground)]/70 font-mono mt-0.5">mm/day (IMD)</div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[var(--muted-foreground)] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Soil Saturation</span>
            <Activity className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[var(--foreground)]">
            {soilSaturation}%
          </div>
          <div className="text-[10px] text-[var(--muted-foreground)]/70 font-mono mt-0.5">Melt Anomaly: {snowmeltIndex.toFixed(1)}×</div>
        </div>
      </div>

      {/* Top Header with Mode & Horizon Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-[var(--foreground)] font-heading">
            {chartMode === "forecast" ? "Reach Inundation Model · 24-Hour Horizon" : "21-Day Multi-Outcome Trajectory Comparison"}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-[var(--muted-foreground)]">
            STN-PAT-01 · Gandhi Ghat
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher Pill */}
          <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)] text-xs">
            <button
              type="button"
              onClick={() => setChartMode("forecast")}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                chartMode === "forecast"
                  ? "bg-emerald-500 text-white font-bold shadow-xs"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Forecast</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode("trajectories")}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                chartMode === "trajectories"
                  ? "bg-emerald-500 text-white font-bold shadow-xs"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Trajectories</span>
            </button>
          </div>

          {/* Horizon Switcher (Forecast Mode only) */}
          {chartMode === "forecast" && (
            <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)] text-xs">
              {(["6h", "24h", "72h"] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    horizon === h
                      ? "bg-[var(--surface-elevated)] text-emerald-600 dark:text-emerald-400 font-bold border border-[var(--border)] shadow-xs"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {h.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG Hydrograph Viewport */}
      <div className="relative w-full h-[260px] bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-3 sm:p-4 overflow-visible">
        <svg viewBox="0 0 720 245" className="w-full h-full overflow-visible">
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
          {[51, 50, 49, 48, 47, 46, 45, 44].map((lvl) => {
            const y = mapY(lvl);
            return (
              <g key={lvl}>
                <line x1="55" y1={y} x2="705" y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 3" />
                <text x="48" y={y + 3.5} fill="currentColor" opacity="0.4" fontSize="9" textAnchor="end" fontFamily="monospace">
                  {lvl}m
                </text>
              </g>
            );
          })}

          {/* Highest Flood Level Reference Line (HFL 50.52m) */}
          <line
            x1="55"
            y1={hflMarkY}
            x2="705"
            y2={hflMarkY}
            stroke="#9333EA"
            strokeWidth="1.2"
            strokeDasharray="5 3"
            opacity="0.8"
          />
          <rect x="575" y={hflMarkY - 10} width="130" height="15" rx="4" fill="var(--surface)" stroke="#9333EA" strokeWidth="0.8" opacity="0.95" />
          <text x="700" y={hflMarkY + 1} fill="#C084FC" fontSize="8.5" textAnchor="end" fontFamily="monospace" fontWeight="bold">
            HISTORIC HFL 50.52m
          </text>

          {/* Red Danger Threshold Line (48.60m) */}
          <line
            x1="55"
            y1={dangerMarkY}
            x2="705"
            y2={dangerMarkY}
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <rect x="560" y={dangerMarkY - 10} width="145" height="15" rx="4" fill="var(--surface)" stroke="#EF4444" strokeWidth="0.8" opacity="0.95" />
          <text x="700" y={dangerMarkY + 1} fill="#EF4444" fontSize="8.5" textAnchor="end" fontFamily="monospace" fontWeight="bold">
            DANGER MARK {dangerLevel.toFixed(2)}m
          </text>

          {/* Amber Warning Mark (47.60m) */}
          <line
            x1="55"
            y1={warningMarkY}
            x2="705"
            y2={warningMarkY}
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.85"
          />
          <rect x="550" y={warningMarkY - 10} width="155" height="15" rx="4" fill="var(--surface)" stroke="#F59E0B" strokeWidth="0.8" opacity="0.95" />
          <text x="700" y={warningMarkY + 1} fill="#F59E0B" fontSize="8.5" textAnchor="end" fontFamily="monospace" fontWeight="bold">
            WARNING MARK {warningLevel.toFixed(2)}m
          </text>

          {/* MODE 1: Standard Operational Forecast Curve */}
          {chartMode === "forecast" ? (
            <>
              {/* Vertical T+0 Line */}
              <line x1="90" y1="28" x2="90" y2="210" stroke="currentColor" opacity="0.25" strokeWidth="1" strokeDasharray="3 3" />
              <text x="90" y="22" fill="currentColor" opacity="0.6" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                T+0 NOW
              </text>

              {/* 90% Prediction Band (Uncertainty Envelope) */}
              <path d={bandD} fill="url(#confidenceBand)" />

              {/* Shaded Area Under Main Curve */}
              <path d={forecastAreaD} fill="url(#hydroFill)" />

              {/* Main Stage Trajectory Curve */}
              <path d={forecastPathD} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />

              {/* Data Points with Values */}
              {mappedForecastPoints.map((pt, idx) => {
                const isHighlight = pt.label === "+6h" || activePoint === idx;
                return (
                  <g
                    key={pt.label}
                    className="cursor-pointer group select-none"
                    onClick={() => setActivePoint(idx)}
                    onMouseEnter={() => setActivePoint(idx)}
                  >
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
                      <g transform={`translate(${pt.x}, ${pt.y - 12})`}>
                        <rect
                          x="-20"
                          y="-10"
                          width="40"
                          height="15"
                          rx="4"
                          fill="var(--surface)"
                          stroke="currentColor"
                          strokeWidth="0.5"
                          opacity="0.85"
                        />
                        <text
                          x="0"
                          y="1"
                          fill="currentColor"
                          fontSize="9"
                          fontWeight="semibold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {pt.value.toFixed(1)} m
                        </text>
                      </g>
                    )}

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHighlight ? "5.5" : "3.5"}
                      fill={isHighlight ? "#10B981" : "#FFFFFF"}
                      stroke="#09090B"
                      strokeWidth="2"
                      className="transition-all duration-200"
                    />

                    <text x={pt.x} y="222" fill="currentColor" opacity="0.6" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </>
          ) : (
            /* MODE 2: Multi-Outcome Trajectory Comparison (Optimistic vs Reference vs Severe) */
            <>
              {trajectoryPoints && trajectoryPoints.length > 0 && (
                <>
                  {/* Severe Outcome Curve (Red) */}
                  <path
                    d={trajectoryPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.ySevere}`).join(" ")}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Reference Outcome Curve (Cyan/Blue) */}
                  <path
                    d={trajectoryPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yReference}`).join(" ")}
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="2.5"
                  />

                  {/* Optimistic Outcome Curve (Emerald/Green) */}
                  <path
                    d={trajectoryPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yOptimistic}`).join(" ")}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  />

                  {/* Timeline Points & Day Labels */}
                  {trajectoryPoints.map((p, idx) => {
                    const isCurrent = p.day === currentSimulationDay;
                    return (
                      <g key={p.day} className="select-none">
                        {isCurrent && (
                          <line
                            x1={p.x}
                            y1="25"
                            x2={p.x}
                            y2="205"
                            stroke="#10B981"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                          />
                        )}

                        {/* Reference Node Circle */}
                        <circle
                          cx={p.x}
                          cy={p.yReference}
                          r={isCurrent ? "5.5" : "3.5"}
                          fill={isCurrent ? "#10B981" : "#0284C7"}
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />

                        {/* X-axis Day Label */}
                        <text
                          x={p.x}
                          y="222"
                          fill={isCurrent ? "#10B981" : "currentColor"}
                          opacity={isCurrent ? 1 : 0.5}
                          fontWeight={isCurrent ? "bold" : "normal"}
                          fontSize="9"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          D{p.day.toString().padStart(2, "0")}
                        </text>
                      </g>
                    );
                  })}
                </>
              )}
            </>
          )}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-[var(--muted-foreground)] pt-1 font-mono">
        {chartMode === "forecast" ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Stage Forecast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-2 rounded bg-sky-400/20 border border-sky-400/40" />
              <span>90% Uncertainty Band</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-b-2 border-dashed border-amber-400" />
              <span>Warning (47.60m)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-b-2 border-dashed border-red-500" />
              <span>Danger (48.60m)</span>
            </div>
          </>
        ) : (
          <div className="w-full space-y-1.5">
            <div className="flex flex-wrap items-center justify-between text-[10px] text-[var(--muted-foreground)] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500" />
                <span>Optimistic Scenario</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-sky-600" />
                <span>Reference Case</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-b-2 border-dashed border-red-500" />
                <span>Severe Outcome</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-b-2 border-dashed border-purple-500" />
                <span>HFL (50.52m)</span>
              </div>
            </div>
            <p className="text-[9px] text-[var(--muted-foreground)] italic border-t border-[var(--border)] pt-1">
              * Scientific distinction: These 3 trajectories represent scenario assumption presets (lower rain vs. sustained deluge vs. saturated catchment), not statistically calculated probability distributions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
