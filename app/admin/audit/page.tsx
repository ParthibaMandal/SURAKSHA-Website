import React from "react";
import { Search } from "lucide-react";

export const metadata = {
  title: "Audit Logs | SURAKSHA Operations",
  description: "Append-only cryptographic trace of system and commander actions.",
};

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="pb-4 border-b border-[#2e4952]/30">
        <div className="eyebrow">OPERATIONS WORKSPACE</div>
        <h1 className="text-3xl font-black text-white">Audit Logs</h1>
        <p className="text-xs text-[#9bb2af] mt-1">
          Append-only cryptographic trace of system and commander actions.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#859e9a] absolute left-3.5 top-3" />
          <input
            placeholder="Filter by actor or event..."
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]"
          />
        </div>
        <select className="px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]">
          <option>All events</option>
          <option>Authorization</option>
          <option>Gate verdict</option>
        </select>
      </div>

      {/* Event Ledger Panel */}
      <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
          <h3 className="text-sm font-bold text-white">Event Ledger</h3>
          <span className="text-xs font-mono text-teal-400">Cryptographically Chained</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2e4952]/50 text-[#9bb2af]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Resource</th>
                <th className="py-2.5 px-3">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2e35]">
              <tr className="hover:bg-[#142329]/50">
                <td className="py-3 px-3 text-[#627b77]">16:54:12</td>
                <td className="py-3 px-3 font-semibold text-white">System</td>
                <td className="py-3 px-3 text-[#9bb2af]">Pre-Run Gate Evaluation</td>
                <td className="py-3 px-3 text-cyan-glow">SIM-489</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    PASS
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#142329]/50">
                <td className="py-3 px-3 text-[#627b77]">16:52:08</td>
                <td className="py-3 px-3 font-semibold text-white">Commander-01</td>
                <td className="py-3 px-3 text-[#9bb2af]">CAP Advisory Authorized</td>
                <td className="py-3 px-3 text-cyan-glow">CAP-09</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    APPROVED
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
