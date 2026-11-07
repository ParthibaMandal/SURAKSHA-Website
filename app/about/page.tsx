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
          <div className="eyebrow">About the project</div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#f0f7f6] tracking-tight">
            A decision-support layer for a changing river system.
          </h1>
          <p className="text-base text-[#9bb2af] mt-4 leading-relaxed">
            SURAKSHA is an AI-assisted flood intelligence research project focused on connecting hydrological evidence, geospatial context and response workflows.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FadeIn delay={0.1}>
          <div className="p-6 sm:p-8 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
            <div className="eyebrow">Our Purpose</div>
            <h3 className="text-xl font-bold text-white">Make complex flood information easier to interpret.</h3>
            <p className="text-xs text-[#9bb2af] leading-relaxed">
              Observations, forecasts, satellite evidence and response information often live in separate systems. SURAKSHA explores how these signals can be organised into a traceable workflow that helps users understand conditions, possible consequences and where human attention is needed.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="p-6 sm:p-8 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
            <div className="eyebrow">Current Scope</div>
            <h3 className="text-xl font-bold text-white">Flood-first, evidence-led development.</h3>
            <p className="text-xs text-[#9bb2af] leading-relaxed">
              The active implementation focuses on riverine flooding, especially the Ganga / Patna / Bihar study context. Upstream catchment and glacier-related indicators are research inputs where suitable sources support them. The website should not imply nationwide operational coverage.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="p-6 sm:p-8 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
            <h3 className="text-lg font-bold text-white">What SURAKSHA aims to do</h3>
            <ul className="space-y-2 text-xs text-[#9bb2af]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] mt-1.5 shrink-0" />
                Organise hydrological and geospatial evidence.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] mt-1.5 shrink-0" />
                Expose forecast and model uncertainty.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] mt-1.5 shrink-0" />
                Connect predicted conditions with potential consequences.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] mt-1.5 shrink-0" />
                Support human-reviewed advisories and incident workflows.
              </li>
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="p-6 sm:p-8 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
            <h3 className="text-lg font-bold text-white">What SURAKSHA does not claim</h3>
            <ul className="space-y-2 text-xs text-[#9bb2af]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] mt-1.5 shrink-0" />
                It is not an official government alert service.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] mt-1.5 shrink-0" />
                It does not guarantee flood prediction or prevent losses.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] mt-1.5 shrink-0" />
                It does not autonomously approve official warnings.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] mt-1.5 shrink-0" />
                Experimental metrics are not proof of field readiness.
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

