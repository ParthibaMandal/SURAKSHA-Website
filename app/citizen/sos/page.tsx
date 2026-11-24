"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Send, CheckCircle2, PhoneCall, Clock, MapPin, ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";

interface SOSRequest {
  id: string;
  citizen_name: string;
  contact_phone: string;
  location_name: string;
  urgency: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  status: string;
  created_at: string;
}

export default function CitizenSosPage() {
  const { profile } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState<boolean>(true);
  const [myRequests, setMyRequests] = useState<SOSRequest[]>([]);

  // Form fields
  const [citizenName, setCitizenName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [urgency, setUrgency] = useState<"LOW" | "MEDIUM" | "HIGH">("HIGH");
  const [assistanceType, setAssistanceType] = useState<string>("Rescue / evacuation support");
  const [people, setPeople] = useState<string>("1 person");

  const loadRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    try {
      const response = await fetch("/api/flood/sos", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setMyRequests(data);
        }
      }
    } catch {
      // Non-critical background fetch error
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  useEffect(() => {
    if (profile?.full_name) {
      setCitizenName(profile.full_name);
    }
    loadRequests();
  }, [profile, loadRequests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/flood/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          citizen_name: citizenName,
          contact_phone: phoneNumber,
          location_name: location,
          urgency,
          description: `${assistanceType} (${people}): ${details}`,
        }),
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.detail || "The request could not be saved.");

      setToast(`Request #${result.id.slice(0, 8).toUpperCase()} logged successfully.`);
      setDetails("");
      // Reload previous requests list
      loadRequests();
    } catch (cause) {
      setErrorMessage(
        cause instanceof Error
          ? cause.message
          : "The request could not be saved. Please call emergency services directly if immediate help is needed."
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-zinc-900 border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
      {errorMessage && (
        <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      {/* Heading */}
      <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-1">
            Citizen Assistance Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Emergency SOS & Assistance
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Submit a structured request for flood evacuation, medical support, or essential relief supplies.
          </p>
        </div>
        <button
          type="button"
          onClick={loadRequests}
          disabled={isLoadingRequests}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRequests ? "animate-spin" : ""}`} />
          <span>Refresh Tickets</span>
        </button>
      </div>

      {/* Official Emergency Helplines Direct-Dial Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href="tel:112"
          className="flex items-center justify-between p-3.5 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-900/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 grid place-items-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">National Emergency</div>
              <div className="text-[11px] font-mono text-red-400 font-bold">112 (Police / Fire / Ambulance)</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 group-hover:bg-red-500 group-hover:text-black transition-colors">
            CALL NOW
          </span>
        </a>

        <a
          href="tel:1078"
          className="flex items-center justify-between p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 hover:bg-amber-900/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 grid place-items-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">NDRF Disaster Control</div>
              <div className="text-[11px] font-mono text-amber-400 font-bold">1078 (Flood Rescue Desk)</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-black transition-colors">
            CALL NOW
          </span>
        </a>

        <a
          href="tel:1070"
          className="flex items-center justify-between p-3.5 rounded-xl border border-sky-500/30 bg-sky-950/20 hover:bg-sky-900/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 grid place-items-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">State Disaster Authority</div>
              <div className="text-[11px] font-mono text-sky-400 font-bold">1070 (Bihar Emergency)</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 group-hover:bg-sky-500 group-hover:text-black transition-colors">
            CALL NOW
          </span>
        </a>
      </div>

      {/* Emergency Advisory Notice */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-zinc-300 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <strong className="text-white font-semibold block">
            For imminent life-threatening danger, dial 112 immediately.
          </strong>
          <p className="text-zinc-400 leading-relaxed">
            Requests submitted here are categorized and queued for response coordinators and civil defense volunteers. In rapid flash floods, phone helplines remain the fastest lifeline.
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: New assistance request */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white">New Assistance Request</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              DISASTER PROTOCOL
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                  Citizen Name
                </label>
                <input
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-black text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                  Contact Number
                </label>
                <input
                  required
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-black text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-black text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="HIGH">High · Critical danger / evacuation</option>
                  <option value="MEDIUM">Medium · Water rising / medical need</option>
                  <option value="LOW">Low · Food / dry supplies needed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                  Type of Assistance
                </label>
                <select
                  value={assistanceType}
                  onChange={(e) => setAssistanceType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-black text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option>Rescue / evacuation support</option>
                  <option>Medical assistance & first aid</option>
                  <option>Food & potable drinking water</option>
                  <option>Elderly / infant evacuation</option>
                  <option>Other critical need</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                  Location / Landmark
                </label>
                <input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Near Gandhi Ghat Ward 04, Patna"
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-black text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                  People Stranded
                </label>
                <select
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-black text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option>1 person</option>
                  <option>2–5 people</option>
                  <option>6–10 people</option>
                  <option>More than 10 people</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                Hazard Details & Instructions
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Indicate water depth, rooftop access, presence of sick individuals, or power line hazards."
                className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-black text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
            >
              {isSubmitting ? "Logging Request..." : "Submit Assistance Request"} <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Right: Submitted Requests & Status Tracking */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/90 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">Your Submitted Requests</h3>
              <span className="text-xs font-mono text-zinc-400">
                {myRequests.length} {myRequests.length === 1 ? "Record" : "Records"}
              </span>
            </div>

            {isLoadingRequests ? (
              <div className="py-12 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Loading your assistance tickets...</span>
              </div>
            ) : myRequests.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <ShieldAlert className="w-8 h-8 text-zinc-600 mx-auto" />
                <strong className="text-sm text-zinc-200 block">No active assistance tickets</strong>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  When you submit an emergency assistance request, its live status and dispatch updates will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {myRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-2 font-sans text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-emerald-400 font-bold text-[11px]">
                        #{req.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                          req.status === "OPEN"
                            ? "bg-red-500/15 text-red-400 border-red-500/30"
                            : req.status === "IN_REVIEW"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : req.status === "DISPATCHED"
                            ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        {req.status.replaceAll("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{req.location_name}</span>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-900/50 p-2 rounded-lg border border-white/5">
                      {req.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(req.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-zinc-400">{req.urgency} Urgency</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed pt-3 border-t border-white/10">
            Emergency requests are routed to local coordinators. For immediate life-saving rescue, ensure you have also dialed 112.
          </p>
        </div>
      </div>
    </div>
  );
}
