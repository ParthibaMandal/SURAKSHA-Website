"use client";

import React, { useState, useEffect } from "react";
import { Lock, RefreshCw } from "lucide-react";

interface SOSItem {
  id: string;
  citizen_name: string;
  contact_phone: string;
  urgency: string;
  description: string;
  location_name: string;
  status: string;
  created_at: string;
}

export default function AdminSosQueuePage() {
  const [queue, setQueue] = useState<SOSItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/flood/sos", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "The assistance queue is unavailable.");
      setQueue(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The assistance queue is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="space-y-6">

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#A1A1AA]/15">
        <div>
          <div className="eyebrow">OPERATIONS WORKSPACE</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#A1A1AA] tracking-tight">
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
      <div className="p-4 rounded-xl border border-[#A1A1AA]/20 bg-[#0A0A0A] text-[#A1A1AA] flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-[#FFFFFF] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-[#FFFFFF] font-bold block">Restricted view · Assistance records</strong>
          <p className="text-[#A69B88]">
            Records shown here were saved by authenticated citizens. This prototype does not dispatch response teams.
          </p>
        </div>
      </div>

      {/* Incoming Requests Table Panel */}
      <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
          <h3 className="text-sm font-bold text-[#A1A1AA]">Assistance Queue</h3>
          <span className="text-xs font-mono text-[#FFFFFF]">
            {queue.filter((q) => q.status === "OPEN").length} Open · {queue.length} Total
          </span>
        </div>

        {error && <div role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</div>}
        {!loading && !error && queue.length === 0 && <p className="py-8 text-center text-sm text-[#A69B88]">No assistance requests have been submitted.</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#A1A1AA]/15 text-[#A69B88] uppercase text-[10px]">
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Citizen & Phone</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Urgency & details</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A1A1AA]/10">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-[#141414]/50 transition-colors">
                  <td className="py-3 px-3 text-[#FFFFFF] font-bold">{item.id}</td>
                  <td className="py-3 px-3">
                    <div className="text-[#FFFFFF] font-semibold font-sans">{item.citizen_name}</div>
                    <div className="text-[11px] text-[#A69B88]">{item.contact_phone}</div>
                  </td>
                  <td className="py-3 px-3 text-[#A1A1AA] max-w-xs">
                    {item.location_name}
                  </td>
                  <td className="py-3 px-3 text-[#A1A1AA] max-w-xs">
                    <div className="font-semibold">{item.urgency}</div>
                    <div className="text-[11px] text-[#A69B88] whitespace-normal">{item.description}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        item.status === "OPEN"
                          ? "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30"
                          : item.status === "IN_REVIEW"
                          ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#FFFFFF]/15 text-[#FFFFFF] border-[#FFFFFF]/30"
                      }`}
                    >
                      {item.status.replaceAll("_", " ")}
                    </span>
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
