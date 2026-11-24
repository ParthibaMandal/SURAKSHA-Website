import React from "react";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Published Advisories & Alert History | SURAKSHA",
  description: "Human-approved alert records relevant to your saved locations.",
};

export default function CitizenAlertsPage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="pb-4 border-b border-[#A1A1AA]/15">
        <div className="eyebrow">CITIZEN WORKSPACE</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#A1A1AA] tracking-tight">
          Published Advisories & Alert History
        </h1>
        <p className="text-xs text-[#A69B88] mt-1">
          Only human-approved public advisories appear below. Internal automated recommendations require commander verification before release.
        </p>
      </div>

      {/* Alert History Panel */}
      <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
          <h3 className="text-sm font-bold text-[#A1A1AA]">Published Advisory Feed</h3>
          <span className="text-xs font-mono text-[#FFFFFF]">3 Records · SAMPLE</span>
        </div>

        <div className="divide-y divide-[#A1A1AA]/10">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#FFFFFF] uppercase">
                <ShieldCheck className="w-3.5 h-3.5" /> Authorized by Commander-01 · CAP-2026-PAT-09
              </div>
              <strong className="text-sm text-[#FFFFFF] block">
                Advisory: Elevated River Stage Downstream (Patna Lowland Corridor)
              </strong>
              <small className="text-xs text-[#A69B88] block">
                06 Nov 2026 · 14:20 UTC · Sample forecast stage 47.65 m (Warning reference 47.60 m)
              </small>
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 self-start sm:self-center">
              Advisory
            </span>
          </div>

          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#A69B88] uppercase">
                CAP-2026-PAT-08 · Status Update
              </div>
              <strong className="text-sm text-[#FFFFFF] block">
                Clearance: Gandhighat Reach Within Normal Stage Bounds
              </strong>
              <small className="text-xs text-[#A69B88] block">
                05 Nov 2026 · 09:00 UTC · Sample stage 46.40 m
              </small>
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[#FFFFFF]/15 text-[#FFFFFF] border border-[#FFFFFF]/30 self-start sm:self-center">
              Normal
            </span>
          </div>

          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#A69B88] uppercase">
                CAP-2026-SON-04 · Archived Bulletin
              </div>
              <strong className="text-sm text-[#FFFFFF] block">
                Watch: Upper Sone Catchment Heavy Precipitation Notice
              </strong>
              <small className="text-xs text-[#A69B88] block">
                02 Nov 2026 · 18:30 UTC · Resolved without embankment breach
              </small>
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[#141414] text-[#A1A1AA] border border-[#A1A1AA]/20 self-start sm:self-center">
              Archived
            </span>
          </div>
        </div>
      </div>

      {/* Understanding Alert Governance Panel */}
      <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
          <h3 className="text-sm font-bold text-[#A1A1AA]">Understanding Alert Governance</h3>
          <span className="pill text-[10px]">CAP v1.2 WORKFLOW</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-[#A1A1AA]/15 bg-[#000000] space-y-1.5">
            <strong className="text-xs font-mono font-bold text-[#A1A1AA] block">STAGE 01 · DRAFT</strong>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Internal model recommendation undergoing Pre-Run, Mid-Run, and Post-Run gate verification.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#F59E0B]/30 bg-[#000000] space-y-1.5">
            <strong className="text-xs font-mono font-bold text-[#F59E0B] block">STAGE 02 · APPROVED</strong>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Reviewed and cryptographically signed by an authorized human incident commander.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#FFFFFF]/30 bg-[#000000] space-y-1.5">
            <strong className="text-xs font-mono font-bold text-[#FFFFFF] block">STAGE 03 · PUBLISHED</strong>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Dispatched to citizen dashboards and ward-level emergency notification channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
