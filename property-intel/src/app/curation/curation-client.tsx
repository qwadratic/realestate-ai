"use client";

import { useState, useEffect } from "react";
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("klar-properties");
      if (stored) {
        const parsed = JSON.parse(stored) as PropertyValidated[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProperties(parsed);
          // Auto-select all non-excluded
          setSelected(new Set(parsed.map((p) => p.id)));
          return;
        }
      }
    } catch {
      // fall through
    }
    const fallback = (fallbackRaw as PropertyRaw[]).map(toValidated);
    setProperties(fallback);
    setSelected(new Set(fallback.map((p) => p.id)));
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
    empfohlen: properties.filter((p) => p.intel && p.intel.signal_score >= 3).length,
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

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Remove from excluded if re-selecting
        setExcluded((ex) => {
          const ne = new Set(ex);
          ne.delete(id);
          return ne;
        });
      }
      return next;
    });
  }

  function toggleExclude(id: string) {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // Re-select when un-excluding
        setSelected((sel) => new Set([...sel, id]));
      } else {
        next.add(id);
        // Deselect when excluding
        setSelected((sel) => {
          const ns = new Set(sel);
          ns.delete(id);
          return ns;
        });
      }
      return next;
    });
  }

  // Generate comparison link with encoded property IDs
  function generateLink() {
    const selectedIds = [...selected];
    if (selectedIds.length === 0) return;

    // Store selected properties in localStorage for the comparison page
    const selectedProps = properties.filter((p) => selected.has(p.id));
    localStorage.setItem("klar-properties", JSON.stringify(selectedProps));

    // Encode IDs in URL
    const encoded = btoa(JSON.stringify(selectedIds));
    const url = `${window.location.origin}/comparison/share?p=${encoded}`;

    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });

    // Also open in new tab
    window.open(`/comparison/share?p=${encoded}`, "_blank");
  }

  const selectedCount = selected.size;

  return (
    <main className="max-w-[960px] mx-auto px-8 py-10">
      {/* Header */}
      <h1 className="text-[28px] font-semibold text-text">Kuration</h1>
      <p className="text-[15px] text-muted mt-1">
        {properties.length} Objekte fur Familie Muller &middot;{" "}
        <span className="text-copper font-medium">{selectedCount} ausgewahlt</span>
        {excluded.size > 0 && (
          <span className="text-signal-red"> &middot; {excluded.size} ausgeschlossen</span>
        )}
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
          const isSelected = selected.has(p.id);
          const isExcluded = excluded.has(p.id);

          return (
            <div
              key={p.id}
              className={`bg-card rounded-[4px] p-5 flex gap-5 transition-all ${
                isExcluded ? "opacity-40 scale-[0.98]" : ""
              } ${isSelected ? "ring-2 ring-copper/30" : ""}`}
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              {/* Selection checkbox */}
              <button
                onClick={() => toggleSelect(p.id)}
                className={`w-6 h-6 rounded-[4px] border-2 flex-shrink-0 mt-1 flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-copper border-copper text-white"
                    : "border-ghost-border hover:border-muted"
                }`}
              >
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>

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
                    isExcluded ? "line-through" : ""
                  }`}
                >
                  {p.title}
                </h3>
                <p className="text-[14px] text-muted mt-0.5">
                  {p.address} &middot; {p.source}
                </p>
                <div className="flex items-baseline gap-2 mt-1.5 text-[15px] font-medium">
                  <span>&euro;{p.price.toLocaleString("de-AT")}</span>
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
                      {p.intel.signals?.map((s) => (
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
              </div>

              {/* Exclude button */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleExclude(p.id)}
                  className={`px-4 py-2 text-[14px] font-medium rounded-[4px] border transition-colors ${
                    isExcluded
                      ? "border-signal-red text-signal-red bg-signal-red/5"
                      : "border-ghost-border text-muted hover:text-text hover:border-text"
                  }`}
                >
                  {isExcluded ? "Zurucknehmen" : "Ausschliessen"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 bg-canvas/95 backdrop-blur-sm py-6 mt-6 border-t border-ghost-border">
        <div className="flex items-center gap-4">
          <button
            onClick={generateLink}
            disabled={selectedCount === 0}
            className={`inline-flex items-center gap-2 px-6 py-3 text-[15px] font-medium rounded-[4px] transition-colors ${
              selectedCount > 0
                ? "bg-copper text-white hover:bg-copper-dark"
                : "bg-ghost-border text-muted cursor-not-allowed"
            }`}
          >
            {linkCopied ? (
              "Link kopiert!"
            ) : (
              <>
                Vergleich erstellen ({selectedCount}) &rarr;
              </>
            )}
          </button>
          <span className="text-[14px] text-muted">
            Offnet Vergleichsseite in neuem Tab &middot; Link wird kopiert
          </span>
        </div>
      </div>
    </main>
  );
}
