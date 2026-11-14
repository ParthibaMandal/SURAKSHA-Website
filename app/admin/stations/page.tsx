"use client";

import React, { useState } from "react";
import { CheckCircle2, Radio, Activity, Layers, Search } from "lucide-react";

const STATIONS_LIST = [
  {
    id: "STN-PAT-01",
    name: "Gandhighat · Patna Main",
    type: "River Stage & Discharge",
    location: "Patna Urban Reach",
    stage: "49.82 m",
    warn: "50.50 m",
    danger: "51.80 m",
    freshness: "2 mins ago",
    provenance: "SAMPLE",
    status: "Connected",
  },
  {
    id: "STN-PAT-02",
    name: "Digha Ghat · Upstream",
    type: "River Stage",
    location: "Patna West Reach",
    stage: "50.45 m",
    warn: "50.40 m",
    danger: "51.50 m",
    freshness: "4 mins ago",
    provenance: "SAMPLE",
    status: "Warning",
  },
  {
    id: "STN-SON-01",
    name: "Maner · Sone Confluence",
    type: "Confluence Gauge",
    location: "Danapur West",
    stage: "51.92 m",
    warn: "51.00 m",
    danger: "51.80 m",
    freshness: "1 min ago",
    provenance: "SYNTHETIC",
    status: "Danger",
  },
  {
    id: "STN-GAN-01",
    name: "Hajipur · Gandak Bridge",
    type: "Tributary Gauge",
    location: "Vaishali Sector",
    stage: "48.10 m",
    warn: "49.20 m",
    danger: "50.30 m",
    freshness: "6 mins ago",
    provenance: "SAMPLE",
    status: "Connected",
  },
  {
    id: "RAD-PAT-01",
    name: "Doppler Weather Radar",
    type: "Precipitation",
    location: "Catchment West",
    stage: "18.4 mm/hr",
    warn: "35.0 mm/hr",
    danger: "60.0 mm/hr",
    freshness: "5 mins ago",
    provenance: "SAMPLE",
    status: "Connected",
  },
  {
    id: "SAT-SEN-01",
    name: "Sentinel-1 SAR Water Mask",
    type: "Satellite Imagery",
    location: "Ganga Corridor Footprint",
    stage: "42.5 km²",
    warn: "65.0 km²",
    danger: "95.0 km²",
    freshness: "2 hours ago",
    provenance: "SAMPLE",
    status: "Processed",
  },
];

export default function AdminStationsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const filtered = STATIONS_LIST.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase()) ||
      s.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#292925] border border-[#2F6BFF]/40 text-xs font-mono text-[#D8CBB3] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2F6BFF]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CBB3]/15">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D8CBB3] tracking-tight">
            Stations & Data Sources
          </h1>
          <p className="text-xs text-[#A69B88] mt-1">
            Review station metadata, water-level telemetry feeds, thresholds, and source readiness.
          </p>
        </div>
        <button
          onClick={() => showToast("Source configuration preview opened.")}
          className="btn secondary small self-start sm:self-auto"
        >
          Configure Source
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Stations online</span>
            <Radio className="w-4 h-4 text-[#2F6BFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#EDE4D3]">08</div>
          <div className="text-[11px] font-mono text-[#2F6BFF]">100% reporting · SAMPLE</div>
        </div>

        <div className="p-5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Active telemetry</span>
            <Activity className="w-4 h-4 text-[#2F6BFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#EDE4D3]">08</div>
          <div className="text-[11px] font-mono text-[#D8CBB3]">Continuous stream</div>
        </div>

        <div className="p-5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Stale feeds</span>
            <Activity className="w-4 h-4 text-[#A69B88]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#EDE4D3]">00</div>
          <div className="text-[11px] font-mono text-[#A69B88]">Optimal health</div>
        </div>

        <div className="p-5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Source families</span>
            <Layers className="w-4 h-4 text-[#2F6BFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#EDE4D3]">06</div>
          <div className="text-[11px] font-mono text-[#A69B88]">Gauges, Radar, SAR</div>
        </div>
      </div>

      {/* Station Catalogue Panel */}
      <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8CBB3]/12">
          <div>
            <h3 className="text-sm font-bold text-[#D8CBB3]">Station Catalogue</h3>
            <p className="text-xs text-[#A69B88]">
              Water level, warning threshold, danger threshold, data freshness, and provenance
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#A69B88] absolute left-3 top-2.5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search station ID or reach..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#1E1E1C] border border-[#D8CBB3]/20 text-xs text-[#D8CBB3] placeholder:text-[#A69B88]/60 focus:outline-none focus:border-[#2F6BFF]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#D8CBB3]/15 text-[#A69B88] uppercase text-[10px]">
                <th className="py-2.5 px-3">Station / Source</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Current Reading</th>
                <th className="py-2.5 px-3">Warn / Danger</th>
                <th className="py-2.5 px-3">Freshness</th>
                <th className="py-2.5 px-3">Provenance</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8CBB3]/10">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#33332E]/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#EDE4D3] font-sans">{s.name}</div>
                    <div className="text-[10px] text-[#A69B88]">{s.id} · {s.location}</div>
                  </td>
                  <td className="py-3 px-3 text-[#D8CBB3]">{s.type}</td>
                  <td className="py-3 px-3 font-bold text-[#EDE4D3]">{s.stage}</td>
                  <td className="py-3 px-3 text-[#A69B88]">
                    {s.warn} / <span className="text-[#EF4444]">{s.danger}</span>
                  </td>
                  <td className="py-3 px-3 text-[#A69B88]">{s.freshness}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#1E1E1C] text-[#D8CBB3] border border-[#D8CBB3]/20">
                      {s.provenance}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        s.status === "Danger"
                          ? "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30"
                          : s.status === "Warning"
                          ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#2F6BFF]/15 text-[#2F6BFF] border-[#2F6BFF]/30"
                      }`}
                    >
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
