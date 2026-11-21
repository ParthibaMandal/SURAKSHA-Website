"use client";

import React, { useState } from "react";
import { Waves, MapPin, AlertTriangle, ShieldCheck, Activity, ArrowRight } from "lucide-react";

interface Station {
  id: string;
  name: string;
  river: string;
  location: string;
  currentStage: number;
  zeroLevel: number;
  warningLevel: number;
  dangerLevel: number;
  hfl: number;
  hflDate: string;
  status: "ACTIVE_TELEMETRY" | "MAINTENANCE";
}

const STATIONS: Station[] = [
  {
    id: "STN-PAT-01",
    name: "Gandhi Ghat Gauge",
    river: "Ganga",
    location: "Patna Urban Corridor, Bihar",
    currentStage: 49.82,
    zeroLevel: 45.0,
    warningLevel: 50.5,
    dangerLevel: 51.8,
    hfl: 52.52,
    hflDate: "2016-08-25",
    status: "ACTIVE_TELEMETRY",
  },
  {
    id: "STN-PAT-02",
    name: "Digha Ghat Gauge",
    river: "Ganga",
    location: "Western Patna, Bihar",
    currentStage: 49.1,
    zeroLevel: 44.8,
    warningLevel: 50.0,
    dangerLevel: 50.45,
    hfl: 51.8,
    hflDate: "2019-09-28",
    status: "ACTIVE_TELEMETRY",
  },
  {
    id: "STN-BUX-01",
    name: "Buxar Hydro Station",
    river: "Ganga (Upstream Inflow)",
    location: "Buxar District, Bihar",
    currentStage: 58.2,
    zeroLevel: 53.0,
    warningLevel: 59.32,
    dangerLevel: 60.32,
    hfl: 61.12,
    hflDate: "2016-08-20",
    status: "ACTIVE_TELEMETRY",
  },
  {
    id: "STN-HAT-01",
    name: "Hathidah Gauge",
    river: "Ganga (Downstream Outflow)",
    location: "Mokama / Barh, Bihar",
    currentStage: 40.1,
    zeroLevel: 36.0,
    warningLevel: 40.76,
    dangerLevel: 41.76,
    hfl: 43.15,
    hflDate: "2016-08-27",
    status: "ACTIVE_TELEMETRY",
  },
];

export function InteractiveStationRegistry() {
  const [selectedStationId, setSelectedStationId] = useState<string>("STN-PAT-01");
  const selectedStation = STATIONS.find((s) => s.id === selectedStationId) || STATIONS[0];

  const minScale = selectedStation.zeroLevel;
  const maxScale = selectedStation.hfl + 1.0;
  const range = maxScale - minScale;

  const getPercent = (val: number) => {
    return Math.min(100, Math.max(0, ((val - minScale) / range) * 100));
  };

  const isWarning = selectedStation.currentStage >= selectedStation.warningLevel;
  const isDanger = selectedStation.currentStage >= selectedStation.dangerLevel;

  return (
    <div className="space-y-8 my-8">
      {/* Station Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATIONS.map((stn) => {
          const isSelected = stn.id === selectedStationId;
          const toWarning = (stn.warningLevel - stn.currentStage).toFixed(2);

          return (
            <div
              key={stn.id}
              onClick={() => setSelectedStationId(stn.id)}
              className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-[#292925] border-[#2F6BFF] shadow-lg shadow-[#2F6BFF]/10 ring-1 ring-[#2F6BFF]"
                  : "bg-[#242421] border-[#D8CBB3]/15 hover:border-[#D8CBB3]/30"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#2F6BFF] font-semibold">
                    {stn.id}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    Live
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#EDE4D3]">
                  {stn.name}
                </h4>

                <p className="text-xs text-[#A69B88]">
                  {stn.river} · {stn.location}
                </p>
              </div>

              <div className="pt-3 border-t border-[#D8CBB3]/10 mt-3 flex items-center justify-between text-xs">
                <span className="text-[#A69B88]">Current:</span>
                <span className="font-mono font-bold text-[#EDE4D3]">
                  {stn.currentStage} m
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Station Deep Gauge Inspector */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[#D8CBB3]/20 bg-[#242421] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CBB3]/15">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#2F6BFF] uppercase font-bold">
                {selectedStation.id} · CWC Official Telemetry Gauge
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/15 text-[#10B981]">
                {selectedStation.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#EDE4D3]">
              {selectedStation.name}
            </h3>
            <p className="text-xs text-[#A69B88] mt-0.5">
              {selectedStation.river} · {selectedStation.location}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#A69B88] font-mono block">Current River Stage</span>
            <span className="text-2xl font-bold text-[#60A5FA] font-mono">
              {selectedStation.currentStage} m
            </span>
          </div>
        </div>

        {/* Visual Threshold Bar */}
        <div className="space-y-3 p-5 rounded-2xl bg-[#1E1E1C] border border-[#D8CBB3]/10">
          <div className="flex items-center justify-between text-xs font-mono text-[#A69B88]">
            <span>Zero Level: {selectedStation.zeroLevel} m</span>
            <span className="text-[#F59E0B]">Warning: {selectedStation.warningLevel} m</span>
            <span className="text-[#EF4444]">Danger: {selectedStation.dangerLevel} m</span>
            <span>Historical Peak (HFL): {selectedStation.hfl} m</span>
          </div>

          {/* Bar track */}
          <div className="relative w-full h-8 bg-[#141413] rounded-xl overflow-hidden border border-[#D8CBB3]/20">
            {/* Water Fill */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#2F6BFF] to-[#60A5FA] transition-all duration-500 rounded-l-xl"
              style={{ width: `${getPercent(selectedStation.currentStage)}%` }}
            />

            {/* Warning Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#F59E0B] z-10"
              style={{ left: `${getPercent(selectedStation.warningLevel)}%` }}
              title={`Warning Level: ${selectedStation.warningLevel}m`}
            />

            {/* Danger Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#EF4444] z-10"
              style={{ left: `${getPercent(selectedStation.dangerLevel)}%` }}
              title={`Danger Level: ${selectedStation.dangerLevel}m`}
            />

            {/* Current Level Indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded bg-[#EDE4D3] text-[#1E1E1C] font-mono text-[10px] font-bold shadow"
              style={{ left: `${getPercent(selectedStation.currentStage)}%` }}
            >
              {selectedStation.currentStage} m
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#A69B88]">
            <span>Buffer to Warning Level: <strong className="text-[#EDE4D3]">{(selectedStation.warningLevel - selectedStation.currentStage).toFixed(2)} m</strong></span>
            <span>Buffer to Danger Level: <strong className="text-[#EDE4D3]">{(selectedStation.dangerLevel - selectedStation.currentStage).toFixed(2)} m</strong></span>
            <span>HFL Recorded: <strong className="text-[#EDE4D3]">{selectedStation.hflDate}</strong></span>
          </div>
        </div>

        {/* Operational Context Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#1E1E1C] border border-[#D8CBB3]/10 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#A69B88] block">
              Hydraulic Zero Level
            </span>
            <div className="text-lg font-bold text-[#EDE4D3] font-mono">
              {selectedStation.zeroLevel.toFixed(2)} m
            </div>
            <p className="text-[11px] text-[#A69B88]">
              Mean Sea Level (MSL) datum for gauge elevation
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1E1E1C] border border-[#D8CBB3]/10 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#F59E0B] block">
              Warning Level
            </span>
            <div className="text-lg font-bold text-[#F59E0B] font-mono">
              {selectedStation.warningLevel.toFixed(2)} m
            </div>
            <p className="text-[11px] text-[#A69B88]">
              Triggers Stage-1 Civil Defense flood watch advisories
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1E1E1C] border border-[#D8CBB3]/10 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#EF4444] block">
              Danger Level
            </span>
            <div className="text-lg font-bold text-[#EF4444] font-mono">
              {selectedStation.dangerLevel.toFixed(2)} m
            </div>
            <p className="text-[11px] text-[#A69B88]">
              Triggers Stage-2 emergency evacuation & CAP alert broadcast
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

