import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "https://openrouter.ai/api",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
  },
});

export async function extractFeatures(description: string, title: string) {
  const response = await client.messages.create({
    model: "anthropic/claude-sonnet-4",
    max_tokens: 1024,
    system: `You are a real estate feature extraction system for the Austrian market.
Extract structured features from German property descriptions.
Return ONLY valid JSON, no markdown, no explanation.
For each feature you extract, provide a confidence score between 0 and 1.
Only extract features that are explicitly mentioned or strongly implied.`,
    messages: [
      {
        role: "user",
        content: `Extract features from this Austrian property listing.

Title: ${title}
Description: ${description}

Return JSON in this exact format:
{
  "orientation": "north"|"south"|"east"|"west"|null,
  "balcony": true|false|null,
  "terrace": true|false|null,
  "building_style": "altbau"|"neubau"|"other"|null,
  "floor": number|null,
  "elevator": true|false|null,
  "noise_level": "low"|"medium"|"high"|null,
  "condition": "renovated"|"original"|"needs_work"|null,
  "parking": true|false|null,
  "garden": true|false|null,
  "year_built": number|null,
  "heating": string|null,
  "confidence": { "feature_name": 0.0-1.0 }
}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1]);
    throw new Error(`Failed to parse features: ${text.slice(0, 200)}`);
  }
}

export async function validateOutput(
  property: { title: string; sqm: number; price: number; description_raw: string },
  extractedFeatures: Record<string, unknown>
) {
  const response = await client.messages.create({
    model: "anthropic/claude-sonnet-4",
    max_tokens: 1024,
    system: `You are an Austrian real estate compliance validator.
Check for discrepancies between listing data and description.
Austrian law (§ 3 MaklerG, § 17 MaklerG, § 1299 ABGB) makes agents liable for accuracy.
Return ONLY valid JSON.`,
    messages: [
      {
        role: "user",
        content: `Validate this property listing for compliance and accuracy.

Title: ${property.title}
Listed sqm: ${property.sqm}
Listed price: ${property.price} EUR
Description: ${property.description_raw}
Extracted features: ${JSON.stringify(extractedFeatures)}

Check for:
1. sqm discrepancies between listed value and description text
2. Features claimed in extraction but NOT in source description
3. Any legally relevant omissions (§ 3 MaklerG: duty of care)

Return JSON:
{
  "sqm_mismatch": { "listed": number, "detected": number } | null,
  "price_anomaly": null,
  "flags": ["string describing each issue"],
  "sources": ["reference for each claim"],
  "compliance_notes": ["relevant Maklergesetz references"]
}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1]);
    return {
      sqm_mismatch: null,
      price_anomaly: null,
      flags: [],
      sources: [],
      compliance_notes: [],
    };
  }
}

export { client };
