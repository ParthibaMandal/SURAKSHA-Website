"use client";

import React, { useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";

export default function AdminSosQueuePage() {
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
      <div className="pb-4 border-b border-[#2e4952]/30">
        <div className="eyebrow">OPERATIONS WORKSPACE</div>
        <h1 className="text-3xl font-black text-white">SOS Management</h1>
        <p className="text-xs text-[#9bb2af] mt-1">
          Operational dispatch desk for citizen assistance requests.
        </p>
      </div>

      {/* Alert Banner */}
      <div className="p-4 rounded-xl border border-[#2e4952] bg-[#0f171b] text-slate-200 flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-[#5eead4] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-white font-bold block">Restricted operational view.</strong>
          <p className="text-slate-400">
            All citizen assistance requests are handled under emergency data privacy regulations.
          </p>
        </div>
      </div>

      {/* Incoming Requests Table Panel */}
      <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
          <h3 className="text-sm font-bold text-white">Incoming Requests</h3>
          <span className="text-xs font-mono text-[#627b77]">2 Pending Dispatch</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2e4952]/50 text-[#9bb2af]">
                <th className="py-2.5 px-3">Request ID</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Received</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2e35]">
              <tr className="hover:bg-[#142329]/50">
                <td className="py-3 px-3 text-[#5eead4] font-bold">SOS-2026-001</td>
                <td className="py-3 px-3 font-semibold text-white">Patna East Sector</td>
                <td className="py-3 px-3 text-[#9bb2af]">Evacuation support</td>
                <td className="py-3 px-3 text-[#627b77]">12m ago</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    High
                  </span>
                </td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => showToast("Dispatch initiated.")}
                    className="px-2.5 py-1 rounded bg-[#162e34] border border-[#2e4952] text-[11px] text-[#5eead4] hover:bg-[#1c3e46]"
                  >
                    Dispatch
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[#142329]/50">
                <td className="py-3 px-3 text-[#5eead4] font-bold">SOS-2026-002</td>
                <td className="py-3 px-3 font-semibold text-white">Ganga Riverside Road</td>
                <td className="py-3 px-3 text-[#9bb2af]">Drinking water</td>
                <td className="py-3 px-3 text-[#627b77]">28m ago</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1c2e35] text-[#9bb2af] border border-[#2e4952]">
                    Normal
                  </span>
                </td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => showToast("Assigned to sector team.")}
                    className="px-2.5 py-1 rounded bg-[#162e34] border border-[#2e4952] text-[11px] text-[#5eead4] hover:bg-[#1c3e46]"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
