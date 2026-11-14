import React from "react";
import { Home, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Flood Preparedness & Safety Centre | SURAKSHA",
  description: "Practical preparedness guidelines for riverine and urban flood events.",
};

export default function CitizenSafetyPage() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="pb-4 border-b border-[#D8CBB3]/15">
        <div className="eyebrow">CITIZEN WORKSPACE</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D8CBB3] tracking-tight">
          Flood Preparedness Checklist & Safety Guide
        </h1>
        <p className="text-xs text-[#A69B88] mt-1">
          Practical pre-event, during-event, and post-event safety steps for riverine and urban flood conditions.
        </p>
      </div>

      {/* 3 Safety Phase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#2F6BFF]/15 border border-[#2F6BFF]/30 grid place-items-center text-[#2F6BFF]">
            <Home className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono text-[#2F6BFF] uppercase font-bold">PHASE 01 · PRE-EVENT</div>
          <h3 className="text-lg font-bold text-[#EDE4D3]">Before a Flood</h3>
          <ul className="text-xs text-[#A69B88] leading-relaxed space-y-2 list-disc pl-4">
            <li>Seal identity documents, land records, and prescriptions in waterproof pouches.</li>
            <li>Store 72 hours of clean drinking water, dry rations, and a charged flashlight.</li>
            <li>Verify the elevated evacuation route for your ward in Patna or Danapur.</li>
          </ul>
        </article>

        <article className="p-6 rounded-xl border border-[#F59E0B]/30 bg-[#292925] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 grid place-items-center text-[#F59E0B]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono text-[#F59E0B] uppercase font-bold">PHASE 02 · DURING EVENT</div>
          <h3 className="text-lg font-bold text-[#EDE4D3]">During a Flood</h3>
          <ul className="text-xs text-[#A69B88] leading-relaxed space-y-2 list-disc pl-4">
            <li>Never walk, swim, or drive through moving floodwater over embankments or underpasses.</li>
            <li>Disconnect main electrical switchgear if water approaches ground-floor sockets.</li>
            <li>Move immediately to upper floors or designated municipal flood shelters when advised.</li>
          </ul>
        </article>

        <article className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#33332E] border border-[#D8CBB3]/30 grid place-items-center text-[#D8CBB3]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-mono text-[#D8CBB3] uppercase font-bold">PHASE 03 · POST-EVENT</div>
          <h3 className="text-lg font-bold text-[#EDE4D3]">After a Flood</h3>
          <ul className="text-xs text-[#A69B88] leading-relaxed space-y-2 list-disc pl-4">
            <li>Return home only after civil defence authorities issue an official all-clear bulletin.</li>
            <li>Inspect walls and foundations for waterlogging settlement and avoid downed power lines.</li>
            <li>Boil or chlorinate drinking water until municipal supply pipelines are certified safe.</li>
          </ul>
        </article>
      </div>

      {/* Notice */}
      <div className="notice">
        This information provides general public safety guidance. Always follow official instructions issued by local civil defence and disaster response authorities.
      </div>
    </div>
  );
}
