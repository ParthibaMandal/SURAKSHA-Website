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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#292925] border border-[#2F6BFF]/40 text-xs font-mono text-[#D8CBB3] shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2F6BFF]" /> {toast}
        </div>
      )}

      <div className="w-full max-w-[420px] p-8 sm:p-9 rounded-xl border border-[#D8CBB3]/15 bg-[#292925] shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>

        <div className="text-center space-y-1">
          <div className="eyebrow">WORKSPACE ACCESS</div>
          <h1 className="text-2xl font-extrabold text-[#EDE4D3]">Sign in to SURAKSHA</h1>
          <p className="text-xs text-[#A69B88] leading-relaxed">
            Access your citizen flood-safety portal or authorised operations command centre.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#D8CBB3] uppercase tracking-wider">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@suraksha.in or citizen@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#2F6BFF]"
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB3]/20 bg-[#1E1E1C] text-xs text-[#D8CBB3] placeholder:text-[#A69B88]/50 focus:outline-none focus:border-[#2F6BFF]"
            />
          </div>

          <Button type="submit" className="w-full h-11 flex items-center justify-center gap-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="flex justify-between items-center text-xs text-[#A69B88]">
          <span
            className="hover:text-[#EDE4D3] cursor-pointer"
            onClick={() => setToast("Password reset link is illustrative in prototype mode.")}
          >
            Forgot password?
          </span>
          <Link href="/auth/register" className="text-[#2F6BFF] hover:underline font-semibold">
            Create account
          </Link>
        </div>

        <div className="pt-4 border-t border-[#D8CBB3]/12 space-y-2.5">
          <div className="text-[10px] font-mono text-[#A69B88] text-center">
            DIRECT WORKSPACE PREVIEW
          </div>
          <Link
            href="/admin"
            className="w-full h-10 rounded-xl bg-[#2F6BFF]/15 border border-[#2F6BFF]/40 hover:bg-[#2F6BFF]/25 text-xs font-bold text-[#EDE4D3] flex items-center justify-center transition-colors"
          >
            Open Operations Command Centre
          </Link>
          <Link
            href="/citizen"
            className="w-full h-10 rounded-xl bg-[#1E1E1C] border border-[#D8CBB3]/20 hover:bg-[#33332E] text-xs font-bold text-[#D8CBB3] flex items-center justify-center transition-colors"
          >
            Open Citizen Flood-Safety Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
