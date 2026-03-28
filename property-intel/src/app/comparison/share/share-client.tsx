"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ConversationProvider,
  useConversationControls,
  useConversationStatus,
  useConversationMode,
} from "@elevenlabs/react";
import { PropertyCard } from "@/components/property-card";
import { ChatPanel } from "@/components/chat-input";
import type { PropertyValidated, ClientProfile } from "@/types";
import clients from "../../../../fixtures/clients.json";

function propertyToCardProps(p: PropertyValidated, index: number, total: number) {
  const features = [];

  if (p.nearby?.schools?.[0]) {
    features.push({ label: `${p.nearby.schools[0].name} — ${p.nearby.schools[0].distance_m}m`, score: 4 });
  }
  if (p.nearby?.transit?.[0]) {
    features.push({ label: `${p.nearby.transit[0].name} — ${p.nearby.transit[0].distance_m}m`, score: 3 });
  }
  if (p.features?.elevator) features.push({ label: "Lift vorhanden", score: 3 });
  if (p.features?.balcony) features.push({ label: "Balkon", score: 2 });
  if (p.features?.terrace) features.push({ label: "Dachterrasse", score: 3 });
  if (p.features?.parking) features.push({ label: "Garage", score: 2 });
  if (p.features?.orientation) features.push({ label: `${p.features.orientation === "south" ? "Süd" : p.features.orientation === "west" ? "West" : p.features.orientation}seitig`, score: 2 });
  if (p.features?.condition === "renovated") features.push({ label: "Generalsaniert", score: 3 });
  if (p.features?.year_built) features.push({ label: `Neubau ${p.features.year_built}`, score: 2 });

  const signals: { label: string; variant: "red" | "amber" | "green" }[] = [];
  if (p.intel?.insolvency_status === "proceedings") {
    signals.push({ label: "Insolvenz", variant: "red" });
  }
  if (p.intel?.signals?.length) {
    for (const s of p.intel.signals) {
      if (s.toLowerCase().includes("insolvency") || s.toLowerCase().includes("insolvenz")) continue;
      signals.push({ label: s, variant: "amber" });
    }
  }
  if (signals.length === 0) {
    signals.push({ label: `Keine Signale · ${p.intel?.signal_score || 0}/5`, variant: "green" });
  }

  const sourceMap: Record<string, string> = { willhaben: "willhaben", immoscout: "ImmobilienScout", immowelt: "ImmoWelt" };

  return {
    title: p.title,
    address: p.address,
    source: sourceMap[p.source] || p.source,
    price: p.price,
    sqm: p.sqm,
    sqmVerified: p.validation?.sqm_mismatch?.detected,
    rooms: p.rooms,
    floor: p.features?.floor ? `${p.features.floor}. OG` : undefined,
    image: p.images?.[0],
    features: features.slice(0, 5),
    signals,
    signalScore: p.intel?.signal_score,
    recommended: index === 1,
    complianceFlag: p.validation?.sqm_mismatch
      ? "m²-Abweichung · § 1299 ABGB"
      : undefined,
    agentNote:
      index === 0
        ? "Beste Übereinstimmung für Ihre Familie. Volksschule in 400m."
        : index === 1
        ? "Premium-Lage. Insolvenz-Signal deutet auf Verhandlungsspielraum."
        : index === 2
        ? "Gute Lage. m²-Abweichung klären vor Besichtigung."
        : undefined,
  };
}

const mullerProfile = (clients as { profile?: ClientProfile }[])[0]?.profile || undefined;

export function ShareComparisonClient() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyValidated[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to decode property IDs from URL
    const encoded = searchParams.get("p");
    let requestedIds: string[] | null = null;

    if (encoded) {
      try {
        requestedIds = JSON.parse(atob(encoded));
      } catch {
        // Invalid encoding, fall through
      }
    }

    // Load properties from localStorage
    try {
      const stored = localStorage.getItem("klar-properties");
      if (stored) {
        const allProps = JSON.parse(stored) as PropertyValidated[];
        if (requestedIds) {
          // Filter to only requested IDs, preserving order
          const filtered = requestedIds
            .map((id) => allProps.find((p) => p.id === id))
            .filter(Boolean) as PropertyValidated[];
          setProperties(filtered.length > 0 ? filtered : allProps);
        } else {
          setProperties(allProps);
        }
      }
    } catch {
      // no data
    }

    setLoading(false);

    // Clean URL by removing the p parameter (cosmetic)
    if (encoded && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("p");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-[18px] text-muted">Laden...</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <p className="text-[18px] text-muted">Keine Objekte gefunden</p>
          <p className="text-[14px] text-faint mt-2">Der Link ist möglicherweise abgelaufen.</p>
        </div>
      </div>
    );
  }

  // Responsive grid: 1 col for 1-2, 2 cols for 3-4, 3 cols for 5+
  const gridCols =
    properties.length <= 2
      ? "grid-cols-1 md:grid-cols-2"
      : properties.length <= 4
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-3";

  return (
    <div className="min-h-screen bg-canvas">
      <header className="max-w-[1400px] mx-auto px-8 pt-10 pb-5 flex items-baseline justify-between">
        <span className="text-lg text-muted font-medium">Klar</span>
        <div className="text-right">
          <h1 className="text-[34px] font-semibold text-text">
            Erstellt für Familie Müller
          </h1>
          <p className="text-[15px] text-muted">28. März 2026</p>
        </div>
      </header>

      <div className="bg-surface">
        <div className="max-w-[1400px] mx-auto px-8 py-3.5">
          <p className="text-[15px] text-muted">
            Budget: €300k–€450k · 3+ Zimmer · Bezirke 2, 3, 7, 8 · Familie, 2 Kinder ·
            Prioritäten: Volksschule, U-Bahn, Lift
          </p>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-8 py-10">
        <div className={`grid ${gridCols} gap-6`}>
          {properties.map((p, i) => (
            <PropertyCard key={p.id} {...propertyToCardProps(p, i, properties.length)} />
          ))}
        </div>

        <ChatPanel
          properties={properties}
          clientProfile={mullerProfile}
          suggestedQuestions={[
            "Pendelzeit zum Stephansplatz vergleichen",
            "Welche hat die beste Schule?",
            "Warum ist #2 empfohlen?",
            "Preis pro m² im Vergleich",
          ]}
        />

        <footer className="mt-12 pt-6 text-center text-[14px] text-faint">
          Powered by Klar · Erstellt von Marcus Adler · KaiserTech Immobilien
        </footer>
      </main>

      {/* Voice FAB with ElevenLabs */}
      <VoiceFAB />
    </div>
  );
}

function VoiceFAB() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  if (!agentId) {
    // Fallback: non-functional FAB when no agent ID configured
    return (
      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-copper rounded-full flex items-center justify-center shadow-lg hover:bg-copper-dark transition-colors z-50"
        title="Sprachassistent (nicht konfiguriert)"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
        </svg>
      </button>
    );
  }

  return (
    <ConversationProvider>
      <VoiceButton agentId={agentId} />
    </ConversationProvider>
  );
}

function VoiceButton({ agentId }: { agentId: string }) {
  const { startSession, endSession } = useConversationControls();
  const { status } = useConversationStatus();
  const { isSpeaking } = useConversationMode();

  const connected = status === "connected";
  const connecting = status === "connecting";

  async function handleClick() {
    if (connected) {
      await endSession();
    } else {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await startSession({ agentId });
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all z-50 ${
        connected
          ? isSpeaking
            ? "bg-signal-green scale-110"
            : "bg-signal-red animate-pulse"
          : connecting
          ? "bg-copper/70 animate-pulse"
          : "bg-copper hover:bg-copper-dark"
      }`}
      title={connected ? "Gespräch beenden" : "Sprachassistent starten"}
    >
      {connected ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
        </svg>
      )}
    </button>
  );
}
