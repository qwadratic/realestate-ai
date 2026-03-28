import { getStore } from "@/lib/agent";

export async function GET() {
  const store = getStore();
  const analyzed = Array.from(store.analyzed.values());
  const raw = store.raw;

  return Response.json({
    total: raw.length,
    analyzed: analyzed.length,
    properties: analyzed.length > 0 ? analyzed : raw,
  });
}
