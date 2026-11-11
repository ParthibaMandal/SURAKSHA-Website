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
    setToast(`Authenticated as ${isOpOrAdmin ? "Operations Officer" : "Citizen"}. Loading workspace…`);
    setTimeout(() => {
      router.push(target);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0f171b] border border-[#5eead4]/40 text-xs font-mono text-[#5eead4] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#5eead4]" /> {toast}
        </div>
      )}

      <div className="w-full max-w-[420px] p-8 sm:p-9 rounded-2xl border border-[rgba(46,73,82,0.45)] bg-[rgba(15,23,27,0.85)] shadow-2xl backdrop-blur-xl space-y-6">
        {/* Brand Header */}
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>

        <div className="text-center space-y-1">
          <div className="eyebrow">Welcome back</div>
          <h1 className="text-2xl font-black text-white">Sign in to SURAKSHA</h1>
          <p className="text-xs text-[#9bb2af] leading-relaxed">
            Access your citizen or authorised operations workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#9bb2af] uppercase tracking-wider">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#9bb2af] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#2e4952] bg-[#091418] text-xs text-white focus:outline-none focus:border-[#5eead4]"
            />
          </div>

          <Button type="submit" className="w-full h-11 flex items-center justify-center gap-2">
            Sign in <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="flex justify-between items-center text-xs text-[#859e9a]">
          <span className="hover:text-white cursor-pointer" onClick={() => setToast("Reset instructions link is illustrative.")}>
            Forgot password?
          </span>
          <Link href="/auth/register" className="text-[#5eead4] hover:underline font-semibold">
            Create account
          </Link>
        </div>

        <div className="pt-4 border-t border-[rgba(94,234,212,0.12)] space-y-2.5">
          <div className="text-[10px] text-[#627b77] text-center">
            Preview navigation only — no real authentication is required.
          </div>
          <Link
            href="/citizen"
            className="w-full h-10 rounded-xl bg-[#162e34] border border-[#2e4952] hover:bg-[#1c3e46] text-xs font-bold text-white flex items-center justify-center transition-colors"
          >
            Preview citizen dashboard
          </Link>
          <Link
            href="/admin"
            className="w-full h-10 rounded-xl bg-[#162e34] border border-[#2e4952] hover:bg-[#1c3e46] text-xs font-bold text-[#5eead4] flex items-center justify-center transition-colors"
          >
            Preview admin console
          </Link>
        </div>
      </div>
    </div>
  );
}
