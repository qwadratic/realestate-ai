import { NextRequest } from "next/server";
import type { PropertyValidated, ClientProfile } from "@/types";

export const maxDuration = 60;

// Mock responses keyed by question patterns
function generateMockResponse(
  question: string,
  properties: PropertyValidated[],
  clientProfile?: ClientProfile
): { text: string; toolCalls?: { name: string; input: Record<string, string> }[] } {
  const q = question.toLowerCase();

  if (q.includes("commute") || q.includes("stephansplatz") || q.includes("pendel")) {
    const prop1 = properties[0];
    const prop2 = properties[1];
    const prop3 = properties[2];
    return {
      toolCalls: [
        { name: "compute_commute", input: { from_address: prop1?.address || "", to_address: "Stephansplatz" } },
      ],
      text: `**Pendelvergleich zum Stephansplatz:**

1. **${prop1?.title || "Property 1"}** (${prop1?.address || ""})
   → ~${prop1?.nearby?.commute_center_min || 12} Min. mit U-Bahn (${prop1?.nearby?.transit?.[0]?.name || "U3"}, ${prop1?.nearby?.transit?.[0]?.distance_m || 200}m entfernt)

2. **${prop2?.title || "Property 2"}** (${prop2?.address || ""})
   → ~${prop2?.nearby?.commute_center_min || 8} Min. mit U-Bahn (${prop2?.nearby?.transit?.[0]?.name || "U2"}, ${prop2?.nearby?.transit?.[0]?.distance_m || 150}m entfernt)

3. **${prop3?.title || "Property 3"}** (${prop3?.address || ""})
   → ~${prop3?.nearby?.commute_center_min || 15} Min. mit U-Bahn (${prop3?.nearby?.transit?.[0]?.name || "U2"}, ${prop3?.nearby?.transit?.[0]?.distance_m || 400}m entfernt)

${clientProfile?.priorities?.includes("U-Bahn < 15 Min zum Stephansplatz") ? "**Alle drei Objekte erfüllen das Kriterium < 15 Min zum Stephansplatz.**" : ""}

Empfehlung: **${prop2?.title || "Penthouse am Praterstern"}** hat die kürzeste Pendelzeit, aber **${prop1?.title || "Altbau-Charme"}** bietet das beste Verhältnis aus Pendelzeit und Preis.`,
    };
  }

  if (q.includes("school") || q.includes("schule") || q.includes("volksschule")) {
    const withSchools = properties.filter(p => p.nearby?.schools && p.nearby.schools.length > 0);
    const best = withSchools[0];
    return {
      toolCalls: [
        { name: "search_nearby_places", input: { address: best?.address || properties[0]?.address || "", place_type: "school" } },
      ],
      text: `**Schulen in der Nähe:**

${properties.map((p, i) => {
  const schools = p.nearby?.schools || [];
  if (schools.length > 0) {
    return `${i + 1}. **${p.title}** — ${schools[0].name} (${schools[0].distance_m}m) ✅`;
  }
  return `${i + 1}. **${p.title}** — Keine Volksschule in den Daten, Recherche empfohlen ⚠️`;
}).join("\n")}

${clientProfile?.priorities?.includes("Volksschule in der Nähe") ? "\n**Volksschule in der Naehe ist fuer Familie Mueller extrem wichtig** (die Grosse kommt naechstes Jahr in die Schule)." : ""}

Empfehlung: **${best?.title || properties[0]?.title}** ist die klare Wahl für Familien mit schulpflichtigen Kindern.`,
    };
  }

  if (q.includes("recommended") || q.includes("empfohlen") || q.includes("#2") || q.includes("warum")) {
    const p2 = properties[1];
    return {
      text: `**Warum ${p2?.title || "Penthouse am Praterstern"} als KI-Empfehlung markiert ist:**

1. **Kürzeste Pendelzeit** — ${p2?.nearby?.commute_center_min || 8} Min. zum Stephansplatz
2. **Modernster Bau** — Neubau ${p2?.features?.year_built || 2021}, Dachterrasse, Aufzug, Garage
3. **Verhandlungsspielraum** — ${p2?.intel?.insolvency_status === "proceedings" ? "⚠️ Eigentümer-Insolvenz: Signalscore " + p2.intel.signal_score + "/5. Dies eröffnet erheblichen Verhandlungsspielraum beim Preis." : "Gute Verhandlungsposition."}

${p2?.intel?.signals?.filter(s => !s.toLowerCase().includes("insolvency")).map(s => `- Signal: ${s}`).join("\n") || ""}

**Aber Achtung:** Mit €${((p2?.price || 789000) / 1000).toFixed(0)}k liegt dieses Objekt **über dem Budget** von €${clientProfile?.budget_max ? (clientProfile.budget_max / 1000).toFixed(0) + "k" : "450k"}. Die Insolvenz-Situation könnte den Preis aber deutlich drücken.`,
    };
  }

  if (q.includes("price") || q.includes("preis") || q.includes("m²") || q.includes("quadratmeter")) {
    return {
      text: `**Preis pro m² Vergleich:**

${properties.map((p, i) => {
  const pricePerSqm = p.sqm ? Math.round(p.price / p.sqm) : 0;
  const sqmNote = p.validation?.sqm_mismatch
    ? ` ⚠️ Achtung: gelistet ${p.validation.sqm_mismatch.listed || p.sqm}m², aber ${p.validation.sqm_mismatch.detected}m² in Beschreibung erkannt (§ 1299 ABGB)`
    : "";
  return `${i + 1}. **${p.title}** — €${pricePerSqm.toLocaleString()}/m² (€${p.price.toLocaleString()} / ${p.sqm}m²)${sqmNote}`;
}).join("\n")}

${(() => {
  const sorted = [...properties].sort((a, b) => (a.price / (a.sqm || 1)) - (b.price / (b.sqm || 1)));
  return `\n**Bestes Preis-Leistungs-Verhältnis:** ${sorted[0]?.title} mit €${Math.round(sorted[0]?.price / (sorted[0]?.sqm || 1)).toLocaleString()}/m²`;
})()}

${clientProfile ? `\nBudget Familie Müller: €${(clientProfile.budget_min / 1000).toFixed(0)}k–€${(clientProfile.budget_max / 1000).toFixed(0)}k` : ""}`,
    };
  }

  if (q.includes("best") || q.includes("beste") || q.includes("famil")) {
    return {
      text: `**Bewertung für Familie Müller:**

Basierend auf den Prioritäten (Volksschule, U-Bahn < 15 Min, Lift, Balkon):

1. **${properties[0]?.title}** ⭐ Beste Gesamtbewertung
   - ✅ Volksschule 400m
   - ✅ U-Bahn 200m (12 Min. zum Stephansplatz)
   - ✅ Aufzug vorhanden
   - ✅ Balkon
   - ✅ Im Budget (€${(properties[0]?.price || 0).toLocaleString()})
   - Altbau-Charme — passt zum Stilwunsch

2. **${properties[2]?.title}** — Gute Alternative
   - ⚠️ Keine Volksschule in der Nähe gefunden
   - ✅ U-Bahn 400m
   - ✅ Generalsaniert
   - ✅ Im Budget (€${(properties[2]?.price || 0).toLocaleString()})
   - ⚠️ m²-Diskrepanz beachten (§ 1299 ABGB)

3. **${properties[1]?.title}** — Premium, aber über Budget
   - ⚠️ Keine Volksschule in der Nähe
   - ✅ U-Bahn 150m (8 Min.)
   - ✅ Aufzug + Dachterrasse + Garage
   - ❌ €${((properties[1]?.price || 0) / 1000).toFixed(0)}k — über Budget
   - 🔴 Eigentümer-Insolvenz — Verhandlungspotential

**Empfehlung: ${properties[0]?.title} ist der klare Favorit für die Familie.**`,
    };
  }

  // Default response
  return {
    text: `Basierend auf den ${properties.length} Objekten in der Vergleichsgalerie:

${properties.map((p, i) => `${i + 1}. **${p.title}** — €${p.price.toLocaleString()}, ${p.sqm}m², ${p.rooms} Zi., ${p.address}`).join("\n")}

Wie kann ich Ihnen bei der Bewertung helfen? Sie können nach Pendeldaten, Schulen, Preisvergleich oder einer Gesamtbewertung für Ihre Klienten fragen.`,
  };
}

export async function POST(req: NextRequest) {
  const { messages, properties, clientProfile } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    properties: PropertyValidated[];
    clientProfile?: ClientProfile;
  };

  const lastUserMessage = messages.findLast(m => m.role === "user")?.content || "";
  const mockResponse = generateMockResponse(lastUserMessage, properties || [], clientProfile);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Simulate tool calls if any
      if (mockResponse.toolCalls) {
        for (const tc of mockResponse.toolCalls) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "tool_call", name: tc.name, input: tc.input })}\n\n`)
          );
          // Brief delay for realism
          await new Promise(r => setTimeout(r, 400));
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "tool_result", name: tc.name, result: "OK" })}\n\n`)
          );
        }
        await new Promise(r => setTimeout(r, 300));
      }

      // Send text response
      await new Promise(r => setTimeout(r, 500));
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "text", content: mockResponse.text })}\n\n`)
      );

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
