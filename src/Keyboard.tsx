import React from 'react';
import { staticFile } from 'remotion';

interface KeyboardProps {
  highlightedKeys?: string[];
  showLabels?: boolean;
  width?: number;
}

export const Keyboard: React.FC<KeyboardProps> = ({
  width = 1598,
}) => {
  // Use the actual keyboard image from Adrian
  const keyboardPath = staticFile('keyboard.png');
  
  // Original image is 1598x686
  const aspectRatio = 686 / 1598;
  const height = width * aspectRatio;

  return (
    <img
      src={keyboardPath}
      alt="keyboard"
      style={{
        width: width,
        height: height,
        pointerEvents: 'none',
      }}
    />
  );
};

export default Keyboard;
