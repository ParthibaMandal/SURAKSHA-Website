import React from "react";

export const metadata = {
  title: "System Settings | SURAKSHA Operations",
  description: "Platform configuration and pipeline runtime parameters.",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="pb-4 border-b border-[#D8CBB3]/15">
        <div className="eyebrow">OPERATIONS WORKSPACE</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D8CBB3] tracking-tight">
          System Settings
        </h1>
        <p className="text-xs text-[#A69B88] mt-1">
          Platform configuration, hydrological pipeline runtime parameters, and supervisory safeguards.
        </p>
      </div>

      {/* Two Column Layout: Environment Parameters vs Safeguards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environment Parameters */}
        <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
            <h3 className="text-sm font-bold text-[#D8CBB3]">Environment Parameters</h3>
            <span className="text-xs font-mono text-[#A69B88]">Runtime</span>
          </div>

          <div className="divide-y divide-[#D8CBB3]/10">
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-[#EDE4D3] block">FastAPI Hydrological Gateway</strong>
                <small className="text-[11px] text-[#A69B88] font-mono">SURAKSHA_BACKEND_URL · REST v1</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                Active
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-[#EDE4D3] block">Simulation Mode</strong>
                <small className="text-[11px] text-[#A69B88] font-mono">Offline Jev Deterministic Ensemble</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#33332E] text-[#D8CBB3] border border-[#D8CBB3]/20">
                Enabled
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-[#EDE4D3] block">Geospatial Engine</strong>
                <small className="text-[11px] text-[#A69B88] font-mono">Sentinel-1 SAR & Basin Contour Service</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Safeguards */}
        <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
            <h3 className="text-sm font-bold text-[#D8CBB3]">Supervisory Safeguards</h3>
            <span className="text-xs font-mono text-[#2F6BFF]">Guarded</span>
          </div>

          <div className="divide-y divide-[#D8CBB3]/10">
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-[#EDE4D3] block">Human-in-the-loop Gate</strong>
                <small className="text-[11px] text-[#A69B88]">Commander Authorization Required for CAP Broadcast</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                Enforced
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-[#EDE4D3] block">Data Provenance Tagging</strong>
                <small className="text-[11px] text-[#A69B88]">Explicit LIVE / SAMPLE / SYNTHETIC / STALE Badges</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                Enabled
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-[#EDE4D3] block">Audit Logging</strong>
                <small className="text-[11px] text-[#A69B88]">Immutable Write-only Decision Ledger</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
