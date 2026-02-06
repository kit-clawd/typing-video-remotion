// Hand image mapping for typing videos
// Maps keys to the correct hand image files

export interface HandImageInfo {
  side: 'left' | 'right';
  file: string;
  description: string;
}

// Home row keys mapping
// Numbers indicate which finger is highlighted:
// 1-2 = Index finger (different poses)
// 3-4 = Middle finger
// 5-6 = Ring/Pinky finger

export const KEY_TO_IMAGE: Record<string, HandImageInfo> = {
  // LEFT HAND - Home Row (A S D F)
  'A': { side: 'left', file: 'left-home-row-5@2x.png', description: 'Pinky on A' },
  'S': { side: 'left', file: 'left-home-row-4@2x.png', description: 'Ring on S' },
  'D': { side: 'left', file: 'left-home-row-3@2x.png', description: 'Middle on D' },
  'F': { side: 'left', file: 'left-home-row-1@2x.png', description: 'Index on F' },
  
  // LEFT HAND - Top Row (Q W E R T)
  'Q': { side: 'left', file: 'left-top-row-1@2x.png', description: 'Pinky on Q' },
  'W': { side: 'left', file: 'left-top-row-2@2x.png', description: 'Ring on W' },
  'E': { side: 'left', file: 'left-top-row-3@2x.png', description: 'Middle on E' },
  'R': { side: 'left', file: 'left-top-row-4@2x.png', description: 'Index on R' },
  'T': { side: 'left', file: 'left-top-row-5@2x.png', description: 'Index reach to T' },
  
  // LEFT HAND - Bottom Row (Z X C V B)
  'Z': { side: 'left', file: 'left-bottom-row-1@2x.png', description: 'Pinky on Z' },
  'X': { side: 'left', file: 'left-bottom-row-2@2x.png', description: 'Ring on X' },
  'C': { side: 'left', file: 'left-bottom-row-3@2x.png', description: 'Middle on C' },
  'V': { side: 'left', file: 'left-bottom-row-4@2x.png', description: 'Index on V' },
  'B': { side: 'left', file: 'left-bottom-row-5@2x.png', description: 'Index reach to B' },
  
  // LEFT HAND - Number Row
  '1': { side: 'left', file: 'left-num-row-2@2x.png', description: 'Pinky on 1' },
  '2': { side: 'left', file: 'left-num-row-3@2x.png', description: 'Ring on 2' },
  '3': { side: 'left', file: 'left-num-row-4@2x.png', description: 'Middle on 3' },
  '4': { side: 'left', file: 'left-num-row-5@2x.png', description: 'Index on 4' },
  '5': { side: 'left', file: 'left-num-row-6@2x.png', description: 'Index reach to 5' },
  
  // RIGHT HAND - Home Row (J K L ;)
  'J': { side: 'right', file: 'right-home-row-1@2x.png', description: 'Index on J' },
  'K': { side: 'right', file: 'right-home-row-3@2x.png', description: 'Middle on K' },
  'L': { side: 'right', file: 'right-home-row-5@2x.png', description: 'Ring on L' },
  ';': { side: 'right', file: 'right-home-row-7@2x.png', description: 'Pinky on ;' },
  
  // RIGHT HAND - Top Row (Y U I O P)
  'Y': { side: 'right', file: 'right-top-row-1@2x.png', description: 'Index reach to Y' },
  'U': { side: 'right', file: 'right-top-row-2@2x.png', description: 'Index on U' },
  'I': { side: 'right', file: 'right-top-row-3@2x.png', description: 'Middle on I' },
  'O': { side: 'right', file: 'right-top-row-4@2x.png', description: 'Ring on O' },
  'P': { side: 'right', file: 'right-top-row-5@2x.png', description: 'Pinky on P' },
  
  // RIGHT HAND - Bottom Row (N M , . /)
  'N': { side: 'right', file: 'right-bottom-row-1@2x.png', description: 'Index reach to N' },
  'M': { side: 'right', file: 'right-bottom-row-2@2x.png', description: 'Index on M' },
  ',': { side: 'right', file: 'right-bottom-row-3@2x.png', description: 'Middle on ,' },
  '.': { side: 'right', file: 'right-bottom-row-4@2x.png', description: 'Ring on .' },
  '/': { side: 'right', file: 'right-bottom-row-5@2x.png', description: 'Pinky on /' },
  
  // RIGHT HAND - Number Row
  '6': { side: 'right', file: 'right-num-row-1@2x.png', description: 'Index reach to 6' },
  '7': { side: 'right', file: 'right-num-row-2@2x.png', description: 'Index on 7' },
  '8': { side: 'right', file: 'right-num-row-3@2x.png', description: 'Middle on 8' },
  '9': { side: 'right', file: 'right-num-row-4@2x.png', description: 'Ring on 9' },
  '0': { side: 'right', file: 'right-num-row-5@2x.png', description: 'Pinky on 0' },
  
  // Special keys
  'G': { side: 'left', file: 'left-home-row-6@2x.png', description: 'Index reach to G' },
  'H': { side: 'right', file: 'right-home-row-2@2x.png', description: 'Index reach to H' },
};

// Resting hand images (no key pressed)
export const RESTING_HANDS = {
  left: 'left-resting-hand@2x.png',
  right: 'right-resting-hand@2x.png',
};

// Special modifier combinations
export const MODIFIER_IMAGES = {
  'left-option': 'left-option@2x.png',
  'right-option': 'right-option@2x.png',
  'left-option-shift-a': 'left-option-shift-a@2x.png',
  'left-option-shift-b': 'left-option-shift-b@2x.png',
  'right-option-shift-a': 'right-option-shift-a@2x.png',
  'right-option-shift-b': 'right-option-shift-b@2x.png',
  'space': 'space@2x.png',
};

// Helper to get the correct hand image for a key
export function getHandImageForKey(key: string): { left: string; right: string } {
  const keyUpper = key.toUpperCase();
  const keyInfo = KEY_TO_IMAGE[keyUpper] || KEY_TO_IMAGE[key];
  
  if (keyInfo) {
    // One hand has the active key, other hand rests
    if (keyInfo.side === 'left') {
      return {
        left: keyInfo.file,
        right: RESTING_HANDS.right,
      };
    } else {
      return {
        left: RESTING_HANDS.left,
        right: keyInfo.file,
      };
    }
  }
  
  // Default to resting for both
  return {
    left: RESTING_HANDS.left,
    right: RESTING_HANDS.right,
  };
}

// For home row resting position (both hands on home row, no highlight)
export function getHomeRowRestingImages(): { left: string; right: string } {
  return {
    left: RESTING_HANDS.left,
    right: RESTING_HANDS.right,
  };
}
