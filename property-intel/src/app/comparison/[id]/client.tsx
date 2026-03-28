"use client";

import { useState, useEffect } from "react";
import { PropertyCard } from "@/components/property-card";
import { ChatPanel } from "@/components/chat-input";
import type { PropertyValidated, ClientProfile } from "@/types";
import clients from "../../../../fixtures/clients.json";

// Demo data — replaced when pipeline provides real results
const DEMO_PROPERTIES: PropertyValidated[] = [
  {
    id: "wh-001",
    source: "willhaben",
    url: "",
    title: "Altbau-Charme in Landstraße",
    price: 345000,
    currency: "EUR",
    sqm: 78,
    rooms: 3,
    address: "Rennweg 42, 1030 Wien",
    district: "Landstraße",
    city: "Wien",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    description_raw: "",
    features: {
      orientation: "south",
      balcony: true,
      building_style: "altbau",
      floor: 2,
      elevator: true,
      noise_level: "low",
      condition: "original",
      confidence: {},
    },
    nearby: {
      schools: [{ name: "Volksschule Landstraße", distance_m: 400, type: "school" }],
      transit: [{ name: "U3 Kardinal-Nagl-Platz", distance_m: 200, type: "subway_station" }],
      supermarkets: [{ name: "Billa", distance_m: 80, type: "supermarket" }],
      commute_center_min: 12,
    },
    intel: { signal_score: 0, signals: [], insolvency_status: "none" },
    validation: { flags: [], sources: [], compliance_notes: [] },
  },
  {
    id: "is-002",
    source: "immoscout",
    url: "",
    title: "Penthouse am Praterstern",
    price: 789000,
    currency: "EUR",
    sqm: 85,
    rooms: 3,
    address: "Taborstraße 18, 1020 Wien",
    district: "Leopoldstadt",
    city: "Wien",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    description_raw: "",
    features: {
      terrace: true,
      building_style: "neubau",
      floor: 5,
      elevator: true,
      parking: true,
      year_built: 2021,
      confidence: {},
    },
    nearby: {
      schools: [],
      transit: [{ name: "U2 Taborstraße", distance_m: 150, type: "subway_station" }],
      supermarkets: [],
      commute_center_min: 8,
    },
    intel: {
      signal_score: 3,
      signals: ["Owner insolvency filed", "3 listings by same owner"],
      insolvency_status: "proceedings",
      owner_type: "company",
    },
    validation: { flags: [], sources: [], compliance_notes: [] },
  },
  {
    id: "iw-003",
    source: "immowelt",
    url: "",
    title: "Generalsaniert in Josefstadt",
    price: 375000,
    currency: "EUR",
    sqm: 85,
    rooms: 3,
    address: "Josefstädter Str. 71, 1080 Wien",
    district: "Josefstadt",
    city: "Wien",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    description_raw: "",
    features: {
      orientation: "west",
      condition: "renovated",
      building_style: "altbau",
      confidence: {},
    },
    nearby: {
      schools: [],
      transit: [{ name: "U2 Rathaus", distance_m: 400, type: "subway_station" }],
      supermarkets: [],
    },
    intel: { signal_score: 1, signals: ["sqm discrepancy"], insolvency_status: "none" },
    validation: {
      sqm_mismatch: { listed: 85, detected: 72 },
      flags: ["sqm mismatch between listing and description"],
      sources: ["Description mentions 72m² usable area"],
      compliance_notes: ["§ 1299 ABGB — agent liability for incorrect data"],
    },
  },
];

function propertyToCardProps(p: PropertyValidated, index: number) {
  const features = [];

  // Build "why this matches" from nearby data
  if (p.nearby?.schools?.[0]) {
    features.push({ label: `${p.nearby.schools[0].name} — ${p.nearby.schools[0].distance_m}m`, score: 4 });
  }
  if (p.nearby?.transit?.[0]) {
    features.push({ label: `${p.nearby.transit[0].name} — ${p.nearby.transit[0].distance_m}m`, score: 3 });
  }
  if (p.features?.elevator) features.push({ label: "Elevator available", score: 3 });
  if (p.features?.balcony) features.push({ label: "Balcony", score: 2 });
  if (p.features?.terrace) features.push({ label: "Dachterrasse", score: 3 });
  if (p.features?.parking) features.push({ label: "Garage included", score: 2 });
  if (p.features?.orientation) features.push({ label: `${p.features.orientation.charAt(0).toUpperCase() + p.features.orientation.slice(1)}-facing`, score: 2 });
  if (p.features?.condition === "renovated") features.push({ label: "Fully renovated", score: 3 });
  if (p.features?.year_built) features.push({ label: `Neubau ${p.features.year_built}`, score: 2 });

  const signals: { label: string; variant: "red" | "amber" | "green" }[] = [];
  if (p.intel?.insolvency_status === "proceedings") {
    signals.push({ label: "Owner Insolvency", variant: "red" });
  }
  if (p.intel && p.intel.signals.length > 0) {
    for (const s of p.intel.signals) {
      if (s.includes("insolvency") || s.includes("Insolvency")) continue;
      signals.push({ label: s, variant: "amber" });
    }
  }
  if (signals.length === 0 && p.intel) {
    signals.push({ label: `No distress signals · ${p.intel.signal_score}/5`, variant: "green" });
  }

  const sourceMap: Record<string, string> = {
    willhaben: "willhaben",
    immoscout: "ImmobilienScout",
    immowelt: "ImmoWelt",
  };

  return {
    title: p.title,
    address: p.address,
    source: sourceMap[p.source] || p.source,
    price: p.price,
    sqm: p.sqm,
    sqmVerified: p.validation?.sqm_mismatch?.detected,
    rooms: p.rooms,
    floor: p.features?.floor ? `${p.features.floor}. OG` : undefined,
    image: p.images[0],
    features: features.slice(0, 5),
    signals,
    signalScore: p.intel?.signal_score,
    recommended: index === 1,
    complianceFlag: p.validation?.sqm_mismatch
      ? "sqm mismatch · § 1299 ABGB"
      : undefined,
    agentNote:
      index === 0
        ? "Best match for your family. The school is excellent."
        : index === 1
        ? "Premium location. Signals suggest negotiation leverage."
        : "Great area. Ask about the sqm discrepancy before viewing.",
  };
}

const mullerProfile = (clients as { profile?: ClientProfile }[])[0]?.profile || undefined;

export function ComparisonClient({ comparisonId }: { comparisonId: string }) {
  const [properties, setProperties] = useState<PropertyValidated[]>(DEMO_PROPERTIES);

  // Load real data if available
  useEffect(() => {
    // Try localStorage first (set by pipeline)
    try {
      const stored = localStorage.getItem("klar-properties");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProperties(parsed.slice(0, 3));
          return;
        }
      }
    } catch {}

    // Try API for "live" mode
    if (comparisonId === "live") {
      fetch("/api/properties")
        .then((res) => res.json())
        .then((data) => {
          if (data.properties?.length > 0) {
            setProperties(data.properties.slice(0, 3));
          }
        })
        .catch(() => {});
    }
  }, [comparisonId]);

  return (
    <div className="min-h-screen bg-canvas">
      <header className="max-w-[1400px] mx-auto px-8 pt-10 pb-5 flex items-baseline justify-between">
        <span className="text-lg text-muted font-medium">Klar</span>
        <div className="text-right">
          <h1 className="text-[34px] font-semibold text-text">
            Prepared for Müller Family
          </h1>
          <p className="text-[15px] text-muted">28. März 2026</p>
        </div>
      </header>

      <div className="bg-surface">
        <div className="max-w-[1400px] mx-auto px-8 py-3.5">
          <p className="text-[15px] text-muted">
            Budget: €300k–€450k · 3+ rooms · Bezirke 2-9 · Family, 2 children ·
            Priority: Schools, Transit, Elevator
          </p>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} {...propertyToCardProps(p, i)} />
          ))}
        </div>

        <ChatPanel
          properties={properties}
          clientProfile={mullerProfile}
          suggestedQuestions={[
            "Compare commute to Stephansplatz",
            "Which has the best school?",
            "Why is #2 recommended?",
            "Price per m² comparison",
          ]}
        />

        <footer className="mt-12 pt-6 text-center text-[14px] text-faint">
          Powered by Klar · Prepared by Marcus Adler · KaiserTech Immobilien
        </footer>
      </main>

      {/* Voice FAB */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-copper rounded-full flex items-center justify-center shadow-lg hover:bg-copper-dark transition-colors z-50"
        title="Sprachassistent"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
        </svg>
      </button>
    </div>
  );
}
