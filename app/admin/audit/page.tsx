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
      <div className="pb-4 border-b border-[#D8CBB3]/15">
        <div className="eyebrow">OPERATIONS WORKSPACE</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D8CBB3] tracking-tight">
          Audit Logs
        </h1>
        <p className="text-xs text-[#A69B88] mt-1">
          Append-only cryptographic trace of system evaluations, gate verdicts, and commander decisions.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A69B88] absolute left-3.5 top-3" />
          <input
            placeholder="Filter by actor or event..."
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#292925] text-xs text-[#D8CBB3] placeholder:text-[#A69B88]/60 focus:outline-none focus:border-[#2F6BFF]"
          />
        </div>
        <select className="px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#292925] text-xs text-[#D8CBB3] focus:outline-none focus:border-[#2F6BFF]">
          <option>All events</option>
          <option>Authorization</option>
          <option>Gate verdict</option>
        </select>
      </div>

      {/* Event Ledger Panel */}
      <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
          <h3 className="text-sm font-bold text-[#D8CBB3]">Event Ledger</h3>
          <span className="text-xs font-mono text-[#2F6BFF]">Cryptographically Chained · SAMPLE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#D8CBB3]/15 text-[#A69B88] uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Resource</th>
                <th className="py-2.5 px-3">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8CBB3]/10">
              <tr className="hover:bg-[#33332E]/50">
                <td className="py-3 px-3 text-[#A69B88]">16:54:12 UTC</td>
                <td className="py-3 px-3 font-semibold text-[#EDE4D3]">System</td>
                <td className="py-3 px-3 text-[#D8CBB3]">Pre-Run Gate Evaluation</td>
                <td className="py-3 px-3 text-[#2F6BFF]">SIM-489</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                    PASS
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#33332E]/50">
                <td className="py-3 px-3 text-[#A69B88]">16:52:08 UTC</td>
                <td className="py-3 px-3 font-semibold text-[#EDE4D3]">Commander-01</td>
                <td className="py-3 px-3 text-[#D8CBB3]">CAP Advisory Authorized</td>
                <td className="py-3 px-3 text-[#2F6BFF]">CAP-2026-PAT-09</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                    APPROVED
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#33332E]/50">
                <td className="py-3 px-3 text-[#A69B88]">16:40:19 UTC</td>
                <td className="py-3 px-3 font-semibold text-[#EDE4D3]">System</td>
                <td className="py-3 px-3 text-[#D8CBB3]">Mid-Run Ensemble Convergence Check</td>
                <td className="py-3 px-3 text-[#2F6BFF]">SIM-488</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                    PASS
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
