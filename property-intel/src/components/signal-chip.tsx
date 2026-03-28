type Variant = "red" | "amber" | "green" | "gray";

const colors: Record<Variant, string> = {
  red: "bg-signal-red text-white",
  amber: "bg-signal-amber text-white",
  green: "bg-signal-green text-white",
  gray: "bg-faint text-white",
};

export function SignalChip({
  variant,
  children,
}: {
  variant: Variant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[13px] font-medium uppercase tracking-wide rounded-[2px] ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

export function StatusDot({ variant }: { variant: Variant }) {
  const dotColors: Record<Variant, string> = {
    red: "bg-signal-red",
    amber: "bg-signal-amber",
    green: "bg-signal-green",
    gray: "bg-faint",
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${dotColors[variant]}`} />;
}
