"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminIncidentsPage() {
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
          <h1 className="text-3xl font-black text-white">Incident Management</h1>
          <p className="text-xs text-[#9bb2af] mt-1">
            Create and track structured flood incidents across their full lifecycle.
          </p>
        </div>
        <button
          onClick={() => showToast("Incident creation is simulated.")}
          className="btn primary small self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Create incident
        </button>
      </div>

      {/* Search / Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#859e9a] absolute left-3.5 top-3" />
          <input
            placeholder="Search incidents..."
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]"
          />
        </div>
        <select className="px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]">
          <option>All phases</option>
          <option>Pre-event</option>
          <option>Active event</option>
          <option>Post-event</option>
        </select>
        <select className="px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]">
          <option>All statuses</option>
          <option>Open</option>
          <option>Closed</option>
        </select>
      </div>

      {/* Incident Register Panel */}
      <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
          <h3 className="text-sm font-bold text-white">Incident Register</h3>
          <span className="text-xs font-mono text-[#627b77]">2 Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2e4952]/50 text-[#9bb2af]">
                <th className="py-2.5 px-3">Incident</th>
                <th className="py-2.5 px-3">Study area</th>
                <th className="py-2.5 px-3">Event phase</th>
                <th className="py-2.5 px-3">Record type</th>
                <th className="py-2.5 px-3">Updated</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2e35]">
              <tr className="hover:bg-[#142329]/50">
                <td className="py-3 px-3 font-semibold text-white">Ganga / Patna Scenario</td>
                <td className="py-3 px-3 text-[#9bb2af]">Patna corridor</td>
                <td className="py-3 px-3 text-[#9bb2af]">Pre-event</td>
                <td className="py-3 px-3 text-cyan-glow">SIMULATION</td>
                <td className="py-3 px-3 text-[#627b77]">06 Nov 2026</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Demo
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#142329]/50">
                <td className="py-3 px-3 font-semibold text-white">Upstream Rainfall Event</td>
                <td className="py-3 px-3 text-[#9bb2af]">Upper catchment</td>
                <td className="py-3 px-3 text-[#9bb2af]">Active event</td>
                <td className="py-3 px-3 text-cyan-glow">SIMULATION</td>
                <td className="py-3 px-3 text-[#627b77]">06 Nov 2026</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Demo
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Lifecycle Panel */}
      <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
          <h3 className="text-sm font-bold text-white">Event Lifecycle</h3>
          <span className="pill text-[10px]">LIFECYCLE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-[#5eead4]">01 / PREPARE</div>
            <h4 className="text-sm font-bold text-white">Pre-event</h4>
            <p className="text-xs text-[#859e9a] leading-relaxed">
              Monitoring, forecast review and preparedness actions.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-[#fbbf24]">02 / RESPOND</div>
            <h4 className="text-sm font-bold text-white">Active event</h4>
            <p className="text-xs text-[#859e9a] leading-relaxed">
              Incident coordination, evidence updates and response records.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-[#38bdf8]">03 / RECOVER</div>
            <h4 className="text-sm font-bold text-white">Post-event</h4>
            <p className="text-xs text-[#859e9a] leading-relaxed">
              Impact evidence, recovery actions and scientific evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
