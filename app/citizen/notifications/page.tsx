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
    setToast("Preview updated for this page session only. No notifications will be sent.");
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#FFFFFF]/40 text-xs font-mono text-[#A1A1AA] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="pb-4 border-b border-[#A1A1AA]/15">
        <div className="eyebrow">CITIZEN WORKSPACE</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#A1A1AA] tracking-tight">
          Notification Preferences
        </h1>
        <p className="text-xs text-[#A69B88] mt-1">
          Adjust a local preview. Preference storage and notification delivery are not connected.
        </p>
      </div>

      {/* Channel Preferences Panel */}
      <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
          <h3 className="text-sm font-bold text-[#A1A1AA]">Channel Preferences</h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#141414] text-[#A1A1AA] border border-[#A1A1AA]/20">
            LOCAL DEMO
          </span>
        </div>

        <div className="divide-y divide-[#A1A1AA]/10">
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-[#FFFFFF] block">Browser push preview</strong>
              <small className="text-[11px] text-[#A69B88]">No push subscription or delivery service is connected.</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.push}
                onChange={(e) => setPreferences({ ...preferences, push: e.target.checked })}
                className="rounded border-[#A1A1AA]/30 bg-[#000000] accent-[#FFFFFF]"
              />
              Enabled
            </label>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-[#FFFFFF] block">Audible alarm preview</strong>
              <small className="text-[11px] text-[#A69B88]">No alert sound is triggered by this setting.</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.alarms}
                onChange={(e) => setPreferences({ ...preferences, alarms: e.target.checked })}
                className="rounded border-[#A1A1AA]/30 bg-[#000000] accent-[#FFFFFF]"
              />
              Enabled
            </label>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-[#FFFFFF] block">Vibration preview</strong>
              <small className="text-[11px] text-[#A69B88]">No vibration is triggered by this setting.</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.vibration}
                onChange={(e) => setPreferences({ ...preferences, vibration: e.target.checked })}
                className="rounded border-[#A1A1AA]/30 bg-[#000000] accent-[#FFFFFF]"
              />
              Enabled
            </label>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-[#FFFFFF] block">Email summary preview</strong>
              <small className="text-[11px] text-[#A69B88]">No email subscription or delivery service is connected.</small>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email}
                onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
                className="rounded border-[#A1A1AA]/30 bg-[#000000] accent-[#FFFFFF]"
              />
              Enabled
            </label>
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} className="h-10 text-xs font-bold">
            Apply to Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
