// Script format for typing videos
// Each scene defines what's happening at what time

export interface KeyPress {
  time: number;  // seconds from scene start
  key: string;
  duration?: number;  // how long to hold (default 0.3s)
}

export interface SceneAction {
  type: 'highlight-keys' | 'hand-pose' | 'hand-position' | 'show-text';
  keys?: string[];
  hand?: 'left' | 'right' | 'both';
  pose?: string;
  position?: { x: number; y: number };
  text?: string;
}

export interface Scene {
  id: string;
  startTime: number;  // in seconds
  duration: number;   // in seconds
  script: string;     // voiceover text
  actions: SceneAction[];
  keyPresses?: KeyPress[];  // timed key strikes
}

export interface VideoScript {
  title: string;
  totalDuration: number;
  scenes: Scene[];
}

// Script for "The Home Row" video
// Audio duration ~34 seconds, so timings adjusted
export const homeRowScript: VideoScript = {
  title: "The Home Row",
  totalDuration: 36,
  scenes: [
    {
      id: "intro",
      startTime: 2,  // after title card
      duration: 3,
      script: "Welcome! Today we're going to learn about the home row.",
      actions: [
        { type: 'hand-pose', hand: 'both', pose: 'rest' },
      ],
    },
    {
      id: "what-is-home-row",
      startTime: 5,
      duration: 4,
      script: "The home row is the middle row of letter keys on your keyboard.",
      actions: [
        { type: 'highlight-keys', keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'] },
      ],
      // Sweep across the home row as she says it
      keyPresses: [
        { time: 2.0, key: 'A', duration: 0.2 },
        { time: 2.2, key: 'S', duration: 0.2 },
        { time: 2.4, key: 'D', duration: 0.2 },
        { time: 2.6, key: 'F', duration: 0.2 },
        { time: 2.8, key: 'G', duration: 0.2 },
        { time: 3.0, key: 'H', duration: 0.2 },
        { time: 3.2, key: 'J', duration: 0.2 },
        { time: 3.4, key: 'K', duration: 0.2 },
        { time: 3.6, key: 'L', duration: 0.2 },
        { time: 3.8, key: ';', duration: 0.2 },
      ],
    },
    {
      id: "left-hand",
      startTime: 9,
      duration: 4,
      script: "Your left hand rests on A, S, D, and F.",
      actions: [
        { type: 'highlight-keys', keys: ['A', 'S', 'D', 'F'] },
      ],
      // Press each key as she says it: "A, S, D, and F"
      keyPresses: [
        { time: 1.8, key: 'A', duration: 0.3 },
        { time: 2.2, key: 'S', duration: 0.3 },
        { time: 2.6, key: 'D', duration: 0.3 },
        { time: 3.1, key: 'F', duration: 0.4 },
      ],
    },
    {
      id: "right-hand",
      startTime: 13,
      duration: 4,
      script: "Your right hand rests on J, K, L, and semicolon.",
      actions: [
        { type: 'highlight-keys', keys: ['J', 'K', 'L', ';'] },
      ],
      // Press each key as she says it: "J, K, L, and semicolon"
      keyPresses: [
        { time: 1.8, key: 'J', duration: 0.3 },
        { time: 2.2, key: 'K', duration: 0.3 },
        { time: 2.6, key: 'L', duration: 0.3 },
        { time: 3.1, key: ';', duration: 0.5 },
      ],
    },
    {
      id: "both-hands",
      startTime: 17,
      duration: 4,
      script: "Together, your fingers cover the entire home row.",
      actions: [
        { type: 'highlight-keys', keys: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'] },
      ],
    },
    {
      id: "f-and-j",
      startTime: 21,
      duration: 5,
      script: "Notice the bumps on F and J? Those help you find home without looking.",
      actions: [
        { type: 'highlight-keys', keys: ['F', 'J'] },
      ],
      // Emphasize F and J
      keyPresses: [
        { time: 1.2, key: 'F', duration: 0.5 },
        { time: 1.8, key: 'J', duration: 0.5 },
      ],
    },
    {
      id: "practice",
      startTime: 26,
      duration: 6,
      script: "Practice finding home row with your eyes closed. Feel for F and J first.",
      actions: [
        { type: 'highlight-keys', keys: ['F', 'J'] },
      ],
      keyPresses: [
        { time: 4.5, key: 'F', duration: 0.4 },
        { time: 5.0, key: 'J', duration: 0.4 },
      ],
    },
    {
      id: "outro",
      startTime: 32,
      duration: 4,
      script: "Great job! Now you know the home row. Keep practicing!",
      actions: [
        { type: 'highlight-keys', keys: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'] },
      ],
      // Celebratory sweep
      keyPresses: [
        { time: 2.0, key: 'A', duration: 0.15 },
        { time: 2.15, key: 'S', duration: 0.15 },
        { time: 2.3, key: 'D', duration: 0.15 },
        { time: 2.45, key: 'F', duration: 0.15 },
        { time: 2.6, key: 'J', duration: 0.15 },
        { time: 2.75, key: 'K', duration: 0.15 },
        { time: 2.9, key: 'L', duration: 0.15 },
        { time: 3.05, key: ';', duration: 0.15 },
      ],
    },
  ],
};

// Helper to get current scene based on frame
export const getCurrentScene = (
  script: VideoScript, 
  frame: number, 
  fps: number
): Scene | null => {
  const currentTime = frame / fps;
  
  for (const scene of script.scenes) {
    if (currentTime >= scene.startTime && 
        currentTime < scene.startTime + scene.duration) {
      return scene;
    }
  }
  
  return null;
};

// Get highlighted keys for current frame
export const getHighlightedKeys = (scene: Scene | null): string[] => {
  if (!scene) return [];
  
  const highlightAction = scene.actions.find(a => a.type === 'highlight-keys');
  return highlightAction?.keys || [];
};

// Get the currently pressed key based on timing
export const getActiveKeyPress = (
  scene: Scene | null,
  frame: number,
  fps: number
): string | null => {
  if (!scene || !scene.keyPresses) return null;
  
  const currentTime = frame / fps;
  const sceneTime = currentTime - scene.startTime;
  
  for (const kp of scene.keyPresses) {
    const duration = kp.duration || 0.3;
    if (sceneTime >= kp.time && sceneTime < kp.time + duration) {
      return kp.key;
    }
  }
  
  return null;
};

// Get hand pose for current frame
export const getHandPose = (
  scene: Scene | null, 
  hand: 'left' | 'right'
): string => {
  if (!scene) return 'rest';
  
  const poseAction = scene.actions.find(
    a => a.type === 'hand-pose' && (a.hand === hand || a.hand === 'both')
  );
  
  return poseAction?.pose || 'rest';
};
