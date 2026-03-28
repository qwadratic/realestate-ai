#!/usr/bin/env npx tsx
/**
 * Apify Property Scraper for Klar
 * Scrapes Vienna apartments from willhaben, ImmobilienScout24, ImmoWelt
 * using the michaelhaar/immobilien-suchmaschine actor.
 *
 * Usage: APIFY_API_KEY=xxx npx tsx scripts/scrape-properties.ts
 */

const APIFY_TOKEN = process.env.APIFY_API_KEY!;
const ACTOR_ID = "michaelhaar/immobilien-suchmaschine";
const TIMEOUT_SECS = 300;
const POLL_INTERVAL_MS = 10_000;

if (!APIFY_TOKEN) {
  console.error("Error: APIFY_API_KEY not set");
  process.exit(1);
}

// Vienna apartment search URLs matching Müller criteria
const searchUrls = [
  // willhaben: Eigentumswohnung Wien, €250k-€500k, 3+ Zimmer
  "https://www.willhaben.at/iad/immobilien/eigentumswohnung/eigentumswohnung-angebote/wien?PRICE_FROM=250000&PRICE_TO=500000&NUMBER_OF_ROOMS_FROM=3",
  // ImmobilienScout24: Wien, Wohnung kaufen
  "https://www.immobilienscout24.at/regional/wien/wohnung-kaufen/aktualitaet",
  // ImmoWelt: Wien, Buy Apartment, €250k-€500k, 3+ rooms
  "https://www.immowelt.at/classified-search?distributionTypes=Buy&estateTypes=Apartment&locations=AD02AT10&priceMin=250000&priceMax=500000&roomsMin=3&order=DateDesc",
];

interface NormalizedProperty {
  id: string;
  source: "willhaben" | "immoscout" | "immowelt";
  url: string;
  title: string;
  price: number;
  currency: "EUR";
  sqm: number;
  rooms: number;
  address: string;
  district: string;
  city: string;
  images: string[];
  description_raw: string;
}

function findField(item: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (key.includes(".")) {
      const parts = key.split(".");
      let val: unknown = item;
      for (const part of parts) {
        if (val && typeof val === "object") val = (val as Record<string, unknown>)[part];
        else { val = undefined; break; }
      }
      if (val !== undefined && val !== null) return val;
    } else {
      if (item[key] !== undefined && item[key] !== null) return item[key];
    }
  }
  return undefined;
}

function parseNumber(raw: unknown): number | null {
  if (typeof raw === "number") return raw;
  if (typeof raw !== "string") return null;
  const cleaned = raw.replace(/[€m²\s]/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function parseRoomsFromTitle(title: string): number | null {
  const match = title.match(/(\d+)[- ]?[Zz]immer/);
  return match ? parseInt(match[1]) : null;
}

function detectPortal(url: string): "willhaben" | "immoscout" | "immowelt" {
  if (url.includes("willhaben")) return "willhaben";
  if (url.includes("immobilienscout")) return "immoscout";
  if (url.includes("immowelt")) return "immowelt";
  return "willhaben";
}

function detectDistrict(address: string, postalCode: string): string {
  const districtMap: Record<string, string> = {
    "1010": "Innere Stadt", "1020": "Leopoldstadt", "1030": "Landstraße",
    "1040": "Wieden", "1050": "Margareten", "1060": "Mariahilf",
    "1070": "Neubau", "1080": "Josefstadt", "1090": "Alsergrund",
    "1100": "Favoriten", "1110": "Simmering", "1120": "Meidling",
    "1130": "Hietzing", "1140": "Penzing", "1150": "Rudolfsheim-Fünfhaus",
    "1160": "Ottakring", "1170": "Hernals", "1180": "Währing",
    "1190": "Döbling", "1200": "Brigittenau", "1210": "Floridsdorf",
    "1220": "Donaustadt", "1230": "Liesing",
  };

  if (postalCode && districtMap[postalCode]) return districtMap[postalCode];

  for (const [code, name] of Object.entries(districtMap)) {
    if (address.includes(code) || address.includes(name)) return name;
  }
  return "Wien";
}

function normalizeItem(item: Record<string, unknown>, index: number): NormalizedProperty | null {
  const url = String(findField(item, ["url", "link", "Link zum Inserat"]) || "");
  const title = String(findField(item, ["title", "titel", "heading", "Titel"]) || "Untitled");
  const priceRaw = findField(item, ["monetaryDetails.purchasingPrice", "price", "preis", "Preis (EUR)"]);
  const price = parseNumber(priceRaw);
  const sqmRaw = findField(item, ["features.livingArea", "livingArea", "area", "flaeche", "Fläche (m²)"]);
  const sqm = parseNumber(sqmRaw);
  let rooms = parseNumber(findField(item, ["features.numberOfRooms", "rooms", "zimmer", "Zimmer"]));
  if (!rooms) rooms = parseRoomsFromTitle(title);
  const description = String(findField(item, ["description", "beschreibung", "Beschreibung"]) || "").slice(0, 1000);
  const addressParts = [];
  const addr = findField(item, ["address.street", "address", "adresse", "Adresse"]);
  if (addr) addressParts.push(String(addr));
  const plz = String(findField(item, ["address.postalCode", "postalCode", "plz", "PLZ"]) || "");
  const city = String(findField(item, ["address.city", "city", "ort", "Ort"]) || "Wien");
  if (plz) addressParts.push(plz);
  addressParts.push(city);
  const address = addressParts.join(", ") || "Wien";

  const imageRaw = findField(item, ["images", "Bild-URL"]);
  let images: string[] = [];
  if (Array.isArray(imageRaw)) {
    images = imageRaw.slice(0, 3).map((img: unknown) =>
      typeof img === "object" && img && "url" in img ? String((img as { url: string }).url) : String(img)
    );
  } else if (typeof imageRaw === "string" && imageRaw) {
    images = [imageRaw];
  }

  if (!price || !sqm || !rooms) return null;

  const source = detectPortal(url);
  const district = detectDistrict(address, plz);

  return {
    id: `${source}-${String(index).padStart(3, "0")}`,
    source,
    url,
    title,
    price,
    currency: "EUR",
    sqm,
    rooms,
    address,
    district,
    city,
    images,
    description_raw: description,
  };
}

async function main() {
  console.log("Starting Apify scrape...");
  console.log(`Actor: ${ACTOR_ID}`);
  console.log(`Search URLs: ${searchUrls.length}`);

  // Resolve actor slug
  const actorSlug = ACTOR_ID.replace("/", "~");

  // Start run
  console.log("\n1. Starting actor run...");
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/${actorSlug}/runs?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchResultPageUrls: searchUrls,
        timeoutSecs: TIMEOUT_SECS,
      }),
    }
  );

  if (!startRes.ok) {
    const err = await startRes.text();
    console.error("Failed to start:", err);
    process.exit(1);
  }

  const startData = await startRes.json();
  const runId = startData.data.id;
  console.log(`   Run ID: ${runId}`);

  // Poll until complete
  console.log("\n2. Polling for completion...");
  let status = "RUNNING";
  let datasetId = "";

  while (status === "RUNNING" || status === "READY") {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const pollRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );
    const pollData = await pollRes.json();
    status = pollData.data.status;
    datasetId = pollData.data.defaultDatasetId;
    const stats = pollData.data.stats || {};
    console.log(`   Status: ${status} | Items: ${stats.itemCount || 0} | Pages: ${stats.pagesCount || 0}`);
  }

  if (status !== "SUCCEEDED") {
    console.error(`   Failed with status: ${status}`);
    process.exit(1);
  }

  // Download dataset
  console.log("\n3. Downloading dataset...");
  const dataRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`
  );
  const rawItems: Record<string, unknown>[] = await dataRes.json();
  console.log(`   Raw items: ${rawItems.length}`);

  // Normalize
  console.log("\n4. Normalizing...");
  const normalized: NormalizedProperty[] = [];
  const seenUrls = new Set<string>();

  for (let i = 0; i < rawItems.length; i++) {
    const item = normalizeItem(rawItems[i], i);
    if (!item) continue;
    if (seenUrls.has(item.url)) continue;
    seenUrls.add(item.url);
    normalized.push(item);
  }

  console.log(`   Normalized: ${normalized.length} (deduped from ${rawItems.length})`);

  // Filter to target districts and price range
  const targetDistricts = ["Leopoldstadt", "Landstraße", "Margareten", "Neubau", "Josefstadt", "Favoriten", "Wieden"];
  const filtered = normalized.filter(
    (p) => p.price >= 200000 && p.price <= 600000 && p.rooms >= 2
  );

  console.log(`   After filtering: ${filtered.length}`);

  // Take top results
  const top = filtered.slice(0, 20);

  // Save
  const fs = await import("fs");
  const path = await import("path");
  const outPath = path.join(__dirname, "..", "fixtures", "scraped-properties.json");
  fs.writeFileSync(outPath, JSON.stringify(top, null, 2));
  console.log(`\n5. Saved ${top.length} properties to ${outPath}`);

  // Also save raw for debugging
  const rawPath = path.join(__dirname, "..", "fixtures", "scraped-raw.json");
  fs.writeFileSync(rawPath, JSON.stringify(rawItems.slice(0, 5), null, 2));
  console.log(`   Raw sample saved to ${rawPath}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
