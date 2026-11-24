"use client";

import React, { useState, useEffect } from "react";
import { PATNA_GANDHI_GHAT } from "@/lib/mock-data";
import { Radio, Activity, Layers, Search, AlertCircle } from "lucide-react";
import type { StationMetadata } from "@/types/contracts";

interface StationDisplayItem {
  id: string;
  name: string;
  type: string;
  location: string;
  stage: string;
  warn: string;
  danger: string;
  freshness: string;
  provenance: string;
  status: string;
}

const FALLBACK_STATIONS: StationDisplayItem[] = [
  {
    id: "GANGES_PATNA",
    name: PATNA_GANDHI_GHAT.name,
    type: "River Stage & Discharge",
    location: "Gandhi Ghat, Patna",
    stage: `${PATNA_GANDHI_GHAT.currentStage.toFixed(2)} m`,
    warn: `${PATNA_GANDHI_GHAT.warningLevel.toFixed(2)} m`,
    danger: `${PATNA_GANDHI_GHAT.dangerLevel.toFixed(2)} m`,
    freshness: "No live telemetry feed",
    provenance: "SAMPLE",
    status: "Sample Reference",
  },
];

export default function AdminStationsPage() {
  const [stations, setStations] = useState<StationDisplayItem[]>(FALLBACK_STATIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    async function loadStations() {
      try {
        const response = await fetch("/api/flood/stations", { cache: "no-store" });
        if (!response.ok) throw new Error("Station service unavailable");
        const data: StationMetadata[] = await response.json();
        if (active && Array.isArray(data) && data.length > 0) {
          const mapped: StationDisplayItem[] = data.map((s) => ({
            id: s.station_id,
            name: s.station_name,
            type: "CWC River Gauge",
            location: `${s.district}, ${s.state} (${s.basin})`,
            stage: "Stream offline",
            warn: `${s.warning_level_m.toFixed(2)} m`,
            danger: `${s.danger_level_m.toFixed(2)} m`,
            freshness: "Catalog metadata only",
            provenance: "CATALOG METADATA",
            status: "Catalog Registered",
          }));
          setStations(mapped);
          setIsLiveConnected(true);
        }
      } catch {
        if (active) {
          setIsLiveConnected(false);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadStations();
    return () => {
      active = false;
    };
  }, []);

  const filtered = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase()) ||
      s.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#A1A1AA]/15">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#A1A1AA] tracking-tight">
            Stations & Data Sources
          </h1>
          <p className="text-xs text-[#A69B88] mt-1">
            Review station metadata, benchmark datums, warning/danger thresholds, and telemetry feed readiness.
          </p>
        </div>
        <button
          disabled
          title="Telemetry source configuration is managed via engine environment variables (NWDP_LEVEL_CSV, IMD_API_TOKEN)"
          className="btn secondary small self-start sm:self-auto opacity-60 cursor-not-allowed text-xs"
        >
          Configure Source (Server-managed)
        </button>
      </div>

      {/* Operational Notice Banner */}
      <div className="p-4 rounded-xl border border-[#A1A1AA]/20 bg-[#0A0A0A] text-[#A1A1AA] flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-[#FFFFFF] font-bold block">
            {isLiveConnected
              ? "CWC Station Catalogue Connected"
              : "Station Catalogue Service Offline · Showing Sample Reference"}
          </strong>
          <p className="text-[#A69B88]">
            {isLiveConnected
              ? "Station benchmark datums and coordinates are synchronized with the SURAKSHA engine catalog. Continuous real-time gauge telemetry requires configured NWDP/CWC feeds."
              : "The SURAKSHA backend station endpoint is currently unreachable. Displaying the validated Patna Gandhi Ghat baseline fixture for review."}
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Catalog stations</span>
            <Radio className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#FFFFFF]">
            {isLoading ? "—" : String(stations.length).padStart(2, "0")}
          </div>
          <div className="text-[11px] font-mono text-[#A69B88]">
            {isLiveConnected ? "Engine catalog synced" : "Offline sample record"}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Live telemetry stream</span>
            <Activity className="w-4 h-4 text-[#A69B88]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#FFFFFF]">00</div>
          <div className="text-[11px] font-mono text-[#A69B88]">No active live stream</div>
        </div>

        <div className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Telemetry polling</span>
            <Activity className="w-4 h-4 text-[#A69B88]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#FFFFFF]">
            {isLiveConnected ? "Hourly" : "Disabled"}
          </div>
          <div className="text-[11px] font-mono text-[#A69B88]">
            {isLiveConnected ? "CWC/IMD provider feeds" : "No provider polling"}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Source families</span>
            <Layers className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#FFFFFF]">03</div>
          <div className="text-[11px] font-mono text-[#A69B88]">CWC Gauges, IMD, Sentinel-1</div>
        </div>
      </div>

      {/* Station Catalogue Panel */}
      <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#A1A1AA]/12">
          <div>
            <h3 className="text-sm font-bold text-[#A1A1AA]">Station Catalogue</h3>
            <p className="text-xs text-[#A69B88]">
              River reach, benchmark datums, warning threshold, danger threshold, and provenance
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#A69B88] absolute left-3 top-2.5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search station ID or reach..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#000000] border border-[#A1A1AA]/20 text-xs text-[#A1A1AA] placeholder:text-[#A69B88]/60 focus:outline-none focus:border-[#FFFFFF]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#A1A1AA]/15 text-[#A69B88] uppercase text-[10px]">
                <th className="py-2.5 px-3">Station / ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Current Stage</th>
                <th className="py-2.5 px-3">Warn / Danger Thresholds</th>
                <th className="py-2.5 px-3">Data Freshness</th>
                <th className="py-2.5 px-3">Provenance</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A1A1AA]/10">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#141414]/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#FFFFFF] font-sans">{s.name}</div>
                    <div className="text-[10px] text-[#A69B88]">{s.id} · {s.location}</div>
                  </td>
                  <td className="py-3 px-3 text-[#A1A1AA]">{s.type}</td>
                  <td className="py-3 px-3 font-bold text-[#FFFFFF]">{s.stage}</td>
                  <td className="py-3 px-3 text-[#A69B88]">
                    {s.warn} / <span className="text-[#EF4444]">{s.danger}</span>
                  </td>
                  <td className="py-3 px-3 text-[#A69B88]">{s.freshness}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#000000] text-[#A1A1AA] border border-[#A1A1AA]/20">
                      {s.provenance}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-[#FFFFFF]/10 text-[#FFFFFF] border-[#FFFFFF]/25">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
