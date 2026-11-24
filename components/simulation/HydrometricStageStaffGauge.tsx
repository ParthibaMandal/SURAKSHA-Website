"use client";

import React from "react";
import { AlertTriangle, ShieldCheck, Waves } from "lucide-react";

interface HydrometricStageStaffGaugeProps {
  stage: number;
  warningLevel?: number;
  dangerLevel?: number;
  hfl?: number;
  stationName?: string;
  embankmentStatus?: string;
}

export const HydrometricStageStaffGauge: React.FC<HydrometricStageStaffGaugeProps> = ({
  stage,
  warningLevel = 47.6,
  dangerLevel = 48.6,
  hfl = 50.52,
  stationName = "Gandhi Ghat, Patna",
  embankmentStatus = "Stable",
}) => {
  // Gauge scale: 42.0m (bottom) to 52.0m (top) -> 10m range
  const minM = 42.0;
  const maxM = 52.0;
  const range = maxM - minM;

  const clampStage = Math.max(minM, Math.min(maxM, stage));
  const waterHeightPct = ((clampStage - minM) / range) * 100;
  const warningPosPct = 100 - ((warningLevel - minM) / range) * 100;
  const dangerPosPct = 100 - ((dangerLevel - minM) / range) * 100;
  const hflPosPct = 100 - ((hfl - minM) / range) * 100;
  const waterTopPct = 100 - waterHeightPct;

  const isDanger = stage >= dangerLevel;
  const isWarning = stage >= warningLevel && !isDanger;
  const diffDanger = stage - dangerLevel;

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md shadow-xs flex flex-col justify-between space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)]">
          <Waves className="w-4 h-4 text-sky-500" />
          <span>Stage Elevation Cross-Section</span>
        </div>
        <span className="text-[10px] font-mono text-[var(--muted-foreground)] truncate max-w-[140px]">
          {stationName}
        </span>
      </div>

      {/* Main Infographic Staff Gauge & Cross-Section Graphic */}
      <div className="grid grid-cols-12 gap-3 items-center py-1">
        {/* Left: River Cross-Section Column (col-span-8) */}
        <div className="col-span-8 relative h-48 sm:h-52 rounded-xl bg-gradient-to-b from-sky-950/20 via-sky-900/10 to-sky-950/30 border border-[var(--border)] overflow-hidden">
          {/* Background Grid Ticks */}
          <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
            {[52, 50, 48, 46, 44, 42].map((m) => (
              <div key={m} className="w-full border-b border-dashed border-[var(--foreground)] text-[8px] font-mono" />
            ))}
          </div>

          {/* HFL Reference Line (50.52m) */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-purple-500/80 z-20 flex items-center justify-between px-2 text-[9px] font-mono font-bold text-purple-400"
            style={{ top: `${hflPosPct}%` }}
          >
            <span className="bg-purple-950/80 px-1 rounded">HISTORIC HFL ({hfl.toFixed(2)}m)</span>
          </div>

          {/* Danger Level Line (48.60m) */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-rose-500 z-20 flex items-center justify-between px-2 text-[9px] font-mono font-bold text-rose-500"
            style={{ top: `${dangerPosPct}%` }}
          >
            <span className="bg-rose-950/80 px-1 rounded">DANGER MARK ({dangerLevel.toFixed(2)}m)</span>
          </div>

          {/* Warning Level Line (47.60m) */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-amber-500 z-20 flex items-center justify-between px-2 text-[9px] font-mono font-semibold text-amber-500"
            style={{ top: `${warningPosPct}%` }}
          >
            <span className="bg-amber-950/80 px-1 rounded">WARNING ({warningLevel.toFixed(2)}m)</span>
          </div>

          {/* Animated Water Body Fill */}
          <div
            className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-sky-600/90 via-sky-500/80 to-teal-400/80 transition-all duration-700 ease-out z-10"
            style={{ height: `${waterHeightPct}%` }}
          >
            {/* Animated Wave Crest Top */}
            <div className="absolute -top-1.5 left-0 right-0 h-3 overflow-hidden opacity-90">
              <svg className="w-full h-full text-teal-300" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 C 20 0, 40 20, 60 10 C 80 0, 100 20, 120 10 L 120 20 L 0 20 Z" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Floating Surface Level Badge */}
          <div
            className="absolute right-2 -translate-y-1/2 z-30 transition-all duration-700 ease-out flex items-center gap-1.5"
            style={{ top: `${waterTopPct}%` }}
          >
            <div
              className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-extrabold shadow-md flex items-center gap-1 ${
                isDanger
                  ? "bg-rose-500 text-white animate-pulse"
                  : isWarning
                  ? "bg-amber-500 text-black"
                  : "bg-emerald-500 text-white"
              }`}
            >
              <span>{stage.toFixed(2)}m</span>
            </div>
          </div>
        </div>

        {/* Right: Vertical Hydrometric Metric Bar (col-span-4) */}
        <div className="col-span-4 flex flex-col justify-between h-48 sm:h-52 py-1 pl-1 space-y-2">
          {/* Current Stage Display */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-[var(--muted-foreground)] block">
              River Stage
            </span>
            <div className="font-mono text-xl sm:text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
              {stage.toFixed(2)} <span className="text-xs font-semibold text-[var(--muted-foreground)]">m</span>
            </div>
            <div className="text-[10px] font-mono font-semibold">
              {isDanger ? (
                <span className="text-rose-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  +{diffDanger.toFixed(2)}m OVER
                </span>
              ) : isWarning ? (
                <span className="text-amber-500">{(dangerLevel - stage).toFixed(2)}m to Danger</span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 shrink-0" />
                  Nominal Stage
                </span>
              )}
            </div>
          </div>

          {/* Embankment Status Badge */}
          <div className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[10px] font-mono space-y-1">
            <div className="text-[9px] text-[var(--muted-foreground)] uppercase">Embankment</div>
            <div
              className={`font-bold truncate ${
                embankmentStatus === "Breach"
                  ? "text-rose-500 font-extrabold"
                  : embankmentStatus === "Under Stress"
                  ? "text-amber-500"
                  : "text-emerald-500"
              }`}
            >
              {embankmentStatus}
            </div>
          </div>

          {/* Bed Datum Reference */}
          <div className="text-[9px] font-mono text-[var(--muted-foreground)] border-t border-[var(--border)] pt-1">
            Zero Datum: {minM.toFixed(1)}m GTS
          </div>
        </div>
      </div>
    </div>
  );
};
