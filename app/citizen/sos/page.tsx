"use client";

import React, { useState } from "react";
import { AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CitizenSosPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [citizenName, setCitizenName] = useState<string>("Ramesh Patel");
  const [phoneNumber, setPhoneNumber] = useState<string>("+91-9876543210");
  const [location, setLocation] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [assistanceType, setAssistanceType] = useState<string>("Rescue / evacuation support");
  const [people, setPeople] = useState<string>("1 person");
  const [registeredTicket, setRegisteredTicket] = useState<{ id: string; status: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/flood/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizen_name: citizenName,
          phone_number: phoneNumber,
          emergency_type: assistanceType.includes("Medical")
            ? "MEDICAL"
            : assistanceType.includes("Food")
            ? "FOOD_WATER"
            : "TRAPPED_WATER",
          severity: "CRITICAL",
          people_count: parseInt(people) || 1,
          latitude: 25.631,
          longitude: 85.112,
          landmark_address: location,
          additional_notes: details,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRegisteredTicket({ id: data.id, status: data.status });
        setSubmitted(true);
        setToast(`Emergency ticket ${data.id} registered into tactical rescue queue.`);
      } else {
        setSubmitted(true);
        setToast("Emergency request logged into local dispatch simulation.");
      }
    } catch {
      setSubmitted(true);
      setToast("Emergency request registered in offline simulation mode.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#292925] border border-[#2F6BFF]/40 text-xs font-mono text-[#D8CBB3] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2F6BFF]" /> {toast}
        </div>
      )}

      {/* Heading */}
      <div className="pb-4 border-b border-[#D8CBB3]/15">
        <div className="eyebrow">CITIZEN WORKSPACE</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D8CBB3] tracking-tight">
          Emergency SOS Assistance
        </h1>
        <p className="text-xs text-[#A69B88] mt-1">
          Submit a structured request for flood evacuation, medical support, or essential supplies.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="p-4 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 text-[#D8CBB3] flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <strong className="text-[#EDE4D3] font-bold block">
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
        <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
            <h3 className="text-sm font-bold text-[#D8CBB3]">New Assistance Request</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
              DEMO DESK
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
                  Citizen Name
                </label>
                <input
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] focus:outline-none focus:border-[#2F6BFF]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
                  Contact Number
                </label>
                <input
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] focus:outline-none focus:border-[#2F6BFF]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
                Type of Assistance
              </label>
              <select
                value={assistanceType}
                onChange={(e) => setAssistanceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] focus:outline-none focus:border-[#2F6BFF]"
              >
                <option>Rescue / evacuation support</option>
                <option>Medical assistance</option>
                <option>Food / drinking water</option>
                <option>Other emergency needs</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
                Location / Ward Landmark
              </label>
              <input
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Near Gandhighat Ward 04, Patna"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#2F6BFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
                People Affected
              </label>
              <select
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] focus:outline-none focus:border-[#2F6BFF]"
              >
                <option>1 person</option>
                <option>2–5 people</option>
                <option>6–10 people</option>
                <option>More than 10</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
                Notes & Hazard Conditions
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe water depth, structural access, or medical needs."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#2F6BFF]"
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
        <div className="p-6 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/12">
              <h3 className="text-sm font-bold text-[#D8CBB3]">Request Status Tracking</h3>
              <span className="text-xs font-mono text-[#A69B88]">
                {submitted ? "1 Active Ticket" : "0 Active"}
              </span>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl border border-[#2F6BFF]/30 bg-[#1E1E1C] space-y-2.5 mt-4 font-mono text-xs">
                <div className="text-[#2F6BFF] font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Request Registered
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#2F6BFF]/15 text-[11px] border border-[#2F6BFF]/40">
                    {registeredTicket ? registeredTicket.id : "SOS-CONFIRMED"}
                  </span>
                </div>
                <div className="text-[#D8CBB3]">Citizen: {citizenName}</div>
                <div className="text-[#D8CBB3]">Category: {assistanceType}</div>
                <div className="text-[#D8CBB3]">Location: {location || "Patna Lowland"}</div>
                <div className="text-[#D8CBB3]">Affected: {people}</div>
                <div className="text-[11px] text-[#A69B88] pt-2 border-t border-[#D8CBB3]/12 flex items-center justify-between">
                  <span>Status: Queued in Operations Triage</span>
                  <span className="text-[#F59E0B] font-semibold">{registeredTicket?.status || "PENDING"}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <strong className="text-sm text-[#EDE4D3] block">No active SOS requests</strong>
                <p className="text-xs text-[#A69B88]">
                  Submitted requests appear here with live triage status from the Operations Command Centre.
                </p>
              </div>
            )}
          </div>

          <p className="text-[10px] text-[#A69B88] leading-relaxed pt-4 border-t border-[#D8CBB3]/12">
            Personal information submitted during emergencies is confidential and restricted to authorized disaster-response operators.
          </p>
        </div>
      </div>
    </div>
  );
}
