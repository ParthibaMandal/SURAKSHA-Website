"use client";

import React, { useState } from "react";
import {
  Cpu,
  Shield,
  Layers,
  Network,
  Database,
  Globe,
  Radio,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Server,
} from "lucide-react";

interface AgentItem {
  id: string;
  name: string;
  role: string;
  inputs: string[];
  outputs: string[];
  contractStatus: "VERIFIED" | "IMPLEMENTED";
}

const AGENTS: AgentItem[] = [
  {
    id: "data-agent",
    name: "Data Agent",
    role: "Telemetry Ingestion & Quality Validation",
    inputs: ["CWC NWDP Hydrographs", "Historical Baselines", "Sensor Heartbeats"],
    outputs: ["Clean Hydrological Time Series", "Sensor Health Vector"],
    contractStatus: "VERIFIED",
  },
  {
    id: "weather-agent",
    name: "Weather Agent",
    role: "Monsoon & Precipitation Ingestion",
    inputs: ["IMD Gridded Rainfall", "ECMWF Open-Meteo", "Snowline Isotherms"],
    outputs: ["Catchment Hyetograph", "Degree-Day Cryosphere Melt Vector"],
    contractStatus: "VERIFIED",
  },
  {
    id: "forecast-agent",
    name: "Forecast Agent",
    role: "Hydrodynamic Ensemble Prediction",
    inputs: ["Clean Telemetry", "Catchment Hyetograph", "Hydraulic Geometry"],
    outputs: ["24h-72h Hydrograph Trajectories", "Uncertainty Quantiles (P10-P90)"],
    contractStatus: "VERIFIED",
  },
  {
    id: "satellite-agent",
    name: "Satellite Agent",
    role: "SAR Flood Extent & HAND Inundation",
    inputs: ["Sentinel-1 GRD Passes", "SRTM 30m DEM", "Permanent Water Mask"],
    outputs: ["Active Flood Extent Raster", "HAND Inundation Depth Surface"],
    contractStatus: "VERIFIED",
  },
  {
    id: "impact-agent",
    name: "Impact Agent",
    role: "Patna Urban Infrastructure Cascade",
    inputs: ["Flood Depth Surface", "Patna Consequence Graph", "Asset Catalog"],
    outputs: ["Inundated Hospitals/Substations", "Civic Evacuation Risk Score"],
    contractStatus: "VERIFIED",
  },
  {
    id: "risk-agent",
    name: "Risk Agent",
    role: "OASIS CAP v1.2 Protocol Formulation",
    inputs: ["Peak Stage Forecast", "Impact Assessment", "CWC Danger Levels"],
    outputs: ["OASIS CAP v1.2 Payload", "Civil Defense Sitrep"],
    contractStatus: "VERIFIED",
  },
  {
    id: "verification-agent",
    name: "Verification Agent",
    role: "Multi-Source Corroboration & Audit",
    inputs: ["Agent Forecast Claims", "Ground Truth Observations", "Evidence Graph"],
    outputs: ["Tier-5 Corroboration Verdict", "Provenance Audit Log"],
    contractStatus: "VERIFIED",
  },
];

const GATES = [
  {
    id: "gate-1",
    num: "1",
    name: "Pre-Run Gate",
    stage: "Prior to Model Inference",
    assertion: "Checks water level freshness (< 6 hours latency), zero-sensor dropout, and physical boundary constraints (0m < level < 60m).",
    failureAction: "Rejects execution; triggers fallback to persistence/climatology model and alerts operator.",
    status: "ARMED & VERIFIED",
  },
  {
    id: "gate-2",
    num: "2",
    name: "Mid-Run Gate",
    stage: "During Ensemble Execution",
    assertion: "Verifies neural hidden state norms, numerical stability, and ensures uncertainty spread does not collapse or explode.",
    failureAction: "Reverts to SARIMA champion model if neural challenger shows numerical instability.",
    status: "ARMED & VERIFIED",
  },
  {
    id: "gate-3",
    num: "3",
    name: "Post-Run Gate",
    stage: "Prior to Alert Broadcast",
    assertion: "Validates rate of river rise (cannot exceed 1.2 m/hr physical maximum in Ganga). Confirms CAP message conforms strictly to OASIS schema.",
    failureAction: "Blocks automated public alert; downgrades to internal supervisor review state.",
    status: "ARMED & VERIFIED",
  },
];

export function InteractiveArchitectureView() {
  const [activeTab, setActiveTab] = useState<"agents" | "gates" | "adrs">("agents");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("forecast-agent");

  const selectedAgent = AGENTS.find((a) => a.id === selectedAgentId) || AGENTS[0];

  return (
    <div className="space-y-8 my-8">
      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D8CBB3]/15 pb-2">
        <button
          onClick={() => setActiveTab("agents")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "agents"
              ? "bg-[#2F6BFF] text-white shadow-lg shadow-[#2F6BFF]/20"
              : "text-[#A69B88] hover:text-[#EDE4D3] hover:bg-[#292925]"
          }`}
        >
          <Network className="w-4 h-4" />
          <span>7-Agent Specialist Topology</span>
        </button>

        <button
          onClick={() => setActiveTab("gates")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "gates"
              ? "bg-[#2F6BFF] text-white shadow-lg shadow-[#2F6BFF]/20"
              : "text-[#A69B88] hover:text-[#EDE4D3] hover:bg-[#292925]"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Three-Gate Jev Supervisor</span>
        </button>

        <button
          onClick={() => setActiveTab("adrs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "adrs"
              ? "bg-[#2F6BFF] text-white shadow-lg shadow-[#2F6BFF]/20"
              : "text-[#A69B88] hover:text-[#EDE4D3] hover:bg-[#292925]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Architecture Decisions (ADRs)</span>
        </button>
      </div>

      {/* Tab 1: 7-Agent Topology */}
      {activeTab === "agents" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Agent Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AGENTS.map((agent) => {
                const isSelected = agent.id === selectedAgentId;
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#292925] border-[#2F6BFF] shadow-lg shadow-[#2F6BFF]/10"
                        : "bg-[#242421] border-[#D8CBB3]/15 hover:border-[#D8CBB3]/30"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#2F6BFF] uppercase font-bold tracking-wider">
                          Specialist Agent
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                          {agent.contractStatus}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#EDE4D3]">
                        {agent.name}
                      </h4>
                      <p className="text-xs text-[#A69B88] line-clamp-2">
                        {agent.role}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D8CBB3]/10 mt-3 flex items-center justify-between text-[11px] text-[#A69B88]">
                      <span>{agent.inputs.length} Inputs</span>
                      <span>{agent.outputs.length} Outputs</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Col: Selected Agent Detail Inspector */}
            <div className="p-5 rounded-2xl border border-[#D8CBB3]/20 bg-[#292925] flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#2F6BFF] uppercase font-semibold">
                    Agent Contract Specification
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    TypeSafe Pydantic
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#EDE4D3]">
                    {selectedAgent.name}
                  </h3>
                  <p className="text-xs text-[#A69B88] mt-1">
                    {selectedAgent.role}
                  </p>
                </div>

                {/* Inputs List */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A69B88] block">
                    Input Contracts
                  </span>
                  <div className="space-y-1">
                    {selectedAgent.inputs.map((inp, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-[#1E1E1C] border border-[#D8CBB3]/10 text-xs text-[#EDE4D3] font-mono flex items-center gap-2"
                      >
                        <ArrowRight className="w-3 h-3 text-[#2F6BFF] shrink-0" />
                        <span>{inp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outputs List */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A69B88] block">
                    Emitted Artifacts
                  </span>
                  <div className="space-y-1">
                    {selectedAgent.outputs.map((out, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-[#1E1E1C] border border-[#D8CBB3]/10 text-xs text-[#10B981] font-mono flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#10B981] shrink-0" />
                        <span>{out}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D8CBB3]/10 text-[11px] text-[#A69B88] font-mono">
                Source: <code className="text-[#60A5FA]">src/suraksha/disasters/flood/agents/</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Three-Gate Jev Supervisor */}
      {activeTab === "gates" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-[#2F6BFF]/30 bg-[#2F6BFF]/10 text-xs text-[#EDE4D3] leading-relaxed">
            <strong className="text-white">Why Jev System One Supervision Matters:</strong> Language and neural models can hallucinate sudden catastrophic surges or miss critical physical warnings. SURAKSHA embeds a deterministic three-tier supervisory harness that enforces hard physical invariants before, during, and after inference.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {GATES.map((gate) => (
              <div
                key={gate.id}
                className="p-5 rounded-2xl border border-[#D8CBB3]/20 bg-[#242421] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-[#2F6BFF]/20 text-[#2F6BFF] font-mono font-bold flex items-center justify-center text-xs">
                      {gate.num}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                      {gate.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#EDE4D3]">
                      {gate.name}
                    </h4>
                    <span className="text-[11px] text-[#2F6BFF] font-mono block">
                      {gate.stage}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <strong className="text-[#EDE4D3] block mb-0.5">Physical Invariant:</strong>
                      <p className="text-[#A69B88] leading-relaxed">
                        {gate.assertion}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[11px] text-[#EF4444] leading-relaxed">
                      <strong className="block mb-0.5">On Failure:</strong>
                      {gate.failureAction}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D8CBB3]/10 text-[10px] font-mono text-[#A69B88]">
                  Enforcement: <code className="text-[#60A5FA]">src/suraksha/disasters/flood/supervisor/</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: ADRs */}
      {activeTab === "adrs" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-[#D8CBB3]/15 bg-[#242421] space-y-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              ADR-001 · ACCEPTED
            </span>
            <h4 className="font-bold text-sm text-[#EDE4D3]">
              Modular Monolith Architecture
            </h4>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Selected over microservices to eliminate inter-process network latency during rapid flood surge evaluation while preserving clean hazard domain isolation (`core`, `disasters/flood`).
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#D8CBB3]/15 bg-[#242421] space-y-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              ADR-002 · ACCEPTED
            </span>
            <h4 className="font-bold text-sm text-[#EDE4D3]">
              Three-Gate Jev Supervisor
            </h4>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Decoupled verification plane enforcing physical hydrology bounds (mass conservation, maximum rate of river rise) ahead of public alerting.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#D8CBB3]/15 bg-[#242421] space-y-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              ADR-003 · ACCEPTED
            </span>
            <h4 className="font-bold text-sm text-[#EDE4D3]">
              FastAPI Asynchronous Gateway
            </h4>
            <p className="text-xs text-[#A69B88] leading-relaxed">
              Asynchronous non-blocking HTTP runtime with native Pydantic contract serialization, automatic OpenAPI documentation, and sub-millisecond route dispatch.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

