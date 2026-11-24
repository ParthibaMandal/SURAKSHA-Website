"use client";

import React from "react";
import {
  Search,
  Compass,
  Waves,
  Cpu,
  Database,
  ShieldCheck,
  FileText,
  Layers,
  ArrowRight,
} from "lucide-react";
import { DocsManifest, DocItem, getAllDocs } from "@/lib/docs";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { motion } from "framer-motion";

interface DocsHomepageProps {
  manifest: DocsManifest;
  onOpenSearch: () => void;
  onSelectDoc: (docId: string) => void;
}

const iconFor = (icon: string) =>
  ({
    Compass,
    Waves,
    Cpu,
    Database,
    ShieldCheck,
    Layers,
  }[icon] || FileText);

export function DocsHomepage({
  manifest,
  onOpenSearch,
  onSelectDoc,
}: DocsHomepageProps) {
  const docs = getAllDocs();
  const findDoc = (id?: string) => docs.find((doc) => doc.id === id);

  // Key curated starter documents
  const introDoc =
    findDoc("01-overview--system-architecture") ||
    findDoc(manifest.categories[0]?.docIds[0]) ||
    docs[0];
  const quickstart =
    docs.find((doc) => /quick.?start|setup|local-environment/i.test(`${doc.title} ${doc.path}`)) ||
    docs[1];
  const modeling =
    docs.find((doc) => /hydrological-modeling|bilstm|hec-ras/i.test(`${doc.title} ${doc.path}`)) ||
    docs[2];
  const governance =
    docs.find((doc) => /alert-governance|safety|cap-protocol/i.test(`${doc.title} ${doc.path}`)) ||
    docs[3];

  const startDocs: { doc: DocItem; tag: string }[] = [
    { doc: introDoc, tag: "Architecture" },
    { doc: quickstart, tag: "Setup" },
    { doc: modeling, tag: "Modeling" },
    { doc: governance, tag: "Safety" },
  ].filter((item) => Boolean(item.doc));

  return (
    <div className="flex-1 min-h-[calc(100vh-64px)] bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <div className="mx-auto flex w-full max-w-[1600px]">
        {/* =========================================================================
            1. LEFT NAVIGATION SIDEBAR
           ========================================================================= */}
        <aside className="hidden w-[270px] shrink-0 border-r border-[var(--border)] px-5 py-8 lg:block">
          {/* Quick Search Action */}
          <button
            onClick={onOpenSearch}
            className="mb-8 flex w-full items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3.5 py-2 text-left text-xs text-[var(--muted-foreground)] transition-all hover:border-emerald-500/40 hover:text-[var(--foreground)] cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
            <span>Search guides...</span>
            <kbd className="ml-auto rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)]">
              ⌘K
            </kbd>
          </button>

          <nav className="space-y-7" aria-label="Documentation Sidebar">
            {/* Start Here Links */}
            <div>
              <p className="mb-2.5 px-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]/70">
                Start here
              </p>
              <div className="space-y-0.5">
                {startDocs.slice(0, 4).map(({ doc }) => (
                  <button
                    key={doc.id}
                    onClick={() => onSelectDoc(doc.id)}
                    className="block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-[13px] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] cursor-pointer"
                  >
                    {doc.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Documentation Categories Tree */}
            <div>
              <p className="mb-2.5 px-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]/70">
                Categories
              </p>
              <div className="space-y-0.5">
                {manifest.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onSelectDoc(category.docIds[0])}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] group cursor-pointer"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)] transition-colors group-hover:bg-emerald-500" />
                    <span className="truncate">{category.name}</span>
                    <span className="ml-auto text-xs text-[var(--muted-foreground)]/70 font-mono">
                      {category.docCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        {/* =========================================================================
            2. CENTER MAIN CONTENT PANE
           ========================================================================= */}
        <main id="top" className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-14 lg:py-12">
          <div className="mx-auto max-w-[880px]">
            {/* Breadcrumb Bar */}
            <div className="mb-6 flex items-center gap-2 text-xs text-[var(--muted-foreground)] font-mono">
              <span>SURAKSHA</span>
              <span>/</span>
              <span>Documentation</span>
              <span>/</span>
              <span className="text-[var(--foreground)] font-medium">Knowledge Hub</span>
            </div>

            {/* Page Header Header & Hero Search */}
            <div className="mb-10 border-b border-[var(--border)] pb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
                Research & Engineering Portal
              </div>
              <h1 className="text-3xl font-heading font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl text-balance">
                Knowledge Base & API Reference
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] sm:text-base leading-relaxed text-[var(--muted-foreground)] text-pretty">
                Engineering specification and hydrological research references for SURAKSHA: Middle Ganga Basin physical modeling, gauge telemetry pipelines, bidirectional LSTM hydrodynamics, and OASIS CAP v1.2 incident dispatch protocols.
              </p>

              {/* High-Contrast Search Bar Trigger */}
              <button
                onClick={onOpenSearch}
                className="mt-6 flex w-full max-w-2xl items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-left text-sm text-[var(--muted-foreground)] transition-all hover:border-emerald-500/50 hover:text-[var(--foreground)] shadow-sm cursor-pointer"
              >
                <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                <span>Search {manifest.metadata.totalDocuments} technical guides, models, and APIs...</span>
                <span className="ml-auto rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted-foreground)]">
                  ⌘ K
                </span>
              </button>
            </div>

            {/* Real Product Picture: Middle Ganga Corridor at Patna Study Section */}
            <div className="mb-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
              <div className="h-64 sm:h-72 w-full overflow-hidden bg-[var(--surface-elevated)]">
                <TacticalMapSvg />
              </div>
              <div className="p-4 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[var(--muted-foreground)]">
                <span>
                  <strong className="text-[var(--foreground)] font-semibold">SURAKSHA-MOD-01-FLOOD:</strong> Anchored on the Ganges River Basin at Patna (Digha – Gandhi Ghat – Danapur corridor, Bihar, India).
                </span>
                <span className="font-mono text-[11px] text-[var(--muted-foreground)]">25.61°N, 85.14°E</span>
              </div>
            </div>

            {/* Section 1: Start Here (Non-numbered, clean 8px radius cards) */}
            <section id="start" className="mb-14">
              <div className="mb-5 flex items-end justify-between">
                <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-[var(--foreground)]">
                  Start here
                </h2>
                <span className="hidden text-xs text-[var(--muted-foreground)] sm:block">
                  Essential paths into the platform
                </span>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {startDocs.map(({ doc, tag }) => (
                  <motion.button
                    key={doc.id}
                    onClick={() => onSelectDoc(doc.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="group rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 text-left transition-all hover:border-emerald-500/50 hover:shadow-md cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-xs font-mono font-medium text-[var(--muted-foreground)]">
                          {tag}
                        </span>
                        <span className="text-xs font-mono text-[var(--muted-foreground)]">
                          {doc.readingTime}m read
                        </span>
                      </div>
                      <span className="block text-sm font-heading font-bold text-[var(--foreground)] transition-colors group-hover:text-emerald-500">
                        {doc.title}
                      </span>
                      <span className="mt-1.5 line-clamp-2 block text-xs leading-relaxed text-[var(--muted-foreground)]">
                        {doc.summary || doc.category}
                      </span>
                    </div>
                    <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                      <span>Read guide</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Section 2: Documentation Library (Browse by Topic) */}
            <section id="library" className="mb-14">
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-[var(--foreground)]">
                  Browse by category
                </h2>
              </div>

              <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {manifest.categories.map((category) => {
                  const Icon = iconFor(category.icon);
                  const categoryDocs = category.docIds
                    .map(findDoc)
                    .filter(Boolean) as DocItem[];

                  return (
                    <div key={category.id} className="py-5">
                      <button
                        onClick={() => onSelectDoc(category.docIds[0])}
                        className="group flex w-full items-start gap-4 text-left cursor-pointer"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)] transition-colors group-hover:border-emerald-500/50 group-hover:text-emerald-500">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2.5">
                            <span className="block text-sm font-heading font-bold text-[var(--foreground)] transition-colors group-hover:text-emerald-500">
                              {category.name}
                            </span>
                            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-mono text-[var(--muted-foreground)]">
                              {category.docCount} docs
                            </span>
                          </div>
                          <span className="mt-1 block text-xs text-[var(--muted-foreground)] leading-relaxed">
                            {category.description}
                          </span>
                        </div>
                      </button>

                      {/* Quick sub-links */}
                      <div className="ml-13 mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                        {categoryDocs.slice(0, 4).map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => onSelectDoc(doc.id)}
                            className="text-xs text-[var(--muted-foreground)] hover:text-emerald-500 transition-colors cursor-pointer"
                          >
                            {doc.title}
                          </button>
                        ))}
                        {categoryDocs.length > 4 && (
                          <button
                            onClick={() => onSelectDoc(categoryDocs[4].id)}
                            className="text-xs text-[var(--muted-foreground)]/70 hover:text-[var(--foreground)] cursor-pointer"
                          >
                            +{categoryDocs.length - 4} more
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 3: Curated Learning Paths */}
            <section id="paths">
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-[var(--foreground)]">
                  Curated learning paths
                </h2>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {manifest.learningPaths.map((path) => (
                  <div
                    key={path.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-heading font-bold text-[var(--foreground)]">
                        {path.title}
                      </h3>
                      <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-xs font-mono text-[var(--muted-foreground)]">
                        {path.tag}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                      {path.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                      {path.steps.slice(0, 3).map((step) => (
                        <button
                          key={step.id}
                          onClick={() => onSelectDoc(step.id)}
                          className="flex w-full items-center gap-2 text-left text-xs text-[var(--muted-foreground)] transition-colors hover:text-emerald-500 cursor-pointer"
                        >
                          <span className="text-emerald-500 text-[10px]">▸</span>
                          <span className="truncate">{step.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* =========================================================================
            3. RIGHT SIDEBAR
           ========================================================================= */}
        <aside className="hidden w-[240px] shrink-0 px-6 py-12 xl:block border-l border-[var(--border)]">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]/70">
            In this guide
          </p>
          <div className="space-y-2.5 border-l border-[var(--border)] pl-3.5 text-xs text-[var(--muted-foreground)]">
            <a className="block transition-colors hover:text-[var(--foreground)]" href="#top">
              Overview
            </a>
            <a className="block transition-colors hover:text-[var(--foreground)]" href="#start">
              Start here
            </a>
            <a className="block transition-colors hover:text-[var(--foreground)]" href="#library">
              Documentation library
            </a>
            <a className="block transition-colors hover:text-[var(--foreground)]" href="#paths">
              Curated learning paths
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
