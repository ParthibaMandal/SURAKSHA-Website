"use client";

import React, { useState, useEffect } from "react";
import { Home, AlertTriangle, CheckCircle2, Shield, Check, RotateCcw } from "lucide-react";

interface ChecklistItem {
  id: string;
  phase: "pre" | "during" | "post";
  text: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Phase 1: Pre-event
  {
    id: "pre-1",
    phase: "pre",
    text: "Seal identity documents, land records, and medical prescriptions in waterproof pouches.",
  },
  {
    id: "pre-2",
    phase: "pre",
    text: "Store 72 hours of clean drinking water, dry rations, power bank, and a charged flashlight.",
  },
  {
    id: "pre-3",
    phase: "pre",
    text: "Verify the elevated evacuation route and assembly point for your ward in Patna or Danapur.",
  },
  // Phase 2: During event
  {
    id: "dur-1",
    phase: "during",
    text: "Never walk, swim, or drive through moving floodwater over embankments or road underpasses.",
  },
  {
    id: "dur-2",
    phase: "during",
    text: "Disconnect main electrical switchgear and LPG cylinders if water approaches ground-floor sockets.",
  },
  {
    id: "dur-3",
    phase: "during",
    text: "Move immediately to upper floors or designated municipal flood relief shelters when advised.",
  },
  // Phase 3: Post event
  {
    id: "post-1",
    phase: "post",
    text: "Return home only after civil defence and disaster management authorities issue an official all-clear bulletin.",
  },
  {
    id: "post-2",
    phase: "post",
    text: "Inspect building walls and foundations for structural waterlogging settlement and report downed power lines.",
  },
  {
    id: "post-3",
    phase: "post",
    text: "Boil or chlorinate drinking water until municipal supply pipelines are certified pathogen-safe.",
  },
];

export default function CitizenSafetyPage() {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persistence from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("suraksha_safety_checklist");
      if (stored) {
        setCheckedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load checklist persistence", e);
    }
    setIsLoaded(true);
  }, []);

  // Save persistence to localStorage
  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("suraksha_safety_checklist", JSON.stringify(next));
      } catch (e) {
        console.warn("Failed to save checklist persistence", e);
      }
      return next;
    });
  };

  const resetAll = () => {
    setCheckedIds({});
    try {
      localStorage.removeItem("suraksha_safety_checklist");
    } catch (e) {
      console.warn("Failed to clear checklist persistence", e);
    }
  };

  const completedCount = CHECKLIST_ITEMS.filter((item) => checkedIds[item.id]).length;
  const totalCount = CHECKLIST_ITEMS.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Heading */}
      <div className="pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FFFFFF]/15 text-[#E4E4E7] border border-[#FFFFFF]/30 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#FFFFFF] shadow-[0_0_8px_#FFFFFF]" />
            Citizen Preparedness Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Flood Preparedness Checklist & Action Guide
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Interactive, evidence-based steps for riverine and urban flash floods across the Patna riparian corridor. Check off items as you complete your household readiness.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetAll}
            className="px-4 py-2 rounded-full text-xs font-medium border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Card */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="text-xs font-mono uppercase font-bold text-[#FFFFFF] tracking-wider">
            Overall Readiness Score
          </div>
          <div className="text-3xl font-black text-white">
            {percentage}% <span className="text-sm font-normal text-slate-400 font-mono">({completedCount} of {totalCount} verified)</span>
          </div>
          <p className="text-xs text-slate-400">
            {percentage === 100
              ? "All critical flood safety measures completed. Stay tuned to official advisories."
              : "Complete the remaining items to maximize household flood resilience."}
          </p>
        </div>

        <div className="w-full md:w-64 space-y-2">
          <div className="h-3 w-full bg-[#000000] rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#E4E4E7] via-[#FFFFFF] to-[#E4E4E7] rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Preparedness status</span>
            <span className={percentage === 100 ? "text-[#E4E4E7] font-bold" : "text-[#E4E4E7]"}>
              {percentage === 100 ? "FULLY READY" : "IN PROGRESS"}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Safety Phase Cards with Interactive Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Phase 1: Pre-Event */}
        <article className="p-6 rounded-2xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-[#FFFFFF]/15 border border-[#FFFFFF]/30 grid place-items-center text-[#FFFFFF]">
              <Home className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-[#E4E4E7] uppercase font-bold bg-[#FFFFFF]/10 border border-[#FFFFFF]/25">
              PHASE 01 · PRE-EVENT
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Before a Flood</h3>
            <p className="text-xs text-slate-400 mt-0.5">Household mitigation and supplies.</p>
          </div>

          <div className="space-y-3 pt-2">
            {CHECKLIST_ITEMS.filter((i) => i.phase === "pre").map((item) => {
              const isChecked = Boolean(checkedIds[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? "bg-[#FFFFFF]/10 border-[#FFFFFF]/40 text-slate-200"
                      : "bg-[#000000]/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border mt-0.5 shrink-0 grid place-items-center transition-colors ${
                      isChecked
                        ? "bg-[#FFFFFF] border-[#FFFFFF] text-[#000000]"
                        : "border-white/30 bg-transparent"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs leading-relaxed ${isChecked ? "line-through text-slate-400" : ""}`}>
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </article>

        {/* Phase 2: During Event */}
        <article className="p-6 rounded-2xl border border-amber-500/20 bg-[#0A0A0A]/80 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 grid place-items-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-amber-400 uppercase font-bold bg-amber-500/10 border border-amber-500/25">
              PHASE 02 · DURING
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">During a Flood</h3>
            <p className="text-xs text-slate-400 mt-0.5">Immediate evacuation and life safety.</p>
          </div>

          <div className="space-y-3 pt-2">
            {CHECKLIST_ITEMS.filter((i) => i.phase === "during").map((item) => {
              const isChecked = Boolean(checkedIds[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? "bg-amber-500/10 border-amber-500/40 text-slate-200"
                      : "bg-[#000000]/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border mt-0.5 shrink-0 grid place-items-center transition-colors ${
                      isChecked
                        ? "bg-amber-400 border-amber-400 text-[#000000]"
                        : "border-white/30 bg-transparent"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs leading-relaxed ${isChecked ? "line-through text-slate-400" : ""}`}>
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </article>

        {/* Phase 3: Post Event */}
        <article className="p-6 rounded-2xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-[#E4E4E7]/15 border border-[#E4E4E7]/30 grid place-items-center text-[#E4E4E7]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-[#E4E4E7] uppercase font-bold bg-[#E4E4E7]/10 border border-[#E4E4E7]/25">
              PHASE 03 · POST-EVENT
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">After a Flood</h3>
            <p className="text-xs text-slate-400 mt-0.5">Safe return and sanitary inspection.</p>
          </div>

          <div className="space-y-3 pt-2">
            {CHECKLIST_ITEMS.filter((i) => i.phase === "post").map((item) => {
              const isChecked = Boolean(checkedIds[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? "bg-[#E4E4E7]/10 border-[#E4E4E7]/40 text-slate-200"
                      : "bg-[#000000]/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border mt-0.5 shrink-0 grid place-items-center transition-colors ${
                      isChecked
                        ? "bg-[#E4E4E7] border-[#E4E4E7] text-[#000000]"
                        : "border-white/30 bg-transparent"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs leading-relaxed ${isChecked ? "line-through text-slate-400" : ""}`}>
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </article>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl border border-white/10 bg-[#0A0A0A]/60 text-xs text-slate-400 flex items-center gap-3">
        <Shield className="w-5 h-5 text-[#FFFFFF] shrink-0" />
        <span>
          This checklist provides general public safety preparedness guidance. Always follow real-time evacuation orders and emergency bulletins issued by the National Disaster Management Authority (NDMA) and Bihar State Disaster Management Authority (BSDMA).
        </span>
      </div>
    </div>
  );
}
