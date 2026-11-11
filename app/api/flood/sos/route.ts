import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const backendUrl = process.env.SURAKSHA_BACKEND_URL || "http://127.0.0.1:8000";
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const query = statusFilter ? `?status=${statusFilter}` : "";
    const res = await fetch(`${backendUrl}/api/v1/sos/queue${query}`, {
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

  // Fallback demo queue records
  return NextResponse.json([
    {
      id: "SOS-1001",
      citizen_name: "Ramesh Kumar Patel",
      phone_number: "+91-9876543210",
      emergency_type: "TRAPPED_WATER",
      severity: "CRITICAL",
      people_count: 4,
      latitude: 25.6310,
      longitude: 85.1120,
      landmark_address: "Rooftop near community water tank, Ward 04, Kurji",
      status: "DISPATCHED",
      assigned_team: "NDRF Rescue Boat 02",
      notes: "Water level at 1.8m on ground floor.",
      created_at: new Date().toISOString(),
    },
    {
      id: "SOS-1002",
      citizen_name: "Priya Sahani",
      phone_number: "+91-9876500112",
      emergency_type: "MEDICAL",
      severity: "CRITICAL",
      people_count: 2,
      latitude: 25.6450,
      longitude: 85.0920,
      landmark_address: "Green building adjacent to primary school, Digha Ghat",
      status: "PENDING",
      assigned_team: null,
      notes: "Requires urgent medical relocation.",
      created_at: new Date().toISOString(),
    },
  ]);
}

export async function POST(request: Request) {
  const backendUrl = process.env.SURAKSHA_BACKEND_URL || "http://127.0.0.1:8000";
  const body = await request.json();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${backendUrl}/api/v1/sos/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 201 });
    }
  } catch {
    // Backend offline fallback
  }

  // Fallback mock response with auto-generated ID
  return NextResponse.json(
    {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      citizen_name: body.citizen_name || "Citizen Requester",
      phone_number: body.phone_number || "+91-9876543210",
      emergency_type: body.emergency_type || "TRAPPED_WATER",
      severity: body.severity || "CRITICAL",
      people_count: body.people_count || 1,
      latitude: body.latitude || 25.6214,
      longitude: body.longitude || 85.1432,
      landmark_address: body.landmark_address || "Patna Urban",
      status: "PENDING",
      created_at: new Date().toISOString(),
      message: "Rescue intake logged into queue (Simulation Fallback Mode).",
    },
    { status: 201 }
  );
}

