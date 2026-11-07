import React from "react";
import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { ChevronRight, ShieldAlert, Radio, BellRing, ArrowRight } from "lucide-react";

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
          <div className="eyebrow">Alerts & safety centre</div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#f0f7f6] tracking-tight">
            Clear information. Responsible warning workflows.
          </h1>
          <p className="text-base text-[#9bb2af] mt-4 leading-relaxed">
            SURAKSHA organises draft recommendations and published alert records. It does not replace authorised government warning channels or emergency services.
          </p>
        </div>
      </FadeIn>

      {/* Notice Banner */}
      <div className="notice">
        <strong>Important:</strong> The interface labels below are product UI labels for this prototype. Always follow instructions from authorised emergency management authorities.
      </div>

      {/* 3 Tier Cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="card p-6 sm:p-7 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3 relative group hover:border-[#5eead4]/40 transition-colors">
            <div className="eyebrow">01 · INFORMATION</div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#5eead4] transition-colors">
              Advisory
            </h3>
            <p className="text-xs text-[#9bb2af] leading-relaxed">
              General preparedness information or a low-urgency situational update. Content identifies source, severity and issue time.
            </p>
          </article>

          <article className="card p-6 sm:p-7 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3 relative group hover:border-[#fbbf24]/40 transition-colors">
            <div className="eyebrow">02 · ATTENTION</div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#fbbf24] transition-colors">
              Watch
            </h3>
            <p className="text-xs text-[#9bb2af] leading-relaxed">
              Conditions merit closer monitoring. The interface explains why the status is shown and what remains uncertain.
            </p>
          </article>

          <article className="card p-6 sm:p-7 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3 relative group hover:border-[#f87171]/40 transition-colors">
            <div className="eyebrow">03 · ACTION</div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#f87171] transition-colors">
              Warning / Critical
            </h3>
            <p className="text-xs text-[#9bb2af] leading-relaxed">
              High-priority published messages issued only through an authorised workflow with clear attribution and timestamps.
            </p>
          </article>
        </div>
      </FadeIn>

      {/* Two-Column Info Panels */}
      <FadeIn delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
            <h3 className="text-lg font-bold text-white">Alert lifecycle</h3>
            <p className="text-xs text-[#9bb2af] leading-relaxed font-mono">
              Draft recommendation → review → approval → publication → notification attempts → delivery evidence.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
            <h3 className="text-lg font-bold text-white">Accessible notification controls</h3>
            <p className="text-xs text-[#9bb2af] leading-relaxed">
              Multi-channel support: persistent visual cues, sound, push and vibration where enabled, with full reduced-motion accommodation.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* CTA Band */}
      <FadeIn delay={0.3}>
        <div className="cta-band flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 rounded-2xl border border-[#2e4952]/40 bg-gradient-to-r from-[#0f1d22] to-[#0a1518]">
          <div>
            <div className="eyebrow">Explore Simulation</div>
            <h2 className="text-2xl font-black text-white mt-1">Test a simulated warning flow.</h2>
            <p className="text-xs text-[#9bb2af] mt-1">
              The interactive demo runs on synthetic data and will not send live alerts.
            </p>
          </div>
          <Link
            href="/demo-lab"
            className="btn primary shrink-0 self-start sm:self-auto flex items-center gap-2"
          >
            Open demo lab <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
