"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"citizen" | "hydrologist" | "admin">("citizen");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(email, password, fullName, role);
      if (result.error) {
        setErrorMessage(result.error.message || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      setToast("Account created successfully! Redirecting…");
      setTimeout(() => {
        router.push(role === "citizen" ? "/citizen" : "/admin");
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-black text-white">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-white text-black text-xs font-mono font-medium shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-black" /> {toast}
        </div>
      )}

      <div className="w-full max-w-[420px] p-8 sm:p-9 rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>

        <div className="text-center space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            ACCOUNT REGISTRATION
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Join SURAKSHA</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Create an account to monitor your catchment reach, save flood alert zones, and access verification telemetry.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl border border-white/20 bg-white/5 text-xs text-zinc-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Full name
            </label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Anand Verma or Ramesh Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.in or you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("citizen")}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  role === "citizen"
                    ? "bg-white text-black border-white font-semibold"
                    : "bg-black text-zinc-400 border-white/15 hover:border-white/30"
                }`}
              >
                Citizen Resident
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  role === "admin"
                    ? "bg-white text-black border-white font-semibold"
                    : "bg-black text-zinc-400 border-white/15 hover:border-white/30"
                }`}
              >
                Operations Admin
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Confirm password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Account…
              </>
            ) : (
              <>
                Create Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Already registered?{" "}
          <Link href="/auth/login" className="text-white hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
