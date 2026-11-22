"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isOpOrAdmin = email.includes("operator") || email.includes("admin");
    const target = isOpOrAdmin ? "/admin" : "/citizen";
    setToast(
      `Authenticated as ${isOpOrAdmin ? "Operations Commander" : "Citizen"}. Loading workspace…`
    );
    setTimeout(() => {
      router.push(target);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#FFFFFF]/40 text-xs font-mono text-[#A1A1AA] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" /> {toast}
        </div>
      )}

      <div className="w-full max-w-[420px] p-8 sm:p-9 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>

        <div className="text-center space-y-1">
          <div className="eyebrow">WORKSPACE ACCESS</div>
          <h1 className="text-2xl font-extrabold text-[#FFFFFF]">Sign in to SURAKSHA</h1>
          <p className="text-xs text-[#A69B88] leading-relaxed">
            Access your citizen flood-safety portal or authorised operations command centre.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@suraksha.in or citizen@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#000000] text-xs text-[#A1A1AA] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#FFFFFF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#A1A1AA]/20 bg-[#000000] text-xs text-[#A1A1AA] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#FFFFFF]"
            />
          </div>

          <Button type="submit" className="w-full h-11 flex items-center justify-center gap-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="flex justify-between items-center text-xs text-[#A69B88]">
          <span
            className="hover:text-[#FFFFFF] cursor-pointer"
            onClick={() => setToast("Password reset link is illustrative in prototype mode.")}
          >
            Forgot password?
          </span>
          <Link href="/auth/register" className="text-[#FFFFFF] hover:underline font-semibold">
            Create account
          </Link>
        </div>

        <div className="pt-4 border-t border-[#A1A1AA]/12 space-y-2.5">
          <div className="text-[10px] font-mono text-[#A69B88] text-center">
            DIRECT WORKSPACE PREVIEW
          </div>
          <Link
            href="/admin"
            className="w-full h-10 rounded-xl bg-[#FFFFFF]/15 border border-[#FFFFFF]/40 hover:bg-[#FFFFFF]/25 text-xs font-bold text-[#FFFFFF] flex items-center justify-center transition-colors"
          >
            Open Operations Command Centre
          </Link>
          <Link
            href="/citizen"
            className="w-full h-10 rounded-xl bg-[#000000] border border-[#A1A1AA]/20 hover:bg-[#141414] text-xs font-bold text-[#A1A1AA] flex items-center justify-center transition-colors"
          >
            Open Citizen Flood-Safety Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
