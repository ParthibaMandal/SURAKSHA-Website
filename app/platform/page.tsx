import React from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { TiltCard } from "@/components/motion/TiltCard";
import { Droplets, Activity, Map, Layers, Shield, FileText } from "lucide-react";

export const metadata = {
  title: "Platform Capabilities | SURAKSHA",
  description: "A connected view of flood intelligence across ingestion, forecasting, geospatial analysis, and supervisory checks.",
};

export default function PlatformPage() {
  const capabilities = [
    {
      icon: Droplets,
      title: "Hydrological ingestion",
      desc: "Collect and normalise station observations, rainfall and supported upstream signals.",
    },
    {
      icon: Activity,
      title: "Forecasting committee",
      desc: "Compare model outputs, horizons and disagreement without hiding uncertainty.",
    },
    {
      icon: Map,
      title: "Geospatial intelligence",
      desc: "Bring terrain, catchment, satellite and inundation analysis into spatial context.",
    },
    {
      icon: Layers,
      title: "Consequence assessment",
      desc: "Relate potential flood extent to exposed assets and infrastructure where data exists.",
    },
    {
      icon: Shield,
      title: "Supervisory gates",
      desc: "Review data quality, model execution and evidence consistency at three checkpoints.",
    },
    {
      icon: FileText,
      title: "Response intelligence",
      desc: "Prepare draft advisories, SITREPs and structured incident information for review.",
    },
  ];

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">Platform Capabilities</div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#f0f7f6] tracking-tight">
            A connected view of flood intelligence.
          </h1>
          <p className="text-base text-[#9bb2af] mt-4 leading-relaxed">
            The platform is organised around evidence intake, analytical checks, spatial understanding and response-oriented outputs. Each capability is displayed with provenance and readiness context.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <FadeIn key={idx} delay={idx * 0.1}>
              <TiltCard className="h-full">
                <div className="w-10 h-10 rounded-xl bg-[#5eead4]/10 border border-[#5eead4]/30 flex items-center justify-center text-[#5eead4] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{cap.title}</h3>
                <p className="text-xs text-[#9bb2af] leading-relaxed">{cap.desc}</p>
              </TiltCard>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.3}>
        <div className="p-4 rounded-xl border border-[#2e4952]/40 bg-[#0f171b]/80 text-xs text-[#9bb2af] leading-relaxed">
          Capability availability depends on verified data sources, runtime configuration and model validation. The public website distinguishes implemented, experimental and planned modules.
        </div>
      </FadeIn>
    </div>
  );
}
