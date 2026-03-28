import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { WordHighlightSubtitles } from "./WordHighlightSubtitles";

export const KlarDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile("demo-cropped.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      <WordHighlightSubtitles />
    </AbsoluteFill>
  );
};
