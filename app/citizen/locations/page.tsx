"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";

export default function CitizenLocationsPage() {
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
          <div className="eyebrow">CITIZEN WORKSPACE</div>
          <h1 className="text-3xl font-black text-white">My Locations</h1>
          <p className="text-xs text-[#9bb2af] mt-1">
            Manage the geographic areas you wish to follow for flood advisories.
          </p>
        </div>
        <button
          onClick={() => showToast("Location addition is a prototype action.")}
          className="btn primary small self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add location
        </button>
      </div>

      {/* Saved Locations Table Panel */}
      <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
          <h3 className="text-sm font-bold text-white">Saved locations</h3>
          <span className="text-xs font-mono text-[#627b77]">2 Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2e4952]/50 text-[#9bb2af]">
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Area context</th>
                <th className="py-2.5 px-3">Alert subscription</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2e35]">
              <tr className="hover:bg-[#142329]/50">
                <td className="py-3 px-3 font-semibold text-white">Patna · Central</td>
                <td className="py-3 px-3 text-[#9bb2af]">Ganga corridor</td>
                <td className="py-3 px-3 text-[#9bb2af]">Advisory, Watch, Warning</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    Active
                  </span>
                </td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => showToast("Edit location clicked.")}
                    className="px-2.5 py-1 rounded bg-[#162e34] border border-[#2e4952] text-[11px] text-[#5eead4] hover:bg-[#1c3e46]"
                  >
                    Edit
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[#142329]/50">
                <td className="py-3 px-3 font-semibold text-white">North District Point</td>
                <td className="py-3 px-3 text-[#9bb2af]">Tributary basin</td>
                <td className="py-3 px-3 text-[#9bb2af]">Critical alerts only</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Needs setup
                  </span>
                </td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => showToast("Edit location clicked.")}
                    className="px-2.5 py-1 rounded bg-[#162e34] border border-[#2e4952] text-[11px] text-[#5eead4] hover:bg-[#1c3e46]"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice */}
      <div className="notice">
        Precise addresses are not retained. Only coarse spatial coordinates are stored to match public advisory boundaries.
      </div>
    </div>
  );
}
