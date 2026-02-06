import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  Audio,
  Img,
  Sequence,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Quicksand';
import { Keyboard } from './Keyboard';
import {
  homeRowScript,
  getCurrentScene,
  getHighlightedKeys,
  getActiveKeyPress,
  getAllKeyPresses,
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

// Talking Head Character Component
const TalkingHead: React.FC<{ isTalking: boolean; frame: number }> = ({ isTalking, frame }) => {
  // Subtle idle bounce animation
  const idleBounce = Math.sin(frame * 0.15) * 3;
  
  // Talking animation - faster bobbing when speaking
  const talkBounce = isTalking ? Math.sin(frame * 0.4) * 5 : 0;
  
  // Combine animations
  const totalBounce = idleBounce + talkBounce;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        bottom: 140,
        width: 200,
        height: 360,
        transform: `translateY(${totalBounce}px)`,
        transition: 'transform 0.1s ease-out',
        zIndex: 100,
      }}
    >
      {/* Character image */}
      <Img
        src={staticFile('teacher-character.png')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
        }}
      />
      
      {/* Talking indicator - subtle glow when speaking */}
      {isTalking && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            animation: 'pulse 0.5s ease-in-out infinite alternate',
          }}
        />
      )}
    </div>
  );
};

// Typing SFX Component - plays click sound for each key press
const TypingSFX: React.FC = () => {
  const { fps } = useVideoConfig();
  const allKeyPresses = getAllKeyPresses(homeRowScript, fps);
  
  return (
    <>
      {allKeyPresses.map((kp, index) => (
        <Sequence key={index} from={kp.frame} durationInFrames={fps}>
          <Audio 
            src={staticFile('key-click.mp3')} 
            volume={0.4}
          />
        </Sequence>
      ))}
    </>
  );
};

export const HomeRowVideo: React.FC<HomeRowProps> = ({
  leftHandX: leftHandXProp = -150,
  leftHandY: leftHandYProp = 0,
  rightHandX: rightHandXProp = 720,
  rightHandY: rightHandYProp = 60,
  handScale: handScaleProp = 1,
  contentOffsetY: contentOffsetYProp = -40,
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
  
  // Determine if character should be "talking" (scene is active and has script)
  const isTalking = currentScene !== null && currentScene.script.length > 0 && frame >= fps * 2;
  
  // Enhanced background gradient animation with subtle pattern
  const bgHue = interpolate(frame, [0, fps * 44], [200, 240], {
    extrapolateRight: 'clamp',
  });
  
  const bgSaturation = interpolate(frame, [0, fps * 44], [65, 75], {
    extrapolateRight: 'clamp',
  });
  
  // Keyboard fills most of the frame - using new keyboard image (1598x686)
  const keyboardWidth = width * 0.75;
  const keyboardX = (width - keyboardWidth) / 2 + 50; // Shifted right for character
  const keyboardY = height * 0.08;
  
  // Hand scale and positions - from props for live adjustment
  const handScale = handScaleProp;
  const leftHandX = leftHandXProp + 50; // Shift right with keyboard
  const leftHandY = leftHandYProp;
  const rightHandX = rightHandXProp + 50;
  const rightHandY = rightHandYProp;
  
  // Calculate scaled hand dimensions
  const scaledHandWidth = 1188 * handScale; // @2x image width
  
  return (
    <AbsoluteFill
      style={{
        background: `
          linear-gradient(135deg, 
            hsl(${bgHue}, ${bgSaturation}%, 55%) 0%, 
            hsl(${bgHue + 20}, ${bgSaturation - 10}%, 40%) 50%,
            hsl(${bgHue + 30}, ${bgSaturation - 5}%, 35%) 100%
          )
        `,
        overflow: 'hidden',
      }}
    >
      {/* Subtle animated background pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }}
      />
      
      {/* Floating shapes for visual interest */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 150,
          height: 150,
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: 'rgba(255,255,255,0.05)',
          transform: `rotate(${frame * 0.5}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          transform: `translateY(${Math.sin(frame * 0.1) * 10}px)`,
        }}
      />
      
      {/* typing.com branding - top right */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          right: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 50,
        }}
      >
        <span
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: 28,
            fontFamily,
            fontWeight: 700,
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            letterSpacing: '-0.5px',
          }}
        >
          typing.com
        </span>
      </div>
      
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
              fontSize: 90,
              fontFamily,
              fontWeight: 700,
              textShadow: '0 6px 30px rgba(0,0,0,0.4)',
              opacity: interpolate(frame, [0, fps * 0.5, fps * 1.5, fps * 2], [0, 1, 1, 0]),
              transform: `scale(${interpolate(frame, [0, fps * 0.5], [0.9, 1], { extrapolateRight: 'clamp' })})`,
            }}
          >
            The Home Row
          </h1>
        </AbsoluteFill>
      )}
      
      {/* Main content - after title */}
      {frame >= fps * 2 && (
        <>
          {/* Talking Head Character */}
          <TalkingHead isTalking={isTalking} frame={frame} />
          
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
          
          {/* Enhanced Caption/Subtitle */}
          {currentScene && (
            <div
              style={{
                position: 'absolute',
                bottom: 50,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                padding: '0 40px',
              }}
            >
              <div
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: 16,
                  padding: '16px 32px',
                  backdropFilter: 'blur(10px)',
                  maxWidth: '70%',
                }}
              >
                <p
                  style={{
                    color: 'white',
                    fontSize: 44,
                    fontFamily,
                    fontWeight: 600,
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    margin: 0,
                    lineHeight: 1.3,
                    textAlign: 'center',
                  }}
                >
                  {currentScene.script}
                </p>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Voiceover audio */}
      <Audio src={staticFile('voiceover.mp3')} />
      
      {/* Typing sound effects */}
      <TypingSFX />
      
      {/* Background music - low volume */}
      {/* <Audio src={staticFile('background-music.mp3')} volume={0.1} loop /> */}
    </AbsoluteFill>
  );
};

export default HomeRowVideo;
