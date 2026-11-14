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
      title: "Hydrological Ingestion",
      desc: "Collect and normalise station observations, rainfall grids, and supported upstream signals with explicit freshness checks.",
    },
    {
      icon: Activity,
      title: "Forecasting Committee",
      desc: "Compare ensemble model outputs, 6h/24h/72h horizons, and disagreement bounds without hiding uncertainty.",
    },
    {
      icon: Map,
      title: "Geospatial Intelligence",
      desc: "Bring terrain contours, catchment topography, Sentinel-1 SAR water masks, and inundation envelopes into spatial context.",
    },
    {
      icon: Layers,
      title: "Consequence Assessment",
      desc: "Relate predicted flood extent to exposed wards, embankment freeboard, and shelter readiness where data exists.",
    },
    {
      icon: Shield,
      title: "Supervisory Gates",
      desc: "Review data quality, model execution, and evidence consistency at Pre-Run, Mid-Run, and Post-Run checkpoints.",
    },
    {
      icon: FileText,
      title: "Response Intelligence",
      desc: "Prepare OASIS CAP v1.2 draft advisories, SITREP dossiers, and structured incident information for human commander review.",
    },
  ];

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">PLATFORM CAPABILITIES</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#D8CBB3] tracking-tight">
            A connected view of flood intelligence.
          </h1>
          <p className="text-base text-[#A69B88] mt-4 leading-relaxed">
            The platform is organised around evidence intake, analytical checks, spatial understanding, and response-oriented outputs. Each capability is displayed with provenance and readiness context.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <FadeIn key={idx} delay={idx * 0.08}>
              <TiltCard className="h-full">
                <div className="w-10 h-10 rounded-xl bg-[#2F6BFF]/15 border border-[#2F6BFF]/30 flex items-center justify-center text-[#2F6BFF] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#EDE4D3] mb-2">{cap.title}</h3>
                <p className="text-xs text-[#A69B88] leading-relaxed">{cap.desc}</p>
              </TiltCard>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.3}>
        <div className="notice">
          Capability availability depends on verified data sources, runtime configuration, and model validation. The platform explicitly distinguishes <span className="font-mono text-[#EDE4D3]">LIVE</span>, <span className="font-mono text-[#EDE4D3]">SAMPLE</span>, <span className="font-mono text-[#EDE4D3]">SYNTHETIC</span>, <span className="font-mono text-[#EDE4D3]">STALE</span>, and <span className="font-mono text-[#EDE4D3]">UNAVAILABLE</span> modules.
        </div>
      </FadeIn>
    </div>
  );
}
