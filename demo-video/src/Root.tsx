import { Composition } from "remotion";
import { KlarDemo } from "./KlarDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KlarDemo"
      component={KlarDemo}
      durationInFrames={30 * 90}
      fps={30}
      width={1440}
      height={900}
    />
  );
};
