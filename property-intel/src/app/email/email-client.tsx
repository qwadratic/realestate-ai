"use client";

import { useState } from "react";
import Link from "next/link";
import { SignalChip, StatusDot } from "@/components/signal-chip";
import emails from "../../../fixtures/emails.json";

type Priority = "urgent" | "signal" | "new" | "normal" | "low";

const priorityVariant: Record<Priority, "red" | "amber" | "green" | "gray"> = {
  urgent: "red",
  signal: "amber",
  new: "green",
  normal: "gray",
  low: "gray",
};

const dotVariant: Record<Priority, "red" | "amber" | "green" | "gray" | null> = {
  urgent: "red",
  signal: "amber",
  new: "green",
  normal: null,
  low: "gray",
};

type Filter = "all" | "urgent" | "signal" | "new";

const totalCount = emails.length;
const urgentCount = emails.filter((e) => e.priority === "urgent").length;
const signalCount = emails.filter((e) => e.priority === "signal").length;
const newCount = emails.filter((e) => e.priority === "new").length;
const unreadCount = emails.filter((e) => !e.read).length;

const filters: { key: Filter; label: string; count: number }[] = [
  { key: "all", label: "Alle", count: totalCount },
  { key: "urgent", label: "Dringend", count: urgentCount },
  { key: "signal", label: "Signale", count: signalCount },
  { key: "new", label: "Neue Anfragen", count: newCount },
];

function senderName(email: (typeof emails)[0]) {
  const addr = email.from;
  // Extract name from email prefix
  const prefix = addr.split("@")[0];
  // Common patterns: firstname.lastname, noreply, etc
  if (prefix === "noreply" || prefix === "termin" || prefix === "rechtsanwalt" || prefix === "immobilien") {
    return addr.split("@")[1].replace(/\.\w+$/, "");
  }
  return prefix
    .split(".")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function EmailClient() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filtered =
    activeFilter === "all"
      ? emails
      : emails.filter((e) => e.priority === activeFilter);

  return (
    <main className="flex-1 max-w-[960px] mx-auto w-full px-8 py-10">
      <h1 className="text-[28px] font-semibold text-text">Posteingang</h1>
      <p className="text-[15px] text-muted mt-1 mb-6">
        {totalCount} E-Mails &middot; {unreadCount} ungelesen &middot;{" "}
        {signalCount} Signal
      </p>

      {/* Filter tabs */}
      <div className="flex items-center gap-6 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`pb-2 text-[15px] font-medium transition-colors ${
              activeFilter === f.key
                ? "text-copper border-b-2 border-copper"
                : "text-muted hover:text-text"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Email list */}
      <div
        className="bg-card rounded-[4px] divide-y divide-ghost-border"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
      >
        {filtered.map((email) => {
          const unread = !email.read;
          const prio = email.priority as Priority;
          const dot = dotVariant[prio];
          const name = senderName(email);

          return (
            <Link
              key={email.id}
              href={`/email/${email.id}`}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-surface/50 transition-colors ${
                unread ? "border-l-2 border-copper" : "border-l-2 border-transparent"
              }`}
            >
              {/* Priority dot */}
              <div className="w-3 flex-shrink-0 flex justify-center">
                {dot && <StatusDot variant={dot} />}
              </div>

              {/* AI label chip */}
              <div className="flex-shrink-0">
                <SignalChip variant={priorityVariant[prio]}>
                  {email.aiLabel}
                </SignalChip>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-[15px] ${
                      unread ? "font-semibold text-text" : "font-medium text-text"
                    }`}
                  >
                    {name}
                  </span>
                  <span
                    className={`text-[15px] truncate ${
                      unread ? "font-semibold text-text" : "font-normal text-text"
                    }`}
                  >
                    {email.subject}
                  </span>
                </div>
                <p className="text-[13px] text-muted truncate mt-0.5">
                  {email.preview}
                  {email.client && (
                    <span className="text-faint"> &middot; {email.client}</span>
                  )}
                </p>
              </div>

              {/* Time */}
              <div className="flex-shrink-0 text-[13px] text-faint whitespace-nowrap">
                {email.date === "Heute" ? email.time : email.date}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
