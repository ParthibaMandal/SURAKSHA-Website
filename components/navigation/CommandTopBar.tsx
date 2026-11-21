"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Globe, ShieldCheck, ChevronRight } from "lucide-react";

interface CommandTopBarProps {
  workspace?: string;
}

export const CommandTopBar: React.FC<CommandTopBarProps> = ({ workspace = "COMMAND" }) => {
  const pathname = usePathname();
  const [studyArea, setStudyArea] = useState("patna");
  const [notifOpen, setNotifOpen] = useState(false);

  const segmentLabel = (() => {
    if (!pathname || pathname === "/admin" || pathname === "/citizen") return "OVERVIEW";
    const parts = pathname.split("/").filter(Boolean);
    return parts[parts.length - 1]?.toUpperCase().replace("-", " ") || "OPERATIONS";
  })();

  const baseHref = workspace === "CITIZEN" ? "/citizen" : "/admin";

  return (
    <div className="border-b border-white/10 bg-[#090C10]/90 backdrop-blur-md px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-white">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <Link href={baseHref} className="text-slate-400 hover:text-white transition-colors">
          SURAKSHA
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-400">{workspace}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-[#06B6D4] font-semibold">{segmentLabel}</span>
      </div>

      {/* Right Top-Bar Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Study-Area Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white">
          <Globe className="w-3.5 h-3.5 text-[#06B6D4]" />
          <label htmlFor="study-area-select" className="sr-only">
            Select Study Area
          </label>
          <select
            id="study-area-select"
            value={studyArea}
            onChange={(e) => setStudyArea(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none text-xs cursor-pointer"
          >
            <option value="patna" className="bg-[#10161F] text-white">
              Ganga Basin, Patna Study Area
            </option>
            <option value="gandak" className="bg-[#10161F] text-white">
              Gandak Tributary, Lalganj Sector
            </option>
            <option value="son" className="bg-[#10161F] text-white">
              Son Sub-basin, Koelwar Reach
            </option>
            <option value="kosi" className="bg-[#10161F] text-white">
              Kosi Basin, Birpur Barrage
            </option>
          </select>
        </div>

        {/* Data-Source Status Badge */}
        <div
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-slate-300"
          title="Clearly distinguishing sample and synthetic research telemetry from official live feeds"
        >
          <span className="w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_6px_#06b6d4]" />
          <span>DATA: SAMPLE / SYNTHETIC</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
            aria-label="System notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#06B6D4] text-[#090C10] text-[9px] font-mono font-bold grid place-items-center">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#10161F]/95 backdrop-blur-xl shadow-2xl p-4 z-50 space-y-3 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-white">Command Notifications</span>
                <span className="text-[10px] font-mono text-[#06B6D4]">3 UNREAD</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-[#090C10]/80 border border-white/10">
                  <div className="font-semibold text-white">Mid-Run Gate Review Pending</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    STN-GAN-01 ensemble spread +0.62m
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#090C10]/80 border border-white/10">
                  <div className="font-semibold text-white">CAP Advisory Draft #204</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    Awaiting duty commander sign-off
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#090C10]/80 border border-white/10">
                  <div className="font-semibold text-white">Pre-Run Ingestion Check</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    8 / 8 basin stations reporting (SAMPLE)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Verification Pill */}
        <Link
          href="/admin/settings"
          className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span className="font-medium">Cmdr. Verification</span>
        </Link>
      </div>
    </div>
  );
};
