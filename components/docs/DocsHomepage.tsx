"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Compass,
  Target,
  Waves,
  Cpu,
  Database,
  Globe,
  Brain,
  Network,
  Server,
  Layout,
  ShieldAlert,
  CheckCircle2,
  Cloud,
  Activity,
  FlaskConical,
  GitBranch,
  ArrowRight,
  Sparkles,
  Layers,
  FileCode,
  ShieldCheck,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  DocsManifest,
  DocCategory,
  LearningPath,
  DocItem,
} from "@/lib/docs";

interface DocsHomepageProps {
  manifest: DocsManifest;
  onOpenSearch: () => void;
  onSelectDoc: (docId: string) => void;
}

// Map icon string to Lucide component
const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  Target,
  Waves,
  Cpu,
  Database,
  Globe,
  Brain,
  Network,
  Server,
  Layout,
  ShieldAlert,
  CheckCircle2,
  Cloud,
  Activity,
  FlaskConical,
  GitBranch,
};

export function DocsHomepage({
  manifest,
  onOpenSearch,
  onSelectDoc,
}: DocsHomepageProps) {
  const { metadata, categories, learningPaths } = manifest;

  return (
    <div className="flex-1 bg-[#090C10] text-[#F8FAFC] pb-24">
      {/* Hero Section */}
      <section className="relative border-b border-white/10 bg-gradient-to-b from-[#10161F] via-[#090C10] to-[#090C10] px-4 sm:px-6 lg:px-8 pt-14 pb-16">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-[#06B6D4]/10 text-[#38BDF8] border border-[#06B6D4]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SURAKSHA KNOWLEDGE PLATFORM · {metadata.releaseVersion}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            SURAKSHA Documentation
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            Explore the architecture, flood intelligence systems, datasets, machine-learning models,
            and APIs powering SURAKSHA. Built for hydrologists, disaster responders, and engineers.
          </p>

          {/* Pill Search Trigger Input */}
          <div className="max-w-2xl mx-auto pt-2">
            <div
              onClick={onOpenSearch}
              className="cursor-pointer group flex items-center justify-between px-5 py-3.5 rounded-full bg-[#10161F] hover:bg-[#16202C] border border-white/15 hover:border-[#06B6D4] shadow-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-[#06B6D4]" />
                <span className="text-xs sm:text-sm text-slate-400 group-hover:text-white transition-colors">
                  Search 84 technical documents, models, APIs, and runbooks...
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/10 text-slate-300 border border-white/15">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>

          {/* Key Metrics Banner */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl border border-white/10 bg-[#10161F]/70">
              <div className="text-2xl font-bold text-white font-mono">
                {metadata.totalDocuments}
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                Technical Docs
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-[#10161F]/70">
              <div className="text-2xl font-bold text-[#06B6D4] font-mono">
                {metadata.statusCounts.VERIFIED}
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                Verified Documents
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-[#10161F]/70">
              <div className="text-2xl font-bold text-white font-mono">16</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                Knowledge Domains
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-[#10161F]/70">
              <div className="text-sm font-semibold text-emerald-400 truncate mt-1">
                Ganga · Patna
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                Primary Basin Focus
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* 1. Start Here: 4 Core Entry Cards */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#06B6D4] block">
                Foundations
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Start Here
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Recommended entry points for quick orientation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div
              onClick={() => onSelectDoc("01-getting-started--problem-statement")}
              className="cursor-pointer group p-5 rounded-2xl border border-white/10 bg-[#10161F]/70 hover:border-[#06B6D4]/60 hover:bg-[#16202C] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-white group-hover:text-[#38BDF8] transition-colors">
                  Understand SURAKSHA
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Problem statement, mission, and how physical models pair with supervisory checks.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#06B6D4]">
                <span>Read Overview</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => onSelectDoc("01-getting-started--quickstart")}
              className="cursor-pointer group p-5 rounded-2xl border border-white/10 bg-[#10161F]/70 hover:border-[#14B8A6]/60 hover:bg-[#16202C] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/15 border border-[#14B8A6]/30 flex items-center justify-center text-[#14B8A6] group-hover:scale-105 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-white group-hover:text-[#2DD4BF] transition-colors">
                  Developer Quickstart
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Prerequisites, local Python environment setup, and running your first reach forecast.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#14B8A6]">
                <span>Set up Local Env</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => onSelectDoc("02-system-architecture--system-architecture")}
              className="cursor-pointer group p-5 rounded-2xl border border-white/10 bg-[#10161F]/70 hover:border-[#38BDF8]/60 hover:bg-[#16202C] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-white group-hover:text-[#60A5FA] transition-colors">
                  System Architecture
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Data flow from gauge ingestion through 1D/2D routing to CAP alert packaging.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#38BDF8]">
                <span>View Architecture</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4 */}
            <div
              onClick={() => onSelectDoc("11-governance--supervisory-framework")}
              className="cursor-pointer group p-5 rounded-2xl border border-white/10 bg-[#10161F]/70 hover:border-amber-400/60 hover:bg-[#16202C] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-white group-hover:text-amber-300 transition-colors">
                  Supervisory Safety
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verification checkpoints, failure recovery, and human sign-off rules.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-amber-400">
                <span>Inspect Safety Model</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Learning Paths */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#06B6D4] block">
                Targeted Reading
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Learning Paths by Role
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Curated sequences tailored for specific technical responsibilities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="p-5 rounded-2xl border border-white/10 bg-[#10161F]/70 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/15 text-[#06B6D4]">
                    {path.tag}
                  </span>
                  <h3 className="font-semibold text-base text-white">
                    {path.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {path.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    Curated Document Path:
                  </span>
                  {path.steps.slice(0, 3).map((step, idx) => (
                    <button
                      key={step.id}
                      onClick={() => onSelectDoc(step.id)}
                      className="w-full text-left text-xs text-slate-300 hover:text-[#06B6D4] truncate block transition-colors cursor-pointer"
                    >
                      {idx + 1}. {step.title}
                    </button>
                  ))}
                  {path.steps.length > 3 && (
                    <span className="text-[10px] text-slate-500">
                      + {path.steps.length - 3} more technical documents
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Browse by Domain: Full Category Directory */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#06B6D4] block">
                Catalog
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                All Documentation Domains
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Complete index across 16 knowledge areas and 84 documents
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || FileCode;
              return (
                <div
                  key={cat.id}
                  className="p-6 rounded-2xl border border-white/10 bg-[#10161F]/70 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-[#06B6D4]">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 border border-white/15 text-slate-400">
                        {cat.docCount} docs
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-base text-white">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        if (cat.docIds && cat.docIds.length > 0) {
                          onSelectDoc(cat.docIds[0]);
                        }
                      }}
                      className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-[#06B6D4] transition-colors py-1 cursor-pointer"
                    >
                      <span>Explore Domain</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
