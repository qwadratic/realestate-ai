import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import { enrichWithMaps, computeCommute } from "./maps";
import Exa from "exa-js";

// Tool definitions for Claude
export const chatTools: Tool[] = [
  {
    name: "search_nearby_places",
    description:
      "Search for places near a property address. Use this when the user asks about nearby amenities, schools, transit, restaurants, shops, parks, etc.",
    input_schema: {
      type: "object" as const,
      properties: {
        address: {
          type: "string",
          description: "The property address to search near",
        },
        place_type: {
          type: "string",
          description:
            'Type of place to search for, e.g. "school", "subway_station", "supermarket", "restaurant", "park", "pharmacy", "gym"',
        },
      },
      required: ["address", "place_type"],
    },
  },
  {
    name: "compute_commute",
    description:
      "Calculate commute time from a property to a destination by public transit. Use this when the user asks about commute times, travel duration, or how to get somewhere.",
    input_schema: {
      type: "object" as const,
      properties: {
        from_address: {
          type: "string",
          description: "The property address (origin)",
        },
        to_address: {
          type: "string",
          description:
            "The destination address. Defaults to Stephansplatz (city center) if not specified.",
        },
      },
      required: ["from_address"],
    },
  },
  {
    name: "web_search",
    description:
      "Search the web for information about a topic. Use this when the user asks about something not in the property data, like neighborhood info, local regulations, market trends, energy efficiency, solar panels, etc.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
      },
      required: ["query"],
    },
  },
];

// Tool execution
export async function executeTool(
  toolName: string,
  input: Record<string, string>
): Promise<string> {
  switch (toolName) {
    case "search_nearby_places": {
      const results = await enrichWithMaps(input.address);
      // Return relevant type based on query
      const type = input.place_type?.toLowerCase() || "";
      if (type.includes("school")) return JSON.stringify(results.schools);
      if (type.includes("transit") || type.includes("subway") || type.includes("station"))
        return JSON.stringify(results.transit);
      if (type.includes("supermarket") || type.includes("grocery"))
        return JSON.stringify(results.supermarkets);
      // For other types, return all
      return JSON.stringify(results);
    }

    case "compute_commute": {
      const geocodeRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(input.from_address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      const geocodeData = await geocodeRes.json();
      const location = geocodeData.results?.[0]?.geometry?.location;
      if (!location) return "Could not geocode the address";

      const minutes = await computeCommute(
        location,
        input.to_address || "Stephansplatz 1, 1010 Wien"
      );
      if (minutes === undefined) return "Could not calculate commute time";
      return `Commute time by public transit: approximately ${minutes} minutes`;
    }

    case "web_search": {
      try {
        const exa = new Exa(process.env.EXA_API_KEY!);
        const results = await exa.search(input.query, {
          type: "auto",
          numResults: 3,
          contents: { text: true },
        });
        return results.results
          .map(
            (r) =>
              `${r.title}: ${((r as unknown as { text?: string }).text || "").slice(0, 300)}... (${r.url})`
          )
          .join("\n\n");
      } catch {
        return "Web search is currently unavailable";
      }
    }

    default:
      return `Unknown tool: ${toolName}`;
  }
}
