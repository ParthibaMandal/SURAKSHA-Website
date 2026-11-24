"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import {
  Activity,
  ArrowRight,
  Bell,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-context";
import { PATNA_GANDHI_GHAT } from "@/lib/mock-data";

export default function CitizenDashboardPage() {
  const { profile } = useAuth();
  const [checklist, setChecklist] = useState([
    {
      id: "c1",
      phase: "Pre-Event",
      label: "Store identity documents and medicines in waterproof pouches",
      done: true,
    },
    {
      id: "c2",
      phase: "Pre-Event",
      label: "Verify nearest elevated shelter route in Patna Sector 04",
      done: true,
    },
    {
      id: "c3",
      phase: "During Event",
      label: "Keep 72-hour potable water supply and charged power bank ready",
      done: false,
    },
    {
      id: "c4",
      phase: "Post-Event",
      label: "Wait for official municipal clearance before re-entering flooded wards",
      done: false,
    },
  ]);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* App Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#A1A1AA]/15">
        <div>
          <div className="eyebrow">CITIZEN FLOOD-SAFETY PORTAL</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#A1A1AA] tracking-tight">
            Personal Flood-Safety Dashboard
          </h1>
          <p className="text-xs text-[#A69B88] mt-1">
            {profile?.full_name ? `Welcome back, ${profile.full_name} · ` : ""}Monitor saved locations, human-approved public advisories, preparedness checklists, and SOS assistance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/citizen/locations"
            className="btn secondary small flex items-center gap-1.5"
          >
            Manage Locations
          </Link>
          <Link
            href="/citizen/sos"
            className="btn primary small flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Emergency SOS
          </Link>
        </div>
      </div>

      {/* Provenance Notice */}
      <div className="notice flex items-center justify-between gap-4 flex-wrap">
        <span>
          <strong className="text-[#FFFFFF]">DATA STATUS · SAMPLE PREVIEW:</strong> Citizen portal data is illustrative. Only human-approved advisories appear in this feed; do not rely on this research prototype as an official government warning channel.
        </span>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#141414] text-[#A1A1AA] border border-[#A1A1AA]/20">
          HUMAN-APPROVED ONLY
        </span>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Saved locations</span>
            <MapPin className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#FFFFFF]">02</div>
          <div className="text-[11px] font-mono text-[#A1A1AA]">Patna Main · Danapur</div>
        </div>

        <div className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Published advisories</span>
            <Bell className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#FFFFFF]">01</div>
          <div className="text-[11px] font-mono text-[#F59E0B]">Human-approved · SAMPLE</div>
        </div>

        <div className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Open SOS requests</span>
            <AlertTriangle className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#FFFFFF]">00</div>
          <div className="text-[11px] font-mono text-[#A69B88]">No active requests</div>
        </div>

        <div className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span>Nearest station stage</span>
            <Activity className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#FFFFFF]">{PATNA_GANDHI_GHAT.currentStage.toFixed(2)} m</div>
          <div className="text-[11px] font-mono text-[#A69B88]">{PATNA_GANDHI_GHAT.id} · Synthetic preview</div>
        </div>
      </div>

      {/* Row 1: Location Overview Map & Published Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Overview with Map */}
        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
            <div>
              <h3 className="text-sm font-bold text-[#A1A1AA]">Location Overview · Nearby Station Status</h3>
              <p className="text-xs text-[#A69B88]">Gandhighat (STN-PAT-01) & Digha Reach</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#141414] text-[#A1A1AA] border border-[#A1A1AA]/20">
              SAMPLE MAP
            </span>
          </div>
          <div className="h-[240px] rounded-xl overflow-hidden border border-[#A1A1AA]/15 relative">
            <TacticalMapSvg />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#000000] border border-[#A1A1AA]/12">
              <span className="text-[10px] text-[#A69B88] block">NEAREST GAUGE</span>
              <span className="text-[#FFFFFF] font-bold">STN-PAT-01</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#000000] border border-[#A1A1AA]/12">
              <span className="text-[10px] text-[#A69B88] block">STAGE / WARN</span>
              <span className="text-[#FFFFFF] font-bold">{PATNA_GANDHI_GHAT.currentStage.toFixed(2)} / {PATNA_GANDHI_GHAT.warningLevel.toFixed(2)}m</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#000000] border border-[#A1A1AA]/12">
              <span className="text-[10px] text-[#A69B88] block">CORRIDOR RISK</span>
              <span className="text-[#F59E0B] font-bold">WATCH</span>
            </div>
          </div>
        </div>

        {/* Published Advisories & Alert History */}
        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
              <div>
                <h3 className="text-sm font-bold text-[#A1A1AA]">Published Advisories & Alert History</h3>
                <p className="text-xs text-[#A69B88]">Human-authorized public advisories for your saved wards</p>
              </div>
              <Link href="/citizen/alerts" className="text-xs font-mono text-[#FFFFFF] hover:underline">
                Full history →
              </Link>
            </div>

            <div className="divide-y divide-[#A1A1AA]/10">
              <div className="py-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono text-[#FFFFFF] uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Commander Authorized · CAP-2026-PAT-09
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                    Advisory · SAMPLE
                  </span>
                </div>
                <strong className="text-sm text-[#FFFFFF] block">
                  River Stage Watch · Patna Lowland Corridor (Wards 01–12)
                </strong>
                <p className="text-xs text-[#A69B88] leading-relaxed">
                  Synthetic preview scenario: the sample stage is {PATNA_GANDHI_GHAT.currentStage.toFixed(2)} m against a {PATNA_GANDHI_GHAT.warningLevel.toFixed(2)} m warning threshold. Follow current official local guidance for real conditions.
                </p>
              </div>

              <div className="py-3 flex items-center justify-between gap-3">
                <div>
                  <strong className="text-xs text-[#FFFFFF] block">Gandhighat Sector · Baseline Bulletin</strong>
                  <small className="text-[11px] text-[#A69B88] font-mono">05 Nov 2026 · Sample stage 46.40 m within configured preview bounds</small>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#FFFFFF]/15 text-[#FFFFFF] border border-[#FFFFFF]/30">
                  Cleared
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#A1A1AA]/12 flex items-center justify-between text-xs">
            <span className="text-[#A69B88]">Need immediate flood evacuation or medical assistance?</span>
            <Link href="/citizen/sos" className="text-[#FFFFFF] font-semibold hover:underline flex items-center gap-1">
              Open SOS Desk <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Saved Locations & Flood Preparedness Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Locations */}
        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
            <div>
              <h3 className="text-sm font-bold text-[#A1A1AA]">Saved Locations</h3>
              <p className="text-xs text-[#A69B88]">Coarse ward-level monitoring zones</p>
            </div>
            <Link href="/citizen/locations" className="text-xs font-mono text-[#FFFFFF] hover:underline">
              Add / Edit →
            </Link>
          </div>
          <div className="divide-y divide-[#A1A1AA]/10">
            <div className="py-3.5 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-[#FFFFFF] block">Patna · Primary Residence (Gandhighat Reach)</strong>
                <small className="text-[11px] text-[#A69B88] font-mono">Station {PATNA_GANDHI_GHAT.id} · {PATNA_GANDHI_GHAT.currentStage.toFixed(2)} m · Alert radius 5 km · SAMPLE</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#FFFFFF]/15 text-[#FFFFFF] border border-[#FFFFFF]/30">
                Primary
              </span>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-[#FFFFFF] block">Danapur · Family Residence (West Reach)</strong>
                <small className="text-[11px] text-[#A69B88] font-mono">Station STN-PAT-02 · 50.45 m · Alert radius 5 km</small>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                Watch
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Flood Preparedness Checklist */}
        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
            <div>
              <h3 className="text-sm font-bold text-[#A1A1AA]">Flood Preparedness Checklist</h3>
              <p className="text-xs text-[#A69B88]">Pre-event, during-event, and post-event safety steps</p>
            </div>
            <Link href="/citizen/safety" className="text-xs font-mono text-[#FFFFFF] hover:underline">
              Safety Guide →
            </Link>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full text-left p-3 rounded-xl bg-[#000000] border border-[#A1A1AA]/12 hover:border-[#FFFFFF]/40 transition-colors flex items-start gap-3"
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    item.done ? "text-[#FFFFFF]" : "text-[#A69B88]/40"
                  }`}
                />
                <div className="flex-1">
                  <span
                    className={`text-xs block ${
                      item.done ? "line-through text-[#A69B88]" : "text-[#FFFFFF] font-medium"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#FFFFFF] uppercase">{item.phase}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
