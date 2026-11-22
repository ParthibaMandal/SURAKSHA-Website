"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, Search } from "lucide-react";

export default function AdminIncidentsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("ALL");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const incidents = [
    {
      id: "INC-2026-01",
      title: "Ganga / Patna Corridor Scenario",
      area: "Patna Urban Reach",
      phase: "Pre-event",
      recordType: "SYNTHETIC",
      updated: "06 Nov 2026",
      status: "Demo",
    },
    {
      id: "INC-2026-02",
      title: "Upstream Sone Confluence Rise",
      area: "Upper Catchment · Maner",
      phase: "Active event",
      recordType: "SYNTHETIC",
      updated: "06 Nov 2026",
      status: "Active",
    },
    {
      id: "INC-2026-03",
      title: "Kosi Basin Post-Monsoon Assessment",
      area: "North Bihar Reach",
      phase: "Post-event",
      recordType: "SAMPLE",
      updated: "02 Nov 2026",
      status: "Review",
    },
  ];

  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.area.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase());
    const matchesPhase = phaseFilter === "ALL" || inc.phase === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#FFFFFF]/40 text-xs font-mono text-[#A1A1AA] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#A1A1AA]/15">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#A1A1AA] tracking-tight">
            Incident Management
          </h1>
          <p className="text-xs text-[#A69B88] mt-1">
            Create and track structured flood incidents across Pre-Event, Active Event, and Post-Event phases.
          </p>
        </div>
        <button
          onClick={() => showToast("Synthetic incident record created in workspace.")}
          className="btn primary small self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Create Incident
        </button>
      </div>

      {/* Search / Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A69B88] absolute left-3.5 top-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incidents by ID, title, or study area..."
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#0A0A0A] text-xs text-[#A1A1AA] placeholder:text-[#A69B88]/60 focus:outline-none focus:border-[#FFFFFF]"
          />
        </div>
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#0A0A0A] text-xs text-[#A1A1AA] focus:outline-none focus:border-[#FFFFFF]"
        >
          <option value="ALL">All phases</option>
          <option value="Pre-event">Pre-event</option>
          <option value="Active event">Active event</option>
          <option value="Post-event">Post-event</option>
        </select>
      </div>

      {/* Incident Register Panel */}
      <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
          <h3 className="text-sm font-bold text-[#A1A1AA]">Incident Register</h3>
          <span className="text-xs font-mono text-[#A69B88]">{filtered.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#A1A1AA]/15 text-[#A69B88] uppercase text-[10px]">
                <th className="py-2.5 px-3">Incident</th>
                <th className="py-2.5 px-3">Study Area</th>
                <th className="py-2.5 px-3">Event Phase</th>
                <th className="py-2.5 px-3">Data Provenance</th>
                <th className="py-2.5 px-3">Updated</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A1A1AA]/10">
              {filtered.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#141414]/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#FFFFFF] font-sans">{inc.title}</div>
                    <div className="text-[10px] text-[#FFFFFF]">{inc.id}</div>
                  </td>
                  <td className="py-3 px-3 text-[#A1A1AA]">{inc.area}</td>
                  <td className="py-3 px-3 text-[#A1A1AA]">{inc.phase}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#000000] text-[#A1A1AA] border border-[#A1A1AA]/20">
                      {inc.recordType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#A69B88]">{inc.updated}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        inc.status === "Active"
                          ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#FFFFFF]/15 text-[#FFFFFF] border-[#FFFFFF]/30"
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Lifecycle Panel */}
      <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
          <h3 className="text-sm font-bold text-[#A1A1AA]">Incident Lifecycle Structure</h3>
          <span className="pill text-[10px]">LIFECYCLE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-[#A1A1AA]/15 bg-[#000000] space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-[#FFFFFF]">PHASE 01 · PREPARE</div>
            <h4 className="text-sm font-bold text-[#FFFFFF]">Pre-Event</h4>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Station readiness, ensemble forecast verification, and pre-event advisory staging.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#F59E0B]/30 bg-[#000000] space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-[#F59E0B]">PHASE 02 · RESPOND</div>
            <h4 className="text-sm font-bold text-[#FFFFFF]">Active Event</h4>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Incident coordination, SAR inundation evidence updates, and supervised CAP dispatch.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#A1A1AA]/15 bg-[#000000] space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-[#A1A1AA]">PHASE 03 · RECOVER</div>
            <h4 className="text-sm font-bold text-[#FFFFFF]">Post-Event</h4>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Impact dossier archival, recovery tracking, and post-event model calibration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
