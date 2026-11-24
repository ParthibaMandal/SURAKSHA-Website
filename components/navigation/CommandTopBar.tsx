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
  const [notifOpen, setNotifOpen] = useState(false);

  const segmentLabel = (() => {
    if (!pathname || pathname === "/admin" || pathname === "/citizen") return "OVERVIEW";
    const parts = pathname.split("/").filter(Boolean);
    return parts[parts.length - 1]?.toUpperCase().replace("-", " ") || "OPERATIONS";
  })();

  const baseHref = workspace === "CITIZEN" ? "/citizen" : "/admin";

  return (
    <div className="border-b border-white/10 bg-black/95 backdrop-blur-md px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-white">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <Link href={baseHref} className="text-zinc-400 hover:text-white transition-colors">
          SURAKSHA
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-400">{workspace}</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-white font-semibold">{segmentLabel}</span>
      </div>

      {/* Right Top-Bar Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* This workspace currently has one configured synthetic study area. */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white" aria-label="Current study area">
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-medium">Ganga Basin · Patna</span>
          <span className="text-[10px] font-mono text-zinc-400">SAMPLE</span>
        </div>

        {/* Data-Source Status Badge */}
        <div
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-zinc-300"
          title="Clearly distinguishing sample and synthetic research telemetry from official live feeds"
        >
          <span className="w-2 h-2 rounded-full bg-white" />
          <span>DATA: SAMPLE / SYNTHETIC</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 transition-colors"
            aria-label="System notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[9px] font-mono font-bold grid place-items-center">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0A0A0A] backdrop-blur-xl shadow-2xl p-4 z-50 space-y-3 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-semibold text-white">Command Notifications</span>
                <span className="text-[10px] font-mono text-zinc-400">3 UNREAD</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-black border border-white/10">
                  <div className="font-semibold text-white">Mid-Run Gate Review Pending</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                    STN-GAN-01 ensemble spread +0.62m
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black border border-white/10">
                  <div className="font-semibold text-white">CAP Advisory Draft #204</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                    Awaiting duty commander sign-off
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black border border-white/10">
                  <div className="font-semibold text-white">Pre-Run Ingestion Check</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
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
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span className="font-medium">Cmdr. Verification</span>
        </Link>
      </div>
    </div>
  );
};
