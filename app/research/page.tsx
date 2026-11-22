import React from "react";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata = {
  title: "Research & Validation | SURAKSHA",
  description: "Show the evidence. Show the limits. Reproducible experiments, evaluations, and known limitations.",
};

export default function ResearchPage() {
  const researchRows = [
    {
      area: "Hydrological forecasting",
      evidence: "Time-split benchmark, horizon-wise NSE/RMSE errors, baseline comparison",
      state: "VALIDATION TRACK",
      stateType: "warning",
    },
    {
      area: "Geospatial inundation",
      evidence: "Sentinel-1 SAR reference extent, resolution, spatial overlap and limitations",
      state: "VALIDATION TRACK",
      stateType: "warning",
    },
    {
      area: "Consequence assessment",
      evidence: "Asset inventory provenance and threshold assumptions",
      state: "RESEARCH WORKFLOW",
      stateType: "neutral",
    },
    {
      area: "Supervisory gates",
      evidence: "Test cases, false-pass/false-stop analysis and traceability",
      state: "PROTOTYPE",
      stateType: "neutral",
    },
  ];

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">RESEARCH & VALIDATION</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#A1A1AA] tracking-tight">
            Show the evidence. Show the limits.
          </h1>
          <p className="text-base text-[#A69B88] mt-4 leading-relaxed">
            SURAKSHA is developed as a scientific research prototype. This page publishes reproducible evaluation methodology, NSE validation protocols, and known operational limitations.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FadeIn delay={0.1}>
          <div className="p-6 sm:p-8 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
            <h3 className="text-lg font-bold text-[#FFFFFF]">Evaluation Principles</h3>
            <ul className="space-y-2 text-xs text-[#A69B88]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] mt-1.5 shrink-0" />
                Record dataset name, time range, and spatial coverage.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] mt-1.5 shrink-0" />
                Separate training, validation, and test monsoon periods.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] mt-1.5 shrink-0" />
                Report persistence baselines alongside ensemble candidate models.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] mt-1.5 shrink-0" />
                Measure performance across both nominal and surge regimes.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] mt-1.5 shrink-0" />
                Document missing data and model failure cases transparently.
              </li>
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="p-6 sm:p-8 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
            <h3 className="text-lg font-bold text-[#FFFFFF]">What Is Published</h3>
            <ul className="space-y-2 text-xs text-[#A69B88]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A1A1AA] mt-1.5 shrink-0" />
                Forecast horizon (6h, 24h, 72h) and Nash-Sutcliffe Efficiency (NSE) definitions.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A1A1AA] mt-1.5 shrink-0" />
                Model version, configuration, and reproducibility notes.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A1A1AA] mt-1.5 shrink-0" />
                Observed-vs-predicted hydrograph plots and residual analysis.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A1A1AA] mt-1.5 shrink-0" />
                90% confidence intervals, limitations, and known data gaps.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A1A1AA] mt-1.5 shrink-0" />
                Supervisory gate audit logs for every simulation run.
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>

      {/* Validation Benchmark Table */}
      <FadeIn delay={0.3}>
        <div className="rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] p-6 space-y-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#A1A1AA]/15 text-[#A69B88] uppercase text-[10px]">
                  <th className="py-3 px-4">Research Area</th>
                  <th className="py-3 px-4">Evidence to Present</th>
                  <th className="py-3 px-4">Publication State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A1A1AA]/10">
                {researchRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#141414]/50">
                    <td className="py-3 px-4 font-bold text-[#FFFFFF] font-sans">{row.area}</td>
                    <td className="py-3 px-4 text-[#A1A1AA]">{row.evidence}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          row.stateType === "warning"
                            ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                            : "bg-[#141414] text-[#A1A1AA] border-[#A1A1AA]/20"
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
        <div className="notice">
          Every displayed metric requires a linked evaluation protocol and peer-review traceability.
        </div>
      </FadeIn>
    </div>
  );
}
