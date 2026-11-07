import React from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Research & Validation | SURAKSHA",
  description: "Show the evidence. Show the limits. Reproducible experiments, evaluations, and known limitations.",
};

export default function ResearchPage() {
  const researchRows = [
    {
      area: "Hydrological forecasting",
      evidence: "Time-split benchmark, horizon-wise errors, baseline comparison",
      state: "Needs validation",
      stateType: "warning",
    },
    {
      area: "Geospatial inundation",
      evidence: "Reference extent, resolution, spatial overlap and limitations",
      state: "Needs validation",
      stateType: "warning",
    },
    {
      area: "Consequence assessment",
      evidence: "Asset inventory provenance and threshold assumptions",
      state: "Research workflow",
      stateType: "neutral",
    },
    {
      area: "Supervisory gates",
      evidence: "Test cases, false-pass/false-stop analysis and traceability",
      state: "Prototype",
      stateType: "neutral",
    },
  ];

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">Research & Validation</div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#f0f7f6] tracking-tight">
            Show the evidence. Show the limits.
          </h1>
          <p className="text-base text-[#9bb2af] mt-4 leading-relaxed">
            SURAKSHA is being developed as a research prototype. This page is designed to publish reproducible experiments, model evaluations and known limitations — not unsupported performance claims.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FadeIn delay={0.1}>
          <div className="p-6 sm:p-8 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
            <h3 className="text-lg font-bold text-white">Evaluation principles</h3>
            <ul className="space-y-2 text-xs text-[#9bb2af]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] mt-1.5 shrink-0" />
                Record dataset name, time range and spatial coverage.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] mt-1.5 shrink-0" />
                Separate training, validation and test periods.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] mt-1.5 shrink-0" />
                Report baselines alongside candidate models.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] mt-1.5 shrink-0" />
                Measure performance across normal and extreme regimes.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] mt-1.5 shrink-0" />
                Document missing data and model failure cases.
              </li>
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="p-6 sm:p-8 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
            <h3 className="text-lg font-bold text-white">What should be published</h3>
            <ul className="space-y-2 text-xs text-[#9bb2af]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-1.5 shrink-0" />
                Forecast horizon and evaluation metric definitions.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-1.5 shrink-0" />
                Model version, configuration and reproducibility notes.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-1.5 shrink-0" />
                Observed-vs-predicted plots and residual analysis.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-1.5 shrink-0" />
                Uncertainty, limitations and known data gaps.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-1.5 shrink-0" />
                Independent review status where available.
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>

      {/* Validation Benchmark Table */}
      <FadeIn delay={0.3}>
        <div className="rounded-2xl border border-[#2e4952]/40 bg-[#0f171b]/80 p-6 space-y-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2e4952]/50 text-[#9bb2af]">
                  <th className="py-3 px-4">Research Area</th>
                  <th className="py-3 px-4">Evidence to Present</th>
                  <th className="py-3 px-4">Publication State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c2e35]">
                {researchRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#142329]/50">
                    <td className="py-3 px-4 font-bold text-white font-sans">{row.area}</td>
                    <td className="py-3 px-4 text-[#9bb2af]">{row.evidence}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          row.stateType === "warning"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-[#142329] text-[#c7dbd7] border-[#2e4952]"
                        }`}
                      >
                        {row.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.4}>
        <div className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#0f171b]/80 text-xs text-[#9bb2af] leading-relaxed">
          Every displayed metric requires a linked evaluation protocol and peer-review traceability.
        </div>
      </FadeIn>
    </div>
  );
}
