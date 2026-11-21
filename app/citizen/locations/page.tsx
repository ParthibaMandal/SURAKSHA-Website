"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, Trash2, Edit3 } from "lucide-react";

interface SavedLocation {
  id: string;
  name: string;
  area: string;
  subscription: string;
  station: string;
  state: string;
}

export default function CitizenLocationsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [locations, setLocations] = useState<SavedLocation[]>([
    {
      id: "LOC-01",
      name: "Patna · Central Residence",
      area: "Gandhighat Corridor (Ward 04)",
      subscription: "Advisory, Watch, Warning",
      station: "STN-PAT-01 (49.82 m)",
      state: "Active",
    },
    {
      id: "LOC-02",
      name: "Danapur · Family Residence",
      area: "Western Confluence Sector",
      subscription: "Warning & Emergency only",
      station: "STN-PAT-02 (50.45 m)",
      state: "Watch",
    },
  ]);
  const [newName, setNewName] = useState("");
  const [newArea, setNewArea] = useState("Patna East Reach");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const item: SavedLocation = {
      id: `LOC-0${locations.length + 1}`,
      name: newName.trim(),
      area: newArea,
      subscription: "Advisory, Watch, Warning",
      station: "STN-PAT-01 (49.82 m)",
      state: "Active",
    };
    setLocations((prev) => [...prev, item]);
    setNewName("");
    showToast(`Added monitored location: ${item.name}`);
  };

  const handleRemove = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
    showToast(`Removed location ${id}.`);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#292925] border border-[#06B6D4]/40 text-xs font-mono text-[#D8CBB3] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CBB3]/15">
        <div>
          <div className="eyebrow">CITIZEN WORKSPACE</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D8CBB3] tracking-tight">
            Saved Locations
          </h1>
          <p className="text-xs text-[#A69B88] mt-1">
            Add, edit, remove, and inspect monitored geographic areas for human-approved flood advisories.
          </p>
        </div>
      </div>

      {/* Add New Location Form */}
      <form
        onSubmit={handleAdd}
        className="p-5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
      >
        <div className="flex-1 space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#A69B88]">
            Location Label
          </label>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g., Kankarbagh Workplace"
            className="w-full px-3.5 py-2 rounded-lg bg-[#1E1E1C] border border-[#D8CBB3]/20 text-xs text-[#D8CBB3] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#06B6D4]"
          />
        </div>
        <div className="sm:w-56 space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#A69B88]">
            Corridor / Reach
          </label>
          <select
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-[#1E1E1C] border border-[#D8CBB3]/20 text-xs text-[#D8CBB3] focus:outline-none focus:border-[#06B6D4]"
          >
            <option>Patna East Reach</option>
            <option>Gandhighat Urban Sector</option>
            <option>Danapur Confluence</option>
            <option>Hajipur North Bank</option>
          </select>
        </div>
        <button type="submit" className="btn primary small flex items-center justify-center gap-1.5 h-[34px]">
          <Plus className="w-3.5 h-3.5" /> Add Location
        </button>
      </form>

      {/* Saved Locations Table Panel */}
      <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
          <h3 className="text-sm font-bold text-[#D8CBB3]">Monitored Locations</h3>
          <span className="text-xs font-mono text-[#A69B88]">{locations.length} Saved · SAMPLE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#D8CBB3]/15 text-[#A69B88] uppercase text-[10px]">
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Area Context</th>
                <th className="py-2.5 px-3">Linked Station</th>
                <th className="py-2.5 px-3">Alert Subscription</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8CBB3]/10">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-[#33332E]/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#EDE4D3] font-sans">{loc.name}</td>
                  <td className="py-3 px-3 text-[#D8CBB3]">{loc.area}</td>
                  <td className="py-3 px-3 text-[#06B6D4]">{loc.station}</td>
                  <td className="py-3 px-3 text-[#A69B88]">{loc.subscription}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        loc.state === "Watch"
                          ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30"
                      }`}
                    >
                      {loc.state}
                    </span>
                  </td>
                  <td className="py-3 px-3 flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Updated alert radius for ${loc.name}.`)}
                      className="px-2.5 py-1 rounded bg-[#33332E] border border-[#D8CBB3]/20 text-[11px] text-[#D8CBB3] hover:border-[#06B6D4] flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleRemove(loc.id)}
                      className="px-2.5 py-1 rounded bg-[#1E1E1C] border border-[#EF4444]/30 text-[11px] text-[#EF4444] hover:bg-[#EF4444]/10 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice */}
      <div className="notice">
        Precise street addresses are not retained. Only coarse ward-level spatial coordinates are stored to match public advisory polygons.
      </div>
    </div>
  );
}
