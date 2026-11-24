"use client";

import React, { useState, useMemo } from "react";
import { DocItem } from "@/lib/docs";
import { MermaidRenderer } from "@/components/docs/MermaidRenderer";
import { InteractiveApiExplorer } from "./InteractiveApiExplorer";
import { InteractiveArchitectureView } from "./InteractiveArchitectureView";
import { InteractiveModelCard } from "./InteractiveModelCard";
import { InteractiveStationRegistry } from "./InteractiveStationRegistry";
import {
  FileText,
  Code2,
  Copy,
  Check,
  ShieldCheck,
  Info,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Terminal,
  Layers,
  Sparkles,
  Clock,
  BookOpen,
} from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

interface StructuredDocRendererProps {
  doc: DocItem;
}

export function StructuredDocRenderer({ doc }: StructuredDocRendererProps) {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);

  const handleCopyCode = (id: string, code: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    }
  };

  // Check if doc matches specialized interactive views
  const isApiDoc = doc.id.includes("api-reference") || doc.id.includes("backend-architecture");
  const isArchitectureDoc = doc.id.includes("architecture-overview") || doc.id.includes("flood-architecture");
  const isModelDoc = doc.id.includes("bilstm") || doc.id.includes("sarima") || doc.id.includes("forecasting-methodology");
  const isStationDoc = doc.id.includes("station-registry") || doc.id.includes("data-source-registry");

  // Format a question-led section title
  const formatQuestionTitle = (title: string, index: number) => {
    // If title already has question format, keep it
    if (title.endsWith("?") || /^(Why|What|How|Where|When|Who)\b/i.test(title)) {
      return title;
    }
    // Context-sensitive phrasing for standard section headers
    if (/scope|boundary/i.test(title)) return `What is within the operational boundary and scope?`;
    if (/overview|introduction/i.test(title)) return `What is the objective of this specification?`;
    if (/architecture|pipeline/i.test(title)) return `How is the pipeline structured and verified?`;
    if (/methodology|model/i.test(title)) return `How do the predictive models calculate risk?`;
    if (/station|telemetry|sensor/i.test(title)) return `Where are observations measured and ingested?`;
    if (/api|endpoint|request/i.test(title)) return `How do clients interact with the verified endpoints?`;
    if (/safety|supervisory|review/i.test(title)) return `How does human supervisory review safeguard outputs?`;
    if (/implementation|evidence/i.test(title)) return `What evidence validates this implementation?`;
    return title;
  };

  // Parse sections based on ## Headings
  const parsedSections = useMemo(() => {
    const raw = doc.content;
    const lines = raw.split("\n");

    const sections: {
      title: string;
      rawTitle: string;
      id: string;
      level: number;
      lines: string[];
    }[] = [];

    let currentSection = {
      title: "Overview",
      rawTitle: "Overview",
      id: "overview",
      level: 2,
      lines: [] as string[],
    };

    let inCode = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith("```")) {
        inCode = !inCode;
      }

      if (!inCode && line.trim().startsWith("## ")) {
        if (currentSection.lines.length > 0) {
          sections.push(currentSection);
        }
        const rawTitle = line.trim().replace(/^##\s+/, "").trim();
        const cleanTitle = rawTitle.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`_]/g, "");
        const id = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        currentSection = {
          title: cleanTitle,
          rawTitle,
          id: id || `section-${sections.length}`,
          level: 2,
          lines: [],
        };
      } else {
        currentSection.lines.push(line);
      }
    }

    if (currentSection.lines.length > 0) {
      sections.push(currentSection);
    }

    return sections;
  }, [doc]);

  // Extract metadata table from document
  const docMetadata = useMemo(() => {
    const lines = doc.content.split("\n");
    const meta: Record<string, string> = {};

    let inMetaTable = false;
    for (const l of lines) {
      if (l.includes("| Field | Value |") || l.includes("| Attribute | Detail |")) {
        inMetaTable = true;
        continue;
      }
      if (inMetaTable) {
        if (l.trim().startsWith("|---")) continue;
        if (l.trim().startsWith("|") && l.includes("|")) {
          const parts = l.split("|").filter((p) => p.trim() !== "");
          if (parts.length >= 2) {
            const key = parts[0].replace(/[*_`]/g, "").trim();
            const val = parts[1].replace(/[*_`]/g, "").trim();
            meta[key] = val;
          }
        } else {
          break;
        }
      }
    }
    return meta;
  }, [doc]);

  // Generate dynamic key takeaways
  const keyTakeaways = useMemo(() => {
    // If specific document has known takeaways
    if (doc.id.includes("scope") || doc.id.includes("boundary")) {
      return [
        "What SURAKSHA currently covers in production.",
        "Geographical study boundaries across the Patna Middle Ganga corridor.",
        "Which predictive and hydrological capabilities are fully implemented.",
        "What is simulated, synthetic, or advisory only for safety.",
        "What remains explicitly outside operational boundaries.",
      ];
    }
    if (doc.id.includes("api")) {
      return [
        "Verified REST contracts for pipeline simulation and telemetry.",
        "Authentication requirements and operator API key protection.",
        "Deterministic synthetic scenario execution parameters.",
        "Response schemas and error handling conventions.",
      ];
    }
    if (doc.id.includes("model") || doc.id.includes("forecast")) {
      return [
        "Hydrological modeling architecture (BiLSTM, SARIMA, Ensemble).",
        "Forecast horizons and 90% uncertainty confidence intervals.",
        "Datum benchmarks (CWC Gandhi Ghat 44.20m baseline).",
        "Deterministic simulator mode vs. live physical telemetry.",
      ];
    }
    // Generic high-value takeaways derived from section titles
    return parsedSections
      .filter((s) => s.title !== "Overview" && s.title !== "References")
      .slice(0, 4)
      .map((s) => `Deep dive into ${s.title.toLowerCase()}.`);
  }, [doc.id, parsedSections]);

  // Render a block of markdown text into clean HTML
  const renderSectionHtml = (lines: string[]) => {
    let text = lines.join("\n");

    // Filter out redundant metadata tables at the top of content since we handle it in the header
    text = text.replace(/\| Field \| Value \|[\s\S]*?(?=\n\n[^\s|]|\n?$)/gi, "");
    text = text.replace(/\| Attribute \| Detail \|[\s\S]*?(?=\n\n[^\s|]|\n?$)/gi, "");

    // Replace Callouts > [!NOTE] etc. with clean editorial styles
    text = text.replace(
      />\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*([\s\S]*?)(?=(?:\n\n[^\s>]|\n?$))/gi,
      (match, type, body) => {
        const typeUpper = type.toUpperCase();
        let borderClass = "border-emerald-500 bg-emerald-500/[0.06] text-emerald-900 dark:text-emerald-200";
        let label = "NOTE";

        if (typeUpper === "WARNING" || typeUpper === "CAUTION") {
          borderClass = "border-amber-500 bg-amber-500/[0.06] text-amber-900 dark:text-amber-200";
          label = "WARNING";
        } else if (typeUpper === "IMPORTANT") {
          borderClass = "border-rose-500 bg-rose-500/[0.06] text-rose-900 dark:text-rose-200";
          label = "CRITICAL REQUIREMENT";
        } else if (typeUpper === "TIP") {
          borderClass = "border-teal-500 bg-teal-500/[0.06] text-teal-900 dark:text-teal-200";
          label = "ENGINEERING TIP";
        }

        return `<div class="my-6 p-4 rounded-xl border-l-4 ${borderClass} text-xs sm:text-sm leading-relaxed"><div class="font-mono font-bold uppercase tracking-wider mb-1 text-[11px]">${label}</div><div>${body.trim()}</div></div>`;
      }
    );

    try {
      marked.setOptions({ gfm: true, breaks: false });
      const rawHtml = marked.parse(text) as string;

      // Add modern clean classes to tables
      const styledHtml = rawHtml
        .replace(/<table>/gi, '<div class="my-6 rounded-xl border border-[var(--border)] overflow-x-auto shadow-xs"><table class="w-full text-left text-xs sm:text-sm border-collapse">')
        .replace(/<\/table>/gi, '</table></div>')
        .replace(/<thead>/gi, '<thead class="bg-[var(--surface-elevated)] text-[var(--muted-foreground)] font-mono text-xs border-b border-[var(--border)]">')
        .replace(/<th>/gi, '<th class="p-3.5 font-bold text-[var(--foreground)]">')
        .replace(/<tbody>/gi, '<tbody class="divide-y divide-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]">')
        .replace(/<td>/gi, '<td class="p-3.5 leading-relaxed text-[var(--foreground)]/90">');

      return DOMPurify.sanitize(styledHtml, {
        ADD_ATTR: ["target", "id", "class"],
      });
    } catch {
      return `<p>Content render error.</p>`;
    }
  };

  return (
    <article className="space-y-10 my-4 text-[var(--foreground)] font-sans transition-colors duration-200">
      {/* 1. Editorial Document Header Hero */}
      <header className="space-y-4 pb-8 border-b border-[var(--border)]">
        {/* Category & Verified Status Overline */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            DOCUMENTATION · {doc.category}
          </span>
          <span className="text-[var(--border)]">|</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{doc.status || "Implemented"} · v1.0.0</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--muted-foreground)]">
            <Clock className="w-3 h-3" />
            <span>{doc.readingTime || 3} min read</span>
          </span>
          <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
            Updated {doc.lastVerified || "Nov 24, 2026"}
          </span>
        </div>

        {/* Big Editorial Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)] font-heading leading-tight">
          {doc.id.includes("scope") || doc.id.includes("boundary")
            ? "What is SURAKSHA's operational scope, and what does it actually support?"
            : doc.title}
        </h1>

        {/* Lead Summary Paragraph */}
        {doc.summary && (
          <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed font-normal max-w-3xl">
            {doc.id.includes("scope") || doc.id.includes("boundary")
              ? "Understand which parts of SURAKSHA are implemented, where the platform operates, what it can currently do and which capabilities remain outside its operational boundary."
              : doc.summary}
          </p>
        )}

        {/* "What You Will Learn" Takeaways Box */}
        {keyTakeaways.length > 0 && (
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-5 my-6 text-[var(--foreground)] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
              <Sparkles className="w-4 h-4" />
              <span>What You Will Learn in This Document</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--foreground)]/90">
              {keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Collapsible Technical Metadata Drawer */}
        {Object.keys(docMetadata).length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="flex items-center gap-2 text-xs font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <span>{showMetadata ? "Hide" : "Show"} Technical Specification Metadata ({Object.keys(docMetadata).length} fields)</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMetadata ? "rotate-180" : ""}`} />
            </button>

            {showMetadata && (
              <div className="mt-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {Object.entries(docMetadata).map(([key, val]) => (
                  <div key={key} className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase block">
                      {key}
                    </span>
                    <span className="font-mono text-xs text-[var(--foreground)] truncate block font-medium">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* 2. Specialized Interactive Components If Relevant */}
      {isApiDoc && <InteractiveApiExplorer />}
      {isArchitectureDoc && <InteractiveArchitectureView />}
      {isModelDoc && <InteractiveModelCard />}
      {isStationDoc && <InteractiveStationRegistry />}

      {/* 3. Question-Led Editorial Article Sections (No heavy box cards!) */}
      <div className="space-y-12">
        {parsedSections.map((sec, sIdx) => {
          // Check if section contains mermaid
          const sectionText = sec.lines.join("\n");
          const hasMermaid = sectionText.includes("```mermaid");

          let mermaidCode = "";
          let textWithoutMermaid = sectionText;

          if (hasMermaid) {
            const match = /```mermaid\s*([\s\S]*?)```/.exec(sectionText);
            if (match) {
              mermaidCode = match[1].trim();
              textWithoutMermaid = sectionText.replace(/```mermaid\s*[\s\S]*?```/, "");
            }
          }

          // Skip empty or pure title overview sections
          if (!sec.lines.some((l) => l.trim() && !l.trim().startsWith("#"))) {
            return null;
          }

          const questionTitle = formatQuestionTitle(sec.title, sIdx);

          return (
            <section
              key={sec.id || sIdx}
              id={sec.id}
              className="scroll-mt-24 pt-8 border-t border-[var(--border)] first:border-0 first:pt-0 space-y-5"
            >
              {/* Question-Led Section Header */}
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 select-none">
                    {String(sIdx + 1).padStart(2, "0")}.
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] font-heading">
                    {questionTitle}
                  </h2>
                </div>

                <a
                  href={`#${sec.id}`}
                  className="text-xs font-mono text-[var(--muted-foreground)] hover:text-emerald-500 opacity-50 hover:opacity-100 transition-opacity"
                  aria-label={`Anchor link for ${questionTitle}`}
                >
                  #
                </a>
              </div>

              {/* Editorial Section Body Text */}
              <div
                className="text-[15px] sm:text-base text-[var(--foreground)]/85 leading-[1.8] space-y-4
                  [&_p]:my-4 [&_p]:leading-[1.8]
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:space-y-2
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol]:space-y-2
                  [&_li]:leading-[1.7]
                  [&_code]:text-emerald-600 dark:text-emerald-300 [&_code]:font-mono [&_code]:text-[13px] [&_code]:bg-[var(--surface-elevated)] [&_code]:border [&_code]:border-[var(--border)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
                  [&_pre]:bg-[var(--surface-elevated)] [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:overflow-x-auto [&_pre]:my-5
                  [&_a]:text-emerald-600 dark:text-emerald-400 [&_a]:underline hover:[&_a]:text-emerald-500"
                dangerouslySetInnerHTML={{
                  __html: renderSectionHtml(textWithoutMermaid.split("\n")),
                }}
              />

              {/* Mermaid Diagram Full-Width Render */}
              {hasMermaid && mermaidCode && (
                <div className="pt-3 my-6">
                  <MermaidRenderer id={`${sec.id}-diagram`} chart={mermaidCode} />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </article>
  );
}
