import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  Audio,
  Img,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Quicksand';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Keyboard } from './Keyboard';
import {
  homeRowScript,
  getCurrentScene,
  getHighlightedKeys,
  getActiveKeyPress,
} from './script';
import { KEY_TO_IMAGE, RESTING_HANDS } from './hand-mapping';

// Load Quicksand font
const { fontFamily } = loadFont();

// Get the correct hand images based on highlighted keys
const getHandImages = (highlightedKeys: string[]): { leftImage: string; rightImage: string } => {
  let leftImage = RESTING_HANDS.left;
  let rightImage = RESTING_HANDS.right;
  
  // Find which keys are highlighted and get the corresponding images
  for (const key of highlightedKeys) {
    const keyUpper = key.toUpperCase();
    const mapping = KEY_TO_IMAGE[keyUpper] || KEY_TO_IMAGE[key];
    
    if (mapping) {
      if (mapping.side === 'left') {
        leftImage = mapping.file;
      } else {
        rightImage = mapping.file;
      }
    }
  }
  
  return { leftImage, rightImage };
};

// Input props for live adjustment in Remotion Studio
export const homeRowSchema = {
  leftHandX: { type: 'number', default: -150 },
  leftHandY: { type: 'number', default: 0 },
  rightHandX: { type: 'number', default: 720 },
  rightHandY: { type: 'number', default: 60 },
  handScale: { type: 'number', default: 1 },
  contentOffsetY: { type: 'number', default: -40 },
  lottieSize: { type: 'number', default: 200 },
  lottieX: { type: 'number', default: 50 },
  lottieY: { type: 'number', default: 800 },
};

interface HomeRowProps {
  leftHandX?: number;
  leftHandY?: number;
  rightHandX?: number;
  rightHandY?: number;
  handScale?: number;
  contentOffsetY?: number;
  lottieSize?: number;
  lottieX?: number;
  lottieY?: number;
}

export const HomeRowVideo: React.FC<HomeRowProps> = ({
  leftHandX: leftHandXProp = -150,
  leftHandY: leftHandYProp = 0,
  rightHandX: rightHandXProp = 720,
  rightHandY: rightHandYProp = 60,
  handScale: handScaleProp = 1,
  contentOffsetY: contentOffsetYProp = -40,
  lottieSize: lottieSizeProp = 200,
  lottieX: lottieXProp = 50,
  lottieY: lottieYProp = 800,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const currentScene = getCurrentScene(homeRowScript, frame, fps);
  const highlightedKeys = getHighlightedKeys(currentScene);
  
  // Get the currently pressed key (timed to audio)
  const activeKey = getActiveKeyPress(currentScene, frame, fps);
  
  // Get correct hand images - use active key press if any, otherwise resting
  const { leftImage, rightImage } = activeKey 
    ? getHandImages([activeKey])
    : { leftImage: RESTING_HANDS.left, rightImage: RESTING_HANDS.right };
  
  // Background gradient animation
  const bgHue = interpolate(frame, [0, fps * 44], [200, 220], {
    extrapolateRight: 'clamp',
  });
  
  // Keyboard fills most of the frame - using new keyboard image (1598x686)
  const keyboardWidth = width * 0.83;
  const keyboardX = (width - keyboardWidth) / 2;
  const keyboardY = height * 0.05;
  
  // Hand scale and positions - from props for live adjustment
  const handScale = handScaleProp;
  const leftHandX = leftHandXProp;
  const leftHandY = leftHandYProp;
  const rightHandX = rightHandXProp;
  const rightHandY = rightHandYProp;
  
  // Calculate scaled hand dimensions
  const scaledHandWidth = 1188 * handScale; // @2x image width
  
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, hsl(${bgHue}, 70%, 55%) 0%, hsl(${bgHue + 10}, 60%, 45%) 100%)`,
      }}
    >
      {/* Title card - first 2 seconds */}
      {frame < fps * 2 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              color: 'white',
              fontSize: 80,
              fontFamily,
              fontWeight: 700,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              opacity: interpolate(frame, [0, fps * 0.5, fps * 1.5, fps * 2], [0, 1, 1, 0]),
            }}
          >
            The Home Row
          </h1>
        </AbsoluteFill>
      )}
      
      {/* Main content - after title */}
      {frame >= fps * 2 && (
        <>
          {/* Keyboard */}
          <div
            style={{
              position: 'absolute',
              left: keyboardX,
              top: keyboardY + contentOffsetYProp,
            }}
          >
            <Keyboard
              width={keyboardWidth}
            />
          </div>
          
          {/* Left Hand */}
          <img
            src={staticFile(`hands/${leftImage}`)}
            alt="left hand"
            style={{
              position: 'absolute',
              left: leftHandX,
              top: leftHandY + contentOffsetYProp,
              width: scaledHandWidth,
              height: 'auto',
              pointerEvents: 'none',
            }}
          />
          
          {/* Right Hand */}
          <img
            src={staticFile(`hands/${rightImage}`)}
            alt="right hand"
            style={{
              position: 'absolute',
              left: rightHandX,
              top: rightHandY + contentOffsetYProp,
              width: scaledHandWidth,
              height: 'auto',
              pointerEvents: 'none',
            }}
          />
          
          {/* Caption */}
          {currentScene && (
            <div
              style={{
                position: 'absolute',
                bottom: 60,
                left: 0,
                right: 0,
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  color: 'white',
                  fontSize: 32,
                  fontFamily,
                  fontWeight: 500,
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  margin: 0,
                  padding: '0 100px',
                  lineHeight: 1.4,
                }}
              >
                {currentScene.script}
              </p>
            </div>
          )}
        </>
      )}
      
      {/* Voiceover audio */}
      <Audio src={staticFile('voiceover.mp3')} />
    </AbsoluteFill>
  );
};

export default HomeRowVideo;
