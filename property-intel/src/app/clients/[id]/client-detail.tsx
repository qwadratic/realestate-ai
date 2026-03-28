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

// Grounded summary: each insight links to a real transcript quote
const GROUNDED_INSIGHTS = [
  {
    label: "Mindestens 3 Zimmer, bevorzugt 4",
    quote: "Mindestens drei Zimmer, besser vier. Am liebsten Altbau mit hohen Decken.",
  },
  {
    label: "Lift ist entscheidend",
    quote: "Ganz wichtig: ein Lift! Mit zwei kleinen Kindern und dem Kinderwagen ist das ohne Aufzug wirklich mühsam.",
  },
  {
    label: "Bezirke 2, 3, 7, 8",
    quote: "Wir schauen uns den 2., 3., 7. und 8. Bezirk an.",
  },
  {
    label: "Max 15 Min Pendel zum Stephansplatz",
    quote: "Mein Mann arbeitet am Stephansplatz, also sollte die Anbindung gut sein — maximal 15 Minuten mit den Öffis.",
  },
  {
    label: "Volksschule in der Nähe",
    quote: "Eine Volksschule in der Nähe ist uns extrem wichtig, die Große kommt nächstes Jahr in die Schule.",
  },
  {
    label: "Budget €300k–€450k",
    quote: "Unser Maximum liegt bei 450.000 Euro. Ideal wäre zwischen 300 und 400 Tausend.",
  },
  {
    label: "Finanzierung gesichert",
    quote: "Wir haben auch etwas Eigenkapital, also ist die Finanzierung grundsätzlich kein Problem.",
  },
];

function TranscriptSummary({ transcript }: { transcript: string }) {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="bg-card rounded-[4px] p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-semibold text-text">Gesprächsanalyse</h2>
        <span className="text-[12px] text-copper font-medium bg-copper/10 px-2 py-0.5 rounded">KI-extrahiert</span>
      </div>
      <p className="text-[13px] text-faint mb-5">Telefonat vom 27. März 2026, 09:15 · 7 Erkenntnisse</p>

      <div className="space-y-2.5">
        {GROUNDED_INSIGHTS.map((insight) => (
          <div key={insight.label} className="group relative">
            <div className="flex items-start gap-3 px-3 py-2.5 rounded-[4px] hover:bg-surface transition-colors cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-copper mt-2 shrink-0" />
              <div className="flex-1">
                <span className="text-[15px] text-text">{insight.label}</span>
                <span className="text-[12px] text-faint ml-2">&#8220;{insight.quote.slice(0, 40)}...&#8221;</span>
              </div>
            </div>
            {/* Tooltip on hover */}
            <div className="absolute left-8 top-full z-20 hidden group-hover:block">
              <div className="mt-1 bg-text text-canvas text-[13px] px-4 py-3 rounded-[4px] max-w-[400px] shadow-lg">
                <span className="text-copper font-medium">Frau Müller:</span>
                <br />
                &#8220;{insight.quote}&#8221;
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowFull(!showFull)}
        className="mt-5 text-[14px] text-copper hover:text-copper-dark font-medium transition-colors"
      >
        {showFull ? "Transkript ausblenden ↑" : "Volles Transkript anzeigen ↓"}
      </button>

      {showFull && (
        <div className="mt-4 pt-4 border-t border-ghost-border max-h-[300px] overflow-y-auto space-y-3 pr-2">
          {transcript.split("\n\n").map((line, i) => {
            const isAgent = line.startsWith("Agent:");
            const speaker = isAgent ? "Agent" : "Frau Müller";
            const text = line.replace(/^(Agent|Frau Müller): ?/, "");
            return (
              <div key={i}>
                <span className={`text-[13px] font-medium ${isAgent ? "text-copper" : "text-muted"}`}>
                  {speaker}
                </span>
                <p className="text-[15px] text-text mt-0.5">{text}</p>
              </div>
            );
          })}
        </div>
      )}
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

function CriteriaSection({ criteria: initial }: { criteria: NonNullable<Client["searchCriteria"]> }) {
  const [criteria, setCriteria] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);

  const fields = [
    { key: "rooms_min", label: "Zimmer min", value: `${criteria.rooms_min}`, suffix: "+" },
    { key: "price_max", label: "Max Preis", value: `${(criteria.price_max / 1000).toFixed(0)}`, suffix: ".000 €" },
    { key: "commute_max_min", label: "Pendel max", value: `${criteria.commute_max_min}`, suffix: " Min" },
  ];

  const mustHaveLabels: Record<string, string> = { elevator: "Lift", balcony: "Balkon", altbau: "Altbau", school_nearby: "Schule nah" };

  function handleSave(key: string, rawValue: string) {
    const num = parseInt(rawValue, 10);
    if (isNaN(num)) { setEditing(null); return; }
    setCriteria((prev) => ({
      ...prev,
      [key]: key === "price_max" ? num * 1000 : num,
    }));
    setEditing(null);
  }

  return (
    <div className="bg-card rounded-[4px] p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-semibold text-text">Suchkriterien</h2>
        <span className="text-[12px] text-faint">Klicken zum Bearbeiten</span>
      </div>
      <p className="text-[13px] text-faint mb-4">Abgeleitet aus Klientenprofil</p>

      <div className="flex flex-wrap gap-2">
        {fields.map((f) => (
          <div key={f.key}>
            {editing === f.key ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-copper/10 text-[15px] font-medium text-text rounded-[4px] ring-2 ring-copper">
                <span className="text-[13px] text-muted">{f.label}:</span>
                <input
                  autoFocus
                  defaultValue={f.value}
                  className="w-16 bg-transparent outline-none text-copper font-bold text-center"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave(f.key, (e.target as HTMLInputElement).value);
                    if (e.key === "Escape") setEditing(null);
                  }}
                  onBlur={(e) => handleSave(f.key, e.target.value)}
                />
                <span className="text-muted">{f.suffix}</span>
              </span>
            ) : (
              <button
                onClick={() => setEditing(f.key)}
                className="px-3 py-1.5 bg-surface text-[15px] font-medium text-text rounded-[4px] hover:bg-copper/10 hover:text-copper transition-colors cursor-pointer"
              >
                {f.value}{f.suffix}
              </button>
            )}
          </div>
        ))}

        {/* Districts */}
        <span className="px-3 py-1.5 bg-surface text-[15px] font-medium text-text rounded-[4px]">
          Bezirke {criteria.districts.join(", ")}
        </span>

        {/* Must-haves */}
        {criteria.must_have.map((m) => (
          <span key={m} className="px-3 py-1.5 bg-signal-green/10 text-[15px] font-medium text-signal-green rounded-[4px]">
            {mustHaveLabels[m] || m} ✓
          </span>
        ))}

        {/* Nice-to-haves */}
        {criteria.nice_to_have.map((n) => (
          <span key={n} className="px-3 py-1.5 bg-surface text-[15px] text-muted rounded-[4px]">
            {mustHaveLabels[n] || n}
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
          {/* Transcript Summary with grounded quotes */}
          {client.transcript && <TranscriptSummary transcript={client.transcript} />}

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
                href="/curation"
                className="block w-full py-4 bg-copper text-white text-lg font-medium rounded-[4px] hover:bg-copper-dark transition-colors text-center"
              >
                Objekte kuratieren →
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  );
}
