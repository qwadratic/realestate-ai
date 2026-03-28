import { NextRequest, NextResponse } from "next/server";
import properties from "../../../../../fixtures/properties.json";

// ElevenLabs server tool: get single property details
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const id = body.property_id || body.id;
  const query = body.query || body.name || "";

  let property = null;

  if (id) {
    property = properties.find((p) => p.id === id);
  } else if (query) {
    property = properties.find(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (!property) {
    return NextResponse.json({
      error: "Property not found",
      available: properties.map((p) => ({ id: p.id, title: p.title })),
    });
  }

  return NextResponse.json({
    id: property.id,
    title: property.title,
    price: `€${property.price.toLocaleString("de-AT")}`,
    sqm: `${property.sqm} m²`,
    rooms: `${property.rooms} Zimmer`,
    address: property.address,
    district: property.district,
    description: property.description_raw.slice(0, 500),
    source: property.source,
    url: property.url,
  });
}
