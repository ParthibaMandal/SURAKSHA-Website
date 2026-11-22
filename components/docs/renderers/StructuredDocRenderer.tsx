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
} from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

interface StructuredDocRendererProps {
  doc: DocItem;
}

export function StructuredDocRenderer({ doc }: StructuredDocRendererProps) {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

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

  // Parse sections based on ## Headings
  const parsedSections = useMemo(() => {
    const raw = doc.content;
    const lines = raw.split("\n");

    const sections: {
      title: string;
      id: string;
      level: number;
      lines: string[];
    }[] = [];

    let currentSection = {
      title: "Overview",
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
        const title = line.trim().replace(/^##\s+/, "").trim();
        const cleanTitle = title.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`_]/g, "");
        const id = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        currentSection = {
          title: cleanTitle,
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

  // Extract metadata table from the beginning if present
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

  // Render a block of text into rich HTML
  const renderSectionHtml = (lines: string[]) => {
    let text = lines.join("\n");

    // Replace Callouts > [!NOTE] etc. with clean monochrome styles
    text = text.replace(
      />\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*([\s\S]*?)(?=(?:\n\n[^\s>]|\n?$))/gi,
      (match, type, body) => {
        const typeUpper = type.toUpperCase();
        let borderClass = "border-white/30 bg-white/5 text-white";
        let label = "NOTE";

        if (typeUpper === "WARNING" || typeUpper === "CAUTION") {
          borderClass = "border-amber-500/40 bg-amber-500/10 text-amber-300";
          label = "WARNING";
        } else if (typeUpper === "IMPORTANT") {
          borderClass = "border-rose-500/40 bg-rose-500/10 text-rose-300";
          label = "CRITICAL REQUIREMENT";
        } else if (typeUpper === "TIP") {
          borderClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
          label = "ENGINEERING TIP";
        }

        return `<div class="my-5 p-4 rounded-2xl border-l-4 ${borderClass} text-xs leading-relaxed"><div class="font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">${label}</div><div class="text-zinc-300">${body.trim()}</div></div>`;
      }
    );

    try {
      marked.setOptions({ gfm: true, breaks: false });
      const rawHtml = marked.parse(text) as string;

      // Add modern classes to tables
      const styledHtml = rawHtml
        .replace(/<table>/gi, '<div class="my-5 rounded-2xl border border-white/10 overflow-hidden"><table class="w-full text-left text-xs">')
        .replace(/<\/table>/gi, '</table></div>')
        .replace(/<thead>/gi, '<thead class="bg-black text-zinc-400 font-mono text-[11px] border-b border-white/10">')
        .replace(/<th>/gi, '<th class="p-3 font-semibold text-zinc-300">')
        .replace(/<tbody>/gi, '<tbody class="divide-y divide-white/5 bg-[#0A0A0A]">')
        .replace(/<td>/gi, '<td class="p-3 text-zinc-300">');

      return DOMPurify.sanitize(styledHtml, {
        ADD_ATTR: ["target", "id", "class"],
      });
    } catch {
      return `<p>Content render error.</p>`;
    }
  };

  return (
    <div className="space-y-8 my-6 text-white">
      {/* 1. Document Metadata Card */}
      {Object.keys(docMetadata).length > 0 && (
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="font-mono text-xs uppercase tracking-wider text-white font-semibold">
                Technical Specification Metadata
              </span>
            </div>
            <span className="text-[10px] font-mono px-3 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/15">
              {doc.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            {Object.entries(docMetadata).map(([key, val]) => (
              <div key={key} className="space-y-0.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                  {key}
                </span>
                <span className="font-mono text-xs text-zinc-200 truncate block font-medium">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Specialized Interactive Components If Relevant */}
      {isApiDoc && <InteractiveApiExplorer />}
      {isArchitectureDoc && <InteractiveArchitectureView />}
      {isModelDoc && <InteractiveModelCard />}
      {isStationDoc && <InteractiveStationRegistry />}

      {/* 3. Structured Section Cards */}
      <div className="space-y-6">
        {parsedSections.map((sec, sIdx) => {
          // Check if section contains mermaid
          const sectionText = sec.lines.join("\n");
          const hasMermaid = sectionText.includes("```mermaid");

          // Extract mermaid if present
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

          return (
            <section
              key={sec.id || sIdx}
              id={sec.id}
              className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-8 space-y-4 shadow-xl"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-white/5 text-zinc-300 font-mono text-xs font-semibold flex items-center justify-center border border-white/10">
                    {sIdx + 1}
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                    {sec.title}
                  </h2>
                </div>

                <a
                  href={`#${sec.id}`}
                  className="text-xs font-mono text-zinc-500 hover:text-white transition-colors"
                  aria-label="Direct anchor"
                >
                  #{sec.id}
                </a>
              </div>

              {/* Rendered Section Body */}
              <div
                className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3
                  [&_p]:my-3 [&_p]:leading-relaxed
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ul]:space-y-1.5
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_ol]:space-y-1.5
                  [&_code]:text-white [&_code]:font-mono [&_code]:text-xs [&_code]:bg-white/5 [&_code]:border [&_code]:border-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
                  [&_pre]:bg-black [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:overflow-x-auto [&_pre]:my-4
                  [&_a]:text-white [&_a]:underline hover:[&_a]:text-zinc-300"
                dangerouslySetInnerHTML={{
                  __html: renderSectionHtml(textWithoutMermaid.split("\n")),
                }}
              />

              {/* Mermaid diagram if present in this section */}
              {hasMermaid && mermaidCode && (
                <div className="pt-2">
                  <MermaidRenderer id={`${sec.id}-diagram`} chart={mermaidCode} />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
