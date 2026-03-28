"use client";

import Link from "next/link";
import { FeedItem } from "@/components/feed-item";
import { SignalChip, StatusDot } from "@/components/signal-chip";
import type { Client } from "@/types";
import clients from "../../fixtures/clients.json";

const statusColors: Record<string, "green" | "amber" | "red"> = {
  active: "green",
  viewing: "amber",
  new: "red",
};

function ClientCard({ client }: { client: Client }) {
  const isActive = client.status === "active";
  return (
    <Link href={`/clients/${client.id}`}>
      <div
        className={`bg-card rounded-[4px] p-6 transition-colors hover:bg-surface cursor-pointer ${
          isActive ? "border-l-2 border-copper" : ""
        }`}
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[4px] bg-surface flex items-center justify-center text-base font-medium text-muted shrink-0">
            {client.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusDot variant={statusColors[client.status] || "gray"} />
              <span className="text-lg font-medium text-text">
                {client.name}
              </span>
              <SignalChip variant={statusColors[client.status] || "gray"}>
                {client.statusLabel}
              </SignalChip>
            </div>
            <p className="text-[15px] text-muted">{client.summary}</p>
            <p className="text-[13px] text-faint mt-1">
              {client.lastActivity}
            </p>
          </div>
          <span className="text-muted text-lg">→</span>
        </div>
      </div>
    </Link>
  );
}

export function FeedClient() {
  return (
    <main className="flex-1 max-w-[960px] mx-auto w-full px-8 py-10">
      <p className="text-[15px] font-medium text-muted uppercase tracking-wider mb-4">
        Ihre Klienten
      </p>

      <div className="space-y-3 mb-10">
        {(clients as Client[]).map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      <p className="text-[15px] font-medium text-muted uppercase tracking-wider mb-4">
        Letzte Aktivitäten
      </p>

      <div className="space-y-3">
        <FeedItem
          variant="urgent"
          chipLabel="Neue Anfrage"
          title="Frau Weber · 3-Zi Bezirk 3 · €350.000"
          subtitle="KI-Antwort erstellt · 3 passende Objekte gefunden"
          timestamp="10:42"
          actions={[
            { label: "Antworten", primary: true },
            { label: "Profil erstellen" },
          ]}
        />
        <FeedItem
          variant="signal"
          chipLabel="Signal"
          title="Insolvenzverfahren — Taborstraße 18, 1020 Wien"
          subtitle="Donau Immobilien GmbH · Aktenzeichen 3S 42/26 · Betrifft Penthouse Praterstern"
          copperBorder
          signals={[
            { label: "Insolvenz", variant: "red" },
            { label: "Verhandlungsspielraum", variant: "amber" },
          ]}
          actions={[{ label: "Details", primary: true }]}
        />
        <FeedItem
          variant="done"
          chipLabel="Bestätigt"
          title="Herr Schmidt · Besichtigung Fr 14:00 · Josefstädter Str. 71"
          subtitle="Generalsaniert in Josefstadt · €375.000"
          muted
        />
        <FeedItem
          variant="low"
          chipLabel="Info"
          title="Marktbericht Q1 2026 — Wien Wohnungsmarkt"
          subtitle="Preisrückgang 2,3% · Altbau stabil · 3-4 Zi Nachfrage steigt"
          muted
        />
      </div>
    </main>
  );
}
