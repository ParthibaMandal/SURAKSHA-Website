"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Search, Github, Menu, X, ArrowLeft } from "lucide-react";
import { DocsManifestMetadata } from "@/lib/docs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface DocsHeaderProps {
  metadata: DocsManifestMetadata;
  onOpenSearch: () => void;
  isReaderMode?: boolean;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export function DocsHeader({
  metadata,
  onOpenSearch,
  isReaderMode = false,
  mobileMenuOpen = false,
  onToggleMobileMenu,
}: DocsHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface-glass)] px-4 py-3 text-[var(--foreground)] backdrop-blur-md sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Branding & Version */}
        <div className="flex items-center gap-3">
          {isReaderMode && onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              aria-label="Toggle Documentation Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <Link href="/docs" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)] transition-all group-hover:border-emerald-500/50">
              <BookOpen className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-[var(--foreground)] font-heading">
                  SURAKSHA
                </span>
                <span className="text-xs font-medium text-[var(--muted-foreground)]">Docs Portal</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Main Navigation */}
        <nav className="hidden items-center gap-6 text-xs text-[var(--muted-foreground)] lg:flex font-medium" aria-label="Documentation sections">
          <Link href="/docs" className="text-[var(--foreground)] font-semibold border-b-2 border-emerald-500 pb-0.5">Docs</Link>
          <Link href="/platform" className="transition-colors hover:text-[var(--foreground)]">Platform</Link>
          <Link href="/demo-lab" className="transition-colors hover:text-[var(--foreground)]">Simulation Lab</Link>
          <Link href="/study-area" className="transition-colors hover:text-[var(--foreground)]">Research</Link>
        </nav>

        {/* Center Search Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3.5 py-2 text-xs text-[var(--muted-foreground)] transition-all hover:border-emerald-500/40 hover:text-[var(--foreground)] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              <span>Search 84 documentation guides & APIs...</span>
            </div>
            <kbd className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--muted-foreground)] shadow-xs">
              ⌘ K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            aria-label="Search Documentation"
          >
            <Search className="w-4 h-4" />
          </button>

          <ThemeToggle />

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-emerald-500/40 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <a
            href="https://github.com/shouri123/SURAKSHA-Website/tree/main/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-emerald-500/40 font-medium"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
