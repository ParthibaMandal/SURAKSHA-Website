import React from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { STATIONS } from "@/lib/mock-data";
import { MapPin } from "lucide-react";

export const metadata = {
  title: "Study Area | SURAKSHA",
  description: "A focused starting point in the Ganga corridor around Patna, Bihar.",
};

export default function StudyAreaPage() {
  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="max-w-3xl">
          <div className="eyebrow">Study Area</div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#f0f7f6] tracking-tight">
            A focused starting point in the Ganga corridor.
          </h1>
          <p className="text-base text-[#9bb2af] mt-4 leading-relaxed">
            The initial study context centres on riverine flood risk in Bihar, particularly around Patna. Map boundaries and station coverage shown here are illustrative until verified against configured geospatial data.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="rounded-2xl border border-[#2e4952] overflow-hidden shadow-2xl relative h-[440px]">
          <TacticalMapSvg />
          <div className="absolute bottom-3 left-4 right-4 z-10 px-3.5 py-2 rounded-xl bg-[#091418]/85 border border-[#5eead4]/25 backdrop-blur-md text-xs font-mono text-center text-[#9bb2af]">
            Schematic overview · Ganga corridor / Patna focus sector
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <h3 className="text-lg font-bold text-white">Primary context</h3>
          <p className="text-xs text-[#9bb2af] leading-relaxed">
            Ganga river corridor · Patna / Bihar. The operational study extent is declared from configured geospatial boundaries and monitored river stations.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <h3 className="text-lg font-bold text-white">Upstream context</h3>
          <p className="text-xs text-[#9bb2af] leading-relaxed">
            Catchment, precipitation and cryosphere indicators may inform research questions. They appear in an operational workflow when data provenance, temporal coverage and physical relevance are documented.
          </p>
        </div>
      </div>

      {/* River Stations Array */}
      <FadeIn delay={0.3}>
        <div className="rounded-2xl border border-[#2e4952]/40 bg-[#0f171b]/80 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#5eead4]" /> Monitored Gauging Stations
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2e4952]/50 text-[#9bb2af]">
                  <th className="py-2.5 px-3">Station ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Basin</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3">Warning / Danger</th>
                  <th className="py-2.5 px-3">Trend</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c2e35]">
                {STATIONS.map((st) => (
                  <tr key={st.id} className="hover:bg-[#142329]/50">
                    <td className="py-2.5 px-3 text-[#5eead4] font-bold">{st.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{st.name}</td>
                    <td className="py-2.5 px-3 text-[#9bb2af]">{st.basin}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{st.currentStage.toFixed(2)} m</td>
                    <td className="py-2.5 px-3 text-[#627b77]">
                      {st.warningLevel.toFixed(1)} / {st.dangerLevel.toFixed(1)} m
                    </td>
                    <td className="py-2.5 px-3 text-[#9bb2af]">{st.trend}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
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
