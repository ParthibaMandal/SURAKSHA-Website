"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToast("Registration preview complete. Redirecting to login.");
    setTimeout(() => {
      router.push("/auth/login");
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#292925] border border-[#06B6D4]/40 text-xs font-mono text-[#D8CBB3] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" /> {toast}
        </div>
      )}

      <div className="w-full max-w-[420px] p-8 sm:p-9 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>

        <div className="text-center space-y-1">
          <div className="eyebrow">CREATE ACCOUNT</div>
          <h1 className="text-2xl font-extrabold text-[#EDE4D3]">Join SURAKSHA</h1>
          <p className="text-xs text-[#A69B88] leading-relaxed">
            Create a citizen account to save monitored locations and manage flood advisory preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
              Full name
            </label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#06B6D4]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#06B6D4]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#06B6D4]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
              Confirm password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#06B6D4]"
            />
          </div>

          <Button type="submit" className="w-full h-11 flex items-center justify-center gap-2">
            Create Citizen Account <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-[#A69B88]">
          Already registered?{" "}
          <Link href="/auth/login" className="text-[#06B6D4] hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
