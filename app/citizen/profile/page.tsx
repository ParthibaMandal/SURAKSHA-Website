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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0f171b] border border-[#5eead4]/40 text-xs font-mono text-[#5eead4] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#5eead4]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="pb-4 border-b border-[#2e4952]/30">
        <div className="eyebrow">CITIZEN WORKSPACE</div>
        <h1 className="text-3xl font-black text-white">My Profile</h1>
        <p className="text-xs text-[#9bb2af] mt-1">
          Account details, preferences and credentials.
        </p>
      </div>

      {/* Two Column Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Details */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">User Details</h3>
            <span className="text-xs font-mono text-[#627b77]">Citizen Account</span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9bb2af] uppercase tracking-wider">
                Full name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9bb2af] uppercase tracking-wider">
                Email address
              </label>
              <input
                type="email"
                disabled
                value="citizen@example.test"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2e4952]/40 bg-[#060c0e] text-xs text-[#627b77] cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9bb2af] uppercase tracking-wider">
                Preferred language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]"
              >
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>

            <Button type="submit" className="h-10 text-xs font-bold">
              Save changes
            </Button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="p-6 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
              <h3 className="text-sm font-bold text-white">Security Settings</h3>
              <span className="text-xs font-mono text-teal-400">Protected</span>
            </div>

            <div className="divide-y divide-[#2e4952]/30">
              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-white block">Password protection</strong>
                  <small className="text-[11px] text-[#859e9a]">Last changed 14 days ago</small>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  Secure
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-white block">Active sessions</strong>
                  <small className="text-[11px] text-[#859e9a]">1 session in current browser</small>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  Active
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-white block">Two-factor authentication</strong>
                  <small className="text-[11px] text-[#859e9a]">Planned integration</small>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Pending
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2e4952]/30">
            <button
              onClick={() => showToast("Security options preview.")}
              className="px-4 py-2 rounded-xl bg-[#162e34] border border-[#2e4952] text-xs font-bold text-[#5eead4] hover:bg-[#1c3e46]"
            >
              Manage security
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
