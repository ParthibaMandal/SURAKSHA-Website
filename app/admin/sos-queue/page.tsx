"use client";

import React, { useState, useEffect } from "react";
import { Lock, CheckCircle2, RefreshCw } from "lucide-react";

interface SOSItem {
  id: string;
  citizen_name: string;
  phone_number: string;
  emergency_type: string;
  severity: string;
  people_count: number;
  latitude: number;
  longitude: number;
  landmark_address: string;
  status: string;
  assigned_team?: string | null;
  notes?: string | null;
  created_at: string;
}

export default function AdminSosQueuePage() {
  const [toast, setToast] = useState<string | null>(null);
  const [queue, setQueue] = useState<SOSItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/flood/sos", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setQueue(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleDispatch = (id: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "DISPATCHED", assigned_team: "NDRF Fast-Response Boat 01" }
          : item
      )
    );
    showToast(`Rescue dispatch unit assigned to ticket ${id}.`);
  };

  const handleResolve = (id: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "RESCUED" } : item
      )
    );
    showToast(`Ticket ${id} marked as RESCUED.`);
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
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D8CBB3] tracking-tight">
            Emergency SOS Management
          </h1>
          <p className="text-xs text-[#A69B88] mt-1">
            Operational triage and dispatch desk for citizen flood assistance requests.
          </p>
        </div>
        <button
          onClick={fetchQueue}
          disabled={loading}
          className="btn secondary small flex items-center gap-2 self-start sm:self-auto text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Queue
        </button>
      </div>

      {/* Alert Banner */}
      <div className="p-4 rounded-xl border border-[#D8CBB3]/20 bg-[#292925] text-[#D8CBB3] flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-[#06B6D4] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-[#EDE4D3] font-bold block">Restricted operational view · SAMPLE / SYNTHETIC QUEUE</strong>
          <p className="text-[#A69B88]">
            Citizen location and contact data is strictly governed under emergency disaster management privacy policies.
          </p>
        </div>
      </div>

      {/* Incoming Requests Table Panel */}
      <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
          <h3 className="text-sm font-bold text-[#D8CBB3]">Assistance Queue</h3>
          <span className="text-xs font-mono text-[#06B6D4]">
            {queue.filter((q) => q.status === "PENDING").length} Pending Triage · {queue.length} Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#D8CBB3]/15 text-[#A69B88] uppercase text-[10px]">
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Citizen & Phone</th>
                <th className="py-2.5 px-3">Location Landmark</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">People</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Assigned Unit</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8CBB3]/10">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-[#33332E]/50 transition-colors">
                  <td className="py-3 px-3 text-[#06B6D4] font-bold">{item.id}</td>
                  <td className="py-3 px-3">
                    <div className="text-[#EDE4D3] font-semibold font-sans">{item.citizen_name}</div>
                    <div className="text-[11px] text-[#A69B88]">{item.phone_number}</div>
                  </td>
                  <td className="py-3 px-3 text-[#D8CBB3] max-w-xs truncate" title={item.landmark_address}>
                    {item.landmark_address}
                  </td>
                  <td className="py-3 px-3 text-[#A69B88]">
                    {item.emergency_type.replace("_", " ")}
                  </td>
                  <td className="py-3 px-3 text-[#EDE4D3] font-bold">{item.people_count}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        item.status === "PENDING"
                          ? "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30"
                          : item.status === "DISPATCHED"
                          ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-[#D8CBB3]">
                    {item.assigned_team || "Unassigned"}
                  </td>
                  <td className="py-3 px-3">
                    {item.status === "PENDING" ? (
                      <button
                        onClick={() => handleDispatch(item.id)}
                        className="px-2.5 py-1 rounded bg-[#06B6D4] text-[11px] text-white font-semibold hover:bg-[#38BDF8] transition-colors"
                      >
                        Dispatch
                      </button>
                    ) : item.status === "DISPATCHED" ? (
                      <button
                        onClick={() => handleResolve(item.id)}
                        className="px-2.5 py-1 rounded bg-[#33332E] border border-[#D8CBB3]/30 text-[11px] text-[#D8CBB3] hover:bg-[#1E1E1C] transition-colors"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#A69B88] font-sans">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
