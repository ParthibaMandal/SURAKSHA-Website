"use client";

import { useState } from "react";
import { Activity, CheckCircle2, CircleAlert, Droplets, LoaderCircle, Play, ShieldCheck, Users, Waves } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";

type ScenarioResult = {
  suite_id: string;
  scenario_id: string;
  scenario_name: string;
  mode: string;
  synthetic_data_only: boolean;
  result: {
    event_id: string;
    timestamp: string;
    severity: string;
    risk_score: number;
    current_condition?: { water_level_m?: number };
    forecast?: { t_plus_6?: number; t_plus_12?: number; t_plus_24?: number; confidence_interval?: number[] };
    impact_assessment?: { affected_population?: number };
    pre_event_assessment?: { exposed_population?: number };
    active_event_assessment?: { affected_population?: number };
    post_event_assessment?: { affected_population?: number };
    grounding_verification?: { corroboration_confirmed?: boolean; is_live_api?: boolean };
    requires_human_review?: boolean;
    supervisor?: { requires_human_review?: boolean };
  };
};

type DemoPreset = "steady" | "rain" | "surge";

const PRESETS: Record<DemoPreset, { label: string; description: string; basin: string; scenarioId: string; inflow: number; rainfall: number }> = {
  steady: {
    label: "Steady conditions",
    description: "A baseline run with no added upstream pressure.",
    basin: "Middle Ganga",
    scenarioId: "BEST_01_CALM_BASELINE",
    inflow: 1,
    rainfall: 0,
  },
  rain: {
    label: "Heavy rainfall",
    description: "Add rainfall and a modest upstream flow increase.",
    basin: "Middle Ganga",
    scenarioId: "STRESS_01_HEAVY_RAINFALL",
    inflow: 1.25,
    rainfall: 80,
  },
  surge: {
    label: "Rapid upstream rise",
    description: "Explore a high inflow and rainfall scenario in the Gandak basin.",
    basin: "Gandak Basin",
    scenarioId: "WORST_01_RAPID_RIVER_SURGE",
    inflow: 1.6,
    rainfall: 160,
  },
};

function isScenarioResult(value: unknown): value is ScenarioResult {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<ScenarioResult>;
  return typeof data.scenario_name === "string"
    && typeof data.result?.event_id === "string"
    && typeof data.result.timestamp === "string"
    && typeof data.result.risk_score === "number"
    && [data.result.forecast?.t_plus_6, data.result.forecast?.t_plus_12, data.result.forecast?.t_plus_24].some((value) => typeof value === "number" && Number.isFinite(value));
}

const formatTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Time unavailable" : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

function ReviewCheck({ title, passed, detail }: { title: string; passed: boolean; detail: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
      {passed ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-400">{detail}</p>
        <span className={`mt-2 inline-flex text-[10px] font-semibold uppercase tracking-[0.16em] ${passed ? "text-emerald-300" : "text-amber-200"}`}>
          {passed ? "Passed" : "Needs review"}
        </span>
      </div>
    </motion.div>
  );
}

export default function DemoLabPage() {
  const [preset, setPreset] = useState<DemoPreset>("steady");
  const [inflow, setInflow] = useState(PRESETS.steady.inflow);
  const [rainfall, setRainfall] = useState(PRESETS.steady.rainfall);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const selectedPreset = PRESETS[preset];
  const forecastValues = result ? [result.result.forecast?.t_plus_6, result.result.forecast?.t_plus_12, result.result.forecast?.t_plus_24].filter((value): value is number => typeof value === "number" && Number.isFinite(value)) : [];
  const forecastPeak = forecastValues.length ? Math.max(...forecastValues) : null;
  const exposedPopulation = result?.result.pre_event_assessment?.exposed_population
    ?? result?.result.active_event_assessment?.affected_population
    ?? result?.result.post_event_assessment?.affected_population
    ?? result?.result.impact_assessment?.affected_population
    ?? null;
  const needsHumanReview = Boolean(result?.result.requires_human_review ?? result?.result.supervisor?.requires_human_review);
  const externalCheckPassed = Boolean(result?.result.grounding_verification?.corroboration_confirmed);

  function choosePreset(value: DemoPreset) {
    setPreset(value);
    setInflow(PRESETS[value].inflow);
    setRainfall(PRESETS[value].rainfall);
    setError(null);
  }

  async function runScenario() {
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch("/api/flood/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          scenario_id: selectedPreset.scenarioId,
          upstream_inflow_multiplier: inflow,
          precipitation_anomaly_mm: rainfall,
          enable_jev_supervision: false,
        }),
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "The simulation service could not complete this run.");
      if (!isScenarioResult(data)) throw new Error("The simulation service returned an incomplete result.");
      setResult(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The simulation service could not be reached.");
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050708] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.11),transparent_58%)]" />
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <FadeIn>
          <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                <Activity className="h-3.5 w-3.5" /> SURAKSHA · Simulation Lab
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">See how conditions shape a flood response.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                Choose a scenario, adjust the conditions, and review the forecast and checks returned by SURAKSHA.
              </p>
            </div>
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              <div>
                <p className="text-xs font-semibold text-amber-100">Synthetic scenario</p>
                <p className="mt-0.5 text-[11px] text-zinc-400">For demonstration and review</p>
              </div>
            </div>
          </header>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <FadeIn delay={0.08}>
            <section className="h-full rounded-3xl border border-white/10 bg-[#0b1012] p-5 shadow-2xl sm:p-7" aria-labelledby="scenario-title">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">01 / Set conditions</p>
                  <h2 id="scenario-title" className="mt-2 text-xl font-semibold">Choose a scenario</h2>
                </div>
                <Waves className="h-5 w-5 text-emerald-300" />
              </div>

              <div className="space-y-2" role="group" aria-label="Scenario presets">
                {(Object.entries(PRESETS) as [DemoPreset, typeof PRESETS[DemoPreset]][]).map(([key, item]) => (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => choosePreset(key)}
                    aria-pressed={preset === key}
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30, duration: prefersReducedMotion ? 0 : undefined }}
                    className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-colors ${preset === key ? "border-emerald-300/35 bg-emerald-300/[0.04]" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}
                  >
                    {preset === key && <motion.span layoutId="selected-scenario" className="absolute inset-0 rounded-2xl bg-emerald-300/[0.045]" transition={{ type: "spring", stiffness: 340, damping: 30 }} />}
                    <span className="relative z-10 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                      <span className={`h-2 w-2 rounded-full ${preset === key ? "bg-emerald-300" : "bg-zinc-700"}`} />
                    </span>
                    <span className="relative z-10 mt-1.5 block text-xs leading-relaxed text-zinc-400">{item.description}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-7 space-y-6 border-t border-white/10 pt-6">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label htmlFor="inflow" className="text-xs font-medium text-zinc-300">Upstream flow multiplier</label>
                    <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 font-mono text-xs text-white">{inflow.toFixed(2)}×</span>
                  </div>
                  <input id="inflow" type="range" min="0.5" max="3" step="0.05" value={inflow} onChange={(event) => setInflow(Number(event.target.value))} className="w-full accent-emerald-300" />
                  <div className="mt-1 flex justify-between text-[10px] text-zinc-600"><span>0.5×</span><span>3.0×</span></div>
                </div>
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label htmlFor="rainfall" className="text-xs font-medium text-zinc-300">Added rainfall</label>
                    <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 font-mono text-xs text-white">{rainfall} mm</span>
                  </div>
                  <input id="rainfall" type="range" min="0" max="500" step="5" value={rainfall} onChange={(event) => setRainfall(Number(event.target.value))} className="w-full accent-emerald-300" />
                  <div className="mt-1 flex justify-between text-[10px] text-zinc-600"><span>0 mm</span><span>500 mm</span></div>
                </div>
              </div>

              <motion.button type="button" onClick={runScenario} disabled={isRunning} whileHover={prefersReducedMotion || isRunning ? undefined : { y: -1 }} whileTap={prefersReducedMotion || isRunning ? undefined : { scale: 0.99 }} className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-semibold text-[#061013] transition-colors hover:bg-emerald-200 disabled:cursor-wait disabled:opacity-70">
                {isRunning ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Running simulation…</> : <><Play className="h-4 w-4 fill-current" /> Run simulation</>}
              </motion.button>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-zinc-500">{selectedPreset.basin} · Synthetic inputs</p>
            </section>
          </FadeIn>

          <FadeIn delay={0.14}>
            <section className="min-h-[440px] rounded-3xl border border-white/10 bg-[#0b1012] p-5 shadow-2xl sm:p-7" aria-live="polite" aria-labelledby="result-title">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">02 / Review outcome</p>
                  <h2 id="result-title" className="mt-2 text-xl font-semibold">Simulation result</h2>
                </div>
                {result && <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200"><CheckCircle2 className="h-3.5 w-3.5" /> Run complete</span>}
              </div>

              <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={error ? "error" : result?.result.event_id || "empty-result"}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
              {error ? (
                <div className="mt-7 flex gap-3 rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-sm text-rose-100">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="font-semibold">Could not complete this run</p><p className="mt-1 text-xs leading-relaxed text-rose-100/70">{error}</p></div>
                </div>
              ) : result ? (
                <>
                  <motion.div initial={prefersReducedMotion ? false : "hidden"} animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }} className="mt-6 grid gap-3 sm:grid-cols-3">
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: prefersReducedMotion ? 0 : 0.3 }} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <div className="flex items-center gap-2 text-xs text-zinc-400"><Droplets className="h-4 w-4 text-emerald-300" /> 24-hour forecast peak</div>
                      <p className="mt-3 font-mono text-3xl font-semibold tracking-tight">{forecastPeak?.toFixed(2) ?? "—"}<span className="ml-1 text-sm text-zinc-400">m</span></p>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: prefersReducedMotion ? 0 : 0.3 }} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <div className="flex items-center gap-2 text-xs text-zinc-400"><Activity className="h-4 w-4 text-emerald-300" /> Flood risk</div>
                      <p className="mt-3 font-mono text-3xl font-semibold tracking-tight">{Math.round(result.result.risk_score * 100)}<span className="ml-1 text-sm text-zinc-400">/ 100</span></p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{result.result.severity.replaceAll("_", " ")}</p>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: prefersReducedMotion ? 0 : 0.3 }} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <div className="flex items-center gap-2 text-xs text-zinc-400"><Users className="h-4 w-4 text-emerald-300" /> Potentially exposed people</div>
                      <p className="mt-3 font-mono text-3xl font-semibold tracking-tight">{exposedPopulation === null ? "—" : exposedPopulation.toLocaleString()}</p>
                    </motion.div>
                  </motion.div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200/15 bg-emerald-200/[0.04] p-4">
                    <div><p className="text-sm font-semibold text-white">Review checks</p><p className="mt-1 text-xs text-zinc-400">A person reviews any advisory before action.</p></div>
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100">{needsHumanReview ? "Manual review advised" : "Review checks complete"}</span>
                  </div>

                  <motion.div initial={prefersReducedMotion ? false : "hidden"} animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }} className="mt-3 grid gap-3 sm:grid-cols-3">
                    <ReviewCheck title="Input checks" passed={Boolean(result.result.current_condition)} detail={result.result.current_condition?.water_level_m !== undefined ? `Starting water level: ${result.result.current_condition.water_level_m.toFixed(2)} m` : "Synthetic scenario inputs were accepted."} />
                    <ReviewCheck title="Forecast & risk" passed={forecastPeak !== null && typeof result.result.risk_score === "number"} detail="Forecast and risk estimates were returned for this scenario." />
                    <ReviewCheck title="Safety review" passed={!needsHumanReview} detail={needsHumanReview ? "Review the scenario findings before sharing or acting on them." : "No additional review was flagged for this scenario."} />
                  </motion.div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-[10px] text-zinc-500">
                    <span>{formatTime(result.result.timestamp)}</span>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono"><span>{result.result.event_id}</span><span>{result.mode} demonstration</span></span>
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-zinc-500">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <p>{externalCheckPassed ? "Independent corroboration is available for this run." : "Synthetic scenario only: no live authority bulletin or external source was checked."} This is decision support, not an operational warning.</p>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[330px] flex-col items-center justify-center px-5 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl border border-emerald-200/15 bg-emerald-200/[0.05]"><Waves className="h-6 w-6 text-emerald-100" /></div>
                  <p className="mt-5 text-base font-semibold text-white">Your results will appear here</p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">Run a scenario to see its forecast, risk level, potential exposure, and review checks.</p>
                </div>
              )}
              </motion.div>
              </AnimatePresence>
            </section>
          </FadeIn>
        </div>

        <p className="mx-auto max-w-3xl text-center text-[11px] leading-relaxed text-zinc-600">This lab uses synthetic scenario inputs for demonstration. Results are decision-support outputs and must not be treated as live flood warnings or used to operate infrastructure.</p>
      </div>
    </main>
  );
}
