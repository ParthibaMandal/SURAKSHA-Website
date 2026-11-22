"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ArrowRight, CheckCircle2, AlertCircle, Shield, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInDemo, user, profile } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user && profile) {
      const destination =
        profile.role === "admin" || profile.role === "hydrologist" || profile.role === "operator"
          ? "/admin"
          : "/citizen";
      router.push(destination);
    }
  }, [user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoadingAction("signin");

    try {
      const result = await signIn(email, password);
      if (result.error) {
        setErrorMessage(result.error.message || "Failed to sign in. Please verify your credentials.");
        setLoadingAction(null);
        return;
      }

      setToast("Authentication confirmed. Accessing secure workspace…");
      const isOps =
        result.role === "admin" ||
        result.role === "operator" ||
        result.role === "hydrologist" ||
        email.includes("operator") ||
        email.includes("admin");

      setTimeout(() => {
        router.push(isOps ? "/admin" : "/citizen");
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setErrorMessage(msg);
      setLoadingAction(null);
    }
  };

  const handleDemoLogin = async (role: "admin" | "citizen") => {
    setErrorMessage(null);
    setLoadingAction(role);

    try {
      const res = await signInDemo(role);
      if (res.error) {
        setErrorMessage(res.error.message);
        setLoadingAction(null);
        return;
      }

      setToast(
        role === "admin"
          ? "Authenticated as Duty Commander. Redirecting to Operations Hub…"
          : "Authenticated as Citizen Resident. Redirecting to Citizen Portal…"
      );

      setTimeout(() => {
        router.push(role === "admin" ? "/admin" : "/citizen");
      }, 500);
    } catch {
      setErrorMessage("Could not load demo session");
      setLoadingAction(null);
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
            SECURE PORTAL ACCESS
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign in to SURAKSHA</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Connected to Supabase · Access authorized flood intelligence and citizen telemetry.
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
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@suraksha.in or citizen@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
            />
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
              placeholder="Enter your account password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={loadingAction !== null}
            className="w-full h-11 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            {loadingAction === "signin" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying…
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="flex justify-between items-center text-xs text-zinc-400">
          <span
            className="hover:text-white cursor-pointer transition-colors"
            onClick={() => setToast("Contact system administrator to reset command credentials.")}
          >
            Forgot password?
          </span>
          <Link href="/auth/register" className="text-white hover:underline font-semibold">
            Create account
          </Link>
        </div>

        {/* Quick Demo Login Option */}
        <div className="pt-4 border-t border-white/10 space-y-2.5">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">
            ONE-CLICK INSTANT ACCESS
          </div>

          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() => handleDemoLogin("admin")}
            className="w-full h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loadingAction === "admin" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Shield className="w-3.5 h-3.5 text-white" />
            )}
            <span>Sign In as Duty Commander (Operations)</span>
          </button>

          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() => handleDemoLogin("citizen")}
            className="w-full h-10 rounded-full bg-black border border-white/15 hover:bg-white/5 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loadingAction === "citizen" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <User className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span>Sign In as Citizen Resident (Public Portal)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
