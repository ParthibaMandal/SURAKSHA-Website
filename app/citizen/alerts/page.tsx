import React from "react";
import Link from "next/link";

export const metadata = {
  title: "My Alerts | SURAKSHA",
  description: "Published alert records relevant to your saved locations.",
};

export default function CitizenAlertsPage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="pb-4 border-b border-[#2e4952]/30">
        <div className="eyebrow">CITIZEN WORKSPACE</div>
        <h1 className="text-3xl font-black text-white">My Alerts</h1>
        <p className="text-xs text-[#9bb2af] mt-1">
          Published alert records relevant to your saved locations. Internal recommendations require verification before public release.
        </p>
      </div>

      {/* Alert History Panel */}
      <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
          <h3 className="text-sm font-bold text-white">Alert history</h3>
          <span className="text-xs font-mono text-[#627b77]">2 Records</span>
        </div>

        <div className="divide-y divide-[#2e4952]/30">
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-white block">Advisory: Elevated stage downstream</strong>
              <small className="text-[11px] text-[#859e9a]">Ganga basin sample record</small>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Advisory
            </span>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-white block">Clearance: Patna Sector Normal</strong>
              <small className="text-[11px] text-[#859e9a]">All river telemetry within baseline limits</small>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
              Normal
            </span>
          </div>
        </div>
      </div>

      {/* Understanding Alert Levels Panel */}
      <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
          <h3 className="text-sm font-bold text-white">Understanding Alert Levels</h3>
          <span className="pill text-[10px]">LIFECYCLE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-1.5">
            <strong className="text-xs font-bold text-[#5eead4] block">01 · Draft</strong>
            <p className="text-xs text-[#859e9a] leading-relaxed">
              Internal recommendation under supervisory gate review.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-1.5">
            <strong className="text-xs font-bold text-[#fbbf24] block">02 · Approved</strong>
            <p className="text-xs text-[#859e9a] leading-relaxed">
              Reviewed and validated by an authorized incident commander.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#091418]/60 space-y-1.5">
            <strong className="text-xs font-bold text-[#38bdf8] block">03 · Published</strong>
            <p className="text-xs text-[#859e9a] leading-relaxed">
              Broadcast across public and emergency channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
