import { Composition } from "remotion";
import { KlarDemo } from "./KlarDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KlarDemo"
      component={KlarDemo}
      durationInFrames={5370}
      fps={30}
      width={4076}
      height={2298}
    />
  );
};
