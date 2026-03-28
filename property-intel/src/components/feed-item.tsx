import { SignalChip, StatusDot } from "./signal-chip";

type FeedItemVariant = "urgent" | "signal" | "match" | "done" | "low";

interface FeedItemProps {
  variant: FeedItemVariant;
  chipLabel: string;
  title: string;
  subtitle: string;
  timestamp?: string;
  actions?: { label: string; primary?: boolean }[];
  signals?: { label: string; variant: "red" | "amber" | "green" }[];
  copperBorder?: boolean;
  muted?: boolean;
}

const chipMap: Record<FeedItemVariant, "red" | "amber" | "green" | "gray"> = {
  urgent: "red",
  signal: "amber",
  match: "amber",
  done: "green",
  low: "gray",
};

const dotMap = chipMap;

export function FeedItem({
  variant,
  chipLabel,
  title,
  subtitle,
  timestamp,
  actions,
  signals,
  copperBorder,
  muted,
}: FeedItemProps) {
  return (
    <div
      className={`bg-card rounded-[4px] p-6 ${
        copperBorder ? "border-l-2 border-copper" : ""
      } ${muted ? "opacity-80" : ""}`}
      style={
        !copperBorder
          ? { boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }
          : { boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <StatusDot variant={dotMap[variant]} />
            <SignalChip variant={chipMap[variant]}>{chipLabel}</SignalChip>
            {timestamp && (
              <span className="text-sm text-faint ml-auto">{timestamp}</span>
            )}
          </div>
          <p
            className={`text-lg font-medium ${
              muted ? "text-muted line-through" : "text-text"
            }`}
          >
            {title}
          </p>
          <p className="text-[15px] text-muted mt-1">{subtitle}</p>
          {signals && signals.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {signals.map((s) => (
                <SignalChip key={s.label} variant={s.variant}>
                  {s.label}
                </SignalChip>
              ))}
            </div>
          )}
        </div>
        {actions && actions.length > 0 && (
          <div className="flex gap-2 shrink-0 mt-1">
            {actions.map((a) => (
              <button
                key={a.label}
                className={`px-4 py-2 text-[15px] font-medium rounded-[4px] transition-colors ${
                  a.primary
                    ? "bg-copper text-white hover:bg-copper-dark"
                    : "text-text border border-ghost-border hover:bg-surface"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
