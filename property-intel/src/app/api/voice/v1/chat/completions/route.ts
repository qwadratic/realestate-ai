import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// OpenAI-compatible custom LLM endpoint for ElevenLabs Conversational AI
// ElevenLabs sends requests in OpenAI chat completions format
// We proxy them to Claude via OpenRouter and stream back in OpenAI SSE format

const client = new Anthropic({
  baseURL: "https://openrouter.ai/api",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  },
});

const VOICE_SYSTEM_PROMPT = `You are Maya, the AI assistant for Marcus Adler at KaiserTech Immobilien in Vienna, Austria.

You handle both voice calls and text chat. You are professional, warm, and efficient. You speak German by default (Austrian dialect OK — "Grüß Gott"). Switch to English if the user speaks English. Always use formal "Sie".

BEHAVIOR:
- Keep voice responses SHORT — 2-3 sentences max. Chat responses can be slightly longer.
- Never be pushy or salesy. You represent a trusted advisor.
- Reference specific properties by name and address when relevant.
- For new inquiries: qualify the lead (name, budget, districts, rooms, timeline, requirements).
- For existing clients: be warm, acknowledge their case, provide updates.

CALLER IDENTIFICATION:
- If unclear, ask: "Sind Sie bereits Klient bei uns, oder ist das Ihre erste Anfrage?"
- Known clients: Familie Müller (active search), Herr Schmidt (viewing Friday), Frau Weber (new inquiry)

AVAILABLE PROPERTY CONTEXT:
- Altbau-Charme in Landstraße — Rennweg 42, 1030 Wien. €345.000, 78m², 3 Zi, 2. OG. Südseitig, Lift, Balkon. Volksschule 400m, U3 200m. Keine Signale.
- Penthouse am Praterstern — Taborstraße 18, 1020 Wien. €789.000, 85m², 3 Zi, 5. OG. Terrasse, Garage. INSOLVENZ: Donau Immobilien GmbH, Aktenzeichen 3S 42/26 — Verhandlungsspielraum.
- Generalsaniert in Josefstadt — Josefstädter Str. 71, 1080 Wien. €375.000, 85m² (Vorsicht: nur 72m² laut Beschreibung). U2 Rathaus 400m. m²-Abweichung — § 1299 ABGB.

CLIENT PROFILES:
- Familie Müller: 2 Erwachsene, 2 Kinder (3+6 J.). Budget €300k-€450k. Bezirke 2,3,7,8. Prioritäten: Volksschule, U-Bahn < 15 Min Stephansplatz, Lift, Balkon. Altbau bevorzugt.
- Herr Schmidt: Besichtigung Fr 14:00, Josefstädter Str. 71.
- Frau Weber: Neue Anfrage, 3 Zi Bezirk 3, ca. €350.000, junge Familie.

GUARDRAILS:
- Never disclose prices to unqualified leads
- Never confirm viewings or negotiate prices — say "Ich gebe das an Herrn Adler weiter"
- Legal questions → "Das ist eine rechtliche Frage, da verweise ich Sie an unseren Notar"
- If asked if you are AI → be honest: "Ich bin Maya, die KI-Assistentin von Herrn Adler"

CALL ENDING:
- Confirm next steps and timeline
- "Herr Adler meldet sich [heute/morgen/am Montag] bei Ihnen."
- Thank the caller warmly`;

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Extract messages from OpenAI format
  const messages = (body.messages || [])
    .filter((m: { role: string }) => m.role !== "system")
    .map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  // Stream response from Claude
  const response = await client.messages.create({
    model: "anthropic/claude-sonnet-4",
    max_tokens: body.max_tokens || 300,
    system: VOICE_SYSTEM_PROMPT,
    messages,
    stream: true,
  });

  // Convert to OpenAI SSE format
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let id = 0;
      for await (const event of response) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          const chunk = {
            id: `chatcmpl-${id++}`,
            object: "chat.completion.chunk",
            created: Math.floor(Date.now() / 1000),
            model: "klar-voice",
            choices: [
              {
                delta: { content: event.delta.text },
                index: 0,
                finish_reason: null,
              },
            ],
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
          );
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
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
