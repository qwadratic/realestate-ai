import { NextRequest } from "next/server";
import type { PropertyRaw } from "@/types";
import { runPipeline, type PipelineStage } from "@/lib/pipeline";
import properties from "../../../../fixtures/properties.json";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const query = body.query as string | undefined;

  // For now, use fixtures. Filter by query if provided.
  let selected = properties as PropertyRaw[];
  if (query) {
    const q = query.toLowerCase();
    selected = selected.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description_raw.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }

  // Limit to 6 for demo speed
  selected = selected.slice(0, 6);

  // Stream progress via SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendStage = (stage: PipelineStage, detail?: string) => {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "stage", stage, detail })}\n\n`
          )
        );
      };

      try {
        const results = await runPipeline(selected, sendStage);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "result", properties: results })}\n\n`
          )
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
