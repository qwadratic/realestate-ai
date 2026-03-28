import { NextRequest, NextResponse } from "next/server";
import clients from "../../../../../fixtures/clients.json";

// ElevenLabs server tool: look up client by name or phone
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = body.name || body.caller_name || "";

  if (!name) {
    return NextResponse.json({
      is_client: false,
      message: "No name provided. Ask the caller for their name.",
    });
  }

  const client = clients.find(
    (c) =>
      c.name.toLowerCase().includes(name.toLowerCase()) ||
      c.id.toLowerCase().includes(name.toLowerCase())
  );

  if (!client) {
    return NextResponse.json({
      is_client: false,
      name,
      message: `No client found matching "${name}". This is a new lead — proceed with qualification.`,
    });
  }

  return NextResponse.json({
    is_client: true,
    id: client.id,
    name: client.name,
    status: client.statusLabel,
    summary: client.summary,
    last_activity: client.lastActivity,
    profile: client.profile
      ? {
          budget: `€${(client.profile.budget_min / 1000).toFixed(0)}k–€${(client.profile.budget_max / 1000).toFixed(0)}k`,
          rooms: `${client.profile.rooms_min}+ Zimmer`,
          districts: client.profile.districts.join(", "),
          family: client.profile.family,
          priorities: client.profile.priorities,
        }
      : null,
    search_criteria: client.searchCriteria || null,
  });
}
