"use client";

import React from "react";
import { Shield } from "lucide-react";

export default function AdminApprovalsPage() {
  return (
    <div className="space-y-6">
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
            Prototype only · no advisory can be approved or published from this page.
          </strong>
          <p className="text-[#A69B88]">
            A verified, audited write path and dispatch integration are not connected. Follow official local guidance for real conditions.
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
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
            >
              SAMPLE · NOT CONNECTED
            </span>
          </div>

          <div className="eyebrow">CAP-2026-PAT-09 · SYNTHETIC</div>
          <h2 className="text-xl font-bold text-[#FFFFFF] mt-1 mb-2">
            River Stage Advisory · Patna Sector
          </h2>
          <p className="text-xs text-[#A69B88] leading-relaxed">
            Synthetic sample forecast approaches the 47.60 m warning reference within 24 hours. Follow current official local guidance for real conditions.
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
            <small className="text-[#A69B88]">Illustrative sample label</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                Elevated Warning
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-[#A1A1AA] block">Evidence Source</strong>
                <small className="text-[#A69B88]">Synthetic fixture only · no corroborating source attached</small>
              </div>
              <span className="text-xs font-mono text-[#A69B88]">Not verified</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#A1A1AA]/12">
            <p className="rounded-lg border border-[#A1A1AA]/15 bg-[#000000] p-3 text-xs text-[#A69B88]">
              Review controls are unavailable until alert decisions can be persisted with least-privilege database policies and an audit record.
            </p>
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
