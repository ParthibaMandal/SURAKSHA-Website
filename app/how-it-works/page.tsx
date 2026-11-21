import React from "react";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata = {
  title: "Capabilities & Workflow | SURAKSHA",
  description: "Evidence in. Checks throughout. Context for action. The 6-step analytical workflow.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      no: "01",
      title: "Collect Observations",
      desc: "Read supported river, rainfall, satellite, and upstream datasets. Each record retains source, units, timestamp, and quality metadata.",
    },
    {
      no: "02",
      title: "Validate Operating Context (Pre-Run Gate)",
      desc: "Pre-Run Gate checks data quality, anomalies, sensor conflicts, and degraded-mode conditions before forecasting.",
    },
    {
      no: "03",
      title: "Execute Hydrological & Spatial Analysis",
      desc: "The flood pipeline executes approved forecasting, geospatial, risk, and consequence modules.",
    },
    {
      no: "04",
      title: "Compare & Challenge Results (Mid-Run Gate)",
      desc: "Mid-Run Gate examines model disagreement, mass conservation, and whether claims are supported by available evidence.",
    },
    {
      no: "05",
      title: "Verify Output & Consequence (Post-Run Gate)",
      desc: "Post-Run Gate triangulates evidence and records confidence intervals, limitations, or human-review requirements.",
    },
    {
      no: "06",
      title: "Prepare Supervised Response Information",
      desc: "The system generates draft OASIS CAP v1.2 advisories and SITREPs. Publication of public alerts requires human commander approval.",
    },
  ];

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">SYSTEM WORKFLOW</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#D8CBB3] tracking-tight">
            Evidence in. Checks throughout. Context for action.
          </h1>
          <p className="text-base text-[#A69B88] mt-4 leading-relaxed">
            SURAKSHA follows a controlled analytical workflow. Scientific calculations and alert decisions remain governed by explicit physical invariants and authorised human personnel.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((st, idx) => (
          <FadeIn key={idx} delay={idx * 0.08}>
            <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] flex items-start gap-4">
              <span className="text-xl font-mono font-bold text-[#06B6D4] shrink-0 bg-[#06B6D4]/15 w-11 h-11 rounded-xl border border-[#06B6D4]/30 grid place-items-center">
                {st.no}
              </span>
              <div>
                <h3 className="text-base font-bold text-[#EDE4D3] mb-1">{st.title}</h3>
                <p className="text-xs text-[#A69B88] leading-relaxed">{st.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.3}>
        <div className="notice">
          Event lifecycle (<span className="font-mono text-[#EDE4D3]">Prepare, Respond, Recover</span>) is separate from analytical verification gates (<span className="font-mono text-[#EDE4D3]">Pre-Run, Mid-Run, Post-Run</span>). The interface displays these as distinct operational dimensions.
        </div>
      </FadeIn>
    </div>
  );
}
