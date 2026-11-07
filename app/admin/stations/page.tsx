"use client";

import React, { useState } from "react";
import { CheckCircle2, Radio, Activity, Satellite, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminStationsPage() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0f171b] border border-[#5eead4]/40 text-xs font-mono text-[#5eead4] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#5eead4]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e4952]/30">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-3xl font-black text-white">Stations & Data Sources</h1>
          <p className="text-xs text-[#9bb2af] mt-1">
            Review station metadata, telemetry feeds and source readiness.
          </p>
        </div>
        <button
          onClick={() => showToast("Source configuration preview.")}
          className="btn small self-start sm:self-auto"
        >
          Configure source
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Stations online</span>
            <Radio className="w-3.5 h-3.5 text-[#5eead4]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">08</div>
          <div className="text-[11px] text-[#5eead4]">100% reporting</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Active telemetry</span>
            <Activity className="w-3.5 h-3.5 text-[#5eead4]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">08</div>
          <div className="text-[11px] text-[#5eead4]">Real-time stream</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Stale feeds</span>
            <Activity className="w-3.5 h-3.5 text-[#5eead4]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">00</div>
          <div className="text-[11px] text-[#5eead4]">Optimal health</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Source families</span>
            <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">06</div>
          <div className="text-[11px] text-[#859e9a]">Gauges, Radar, Sat</div>
        </div>
      </div>

      {/* Station Catalogue Panel */}
      <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
          <h3 className="text-sm font-bold text-white">Station Catalogue</h3>
          <span className="text-xs font-mono text-teal-400">Live Ingestion</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2e4952]/50 text-[#9bb2af]">
                <th className="py-2.5 px-3">Station / source</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Last observation</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2e35]">
              <tr className="hover:bg-[#142329]/50">
                <td className="py-3 px-3 font-semibold text-white">Ganga Gauge · Sector 01</td>
                <td className="py-3 px-3 text-[#9bb2af]">River stage</td>
                <td className="py-3 px-3 text-[#9bb2af]">Patna Reach</td>
                <td className="py-3 px-3 text-[#627b77]">2 mins ago</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    Connected
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#142329]/50">
                <td className="py-3 px-3 font-semibold text-white">Rainfall Doppler Radar</td>
                <td className="py-3 px-3 text-[#9bb2af]">Precipitation</td>
                <td className="py-3 px-3 text-[#9bb2af]">Catchment West</td>
                <td className="py-3 px-3 text-[#627b77]">5 mins ago</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    Connected
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#142329]/50">
                <td className="py-3 px-3 font-semibold text-white">Sentinel-1 SAR Feed</td>
                <td className="py-3 px-3 text-[#9bb2af]">Satellite Imagery</td>
                <td className="py-3 px-3 text-[#9bb2af]">Footprint Ganga</td>
                <td className="py-3 px-3 text-[#627b77]">2 hours ago</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1c2e35] text-[#9bb2af] border border-[#2e4952]">
                    Processed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
