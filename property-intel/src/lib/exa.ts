import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY!);

export interface IntelResult {
  owner_name?: string;
  owner_type?: "individual" | "company";
  owner_other_properties?: number;
  insolvency_status?: "none" | "proceedings" | "unknown";
  building_permit_status?: string;
  signal_score: number;
  signals: string[];
  source_url?: string;
}

export async function lookupPropertyIntel(
  address: string,
  district: string
): Promise<IntelResult | null> {
  try {
    // Search for owner info and insolvency signals
    const [ownerResults, insolvencyResults] = await Promise.all([
      exa.search(`"${address}" Wien Eigentümer OR Besitzer OR GmbH`, {
        type: "auto",
        numResults: 5,
        contents: { text: true },
      }),
      exa.search(
        `"${district}" Wien Insolvenz OR Konkurs OR Exekution Immobilien`,
        {
          type: "auto",
          numResults: 3,
          contents: { text: true },
        }
      ),
    ]);

    const signals: string[] = [];
    let ownerName: string | undefined;
    let ownerType: "individual" | "company" | undefined;
    let insolvencyStatus: "none" | "proceedings" | "unknown" = "unknown";

    // Parse owner results
    for (const result of ownerResults.results) {
      const text = (result as unknown as { text?: string }).text || "";
      if (text.includes("GmbH") || text.includes("AG") || text.includes("KG")) {
        ownerType = "company";
        const match = text.match(
          /([A-ZÄÖÜ][a-zäöüß]+ (?:GmbH|AG|KG|OG|e\.U\.))/
        );
        if (match) ownerName = match[1];
      }
      if (
        text.includes("weitere Objekte") ||
        text.includes("multiple") ||
        text.includes("portfolio")
      ) {
        signals.push("Owner has multiple properties listed");
      }
    }

    // Parse insolvency results
    for (const result of insolvencyResults.results) {
      const text = (result as unknown as { text?: string }).text || "";
      if (
        text.includes("Insolvenz") ||
        text.includes("Konkursverfahren") ||
        text.includes("Sanierungsverfahren")
      ) {
        insolvencyStatus = "proceedings";
        signals.push("Insolvency proceedings detected in district");
        if (result.url) {
          // Don't break, collect all signals
        }
      }
    }

    if (insolvencyStatus === "unknown" && insolvencyResults.results.length > 0) {
      insolvencyStatus = "none";
    }

    // Check for building permit signals
    if (ownerResults.results.some((r) => ((r as unknown as { text?: string }).text || "").includes("Baugenehmigung"))) {
      signals.push("Building permit reference found");
    }

    const signalScore = Math.min(signals.length, 5);

    return {
      owner_name: ownerName,
      owner_type: ownerType,
      insolvency_status: insolvencyStatus,
      signal_score: signalScore,
      signals,
      source_url: ownerResults.results[0]?.url,
    };
  } catch (error) {
    console.error(`Exa lookup failed for ${address}:`, error);
    return null;
  }
}
