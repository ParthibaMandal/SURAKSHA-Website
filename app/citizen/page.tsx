import React from "react";
import Link from "next/link";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { Activity, ArrowRight, Shield, Bell, MapPin, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Citizen Dashboard | SURAKSHA",
  description: "A personal view of saved areas, published alerts and assistance requests.",
};

export default function CitizenDashboardPage() {
  return (
    <div className="space-y-6">
      {/* App Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e4952]/30">
        <div>
          <div className="eyebrow">CITIZEN WORKSPACE</div>
          <h1 className="text-3xl font-black text-white">My Dashboard</h1>
          <p className="text-xs text-[#9bb2af] mt-1">
            A personal view of saved areas, published alerts and assistance requests.
          </p>
        </div>
        <Link
          href="/citizen/locations"
          className="btn primary small self-start sm:self-auto flex items-center gap-1.5"
        >
          Manage locations <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Notice */}
      <div className="notice">
        Citizen preview data is illustrative. This account is not connected to live personal tracking.
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Saved locations</span>
            <MapPin className="w-3.5 h-3.5 text-[#5eead4]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">02</div>
          <div className="text-[11px] text-[#859e9a]">Patna · North zone</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Published alerts</span>
            <Bell className="w-3.5 h-3.5 text-[#fbbf24]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">01</div>
          <div className="text-[11px] text-[#5eead4]">Example advisory</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Open SOS requests</span>
            <AlertTriangle className="w-3.5 h-3.5 text-[#f87171]" />
          </div>
          <div className="text-2xl font-black font-mono text-white">00</div>
          <div className="text-[11px] text-[#859e9a]">No active requests</div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9bb2af]">
            <span>Telemetry sync</span>
            <Activity className="w-3.5 h-3.5 text-[#5eead4]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#5eead4]">Live</div>
          <div className="text-[11px] text-[#5eead4]">Ensemble simulator</div>
        </div>
      </div>

      {/* Row 1: Area Overview & Recent Alert Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Overview with Map */}
        <div className="p-5 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Area overview</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1c2e35] text-[#9bb2af] border border-[#2e4952]">
              MONITORED
            </span>
          </div>
          <div className="h-[235px] rounded-xl overflow-hidden border border-[#2e4952]/40 relative">
            <TacticalMapSvg />
            <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-[#091418]/90 border border-[#5eead4]/20 text-[10px] font-mono text-center text-[#9bb2af]">
              Illustrative monitored location map
            </div>
          </div>
        </div>

        {/* Recent Alert Activity */}
        <div className="p-5 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Recent alert activity</h3>
            <Link href="/citizen/alerts" className="text-xs text-[#5eead4] hover:underline">
              View alerts →
            </Link>
          </div>
          <div className="divide-y divide-[#2e4952]/30">
            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-white block">Example advisory · Patna corridor</strong>
                <small className="text-[11px] text-[#859e9a]">Sample alert record · 06 Nov 2026</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Advisory
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-white block">Ganga river level normal</strong>
                <small className="text-[11px] text-[#859e9a]">Continuous stage telemetry active</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Normal
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-white block">Notification channels</strong>
                <small className="text-[11px] text-[#859e9a]">Push & sound ready</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1c2e35] text-[#9bb2af] border border-[#2e4952]">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Your Saved Locations & Safety Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Saved Locations */}
        <div className="p-5 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Your saved locations</h3>
            <Link href="/citizen/locations" className="text-xs text-[#5eead4] hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-[#2e4952]/30">
            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-white block">Patna · Primary residence</strong>
                <small className="text-[11px] text-[#859e9a]">Ganga sector · illustrative</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1c2e35] text-[#9bb2af] border border-[#2e4952]">
                Primary
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-white block">Family residence</strong>
                <small className="text-[11px] text-[#859e9a]">District North · alert radius 5km</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Saved
              </span>
            </div>
          </div>
        </div>

        {/* Safety Quick Links */}
        <div className="p-5 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.78)] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4952]/30">
            <h3 className="text-sm font-bold text-white">Safety quick links</h3>
            <Link href="/citizen/safety" className="text-xs text-[#5eead4] hover:underline">
              Safety centre →
            </Link>
          </div>
          <div className="divide-y divide-[#2e4952]/30">
            <Link
              href="/citizen/safety"
              className="py-3 flex items-center justify-between gap-3 hover:bg-[#162e34]/30 px-2 rounded-lg transition-colors"
            >
              <div>
                <strong className="text-xs text-white block">Flood preparedness checklist</strong>
                <small className="text-[11px] text-[#859e9a]">Action steps before heavy rainfall</small>
              </div>
              <span className="text-xs text-[#5eead4] font-semibold">Guide →</span>
            </Link>

            <Link
              href="/citizen/sos"
              className="py-3 flex items-center justify-between gap-3 hover:bg-[#162e34]/30 px-2 rounded-lg transition-colors"
            >
              <div>
                <strong className="text-xs text-white block">SOS assistance desk</strong>
                <small className="text-[11px] text-[#859e9a]">Submit an immediate request for support</small>
              </div>
              <span className="text-xs text-amber-300 font-semibold">Open →</span>
            </Link>

            <Link
              href="/citizen/notifications"
              className="py-3 flex items-center justify-between gap-3 hover:bg-[#162e34]/30 px-2 rounded-lg transition-colors"
            >
              <div>
                <strong className="text-xs text-white block">Notification settings</strong>
                <small className="text-[11px] text-[#859e9a]">Manage sound and browser alerts</small>
              </div>
              <span className="text-xs text-[#5eead4] font-semibold">Configure →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
