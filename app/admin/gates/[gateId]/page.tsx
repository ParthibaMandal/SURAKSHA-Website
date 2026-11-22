"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GateConfig {
  name: string;
  desc: string;
  state: string;
  checks: [string, string, string][];
  decision: string;
  note: string;
}

const GATES_DATA: Record<string, GateConfig> = {
  "pre-run": {
    name: "Pre-Run Gate · Input Quality & Sensor Integrity",
    desc: "Validate input quality, sensor completeness and operating boundary conditions before numerical execution.",
    state: "INPUT REVIEW · PASSED",
    checks: [
      ["Telemetry quality", "Missing values, units and timestamp continuity checks", "Pass"],
      ["Sensor consistency", "Detect conflicting or implausible gauge readings", "Pass"],
      ["Data regime", "Classify normal, rapid rise, heavy rainfall or degraded mode", "Classify"],
      ["Fallback readiness", "Verify approved degraded-mode fallback strategies", "Ready"],
    ],
    decision: "CONTINUE / APPROVED FALLBACK / HUMAN REVIEW",
    note: "Pre-Run Gate blocks execution when required evidence is missing or sensor readings conflict beyond tolerance.",
  },
  "mid-run": {
    name: "Mid-Run Gate · Forecast Committee & Physics Verification",
    desc: "Review forecast committee output, mass conservation, model disagreement and evidence support.",
    state: "MODEL REVIEW · WATCH",
    checks: [
      ["Forecast committee", "Compare approved model outputs across 6h, 24h and 72h horizons", "Review"],
      ["Model disagreement", "Inspect ensemble spread and conflicting predictions", "Review"],
      ["Claim support", "Check forecast and inundation claims against physical evidence", "Verify"],
      ["Escalation", "Flag divergence (>0.45m) or unsupported claims for human review", "Escalate"],
    ],
    decision: "CONTINUE / DISCOUNT CONFIDENCE / HUMAN ESCALATION",
    note: "Mid-Run Gate highlights model version, forecast horizon, input window and ensemble spread metrics.",
  },
  "post-run": {
    name: "Post-Run Gate · Evidence Triangulation & Human Approval",
    desc: "Triangulate downstream outputs against available terrain and satellite evidence and record confidence.",
    state: "EVIDENCE REVIEW · VERIFIED",
    checks: [
      ["Satellite corroboration", "Compare available SAR observations and derived flood extent", "Review"],
      ["Forecast vs risk", "Check consistency between stage forecast, risk and impact claims", "Verify"],
      ["External evidence", "Record authoritative corroboration where supplied", "Verify"],
      ["Human approval", "Require commander sign-off for unresolved or high-impact claims", "Required"],
    ],
    decision: "ACCEPT WITH CONFIDENCE / DISCOUNT / HUMAN REVIEW",
    note: "Post-Run Gate ensures every advisory claim is substantiated by physical evidence before reaching operators.",
  },
  "gate-1": {
    name: "Pre-Run Gate (Gate 01)",
    desc: "Validate input quality and operating conditions before analysis.",
    state: "INPUT REVIEW",
    checks: [
      ["Telemetry quality", "Missing values, units and timestamp checks", "Pass"],
      ["Sensor consistency", "Detect conflicting or implausible readings", "Pass"],
      ["Data regime", "Normal, rapid rise, heavy rainfall or degraded mode", "Classify"],
      ["Fallback readiness", "Check approved degraded-mode strategies", "Ready"],
    ],
    decision: "CONTINUE / APPROVED FALLBACK / HUMAN REVIEW",
    note: "This gate blocks execution when required evidence is missing or sensor readings conflict.",
  },
  "gate-2": {
    name: "Mid-Run Gate (Gate 02)",
    desc: "Review forecast committee output, model disagreement and evidence support.",
    state: "MODEL REVIEW",
    checks: [
      ["Forecast committee", "Compare approved model outputs and horizons", "Review"],
      ["Model disagreement", "Inspect spread and conflicting predictions", "Review"],
      ["Claim support", "Check forecast and risk claims against evidence", "Verify"],
      ["Escalation", "Flag disagreement or unsupported claims for review", "Escalate"],
    ],
    decision: "CONTINUE / DISCOUNT CONFIDENCE / HUMAN ESCALATION",
    note: "The UI highlights model version, forecast horizon, input window and spread metrics.",
  },
  "gate-3": {
    name: "Post-Run Gate (Gate 03)",
    desc: "Triangulate outputs against available evidence and record confidence.",
    state: "EVIDENCE REVIEW",
    checks: [
      ["Satellite corroboration", "Compare available satellite observations and derived extent", "Review"],
      ["Forecast vs risk", "Check consistency between forecast, risk and impact claims", "Verify"],
      ["External evidence", "Record authoritative corroboration where supplied", "Verify"],
      ["Human approval", "Require review for unresolved or high-impact claims", "Required"],
    ],
    decision: "ACCEPT WITH CONFIDENCE / DISCOUNT / HUMAN REVIEW",
    note: "Post-Run Gate guarantees that any external claim is substantiated by physical evidence.",
  },
};

export default function GateDetailPage({
  params,
}: {
  params: { gateId: string };
}) {
  const data = GATES_DATA[params.gateId] || GATES_DATA["pre-run"];
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#FFFFFF]/50 text-xs font-mono text-[#A1A1AA] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" /> {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-[#A69B88] hover:text-[#FFFFFF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Operations Overview
        </Link>

        {/* Gate Quick Switcher */}
        <div className="inline-flex rounded-lg border border-[#A1A1AA]/16 bg-[#0A0A0A] p-1 gap-1">
          {[
            { id: "pre-run", label: "01 Pre-Run" },
            { id: "mid-run", label: "02 Mid-Run" },
            { id: "post-run", label: "03 Post-Run" },
          ].map((g) => (
            <Link
              key={g.id}
              href={`/admin/gates/${g.id}`}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-colors ${
                params.gateId === g.id
                  ? "bg-[#FFFFFF] text-white"
                  : "text-[#A69B88] hover:text-[#A1A1AA]"
              }`}
            >
              {g.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#A1A1AA]/14">
        <div>
          <div className="eyebrow">SCIENTIFIC ANALYTICS GATES</div>
          <h1 className="text-3xl font-extrabold text-[#A1A1AA]">{data.name}</h1>
          <p className="text-xs text-[#A69B88] mt-1">{data.desc}</p>
        </div>
        <span className="pill self-start sm:self-auto">
          <i className="dot blue" /> {data.state}
        </span>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Gate Execution</span>
            <Activity className="w-3.5 h-3.5 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#A1A1AA]">Active</div>
          <div className="text-[11px] font-mono text-[#FFFFFF]">Automated pipeline check</div>
        </div>

        <div className="p-4 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Checks Performed</span>
            <Shield className="w-3.5 h-3.5 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#A1A1AA]">04 / 04</div>
          <div className="text-[11px] font-mono text-[#A69B88]">Invariants evaluated</div>
        </div>

        <div className="p-4 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Supervisory State</span>
            <Activity className="w-3.5 h-3.5 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#FFFFFF]">Nominal</div>
          <div className="text-[11px] font-mono text-[#A69B88]">Sample benchmark</div>
        </div>

        <div className="p-4 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Evidence Score</span>
            <Shield className="w-3.5 h-3.5 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#A1A1AA]">0.94</div>
          <div className="text-[11px] font-mono text-[#FFFFFF]">High confidence</div>
        </div>
      </div>

      {/* Two Columns: Gate checks vs Decision Contract */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gate Checks */}
        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/14">
            <h3 className="text-sm font-bold text-[#A1A1AA]">Verification Invariants</h3>
            <span className="text-xs font-mono text-[#FFFFFF]">4 Invariants</span>
          </div>

          <div className="divide-y divide-[#A1A1AA]/12">
            {data.checks.map(([t, d, s], idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-[#A1A1AA] block">{t}</strong>
                  <small className="text-[11px] text-[#A69B88]">{d}</small>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                    s === "Pass" || s === "Ready" || s === "Verify"
                      ? "bg-[#FFFFFF]/18 text-[#FFFFFF] border-[#FFFFFF]/35"
                      : "bg-[#F59E0B]/18 text-[#FBBF24] border-[#F59E0B]/40"
                  }`}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Contract */}
        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/14">
              <h3 className="text-sm font-bold text-[#A1A1AA]">Supervisory Decision Contract</h3>
              <span className="text-xs font-mono text-[#A69B88]">Policy Rule</span>
            </div>

            <div className="p-4 rounded-lg border border-[#A1A1AA]/15 bg-[#000000] text-xs text-[#A1A1AA] leading-relaxed">
              {data.note}
            </div>

            <div className="pt-2">
              <div className="text-xs font-bold font-mono text-[#A1A1AA]">
                Permitted Gate Outcomes
              </div>
              <p className="text-xs font-mono text-[#FFFFFF] mt-1.5 leading-relaxed bg-[#000000] p-3 rounded-lg border border-[#A1A1AA]/12">
                {data.decision}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#A1A1AA]/14">
            <Button
              onClick={() => showToast(`${data.name} verification check executed.`)}
              className="w-full text-xs font-bold"
            >
              Execute Gate Verification Check
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
