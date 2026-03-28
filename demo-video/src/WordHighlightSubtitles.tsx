import { useCurrentFrame, interpolate } from "remotion";
import { subtitleLines } from "./subtitleData";

const COPPER = "#B87333";

export const WordHighlightSubtitles: React.FC = () => {
  const frame = useCurrentFrame();

  // Find the active line
  const activeLine = subtitleLines.find(
    (line) => frame >= line.startFrame - 5 && frame <= line.endFrame + 10
  );

  if (!activeLine) return null;

  const containerOpacity = interpolate(
    frame,
    [activeLine.startFrame - 5, activeLine.startFrame, activeLine.endFrame, activeLine.endFrame + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
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
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          padding: "14px 28px",
          borderRadius: 8,
          maxWidth: "85%",
          textAlign: "center",
          backdropFilter: "blur(12px)",
        }}
      >
        {activeLine.words.map((w, i) => {
          const isActive = frame >= w.startFrame && frame <= w.endFrame;
          const isPast = frame > w.endFrame;

          return (
            <span
              key={`${activeLine.startFrame}-${i}`}
              style={{
                fontSize: 32,
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? COPPER : isPast ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                marginRight: 6,
                display: "inline",
                transition: "color 0.1s",
                ...(isActive
                  ? {
                      textShadow: `0 0 12px ${COPPER}80`,
                      transform: "scale(1.05)",
                    }
                  : {}),
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
