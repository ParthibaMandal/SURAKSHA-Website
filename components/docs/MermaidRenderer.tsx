"use client";

import React, { useEffect, useRef, useState } from "react";
import { Code2, Eye, AlertCircle } from "lucide-react";

interface MermaidRendererProps {
  chart: string;
  id: string;
}

export function MermaidRenderer({ chart, id }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showSource, setShowSource] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!chart || typeof window === "undefined") return;

      try {
        setLoading(true);
        setError(null);

        // Dynamically import mermaid to avoid any SSR issues
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          themeVariables: {
            darkMode: true,
            background: "#1A1A18",
            primaryColor: "#2F6BFF",
            primaryTextColor: "#EDE4D3",
            primaryBorderColor: "#3B82F6",
            lineColor: "#60A5FA",
            secondaryColor: "#292925",
            tertiaryColor: "#1E1E1C",
            edgeLabelBackground: "#292925",
            mainBkg: "#292925",
            nodeBorder: "#3B82F6",
          },
        });

        // Generate safe unique ID
        const cleanId = `mermaid-${id.replace(/[^a-zA-Z0-9-_]/g, "")}-${Math.floor(
          Math.random() * 10000
        )}`;

        // Render diagram
        const { svg } = await mermaid.render(cleanId, chart);

        if (isMounted) {
          setSvgHtml(svg);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn("Mermaid render error:", err);
          setError(err?.message || "Failed to render Mermaid diagram.");
          setLoading(false);
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  return (
    <div className="my-6 rounded-xl border border-[#D8CBB3]/15 bg-[#141413] overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#D8CBB3]/10 bg-[#1A1A18] text-xs text-[#A69B88]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2F6BFF]" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#D8CBB3]">
            Architecture Diagram
          </span>
        </div>
        <button
          onClick={() => setShowSource(!showSource)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-[#292925] hover:bg-[#343430] text-[#D8CBB3] transition-colors"
        >
          {showSource ? (
            <>
              <Eye className="w-3.5 h-3.5 text-[#2F6BFF]" />
              <span>View Diagram</span>
            </>
          ) : (
            <>
              <Code2 className="w-3.5 h-3.5 text-[#A69B88]" />
              <span>View Source</span>
            </>
          )}
        </button>
      </div>

      {/* Main View Area */}
      {showSource ? (
        <pre className="p-4 text-xs font-mono text-[#D8CBB3] bg-[#0E0E0D] overflow-x-auto leading-relaxed">
          <code>{chart}</code>
        </pre>
      ) : error ? (
        <div className="p-6 text-xs text-[#A69B88]">
          <div className="flex items-center gap-2 text-[#F59E0B] mb-2 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>Diagram Preview Unavailable</span>
          </div>
          <p className="mb-3 text-[11px]">
            The diagram definition uses advanced formatting. You can inspect the raw architecture logic below:
          </p>
          <pre className="p-3 rounded bg-[#1A1A18] font-mono text-[11px] text-[#EDE4D3] overflow-x-auto">
            <code>{chart}</code>
          </pre>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center p-12 text-xs text-[#A69B88]">
          <div className="w-4 h-4 rounded-full border-2 border-[#2F6BFF] border-t-transparent animate-spin mr-2" />
          Rendering interactive diagram...
        </div>
      ) : (
        <div
          ref={containerRef}
          className="p-6 overflow-x-auto flex justify-center [&>svg]:max-w-full [&>svg]:h-auto bg-[#141413]"
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      )}
    </div>
  );
}
