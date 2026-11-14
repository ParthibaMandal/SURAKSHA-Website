"use client";

import React, { useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="default" className="mb-3">
            CONNECT WITH RESEARCHERS
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#D8CBB3] tracking-tight">
            Research & Institutional Inquiries
          </h1>
          <p className="text-base text-[#A69B88] mt-4 leading-relaxed">
            SURAKSHA is developed as an academic flood-intelligence research project. We welcome peer reviews, hydrological calibration datasets, and disaster-management research inquiries.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#292925] p-8">
          {submitted && (
            <div className="mb-6 p-3.5 rounded-lg bg-[#2F6BFF]/15 border border-[#2F6BFF]/30 text-xs font-mono text-[#EDE4D3] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2F6BFF]" /> Academic inquiry recorded in local preview log.
            </div>
          )}
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#D8CBB3] uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <Input required placeholder="Dr. S. Kumar" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#D8CBB3] uppercase tracking-wider mb-2">
                  Affiliation / University
                </label>
                <Input required placeholder="National Institute of Hydrology" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#D8CBB3] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <Input required type="email" placeholder="researcher@institute.edu" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#D8CBB3] uppercase tracking-wider mb-2">
                Inquiry Focus
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share your interest in numerical modeling, sensor deployment, or supervisory gate architectures..."
                className="w-full rounded-lg border border-[#D8CBB3]/20 bg-[#1E1E1C] px-3 py-2 text-sm text-[#D8CBB3] placeholder:text-[#A69B88]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto flex items-center gap-2">
              <Send className="w-4 h-4" /> Submit Academic Inquiry
            </Button>
          </form>
        </div>
      </FadeIn>
    </div>
  );
}
