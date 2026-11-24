"use client";

import React from "react";

interface ScenarioComparisonChartProps {
  currentStage?: number;
  currentRisk?: number;
  currentExposed?: number;
}

export const ScenarioComparisonChart: React.FC<ScenarioComparisonChartProps> = ({
  currentStage = 47.17,
  currentRisk = 15,
  currentExposed = 0,
}) => {
  // Comparative benchmark scenario points
  const baseline = { stage: 46.85, risk: 10, exposed: 0 };
  const rain = { stage: currentStage, risk: currentRisk, exposed: currentExposed };
  const surge = {
    stage: 48.12,
    risk: Math.max(32, Math.min(95, Math.round(currentRisk * 1.3))),
    exposed: currentExposed > 0 ? Math.round(currentExposed * 1.35) : 12,
  };

  // Safe height normalization: strictly bounded between 4px and 85px to stay within container
  const getStageHeight = (val: number) => {
    const clamped = Math.max(44.0, Math.min(50.0, val));
    return Math.max(12, Math.min(85, ((clamped - 44.0) / 6.0) * 85));
  };

  const getRiskHeight = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    return Math.max(8, Math.min(85, (clamped / 100) * 85));
  };

  // Dynamically scale exposed population up to the maximum scenario value
  const maxExposed = Math.max(100, baseline.exposed, rain.exposed, surge.exposed);
  const getExposedHeight = (val: number) => {
    if (val <= 0) return 4;
    return Math.max(10, Math.min(85, (Math.min(val, maxExposed) / maxExposed) * 85));
  };

  const formatExposed = (val: number) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return String(val);
  };

  return (
    <div className="w-full flex flex-col justify-between h-full space-y-3 font-sans overflow-hidden">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-end gap-4 text-[11px] font-medium text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          <span>Baseline</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span>Heavy Rainfall</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Rapid River Rise</span>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="grid grid-cols-3 gap-6 pt-4 border-b border-white/10 pb-2 h-44 items-end overflow-hidden">
        {/* Metric 1: Peak Stage */}
        <div className="flex flex-col items-center h-full justify-end overflow-hidden">
          <div className="flex items-end gap-1.5 h-32 w-full justify-center overflow-hidden">
            {/* Baseline */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-zinc-400">{baseline.stage.toFixed(1)}</span>
              <div
                style={{ height: `${getStageHeight(baseline.stage)}px`, maxHeight: "85px" }}
                className="w-5 sm:w-7 rounded-t bg-slate-400/70 hover:bg-slate-400 transition-all max-h-[85px]"
              />
            </div>
            {/* Heavy Rainfall */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-sky-400 font-bold">{rain.stage.toFixed(2)}</span>
              <div
                style={{ height: `${getStageHeight(rain.stage)}px`, maxHeight: "85px" }}
                className="w-5 sm:w-7 rounded-t bg-sky-400 hover:bg-sky-300 transition-all shadow-md shadow-sky-500/20 max-h-[85px]"
              />
            </div>
            {/* Rapid River Rise */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-amber-400">{surge.stage.toFixed(1)}</span>
              <div
                style={{ height: `${getStageHeight(surge.stage)}px`, maxHeight: "85px" }}
                className="w-5 sm:w-7 rounded-t bg-amber-400/80 hover:bg-amber-400 transition-all max-h-[85px]"
              />
            </div>
          </div>
          <span className="mt-2 text-xs font-semibold text-zinc-300 text-center">Peak Stage (m)</span>
        </div>

        {/* Metric 2: Flood Risk (/100) */}
        <div className="flex flex-col items-center h-full justify-end overflow-hidden">
          <div className="flex items-end gap-1.5 h-32 w-full justify-center overflow-hidden">
            {/* Baseline */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-zinc-400">{baseline.risk}</span>
              <div
                style={{ height: `${getRiskHeight(baseline.risk)}px`, maxHeight: "85px" }}
                className="w-5 sm:w-7 rounded-t bg-slate-400/70 hover:bg-slate-400 transition-all max-h-[85px]"
              />
            </div>
            {/* Heavy Rainfall */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-sky-400 font-bold">{rain.risk}</span>
              <div
                style={{ height: `${getRiskHeight(rain.risk)}px`, maxHeight: "85px" }}
                className="w-5 sm:w-7 rounded-t bg-sky-400 hover:bg-sky-300 transition-all shadow-md shadow-sky-500/20 max-h-[85px]"
              />
            </div>
            {/* Rapid River Rise */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-amber-400">{surge.risk}</span>
              <div
                style={{ height: `${getRiskHeight(surge.risk)}px`, maxHeight: "85px" }}
                className="w-5 sm:w-7 rounded-t bg-amber-400/80 hover:bg-amber-400 transition-all max-h-[85px]"
              />
            </div>
          </div>
          <span className="mt-2 text-xs font-semibold text-zinc-300 text-center">Flood Risk (/100)</span>
        </div>

        {/* Metric 3: Exposed People */}
        <div className="flex flex-col items-center h-full justify-end overflow-hidden">
          <div className="flex items-end gap-1.5 h-32 w-full justify-center overflow-hidden">
            {/* Baseline */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-zinc-400">{formatExposed(baseline.exposed)}</span>
              <div
                style={{ height: `${getExposedHeight(baseline.exposed)}px`, maxHeight: "85px" }}
                className="w-5 sm:w-7 rounded-t bg-slate-400/70 max-h-[85px]"
              />
            </div>
            {/* Heavy Rainfall */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-sky-400 font-bold">{formatExposed(rain.exposed)}</span>
              <div
                style={{ height: `${getExposedHeight(rain.exposed)}px`, maxHeight: "85px" }}
                className="w-5 sm:w-7 rounded-t bg-sky-400 hover:bg-sky-300 transition-all shadow-md shadow-sky-500/20 max-h-[85px]"
              />
            </div>
            {/* Rapid River Rise */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-amber-400">{formatExposed(surge.exposed)}</span>
              <div
                style={{ height: `${getExposedHeight(surge.exposed)}px`, maxHeight: "85px" }}
                className="w-5 sm:w-7 rounded-t bg-amber-400/80 hover:bg-amber-400 transition-all max-h-[85px]"
              />
            </div>
          </div>
          <span className="mt-2 text-xs font-semibold text-zinc-300 text-center">Exposed People</span>
        </div>
      </div>
    </div>
  );
};
