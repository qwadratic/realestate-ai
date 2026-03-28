import { SignalChip } from "./signal-chip";

interface MatchFeature {
  label: string;
  score: number; // 1-5
}

interface PropertyCardProps {
  title: string;
  address: string;
  source: string;
  price: number;
  sqm: number;
  sqmVerified?: number;
  rooms: number;
  floor?: string;
  image?: string;
  features: MatchFeature[];
  signals?: { label: string; variant: "red" | "amber" | "green" }[];
  signalScore?: number;
  agentNote?: string;
  recommended?: boolean;
  complianceFlag?: string;
}

function RelevanceDots({ score }: { score: number }) {
  return (
    <span className="inline-flex gap-0.5 ml-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= score ? "bg-copper" : "bg-ghost-border"
          }`}
        />
      ))}
    </span>
  );
}

export function PropertyCard({
  title,
  address,
  source,
  price,
  sqm,
  sqmVerified,
  rooms,
  floor,
  image,
  features,
  signals,
  signalScore,
  agentNote,
  recommended,
  complianceFlag,
}: PropertyCardProps) {
  return (
    <div
      className={`bg-card rounded-[4px] overflow-hidden flex flex-col ${
        recommended ? "border-t-2 border-copper" : ""
      }`}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      {recommended && (
        <div className="px-4 pt-2">
          <span className="text-[13px] font-medium text-copper uppercase tracking-wider">
            Empfohlen
          </span>
        </div>
      )}

      <div className="aspect-[16/10] bg-surface relative">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-faint text-sm">
            Photo
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-medium text-text">{title}</h3>
        <p className="text-[15px] text-muted mt-1">
          {address} · {source}
        </p>
        <div className="flex items-baseline gap-2 mt-2.5 text-[16px] font-medium">
          <span>€{price.toLocaleString("de-AT")}</span>
          <span className="text-muted">·</span>
          {sqmVerified ? (
            <>
              <span className="line-through text-faint">{sqm} m²</span>
              <span className="text-signal-red font-medium">
                {sqmVerified} m² verified
              </span>
            </>
          ) : (
            <span>{sqm} m²</span>
          )}
          <span className="text-muted">·</span>
          <span>{rooms} Zi</span>
          {floor && (
            <>
              <span className="text-muted">·</span>
              <span>{floor}</span>
            </>
          )}
        </div>

        {features.length > 0 && (
          <div className="mt-4 pt-4 bg-surface -mx-5 px-5 pb-4">
            <p className="text-[15px] font-medium text-copper mb-2.5">
              Warum es passt
            </p>
            <div className="space-y-1.5">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center text-[15px] text-text"
                >
                  <span className="flex-1">{f.label}</span>
                  <RelevanceDots score={f.score} />
                </div>
              ))}
            </div>
          </div>
        )}

        {signals && signals.length > 0 && !signals.every((s) => s.label.startsWith("Keine Signale") || s.label.startsWith("No distress")) && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {signals.filter((s) => !s.label.startsWith("Keine Signale") && !s.label.startsWith("No distress")).map((s) => (
              <SignalChip key={s.label} variant={s.variant}>
                {s.label}
              </SignalChip>
            ))}
          </div>
        )}

        {complianceFlag && (
          <div className="mt-2">
            <SignalChip variant="red">{complianceFlag}</SignalChip>
          </div>
        )}

        {agentNote && (
          <p className="text-[15px] italic text-muted mt-3">{agentNote}</p>
        )}
      </div>
    </div>
  );
}
