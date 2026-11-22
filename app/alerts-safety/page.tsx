import React from "react";
import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Alerts & Safety Centre | SURAKSHA",
  description: "Clear information and responsible warning workflows for flood intelligence.",
};

export default function AlertsSafetyPage() {
  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      {/* Page Hero */}
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">ALERTS & SAFETY CENTRE</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#A1A1AA] tracking-tight">
            Clear information. Responsible warning workflows.
          </h1>
          <p className="text-base text-[#A69B88] mt-4 leading-relaxed">
            SURAKSHA organises draft OASIS CAP v1.2 recommendations and human-approved alert records. It does not replace authorised government warning channels or emergency services.
          </p>
        </div>
      </FadeIn>

      {/* Notice Banner */}
      <div className="notice">
        <strong className="text-[#FFFFFF]">Important:</strong> The interface labels below are product UI labels for this research prototype. Always follow instructions from authorised government emergency management authorities.
      </div>

      {/* 3 Tier Cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="p-6 sm:p-7 rounded-2xl border border-white/10 bg-[#0A0A0A]/80 space-y-3 hover:border-[#FFFFFF]/40 transition-colors">
            <div className="eyebrow">LEVEL 01 · INFORMATION</div>
            <h3 className="text-xl font-bold text-[#FFFFFF]">Advisory</h3>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              General preparedness information or a low-urgency situational update. Content identifies source, severity, and issue timestamp.
            </p>
          </article>

          <article className="p-6 sm:p-7 rounded-xl border border-[#F59E0B]/30 bg-[#0A0A0A] space-y-3">
            <div className="text-[11px] font-mono font-bold text-[#F59E0B] uppercase tracking-wider">
              LEVEL 02 · ATTENTION
            </div>
            <h3 className="text-xl font-bold text-[#FFFFFF]">Watch</h3>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              River stage is approaching the 50.50 m warning mark. The interface explains why the status is shown and what forecast uncertainty remains.
            </p>
          </article>

          <article className="p-6 sm:p-7 rounded-xl border border-[#EF4444]/30 bg-[#0A0A0A] space-y-3">
            <div className="text-[11px] font-mono font-bold text-[#EF4444] uppercase tracking-wider">
              LEVEL 03 · EMERGENCY ACTION
            </div>
            <h3 className="text-xl font-bold text-[#FFFFFF]">Warning / Critical</h3>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              High-priority published messages issued only through a human commander-authorised workflow when stage approaches or exceeds 51.80 m.
            </p>
          </article>
        </div>
      </FadeIn>

      {/* Two-Column Info Panels */}
      <FadeIn delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-3">
            <h3 className="text-lg font-bold text-[#FFFFFF]">Alert Governance Lifecycle</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed font-mono">
              Draft recommendation → Pre/Mid/Post gate check → Commander approval → Publication → Citizen delivery log.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-3">
            <h3 className="text-lg font-bold text-[#FFFFFF]">Accessible Notification Controls</h3>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Multi-channel support: persistent visual cues, audible sound, push, and vibration where enabled, with full reduced-motion accommodation.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* CTA Band */}
      <FadeIn delay={0.3}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 rounded-xl border border-[#A1A1AA]/20 bg-[#0A0A0A]">
          <div>
            <div className="eyebrow">EXPLORE SIMULATION</div>
            <h2 className="text-2xl font-extrabold text-[#FFFFFF] mt-1">
              Test a simulated warning flow in the Demo Lab.
            </h2>
            <p className="text-xs text-[#A69B88] mt-1">
              The interactive demo runs on synthetic data and will never broadcast live public alerts.
            </p>
          </div>
          <Link
            href="/demo-lab"
            className="btn primary shrink-0 self-start sm:self-auto flex items-center gap-2"
          >
            Open Simulation Lab <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
