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
    name: "Pre-Run Gate",
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
  "mid-run": {
    name: "Mid-Run Gate",
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
  "post-run": {
    name: "Post-Run Gate",
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
  // Aliases
  "gate-1": {
    name: "Pre-Run Gate (Gate 1)",
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
    name: "Mid-Run Gate (Gate 2)",
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
    name: "Post-Run Gate (Gate 3)",
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
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0f171b] border border-[#5eead4]/40 text-xs font-mono text-[#5eead4] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#5eead4]" /> {toast}
        </div>
      )}

      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-xs text-[#9bb2af] hover:text-[#5eead4] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Operations Overview
      </Link>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e4952]/30">
        <div>
          <div className="eyebrow">ANALYTICS GATES</div>
          <h1 className="text-3xl font-black text-white">{data.name}</h1>
          <p className="text-xs text-[#9bb2af] mt-1">{data.desc}</p>
        </div>
        <span className="pill self-start sm:self-auto">
          <i className="dot amber" /> {data.state}
        </span>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Gate execution</span>
            <Activity className="w-3.5 h-3.5 text-[#5eead4]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">Active</div>
          <div className="text-[11px] text-[#5eead4]">Pipeline stage 01</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Checks performed</span>
            <Shield className="w-3.5 h-3.5 text-[#5eead4]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">04</div>
          <div className="text-[11px] text-[#5eead4]">Passed 4 of 4</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Supervisory state</span>
            <Activity className="w-3.5 h-3.5 text-[#5eead4]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#5eead4]">Green</div>
          <div className="text-[11px] text-[#859e9a]">Nominal operation</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Evidence score</span>
            <Shield className="w-3.5 h-3.5 text-[#5eead4]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">0.94</div>
          <div className="text-[11px] text-[#5eead4]">High confidence</div>
        </div>
      </div>

      {/* Two Columns: Gate checks vs Decision Contract */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gate Checks */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Gate checks</h3>
            <span className="text-xs font-mono text-teal-400">4 Invariants</span>
          </div>

          <div className="divide-y divide-[#2e4952]/30">
            {data.checks.map(([t, d, s], idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-white block">{t}</strong>
                  <small className="text-[11px] text-[#859e9a]">{d}</small>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    s === "Pass" || s === "Ready"
                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Contract */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
              <h3 className="text-sm font-bold text-white">Decision Contract</h3>
              <span className="text-xs font-mono text-[#627b77]">Policy</span>
            </div>

            <div className="notice">{data.note}</div>

            <div className="pt-2">
              <div className="text-xs font-bold font-mono text-[#a4beba]">Possible Outcomes</div>
              <p className="text-xs font-mono text-[#859e9a] mt-1 leading-relaxed">
                {data.decision}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2e4952]/30">
            <Button
              onClick={() => showToast("Gate check execution initiated.")}
              className="w-full text-xs font-bold"
            >
              Run gate check
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
