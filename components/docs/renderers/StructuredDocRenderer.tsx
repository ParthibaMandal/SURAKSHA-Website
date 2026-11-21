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
    // Remove the metadata table if it's in the first section to avoid duplication
    let text = lines.join("\n");

    // Replace Callouts > [!NOTE] etc.
    text = text.replace(
      />\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*([\s\S]*?)(?=(?:\n\n[^\s>]|\n?$))/gi,
      (match, type, body) => {
        const typeUpper = type.toUpperCase();
        let borderClass = "border-[#2F6BFF] bg-[#2F6BFF]/10 text-[#60A5FA]";
        let label = "NOTE";

        if (typeUpper === "WARNING" || typeUpper === "CAUTION") {
          borderClass = "border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B]";
          label = "WARNING";
        } else if (typeUpper === "IMPORTANT") {
          borderClass = "border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]";
          label = "CRITICAL REQUIREMENT";
        } else if (typeUpper === "TIP") {
          borderClass = "border-[#10B981] bg-[#10B981]/10 text-[#10B981]";
          label = "ENGINEERING TIP";
        }

        return `<div class="my-5 p-4 rounded-2xl border-l-4 ${borderClass} text-xs leading-relaxed"><div class="font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">${label}</div><div class="text-[#D8CBB3]">${body.trim()}</div></div>`;
      }
    );

    try {
      marked.setOptions({ gfm: true, breaks: false });
      const rawHtml = marked.parse(text) as string;

      // Add modern classes to tables
      const styledHtml = rawHtml
        .replace(/<table>/gi, '<div class="my-5 rounded-2xl border border-[#D8CBB3]/15 overflow-hidden"><table class="w-full text-left text-xs">')
        .replace(/<\/table>/gi, '</table></div>')
        .replace(/<thead>/gi, '<thead class="bg-[#1E1E1C] text-[#A69B88] font-mono text-[11px] border-b border-[#D8CBB3]/15">')
        .replace(/<th>/gi, '<th class="p-3">')
        .replace(/<tbody>/gi, '<tbody class="divide-y divide-[#D8CBB3]/5 bg-[#242421]/60">')
        .replace(/<td>/gi, '<td class="p-3 text-[#D8CBB3]">');

      return DOMPurify.sanitize(styledHtml, {
        ADD_ATTR: ["target", "id", "class"],
      });
    } catch {
      return `<p>Content render error.</p>`;
    }
  };

  return (
    <div className="space-y-8 my-6">
      {/* 1. Sleek Document Metadata Card */}
      {Object.keys(docMetadata).length > 0 && (
        <div className="p-5 rounded-2xl border border-[#D8CBB3]/20 bg-[#242421] shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D8CBB3]/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#EDE4D3] font-bold">
                Technical Specification Metadata
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              {doc.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            {Object.entries(docMetadata).map(([key, val]) => (
              <div key={key} className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#A69B88] uppercase block">
                  {key}
                </span>
                <span className="font-mono text-xs text-[#EDE4D3] truncate block font-medium">
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
              className="scroll-mt-24 rounded-2xl border border-[#D8CBB3]/15 bg-[#242421] p-6 sm:p-8 space-y-4 shadow-sm"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#D8CBB3]/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#2F6BFF]/15 text-[#2F6BFF] font-mono text-xs font-bold flex items-center justify-center">
                    {sIdx + 1}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#EDE4D3] tracking-tight">
                    {sec.title}
                  </h2>
                </div>

                <a
                  href={`#${sec.id}`}
                  className="text-xs font-mono text-[#A69B88] hover:text-[#2F6BFF] transition-colors"
                  aria-label="Direct anchor"
                >
                  #{sec.id}
                </a>
              </div>

              {/* Rendered Section Body */}
              <div
                className="text-xs sm:text-sm text-[#D8CBB3] leading-relaxed space-y-3
                  [&_p]:my-3 [&_p]:leading-relaxed
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ul]:space-y-1.5
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_ol]:space-y-1.5
                  [&_code]:text-[#60A5FA] [&_code]:font-mono [&_code]:text-xs [&_code]:bg-[#1E1E1C] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
                  [&_pre]:bg-[#141413] [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[#D8CBB3]/15 [&_pre]:overflow-x-auto [&_pre]:my-4
                  [&_a]:text-[#2F6BFF] [&_a]:underline hover:[&_a]:text-[#60A5FA]"
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
