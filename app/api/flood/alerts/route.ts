import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const backendUrl = process.env.SURAKSHA_BACKEND_URL || "http://127.0.0.1:8000";
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'drafts' or 'public'

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const path = type === "drafts" ? "/api/v1/alerts/drafts" : "/api/v1/alerts/public";
    const res = await fetch(`${backendUrl}${path}`, {
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

  if (type === "drafts") {
    return NextResponse.json([
      {
        id: "DFT-2026-001",
        run_id: "RUN-94821",
        headline: "Flood Advisory: Rapid Stage Rise Expected in Patna Lowlands",
        description: "Hydrological physical models indicate Ganga water stage at Digha Ghat will approach the danger threshold within 18 hours due to upstream discharge from the Gandak river basin.",
        severity: "WARNING",
        urgency: "EXPECTED",
        certainty: "LIKELY",
        area_desc: "Patna Urban, Danapur Diara, and Kurji riparian zones",
        recommended_actions: "Move livestock and essential equipment to designated elevated platforms. Monitor community sirens.",
        status: "PENDING_REVIEW",
        created_at: new Date().toISOString(),
      },
    ]);
  }

  return NextResponse.json([
    {
      id: "ALT-2026-001",
      draft_id: "DFT-2026-001",
      cap_identifier: "CAP-IN-BR-2026-0891",
      headline: "Official Flood Warning: Middle Ganga Basin Rising",
      description: "State Disaster Management Authority has issued a stage warning for riparian lowlands along the Ganga river.",
      severity: "WARNING",
      urgency: "IMMEDIATE",
      area_desc: "Middle Ganga Lowlands · Patna to Mokama Reach",
      approved_by: "Chief Officer Vikram Rathore",
      approved_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      status: "ACTIVE",
    },
  ]);
}

