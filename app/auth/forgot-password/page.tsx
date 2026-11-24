"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "reset_link_invalid") {
      setError("That reset link could not be verified. Request a fresh link and try again.");
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/auth/reset-password")}`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (resetError) throw resetError;
      setMessage("If an account uses that email, a password reset link will arrive shortly.");
    } catch {
      setError("We could not send a reset link right now. Check the address and try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-[var(--background)] px-4 py-16 text-[var(--foreground)]">
      <section className="w-full max-w-[420px] space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl sm:p-9" aria-labelledby="reset-request-title">
        <div className="flex justify-center"><BrandLogo size="md" /></div>
        <div className="space-y-2 text-center">
          <div className="eyebrow">ACCOUNT RECOVERY</div>
          <h1 id="reset-request-title" className="text-2xl font-bold tracking-tight text-[var(--card-foreground)]">Reset your password</h1>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">Enter the email address on your account. We’ll send a secure link if it is registered.</p>
        </div>

        {message && <div role="status" aria-live="polite" className="flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 text-sm text-[var(--card-foreground)]"><MailCheck className="mt-0.5 h-4 w-4 shrink-0" />{message}</div>}
        {error && <div role="alert" className="rounded-xl border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--card-foreground)]">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reset-email" className="text-xs font-semibold uppercase tracking-wider text-[var(--card-foreground)]">Email address</label>
            <input id="reset-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="h-11 w-full text-sm font-semibold">
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send reset link"}
          </Button>
        </form>

        <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"><ArrowLeft className="h-4 w-4" /> Back to sign in</Link>
      </section>
    </main>
  );
}
