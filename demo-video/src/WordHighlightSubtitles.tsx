import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { subtitleLines } from "./subtitleData";

// Words that carry the PRODUCT STORY for judges
const HIGH_IMPACT_WORDS = new Set([
  // Pain & problem
  "distracted", "lost", "customers", "manually", "hours",
  // Solution & value
  "instantly", "AI", "agent", "voice", "search", "platform",
  "assistant", "properties", "curates", "generates", "grounding",
  // Trust & credibility
  "real", "popular", "Austria", "listed",
  // Client experience
  "client", "profile", "link", "questions", "answer", "school",
  "appointment", "decision", "comfortable",
  // Story beats
  "solution", "sparked", "deal", "closed", "envision", "experience",
]);

function isHighImpact(word: string): boolean {
  const clean = word.toLowerCase().replace(/[.,!?;:—\-]/g, "");
  return HIGH_IMPACT_WORDS.has(clean);
}

export const WordHighlightSubtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find the active line
  const activeLine = subtitleLines.find(
    (line) => frame >= line.startFrame - 8 && frame <= line.endFrame + 15
  );

  if (!activeLine) return null;

  const containerOpacity = interpolate(
    frame,
    [
      activeLine.startFrame - 8,
      activeLine.startFrame,
      activeLine.endFrame,
      activeLine.endFrame + 15,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: containerOpacity,
        zIndex: 20,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.82)",
          padding: "32px 56px",
          borderRadius: 16,
          maxWidth: "88%",
          textAlign: "center",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {activeLine.words.map((w, i) => {
          const isActive = frame >= w.startFrame && frame <= w.endFrame;
          const isPast = frame > w.endFrame;
          const isImportant = isHighImpact(w.word);

          // Spring animation for active word
          const scale = isActive
            ? spring({
                frame: frame - w.startFrame,
                fps,
                config: { damping: 12, stiffness: 200, mass: 0.4 },
              })
            : 1;

          const activeScale = interpolate(scale, [0, 1], [1, 1.12]);

          // Color logic:
          // Active + important = bright copper with glow
          // Active + normal = white
          // Past + important = copper (persists)
          // Past + normal = white
          // Future = dim
          let color: string;
          let fontWeight: number;
          let textShadow = "none";

          if (isActive && isImportant) {
            color = "#F5A623";
            fontWeight = 800;
            textShadow = "0 0 24px rgba(245,166,35,0.6), 0 0 48px rgba(245,166,35,0.3)";
          } else if (isActive) {
            color = "#FFFFFF";
            fontWeight = 700;
            textShadow = "0 0 12px rgba(255,255,255,0.3)";
          } else if (isPast && isImportant) {
            color = "#F5A623";
            fontWeight = 700;
            textShadow = "0 0 8px rgba(245,166,35,0.2)";
          } else if (isPast) {
            color = "#FFFFFF";
            fontWeight = 500;
          } else {
            // Future words
            color = "rgba(255,255,255,0.35)";
            fontWeight = 400;
          }

          return (
            <span
              key={`${activeLine.startFrame}-${i}`}
              style={{
                fontSize: 56,
                lineHeight: 1.4,
                fontFamily:
                  "'SF Pro Display', 'Inter', system-ui, -apple-system, sans-serif",
                fontWeight,
                color,
                textShadow,
                marginRight: 10,
                display: "inline",
                transform: `scale(${activeScale})`,
                transformOrigin: "center bottom",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
