import { NextRequest, NextResponse } from "next/server";
import properties from "../../../../../fixtures/properties.json";

// ElevenLabs server tool: list all properties
export async function GET() {
  const summary = properties.map((p) => ({
    id: p.id,
    title: p.title,
    price: `€${p.price.toLocaleString("de-AT")}`,
    sqm: `${p.sqm} m²`,
    rooms: `${p.rooms} Zimmer`,
    address: p.address,
    district: p.district,
  }));
  return NextResponse.json({ properties: summary, count: summary.length });
}

export async function POST(req: NextRequest) {
  // ElevenLabs sends POST with body params
  const body = await req.json().catch(() => ({}));
  const district = body.district || body.bezirk;
  const maxPrice = body.max_price || body.budget;

  let filtered = [...properties];
  if (district) {
    filtered = filtered.filter((p) =>
      p.district.toLowerCase().includes(district.toLowerCase())
    );
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  const summary = filtered.map((p) => ({
    id: p.id,
    title: p.title,
    price: `€${p.price.toLocaleString("de-AT")}`,
    sqm: `${p.sqm} m²`,
    rooms: `${p.rooms} Zimmer`,
    address: p.address,
    district: p.district,
  }));

  return NextResponse.json({ properties: summary, count: summary.length });
}
