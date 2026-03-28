import { NextRequest } from "next/server";
import { client } from "@/lib/claude";
import { chatTools, executeTool } from "@/lib/tools";
import type { PropertyValidated } from "@/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { messages, properties } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    properties: PropertyValidated[];
  };

  const systemPrompt = `You are a property intelligence assistant for Austrian real estate agents.
You have access to detailed data about ${properties.length} properties that have been analyzed and enriched.

PROPERTY DATA:
${JSON.stringify(properties, null, 2)}

RULES:
- Answer questions about these specific properties using the data provided
- Use the search_nearby_places tool when asked about amenities, schools, transit, etc.
- Use the compute_commute tool when asked about travel times
- Use the web_search tool for general questions not covered by property data
- Always cite which property you're referring to by name
- For legal compliance questions, reference relevant Austrian law (§ 3 MaklerG, § 17 MaklerG, § 1299 ABGB)
- If a property has validation flags, mention them when discussing that property
- Respond in the same language the user writes in (German or English)
- Be concise but thorough. This is a professional tool for real estate agents.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Multi-turn with tool use
        let currentMessages = messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        let maxTurns = 5; // prevent infinite tool loops
        while (maxTurns-- > 0) {
          const response = await client.messages.create({
            model: "anthropic/claude-sonnet-4",
            max_tokens: 2048,
            system: systemPrompt,
            tools: chatTools,
            messages: currentMessages,
          });

          // Process response blocks
          let hasToolUse = false;
          const toolResults: { type: "tool_result"; tool_use_id: string; content: string }[] = [];

          for (const block of response.content) {
            if (block.type === "text") {
              // Stream text chunks
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "text", content: block.text })}\n\n`
                )
              );
            } else if (block.type === "tool_use") {
              hasToolUse = true;
              // Notify client about tool use
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "tool_call", name: block.name, input: block.input })}\n\n`
                )
              );

              const result = await executeTool(
                block.name,
                block.input as Record<string, string>
              );
              toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: result,
              });
            }
          }

          if (!hasToolUse) break;

          // Continue conversation with tool results
          currentMessages = [
            ...currentMessages,
            { role: "assistant" as const, content: response.content as unknown as string },
            { role: "user" as const, content: toolResults as unknown as string },
          ];
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message: String(error) })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
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
