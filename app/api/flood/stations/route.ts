import { NextResponse } from "next/server";
import { STATIONS } from "@/lib/mock-data";

export async function GET() {
  const backendUrl = process.env.SURAKSHA_BACKEND_URL || "http://127.0.0.1:8000";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${backendUrl}/api/v1/flood/stations`, {
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

  // Graceful fallback to verified station array
  return NextResponse.json(STATIONS);
}

