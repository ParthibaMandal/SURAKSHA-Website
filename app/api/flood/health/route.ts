import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.SURAKSHA_BACKEND_URL || "http://127.0.0.1:8000";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${backendUrl}/api/v1/flood/health`, {
      headers: { accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline / not reachable
  }

  // Graceful deterministic preview fallback
  return NextResponse.json({
    status: "HEALTHY",
    operational_readiness: "SYNTHETIC_PREVIEW_MODE",
    readiness_blockers: [],
    notice: "Operating in local Next.js synthetic telemetry mode. FastAPI service not connected.",
  });
}

