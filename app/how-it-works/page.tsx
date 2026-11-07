import React from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "How It Works | SURAKSHA",
  description: "Evidence in. Checks throughout. Context for action. The 6-step analytical workflow.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      no: "01",
      title: "Collect observations",
      desc: "Read supported river, rainfall, satellite and upstream datasets. Each record retains source, units, timestamp and quality metadata.",
    },
    {
      no: "02",
      title: "Validate the operating context",
      desc: "Pre-Run Gate checks data quality, anomalies, sensor conflicts and degraded-mode conditions.",
    },
    {
      no: "03",
      title: "Run analysis",
      desc: "The flood pipeline executes approved forecasting, geospatial, risk and consequence modules.",
    },
    {
      no: "04",
      title: "Compare and challenge results",
      desc: "Mid-Run Gate examines model disagreement and whether claims are supported by available evidence.",
    },
    {
      no: "05",
      title: "Verify the output",
      desc: "Post-Run Gate triangulates evidence and records confidence, limitations or human-review needs.",
    },
    {
      no: "06",
      title: "Prepare response information",
      desc: "The system generates draft advisories and SITREPs. Publication of official alerts requires authorised approval.",
    },
  ];

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">System Workflow</div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#f0f7f6] tracking-tight">
            Evidence in. Checks throughout. Context for action.
          </h1>
          <p className="text-base text-[#9bb2af] mt-4 leading-relaxed">
            SURAKSHA follows a controlled analytical workflow. The AI layer helps explain validated results, while scientific calculations and alert decisions remain governed by explicit rules and authorised personnel.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((st, idx) => (
          <FadeIn key={idx} delay={idx * 0.1}>
            <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] flex items-start gap-4">
              <span className="text-2xl font-mono font-black text-[#5eead4] shrink-0 bg-[#5eead4]/10 w-12 h-12 rounded-xl border border-[#5eead4]/30 grid place-items-center">
                {st.no}
              </span>
              <div>
                <h3 className="text-base font-bold text-white mb-1">{st.title}</h3>
                <p className="text-xs text-[#9bb2af] leading-relaxed">{st.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.3}>
        <div className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#0f171b]/80 text-xs text-[#9bb2af] leading-relaxed">
          Event lifecycle (pre-event, active-event, post-event) is separate from analytical gates (Pre-Run, Mid-Run, Post-Run). The UI displays these as distinct dimensions.
        </div>
      </FadeIn>
    </div>
  );
}
