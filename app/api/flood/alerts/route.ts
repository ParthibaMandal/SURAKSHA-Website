import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// CAP recommendation generation exists in the engine, but it is not a saved
// alert feed and there is no verified public/draft list API yet.
export async function GET() {
  return NextResponse.json(
    { detail: "An alert feed is not connected. No verified public or draft alert-list endpoint is available." },
    { status: 501, headers: { "Cache-Control": "no-store" } },
  );
}
