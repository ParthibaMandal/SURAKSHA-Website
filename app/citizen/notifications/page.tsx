"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CitizenNotificationsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    push: true,
    alarms: false,
    vibration: false,
    email: false,
  });

  const handleSave = () => {
    setToast("Notification preferences saved.");
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#292925] border border-[#2F6BFF]/40 text-xs font-mono text-[#D8CBB3] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2F6BFF]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="pb-4 border-b border-[#D8CBB3]/15">
        <div className="eyebrow">CITIZEN WORKSPACE</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D8CBB3] tracking-tight">
          Notification Preferences
        </h1>
        <p className="text-xs text-[#A69B88] mt-1">
          Configure how you receive human-approved flood advisories for your saved locations.
        </p>
      </div>

      {/* Channel Preferences Panel */}
      <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
          <h3 className="text-sm font-bold text-[#D8CBB3]">Channel Preferences</h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#33332E] text-[#D8CBB3] border border-[#D8CBB3]/20">
            LOCAL DEMO
          </span>
        </div>

        <div className="divide-y divide-[#D8CBB3]/10">
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-[#EDE4D3] block">Browser push notifications</strong>
              <small className="text-[11px] text-[#A69B88]">Receive instant desktop and mobile updates</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#D8CBB3] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.push}
                onChange={(e) => setPreferences({ ...preferences, push: e.target.checked })}
                className="rounded border-[#D8CBB3]/30 bg-[#1E1E1C] accent-[#2F6BFF]"
              />
              Enabled
            </label>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-[#EDE4D3] block">Audible alarms</strong>
              <small className="text-[11px] text-[#A69B88]">Distinct alert sounds for high-urgency notifications</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#D8CBB3] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.alarms}
                onChange={(e) => setPreferences({ ...preferences, alarms: e.target.checked })}
                className="rounded border-[#D8CBB3]/30 bg-[#1E1E1C] accent-[#2F6BFF]"
              />
              Enabled
            </label>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-[#EDE4D3] block">Haptic vibration</strong>
              <small className="text-[11px] text-[#A69B88]">Vibration pulses on compatible mobile browsers</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#D8CBB3] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.vibration}
                onChange={(e) => setPreferences({ ...preferences, vibration: e.target.checked })}
                className="rounded border-[#D8CBB3]/30 bg-[#1E1E1C] accent-[#2F6BFF]"
              />
              Enabled
            </label>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-[#EDE4D3] block">Email summaries</strong>
              <small className="text-[11px] text-[#A69B88]">Daily or incident-based email digests</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#D8CBB3] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email}
                onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
                className="rounded border-[#D8CBB3]/30 bg-[#1E1E1C] accent-[#2F6BFF]"
              />
              Enabled
            </label>
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} className="h-10 text-xs font-bold">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
