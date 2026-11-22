"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TacticalMapSvg } from "@/components/three/TacticalMapSvg";
import { HydrologicalChart } from "@/components/shared/HydrologicalChart";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Shield,
  Layers,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Search,
  Bell,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface StationRow {
  id: string;
  name: string;
  river: string;
  stage: number;
  warning: number;
  danger: number;
  trend: string;
  lastObs: string;
  dataState: "SAMPLE" | "SYNTHETIC" | "STALE";
  risk: "NORMAL" | "ADVISORY" | "WARNING";
}

const COMMAND_STATIONS: StationRow[] = [
  {
    id: "STN-PAT-01",
    name: "Patna · Digha Ghat",
    river: "Ganga Mainstream",
    stage: 49.82,
    warning: 50.5,
    danger: 51.8,
    trend: "+0.42 m / 6h",
    lastObs: "12m ago",
    dataState: "SAMPLE",
    risk: "NORMAL",
  },
  {
    id: "STN-PAT-02",
    name: "Patna · Gandhi Ghat",
    river: "Ganga Mainstream",
    stage: 48.95,
    warning: 49.5,
    danger: 50.8,
    trend: "+0.28 m / 6h",
    lastObs: "5m ago",
    dataState: "SAMPLE",
    risk: "NORMAL",
  },
  {
    id: "STN-GAN-01",
    name: "Lalganj Gauge",
    river: "Gandak Tributary",
    stage: 52.4,
    warning: 52.0,
    danger: 53.2,
    trend: "+1.15 m / 6h",
    lastObs: "2m ago",
    dataState: "SYNTHETIC",
    risk: "WARNING",
  },
  {
    id: "STN-SON-01",
    name: "Koelwar Reach",
    river: "Son Sub-basin",
    stage: 53.12,
    warning: 53.5,
    danger: 54.8,
    trend: "+0.85 m / 6h",
    lastObs: "8m ago",
    dataState: "SAMPLE",
    risk: "ADVISORY",
  },
  {
    id: "STN-PUN-01",
    name: "Sripalpur Gauge",
    river: "Punpun River",
    stage: 50.6,
    warning: 51.0,
    danger: 52.0,
    trend: "+0.15 m / 6h",
    lastObs: "18m ago",
    dataState: "SAMPLE",
    risk: "NORMAL",
  },
  {
    id: "STN-MOK-04",
    name: "Hathidah Downstream",
    river: "Ganga Mainstream",
    stage: 47.9,
    warning: 48.6,
    danger: 49.8,
    trend: "+0.19 m / 6h",
    lastObs: "44m ago",
    dataState: "STALE",
    risk: "NORMAL",
  },
];

interface AlertWorkflowItem {
  id: string;
  title: string;
  sector: string;
  timestamp: string;
  state: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "DISPATCHED";
}

const INITIAL_ALERTS: AlertWorkflowItem[] = [
  {
    id: "CAP-2026-204",
    title: " Gandak Confluence Rapid Stage Rise Advisory",
    sector: "Lalganj – Hajipur Sector",
    timestamp: "14:20 UTC",
    state: "PENDING_REVIEW",
  },
  {
    id: "CAP-2026-203",
    title: "Middle Ganga Lowland Watch Bulletin",
    sector: "Patna Study Area (Digha to Gandhi Ghat)",
    timestamp: "12:05 UTC",
    state: "APPROVED",
  },
  {
    id: "CAP-2026-202",
    title: "Son Catchment Upstream Inflow Notice",
    sector: "Koelwar Gauge Corridor",
    timestamp: "09:40 UTC",
    state: "DISPATCHED",
  },
  {
    id: "CAP-2026-205",
    title: "Punpun Embankment Preparedness Note",
    sector: "Sripalpur Reach",
    timestamp: "14:48 UTC",
    state: "DRAFT",
  },
];

export default function AdminOverviewPage() {
  const [backendStatus, setBackendStatus] = useState<{
    healthy: boolean;
    title: string;
    detail: string;
  }>({
    healthy: true,
    title: "SURAKSHA Command Pipeline Operational (Sample & Synthetic Mode)",
    detail:
      "Values displayed reflect example research telemetry and synthetic scenarios. Not connected to live government warning feeds.",
  });

  const [stationSearch, setStationSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "NORMAL" | "ADVISORY" | "WARNING">("ALL");
  const [surgePreview, setSurgePreview] = useState(false);
  const [alertItems, setAlertItems] = useState<AlertWorkflowItem[]>(INITIAL_ALERTS);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/flood/health", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const readiness = data.operational_readiness || "REPORTED";
          const health = data.status || "HEALTHY";
          setBackendStatus({
            healthy: health === "HEALTHY",
            title: `SURAKSHA API Reachable · System Status: ${health}`,
            detail: `Operational readiness: ${readiness}. Displaying verified research fixtures and clearly labelled sample telemetry.`,
          });
        }
      } catch {
        // Retain clean fallback status
      }
    }
    checkHealth();
  }, []);

  const filteredStations = COMMAND_STATIONS.filter((st) => {
    const matchesSearch =
      st.id.toLowerCase().includes(stationSearch.toLowerCase()) ||
      st.name.toLowerCase().includes(stationSearch.toLowerCase()) ||
      st.river.toLowerCase().includes(stationSearch.toLowerCase());
    const matchesRisk = riskFilter === "ALL" ? true : st.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const handleAdvanceAlert = (id: string) => {
    setAlertItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.state === "DRAFT") return { ...item, state: "PENDING_REVIEW" };
        if (item.state === "PENDING_REVIEW") return { ...item, state: "APPROVED" };
        if (item.state === "APPROVED") return { ...item, state: "DISPATCHED" };
        return item;
      })
    );
  };

  return (
    <div className="space-y-7 max-w-[1440px] mx-auto">
      {/* Command Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#A1A1AA]/14">
        <div>
          <div className="eyebrow">SURAKSHA / COMMAND · OPERATIONS</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#A1A1AA] tracking-tight">
            Operations Overview
          </h1>
          <p className="text-xs text-[#A69B88] mt-1 font-mono">
            Ganga Basin · Patna Study Area · Scientific Decision-Support Workspace
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSurgePreview(!surgePreview)}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold border transition-colors ${
              surgePreview
                ? "bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/50"
                : "bg-[#0A0A0A] text-[#A1A1AA] border-[#A1A1AA]/18 hover:bg-[#141414]"
            }`}
          >
            {surgePreview ? "MODE: SYNTHETIC SURGE PREVIEW" : "MODE: BASELINE SAMPLE VIEW"}
          </button>
          <Link href="/demo-lab">
            <Button size="sm" className="text-xs">
              Open Simulation Lab
            </Button>
          </Link>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="p-4 rounded-xl border border-[#A1A1AA]/16 bg-[#0A0A0A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFFFFF] mt-1.5 shrink-0" />
          <div>
            <strong className="text-xs sm:text-sm font-bold text-[#A1A1AA] block">
              {backendStatus.title}
            </strong>
            <p className="text-xs text-[#A69B88] mt-0.5 leading-relaxed">{backendStatus.detail}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#141414] text-[#A1A1AA] border border-[#A1A1AA]/16 shrink-0 self-start sm:self-center">
          HUMAN-IN-THE-LOOP ACTIVE
        </span>
      </div>

      {/* A. 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/incidents"
          className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] hover:bg-[#141414] hover:border-[#FFFFFF]/40 transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span className="font-medium">Active Incidents</span>
            <Layers className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#A1A1AA]">02</div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#A69B88]">
            <span>Ganga & Gandak sectors</span>
            <span className="text-[#FFFFFF] group-hover:translate-x-0.5 transition-transform">
              Inspect →
            </span>
          </div>
        </Link>

        <Link
          href="/admin/stations"
          className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] hover:bg-[#141414] hover:border-[#FFFFFF]/40 transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span className="font-medium">Monitoring Stations</span>
            <MapPin className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#A1A1AA]">08</div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#A69B88]">
            <span>Configured basin gauges</span>
            <span className="text-[#FFFFFF] group-hover:translate-x-0.5 transition-transform">
              Stations →
            </span>
          </div>
        </Link>

        <Link
          href="/admin/forecasts"
          className="p-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] hover:bg-[#141414] hover:border-[#FFFFFF]/40 transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span className="font-medium">Pipeline Runs</span>
            <Activity className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#A1A1AA]">14</div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#A69B88]">
            <span>24h ensemble cycles</span>
            <span className="text-[#FFFFFF] group-hover:translate-x-0.5 transition-transform">
              Forecasts →
            </span>
          </div>
        </Link>

        <Link
          href="/admin/approvals"
          className="p-5 rounded-xl border border-[#F59E0B]/35 bg-[#0A0A0A] hover:bg-[#141414] transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#A69B88]">
            <span className="font-medium">Pending Reviews</span>
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#FBBF24]">03</div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#FBBF24]">
            <span>Commander sign-off required</span>
            <span className="group-hover:translate-x-0.5 transition-transform">Review →</span>
          </div>
        </Link>
      </div>

      {/* B. Hydrological Overview Map & C. River Stage Forecast Hydrograph */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* B. Hydrological Overview (Geospatial Map) */}
        <div className="xl:col-span-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
            <div>
              <h2 className="text-sm font-bold text-[#A1A1AA]">Hydrological Overview</h2>
              <p className="text-[11px] text-[#A69B88]">
                River basin map · Station locations · Flood-risk assessment
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-[#141414] text-[#A1A1AA] border border-[#A1A1AA]/20">
              ILLUSTRATIVE
            </span>
          </div>

          <div className="h-[290px] rounded-xl overflow-hidden border border-[#A1A1AA]/15 relative">
            <TacticalMapSvg />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#A69B88]">
            <span>SECTOR: MIDDLE GANGA REACH</span>
            <Link href="/study-area" className="text-[#FFFFFF] hover:underline">
              Full Study Area →
            </Link>
          </div>
        </div>

        {/* C. Flood Forecasting Hydrograph */}
        <div className="xl:col-span-7">
          <HydrologicalChart isSurge={surgePreview} />
        </div>
      </div>

      {/* D. Station Monitoring Table */}
      <div className="rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#A1A1AA]/12">
          <div>
            <h2 className="text-base font-bold text-[#A1A1AA]">
              Station Monitoring & Telemetry Sources
            </h2>
            <p className="text-xs text-[#A69B88]">
              Monitored gauge stations across the Ganga, Gandak, Son, and Punpun reaches (Sample & Synthetic data)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#7D7465] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={stationSearch}
                onChange={(e) => setStationSearch(e.target.value)}
                placeholder="Filter station or river..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#A1A1AA]/16 bg-[#000000] text-xs text-[#A1A1AA] placeholder:text-[#7D7465] focus:outline-none focus:border-[#FFFFFF]"
              />
            </div>

            <div className="inline-flex rounded-lg border border-[#A1A1AA]/16 bg-[#000000] p-0.5">
              {(["ALL", "NORMAL", "ADVISORY", "WARNING"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setRiskFilter(status)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold transition-colors ${
                    riskFilter === status
                      ? "bg-[#FFFFFF] text-white"
                      : "text-[#A69B88] hover:text-[#A1A1AA]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#A1A1AA]/14 text-[10px] font-mono uppercase text-[#A69B88]">
                <th className="py-3 px-3">Station ID</th>
                <th className="py-3 px-3">Station & River Name</th>
                <th className="py-3 px-3">Current Stage</th>
                <th className="py-3 px-3">Warning / Danger</th>
                <th className="py-3 px-3">6h Trend</th>
                <th className="py-3 px-3">Last Obs</th>
                <th className="py-3 px-3">Data Source</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A1A1AA]/10">
              {filteredStations.map((st) => (
                <tr key={st.id} className="hover:bg-[#141414]/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-[#FFFFFF]">{st.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#A1A1AA]">{st.name}</div>
                    <div className="text-[11px] text-[#A69B88]">{st.river}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#A1A1AA]">
                    {st.stage.toFixed(2)} m
                  </td>
                  <td className="py-3 px-3 font-mono text-[#A69B88]">
                    {st.warning.toFixed(1)}m / {st.danger.toFixed(1)}m
                  </td>
                  <td className="py-3 px-3 font-mono text-[#A1A1AA]">{st.trend}</td>
                  <td className="py-3 px-3 font-mono text-[#A69B88]">{st.lastObs}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        st.dataState === "STALE"
                          ? "bg-[#141414] text-[#A69B88] border-[#A1A1AA]/20"
                          : "bg-[#000000] text-[#A1A1AA] border-[#A1A1AA]/16"
                      }`}
                    >
                      {st.dataState}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        st.risk === "WARNING"
                          ? "bg-[#F59E0B]/18 text-[#FBBF24] border-[#F59E0B]/40"
                          : st.risk === "ADVISORY"
                          ? "bg-[#FFFFFF]/18 text-[#FFFFFF] border-[#FFFFFF]/40"
                          : "bg-[#141414] text-[#A1A1AA] border-[#A1A1AA]/18"
                      }`}
                    >
                      {st.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* E. Incident Timeline & F. Analytical Gates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* E. Incident Lifecycle Timeline */}
        <div className="lg:col-span-5 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
            <div>
              <h2 className="text-sm font-bold text-[#A1A1AA]">Incident Lifecycle Timeline</h2>
              <p className="text-[11px] text-[#A69B88]">
                INC-2026-04 · Middle Ganga & Gandak Sector
              </p>
            </div>
            <Link href="/admin/incidents" className="text-xs text-[#FFFFFF] hover:underline">
              All incidents →
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg border border-[#A1A1AA]/14 bg-[#000000] flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-[#A69B88]">
                  PHASE 01 · PREPAREDNESS
                </div>
                <div className="text-xs font-semibold text-[#A1A1AA]">
                  Catchment Watch & Threshold Calibration
                </div>
                <p className="text-[11px] text-[#A69B88]">
                  Baseline gauge polling at 15m intervals; ensemble scenarios initialized.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#141414] text-[#A1A1AA] border border-[#A1A1AA]/16">
                COMPLETE
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-[#FFFFFF]/45 bg-[#FFFFFF]/10 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-[#FFFFFF]">
                  PHASE 02 · ACTIVE RESPONSE
                </div>
                <div className="text-xs font-semibold text-[#FFFFFF]">
                  Supervisory Gate Review & Advisory Drafting
                </div>
                <p className="text-[11px] text-[#A1A1AA]">
                  Lalganj tributary surge flagged; CAP v1.2 advisory queued for duty commander.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFFFFF] text-white">
                ACTIVE
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-[#A1A1AA]/14 bg-[#000000] flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-[#7D7465]">
                  PHASE 03 · RECOVERY & POST-EVENT
                </div>
                <div className="text-xs font-semibold text-[#A1A1AA]">
                  High-Water Mark Audit & SITREP Archival
                </div>
                <p className="text-[11px] text-[#A69B88]">
                  Compares observed crest levels against forecast ensemble bounds.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0A0A0A] text-[#A69B88] border border-[#A1A1AA]/14">
                STANDBY
              </span>
            </div>
          </div>
        </div>

        {/* F. Analytical Verification Gates */}
        <div className="lg:col-span-7 rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#A1A1AA]/12">
            <div>
              <h2 className="text-sm font-bold text-[#A1A1AA]">
                Scientific Verification Gates (Three-Stage Oversight)
              </h2>
              <p className="text-[11px] text-[#A69B88]">
                Automated quality, physics, and plausibility checks prior to human sign-off
              </p>
            </div>
            <Link href="/admin/gates" className="text-xs text-[#FFFFFF] hover:underline">
              Gate console →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/gates/pre-run"
              className="p-4 rounded-xl border border-[#A1A1AA]/16 bg-[#000000] hover:border-[#FFFFFF]/50 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#A69B88]">
                    GATE 01
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#FFFFFF]/18 text-[#FFFFFF] border border-[#FFFFFF]/35">
                    PASSED
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#A1A1AA]">Pre-Run Ingestion</h3>
                <p className="text-xs text-[#A69B88] leading-relaxed">
                  Sensor completeness, spike rejection, and boundary continuity verified across 8 gauges.
                </p>
              </div>
              <div className="pt-2 border-t border-[#A1A1AA]/10 text-[11px] font-mono text-[#FFFFFF] flex items-center justify-between">
                <span>Latency: 38s</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/admin/gates/mid-run"
              className="p-4 rounded-xl border border-[#F59E0B]/35 bg-[#000000] hover:border-[#F59E0B]/60 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#A69B88]">
                    GATE 02
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F59E0B]/18 text-[#FBBF24] border border-[#F59E0B]/40">
                    REVIEW
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#A1A1AA]">Mid-Run Physics</h3>
                <p className="text-xs text-[#A69B88] leading-relaxed">
                  Mass conservation holds (C=0.82); ensemble spread in Gandak sector flagged for review.
                </p>
              </div>
              <div className="pt-2 border-t border-[#A1A1AA]/10 text-[11px] font-mono text-[#FBBF24] flex items-center justify-between">
                <span>Spread: ±0.42m</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/admin/gates/post-run"
              className="p-4 rounded-xl border border-[#A1A1AA]/16 bg-[#000000] hover:border-[#FFFFFF]/50 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#A69B88]">
                    GATE 03
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#FFFFFF]/18 text-[#FFFFFF] border border-[#FFFFFF]/35">
                    VERIFIED
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#A1A1AA]">Post-Run Evidence</h3>
                <p className="text-xs text-[#A69B88] leading-relaxed">
                  Inundation claims cross-checked against DEM terrain constraints and SAR backscatter.
                </p>
              </div>
              <div className="pt-2 border-t border-[#A1A1AA]/10 text-[11px] font-mono text-[#FFFFFF] flex items-center justify-between">
                <span>NSE Score: 0.89</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* G. Alerts and Approvals Workflow */}
      <div className="rounded-xl border border-[#A1A1AA]/15 bg-[#0A0A0A] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#A1A1AA]/12">
          <div>
            <h2 className="text-base font-bold text-[#A1A1AA]">
              Alerts & Supervisory Approvals (CAP v1.2 Workflow)
            </h2>
            <p className="text-xs text-[#A69B88]">
              Emergency advisories require explicit human authorization before dispatch.
            </p>
          </div>
          <Link href="/admin/approvals" className="text-xs text-[#FFFFFF] hover:underline">
            Open full approval console →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-[#A1A1AA]/14 bg-[#000000] flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-[#A69B88]">
                    {item.id} · {item.timestamp}
                  </span>
                  <h3 className="text-sm font-bold text-[#A1A1AA] mt-0.5">{item.title}</h3>
                  <p className="text-xs text-[#A69B88] mt-0.5">{item.sector}</p>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border shrink-0 ${
                    item.state === "PENDING_REVIEW"
                      ? "bg-[#F59E0B]/18 text-[#FBBF24] border-[#F59E0B]/40"
                      : item.state === "APPROVED"
                      ? "bg-[#FFFFFF]/18 text-[#FFFFFF] border-[#FFFFFF]/40"
                      : item.state === "DISPATCHED"
                      ? "bg-[#10B981]/18 text-[#34D399] border-[#10B981]/40"
                      : "bg-[#141414] text-[#A69B88] border-[#A1A1AA]/20"
                  }`}
                >
                  {item.state.replace("_", " ")}
                </span>
              </div>

              <div className="pt-2 border-t border-[#A1A1AA]/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#7D7465]">
                  ILLUSTRATIVE WORKFLOW RECORD
                </span>
                {item.state !== "DISPATCHED" ? (
                  <button
                    type="button"
                    onClick={() => handleAdvanceAlert(item.id)}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-[#FFFFFF] text-white hover:bg-[#E4E4E7] transition-colors"
                  >
                    {item.state === "DRAFT"
                      ? "Submit for Review"
                      : item.state === "PENDING_REVIEW"
                      ? "Approve Advisory"
                      : "Dispatch Bulletin"}
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-[#34D399] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Published (Sample)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
