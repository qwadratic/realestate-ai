import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
  interpolate,
  staticFile,
  spring,
  useVideoConfig,
} from "remotion";

const COPPER = "#B87333";
const BG = "#FAF9F6";
const TEXT = "#1A1C1A";

function TitleSlide({ title, subtitle }: { title: string; subtitle: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = spring({ frame, fps, config: { damping: 50 } }) * 30 - 30;
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Space Grotesk, system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: TEXT,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 28,
            color: COPPER,
            opacity: subtitleOpacity,
            marginTop: 16,
            fontWeight: 500,
          }}
        >
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
}

function TextOverlay({
  text,
  position = "bottom",
}: {
  text: string;
  position?: "bottom" | "top";
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        [position]: 40,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        zIndex: 10,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(26, 26, 26, 0.85)",
          color: "white",
          padding: "12px 32px",
          borderRadius: 4,
          fontSize: 24,
          fontFamily: "Space Grotesk, system-ui, sans-serif",
          fontWeight: 500,
          backdropFilter: "blur(8px)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function FeatureBadge({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 30 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        right: 30,
        backgroundColor: COPPER,
        color: "white",
        padding: "8px 20px",
        borderRadius: 4,
        fontSize: 18,
        fontFamily: "Space Grotesk, system-ui, sans-serif",
        fontWeight: 600,
        transform: `scale(${scale})`,
        zIndex: 10,
      }}
    >
      {text}
    </div>
  );
}

export const KlarDemo: React.FC = () => {
  const fps = 30;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Intro */}
      <Sequence from={0} durationInFrames={fps * 4}>
        <TitleSlide title="Klar" subtitle="Property Intelligence for Austrian Real Estate" />
      </Sequence>

      {/* Problem statement */}
      <Sequence from={fps * 4} durationInFrames={fps * 4}>
        <TitleSlide
          title="5-6 Stunden pro Suchauftrag"
          subtitle="Austrian agents search 3 portals manually. We automate everything."
        />
      </Sequence>

      {/* Demo video starts */}
      <Sequence from={fps * 8} durationInFrames={fps * 72}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile("klar-demo-recording.webm")}
            style={{ width: "100%", height: "100%" }}
            playbackRate={1.8}
          />
        </AbsoluteFill>

        {/* Overlay: Dashboard */}
        <Sequence from={0} durationInFrames={fps * 4}>
          <TextOverlay text="Dashboard — Client triage view" />
          <FeatureBadge text="6 SCREENS" />
        </Sequence>

        {/* Overlay: Client detail */}
        <Sequence from={fps * 5} durationInFrames={fps * 4}>
          <TextOverlay text="Call transcript → AI-distilled profile → Search criteria" />
          <FeatureBadge text="AI EXTRACTION" />
        </Sequence>

        {/* Overlay: Pipeline */}
        <Sequence from={fps * 12} durationInFrames={fps * 6}>
          <TextOverlay text="3 portals × AI feature extraction × Exa intelligence × Compliance check" />
          <FeatureBadge text="PIPELINE" />
        </Sequence>

        {/* Overlay: Results */}
        <Sequence from={fps * 20} durationInFrames={fps * 4}>
          <TextOverlay text="Signal intelligence — insolvency, compliance, motivated sellers" />
          <FeatureBadge text="SIGNALS" />
        </Sequence>

        {/* Overlay: Curation */}
        <Sequence from={fps * 26} durationInFrames={fps * 4}>
          <TextOverlay text="Agent curates: shortlist or reject with reasoning" />
          <FeatureBadge text="CURATION" />
        </Sequence>

        {/* Overlay: Comparison */}
        <Sequence from={fps * 32} durationInFrames={fps * 6}>
          <TextOverlay text='Shareable client gallery — "Why this matches your profile"' />
          <FeatureBadge text="COMPARISON" />
        </Sequence>

        {/* Overlay: Chat */}
        <Sequence from={fps * 40} durationInFrames={fps * 4}>
          <TextOverlay text="AI agent with 10 tools — Maps, Exa, compliance validation" />
          <FeatureBadge text="AGENT" />
        </Sequence>

        {/* Overlay: Email */}
        <Sequence from={fps * 48} durationInFrames={fps * 4}>
          <TextOverlay text="AI-prioritized inbox with suggested responses" />
          <FeatureBadge text="EMAIL AI" />
        </Sequence>

        {/* Overlay: Voice */}
        <Sequence from={fps * 56} durationInFrames={fps * 4}>
          <TextOverlay text="Voice assistant for hands-free property Q&A" />
          <FeatureBadge text="VOICE" />
        </Sequence>
      </Sequence>

      {/* Outro: Tech stack */}
      <Sequence from={fps * 80} durationInFrames={fps * 5}>
        <TitleSlide
          title="Built with"
          subtitle="Next.js · Claude Sonnet 4 · Google Maps · Exa Websets · Apify"
        />
      </Sequence>

      {/* Outro: CTA */}
      <Sequence from={fps * 85} durationInFrames={fps * 5}>
        <TitleSlide
          title="Klar"
          subtitle="AI for advising, not just browsing. — KaiserTech"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
