import React from 'react';
import { staticFile } from 'remotion';

// Hand image naming convention:
// {side}-{row}-{position}@2x.png
// Rows: home-row, top-row, bottom-row, num-row
// Positions: 1-7 (finger positions)
// Special: resting-hand, option, option-shift-a, option-shift-b

export type HandRow = 'home-row' | 'top-row' | 'bottom-row' | 'num-row' | 'resting';
export type FingerPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface HandProps {
  side: 'left' | 'right';
  row: HandRow;
  position?: FingerPosition;
  x: number;
  y: number;
  scale?: number;
}

// Map key names to hand positions
export const KEY_TO_HAND_POSITION: Record<string, { side: 'left' | 'right'; row: HandRow; position: FingerPosition }> = {
  // Left hand - home row (A S D F)
  'A': { side: 'left', row: 'home-row', position: 1 },
  'S': { side: 'left', row: 'home-row', position: 2 },
  'D': { side: 'left', row: 'home-row', position: 3 },
  'F': { side: 'left', row: 'home-row', position: 4 },
  
  // Right hand - home row (J K L ;)
  'J': { side: 'right', row: 'home-row', position: 1 },
  'K': { side: 'right', row: 'home-row', position: 2 },
  'L': { side: 'right', row: 'home-row', position: 3 },
  ';': { side: 'right', row: 'home-row', position: 4 },
  
  // Left hand - top row (Q W E R T)
  'Q': { side: 'left', row: 'top-row', position: 1 },
  'W': { side: 'left', row: 'top-row', position: 2 },
  'E': { side: 'left', row: 'top-row', position: 3 },
  'R': { side: 'left', row: 'top-row', position: 4 },
  'T': { side: 'left', row: 'top-row', position: 5 },
  
  // Right hand - top row (Y U I O P)
  'Y': { side: 'right', row: 'top-row', position: 1 },
  'U': { side: 'right', row: 'top-row', position: 2 },
  'I': { side: 'right', row: 'top-row', position: 3 },
  'O': { side: 'right', row: 'top-row', position: 4 },
  'P': { side: 'right', row: 'top-row', position: 5 },
  
  // Left hand - bottom row (Z X C V B)
  'Z': { side: 'left', row: 'bottom-row', position: 1 },
  'X': { side: 'left', row: 'bottom-row', position: 2 },
  'C': { side: 'left', row: 'bottom-row', position: 3 },
  'V': { side: 'left', row: 'bottom-row', position: 4 },
  'B': { side: 'left', row: 'bottom-row', position: 5 },
  
  // Right hand - bottom row (N M , . /)
  'N': { side: 'right', row: 'bottom-row', position: 1 },
  'M': { side: 'right', row: 'bottom-row', position: 2 },
  ',': { side: 'right', row: 'bottom-row', position: 3 },
  '.': { side: 'right', row: 'bottom-row', position: 4 },
  '/': { side: 'right', row: 'bottom-row', position: 5 },
};

export const Hand: React.FC<HandProps> = ({
  side,
  row,
  position,
  x,
  y,
  scale = 0.25,
}) => {
  // Build the image filename
  let filename: string;
  
  if (row === 'resting') {
    filename = `${side}-resting-hand@2x.png`;
  } else if (position) {
    filename = `${side}-${row}-${position}@2x.png`;
  } else {
    // Default to resting if no position specified
    filename = `${side}-resting-hand@2x.png`;
  }
  
  const imagePath = staticFile(`hands/${filename}`);
  
  // Original image is ~1200x1300px, scale it down with width/height
  // This ensures positioning works correctly (top-left corner based)
  const scaledWidth = 1200 * scale;
  
  return (
    <img
      src={imagePath}
      alt={`${side} hand`}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: scaledWidth,
        height: 'auto',
        pointerEvents: 'none',
      }}
    />
  );
};

// Helper component that shows both hands for a given key
interface HandsForKeyProps {
  activeKey?: string;
  leftX: number;
  rightX: number;
  y: number;
  scale?: number;
}

export const HandsForKey: React.FC<HandsForKeyProps> = ({
  activeKey,
  leftX,
  rightX,
  y,
  scale = 0.25,
}) => {
  const keyInfo = activeKey ? KEY_TO_HAND_POSITION[activeKey.toUpperCase()] : null;
  
  // Determine which hand images to show
  let leftRow: HandRow = 'resting';
  let leftPosition: FingerPosition | undefined;
  let rightRow: HandRow = 'resting';
  let rightPosition: FingerPosition | undefined;
  
  if (keyInfo) {
    if (keyInfo.side === 'left') {
      leftRow = keyInfo.row;
      leftPosition = keyInfo.position;
    } else {
      rightRow = keyInfo.row;
      rightPosition = keyInfo.position;
    }
  }
  
  return (
    <>
      <Hand
        side="left"
        row={leftRow}
        position={leftPosition}
        x={leftX}
        y={y}
        scale={scale}
      />
      <Hand
        side="right"
        row={rightRow}
        position={rightPosition}
        x={rightX}
        y={y}
        scale={scale}
      />
    </>
  );
};

export default Hand;
