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
    <div className="border-b border-[#D8CBB3]/14 bg-[#1E1E1C] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <Link href={baseHref} className="text-[#A69B88] hover:text-[#D8CBB3] transition-colors">
          SURAKSHA
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#7D7465]" />
        <span className="text-[#A69B88]">{workspace}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#7D7465]" />
        <span className="text-[#2F6BFF] font-semibold">{segmentLabel}</span>
      </div>

      {/* Right Top-Bar Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Study-Area Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D8CBB3]/16 bg-[#292925] text-xs">
          <Globe className="w-3.5 h-3.5 text-[#2F6BFF]" />
          <label htmlFor="study-area-select" className="sr-only">
            Select Study Area
          </label>
          <select
            id="study-area-select"
            value={studyArea}
            onChange={(e) => setStudyArea(e.target.value)}
            className="bg-transparent text-[#D8CBB3] font-medium focus:outline-none text-xs cursor-pointer"
          >
            <option value="patna" className="bg-[#292925] text-[#D8CBB3]">
              Ganga Basin, Patna Study Area
            </option>
            <option value="gandak" className="bg-[#292925] text-[#D8CBB3]">
              Gandak Tributary, Lalganj Sector
            </option>
            <option value="son" className="bg-[#292925] text-[#D8CBB3]">
              Son Sub-basin, Koelwar Reach
            </option>
            <option value="kosi" className="bg-[#292925] text-[#D8CBB3]">
              Kosi Basin, Birpur Barrage
            </option>
          </select>
        </div>

        {/* Data-Source Status Badge */}
        <div
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D8CBB3]/16 bg-[#292925] text-[11px] font-mono text-[#D8CBB3]"
          title="Clearly distinguishing sample and synthetic research telemetry from official live feeds"
        >
          <span className="w-2 h-2 rounded-full bg-[#2F6BFF]" />
          <span>DATA: SAMPLE / SYNTHETIC</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg border border-[#D8CBB3]/16 bg-[#292925] text-[#D8CBB3] hover:bg-[#33332E] transition-colors"
            aria-label="System notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2F6BFF] text-white text-[9px] font-mono font-bold grid place-items-center">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#D8CBB3]/20 bg-[#292925] shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-[#D8CBB3]/14 pb-2">
                <span className="text-xs font-bold text-[#D8CBB3]">Command Notifications</span>
                <span className="text-[10px] font-mono text-[#2F6BFF]">3 UNREAD</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-[#33332E] border border-[#D8CBB3]/12">
                  <div className="font-semibold text-[#D8CBB3]">Mid-Run Gate Review Pending</div>
                  <div className="text-[11px] text-[#A69B88] mt-0.5 font-mono">
                    STN-GAN-01 ensemble spread +0.62m
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#33332E] border border-[#D8CBB3]/12">
                  <div className="font-semibold text-[#D8CBB3]">CAP Advisory Draft #204</div>
                  <div className="text-[11px] text-[#A69B88] mt-0.5 font-mono">
                    Awaiting duty commander sign-off
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#33332E] border border-[#D8CBB3]/12">
                  <div className="font-semibold text-[#D8CBB3]">Pre-Run Ingestion Check</div>
                  <div className="text-[11px] text-[#A69B88] mt-0.5 font-mono">
                    8 / 8 basin stations reporting (SAMPLE)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <Link
          href="/admin/settings"
          className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D8CBB3]/16 bg-[#292925] hover:bg-[#33332E] text-xs text-[#D8CBB3] transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#2F6BFF]" />
          <span className="font-medium">Cmdr. Verification</span>
        </Link>
      </div>
    </div>
  );
};
