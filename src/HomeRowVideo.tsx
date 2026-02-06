import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  Audio,
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
};

interface HomeRowProps {
  leftHandX?: number;
  leftHandY?: number;
  rightHandX?: number;
  rightHandY?: number;
  handScale?: number;
  contentOffsetY?: number;
}

// Typing SFX Component - plays click sound for each key press
const TypingSFX: React.FC = () => {
  const { fps } = useVideoConfig();
  const allKeyPresses = getAllKeyPresses(homeRowScript, fps);
  
  return (
    <>
      {allKeyPresses.map((kp, index) => (
        <Sequence key={index} from={kp.frame} durationInFrames={Math.ceil(fps * 0.3)}>
          <Audio 
            src={staticFile('key-click.mp3')} 
            volume={0.5}
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
  
  // Get the currently pressed key (timed to audio)
  const activeKey = getActiveKeyPress(currentScene, frame, fps);
  
  // Get correct hand images - use active key press if any, otherwise resting
  const { leftImage, rightImage } = activeKey 
    ? getHandImages([activeKey])
    : { leftImage: RESTING_HANDS.left, rightImage: RESTING_HANDS.right };
  
  // Enhanced background gradient animation
  const bgHue = interpolate(frame, [0, fps * 36], [210, 230], {
    extrapolateRight: 'clamp',
  });
  
  // Keyboard positioning - centered
  const keyboardWidth = width * 0.83;
  const keyboardX = (width - keyboardWidth) / 2;
  const keyboardY = height * 0.05;
  
  // Hand scale and positions
  const handScale = handScaleProp;
  const leftHandX = leftHandXProp;
  const leftHandY = leftHandYProp;
  const rightHandX = rightHandXProp;
  const rightHandY = rightHandYProp;
  
  // Calculate scaled hand dimensions
  const scaledHandWidth = 1188 * handScale;
  
  return (
    <AbsoluteFill
      style={{
        background: `
          linear-gradient(145deg, 
            hsl(${bgHue}, 65%, 52%) 0%, 
            hsl(${bgHue + 15}, 55%, 42%) 50%,
            hsl(${bgHue + 25}, 50%, 32%) 100%
          )
        `,
        overflow: 'hidden',
      }}
    >
      {/* Subtle background texture/depth */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.15) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />
      
      {/* typing.com branding - top right */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          right: 40,
          zIndex: 50,
        }}
      >
        <span
          style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: 30,
            fontFamily,
            fontWeight: 700,
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
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
          {/* Keyboard */}
          <div
            style={{
              position: 'absolute',
              left: keyboardX,
              top: keyboardY + contentOffsetYProp,
            }}
          >
            <Keyboard width={keyboardWidth} />
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
          
          {/* Teacher Character - bottom left */}
          <img
            src={staticFile('teacher-character.png')}
            alt="teacher"
            style={{
              position: 'absolute',
              left: 40,
              bottom: 140,
              height: 280,
              width: 'auto',
              pointerEvents: 'none',
              transform: `translateY(${Math.sin(frame * 0.08) * 4}px)`,
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))',
            }}
          />
          
          {/* Subtitles - larger, with backdrop */}
          {currentScene && (
            <div
              style={{
                position: 'absolute',
                bottom: 50,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                padding: '0 60px',
              }}
            >
              <div
                style={{
                  background: 'rgba(0,0,0,0.65)',
                  borderRadius: 12,
                  padding: '14px 28px',
                  backdropFilter: 'blur(8px)',
                  maxWidth: '85%',
                }}
              >
                <p
                  style={{
                    color: 'white',
                    fontSize: 46,
                    fontFamily,
                    fontWeight: 600,
                    textShadow: '0 2px 6px rgba(0,0,0,0.4)',
                    margin: 0,
                    lineHeight: 1.25,
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
      
      {/* Background music - subtle, low volume */}
      {/* <Audio src={staticFile('background-music.mp3')} volume={0.08} loop /> */}
    </AbsoluteFill>
  );
};

export default HomeRowVideo;
