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
      <div className="pb-4 border-b border-[#A1A1AA]/15">
        <div className="eyebrow">OPERATIONS WORKSPACE</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#A1A1AA] tracking-tight">
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
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#0A0A0A] text-xs text-[#A1A1AA] placeholder:text-[#A69B88]/60 focus:outline-none focus:border-[#FFFFFF]"
          />
        </div>
        <select className="px-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#0A0A0A] text-xs text-[#A1A1AA] focus:outline-none focus:border-[#FFFFFF]">
          <option>All events</option>
          <option>Authorization</option>
          <option>Gate verdict</option>
        </select>
      </div>

      {/* Event Ledger Panel */}
      <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
          <h3 className="text-sm font-bold text-[#A1A1AA]">Event Ledger</h3>
          <span className="text-xs font-mono text-[#FFFFFF]">Cryptographically Chained · SAMPLE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#A1A1AA]/15 text-[#A69B88] uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Resource</th>
                <th className="py-2.5 px-3">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A1A1AA]/10">
              <tr className="hover:bg-[#141414]/50">
                <td className="py-3 px-3 text-[#A69B88]">16:54:12 UTC</td>
                <td className="py-3 px-3 font-semibold text-[#FFFFFF]">System</td>
                <td className="py-3 px-3 text-[#A1A1AA]">Pre-Run Gate Evaluation</td>
                <td className="py-3 px-3 text-[#FFFFFF]">SIM-489</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FFFFFF]/15 text-[#FFFFFF] border border-[#FFFFFF]/30">
                    PASS
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#141414]/50">
                <td className="py-3 px-3 text-[#A69B88]">16:52:08 UTC</td>
                <td className="py-3 px-3 font-semibold text-[#FFFFFF]">Commander-01</td>
                <td className="py-3 px-3 text-[#A1A1AA]">CAP Advisory Authorized</td>
                <td className="py-3 px-3 text-[#FFFFFF]">CAP-2026-PAT-09</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FFFFFF]/15 text-[#FFFFFF] border border-[#FFFFFF]/30">
                    APPROVED
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#141414]/50">
                <td className="py-3 px-3 text-[#A69B88]">16:40:19 UTC</td>
                <td className="py-3 px-3 font-semibold text-[#FFFFFF]">System</td>
                <td className="py-3 px-3 text-[#A1A1AA]">Mid-Run Ensemble Convergence Check</td>
                <td className="py-3 px-3 text-[#FFFFFF]">SIM-488</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FFFFFF]/15 text-[#FFFFFF] border border-[#FFFFFF]/30">
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
