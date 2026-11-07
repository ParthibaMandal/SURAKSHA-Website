"use client";

import React from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <FadeIn>
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="mb-2 text-cyan-glow border-cyan-500/30">
            CONNECT WITH RESEARCHERS
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Research & Institutional Inquiries
          </h1>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            SURAKSHA is developed as an academic minor project. We welcome peer reviews, calibration datasets, and disaster management research inquiries.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="rounded-2xl border border-suraksha-750 bg-suraksha-900/60 p-8 backdrop-blur-xl">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <Input placeholder="Dr. S. Kumar" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Affiliation / University
                </label>
                <Input placeholder="National Institute of Hydrology" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <Input type="email" placeholder="researcher@institute.edu" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Inquiry Focus
              </label>
              <textarea
                rows={4}
                placeholder="Share your interest in numerical modeling, sensor deployment, or supervisory gate architectures..."
                className="w-full rounded-lg border border-suraksha-750 bg-suraksha-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
              />
            </div>

            <Button className="w-full sm:w-auto flex items-center gap-2">
              <Send className="w-4 h-4" /> Submit Academic Inquiry
            </Button>
          </form>
        </div>
      </FadeIn>
    </div>
  );
}
