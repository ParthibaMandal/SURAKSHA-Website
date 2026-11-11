import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.SURAKSHA_BACKEND_URL || "http://127.0.0.1:8000";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${backendUrl}/api/v1/gates`, {
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
    // Backend offline fallback
  }

  return NextResponse.json([
    {
      id: "GATE-VAL-01",
      station_id: "STN-VAL-01",
      name: "Valmikinagar Bay 01 (Left Sluice)",
      current_opening_pct: 45,
      recommended_opening_pct: 50,
      discharge_rate_cusecs: 14200.00,
      mode: "SUPERVISED",
      last_actuated_at: new Date().toISOString(),
    },
    {
      id: "GATE-VAL-02",
      station_id: "STN-VAL-01",
      name: "Valmikinagar Bay 02 (Central Crest)",
      current_opening_pct: 60,
      recommended_opening_pct: 60,
      discharge_rate_cusecs: 18900.00,
      mode: "AUTOMATED",
      last_actuated_at: new Date().toISOString(),
    },
    {
      id: "GATE-KOS-01",
      station_id: "STN-KOS-01",
      name: "Birpur Bay 08 (Radial Gate)",
      current_opening_pct: 75,
      recommended_opening_pct: 80,
      discharge_rate_cusecs: 24500.00,
      mode: "SUPERVISED",
      last_actuated_at: new Date().toISOString(),
    },
  ]);
}

