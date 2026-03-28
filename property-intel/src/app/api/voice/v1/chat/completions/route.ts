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

const VOICE_SYSTEM_PROMPT = `You are Klar, a voice-based AI property advisor for Austrian real estate.

You are speaking with a client who is viewing a property comparison page. They can see property cards with details, signals, and your agent notes.

BEHAVIOR:
- Speak naturally in German (Austrian dialect is OK). Switch to English if the client speaks English.
- Keep responses SHORT — 2-3 sentences max. This is a voice conversation, not a report.
- Reference specific properties by name and address.
- When asked "why" a property is recommended, explain based on the client's profile (family with 2 children, needs school nearby, elevator, 15 min commute to Stephansplatz).
- Mention signals directly: insolvency = Verhandlungsspielraum (negotiation leverage), sqm mismatch = Vorsicht (caution).
- Be warm but professional. You are the agent's AI assistant, not a salesperson.

AVAILABLE CONTEXT:
- Familie Müller: 2 Erwachsene, 2 Kinder (3 und 6 Jahre). Budget €300k-€450k. Bezirke 2,3,7,8. Prioritäten: Volksschule, U-Bahn, Lift.
- Property 1: Altbau-Charme Landstraße, €345k, 78m², 3 Zi. Volksschule 400m. U3 200m. Südseitig, Lift, Balkon. Keine Signale.
- Property 2: Penthouse Praterstern, €789k (over budget!). 85m², 3 Zi. U2 150m. Terrasse. INSOLVENZ-Signal — Donau Immobilien GmbH, Aktenzeichen 3S 42/26. 3 Inserate vom gleichen Eigentümer.
- Property 3: Generalsaniert Josefstadt, €375k, 85m² (ACHTUNG: nur 72m² laut Beschreibung). U2 Rathaus 400m. m²-Abweichung — § 1299 ABGB Makler-Haftung.`;

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
