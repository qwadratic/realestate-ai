"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { PropertyCard } from "@/components/property-card";
import { SignalChip } from "@/components/signal-chip";
import { usePipeline } from "@/lib/use-pipeline";
import type { Client, PropertyValidated } from "@/types";
import clients from "../../../../fixtures/clients.json";
import demoProperties from "../../../../fixtures/properties.json";

// Pipeline visual steps (mapped from 4 real stages to 6 demo steps)
const PIPELINE_STEPS = [
  { id: "willhaben", label: "Durchsuche willhaben.at...", stage: "searching" },
  { id: "immoscout", label: "Durchsuche ImmobilienScout24.at...", stage: "searching" },
  { id: "immowelt", label: "Durchsuche ImmoWelt.at...", stage: "searching" },
  { id: "exa", label: "Exa Intelligence — Eigentümer & Insolvenz...", stage: "enriching" },
  { id: "signals", label: "KI-Signale erkennen...", stage: "enriching" },
  { id: "compliance", label: "Compliance-Prüfung (§ 3 MaklerG)...", stage: "validating" },
];

function TranscriptSection({ transcript }: { transcript: string }) {
  const lines = transcript.split("\n\n");
  return (
    <div className="bg-card rounded-[4px] p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <h2 className="text-xl font-semibold text-text mb-1">Gesprächsprotokoll</h2>
      <p className="text-[13px] text-faint mb-4">Telefonat vom 27. März 2026, 09:15</p>
      <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
        {lines.map((line, i) => {
          const isAgent = line.startsWith("Agent:");
          const speaker = isAgent ? "Agent" : "Frau Müller";
          const text = line.replace(/^(Agent|Frau Müller): ?/, "");
          return (
            <div key={i} className={isAgent ? "" : ""}>
              <span className={`text-[13px] font-medium ${isAgent ? "text-copper" : "text-muted"}`}>
                {speaker}
              </span>
              <p className="text-[15px] text-text mt-0.5">{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileSection({ profile }: { profile: NonNullable<Client["profile"]> }) {
  const fields = [
    { label: "Budget", value: `€${(profile.budget_min / 1000).toFixed(0)}k – €${(profile.budget_max / 1000).toFixed(0)}k`, key: "budget_max" },
    { label: "Zimmer", value: `${profile.rooms_min}+ (bevorzugt ${profile.rooms_preferred || profile.rooms_min})`, key: "rooms_preferred" },
    { label: "Bezirke", value: profile.districts.join(", "), key: "districts" },
    { label: "Familie", value: profile.family, key: "family" },
    { label: "Stil", value: profile.style_preference || "—", key: "style_preference" },
    { label: "Einzug", value: profile.move_in || "—", key: "move_in" },
    { label: "Finanzierung", value: profile.financing || "—", key: "financing" },
  ];

  return (
    <div className="bg-card rounded-[4px] p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <h2 className="text-xl font-semibold text-text mb-1">Klientenprofil</h2>
      <p className="text-[13px] text-faint mb-4">Aus Gespräch extrahiert · Vom Makler bearbeitet</p>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.label}>
            <span className="text-[13px] font-medium text-muted">{f.label}</span>
            {profile.edited_fields.includes(f.key) && (
              <span className="text-[11px] text-copper ml-2 font-medium">Bearbeitet ✎</span>
            )}
            <p className="text-[15px] text-text mt-0.5">{f.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <span className="text-[13px] font-medium text-muted">Prioritäten</span>
        <div className="flex flex-wrap gap-2 mt-1.5">
          {profile.priorities.map((p, i) => (
            <span key={p} className="px-3 py-1 bg-surface text-[14px] text-text rounded-[4px]">
              {i + 1}. {p}
            </span>
          ))}
        </div>
      </div>
      {profile.notes_agent && (
        <p className="text-[14px] italic text-muted mt-4 pt-4 border-t border-ghost-border">
          Makler-Notiz: {profile.notes_agent}
        </p>
      )}
    </div>
  );
}

function CriteriaSection({ criteria }: { criteria: NonNullable<Client["searchCriteria"]> }) {
  const chips = [
    `${criteria.rooms_min}+ Zimmer`,
    `Max €${(criteria.price_max / 1000).toFixed(0)}.000`,
    `Bezirke ${criteria.districts.join(", ")}`,
    ...criteria.must_have.map((m) => {
      const labels: Record<string, string> = { elevator: "Lift ✓", balcony: "Balkon ✓" };
      return labels[m] || m;
    }),
    `Pendel max ${criteria.commute_max_min} Min`,
  ];

  return (
    <div className="bg-card rounded-[4px] p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <h2 className="text-xl font-semibold text-text mb-1">Suchkriterien</h2>
      <p className="text-[13px] text-faint mb-4">Abgeleitet aus Klientenprofil</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <span key={c} className="px-3 py-1.5 bg-surface text-[15px] font-medium text-text rounded-[4px]">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function PipelineAnimation({
  activeStep,
  completedSteps,
}: {
  activeStep: number;
  completedSteps: Set<number>;
}) {
  return (
    <div className="bg-card rounded-[4px] p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <h2 className="text-xl font-semibold text-text mb-4">Suche läuft...</h2>
      <div className="space-y-3">
        {PIPELINE_STEPS.map((step, i) => {
          const done = completedSteps.has(i);
          const active = i === activeStep;
          return (
            <div key={step.id} className="flex items-center gap-3">
              {done ? (
                <span className="w-5 h-5 rounded-full bg-signal-green flex items-center justify-center text-white text-xs">✓</span>
              ) : active ? (
                <span className="w-5 h-5 rounded-full bg-copper animate-pulse" />
              ) : (
                <span className="w-5 h-5 rounded-full bg-ghost-border" />
              )}
              <span className={`text-[15px] ${done ? "text-muted" : active ? "text-text font-medium" : "text-faint"}`}>
                {step.label}
              </span>
              {active && <span className="text-[13px] text-copper animate-pulse ml-auto">In Bearbeitung</span>}
            </div>
          );
        })}
      </div>
      <div className="flex gap-1 mt-4">
        {PIPELINE_STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              completedSteps.has(i) || i === activeStep ? "bg-copper" : "bg-ghost-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function propertyToCardProps(p: PropertyValidated, index: number) {
  const features = [];
  if (p.nearby?.schools?.[0]) features.push({ label: `${p.nearby.schools[0].name} — ${p.nearby.schools[0].distance_m}m`, score: 4 });
  if (p.nearby?.transit?.[0]) features.push({ label: `${p.nearby.transit[0].name} — ${p.nearby.transit[0].distance_m}m`, score: 3 });
  if (p.features?.elevator) features.push({ label: "Lift vorhanden", score: 3 });
  if (p.features?.balcony) features.push({ label: "Balkon", score: 2 });
  if (p.features?.terrace) features.push({ label: "Terrasse", score: 3 });
  if (p.features?.orientation) features.push({ label: `${p.features.orientation === "south" ? "Süd" : p.features.orientation === "west" ? "West" : p.features.orientation}seitig`, score: 2 });

  const signals: { label: string; variant: "red" | "amber" | "green" }[] = [];
  if (p.intel?.insolvency_status === "proceedings") signals.push({ label: "Insolvenz", variant: "red" });
  if (p.intel?.signals?.length) {
    for (const s of p.intel.signals) {
      if (!s.toLowerCase().includes("insolvency") && !s.toLowerCase().includes("insolvenz")) {
        signals.push({ label: s, variant: "amber" });
      }
    }
  }
  if (signals.length === 0) signals.push({ label: `Keine Signale · ${p.intel?.signal_score || 0}/5`, variant: "green" });

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
    features: features.slice(0, 4),
    signals,
    signalScore: p.intel?.signal_score,
    recommended: index === 1,
    complianceFlag: p.validation?.sqm_mismatch ? "m²-Abweichung · § 1299 ABGB" : undefined,
  };
}

export function ClientDetail({ clientId }: { clientId: string }) {
  const client = (clients as Client[]).find((c) => c.id === clientId);
  const pipeline = usePipeline();

  // Pipeline animation state
  const [animStep, setAnimStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<PropertyValidated[]>([]);
  const [pipelineStarted, setPipelineStarted] = useState(false);

  // Simulate pipeline animation
  useEffect(() => {
    if (!pipelineStarted) return;

    let step = 0;
    const interval = setInterval(() => {
      if (step < PIPELINE_STEPS.length) {
        setAnimStep(step);
        if (step > 0) {
          setCompletedSteps((prev) => new Set([...prev, step - 1]));
        }
        step++;
      } else {
        setCompletedSteps((prev) => new Set([...prev, PIPELINE_STEPS.length - 1]));
        setAnimStep(-1);
        clearInterval(interval);

        // Show results
        setTimeout(() => {
          // Use pipeline results if available, otherwise demo data
          if (pipeline.properties.length > 0) {
            setResults(pipeline.properties.slice(0, 6));
          } else {
            // Use fixture data as fallback
            const fallback = (demoProperties as unknown as PropertyValidated[]).slice(0, 6);
            setResults(fallback);
          }
          setShowResults(true);
        }, 500);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [pipelineStarted, pipeline.properties]);

  const handleStartSearch = () => {
    setPipelineStarted(true);
    // Also trigger real pipeline in background
    pipeline.run();
  };

  // Store results for comparison page
  useEffect(() => {
    if (showResults && results.length > 0) {
      localStorage.setItem("klar-properties", JSON.stringify(results));
    }
  }, [showResults, results]);

  if (!client) {
    return (
      <>
        <Nav />
        <main className="flex-1 max-w-[960px] mx-auto w-full px-8 py-10">
          <p className="text-lg text-muted">Klient nicht gefunden.</p>
          <Link href="/" className="text-copper hover:text-copper-dark">← Zurück</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1 max-w-[960px] mx-auto w-full px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="text-[15px] text-copper hover:text-copper-dark">Klienten</Link>
          <span className="text-faint">›</span>
          <span className="text-[15px] text-text font-medium">{client.name}</span>
          <SignalChip variant={client.status === "active" ? "green" : client.status === "viewing" ? "amber" : "red"}>
            {client.statusLabel}
          </SignalChip>
        </div>

        <div className="space-y-6">
          {/* Transcript */}
          {client.transcript && <TranscriptSection transcript={client.transcript} />}

          {/* Profile */}
          {client.profile && <ProfileSection profile={client.profile} />}

          {/* Search Criteria */}
          {client.searchCriteria && <CriteriaSection criteria={client.searchCriteria} />}

          {/* Start Search Button */}
          {!pipelineStarted && client.searchCriteria && (
            <button
              onClick={handleStartSearch}
              className="w-full py-4 bg-copper text-white text-lg font-medium rounded-[4px] hover:bg-copper-dark transition-colors"
            >
              Suche starten
            </button>
          )}

          {/* Pipeline Animation */}
          {pipelineStarted && !showResults && (
            <PipelineAnimation activeStep={animStep} completedSteps={completedSteps} />
          )}

          {/* Results */}
          {showResults && (
            <>
              <div className="bg-card rounded-[4px] p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <h2 className="text-xl font-semibold text-text mb-1">
                  {results.length} Objekte gefunden
                </h2>
                <p className="text-[15px] text-muted">
                  {results.filter((p) => (p.intel?.signal_score || 0) > 0).length} mit Signalen ·{" "}
                  {results.filter((p) => (p.validation?.flags?.length || 0) > 0).length} mit Compliance-Hinweisen
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.slice(0, 6).map((p, i) => (
                  <PropertyCard key={p.id} {...propertyToCardProps(p, i)} />
                ))}
              </div>

              <Link
                href="/comparison/demo"
                className="block w-full py-4 bg-copper text-white text-lg font-medium rounded-[4px] hover:bg-copper-dark transition-colors text-center"
              >
                Vergleichsgalerie erstellen →
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  );
}
