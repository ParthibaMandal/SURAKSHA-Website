import React from "react";
import { Home, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Safety Centre | SURAKSHA",
  description: "Practical preparedness guidelines for riverine and urban flood events.",
};

export default function CitizenSafetyPage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="pb-4 border-b border-[#2e4952]/30">
        <div className="eyebrow">CITIZEN WORKSPACE</div>
        <h1 className="text-3xl font-black text-white">Safety Centre</h1>
        <p className="text-xs text-[#9bb2af] mt-1">
          Practical preparedness guidelines for riverine and urban flood events.
        </p>
      </div>

      {/* 3 Safety Phase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#162e34] border border-[#5eead4]/30 grid place-items-center text-[#5eead4]">
            <Home className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Before a flood</h3>
          <p className="text-xs text-[#9bb2af] leading-relaxed">
            Keep essential documents in waterproof bags, store emergency drinking water and medicines, and identify elevated routes.
          </p>
        </article>

        <article className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#2e2614] border border-[#fbbf24]/30 grid place-items-center text-[#fbbf24]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">During a flood</h3>
          <p className="text-xs text-[#9bb2af] leading-relaxed">
            Never walk, swim or drive through moving water. Move to upper levels or designated shelters when advised.
          </p>
        </article>

        <article className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#133328] border border-[#34d399]/30 grid place-items-center text-[#34d399]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">After a flood</h3>
          <p className="text-xs text-[#9bb2af] leading-relaxed">
            Return only when local authorities give the all-clear. Beware of submerged electrical lines and contaminated water sources.
          </p>
        </article>
      </div>

      {/* Notice */}
      <div className="notice">
        This information provides general public safety guidance. Always follow official instructions issued by local civil defence and disaster response authorities.
      </div>
    </div>
  );
}
