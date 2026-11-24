import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const backendUrl = process.env.SURAKSHA_BACKEND_URL;
  if (!backendUrl) return NextResponse.json({ detail: "The SURAKSHA service URL is not configured." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/v1/flood/stations`, {
      headers: { accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
      redirect: "error",
    });
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ detail: "The SURAKSHA service returned an unexpected response." }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return NextResponse.json({ detail: timedOut ? "The station service did not respond in time." : "The station service could not be reached." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  } finally {
    clearTimeout(timeoutId);
  }
}

