"use client";

import React from "react";
import {
  BookOpen,
  Search,
  ArrowRight,
  Compass,
  Waves,
  Cpu,
  Database,
  ShieldCheck,
  FileText,
  Clock3,
  Layers,
  Sparkles,
} from "lucide-react";
import { DocsManifest, DocItem, getAllDocs } from "@/lib/docs";

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

  const startDocs: { doc: DocItem; num: string; tag: string }[] = [
    { doc: introDoc, num: "01", tag: "Architecture" },
    { doc: quickstart, num: "02", tag: "Setup" },
    { doc: modeling, num: "03", tag: "Modeling" },
    { doc: governance, num: "04", tag: "Safety" },
  ].filter((item) => Boolean(item.doc));

  return (
    <div className="flex-1 min-h-[calc(100vh-64px)] bg-black text-white">
      <div className="mx-auto flex w-full max-w-[1600px]">
        {/* =========================================================================
            1. LEFT NAVIGATION SIDEBAR (Google Antigravity Overview Style)
           ========================================================================= */}
        <aside className="hidden w-[260px] shrink-0 border-r border-white/10 px-5 py-8 lg:block">
          {/* Quick Search Action */}
          <button
            onClick={onOpenSearch}
            className="mb-8 flex w-full items-center gap-2 rounded-xl border border-white/10 bg-[#0A0A0A] px-3.5 py-2 text-left text-xs text-zinc-400 transition-all hover:border-white/25 hover:bg-white/[0.04] hover:text-white"
          >
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <span>Search guides...</span>
            <kbd className="ml-auto rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
              ⌘K
            </kbd>
          </button>

          <nav className="space-y-7" aria-label="Documentation Sidebar">
            {/* Start Here Links */}
            <div>
              <p className="mb-2.5 px-2 text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Start here
              </p>
              <div className="space-y-0.5">
                {startDocs.slice(0, 4).map(({ doc }) => (
                  <button
                    key={doc.id}
                    onClick={() => onSelectDoc(doc.id)}
                    className="block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {doc.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Documentation Categories Tree */}
            <div>
              <p className="mb-2.5 px-2 text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Documentation
              </p>
              <div className="space-y-0.5">
                {manifest.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onSelectDoc(category.docIds[0])}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-white group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 transition-colors group-hover:bg-white" />
                    <span className="truncate">{category.name}</span>
                    <span className="ml-auto text-[10px] font-mono text-zinc-600">
                      {category.docCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Operational Scope Footer */}
          <div className="mt-10 border-t border-white/10 pt-4 text-[11px] leading-5 text-zinc-500 font-mono">
            <div>SURAKSHA · {manifest.metadata.releaseVersion}</div>
            <div className="text-zinc-600">{manifest.metadata.totalDocuments} Technical Specifications</div>
            <div className="mt-1 text-zinc-400">Ganga Basin · Patna Reach</div>
          </div>
        </aside>

        {/* =========================================================================
            2. CENTER MAIN CONTENT PANE (Exact Mirror of Antigravity Overview)
           ========================================================================= */}
        <main id="top" className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-14 lg:py-12">
          <div className="mx-auto max-w-[860px]">
            {/* Breadcrumb Bar */}
            <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
              <BookOpen className="h-4 w-4 text-zinc-400" />
              <span>Documentation</span>
              <span>/</span>
              <span className="text-zinc-200">Overview</span>
            </div>

            {/* Page Header Header & Hero Search */}
            <div className="mb-12 border-b border-white/10 pb-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-mono font-medium text-zinc-300">
                <span>SURAKSHA Technical Spec</span>
                <span>·</span>
                <span>v{manifest.metadata.releaseVersion}</span>
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Documentation
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
                Guides to the flood intelligence platform for the Ganga Basin. Explore the physical sciences, telemetry pipelines, hydrodynamic models, architecture, and operational protocols behind SURAKSHA.
              </p>

              {/* High-Contrast Search Bar Trigger */}
              <button
                onClick={onOpenSearch}
                className="mt-7 flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-white/15 bg-[#0A0A0A] px-4 py-3.5 text-left text-sm text-zinc-400 transition-all hover:border-white/30 hover:bg-white/[0.04] hover:text-white"
              >
                <Search className="h-4 w-4 text-zinc-400" />
                <span>Search {manifest.metadata.totalDocuments} technical guides, models, and APIs...</span>
                <span className="ml-auto rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                  ⌘ K
                </span>
              </button>
            </div>

            {/* Section 1: Start Here (Numbered 01 - 04 Cards) */}
            <section id="start" className="mb-14">
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    Get oriented
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                    Start here
                  </h2>
                </div>
                <span className="hidden text-xs text-zinc-500 sm:block">
                  Essential paths into the platform
                </span>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {startDocs.map(({ doc, num, tag }) => (
                  <button
                    key={doc.id}
                    onClick={() => onSelectDoc(doc.id)}
                    className="group rounded-2xl border border-white/10 bg-[#0A0A0A] p-5 text-left transition-all hover:border-white/25 hover:bg-white/[0.03]"
                  >
                    <div className="mb-3.5 flex items-center justify-between">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-xs font-semibold text-white">
                        {num}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-zinc-400 uppercase">
                        {tag}
                      </span>
                    </div>
                    <span className="block text-sm font-semibold text-white transition-colors group-hover:text-zinc-200">
                      {doc.title}
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-xs leading-relaxed text-zinc-400">
                      {doc.summary || doc.category}
                    </span>
                    <span className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400 transition-colors group-hover:text-white">
                      <span>Read guide</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Section 2: Documentation Library (Browse by Topic) */}
            <section id="library" className="mb-14">
              <div className="mb-4">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Browse by topic
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  Documentation library
                </h2>
              </div>

              <div className="divide-y divide-white/10 border-y border-white/10">
                {manifest.categories.map((category) => {
                  const Icon = iconFor(category.icon);
                  const categoryDocs = category.docIds
                    .map(findDoc)
                    .filter(Boolean) as DocItem[];

                  return (
                    <div key={category.id} className="py-5">
                      <button
                        onClick={() => onSelectDoc(category.docIds[0])}
                        className="group flex w-full items-start gap-4 text-left"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors group-hover:bg-white/10 group-hover:text-white">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="block text-sm font-semibold text-white transition-colors group-hover:text-zinc-200">
                              {category.name}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                              {category.docCount} docs
                            </span>
                          </div>
                          <span className="mt-1 block text-xs text-zinc-400 leading-relaxed">
                            {category.description}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-white mt-1" />
                      </button>

                      {/* Quick sub-links */}
                      <div className="ml-12 mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                        {categoryDocs.slice(0, 4).map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => onSelectDoc(doc.id)}
                            className="text-xs text-zinc-400 hover:text-white transition-colors"
                          >
                            {doc.title}
                          </button>
                        ))}
                        {categoryDocs.length > 4 && (
                          <button
                            onClick={() => onSelectDoc(categoryDocs[4].id)}
                            className="text-xs text-zinc-600 hover:text-zinc-400 font-mono"
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
                <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  By role
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  Curated learning paths
                </h2>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {manifest.learningPaths.map((path) => (
                  <div
                    key={path.id}
                    className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        {path.title}
                      </h3>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                        {path.tag}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-400">
                      {path.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      {path.steps.slice(0, 3).map((step) => (
                        <button
                          key={step.id}
                          onClick={() => onSelectDoc(step.id)}
                          className="flex w-full items-center gap-2 text-left text-xs text-zinc-400 transition-colors hover:text-white"
                        >
                          <Clock3 className="h-3 w-3 text-zinc-500 shrink-0" />
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
            3. RIGHT SIDEBAR (In this guide jump links & context)
           ========================================================================= */}
        <aside className="hidden w-[240px] shrink-0 px-6 py-12 xl:block border-l border-white/10">
          <p className="mb-3 text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-zinc-500">
            In this guide
          </p>
          <div className="space-y-2.5 border-l border-white/10 pl-3.5 text-xs text-zinc-400">
            <a className="block transition-colors hover:text-white" href="#top">
              Overview
            </a>
            <a className="block transition-colors hover:text-white" href="#start">
              Start here
            </a>
            <a className="block transition-colors hover:text-white" href="#library">
              Documentation library
            </a>
            <a className="block transition-colors hover:text-white" href="#paths">
              Curated learning paths
            </a>
          </div>

          <div className="mt-10 rounded-xl border border-white/10 bg-[#0A0A0A] p-4 text-[11px] leading-relaxed text-zinc-400">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-300 block mb-1">
              Operational Focus
            </span>
            <div className="text-zinc-200 font-medium">
              {manifest.metadata.operationalContext.primaryGeographicFocus}
            </div>
            <div className="text-zinc-500 text-[10px] mt-0.5">
              {manifest.metadata.operationalContext.primaryRiverBasin}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
