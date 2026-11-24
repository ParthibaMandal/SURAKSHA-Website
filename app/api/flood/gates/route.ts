import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// The verified FastAPI contract does not expose barrage telemetry or control.
// Returning fabricated actuator data here could be mistaken for a real device.
export async function GET() {
  return NextResponse.json(
    { detail: "Barrage telemetry is not connected. The SURAKSHA engine does not currently expose a gate telemetry endpoint." },
    { status: 501, headers: { "Cache-Control": "no-store" } },
  );
}
