"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SignalChip } from "@/components/signal-chip";
import type { PropertyValidated, PropertyRaw } from "@/types";
import fallbackRaw from "../../../fixtures/properties.json";

type Filter = "alle" | "empfohlen" | "signale";

function toValidated(raw: PropertyRaw): PropertyValidated {
  return {
    ...raw,
    features: { confidence: {} },
    nearby: { schools: [], transit: [], supermarkets: [] },
    intel: { signal_score: 0, signals: [], source_url: undefined },
    validation: { flags: [], sources: [], compliance_notes: [] },
  };
}

export function CurationClient() {
  const [properties, setProperties] = useState<PropertyValidated[]>([]);
  const [filter, setFilter] = useState<Filter>("alle");
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem("klar-properties");
      if (stored) {
        const parsed = JSON.parse(stored) as PropertyValidated[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProperties(parsed);
          return;
        }
      }
    } catch {
      // fall through
    }
    setProperties((fallbackRaw as PropertyRaw[]).map(toValidated));
  }, []);

  const filtered = properties.filter((p) => {
    if (filter === "empfohlen") return p.intel && p.intel.signal_score >= 3;
    if (filter === "signale")
      return (
        (p.intel && p.intel.signal_score > 0) ||
        (p.validation && p.validation.flags.length > 0)
      );
    return true;
  });

  const counts = {
    alle: properties.length,
    empfohlen: properties.filter((p) => p.intel && p.intel.signal_score >= 3)
      .length,
    signale: properties.filter(
      (p) =>
        (p.intel && p.intel.signal_score > 0) ||
        (p.validation && p.validation.flags.length > 0)
    ).length,
  };

  const tabs: { key: Filter; label: string }[] = [
    { key: "alle", label: "Alle" },
    { key: "empfohlen", label: "Empfohlen" },
    { key: "signale", label: "Mit Signalen" },
  ];

  function toggleShortlist(id: string) {
    setShortlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleReject(id: string) {
    setRejected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="max-w-[960px] mx-auto px-8 py-10">
      {/* Header */}
      <h1 className="text-[28px] font-semibold text-text">Kuration</h1>
      <p className="text-[15px] text-muted mt-1">
        {properties.length} Objekte fur Familie Muller &middot; Letzte Suche:
        vor 2 Stunden
      </p>

      {/* Filter Tabs */}
      <div className="flex gap-6 mt-8 border-b border-ghost-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`pb-2.5 text-[15px] font-medium transition-colors ${
              filter === t.key
                ? "text-copper border-b-2 border-copper -mb-px"
                : "text-muted hover:text-text"
            }`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {/* Property List */}
      <div className="mt-6 space-y-4">
        {filtered.map((p) => {
          const isShortlisted = shortlisted.has(p.id);
          const isRejected = rejected.has(p.id);

          return (
            <div
              key={p.id}
              className={`bg-card rounded-[4px] p-5 flex gap-5 transition-opacity ${
                isRejected ? "opacity-50" : ""
              }`}
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              {/* Image */}
              <div className="w-[120px] h-[120px] rounded-[4px] overflow-hidden flex-shrink-0 bg-surface">
                {p.images && p.images[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-faint text-sm">
                    Photo
                  </div>
                )}
              </div>

              {/* Center Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-[18px] font-medium text-text ${
                    isRejected ? "line-through" : ""
                  }`}
                >
                  {p.title}
                </h3>
                <p className="text-[14px] text-muted mt-0.5">
                  {p.address} &middot; {p.source}
                </p>
                <div className="flex items-baseline gap-2 mt-1.5 text-[15px] font-medium">
                  <span>
                    &euro;{p.price.toLocaleString("de-AT")}
                  </span>
                  <span className="text-muted">&middot;</span>
                  <span>{p.sqm} m&sup2;</span>
                  <span className="text-muted">&middot;</span>
                  <span>{p.rooms} Zi</span>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {p.features?.building_style && (
                    <span className="inline-block px-2 py-0.5 bg-surface text-text text-[13px] rounded-[4px]">
                      {p.features.building_style}
                    </span>
                  )}
                  {p.features?.orientation && (
                    <span className="inline-block px-2 py-0.5 bg-surface text-text text-[13px] rounded-[4px]">
                      {p.features.orientation}
                    </span>
                  )}
                  {p.features?.condition && (
                    <span className="inline-block px-2 py-0.5 bg-surface text-text text-[13px] rounded-[4px]">
                      {p.features.condition}
                    </span>
                  )}
                  {p.features?.balcony && (
                    <span className="inline-block px-2 py-0.5 bg-surface text-text text-[13px] rounded-[4px]">
                      Balkon
                    </span>
                  )}
                  {p.features?.elevator && (
                    <span className="inline-block px-2 py-0.5 bg-surface text-text text-[13px] rounded-[4px]">
                      Lift
                    </span>
                  )}
                </div>

                {/* Signal chips */}
                {p.intel &&
                  (p.intel.signal_score > 0 ||
                    (p.validation && p.validation.flags.length > 0)) && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {p.intel.signals.map((s) => (
                        <SignalChip
                          key={s}
                          variant={
                            p.intel!.signal_score >= 4
                              ? "red"
                              : p.intel!.signal_score >= 2
                              ? "amber"
                              : "gray"
                          }
                        >
                          {s}
                        </SignalChip>
                      ))}
                      {p.validation?.flags.map((f) => (
                        <SignalChip key={f} variant="amber">
                          {f}
                        </SignalChip>
                      ))}
                    </div>
                  )}

                {isShortlisted && (
                  <span className="inline-block mt-2 px-2.5 py-1 text-[13px] font-medium text-signal-green bg-signal-green/10 rounded-[4px]">
                    Vorgemerkt
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleShortlist(p.id)}
                  className={`px-4 py-2 text-[14px] font-medium rounded-[4px] transition-colors ${
                    isShortlisted
                      ? "bg-copper/10 text-copper border border-copper"
                      : "bg-copper text-white hover:bg-copper-dark"
                  }`}
                >
                  {isShortlisted ? "Gemerkt" : "Shortlist"}
                </button>
                <button
                  onClick={() => toggleReject(p.id)}
                  className={`px-4 py-2 text-[14px] font-medium rounded-[4px] border transition-colors ${
                    isRejected
                      ? "border-signal-red text-signal-red"
                      : "border-ghost-border text-muted hover:text-text hover:border-text"
                  }`}
                >
                  {isRejected ? "Zurucknehmen" : "Ablehnen"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-4 mt-10">
        <Link
          href="/comparison/live"
          className="inline-flex items-center px-6 py-3 bg-copper text-white text-[15px] font-medium rounded-[4px] hover:bg-copper-dark transition-colors"
        >
          Vergleichsgalerie erstellen &rarr;
        </Link>
        <button
          disabled
          className="px-6 py-3 border border-ghost-border text-muted text-[15px] font-medium rounded-[4px] opacity-50 cursor-not-allowed"
        >
          Als PDF exportieren
        </button>
      </div>
    </main>
  );
}
