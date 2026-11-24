import React from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { STATIONS } from "@/lib/mock-data";
import { MapPin } from "lucide-react";
import { PATNA_GANDHI_GHAT } from "@/lib/mock-data";

export const metadata = {
  title: "Study Area | SURAKSHA",
  description: "A focused starting point in the Ganga corridor around Patna, Bihar.",
};

export default function StudyAreaPage() {
  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">STUDY AREA CONTEXT</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#A1A1AA] tracking-tight">
            A focused starting point in the Ganga corridor.
          </h1>
          <p className="text-base text-[#A69B88] mt-4 leading-relaxed">
            The initial study context centres on the Gandhi Ghat reach near Patna. The {PATNA_GANDHI_GHAT.baseline.toFixed(2)} m baseline and {PATNA_GANDHI_GHAT.currentStage.toFixed(2)} m station reading are synthetic preview values; map boundaries and station coverage are illustrative.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] overflow-hidden shadow-2xl relative h-[440px]">
          <TacticalMapSvg />
          <div className="absolute bottom-3 left-4 right-4 z-10 px-3.5 py-2 rounded-lg bg-[#000000]/95 border border-[#A1A1AA]/25 text-xs font-mono text-center text-[#A1A1AA]">
            SCHEMATIC OVERVIEW · GANGA CORRIDOR / PATNA FOCUS SECTOR (ILLUSTRATIVE MAP, NOT LIVE)
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <h3 className="text-lg font-bold text-[#FFFFFF]">Primary Context</h3>
          <p className="text-xs text-[#A69B88] leading-relaxed">
            Ganga river corridor, Patna, Bihar. The operational study extent is declared from configured geospatial boundaries and monitored river stations.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <h3 className="text-lg font-bold text-[#FFFFFF]">Upstream Tributary Context</h3>
          <p className="text-xs text-[#A69B88] leading-relaxed">
            Sone, Gandak, and Punpun catchment inflows and precipitation indicators inform ensemble stage projections when data provenance and temporal coverage are verified.
          </p>
        </div>
      </div>

      {/* River Stations Array */}
      <FadeIn delay={0.25}>
        <div className="rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#FFFFFF] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FFFFFF]" /> Monitored Gauging Stations
            </h3>
            <span className="text-xs font-mono text-[#A69B88]">DATA: SAMPLE</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#A1A1AA]/15 text-[#A69B88] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Station ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Basin</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3">Warning / Danger</th>
                  <th className="py-2.5 px-3">Trend</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A1A1AA]/10">
                {STATIONS.map((st) => (
                  <tr key={st.id} className="hover:bg-[#141414]/50">
                    <td className="py-2.5 px-3 text-[#FFFFFF] font-bold">{st.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#FFFFFF] font-sans">{st.name}</td>
                    <td className="py-2.5 px-3 text-[#A1A1AA]">{st.basin}</td>
                    <td className="py-2.5 px-3 font-bold text-[#FFFFFF]">{st.currentStage.toFixed(2)} m</td>
                    <td className="py-2.5 px-3 text-[#A69B88]">
                      {st.warningLevel.toFixed(1)} / <span className="text-[#EF4444]">{st.dangerLevel.toFixed(1)} m</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#A1A1AA]">{st.trend}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FFFFFF]/15 text-[#FFFFFF] border border-[#FFFFFF]/30">
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
