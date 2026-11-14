"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CitizenProfilePage() {
  const [toast, setToast] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("Citizen Preview");
  const [lang, setLang] = useState<string>("English");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Profile changes saved.");
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
          My Profile
        </h1>
        <p className="text-xs text-[#A69B88] mt-1">
          Account details, language preferences, and security settings.
        </p>
      </div>

      {/* Two Column Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Details */}
        <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
            <h3 className="text-sm font-bold text-[#D8CBB3]">User Details</h3>
            <span className="text-xs font-mono text-[#A69B88]">Citizen Account</span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
                Full name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] focus:outline-none focus:border-[#2F6BFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
                Email address
              </label>
              <input
                type="email"
                disabled
                value="citizen@example.test"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/10 bg-[#1E1E1C]/60 text-xs text-[#A69B88] cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
                Preferred language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] focus:outline-none focus:border-[#2F6BFF]"
              >
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>

            <Button type="submit" className="h-10 text-xs font-bold">
              Save Changes
            </Button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
              <h3 className="text-sm font-bold text-[#D8CBB3]">Security Settings</h3>
              <span className="text-xs font-mono text-[#2F6BFF]">Protected</span>
            </div>

            <div className="divide-y divide-[#D8CBB3]/10">
              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-[#EDE4D3] block">Password protection</strong>
                  <small className="text-[11px] text-[#A69B88]">Last changed 14 days ago</small>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                  Secure
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-[#EDE4D3] block">Active sessions</strong>
                  <small className="text-[11px] text-[#A69B88]">1 session in current browser</small>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#2F6BFF]/15 text-[#2F6BFF] border border-[#2F6BFF]/30">
                  Active
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-[#EDE4D3] block">Two-factor authentication</strong>
                  <small className="text-[11px] text-[#A69B88]">Planned integration</small>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#33332E] text-[#D8CBB3] border border-[#D8CBB3]/20">
                  Optional
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#D8CBB3]/12">
            <button
              onClick={() => showToast("Security options preview.")}
              className="btn secondary small"
            >
              Manage Security
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
