"use client";

import React from "react";
import { Mountain, CloudRain, Zap, Waves, Flame, Sliders, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";

interface CompoundHazardFlowInfographicProps {
  selectedDrivers: string[];
  onToggleDriver: (driverId: string) => void;
  snowmeltIndex: number;
  rainfall: number;
  tributaryInflow: number;
  inflowMultiplier: number;
  isCompound: boolean;
}

export const CompoundHazardFlowInfographic: React.FC<CompoundHazardFlowInfographicProps> = ({
  selectedDrivers,
  onToggleDriver,
  snowmeltIndex,
  rainfall,
  tributaryInflow,
  inflowMultiplier,
  isCompound,
}) => {
  const driversList = [
    {
      id: "glacier_melt",
      name: "Glacier Thaw",
      metric: `${snowmeltIndex.toFixed(1)}× Anomaly`,
      icon: Mountain,
      accent: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    },
    {
      id: "persistent_rain",
      name: "Monsoon Rain",
      metric: `${rainfall} mm/24h`,
      icon: CloudRain,
      accent: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    },
    {
      id: "tributary_surge",
      name: "Tributary Inflow",
      metric: `${(tributaryInflow / 1000).toFixed(1)}k m³/s`,
      icon: Waves,
      accent: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    },
    {
      id: "cloudburst",
      name: "Cloudburst",
      metric: "Flash Inundation",
      icon: Zap,
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
  ];

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-md shadow-xs space-y-2.5">
      {/* Header with Compound Event Status */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
          <Waves className="w-3.5 h-3.5 text-emerald-500" />
          <span>Multi-Driver Compound Hazard Infographic</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
            isCompound
              ? "bg-amber-500/15 border border-amber-500/40 text-amber-500"
              : "bg-emerald-500/15 border border-emerald-500/40 text-emerald-500"
          }`}
        >
          {isCompound ? "COMPOUND HAZARD ACTIVE" : "SINGLE-DRIVER REGIME"}
        </span>
      </div>

      {/* Visual Flow Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {driversList.map((driver) => {
          const isActive = selectedDrivers.includes(driver.id);
          const Icon = driver.icon;
          return (
            <button
              key={driver.id}
              type="button"
              onClick={() => onToggleDriver(driver.id)}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 select-none relative ${
                isActive
                  ? `${driver.accent} border-opacity-60 shadow-xs ring-1 ring-emerald-500/30`
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-emerald-500/30 hover:text-[var(--foreground)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-[var(--muted-foreground)]"}`} />
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-emerald-400 animate-pulse" : "bg-[var(--border)]"
                  }`}
                />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[var(--foreground)] truncate leading-tight">
                  {driver.name}
                </div>
                <div className="text-[9px] font-mono text-[var(--muted-foreground)] truncate mt-0.5">
                  {driver.metric}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Infographic Summary Stream Bar */}
      <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-[var(--foreground)]">
          <span className="text-emerald-500 font-bold">{selectedDrivers.length} Drivers Active</span>
          <ArrowRight className="w-3 h-3 text-[var(--muted-foreground)]" />
          <span>Mainstream Inflow: {inflowMultiplier.toFixed(1)}×</span>
        </div>
        <div className="text-[var(--muted-foreground)]">
          Confluence: Gandak + Son + Ganga
        </div>
      </div>
    </div>
  );
};
