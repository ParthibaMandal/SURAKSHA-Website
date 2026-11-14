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

const DATA_24H_NOMINAL: DataPoint[] = [
  { time: "-12h", observed: 49.12, ensembleMean: 49.12, ensembleUpper: 49.2, ensembleLower: 49.05, rainfallMm: 4 },
  { time: "-8h", observed: 49.28, ensembleMean: 49.28, ensembleUpper: 49.38, ensembleLower: 49.18, rainfallMm: 8 },
  { time: "-4h", observed: 49.54, ensembleMean: 49.54, ensembleUpper: 49.68, ensembleLower: 49.42, rainfallMm: 14 },
  { time: "NOW", observed: 49.82, ensembleMean: 49.82, ensembleUpper: 50.02, ensembleLower: 49.65, rainfallMm: 18 },
  { time: "+4h", observed: 49.82, ensembleMean: 50.08, ensembleUpper: 50.36, ensembleLower: 49.82, rainfallMm: 12 },
  { time: "+8h", observed: 49.82, ensembleMean: 50.24, ensembleUpper: 50.58, ensembleLower: 49.94, rainfallMm: 9 },
  { time: "+12h", observed: 49.82, ensembleMean: 50.18, ensembleUpper: 50.52, ensembleLower: 49.85, rainfallMm: 5 },
  { time: "+24h", observed: 49.82, ensembleMean: 49.96, ensembleUpper: 50.32, ensembleLower: 49.68, rainfallMm: 3 },
];

const DATA_24H_SURGE: DataPoint[] = [
  { time: "-12h", observed: 49.65, ensembleMean: 49.65, ensembleUpper: 49.78, ensembleLower: 49.52, rainfallMm: 16 },
  { time: "-8h", observed: 50.18, ensembleMean: 50.18, ensembleUpper: 50.35, ensembleLower: 50.02, rainfallMm: 34 },
  { time: "-4h", observed: 50.92, ensembleMean: 50.92, ensembleUpper: 51.18, ensembleLower: 50.68, rainfallMm: 58 },
  { time: "NOW", observed: 51.45, ensembleMean: 51.45, ensembleUpper: 51.82, ensembleLower: 51.12, rainfallMm: 72 },
  { time: "+4h", observed: 51.45, ensembleMean: 51.96, ensembleUpper: 52.42, ensembleLower: 51.54, rainfallMm: 48 },
  { time: "+8h", observed: 51.45, ensembleMean: 52.32, ensembleUpper: 52.85, ensembleLower: 51.82, rainfallMm: 28 },
  { time: "+12h", observed: 51.45, ensembleMean: 52.14, ensembleUpper: 52.68, ensembleLower: 51.64, rainfallMm: 15 },
  { time: "+24h", observed: 51.45, ensembleMean: 51.62, ensembleUpper: 52.15, ensembleLower: 51.18, rainfallMm: 8 },
];

export const HydrologicalChart: React.FC<HydrologicalChartProps> = ({
  isSurge = false,
  compact = false,
}) => {
  const [horizon, setHorizon] = useState<"6H" | "24H" | "72H">("24H");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(3);

  const series = isSurge ? DATA_24H_SURGE : DATA_24H_NOMINAL;
  const activePoint = hoveredIdx !== null ? series[hoveredIdx] : series[3];

  const minStage = 48.5;
  const maxStage = 53.2;
  const chartLeft = 48;
  const chartRight = 560;
  const chartTop = 24;
  const chartBottom = 168;
  const width = chartRight - chartLeft;
  const height = chartBottom - chartTop;

  const toX = (idx: number) => chartLeft + (idx / (series.length - 1)) * width;
  const toY = (val: number) =>
    chartBottom - ((val - minStage) / (maxStage - minStage)) * height;

  const warningY = toY(50.5);
  const dangerY = toY(51.8);

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
    <div className="w-full rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-4 sm:p-5 space-y-3">
      {/* Header & Time Range Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2F6BFF]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D8CBB3]">
              River Stage Hydrograph & Ensemble Uncertainty
            </span>
          </div>
          <p className="text-[11px] text-[#A69B88] mt-0.5">
            Patna · Gandhi Ghat Gauge (STN-PAT-01) · Units: metres (m MSL) & rainfall (mm/hr)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-[#D8CBB3]/16 bg-[#1E1E1C] p-0.5">
            {(["6H", "24H", "72H"] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHorizon(h)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold transition-colors ${
                  horizon === h
                    ? "bg-[#2F6BFF] text-white"
                    : "text-[#A69B88] hover:text-[#D8CBB3]"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <span
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold border ${
              isSurge
                ? "bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/40"
                : "bg-[#2F6BFF]/15 text-[#2F6BFF] border-[#2F6BFF]/35"
            }`}
          >
            {isSurge ? "HIGH FLOOD WATCH" : "NOMINAL ENVELOPE"}
          </span>
        </div>
      </div>

      {/* Interactive Tooltip Readout Bar */}
      {activePoint && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-3 py-2 rounded-lg bg-[#1E1E1C] border border-[#D8CBB3]/12 text-[11px] font-mono">
          <div>
            <span className="text-[#7D7465] block text-[10px]">HORIZON STEP</span>
            <strong className="text-[#D8CBB3]">{activePoint.time} ({horizon})</strong>
          </div>
          <div>
            <span className="text-[#7D7465] block text-[10px]">ENSEMBLE MEAN</span>
            <strong className="text-[#2F6BFF]">{activePoint.ensembleMean.toFixed(2)} m</strong>
          </div>
          <div>
            <span className="text-[#7D7465] block text-[10px]">90% CONFIDENCE BAND</span>
            <strong className="text-[#D8CBB3]">
              {activePoint.ensembleLower.toFixed(2)}–{activePoint.ensembleUpper.toFixed(2)} m
            </strong>
          </div>
          <div>
            <span className="text-[#7D7465] block text-[10px]">RAINFALL INTENSITY</span>
            <strong className="text-[#A69B88]">{activePoint.rainfallMm} mm/hr</strong>
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
          <linearGradient id="electricAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.28" />
            <stop offset="85%" stopColor="#2F6BFF" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#1E1E1C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal Y-Axis Grid Lines & Labels (m) */}
        {[49.0, 50.0, 51.0, 52.0, 53.0].map((stageVal) => {
          const yPos = toY(stageVal);
          return (
            <g key={stageVal}>
              <line
                x1={chartLeft}
                x2={chartRight}
                y1={yPos}
                y2={yPos}
                stroke="rgba(216, 203, 179, 0.1)"
                strokeDasharray="3 5"
              />
              <text
                x={chartLeft - 8}
                y={yPos + 3}
                textAnchor="end"
                fill="#A69B88"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
              >
                {stageVal.toFixed(1)}m
              </text>
            </g>
          );
        })}

        {/* Danger Threshold Line (#EF4444) */}
        <line
          x1={chartLeft}
          x2={chartRight}
          y1={dangerY}
          y2={dangerY}
          stroke="#EF4444"
          strokeWidth="1.2"
          strokeDasharray="5 4"
        />
        <text
          x={chartRight - 4}
          y={dangerY - 4}
          textAnchor="end"
          fill="#F87171"
          fontSize="8.5"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
        >
          DANGER THRESHOLD 51.8m
        </text>

        {/* Warning Threshold Line (#F59E0B) */}
        <line
          x1={chartLeft}
          x2={chartRight}
          y1={warningY}
          y2={warningY}
          stroke="#F59E0B"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <text
          x={chartRight - 4}
          y={warningY - 4}
          textAnchor="end"
          fill="#FBBF24"
          fontSize="8.5"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
        >
          WARNING THRESHOLD 50.5m
        </text>

        {/* Rainfall Hyetograph Bars along Bottom */}
        {series.map((d, i) => {
          const x = toX(i);
          const barH = Math.min(34, (d.rainfallMm / 80) * 34);
          return (
            <rect
              key={`rain-${d.time}`}
              x={x - 7}
              y={chartBottom - barH}
              width="14"
              height={barH}
              rx="2"
              fill="rgba(216, 203, 179, 0.22)"
            />
          );
        })}

        {/* Muted Sand Uncertainty Envelope Polygon */}
        <polygon points={bandPolygon} fill="rgba(216, 203, 179, 0.14)" />

        {/* Area under Ensemble Mean */}
        <path
          d={`${meanPath} L ${toX(series.length - 1)} ${chartBottom} L ${chartLeft} ${chartBottom} Z`}
          fill="url(#electricAreaFill)"
        />

        {/* Muted Sand Upper & Lower Bound Dashed Curves */}
        <polyline
          fill="none"
          stroke="#D8CBB3"
          strokeOpacity="0.45"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          points={upperPoints}
        />

        {/* Electric Blue Forecast Ensemble Mean Curve */}
        <path
          d={meanPath}
          fill="none"
          stroke="#2F6BFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Bright Sand Observed Solid Line (Past to NOW) */}
        <path
          d={observedPath}
          fill="none"
          stroke="#D8CBB3"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Vertical "NOW" Reference Marker */}
        <line
          x1={toX(3)}
          x2={toX(3)}
          y1={chartTop}
          y2={chartBottom}
          stroke="rgba(216, 203, 179, 0.3)"
          strokeDasharray="2 3"
        />
        <text
          x={toX(3)}
          y={chartTop - 6}
          textAnchor="middle"
          fill="#D8CBB3"
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
                r={isSelected ? "5" : "3.2"}
                fill={i <= 3 ? "#D8CBB3" : "#2F6BFF"}
                stroke="#1E1E1C"
                strokeWidth="1.5"
              />
              <text
                x={cx}
                y={chartBottom + 16}
                textAnchor="middle"
                fill={isSelected ? "#D8CBB3" : "#A69B88"}
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
        <div className="pt-2 border-t border-[#D8CBB3]/12 flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#D8CBB3]">
              <span className="w-3 h-0.5 bg-[#D8CBB3] inline-block" /> Observed Stage (m)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#D8CBB3]">
              <span className="w-3 h-0.5 bg-[#2F6BFF] inline-block" /> Forecast Mean (#2F6BFF)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#A69B88]">
              <span className="w-3 h-2 rounded-sm bg-[#D8CBB3]/25 inline-block" /> Ensemble 90% Spread
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#FBBF24]">
              <span className="w-3 h-0.5 bg-[#F59E0B] inline-block" /> Warning (50.5m)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#F87171]">
              <span className="w-3 h-0.5 bg-[#EF4444] inline-block" /> Danger (51.8m)
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#7D7465]">
            Illustrative values for design preview, not a real forecast.
          </span>
        </div>
      )}
    </div>
  );
};
