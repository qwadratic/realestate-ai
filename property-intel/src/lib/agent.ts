import Anthropic from "@anthropic-ai/sdk";
import type { Tool, MessageParam, ContentBlock } from "@anthropic-ai/sdk/resources/messages";
import type { PropertyRaw, PropertyExtracted, PropertyEnriched, PropertyValidated } from "@/types";
import { enrichWithMaps, computeCommute } from "./maps";
import { lookupPropertyIntel } from "./exa";
import Exa from "exa-js";
import properties from "../../fixtures/properties.json";

// --- In-memory store (per-process, demo-scale) ---
const store: {
  raw: PropertyRaw[];
  analyzed: Map<string, PropertyValidated>;
} = {
  raw: properties as PropertyRaw[],
  analyzed: new Map(),
};

export function getStore() {
  return store;
}

// --- OpenRouter client ---
const client = new Anthropic({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
});

// --- Agent tools ---
export const agentTools: Tool[] = [
  {
    name: "list_properties",
    description: "List all available properties with basic info (id, title, price, address, district). Use this to see what properties are in the system.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_property",
    description: "Get full details of a specific property by ID. Returns all data including extracted features, nearby places, intel signals, and compliance validation if already analyzed.",
    input_schema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Property ID (e.g. 'wh-001')" } },
      required: ["id"],
    },
  },
  {
    name: "extract_features",
    description: "Use AI to extract structured features (orientation, balcony, floor, elevator, condition, etc.) from a property's German description. Call this before enrichment.",
    input_schema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Property ID to analyze" } },
      required: ["id"],
    },
  },
  {
    name: "lookup_intel",
    description: "Search for owner intelligence and insolvency signals for a property using Exa. Returns owner name, type, insolvency status, signal score 0-5, and signal descriptions.",
    input_schema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Property ID" } },
      required: ["id"],
    },
  },
  {
    name: "search_nearby",
    description: "Search Google Maps for places near a property. Types: school, subway_station, supermarket, restaurant, park, pharmacy, gym, kindergarten.",
    input_schema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Property ID" },
        place_type: { type: "string", description: "Type of place to search for" },
      },
      required: ["id", "place_type"],
    },
  },
  {
    name: "enrich_with_maps",
    description: "Full Google Maps enrichment for a property: schools, transit, supermarkets within 1km + commute time to Stephansplatz. Call this to get nearby amenities and commute data.",
    input_schema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Property ID" } },
      required: ["id"],
    },
  },
  {
    name: "compute_commute",
    description: "Calculate public transit commute time from a property to any destination in Vienna.",
    input_schema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Property ID (origin)" },
        destination: { type: "string", description: "Destination address. Defaults to Stephansplatz if omitted." },
      },
      required: ["id"],
    },
  },
  {
    name: "validate_compliance",
    description: "Check a property listing for compliance issues under Austrian law (§ 3 MaklerG, § 17 MaklerG, § 1299 ABGB). Detects sqm mismatches, unsubstantiated claims, legally relevant omissions.",
    input_schema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Property ID to validate" } },
      required: ["id"],
    },
  },
  {
    name: "analyze_property",
    description: "Full pipeline for a single property: extract features → enrich with maps → lookup intel → validate compliance. Use this for complete analysis.",
    input_schema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Property ID to fully analyze" } },
      required: ["id"],
    },
  },
  {
    name: "analyze_all",
    description: "Run the full analysis pipeline on ALL properties. Extract features, enrich, lookup intel, validate. Returns summary of results.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "web_search",
    description: "Search the web for information using Exa. Use for neighborhood info, market trends, regulations, or anything not in property data.",
    input_schema: {
      type: "object" as const,
      properties: { query: { type: "string", description: "Search query" } },
      required: ["query"],
    },
  },
];

// --- Tool execution ---
async function extractFeaturesForProperty(id: string): Promise<string> {
  const prop = store.raw.find((p) => p.id === id);
  if (!prop) return JSON.stringify({ error: `Property ${id} not found` });

  const response = await client.messages.create({
    model: "anthropic/claude-sonnet-4",
    max_tokens: 1024,
    system: `You are a real estate feature extraction system for the Austrian market. Extract structured features from German property descriptions. Return ONLY valid JSON.`,
    messages: [{
      role: "user",
      content: `Extract features from this listing.\n\nTitle: ${prop.title}\nDescription: ${prop.description_raw}\n\nReturn JSON: {"orientation":"south"|null,"balcony":true|null,"terrace":true|null,"building_style":"altbau"|"neubau"|null,"floor":number|null,"elevator":true|null,"noise_level":"low"|"medium"|"high"|null,"condition":"renovated"|"original"|"needs_work"|null,"parking":true|null,"garden":true|null,"year_built":number|null,"heating":string|null,"confidence":{"feature":0.0-1.0}}`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  let features;
  try {
    features = JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    features = match ? JSON.parse(match[1]) : { error: "parse_failed" };
  }

  // Store as extracted
  const extracted: PropertyExtracted = { ...prop, features };
  store.analyzed.set(id, extracted as unknown as PropertyValidated);
  return JSON.stringify({ id, features });
}

async function validateComplianceForProperty(id: string): Promise<string> {
  const prop = store.analyzed.get(id) || store.raw.find((p) => p.id === id);
  if (!prop) return JSON.stringify({ error: `Property ${id} not found` });

  const response = await client.messages.create({
    model: "anthropic/claude-sonnet-4",
    max_tokens: 1024,
    system: `You are an Austrian real estate compliance validator. Check for discrepancies. Return ONLY valid JSON.`,
    messages: [{
      role: "user",
      content: `Validate this listing.\n\nTitle: ${prop.title}\nListed sqm: ${prop.sqm}\nPrice: ${prop.price} EUR\nDescription: ${prop.description_raw}\nFeatures: ${JSON.stringify((prop as PropertyExtracted).features || {})}\n\nReturn JSON: {"sqm_mismatch":{"listed":number,"detected":number}|null,"price_anomaly":null,"flags":["issues"],"sources":["refs"],"compliance_notes":["law refs"]}`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  let validation;
  try {
    validation = JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    validation = match ? JSON.parse(match[1]) : { flags: [], sources: [], compliance_notes: [] };
  }

  // Update store
  const existing = store.analyzed.get(id);
  if (existing) {
    existing.validation = validation;
    store.analyzed.set(id, existing);
  }
  return JSON.stringify({ id, validation });
}

async function analyzeProperty(id: string): Promise<string> {
  const prop = store.raw.find((p) => p.id === id);
  if (!prop) return JSON.stringify({ error: `Property ${id} not found` });

  // Step 1: Extract features
  const featuresResult = await extractFeaturesForProperty(id);
  const features = JSON.parse(featuresResult).features || {};

  // Step 2: Enrich with maps + intel in parallel
  const [nearby, intel] = await Promise.all([
    enrichWithMaps(prop.address),
    lookupPropertyIntel(prop.address, prop.district),
  ]);

  // Step 3: Validate
  const extracted: PropertyExtracted = { ...prop, features };
  const enriched: PropertyEnriched = { ...extracted, nearby, intel };
  store.analyzed.set(id, enriched as unknown as PropertyValidated);

  const validationResult = await validateComplianceForProperty(id);
  const validation = JSON.parse(validationResult).validation || { flags: [], sources: [], compliance_notes: [] };

  const validated: PropertyValidated = { ...enriched, validation };
  store.analyzed.set(id, validated);

  return JSON.stringify({
    id,
    title: prop.title,
    features_extracted: Object.keys(features).length,
    nearby_schools: nearby.schools.length,
    nearby_transit: nearby.transit.length,
    commute_min: nearby.commute_center_min,
    signal_score: intel?.signal_score || 0,
    signals: intel?.signals || [],
    compliance_flags: validation.flags?.length || 0,
    sqm_mismatch: validation.sqm_mismatch || null,
  });
}

export async function executeTool(name: string, input: Record<string, string>): Promise<string> {
  switch (name) {
    case "list_properties": {
      const all = store.raw.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        sqm: p.sqm,
        rooms: p.rooms,
        address: p.address,
        district: p.district,
        analyzed: store.analyzed.has(p.id),
      }));
      return JSON.stringify(all);
    }

    case "get_property": {
      const analyzed = store.analyzed.get(input.id);
      if (analyzed) return JSON.stringify(analyzed);
      const raw = store.raw.find((p) => p.id === input.id);
      return raw ? JSON.stringify(raw) : JSON.stringify({ error: "not found" });
    }

    case "extract_features":
      return extractFeaturesForProperty(input.id);

    case "lookup_intel": {
      const prop = store.raw.find((p) => p.id === input.id);
      if (!prop) return JSON.stringify({ error: "not found" });
      const intel = await lookupPropertyIntel(prop.address, prop.district);
      const existing = store.analyzed.get(input.id);
      if (existing) {
        existing.intel = intel;
        store.analyzed.set(input.id, existing);
      }
      return JSON.stringify({ id: input.id, intel });
    }

    case "search_nearby": {
      const prop = store.raw.find((p) => p.id === input.id);
      if (!prop) return JSON.stringify({ error: "not found" });
      const maps = await enrichWithMaps(prop.address);
      const type = input.place_type?.toLowerCase() || "";
      if (type.includes("school")) return JSON.stringify(maps.schools);
      if (type.includes("transit") || type.includes("subway")) return JSON.stringify(maps.transit);
      if (type.includes("supermarket")) return JSON.stringify(maps.supermarkets);
      return JSON.stringify(maps);
    }

    case "enrich_with_maps": {
      const prop = store.raw.find((p) => p.id === input.id);
      if (!prop) return JSON.stringify({ error: "not found" });
      const nearby = await enrichWithMaps(prop.address);
      const existing = store.analyzed.get(input.id);
      if (existing) {
        existing.nearby = nearby;
        store.analyzed.set(input.id, existing);
      }
      return JSON.stringify({ id: input.id, nearby });
    }

    case "compute_commute": {
      const prop = store.raw.find((p) => p.id === input.id);
      if (!prop) return JSON.stringify({ error: "not found" });
      const geocodeRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(prop.address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      const geo = await geocodeRes.json();
      const loc = geo.results?.[0]?.geometry?.location;
      if (!loc) return JSON.stringify({ error: "geocode failed" });
      const mins = await computeCommute(loc, input.destination || "Stephansplatz 1, 1010 Wien");
      return JSON.stringify({ id: input.id, destination: input.destination || "Stephansplatz", minutes: mins });
    }

    case "validate_compliance":
      return validateComplianceForProperty(input.id);

    case "analyze_property":
      return analyzeProperty(input.id);

    case "analyze_all": {
      const results = await Promise.all(store.raw.map((p) => analyzeProperty(p.id)));
      return JSON.stringify({
        total: results.length,
        summary: results.map((r) => JSON.parse(r)),
      });
    }

    case "web_search": {
      try {
        const exa = new Exa(process.env.EXA_API_KEY!);
        const results = await exa.search(input.query, { type: "auto", numResults: 3, contents: { text: true } });
        return results.results
          .map((r) => `${r.title}: ${((r as unknown as { text?: string }).text || "").slice(0, 300)}... (${r.url})`)
          .join("\n\n");
      } catch {
        return "Web search unavailable";
      }
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

// --- Agent system prompt ---
const SYSTEM_PROMPT = `You are Klar, an AI property intelligence agent for Austrian real estate professionals.

You help Immobilienmakler (real estate agents) analyze properties, detect signals (insolvency, compliance issues, motivated sellers), and prepare client-facing comparison materials.

CAPABILITIES (via tools):
- List and inspect properties in the system
- Extract features from German property descriptions using AI
- Look up owner intelligence and insolvency signals via Exa
- Search nearby amenities (schools, transit, supermarkets) via Google Maps
- Calculate commute times by public transit
- Validate listings for compliance with Austrian law (§ 3 MaklerG, § 17 MaklerG, § 1299 ABGB)
- Run full analysis pipeline on one or all properties
- Search the web for additional context

BEHAVIOR:
- When asked to "analyze" properties, use the analyze_property or analyze_all tools
- When asked about a specific property, use get_property first to check current data
- Always cite property IDs and names when discussing specific listings
- For compliance questions, reference the specific Austrian law sections
- Respond in the same language the user writes in (German or English)
- Be concise and professional. This is a tool for working agents, not consumers.
- When reporting signals, be direct about risk level and what it means for negotiation.`;

// --- Run agent ---
export type AgentEvent =
  | { type: "text"; content: string }
  | { type: "tool_call"; name: string; input: Record<string, string> }
  | { type: "tool_result"; name: string; result: string }
  | { type: "done" }
  | { type: "error"; message: string };

export async function runAgent(
  messages: MessageParam[],
  onEvent: (event: AgentEvent) => void,
  maxTurns: number = 10,
) {
  let currentMessages = [...messages];

  while (maxTurns-- > 0) {
    const response = await client.messages.create({
      model: "anthropic/claude-sonnet-4",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: agentTools,
      messages: currentMessages,
    });

    let hasToolUse = false;
    const assistantContent: ContentBlock[] = [];
    const toolResults: { type: "tool_result"; tool_use_id: string; content: string }[] = [];

    for (const block of response.content) {
      assistantContent.push(block);

      if (block.type === "text") {
        onEvent({ type: "text", content: block.text });
      } else if (block.type === "tool_use") {
        hasToolUse = true;
        onEvent({ type: "tool_call", name: block.name, input: block.input as Record<string, string> });

        const result = await executeTool(block.name, block.input as Record<string, string>);
        onEvent({ type: "tool_result", name: block.name, result });

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }
    }

    if (!hasToolUse) break;

    currentMessages = [
      ...currentMessages,
      { role: "assistant" as const, content: assistantContent },
      { role: "user" as const, content: toolResults },
    ];
  }

  onEvent({ type: "done" });
}
