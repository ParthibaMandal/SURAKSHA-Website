"use client";

import React, { useState } from "react";
import { Shield, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminApprovalsPage() {
  const [status, setStatus] = useState<"DRAFT" | "AUTHORIZED & PUBLISHED" | "REJECTED BY COMMANDER">("DRAFT");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleApprove = () => {
    setStatus("AUTHORIZED & PUBLISHED");
    showToast("Advisory authorized and recorded in immutable ledger.");
  };

  const handleReject = () => {
    setStatus("REJECTED BY COMMANDER");
    showToast("Advisory rejected. Reason logged.");
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
        <h1 className="text-3xl font-black text-white">Alerts & Approval</h1>
        <p className="text-xs text-[#9bb2af] mt-1">
          Review and authorize draft alert recommendations before public broadcast.
        </p>
      </div>

      {/* Alert Banner */}
      <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 flex items-start gap-3.5">
        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-white font-bold block">
            Human-in-the-loop authorization required.
          </strong>
          <p className="text-slate-300">
            CAP recommendations require dual confirmation by an authorized operational commander before dispatch.
          </p>
        </div>
      </div>

      {/* Two Columns: Draft recommendation vs Approval Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Draft Recommendation */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Draft recommendation · OASIS CAP v1.2</h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                status === "AUTHORIZED & PUBLISHED"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                  : status === "REJECTED BY COMMANDER"
                  ? "bg-red-500/20 text-red-300 border border-red-500/40"
                  : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="eyebrow">CAP-2026-PAT-09</div>
          <h2 className="text-xl font-bold text-white mt-1 mb-2">
            River Stage Advisory · Patna Sector
          </h2>
          <p className="text-xs text-[#9bb2af] leading-relaxed">
            Predicted gradual stage increase exceeding warning levels in lower sectors within 24 hours.
          </p>

          <div className="divide-y divide-[#2e4952]/30 pt-2">
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block">Target Area</strong>
                <small className="text-[#859e9a]">Patna Lowland Corridor</small>
              </div>
              <span className="text-xs font-mono text-white">Sector 4</span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block">Severity Level</strong>
                <small className="text-[#859e9a]">Advisory · Level 2</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Elevated
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block">Evidence Source</strong>
                <small className="text-[#859e9a]">Ensemble Jev + Gauge 04</small>
              </div>
              <span className="text-xs font-mono text-[#5eead4]">Triangulated</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[#2e4952]/30">
            <Button
              onClick={handleApprove}
              disabled={status === "AUTHORIZED & PUBLISHED"}
              className="btn primary small text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Authorize & publish
            </Button>
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={status === "REJECTED BY COMMANDER"}
              className="text-xs border-red-500/40 text-red-300 hover:bg-red-500/10 flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" /> Reject advisory
            </Button>
          </div>
        </div>

        {/* Right: Approval Checklist */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Approval Checklist</h3>
            <span className="text-xs font-mono text-[#627b77]">3 Steps</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-lg bg-[#162e34] border border-[#5eead4]/30 grid place-items-center text-xs font-bold text-[#5eead4] shrink-0">
                1
              </div>
              <div>
                <strong className="text-xs font-bold text-white block">Evidence review</strong>
                <p className="text-xs text-[#9bb2af] mt-0.5 leading-relaxed">
                  Confirm observations, model ensemble spread and uncertainty bounds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-lg bg-[#162e34] border border-[#5eead4]/30 grid place-items-center text-xs font-bold text-[#5eead4] shrink-0">
                2
              </div>
              <div>
                <strong className="text-xs font-bold text-white block">Jurisdiction verification</strong>
                <p className="text-xs text-[#9bb2af] mt-0.5 leading-relaxed">
                  Validate authorization over target geographical sectors.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-lg bg-[#162e34] border border-[#5eead4]/30 grid place-items-center text-xs font-bold text-[#5eead4] shrink-0">
                3
              </div>
              <div>
                <strong className="text-xs font-bold text-white block">Immutable audit record</strong>
                <p className="text-xs text-[#9bb2af] mt-0.5 leading-relaxed">
                  Sign decision record into append-only compliance log.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
