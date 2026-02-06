# Typing Video Generator

Remotion-based video generator for typing.com educational content.

## Features
- Keyboard visualization with key highlighting
- Hand position overlays with finger-to-key mapping
- Timed key presses synced to voiceover
- Adjustable props via Remotion Studio

## Setup
```bash
npm install
npm run start  # Opens Remotion Studio
```

## Render
```bash
npm run build  # Renders to out/home-row.mp4
```

## Customization
- Edit `src/script.ts` to adjust timing and key presses
- Use Remotion Studio sliders to adjust hand positions
- Replace `public/voiceover.mp3` with your audio
