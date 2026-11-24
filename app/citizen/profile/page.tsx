"use client";

import React from "react";
import { useAuth } from "@/lib/supabase/auth-context";

export default function CitizenProfilePage() {
  const { user, profile, isLoading } = useAuth();
  const fullName = profile?.full_name?.trim() || "Name not set";

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[var(--border)]">
        <div className="eyebrow">CITIZEN WORKSPACE</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">My Profile</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Read-only account details from your authenticated SURAKSHA session.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--card-foreground)]" aria-labelledby="account-details-heading">
          <div className="border-b border-[var(--border)] pb-3">
            <h2 id="account-details-heading" className="text-sm font-bold">Account Details</h2>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Full name</dt>
              <dd className="mt-1 text-sm">{isLoading ? "Loading account…" : fullName}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Email address</dt>
              <dd className="mt-1 break-all text-sm">{isLoading ? "Loading account…" : user?.email ?? "Unavailable"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Preferred language</dt>
              <dd className="mt-1 text-sm text-[var(--muted-foreground)]">Not configured</dd>
            </div>
          </dl>
          <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-3 text-xs leading-relaxed text-[var(--muted-foreground)]">
            Profile editing and language preference storage are not connected. These details are shown read-only so this page does not imply changes were saved.
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--card-foreground)]" aria-labelledby="security-status-heading">
          <div className="border-b border-[var(--border)] pb-3">
            <h2 id="security-status-heading" className="text-sm font-bold">Security Status</h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            Password history, active-session management, and multi-factor authentication status are not available in the connected account interface. No security status is inferred here.
          </p>
          <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-3 text-xs leading-relaxed text-[var(--muted-foreground)]">
            Use the account sign-in provider for password or session recovery. SURAKSHA does not currently expose security-management controls in this workspace.
          </p>
        </section>
      </div>
    </div>
  );
}
