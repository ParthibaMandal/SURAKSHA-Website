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
    setToast("Preferences saved.");
    setTimeout(() => setToast(null), 2600);
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
        <h1 className="text-3xl font-black text-white">Notification Preferences</h1>
        <p className="text-xs text-[#9bb2af] mt-1">
          Configure how you receive critical advisories.
        </p>
      </div>

      {/* Channel Preferences Panel */}
      <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
          <h3 className="text-sm font-bold text-white">Channel Preferences</h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1c2e35] text-[#9bb2af] border border-[#2e4952]">
            LOCAL DEMO
          </span>
        </div>

        <div className="divide-y divide-[#2e4952]/30">
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-white block">Browser push notifications</strong>
              <small className="text-[11px] text-[#859e9a]">Receive instant desktop and mobile updates</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#a4beba] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.push}
                onChange={(e) => setPreferences({ ...preferences, push: e.target.checked })}
                className="rounded border-[#2e4952] bg-[#091418] text-[#5eead4] focus:ring-0"
              />
              Enabled
            </label>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-white block">Audible alarms</strong>
              <small className="text-[11px] text-[#859e9a]">Distinct alert sounds for high-urgency notifications</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#a4beba] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.alarms}
                onChange={(e) => setPreferences({ ...preferences, alarms: e.target.checked })}
                className="rounded border-[#2e4952] bg-[#091418] text-[#5eead4] focus:ring-0"
              />
              Enabled
            </label>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-white block">Haptic vibration</strong>
              <small className="text-[11px] text-[#859e9a]">Vibration pulses on compatible mobile browsers</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#a4beba] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.vibration}
                onChange={(e) => setPreferences({ ...preferences, vibration: e.target.checked })}
                className="rounded border-[#2e4952] bg-[#091418] text-[#5eead4] focus:ring-0"
              />
              Enabled
            </label>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-white block">Email summaries</strong>
              <small className="text-[11px] text-[#859e9a]">Daily or incident-based email digests</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#a4beba] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email}
                onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
                className="rounded border-[#2e4952] bg-[#091418] text-[#5eead4] focus:ring-0"
              />
              Enabled
            </label>
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} className="h-10 text-xs font-bold">
            Save preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
