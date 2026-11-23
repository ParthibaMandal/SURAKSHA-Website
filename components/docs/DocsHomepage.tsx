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
    <div className="flex-1 min-h-[calc(100vh-64px)] bg-black text-white">
      <div className="mx-auto flex w-full max-w-[1600px]">
        {/* =========================================================================
            1. LEFT NAVIGATION SIDEBAR
           ========================================================================= */}
        <aside className="hidden w-[260px] shrink-0 border-r border-[#1F2823] px-5 py-8 lg:block">
          {/* Quick Search Action */}
          <button
            onClick={onOpenSearch}
            className="mb-8 flex w-full items-center gap-2 rounded-md border border-[#1F2823] bg-[#0D100E] px-3.5 py-2 text-left text-xs text-[#9BA5A0] transition-colors hover:border-[#10B981]/40 hover:text-white"
          >
            <Search className="h-3.5 w-3.5 text-[#9BA5A0]" />
            <span>Search guides...</span>
            <kbd className="ml-auto rounded border border-[#1F2823] px-1.5 py-0.5 font-mono text-[10px] text-[#6A7771]">
              ⌘K
            </kbd>
          </button>

          <nav className="space-y-7" aria-label="Documentation Sidebar">
            {/* Start Here Links */}
            <div>
              <p className="mb-2.5 px-2 text-[11px] font-medium uppercase tracking-wider text-[#6A7771]">
                Start here
              </p>
              <div className="space-y-0.5">
                {startDocs.slice(0, 4).map(({ doc }) => (
                  <button
                    key={doc.id}
                    onClick={() => onSelectDoc(doc.id)}
                    className="block w-full truncate rounded-md px-2.5 py-1.5 text-left text-[13px] text-[#9BA5A0] transition-colors hover:bg-[#141816] hover:text-white"
                  >
                    {doc.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Documentation Categories Tree */}
            <div>
              <p className="mb-2.5 px-2 text-[11px] font-medium uppercase tracking-wider text-[#6A7771]">
                Documentation
              </p>
              <div className="space-y-0.5">
                {manifest.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onSelectDoc(category.docIds[0])}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-[#9BA5A0] transition-colors hover:bg-[#141816] hover:text-white group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1F2823] transition-colors group-hover:bg-[#10B981]" />
                    <span className="truncate">{category.name}</span>
                    <span className="ml-auto text-xs text-[#6A7771]">
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
          <div className="mx-auto max-w-[860px]">
            {/* Breadcrumb Bar */}
            <div className="mb-6 flex items-center gap-2 text-xs text-[#6A7771]">
              <span>Documentation</span>
              <span>/</span>
              <span className="text-white">Overview</span>
            </div>

            {/* Page Header Header & Hero Search */}
            <div className="mb-10 border-b border-[#1F2823] pb-10">
              <h1 className="text-4xl font-heading font-semibold tracking-tight text-white sm:text-5xl text-balance">
                Documentation
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#9BA5A0] text-pretty">
                Technical reference for SURAKSHA: Middle Ganga Basin physical modeling, gauge telemetry pipelines, hydrodynamic calculations, and OASIS CAP v1.2 incident dispatch protocols.
              </p>

              {/* High-Contrast Search Bar Trigger */}
              <button
                onClick={onOpenSearch}
                className="mt-6 flex w-full max-w-2xl items-center gap-3 rounded-md border border-[#1F2823] bg-[#0D100E] px-4 py-3 text-left text-sm text-[#9BA5A0] transition-colors hover:border-[#10B981]/40 hover:text-white"
              >
                <Search className="h-4 w-4 text-[#9BA5A0]" />
                <span>Search {manifest.metadata.totalDocuments} technical guides, models, and APIs...</span>
                <span className="ml-auto rounded border border-[#1F2823] bg-[#141816] px-2 py-0.5 font-mono text-[11px] text-[#6A7771]">
                  ⌘ K
                </span>
              </button>
            </div>

            {/* Real Product Picture: Middle Ganga Corridor at Patna Study Section */}
            <div className="mb-12 rounded-lg border border-[#1F2823] bg-[#0D100E] overflow-hidden">
              <div className="h-64 sm:h-72 w-full overflow-hidden bg-[#080A09]">
                <TacticalMapSvg />
              </div>
              <div className="p-4 border-t border-[#1F2823] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#9BA5A0]">
                <span>
                  <strong className="text-white font-medium">SURAKSHA-MOD-01-FLOOD:</strong> Anchored on the Ganges River Basin at Patna (Digha – Gandhi Ghat – Danapur corridor, Bihar, India).
                </span>
                <span className="font-mono text-[11px] text-[#6A7771]">25.61°N, 85.14°E</span>
              </div>
            </div>

            {/* Section 1: Start Here (Non-numbered, clean 8px radius cards) */}
            <section id="start" className="mb-14">
              <div className="mb-5 flex items-end justify-between">
                <h2 className="text-2xl font-heading font-semibold tracking-tight text-white">
                  Start here
                </h2>
                <span className="hidden text-xs text-[#6A7771] sm:block">
                  Essential paths into the platform
                </span>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {startDocs.map(({ doc, tag }) => (
                  <motion.button
                    key={doc.id}
                    onClick={() => onSelectDoc(doc.id)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="group rounded-lg border border-[#1F2823] bg-[#0D100E] p-5 text-left transition-colors hover:border-[#10B981]/50 hover:bg-[#141816] cursor-pointer"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded border border-[#1F2823] bg-[#141816] px-2 py-0.5 text-xs text-[#9BA5A0]">
                        {tag}
                      </span>
                    </div>
                    <span className="block text-sm font-heading font-semibold text-white transition-colors group-hover:text-[#10B981]">
                      {doc.title}
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-xs leading-relaxed text-[#9BA5A0]">
                      {doc.summary || doc.category}
                    </span>
                    <span className="mt-4 flex items-center gap-1.5 text-xs text-[#9BA5A0] transition-colors group-hover:text-white">
                      <span>Read guide →</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Section 2: Documentation Library (Browse by Topic) */}
            <section id="library" className="mb-14">
              <div className="mb-4">
                <h2 className="text-2xl font-heading font-semibold tracking-tight text-white">
                  Documentation library
                </h2>
              </div>

              <div className="divide-y divide-[#1F2823] border-y border-[#1F2823]">
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
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#1F2823] bg-[#141816] text-[#9BA5A0] transition-colors group-hover:text-white group-hover:border-[#10B981]/50">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="block text-sm font-heading font-semibold text-white transition-colors group-hover:text-[#10B981]">
                              {category.name}
                            </span>
                            <span className="rounded border border-[#1F2823] bg-[#141816] px-2 py-0.5 text-xs text-[#9BA5A0]">
                              {category.docCount} docs
                            </span>
                          </div>
                          <span className="mt-1 block text-xs text-[#9BA5A0] leading-relaxed">
                            {category.description}
                          </span>
                        </div>
                      </button>

                      {/* Quick sub-links */}
                      <div className="ml-12 mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                        {categoryDocs.slice(0, 4).map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => onSelectDoc(doc.id)}
                            className="text-xs text-[#9BA5A0] hover:text-white transition-colors"
                          >
                            {doc.title}
                          </button>
                        ))}
                        {categoryDocs.length > 4 && (
                          <button
                            onClick={() => onSelectDoc(categoryDocs[4].id)}
                            className="text-xs text-[#6A7771] hover:text-[#9BA5A0]"
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
                <h2 className="text-2xl font-heading font-semibold tracking-tight text-white">
                  Curated learning paths
                </h2>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {manifest.learningPaths.map((path) => (
                  <div
                    key={path.id}
                    className="rounded-lg border border-[#1F2823] bg-[#0D100E] p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-heading font-semibold text-white">
                        {path.title}
                      </h3>
                      <span className="rounded border border-[#1F2823] bg-[#141816] px-2 py-0.5 text-xs text-[#9BA5A0]">
                        {path.tag}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#9BA5A0]">
                      {path.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-[#1F2823]">
                      {path.steps.slice(0, 3).map((step) => (
                        <button
                          key={step.id}
                          onClick={() => onSelectDoc(step.id)}
                          className="flex w-full items-center gap-2 text-left text-xs text-[#9BA5A0] transition-colors hover:text-white"
                        >
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
        <aside className="hidden w-[240px] shrink-0 px-6 py-12 xl:block border-l border-[#1F2823]">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-[#6A7771]">
            In this guide
          </p>
          <div className="space-y-2.5 border-l border-[#1F2823] pl-3.5 text-xs text-[#9BA5A0]">
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
        </aside>
      </div>
    </div>
  );
}
