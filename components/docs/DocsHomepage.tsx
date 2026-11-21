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
    <div className="flex-1 bg-[#1E1E1C] text-[#D8CBB3] pb-24">
      {/* Hero Section */}
      <section className="relative border-b border-[#D8CBB3]/15 bg-gradient-to-b from-[#242421] via-[#1E1E1C] to-[#1E1E1C] px-4 sm:px-6 lg:px-8 pt-14 pb-16">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#2F6BFF]/10 text-[#2F6BFF] border border-[#2F6BFF]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SURAKSHA KNOWLEDGE PLATFORM · {metadata.releaseVersion}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#EDE4D3]">
            SURAKSHA Documentation
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-[#A69B88] leading-relaxed">
            Explore the architecture, flood intelligence systems, datasets, machine-learning models,
            and APIs powering SURAKSHA. Built for hydrologists, disaster responders, and engineers.
          </p>

          {/* Search Trigger Input */}
          <div className="max-w-2xl mx-auto pt-2">
            <div
              onClick={onOpenSearch}
              className="cursor-pointer group flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#292925] hover:bg-[#32322E] border border-[#D8CBB3]/25 hover:border-[#2F6BFF] shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-[#2F6BFF]" />
                <span className="text-xs sm:text-sm text-[#A69B88] group-hover:text-[#EDE4D3] transition-colors">
                  Search 84 technical documents, models, APIs, and runbooks...
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 rounded text-[11px] font-mono bg-[#1E1E1C] text-[#D8CBB3] border border-[#D8CBB3]/20">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>

          {/* Key Metrics Banner */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925]/60">
              <div className="text-2xl font-bold text-[#EDE4D3] font-mono">
                {metadata.totalDocuments}
              </div>
              <div className="text-[11px] text-[#A69B88] uppercase tracking-wider font-mono mt-0.5">
                Technical Docs
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925]/60">
              <div className="text-2xl font-bold text-[#2F6BFF] font-mono">
                {metadata.statusCounts.VERIFIED}
              </div>
              <div className="text-[11px] text-[#A69B88] uppercase tracking-wider font-mono mt-0.5">
                Verified Documents
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925]/60">
              <div className="text-2xl font-bold text-[#EDE4D3] font-mono">16</div>
              <div className="text-[11px] text-[#A69B88] uppercase tracking-wider font-mono mt-0.5">
                Knowledge Domains
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#D8CBB3]/15 bg-[#292925]/60">
              <div className="text-sm font-semibold text-[#10B981] truncate mt-1">
                Ganga · Patna
              </div>
              <div className="text-[11px] text-[#A69B88] uppercase tracking-wider font-mono mt-0.5">
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
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#2F6BFF] block">
                Foundations
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#EDE4D3] tracking-tight">
                Start Here
              </h2>
            </div>
            <span className="text-xs text-[#A69B88]">
              Recommended entry points for quick orientation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div
              onClick={() => onSelectDoc("01-getting-started--problem-statement")}
              className="cursor-pointer group p-5 rounded-2xl border border-[#D8CBB3]/15 bg-[#292925] hover:border-[#2F6BFF]/60 hover:bg-[#2F2F2B] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#2F6BFF]/15 border border-[#2F6BFF]/30 flex items-center justify-center text-[#2F6BFF] group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-[#EDE4D3] group-hover:text-[#60A5FA] transition-colors">
                  Understand SURAKSHA
                </h3>
                <p className="text-xs text-[#A69B88] leading-relaxed line-clamp-3">
                  Critical gaps in Indian flood response, problem statement, Patna focus, and how SURAKSHA operates as a civil defense intelligence system.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs text-[#2F6BFF] font-medium group-hover:translate-x-1 transition-transform">
                <span>Read Overview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => onSelectDoc("04-system-architecture--architecture-overview")}
              className="cursor-pointer group p-5 rounded-2xl border border-[#D8CBB3]/15 bg-[#292925] hover:border-[#2F6BFF]/60 hover:bg-[#2F2F2B] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] group-hover:scale-105 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-[#EDE4D3] group-hover:text-[#60A5FA] transition-colors">
                  System Architecture
                </h3>
                <p className="text-xs text-[#A69B88] leading-relaxed line-clamp-3">
                  Modular monolith architecture, 7-agent topology, and the TypeSafe Jev Three-Gate supervisor preventing hallucinations and false alerts.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs text-[#2F6BFF] font-medium group-hover:translate-x-1 transition-transform">
                <span>Explore Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => onSelectDoc("13-deployment-and-infrastructure--setup")}
              className="cursor-pointer group p-5 rounded-2xl border border-[#D8CBB3]/15 bg-[#292925] hover:border-[#2F6BFF]/60 hover:bg-[#2F2F2B] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] group-hover:scale-105 transition-transform">
                  <FileCode className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-[#EDE4D3] group-hover:text-[#60A5FA] transition-colors">
                  Developer Quickstart
                </h3>
                <p className="text-xs text-[#A69B88] leading-relaxed line-clamp-3">
                  Clone the repository, configure virtual environment, set up FastAPI with synthetic Ganga test data, and run pytest suites.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs text-[#2F6BFF] font-medium group-hover:translate-x-1 transition-transform">
                <span>Setup Environment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4 */}
            <div
              onClick={() => onSelectDoc("09-backend-and-api--api-reference")}
              className="cursor-pointer group p-5 rounded-2xl border border-[#D8CBB3]/15 bg-[#292925] hover:border-[#2F6BFF]/60 hover:bg-[#2F2F2B] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] group-hover:scale-105 transition-transform">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-[#EDE4D3] group-hover:text-[#60A5FA] transition-colors">
                  REST API Reference
                </h3>
                <p className="text-xs text-[#A69B88] leading-relaxed line-clamp-3">
                  Endpoints for real-time hydrological telemetry, ensemble forecasts, OASIS CAP v1.2 alerts, gate advisory, and civil defense sitreps.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs text-[#2F6BFF] font-medium group-hover:translate-x-1 transition-transform">
                <span>View API Endpoints</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Guided Learning Paths */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#10B981] block">
                Structured Curricula
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#EDE4D3] tracking-tight">
                Learning Paths
              </h2>
            </div>
            <span className="text-xs text-[#A69B88]">
              Step-by-step reading orders customized to your role
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="p-5 rounded-2xl border border-[#D8CBB3]/15 bg-[#242421] hover:border-[#D8CBB3]/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#292925] text-[#2F6BFF] border border-[#2F6BFF]/20">
                      {path.tag}
                    </span>
                    <span className="text-[10px] font-mono text-[#A69B88]">
                      {path.steps.length} Steps
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#EDE4D3] tracking-tight">
                    {path.title}
                  </h3>

                  <p className="text-xs text-[#A69B88] leading-relaxed">
                    {path.description}
                  </p>

                  {/* Steps List */}
                  <div className="pt-2 space-y-1.5">
                    {path.steps.map((step, sIdx) => (
                      <div
                        key={step.id}
                        onClick={() => onSelectDoc(step.id)}
                        className="cursor-pointer group/step flex items-center gap-2.5 p-2 rounded-lg bg-[#1E1E1C] hover:bg-[#292925] text-xs text-[#D8CBB3] transition-colors"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#292925] group-hover/step:bg-[#2F6BFF] group-hover/step:text-white text-[10px] font-mono flex items-center justify-center text-[#A69B88] transition-colors shrink-0">
                          {sIdx + 1}
                        </span>
                        <span className="truncate group-hover/step:text-[#EDE4D3]">
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D8CBB3]/10 mt-4">
                  <button
                    onClick={() => onSelectDoc(path.steps[0].id)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-[#2F6BFF] hover:bg-[#2F6BFF]/10 transition-colors"
                  >
                    <span>Start Learning Path</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Browse 16 Architecture Categories */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#F59E0B] block">
                Catalog
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#EDE4D3] tracking-tight">
                Architecture Domains & Knowledge Base
              </h2>
            </div>
            <span className="text-xs text-[#A69B88]">
              All 16 technical categories covering 84 verified documents
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || BookOpen;
              return (
                <div
                  key={cat.id}
                  className="p-5 rounded-2xl border border-[#D8CBB3]/15 bg-[#292925] hover:border-[#2F6BFF]/50 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-[#1E1E1C] border border-[#D8CBB3]/15 flex items-center justify-center text-[#2F6BFF]">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E1E1C] text-[#A69B88]">
                        {cat.docCount} docs
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-[#EDE4D3] tracking-tight">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-[#A69B88] line-clamp-2 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D8CBB3]/10">
                    <button
                      onClick={() => {
                        if (cat.docIds && cat.docIds.length > 0) {
                          onSelectDoc(cat.docIds[0]);
                        }
                      }}
                      className="w-full flex items-center justify-between text-xs text-[#D8CBB3] hover:text-[#2F6BFF] transition-colors py-1"
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

        {/* 4. Project Ground Truth & Operational Verification Panel */}
        <section className="p-6 sm:p-8 rounded-3xl border border-[#D8CBB3]/20 bg-[#242421] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CBB3]/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#EDE4D3]">
                  Project Ground Truth & Operational Boundary
                </h3>
                <p className="text-xs text-[#A69B88]">
                  Verified operational limits and implementation status of SURAKSHA
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded text-[11px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Audit Status: Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#2F6BFF] block">
                Geographic Focus & Stations
              </span>
              <p className="text-[#D8CBB3] leading-relaxed">
                Primary active basin is the <strong className="text-[#EDE4D3]">Ganga River System</strong> in Bihar. Monitored benchmark station: <strong className="text-[#EDE4D3]">Gandhi Ghat (STN-PAT-01)</strong>. Warning threshold: <strong className="text-[#EDE4D3]">50.50 m</strong>; Danger threshold: <strong className="text-[#EDE4D3]">51.80 m</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#10B981] block">
                Gate Actuation Boundary
              </span>
              <p className="text-[#D8CBB3] leading-relaxed">
                SURAKSHA generates <strong className="text-[#EDE4D3]">supervisory decision advisories</strong> for irrigation engineers and civil defense authorities. The platform does <strong className="text-[#EDE4D3]">not</strong> possess direct SCADA actuator control over physical barrage or sluice gate motors.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#F59E0B] block">
                Hazard Scope & Verification
              </span>
              <p className="text-[#D8CBB3] leading-relaxed">
                Currently, <strong className="text-[#EDE4D3]">Module 01: Flood Intelligence</strong> is implemented and tested. Earthquake, Cyclone, and Drought modules are roadmap proposals. Of 84 documents, <strong className="text-[#EDE4D3]">44 are verified against code tests</strong>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

