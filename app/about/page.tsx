import React from "react";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata = {
  title: "About the Project | SURAKSHA",
  description: "A decision-support layer for a changing river system. Scope, aims, and research boundaries.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">ABOUT THE PROJECT</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#D8CBB3] tracking-tight">
            A decision-support layer for a changing river system.
          </h1>
          <p className="text-base text-[#A69B88] mt-4 leading-relaxed">
            SURAKSHA is a scientific flood-intelligence and disaster-response research project focused on connecting hydrological evidence, geospatial context, and human-governed response workflows.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FadeIn delay={0.1}>
          <div className="p-6 sm:p-8 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-3">
            <div className="eyebrow">OUR PURPOSE</div>
            <h3 className="text-xl font-bold text-[#EDE4D3]">
              Make complex flood information easier to verify and act upon.
            </h3>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Observations, forecasts, satellite evidence, and response information often live in separate systems. SURAKSHA explores how these signals can be organised into a traceable workflow that helps operators and citizens understand conditions, possible consequences, and where human attention is needed.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="p-6 sm:p-8 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-3">
            <div className="eyebrow">CURRENT SCOPE</div>
            <h3 className="text-xl font-bold text-[#EDE4D3]">
              Flood-first, evidence-led development.
            </h3>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              The active implementation focuses on riverine flooding along the Ganga / Patna / Bihar study corridor. Upstream catchment and tributary indicators are integrated with explicit data-provenance badges.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="p-6 sm:p-8 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
            <h3 className="text-lg font-bold text-[#EDE4D3]">What SURAKSHA Aims to Do</h3>
            <ul className="space-y-2 text-xs text-[#A69B88]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-1.5 shrink-0" />
                Organise hydrological and geospatial evidence with clear provenance.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-1.5 shrink-0" />
                Expose forecast uncertainty and Pre/Mid/Post-Run gate checks.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-1.5 shrink-0" />
                Connect predicted conditions with ward-level consequence estimates.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-1.5 shrink-0" />
                Support human-approved OASIS CAP v1.2 advisories and incident workflows.
              </li>
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="p-6 sm:p-8 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
            <h3 className="text-lg font-bold text-[#EDE4D3]">What SURAKSHA Does Not Claim</h3>
            <ul className="space-y-2 text-xs text-[#A69B88]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 shrink-0" />
                It is not an official government warning authority.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 shrink-0" />
                It does not autonomously publish public emergency alerts without human sign-off.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 shrink-0" />
                It never presents illustrative or synthetic maps as live flood observations.
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
