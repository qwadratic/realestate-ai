import type {
  PropertyRaw,
  PropertyExtracted,
  PropertyEnriched,
  PropertyValidated,
} from "@/types";
import { extractFeatures, validateOutput } from "./claude";
import { lookupPropertyIntel } from "./exa";
import { enrichWithMaps } from "./maps";

export type PipelineStage =
  | "searching"
  | "extracting"
  | "enriching"
  | "validating"
  | "complete";

export type StageCallback = (stage: PipelineStage, detail?: string) => void;

// Stage 1 → 2: Feature extraction (parallel)
export async function extractAll(
  properties: PropertyRaw[],
  onStage?: StageCallback
): Promise<PropertyExtracted[]> {
  onStage?.("extracting", `Analyzing ${properties.length} properties...`);

  const results = await Promise.all(
    properties.map(async (p) => {
      const features = await extractFeatures(p.description_raw, p.title);
      return { ...p, features } as PropertyExtracted;
    })
  );

  return results;
}

// Stage 2 → 3: Enrichment (parallel per property)
export async function enrichAll(
  properties: PropertyExtracted[],
  onStage?: StageCallback
): Promise<PropertyEnriched[]> {
  onStage?.("enriching", "Looking up intelligence & nearby places...");

  const results = await Promise.all(
    properties.map(async (p) => {
      const [nearby, intel] = await Promise.all([
        enrichWithMaps(p.address),
        lookupPropertyIntel(p.address, p.district),
      ]);
      return { ...p, nearby, intel } as PropertyEnriched;
    })
  );

  return results;
}

// Stage 3 → 4: Validation (parallel)
export async function validateAll(
  properties: PropertyEnriched[],
  onStage?: StageCallback
): Promise<PropertyValidated[]> {
  onStage?.("validating", "Checking compliance & accuracy...");

  const results = await Promise.all(
    properties.map(async (p) => {
      const validation = await validateOutput(
        {
          title: p.title,
          sqm: p.sqm,
          price: p.price,
          description_raw: p.description_raw,
        },
        p.features
      );
      return { ...p, validation } as PropertyValidated;
    })
  );

  return results;
}

// Full pipeline: Raw → Validated
export async function runPipeline(
  properties: PropertyRaw[],
  onStage?: StageCallback
): Promise<PropertyValidated[]> {
  onStage?.("searching", `Processing ${properties.length} listings...`);

  const extracted = await extractAll(properties, onStage);
  const enriched = await enrichAll(extracted, onStage);
  const validated = await validateAll(enriched, onStage);

  onStage?.("complete", `${validated.length} properties ready`);
  return validated;
}
