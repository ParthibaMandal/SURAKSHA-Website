"use client";

import React, { useState } from "react";
import {
  Server,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Search,
  Shield,
  Layers,
  CheckCircle2,
  AlertCircle,
  Play,
} from "lucide-react";

interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  defaultVal?: string;
  description: string;
}

interface ApiEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  summary: string;
  description: string;
  auth: string;
  parameters: ApiParam[];
  requestSample?: string;
  responseSample: string;
  responseCode: number;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: "health",
    method: "GET",
    path: "/api/v1/flood/health",
    summary: "System Health & Model Readiness",
    description: "Returns sub-system telemetry ingestion status, model checkpoint integrity, GEE connectivity, and supervisor health.",
    auth: "None (Public)",
    parameters: [],
    responseCode: 200,
    responseSample: `{
  "status": "healthy",
  "version": "0.2.0-beta",
  "basin": "Ganga (Patna Corridor)",
  "active_station": "Gandhi Ghat (STN-PAT-01)",
  "subsystems": {
    "cwc_telemetry": "CONNECTED",
    "forecast_engine": "READY (Champion: SARIMA, Challenger: BiLSTM)",
    "jev_supervisor": "ACTIVE (3/3 Gates Armed)",
    "gee_client": "READY"
  },
  "timestamp": "2026-11-21T09:15:00Z"
}`,
  },
  {
    id: "stations",
    method: "GET",
    path: "/api/v1/flood/stations",
    summary: "List Configured Hydrological Stations",
    description: "Retrieves metadata, zero levels, and warning/danger thresholds for all monitored CWC and state telemetry stations.",
    auth: "None (Public)",
    parameters: [
      {
        name: "basin",
        type: "string",
        required: false,
        defaultVal: "ganga",
        description: "Filter stations by river basin name (e.g. ganga, son, gandak)",
      },
      {
        name: "status",
        type: "string",
        required: false,
        defaultVal: "active",
        description: "Filter by station operational state (active, maintenance, offline)",
      },
    ],
    responseCode: 200,
    responseSample: `[
  {
    "station_id": "STN-PAT-01",
    "name": "Gandhi Ghat, Patna",
    "river": "Ganga",
    "state": "Bihar",
    "zero_level_m": 45.00,
    "warning_level_m": 50.50,
    "danger_level_m": 51.80,
    "hfl_m": 52.52,
    "hfl_date": "2016-08-25",
    "status": "active"
  },
  {
    "station_id": "STN-PAT-02",
    "name": "Digha Ghat, Patna",
    "river": "Ganga",
    "state": "Bihar",
    "zero_level_m": 44.80,
    "warning_level_m": 50.00,
    "danger_level_m": 50.45,
    "hfl_m": 51.80,
    "status": "active"
  }
]`,
  },
  {
    id: "forecast",
    method: "POST",
    path: "/api/v1/flood/forecast",
    summary: "Generate Multistep Hydrological Forecast",
    description: "Executes the champion-challenger forecasting ensemble for the Patna Ganga basin across 24h, 48h, and 72h lead times.",
    auth: "Bearer Token / API Key",
    parameters: [
      {
        name: "station_id",
        type: "string",
        required: true,
        description: "Target CWC telemetry gauge station code (e.g. STN-PAT-01)",
      },
      {
        name: "horizon_hours",
        type: "integer",
        required: false,
        defaultVal: "72",
        description: "Forecast prediction window in hours: 24, 48, or 72",
      },
      {
        name: "model_preference",
        type: "string",
        required: false,
        defaultVal: "champion",
        description: "Model selector: 'champion' (SARIMA), 'challenger' (BiLSTM), or 'ensemble'",
      },
    ],
    requestSample: `{
  "station_id": "STN-PAT-01",
  "horizon_hours": 72,
  "model_preference": "ensemble",
  "include_uncertainty_bounds": true
}`,
    responseCode: 200,
    responseSample: `{
  "forecast_id": "FC-20261121-0915-PAT",
  "station_id": "STN-PAT-01",
  "station_name": "Gandhi Ghat, Patna",
  "model_selected": "Ensemble (Champion: SARIMA 60%, Challenger: BiLSTM 40%)",
  "current_stage_m": 49.82,
  "danger_level_m": 51.80,
  "peak_forecast_stage_m": 51.24,
  "peak_time_utc": "2026-11-22T18:00:00Z",
  "risk_classification": "ALERT_ELEVATED",
  "lead_time_to_warning_hours": 16.5,
  "trajectory": [
    { "lead_hours": 6, "stage_m": 50.05, "p10_m": 49.95, "p90_m": 50.15 },
    { "lead_hours": 12, "stage_m": 50.38, "p10_m": 50.22, "p90_m": 50.54 },
    { "lead_hours": 24, "stage_m": 50.85, "p10_m": 50.60, "p90_m": 51.10 },
    { "lead_hours": 48, "stage_m": 51.24, "p10_m": 50.92, "p90_m": 51.55 },
    { "lead_hours": 72, "stage_m": 50.90, "p10_m": 50.45, "p90_m": 51.35 }
  ],
  "jev_supervisor_verdict": {
    "pre_run_gate": "PASSED (Quality score: 0.98)",
    "mid_run_gate": "PASSED (Bounds valid)",
    "post_run_gate": "PASSED (No divergence detected)"
  }
}`,
  },
  {
    id: "alerts-cap",
    method: "GET",
    path: "/api/v1/flood/alerts/cap",
    summary: "OASIS Common Alerting Protocol (CAP v1.2) XML/JSON",
    description: "Generates standardized OASIS CAP v1.2 compliant emergency messages for broadcast to state NDMA/SDMA conduits.",
    auth: "None (Public)",
    parameters: [
      {
        name: "status",
        type: "string",
        required: false,
        defaultVal: "Actual",
        description: "CAP status flag: 'Actual', 'Exercise', 'System', 'Test'",
      },
      {
        name: "format",
        type: "string",
        required: false,
        defaultVal: "json",
        description: "Output serialization: 'json' or 'xml'",
      },
    ],
    responseCode: 200,
    responseSample: `{
  "identifier": "SRK-CAP-20261121-0012",
  "sender": "suraksha.ganga.bihar@gov.in",
  "sent": "2026-11-21T09:15:30Z",
  "status": "Actual",
  "msgType": "Alert",
  "scope": "Public",
  "info": {
    "category": "Met",
    "event": "Riverine Flood Watch",
    "urgency": "Expected",
    "severity": "Moderate",
    "certainty": "Likely",
    "headline": "Ganga River Stage Approaching Warning Level at Gandhi Ghat, Patna",
    "description": "Hydrodynamic model forecasts Ganga stage reaching 50.50m (Warning Level) within 16 hours due to upstream discharge.",
    "area": {
      "areaDesc": "Patna Urban Corridor, Bihar",
      "circle": "25.6120,85.1780,15.0"
    }
  }
}`,
  },
  {
    id: "gate-advisory",
    method: "GET",
    path: "/api/v1/flood/gates/advisory",
    summary: "Hydraulic Sluice Gate Advisory (Simulation)",
    description: "Computes optimal supervisory gate discharge recommendations for municipal sluice engineers. Note: Advisory only, no direct motor actuation.",
    auth: "Bearer Token (Operator)",
    parameters: [
      {
        name: "drainage_basin",
        type: "string",
        required: false,
        defaultVal: "patna_urban",
        description: "Basin code for municipal outfall regulators",
      },
    ],
    responseCode: 200,
    responseSample: `{
  "advisory_id": "ADV-GATE-20261121-09",
  "regulator_name": "Patna Main Sluice Complex",
  "operational_mode": "SUPERVISORY_ADVISORY_ONLY",
  "physical_actuation_enabled": false,
  "current_tailwater_elevation_m": 49.82,
  "internal_drainage_level_m": 48.90,
  "recommended_action": "REMAIN_CLOSED_COUNTER_SURGE",
  "rationale": "Ganga tailwater is 0.92m higher than urban internal sump. Opening sluices would cause backflow flooding into low-lying urban sectors.",
  "timestamp": "2026-11-21T09:15:00Z"
}`,
  },
];

export function InteractiveApiExplorer() {
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTabByEndpoint, setActiveTabByEndpoint] = useState<Record<string, "curl" | "response" | "python">>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = ENDPOINTS.filter((ep) => {
    if (selectedMethod !== "ALL" && ep.method !== selectedMethod) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ep.path.toLowerCase().includes(q) ||
      ep.summary.toLowerCase().includes(q) ||
      ep.description.toLowerCase().includes(q)
    );
  });

  const getActiveTab = (epId: string) => activeTabByEndpoint[epId] || "response";

  const setTab = (epId: string, tab: "curl" | "response" | "python") => {
    setActiveTabByEndpoint((prev) => ({ ...prev, [epId]: tab }));
  };

  const handleCopy = (id: string, text: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const generateCurl = (ep: ApiEndpoint) => {
    if (ep.method === "GET") {
      return `curl -X GET "http://localhost:8000${ep.path}" \\
  -H "Accept: application/json"`;
    }
    return `curl -X POST "http://localhost:8000${ep.path}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_SURAKSHA_API_KEY" \\
  -d '${ep.requestSample?.replace(/\n/g, "")}'`;
  };

  const generatePython = (ep: ApiEndpoint) => {
    if (ep.method === "GET") {
      return `import httpx

response = httpx.get("http://localhost:8000${ep.path}")
print(response.status_code)
print(response.json())`;
    }
    return `import httpx

headers = {"Authorization": "Bearer YOUR_SURAKSHA_API_KEY"}
payload = ${ep.requestSample || "{}"}

response = httpx.post("http://localhost:8000${ep.path}", json=payload, headers=headers)
print(response.json())`;
  };

  return (
    <div className="space-y-8 my-8">
      {/* Top Protocol & Base URL Card */}
      <div className="p-5 rounded-2xl border border-[#D8CBB3]/20 bg-[#242421] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#EDE4D3] font-semibold">
              SURAKSHA REST API Gateway · FastAPI Engine
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#A69B88]">
            <span>Base URL:</span>
            <code className="text-[#38BDF8] bg-[#1E1E1C] px-2 py-0.5 rounded border border-[#D8CBB3]/15">
              http://localhost:8000/api/v1/flood
            </code>
          </div>
        </div>

        <button
          onClick={() => handleCopy("base-url", "http://localhost:8000/api/v1/flood")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E1C] hover:bg-[#2D2D29] border border-[#D8CBB3]/20 text-xs text-[#EDE4D3] transition-colors shrink-0"
        >
          {copiedId === "base-url" ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[#10B981]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#A69B88]" />
              <span>Copy Base URL</span>
            </>
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Method filter pills */}
        <div className="flex items-center gap-1.5 bg-[#242421] p-1 rounded-xl border border-[#D8CBB3]/15 text-xs">
          {["ALL", "GET", "POST"].map((method) => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method)}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                selectedMethod === method
                  ? "bg-[#06B6D4] text-white font-semibold shadow"
                  : "text-[#A69B88] hover:text-[#EDE4D3]"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A69B88]" />
          <input
            type="text"
            placeholder="Search API endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#242421] border border-[#D8CBB3]/20 rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#EDE4D3] placeholder-[#A69B88] focus:outline-none focus:border-[#06B6D4]"
          />
        </div>
      </div>

      {/* Endpoint Cards List */}
      <div className="space-y-6">
        {filtered.map((ep) => {
          const tab = getActiveTab(ep.id);
          const curlCode = generateCurl(ep);
          const pyCode = generatePython(ep);

          return (
            <div
              key={ep.id}
              className="rounded-2xl border border-[#D8CBB3]/15 bg-[#242421] overflow-hidden shadow-md"
            >
              {/* Endpoint Header Bar */}
              <div className="p-4 sm:p-5 border-b border-[#D8CBB3]/10 bg-[#292925] flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider ${
                      ep.method === "GET"
                        ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40"
                        : "bg-[#3B82F6]/20 text-[#38BDF8] border border-[#3B82F6]/40"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm font-semibold text-[#EDE4D3] tracking-tight">
                    {ep.path}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#1E1E1C] text-[#A69B88] border border-[#D8CBB3]/10">
                    Auth: {ep.auth}
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    HTTP {ep.responseCode}
                  </span>
                </div>
              </div>

              {/* Endpoint Description */}
              <div className="p-5 space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-[#EDE4D3] mb-1">
                    {ep.summary}
                  </h4>
                  <p className="text-xs text-[#A69B88] leading-relaxed">
                    {ep.description}
                  </p>
                </div>

                {/* Parameters Table (if any) */}
                {ep.parameters.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#A69B88] block">
                      Parameters
                    </span>
                    <div className="border border-[#D8CBB3]/10 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-[#1E1E1C] text-[#A69B88] border-b border-[#D8CBB3]/10 font-mono text-[11px]">
                          <tr>
                            <th className="p-2.5">Field</th>
                            <th className="p-2.5">Type</th>
                            <th className="p-2.5">Requirement</th>
                            <th className="p-2.5">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D8CBB3]/5 bg-[#242421]/60">
                          {ep.parameters.map((param) => (
                            <tr key={param.name}>
                              <td className="p-2.5 font-mono text-[#38BDF8] font-medium">
                                {param.name}
                              </td>
                              <td className="p-2.5 font-mono text-[11px] text-[#A69B88]">
                                {param.type}
                              </td>
                              <td className="p-2.5">
                                {param.required ? (
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                                    required
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono text-[#A69B88]">
                                    optional {param.defaultVal ? `(default: ${param.defaultVal})` : ""}
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-[#D8CBB3] text-xs">
                                {param.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Request / Response Tabbed Box */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between border-b border-[#D8CBB3]/10 pb-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTab(ep.id, "response")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                          tab === "response"
                            ? "bg-[#292925] text-[#EDE4D3] font-semibold border border-[#D8CBB3]/20"
                            : "text-[#A69B88] hover:text-[#EDE4D3]"
                        }`}
                      >
                        Response (JSON)
                      </button>
                      <button
                        onClick={() => setTab(ep.id, "curl")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                          tab === "curl"
                            ? "bg-[#292925] text-[#EDE4D3] font-semibold border border-[#D8CBB3]/20"
                            : "text-[#A69B88] hover:text-[#EDE4D3]"
                        }`}
                      >
                        cURL Request
                      </button>
                      <button
                        onClick={() => setTab(ep.id, "python")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                          tab === "python"
                            ? "bg-[#292925] text-[#EDE4D3] font-semibold border border-[#D8CBB3]/20"
                            : "text-[#A69B88] hover:text-[#EDE4D3]"
                        }`}
                      >
                        Python (httpx)
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        handleCopy(
                          ep.id,
                          tab === "response"
                            ? ep.responseSample
                            : tab === "curl"
                            ? curlCode
                            : pyCode
                        )
                      }
                      className="flex items-center gap-1 text-[11px] font-mono text-[#A69B88] hover:text-[#EDE4D3] transition-colors"
                    >
                      {copiedId === ep.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#10B981]" />
                          <span className="text-[#10B981]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy snippet</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Container */}
                  <div className="rounded-xl border border-[#D8CBB3]/15 bg-[#141413] p-4 overflow-x-auto text-xs font-mono text-[#D8CBB3] leading-relaxed">
                    <pre>
                      <code>
                        {tab === "response"
                          ? ep.responseSample
                          : tab === "curl"
                          ? curlCode
                          : pyCode}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

