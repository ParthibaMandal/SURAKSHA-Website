"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";

export default function CitizenSosPage() {
  const { profile } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [citizenName, setCitizenName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [urgency, setUrgency] = useState<"LOW" | "MEDIUM" | "HIGH">("HIGH");
  const [assistanceType, setAssistanceType] = useState<string>("Rescue / evacuation support");
  const [people, setPeople] = useState<string>("1 person");
  const [registeredTicket, setRegisteredTicket] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    if (profile?.full_name) {
      setCitizenName(profile.full_name);
    }
  }, [profile]);

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

      setRegisteredTicket({ id: result.id.slice(0, 8).toUpperCase(), status: result.status });
      setSubmitted(true);
      setToast(`Request ${result.id.slice(0, 8).toUpperCase()} was saved. This does not confirm a rescue dispatch.`);
    } catch (cause) {
      setErrorMessage(cause instanceof Error ? cause.message : "The request could not be saved. Please call emergency services if immediate help is needed.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#FFFFFF]/40 text-xs font-mono text-[#A1A1AA] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" /> {toast}
        </div>
      )}
      {errorMessage && (
        <div role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">
          {errorMessage}
        </div>
      )}

      {/* Heading */}
      <div className="pb-4 border-b border-[#A1A1AA]/15">
        <div className="eyebrow">CITIZEN WORKSPACE</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#A1A1AA] tracking-tight">
          Emergency SOS Assistance
        </h1>
        <p className="text-xs text-[#A69B88] mt-1">
          Submit a structured request for flood evacuation, medical support, or essential supplies.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="p-4 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 text-[#A1A1AA] flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-[#FFFFFF] font-bold block">
            For immediate life-threatening danger, call your official national emergency helpline (112 / NDRF).
          </strong>
          <p className="text-[#A69B88]">
            Do not rely on this research prototype as an authoritative government emergency response channel.
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: New assistance request */}
        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
            <h3 className="text-sm font-bold text-[#A1A1AA]">New Assistance Request</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
              RESEARCH PROTOTYPE
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                  Citizen Name
                </label>
                <input
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#000000] text-xs text-[#A1A1AA] focus:outline-none focus:border-[#FFFFFF]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                  Contact Number
                </label>
                <input
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#000000] text-xs text-[#A1A1AA] focus:outline-none focus:border-[#FFFFFF]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#000000] text-xs text-[#A1A1AA] focus:outline-none focus:border-[#FFFFFF]"
              >
                <option value="LOW">Low · Supplies or non-urgent support</option>
                <option value="MEDIUM">Medium · Assistance needed soon</option>
                <option value="HIGH">High · Urgent danger or evacuation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                Type of Assistance
              </label>
              <select
                value={assistanceType}
                onChange={(e) => setAssistanceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#000000] text-xs text-[#A1A1AA] focus:outline-none focus:border-[#FFFFFF]"
              >
                <option>Rescue / evacuation support</option>
                <option>Medical assistance</option>
                <option>Food / drinking water</option>
                <option>Other emergency needs</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                Location / Ward Landmark
              </label>
              <input
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Near Gandhighat Ward 04, Patna"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#000000] text-xs text-[#A1A1AA] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#FFFFFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                People Affected
              </label>
              <select
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#000000] text-xs text-[#A1A1AA] focus:outline-none focus:border-[#FFFFFF]"
              >
                <option>1 person</option>
                <option>2–5 people</option>
                <option>6–10 people</option>
                <option>More than 10</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                Notes & Hazard Conditions
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe water depth, structural access, or medical needs."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#000000] text-xs text-[#A1A1AA] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#FFFFFF]"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Assistance Request"} <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Right: Request Status Tracking */}
        <div className="p-6 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
              <h3 className="text-sm font-bold text-[#A1A1AA]">Request Status Tracking</h3>
              <span className="text-xs font-mono text-[#A69B88]">
                {submitted ? "1 Active Ticket" : "0 Active"}
              </span>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl border border-[#FFFFFF]/30 bg-[#000000] space-y-2.5 mt-4 font-mono text-xs">
                <div className="text-[#FFFFFF] font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Request Registered
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FFFFFF]/15 text-[11px] border border-[#FFFFFF]/40">
                    {registeredTicket ? registeredTicket.id : "SOS-CONFIRMED"}
                  </span>
                </div>
                <div className="text-[#A1A1AA]">Citizen: {citizenName}</div>
                <div className="text-[#A1A1AA]">Category: {assistanceType}</div>
                <div className="text-[#A1A1AA]">Location: {location || "Patna Lowland"}</div>
                <div className="text-[#A1A1AA]">Affected: {people}</div>
                <div className="text-[11px] text-[#A69B88] pt-2 border-t border-[#A1A1AA]/12 flex items-center justify-between">
                  <span>Status: Saved · Awaiting review</span>
                  <span className="text-[#F59E0B] font-semibold">{registeredTicket?.status || "PENDING"}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <strong className="text-sm text-[#FFFFFF] block">No active SOS requests</strong>
                <p className="text-xs text-[#A69B88]">
                  After submission, this page confirms the saved request. It does not provide live dispatch tracking.
                </p>
              </div>
            )}
          </div>

          <p className="text-[10px] text-[#A69B88] leading-relaxed pt-4 border-t border-[#A1A1AA]/12">
            Personal information submitted during emergencies is confidential and restricted to authorized disaster-response operators.
          </p>
        </div>
      </div>
    </div>
  );
}
