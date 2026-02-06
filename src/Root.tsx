import React from 'react';
import { Composition } from 'remotion';
import { z } from 'zod';
import { HomeRowVideo } from './HomeRowVideo';

// Schema for input props (Remotion Studio sliders)
const homeRowSchema = z.object({
  leftHandX: z.number(),
  leftHandY: z.number(),
  rightHandX: z.number(),
  rightHandY: z.number(),
  handScale: z.number(),
  contentOffsetY: z.number(),
  lottieSize: z.number(),
  lottieX: z.number(),
  lottieY: z.number(),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HomeRow"
        component={HomeRowVideo}
        durationInFrames={36 * 24}  // 36 seconds at 24fps
        fps={24}
        width={1920}
        height={1080}
        schema={homeRowSchema}
        defaultProps={{
          leftHandX: -150,
          leftHandY: 0,
          rightHandX: 720,
          rightHandY: 60,
          handScale: 1,
          contentOffsetY: -40,
          lottieSize: 200,
          lottieX: 50,
          lottieY: 800,
        }}
      />
    </>
  );
};
