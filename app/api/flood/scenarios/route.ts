import { NextResponse } from "next/server";

const timeoutMs = 15_000;

function backendUrl() {
  return (process.env.SURAKSHA_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
}

function backendHeaders() {
  const headers: Record<string, string> = { accept: "application/json" };
  const operatorKey = process.env.SURAKSHA_OPERATOR_API_KEY?.trim();
  if (operatorKey) headers.authorization = `Bearer ${operatorKey}`;
  return headers;
}

async function proxy(path: string, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${backendUrl()}${path}`, {
      ...init,
      headers: { ...backendHeaders(), ...(init?.headers as Record<string, string> | undefined) },
      signal: controller.signal,
      cache: "no-store",
      redirect: "error",
    });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ detail: "The SURAKSHA service returned an unexpected response." }, { status: 502 });
    }
    const body = await response.json();
    return NextResponse.json(body, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const timeout = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      { detail: timeout ? "The SURAKSHA service did not respond in time." : "The SURAKSHA service could not be reached." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  return proxy("/api/v1/scenarios");
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ detail: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ detail: "Request body must be a scenario object." }, { status: 400 });
  }

  const data = payload as Record<string, unknown>;
  if (typeof data.scenario_id !== "string" || !/^SCEN-[A-Z0-9-]{1,80}$/.test(data.scenario_id)) {
    return NextResponse.json({ detail: "Choose a valid scenario." }, { status: 400 });
  }
  if (typeof data.upstream_inflow_multiplier !== "number" || data.upstream_inflow_multiplier < 0.5 || data.upstream_inflow_multiplier > 3) {
    return NextResponse.json({ detail: "Upstream flow must be between 0.5× and 3.0×." }, { status: 400 });
  }
  if (typeof data.precipitation_anomaly_mm !== "number" || data.precipitation_anomaly_mm < 0 || data.precipitation_anomaly_mm > 500) {
    return NextResponse.json({ detail: "Added rainfall must be between 0 and 500 mm." }, { status: 400 });
  }

  return proxy("/api/v1/scenarios/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenario_id: data.scenario_id,
      upstream_inflow_multiplier: data.upstream_inflow_multiplier,
      precipitation_anomaly_mm: data.precipitation_anomaly_mm,
      enable_jev_supervision: false,
    }),
  });
}
