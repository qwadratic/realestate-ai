"use client";

import { useState } from "react";
import { FeedItem } from "@/components/feed-item";
import { usePipeline } from "@/lib/use-pipeline";

const STAGE_LABELS: Record<string, string> = {
  searching: "Scanning portals...",
  extracting: "Extracting features with AI...",
  enriching: "Looking up signals & nearby places...",
  validating: "Checking compliance...",
  complete: "Done",
};

export function FeedClient() {
  const pipeline = usePipeline();
  const [hasRun, setHasRun] = useState(false);

  const handleRunPipeline = () => {
    setHasRun(true);
    pipeline.run();
  };

  // Store results for comparison page
  if (pipeline.properties.length > 0 && typeof window !== "undefined") {
    localStorage.setItem("klar-properties", JSON.stringify(pipeline.properties));
  }

  return (
    <main className="flex-1 max-w-[960px] mx-auto w-full px-8 py-10">
      {/* Pipeline trigger */}
      {!hasRun && (
        <div className="bg-card rounded-[4px] p-6 mb-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <p className="text-lg font-medium text-text mb-1">Run Intelligence Pipeline</p>
          <p className="text-[15px] text-muted mb-4">
            Analyze 6 Vienna properties — extract features, lookup signals, validate compliance.
          </p>
          <button
            onClick={handleRunPipeline}
            className="px-5 py-2.5 bg-copper text-white text-[15px] font-medium rounded-[4px] hover:bg-copper-dark transition-colors"
          >
            Start Pipeline
          </button>
        </div>
      )}

      {/* Pipeline progress */}
      {pipeline.running && pipeline.stage && (
        <div className="bg-card rounded-[4px] p-6 mb-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-copper animate-pulse" />
            <p className="text-lg font-medium text-text">
              {STAGE_LABELS[pipeline.stage] || pipeline.stage}
            </p>
          </div>
          {pipeline.detail && (
            <p className="text-[15px] text-muted mt-1 ml-6">{pipeline.detail}</p>
          )}
          {/* Stage progress bar */}
          <div className="flex gap-1 mt-4">
            {["searching", "extracting", "enriching", "validating"].map((s) => {
              const stages = ["searching", "extracting", "enriching", "validating"];
              const currentIdx = stages.indexOf(pipeline.stage || "");
              const thisIdx = stages.indexOf(s);
              return (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    thisIdx <= currentIdx ? "bg-copper" : "bg-ghost-border"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Pipeline results */}
      {pipeline.stage === "complete" && pipeline.properties.length > 0 && (
        <div className="bg-card rounded-[4px] p-6 mb-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <p className="text-lg font-medium text-text mb-1">
            Pipeline complete — {pipeline.properties.length} properties analyzed
          </p>
          <p className="text-[15px] text-muted mb-3">
            {pipeline.properties.filter((p) => p.intel && p.intel.signal_score > 0).length} with signals ·{" "}
            {pipeline.properties.filter((p) => p.validation.flags.length > 0).length} with compliance flags
          </p>
          <a
            href="/comparison/live"
            className="inline-block px-5 py-2.5 bg-copper text-white text-[15px] font-medium rounded-[4px] hover:bg-copper-dark transition-colors"
          >
            View Comparison Gallery →
          </a>
        </div>
      )}

      {pipeline.error && (
        <div className="bg-card rounded-[4px] p-6 mb-6 border-l-2 border-signal-red" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <p className="text-lg font-medium text-signal-red">Pipeline Error</p>
          <p className="text-[15px] text-muted mt-1">{pipeline.error}</p>
        </div>
      )}

      {/* Static feed items (demo data) */}
      <p className="text-[15px] font-medium text-muted uppercase tracking-wider mb-4">
        Today — 3 actions needed
      </p>

      <div className="space-y-3">
        <FeedItem
          variant="urgent"
          chipLabel="New Inquiry"
          title="Herr Weber · 3-Zi Bezirk 3 · €350,000"
          subtitle="AI drafted response · 3 matching properties found"
          timestamp="10:42"
          actions={[
            { label: "Respond", primary: true },
            { label: "Create Profile" },
          ]}
        />
        <FeedItem
          variant="signal"
          chipLabel="Signal Alert"
          title="Penthouse Praterstern · Müller Family"
          subtitle="Owner insolvency filed · Signal 3/5 · Highly motivated seller"
          copperBorder
          signals={[
            { label: "Insolvency", variant: "red" },
            { label: "Motivated Seller", variant: "amber" },
          ]}
          actions={[
            { label: "Call Client", primary: true },
            { label: "View Property" },
          ]}
        />
        <FeedItem
          variant="match"
          chipLabel="12 New Matches"
          title="Müller Family · Last scan 2h ago"
          subtitle="5 recommended · 2 with signals · 4 need review"
          actions={[
            { label: "Curate", primary: true },
            { label: "Auto-Shortlist" },
          ]}
        />
      </div>

      <p className="text-[15px] font-medium text-muted uppercase tracking-wider mt-8 mb-4">
        Yesterday
      </p>

      <div className="space-y-3">
        <FeedItem
          variant="done"
          chipLabel="Sent"
          title="Comparison page · Müller Family · 3 properties"
          subtitle="Opened 2x · Client spent 4min on Landstraße listing"
          muted
        />
        <FeedItem
          variant="done"
          chipLabel="Confirmed"
          title="Herr Schmidt · Viewing Fri 14:00 · Josefstädter Str. 71"
          subtitle="Generalsaniert in Josefstadt · €375,000"
          muted
        />
        <FeedItem
          variant="low"
          chipLabel="Low"
          title="8 low-priority matches across 3 clients"
          subtitle="Spread across Bezirke 10, 15, 21"
          muted
          actions={[{ label: "Review Later" }]}
        />
      </div>
    </main>
  );
}
