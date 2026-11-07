"use client";

import React, { useState } from "react";
import { AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CitizenSosPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [assistanceType, setAssistanceType] = useState<string>("Rescue / evacuation support");
  const [people, setPeople] = useState<string>("1 person");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setToast("Demo emergency request registered.");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0f171b] border border-[#5eead4]/40 text-xs font-mono text-[#5eead4] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#5eead4]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="pb-4 border-b border-[#2e4952]/30">
        <div className="eyebrow">CITIZEN WORKSPACE</div>
        <h1 className="text-3xl font-black text-white">SOS Assistance</h1>
        <p className="text-xs text-[#9bb2af] mt-1">
          Submit a request for emergency flood assistance.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-red-300 font-bold block">
            For immediate life-threatening danger, call your national emergency helpline.
          </strong>
          <p className="text-slate-300">
            Do not rely on this research prototype as an authoritative emergency response channel.
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: New assistance request */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">New assistance request</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
              DEMO DESK
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9bb2af] uppercase tracking-wider">
                Type of assistance
              </label>
              <select
                value={assistanceType}
                onChange={(e) => setAssistanceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]"
              >
                <option>Rescue / evacuation support</option>
                <option>Medical assistance</option>
                <option>Food / drinking water</option>
                <option>Other emergency needs</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9bb2af] uppercase tracking-wider">
                Approximate location
              </label>
              <input
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Area, landmark or locality"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9bb2af] uppercase tracking-wider">
                People affected
              </label>
              <select
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]"
              >
                <option>1 person</option>
                <option>2–5 people</option>
                <option>6–10 people</option>
                <option>More than 10</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9bb2af] uppercase tracking-wider">
                Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe the current hazard conditions."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]"
              />
            </div>

            <Button type="submit" className="w-full h-11 flex items-center justify-center gap-2">
              Submit demo request <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Right: Request Status */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
              <h3 className="text-sm font-bold text-white">Request Status</h3>
              <span className="text-xs font-mono text-[#627b77]">
                {submitted ? "1 Registered" : "0 Active"}
              </span>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/10 space-y-2 mt-4 font-mono text-xs">
                <div className="text-teal-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Request Registered (Demo)
                </div>
                <div className="text-slate-300">Category: {assistanceType}</div>
                <div className="text-slate-300">Location: {location || "Patna Lowland"}</div>
                <div className="text-slate-300">Affected: {people}</div>
                <div className="text-[11px] text-[#859e9a] pt-1 border-t border-teal-500/20">
                  Status: Queued in operational triage simulation.
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <strong className="text-sm text-white block">No active requests</strong>
                <p className="text-xs text-[#859e9a]">
                  Submitted requests will appear here once registered.
                </p>
              </div>
            )}
          </div>

          <p className="text-[10px] text-[#627b77] leading-relaxed pt-4 border-t border-[#2e4952]/30">
            Personal information submitted during emergencies is confidential and protected by role-based operational policies.
          </p>
        </div>
      </div>
    </div>
  );
}
