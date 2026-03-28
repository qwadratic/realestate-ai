"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { SignalChip } from "@/components/signal-chip";
import emails from "../../../../fixtures/emails.json";

type Priority = "urgent" | "signal" | "new" | "normal" | "low";

const priorityVariant: Record<Priority, "red" | "amber" | "green" | "gray"> = {
  urgent: "red",
  signal: "amber",
  new: "green",
  normal: "gray",
  low: "gray",
};

function actionSuggestions(priority: Priority): string[] {
  switch (priority) {
    case "urgent":
      return [
        "Sofort antworten",
        "Termin im Kalender eintragen",
        "Klient benachrichtigen",
      ];
    case "signal":
      return [
        "Signal an Klient weiterleiten",
        "Objekt in Watchlist aufnehmen",
        "Grundbuchauszug anfordern",
      ];
    case "new":
      return [
        "Klientenprofil erstellen",
        "Erstgespräch vereinbaren",
        "Passende Objekte suchen",
      ];
    case "low":
      return ["Zur Kenntnis nehmen", "Archivieren"];
    default:
      return ["Antworten", "Weiterleiten"];
  }
}

export function EmailDetailClient({ emailId }: { emailId: string }) {
  const email = emails.find((e) => e.id === emailId);

  if (!email) {
    return (
      <>
        <Nav />
        <main className="flex-1 max-w-[1200px] mx-auto w-full px-8 py-10">
          <Link
            href="/email"
            className="text-[15px] text-copper hover:underline"
          >
            &larr; Posteingang
          </Link>
          <p className="text-lg text-muted mt-8">E-Mail nicht gefunden</p>
        </main>
      </>
    );
  }

  const prio = email.priority as Priority;
  const actions = actionSuggestions(prio);

  return (
    <>
      <Nav />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-8 py-10">
        <div className="flex gap-8">
          {/* Left column — 60% */}
          <div className="w-[60%] min-w-0">
            <Link
              href="/email"
              className="text-[15px] text-copper hover:underline inline-block mb-4"
            >
              &larr; Posteingang
            </Link>

            <div className="mb-3">
              <SignalChip variant={priorityVariant[prio]}>
                {email.aiLabel}
              </SignalChip>
            </div>

            <h1 className="text-[24px] font-semibold text-text mb-2">
              {email.subject}
            </h1>

            <p className="text-[15px] text-muted">Von: {email.from}</p>
            <p className="text-[13px] text-faint">
              Datum: {email.date}, {email.time}
            </p>
            {email.client && (
              <p className="text-[13px] text-copper mt-1">
                Klient: {email.client}
              </p>
            )}

            {/* Divider */}
            <div className="h-px bg-surface w-full my-5" />

            {/* Body */}
            <div className="text-[15px] text-text whitespace-pre-wrap leading-relaxed">
              {email.body}
            </div>

            {/* Suggested response */}
            {email.suggestedResponse && (
              <div className="bg-surface rounded-[4px] p-6 mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-copper text-sm">&#10024;</span>
                  <h2 className="text-[18px] font-medium text-text">
                    KI-Antwortvorschlag
                  </h2>
                </div>
                <div className="text-[15px] text-text whitespace-pre-wrap leading-relaxed mb-5">
                  {email.suggestedResponse}
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2.5 bg-copper text-white text-[15px] font-medium rounded-[4px] hover:bg-copper-dark transition-colors">
                    Antwort senden
                  </button>
                  <button className="px-5 py-2.5 text-[15px] font-medium text-muted rounded-[4px] border border-ghost-border hover:bg-surface transition-colors">
                    Bearbeiten
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right column — 40% */}
          <div className="w-[40%]">
            <div className="bg-surface rounded-[4px] p-6 sticky top-24">
              <h2 className="text-[18px] font-medium text-text mb-4">
                KI-Analyse
              </h2>

              <div className="space-y-4">
                {/* Priority */}
                <div>
                  <p className="text-[14px] font-medium text-muted mb-1">
                    Priorität
                  </p>
                  <SignalChip variant={priorityVariant[prio]}>
                    {prio.charAt(0).toUpperCase() + prio.slice(1)}
                  </SignalChip>
                </div>

                {/* AI Label */}
                <div>
                  <p className="text-[14px] font-medium text-muted mb-1">
                    KI-Einschätzung
                  </p>
                  <p className="text-[15px] text-text">{email.aiLabel}</p>
                </div>

                {/* Client */}
                {email.client && (
                  <div>
                    <p className="text-[14px] font-medium text-muted mb-1">
                      Zugeordneter Klient
                    </p>
                    <p className="text-[15px] text-copper underline cursor-pointer">
                      {email.client}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div>
                  <p className="text-[14px] font-medium text-muted mb-2">
                    Empfohlene Aktionen
                  </p>
                  <ul className="space-y-1.5">
                    {actions.map((action) => (
                      <li key={action}>
                        <button className="text-[15px] text-copper hover:underline text-left">
                          {action}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
