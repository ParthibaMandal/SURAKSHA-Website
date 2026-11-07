import React from "react";

export const metadata = {
  title: "System Settings | SURAKSHA Operations",
  description: "Platform configuration and pipeline runtime parameters.",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="pb-4 border-b border-[#2e4952]/30">
        <div className="eyebrow">OPERATIONS WORKSPACE</div>
        <h1 className="text-3xl font-black text-white">System Settings</h1>
        <p className="text-xs text-[#9bb2af] mt-1">
          Platform configuration and pipeline runtime parameters.
        </p>
      </div>

      {/* Two Column Layout: Environment Parameters vs Safeguards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environment Parameters */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Environment Parameters</h3>
            <span className="text-xs font-mono text-[#627b77]">Runtime</span>
          </div>

          <div className="divide-y divide-[#2e4952]/30">
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">FastAPI Gateway</strong>
                <small className="text-[11px] text-[#859e9a]">https://api.suraksha.gov.in</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Active
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">Simulation Mode</strong>
                <small className="text-[11px] text-[#859e9a]">Offline Jev Deterministic Engine</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1c2e35] text-[#9bb2af] border border-[#2e4952]">
                Enabled
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">Geospatial Engine</strong>
                <small className="text-[11px] text-[#859e9a]">Google Earth Engine Connector</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Safeguards */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Safeguards</h3>
            <span className="text-xs font-mono text-teal-400">Guarded</span>
          </div>

          <div className="divide-y divide-[#2e4952]/30">
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">Human-in-the-loop Gate</strong>
                <small className="text-[11px] text-[#859e9a]">Dual Authorization Required</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Enforced
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">Reduced-Motion Respect</strong>
                <small className="text-[11px] text-[#859e9a]">Auto-detected from OS</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Enabled
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-white block">Audit Logging</strong>
                <small className="text-[11px] text-[#859e9a]">Immutable Write-only Ledger</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
