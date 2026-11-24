"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type RecoveryState = "checking" | "ready" | "invalid" | "updated";

export default function ResetPasswordPage() {
  const [supabase] = useState(() => createClient());
  const [state, setState] = useState<RecoveryState>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser()
      .then(({ data, error: userError }) => {
        if (active) setState(!userError && data.user ? "ready" : "invalid");
      })
      .catch(() => {
        if (active) setState("invalid");
      });
    return () => { active = false; };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setState("updated");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("The password could not be updated. Request a fresh reset link and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-[var(--background)] px-4 py-16 text-[var(--foreground)]">
      <section className="w-full max-w-[420px] space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl sm:p-9" aria-labelledby="reset-password-title">
        <div className="flex justify-center"><BrandLogo size="md" /></div>
        <div className="space-y-2 text-center">
          <div className="eyebrow">ACCOUNT RECOVERY</div>
          <h1 id="reset-password-title" className="text-2xl font-bold tracking-tight text-[var(--card-foreground)]">Choose a new password</h1>
        </div>

        {state === "checking" && <p role="status" className="text-center text-sm text-[var(--muted-foreground)]">Verifying your reset link…</p>}
        {state === "invalid" && <div className="space-y-4 text-center"><p role="alert" className="text-sm leading-relaxed text-[var(--muted-foreground)]">This reset link is missing, expired, or already used. Request a new one to continue.</p><Link href="/auth/forgot-password" className="inline-flex rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)]">Request another link</Link></div>}
        {state === "updated" && <div className="space-y-4 text-center"><p role="status" aria-live="polite" className="text-sm text-[var(--card-foreground)]">Your password was updated successfully.</p><Link href="/auth/login" className="inline-flex rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)]">Continue to sign in</Link></div>}

        {state === "ready" && <>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">Choose a new password with at least 8 characters.</p>
          {error && <div role="alert" className="rounded-xl border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--card-foreground)]">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5"><label htmlFor="new-password" className="text-xs font-semibold uppercase tracking-wider text-[var(--card-foreground)]">New password</label><input id="new-password" name="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" /></div>
            <div className="space-y-1.5"><label htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-wider text-[var(--card-foreground)]">Confirm new password</label><input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" /></div>
            <Button type="submit" disabled={isSubmitting} className="h-11 w-full text-sm font-semibold">{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</> : "Update password"}</Button>
          </form>
        </>}
      </section>
    </main>
  );
}
