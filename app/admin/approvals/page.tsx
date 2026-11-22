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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#FFFFFF]/40 text-xs font-mono text-[#A1A1AA] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="pb-4 border-b border-[#A1A1AA]/15">
        <div className="eyebrow">OPERATIONS WORKSPACE</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#A1A1AA] tracking-tight">
          Alerts & Approval
        </h1>
        <p className="text-xs text-[#A69B88] mt-1">
          Review and authorize draft OASIS CAP v1.2 alert recommendations before public broadcast.
        </p>
      </div>

      {/* Alert Banner */}
      <div className="p-4 rounded-xl border border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#A1A1AA] flex items-start gap-3.5">
        <Shield className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-[#FFFFFF] font-bold block">
            Human-in-the-loop authorization required.
          </strong>
          <p className="text-[#A69B88]">
            Automated models never publish directly to citizens. CAP recommendations require confirmation by an authorized operational commander.
          </p>
        </div>
      </div>

      {/* Two Columns: Draft recommendation vs Approval Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Draft Recommendation */}
        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
            <h3 className="text-sm font-bold text-[#A1A1AA]">Draft Recommendation · OASIS CAP v1.2</h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                status === "AUTHORIZED & PUBLISHED"
                  ? "bg-[#FFFFFF]/20 text-[#FFFFFF] border-[#FFFFFF]/40"
                  : status === "REJECTED BY COMMANDER"
                  ? "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40"
                  : "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="eyebrow">CAP-2026-PAT-09 · SYNTHETIC</div>
          <h2 className="text-xl font-bold text-[#FFFFFF] mt-1 mb-2">
            River Stage Advisory · Patna Sector
          </h2>
          <p className="text-xs text-[#A69B88] leading-relaxed">
            Predicted gradual stage increase exceeding warning levels (50.50 m) in lower floodplain wards within 24 hours.
          </p>

          <div className="divide-y divide-[#A1A1AA]/10 pt-2">
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-[#A1A1AA] block">Target Area</strong>
                <small className="text-[#A69B88]">Patna Lowland Corridor</small>
              </div>
              <span className="text-xs font-mono text-[#FFFFFF]">Wards 01–12</span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-[#A1A1AA] block">Severity Level</strong>
                <small className="text-[#A69B88]">Advisory · Level 2</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                Elevated Warning
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-[#A1A1AA] block">Evidence Source</strong>
                <small className="text-[#A69B88]">Ensemble Jev + STN-PAT-01 + Sentinel-1 SAR</small>
              </div>
              <span className="text-xs font-mono text-[#FFFFFF]">Triangulated</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[#A1A1AA]/12">
            <Button
              onClick={handleApprove}
              disabled={status === "AUTHORIZED & PUBLISHED"}
              className="text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Authorize & Publish
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={status === "REJECTED BY COMMANDER"}
              className="text-xs flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" /> Reject Advisory
            </Button>
          </div>
        </div>

        {/* Right: Approval Checklist */}
        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
            <h3 className="text-sm font-bold text-[#A1A1AA]">Supervisory Approval Checklist</h3>
            <span className="text-xs font-mono text-[#A69B88]">3 Steps</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFFFFF]/15 border border-[#FFFFFF]/30 grid place-items-center text-xs font-mono font-bold text-[#FFFFFF] shrink-0">
                01
              </div>
              <div>
                <strong className="text-xs font-bold text-[#FFFFFF] block">Evidence & Uncertainty Review</strong>
                <p className="text-xs text-[#A69B88] mt-0.5 leading-relaxed">
                  Confirm gauge observations, model ensemble 90% confidence spread, and Pre/Mid/Post-Run gate verdicts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFFFFF]/15 border border-[#FFFFFF]/30 grid place-items-center text-xs font-mono font-bold text-[#FFFFFF] shrink-0">
                02
              </div>
              <div>
                <strong className="text-xs font-bold text-[#FFFFFF] block">Jurisdiction & Ward Verification</strong>
                <p className="text-xs text-[#A69B88] mt-0.5 leading-relaxed">
                  Validate target geographical polygons and evacuation shelter readiness across affected wards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFFFFF]/15 border border-[#FFFFFF]/30 grid place-items-center text-xs font-mono font-bold text-[#FFFFFF] shrink-0">
                03
              </div>
              <div>
                <strong className="text-xs font-bold text-[#FFFFFF] block">Immutable Audit Signature</strong>
                <p className="text-xs text-[#A69B88] mt-0.5 leading-relaxed">
                  Sign supervisory decision record into the append-only operational compliance log.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
