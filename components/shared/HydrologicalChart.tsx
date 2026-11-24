"use client";

import React, { useState } from "react";

interface HydrologicalChartProps {
  isSurge?: boolean;
  compact?: boolean;
}

interface DataPoint {
  time: string;
  observed: number;
  ensembleMean: number;
  ensembleUpper: number;
  ensembleLower: number;
  rainfallMm: number;
}

// CWC Gandhi Ghat Benchmarks:
// Baseline Normal: 46.20 m | Warning: 47.60 m | Danger: 48.60 m | Record HFL: 50.52 m
const DATA_6H_NOMINAL: DataPoint[] = [
  { time: "-3h", observed: 46.22, ensembleMean: 46.22, ensembleUpper: 46.30, ensembleLower: 46.15, rainfallMm: 4 },
  { time: "-2h", observed: 46.28, ensembleMean: 46.28, ensembleUpper: 46.38, ensembleLower: 46.20, rainfallMm: 6 },
  { time: "-1h", observed: 46.34, ensembleMean: 46.34, ensembleUpper: 46.45, ensembleLower: 46.25, rainfallMm: 8 },
  { time: "NOW", observed: 46.42, ensembleMean: 46.42, ensembleUpper: 46.55, ensembleLower: 46.32, rainfallMm: 12 },
  { time: "+1h", observed: 46.42, ensembleMean: 46.52, ensembleUpper: 46.70, ensembleLower: 46.38, rainfallMm: 9 },
  { time: "+2h", observed: 46.42, ensembleMean: 46.60, ensembleUpper: 46.82, ensembleLower: 46.42, rainfallMm: 7 },
  { time: "+4h", observed: 46.42, ensembleMean: 46.72, ensembleUpper: 46.98, ensembleLower: 46.50, rainfallMm: 5 },
  { time: "+6h", observed: 46.42, ensembleMean: 46.68, ensembleUpper: 46.92, ensembleLower: 46.45, rainfallMm: 3 },
];

const DATA_6H_SURGE: DataPoint[] = [
  { time: "-3h", observed: 47.20, ensembleMean: 47.20, ensembleUpper: 47.35, ensembleLower: 47.10, rainfallMm: 18 },
  { time: "-2h", observed: 47.55, ensembleMean: 47.55, ensembleUpper: 47.75, ensembleLower: 47.40, rainfallMm: 32 },
  { time: "-1h", observed: 47.92, ensembleMean: 47.92, ensembleUpper: 48.15, ensembleLower: 47.75, rainfallMm: 45 },
  { time: "NOW", observed: 48.35, ensembleMean: 48.35, ensembleUpper: 48.65, ensembleLower: 48.10, rainfallMm: 62 },
  { time: "+1h", observed: 48.35, ensembleMean: 48.72, ensembleUpper: 49.05, ensembleLower: 48.40, rainfallMm: 55 },
  { time: "+2h", observed: 48.35, ensembleMean: 48.98, ensembleUpper: 49.35, ensembleLower: 48.62, rainfallMm: 42 },
  { time: "+4h", observed: 48.35, ensembleMean: 49.25, ensembleUpper: 49.70, ensembleLower: 48.85, rainfallMm: 28 },
  { time: "+6h", observed: 48.35, ensembleMean: 49.15, ensembleUpper: 49.55, ensembleLower: 48.75, rainfallMm: 16 },
];

const DATA_24H_NOMINAL: DataPoint[] = [
  { time: "-12h", observed: 46.12, ensembleMean: 46.12, ensembleUpper: 46.25, ensembleLower: 46.05, rainfallMm: 4 },
  { time: "-8h", observed: 46.28, ensembleMean: 46.28, ensembleUpper: 46.42, ensembleLower: 46.18, rainfallMm: 8 },
  { time: "-4h", observed: 46.54, ensembleMean: 46.54, ensembleUpper: 46.70, ensembleLower: 46.40, rainfallMm: 14 },
  { time: "NOW", observed: 46.85, ensembleMean: 46.85, ensembleUpper: 47.08, ensembleLower: 46.65, rainfallMm: 18 },
  { time: "+4h", observed: 46.85, ensembleMean: 47.15, ensembleUpper: 47.45, ensembleLower: 46.88, rainfallMm: 12 },
  { time: "+8h", observed: 46.85, ensembleMean: 47.38, ensembleUpper: 47.75, ensembleLower: 47.05, rainfallMm: 9 },
  { time: "+12h", observed: 46.85, ensembleMean: 47.30, ensembleUpper: 47.68, ensembleLower: 46.95, rainfallMm: 5 },
  { time: "+24h", observed: 46.85, ensembleMean: 46.95, ensembleUpper: 47.35, ensembleLower: 46.60, rainfallMm: 3 },
];

const DATA_24H_SURGE: DataPoint[] = [
  { time: "-12h", observed: 46.85, ensembleMean: 46.85, ensembleUpper: 47.05, ensembleLower: 46.70, rainfallMm: 20 },
  { time: "-8h", observed: 47.35, ensembleMean: 47.35, ensembleUpper: 47.60, ensembleLower: 47.15, rainfallMm: 38 },
  { time: "-4h", observed: 47.95, ensembleMean: 47.95, ensembleUpper: 48.25, ensembleLower: 47.70, rainfallMm: 54 },
  { time: "NOW", observed: 48.45, ensembleMean: 48.45, ensembleUpper: 48.82, ensembleLower: 48.15, rainfallMm: 68 },
  { time: "+4h", observed: 48.45, ensembleMean: 48.95, ensembleUpper: 49.40, ensembleLower: 48.55, rainfallMm: 52 },
  { time: "+8h", observed: 48.45, ensembleMean: 49.30, ensembleUpper: 49.85, ensembleLower: 48.80, rainfallMm: 36 },
  { time: "+12h", observed: 48.45, ensembleMean: 49.15, ensembleUpper: 49.65, ensembleLower: 48.65, rainfallMm: 22 },
  { time: "+24h", observed: 48.45, ensembleMean: 48.65, ensembleUpper: 49.15, ensembleLower: 48.20, rainfallMm: 10 },
];

const DATA_72H_NOMINAL: DataPoint[] = [
  { time: "-36h", observed: 45.95, ensembleMean: 45.95, ensembleUpper: 46.15, ensembleLower: 45.80, rainfallMm: 2 },
  { time: "-24h", observed: 46.15, ensembleMean: 46.15, ensembleUpper: 46.35, ensembleLower: 46.00, rainfallMm: 5 },
  { time: "-12h", observed: 46.40, ensembleMean: 46.40, ensembleUpper: 46.65, ensembleLower: 46.22, rainfallMm: 10 },
  { time: "NOW", observed: 46.85, ensembleMean: 46.85, ensembleUpper: 47.15, ensembleLower: 46.60, rainfallMm: 14 },
  { time: "+12h", observed: 46.85, ensembleMean: 47.25, ensembleUpper: 47.65, ensembleLower: 46.90, rainfallMm: 11 },
  { time: "+24h", observed: 46.85, ensembleMean: 47.10, ensembleUpper: 47.60, ensembleLower: 46.70, rainfallMm: 8 },
  { time: "+48h", observed: 46.85, ensembleMean: 46.75, ensembleUpper: 47.35, ensembleLower: 46.30, rainfallMm: 4 },
  { time: "+72h", observed: 46.85, ensembleMean: 46.40, ensembleUpper: 47.10, ensembleLower: 45.95, rainfallMm: 2 },
];

const DATA_72H_SURGE: DataPoint[] = [
  { time: "-36h", observed: 46.50, ensembleMean: 46.50, ensembleUpper: 46.75, ensembleLower: 46.30, rainfallMm: 14 },
  { time: "-24h", observed: 47.10, ensembleMean: 47.10, ensembleUpper: 47.40, ensembleLower: 46.85, rainfallMm: 30 },
  { time: "-12h", observed: 47.85, ensembleMean: 47.85, ensembleUpper: 48.20, ensembleLower: 47.55, rainfallMm: 48 },
  { time: "NOW", observed: 48.45, ensembleMean: 48.45, ensembleUpper: 48.90, ensembleLower: 48.10, rainfallMm: 70 },
  { time: "+12h", observed: 48.45, ensembleMean: 49.25, ensembleUpper: 49.85, ensembleLower: 48.70, rainfallMm: 58 },
  { time: "+24h", observed: 48.45, ensembleMean: 49.65, ensembleUpper: 50.35, ensembleLower: 49.05, rainfallMm: 44 },
  { time: "+48h", observed: 48.45, ensembleMean: 49.10, ensembleUpper: 49.95, ensembleLower: 48.40, rainfallMm: 25 },
  { time: "+72h", observed: 48.45, ensembleMean: 48.20, ensembleUpper: 49.20, ensembleLower: 47.45, rainfallMm: 12 },
];

export const HydrologicalChart: React.FC<HydrologicalChartProps> = ({
  isSurge = false,
  compact = false,
}) => {
  const [horizon, setHorizon] = useState<"6H" | "24H" | "72H">("24H");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(3);

  const series = React.useMemo(() => {
    if (horizon === "6H") return isSurge ? DATA_6H_SURGE : DATA_6H_NOMINAL;
    if (horizon === "72H") return isSurge ? DATA_72H_SURGE : DATA_72H_NOMINAL;
    return isSurge ? DATA_24H_SURGE : DATA_24H_NOMINAL;
  }, [horizon, isSurge]);

  const activePoint = hoveredIdx !== null && hoveredIdx < series.length ? series[hoveredIdx] : series[3];

  const minStage = 45.0;
  const maxStage = 51.0;
  const chartLeft = 48;
  const chartRight = 560;
  const chartTop = 24;
  const chartBottom = 168;
  const width = chartRight - chartLeft;
  const height = chartBottom - chartTop;

  const toX = (idx: number) => chartLeft + (idx / (series.length - 1)) * width;
  const toY = (val: number) =>
    chartBottom - ((val - minStage) / (maxStage - minStage)) * height;

  const warningY = toY(47.60);
  const dangerY = toY(48.60);

  const upperPoints = series.map((d, i) => `${toX(i)},${toY(d.ensembleUpper)}`).join(" ");
  const lowerPoints = [...series]
    .reverse()
    .map((d, revIdx) => {
      const i = series.length - 1 - revIdx;
      return `${toX(i)},${toY(d.ensembleLower)}`;
    })
    .join(" ");
  const bandPolygon = `${upperPoints} ${lowerPoints}`;

  const meanPath = series
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d.ensembleMean)}`)
    .join(" ");

  const observedPath = series
    .slice(0, 4)
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d.observed)}`)
    .join(" ");

  return (
    <div className="w-full rounded-2xl border border-[#0284C7]/45 bg-[#081424] backdrop-blur-xl p-4 sm:p-5 space-y-3.5 text-[#F0F9FF] shadow-xl">
      {/* Header & Time Range Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F0F9FF]">
              River Stage Hydrograph & Ensemble Uncertainty
            </span>
          </div>
          <p className="text-[11px] text-[#BAE6FD]/75 mt-0.5">
            Patna, Gandhi Ghat Gauge (STN-PAT-01) · Units: metres (m MSL) · Rainfall (mm/hr)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Pill Toggle Group for Horizons */}
          <div className="inline-flex rounded-full border border-[#0284C7]/45 bg-[#040B14] p-0.5">
            {(["6H", "24H", "72H"] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => {
                  setHorizon(h);
                  setHoveredIdx(3);
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                  horizon === h
                    ? "bg-[#0EA5E9] text-[#F0F9FF] shadow-sm"
                    : "text-[#BAE6FD]/75 hover:text-[#F0F9FF]"
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-semibold border ${
              isSurge
                ? "bg-[#EF4444]/20 text-[#F87171] border-[#EF4444]/50"
                : "bg-[#0D1F36] text-[#38BDF8] border-[#0284C7]/50"
            }`}
          >
            {isSurge ? "HIGH FLOOD WATCH" : "NOMINAL ENVELOPE"}
          </span>
        </div>
      </div>

      {/* Interactive Tooltip Readout Bar */}
      {activePoint && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-3.5 py-2.5 rounded-xl bg-[#040B14] border border-[#0284C7]/35 text-[11px] font-mono">
          <div>
            <span className="text-[#38BDF8] block text-[10px]">HORIZON STEP</span>
            <strong className="text-[#F0F9FF]">{activePoint.time} ({horizon})</strong>
          </div>
          <div>
            <span className="text-[#38BDF8] block text-[10px]">ENSEMBLE MEAN</span>
            <strong className="text-[#0EA5E9]">{activePoint.ensembleMean.toFixed(2)} m</strong>
          </div>
          <div>
            <span className="text-[#38BDF8] block text-[10px]">90% CONFIDENCE BAND</span>
            <strong className="text-[#F0F9FF]">
              {activePoint.ensembleLower.toFixed(2)}–{activePoint.ensembleUpper.toFixed(2)} m
            </strong>
          </div>
          <div>
            <span className="text-[#38BDF8] block text-[10px]">RAINFALL INTENSITY</span>
            <strong className="text-[#7DD3FC]">{activePoint.rainfallMm} mm/hr</strong>
          </div>
        </div>
      )}

      {/* SVG Hydrograph Canvas */}
      <svg
        viewBox="0 0 585 205"
        className="w-full h-auto overflow-visible select-none"
        role="img"
        aria-label="River stage hydrograph and forecast uncertainty chart"
      >
        <defs>
          <linearGradient id="hydroAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.30" />
            <stop offset="85%" stopColor="#0284C7" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#040B14" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal Y-Axis Grid Lines & Labels (m MSL) */}
        {[45.0, 46.0, 47.0, 48.0, 49.0, 50.0].map((stageVal) => {
          const yPos = toY(stageVal);
          return (
            <g key={stageVal}>
              <line
                x1={chartLeft}
                x2={chartRight}
                y1={yPos}
                y2={yPos}
                stroke="rgba(56, 189, 248, 0.20)"
                strokeDasharray="3 5"
              />
              <text
                x={chartLeft - 8}
                y={yPos + 3}
                textAnchor="end"
                fill="#7DD3FC"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
              >
                {stageVal.toFixed(1)}m
              </text>
            </g>
          );
        })}

        {/* Danger Threshold Line (#EF4444) at 48.60m */}
        <line
          x1={chartLeft}
          x2={chartRight}
          y1={dangerY}
          y2={dangerY}
          stroke="#EF4444"
          strokeWidth="1.3"
          strokeDasharray="5 4"
        />
        <text
          x={chartRight - 4}
          y={dangerY - 4}
          textAnchor="end"
          fill="#EF4444"
          fontSize="8.5"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
        >
          DANGER THRESHOLD 48.60m
        </text>

        {/* Warning Threshold Line (#F59E0B) at 47.60m */}
        <line
          x1={chartLeft}
          x2={chartRight}
          y1={warningY}
          y2={warningY}
          stroke="#F59E0B"
          strokeWidth="1.3"
          strokeDasharray="4 4"
        />
        <text
          x={chartRight - 4}
          y={warningY - 4}
          textAnchor="end"
          fill="#F59E0B"
          fontSize="8.5"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
        >
          WARNING THRESHOLD 47.60m
        </text>

        {/* Rainfall Hyetograph Bars along Bottom */}
        {series.map((d, i) => {
          const x = toX(i);
          const barH = Math.min(34, (d.rainfallMm / 80) * 34);
          return (
            <rect
              key={`rain-${d.time}-${i}`}
              x={x - 7}
              y={chartBottom - barH}
              width="14"
              height={barH}
              rx="2"
              fill="rgba(56, 189, 248, 0.25)"
            />
          );
        })}

        {/* 90% Confidence Uncertainty Envelope Polygon */}
        <polygon points={bandPolygon} fill="rgba(56, 189, 248, 0.16)" />

        {/* Area under Ensemble Mean */}
        <path
          d={`${meanPath} L ${toX(series.length - 1)} ${chartBottom} L ${chartLeft} ${chartBottom} Z`}
          fill="url(#hydroAreaFill)"
        />

        {/* Upper & Lower Bound Dashed Curves */}
        <polyline
          fill="none"
          stroke="#38BDF8"
          strokeOpacity="0.65"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          points={upperPoints}
        />

        {/* Forecast Ensemble Mean Curve (Hydrological Blue #0EA5E9 Dashed) */}
        <path
          d={meanPath}
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.4"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {/* Glacial Ice (#F0F9FF) Observed Solid Line (Past to NOW) */}
        <path
          d={observedPath}
          fill="none"
          stroke="#F0F9FF"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* Vertical "NOW" Reference Marker */}
        <line
          x1={toX(3)}
          x2={toX(3)}
          y1={chartTop}
          y2={chartBottom}
          stroke="rgba(240, 249, 255, 0.35)"
          strokeDasharray="2 3"
        />
        <text
          x={toX(3)}
          y={chartTop - 6}
          textAnchor="middle"
          fill="#F0F9FF"
          fontSize="8.5"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="700"
        >
          NOW (T+0)
        </text>

        {/* Data Nodes & Interactive Hover Targets */}
        {series.map((d, i) => {
          const cx = toX(i);
          const cy = toY(d.ensembleMean);
          const isSelected = hoveredIdx === i;
          return (
            <g
              key={d.time}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onClick={() => setHoveredIdx(i)}
            >
              <circle cx={cx} cy={cy} r="14" fill="transparent" />
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? "5" : "3.5"}
                fill={isSelected ? "#0EA5E9" : "#F0F9FF"}
                stroke="#040B14"
                strokeWidth="1.5"
              />
              <text
                x={cx}
                y={chartBottom + 16}
                textAnchor="middle"
                fill={isSelected ? "#F0F9FF" : "#7DD3FC"}
                fontSize="9.5"
                fontFamily="JetBrains Mono, monospace"
                fontWeight={isSelected ? "700" : "500"}
              >
                {d.time}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend & Scientific Disclaimer Footer */}
      {!compact && (
        <div className="pt-2.5 border-t border-[#0284C7]/30 flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#F0F9FF]">
              <span className="w-3 h-0.5 bg-[#F0F9FF] inline-block" /> Observed Stage
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#0EA5E9]">
              <span className="w-3 h-0.5 bg-[#0EA5E9] inline-block" /> Forecast Mean (Ensemble)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#38BDF8]">
              <span className="w-3 h-2 rounded-sm bg-[#38BDF8]/25 inline-block" /> 90% Prediction Band
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#F59E0B]">
              <span className="w-3 h-0.5 bg-[#F59E0B] inline-block" /> Warning (47.60m)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#EF4444]">
              <span className="w-3 h-0.5 bg-[#EF4444] inline-block" /> Danger (48.60m)
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#BAE6FD]/60">
            CWC Gandhi Ghat datum benchmark · Illustrative preview
          </span>
        </div>
      )}
    </div>
  );
};
