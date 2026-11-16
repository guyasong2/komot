import React from 'react';

interface AvatarProps {
  className?: string;
  size?: number;
}

/**
 * Minimalist line art female avatar design
 * Clean, elegant line work with simple facial features
 */
export const FemaleAvatar2: React.FC<AvatarProps> = ({ className = '', size = 400 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Female avatar line art design"
    >
      {/* Background */}
      <rect width="400" height="400" fill="#F9FAFB" rx="200" />

      {/* Face outline */}
      <path
        d="M 200 100 Q 260 120 270 180 Q 275 220 265 260 Q 250 290 200 300 Q 150 290 135 260 Q 125 220 130 180 Q 140 120 200 100 Z"
        fill="#FDE7D5"
        stroke="#374151"
        strokeWidth="2"
      />

      {/* Hair - flowing line art */}
      <path
        d="M 150 110 Q 120 100 110 130 Q 105 150 115 170 L 130 160"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 250 110 Q 280 100 290 130 Q 295 150 285 170 L 270 160"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 200 95 Q 160 90 140 110 Q 180 100 200 95 Q 220 100 260 110 Q 240 90 200 95"
        fill="#374151"
        stroke="#374151"
        strokeWidth="2"
      />

      {/* Eyes - simple dots */}
      <circle cx="175" cy="190" r="4" fill="#374151" />
      <circle cx="225" cy="190" r="4" fill="#374151" />

      {/* Eyebrows - minimalist arcs */}
      <path
        d="M 160 175 Q 170 170 180 175"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 220 175 Q 230 170 240 175"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Nose - single line */}
      <path
        d="M 200 195 Q 205 215 200 220"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Mouth - simple curve */}
      <path
        d="M 185 240 Q 200 248 215 240"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Neck */}
      <path
        d="M 180 295 L 180 330"
        stroke="#374151"
        strokeWidth="2"
      />
      <path
        d="M 220 295 L 220 330"
        stroke="#374151"
        strokeWidth="2"
      />

      {/* Shoulders with KOMOT accent */}
      <path
        d="M 180 330 Q 150 340 130 360 L 130 400"
        fill="#10B981"
        stroke="#10B981"
        strokeWidth="2"
      />
      <path
        d="M 220 330 Q 250 340 270 360 L 270 400"
        fill="#10B981"
        stroke="#10B981"
        strokeWidth="2"
      />
      <rect x="180" y="330" width="40" height="70" fill="#10B981" />

      {/* Decorative line accent */}
      <circle cx="200" cy="350" r="25" stroke="#059669" strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  );
};

export default FemaleAvatar2;
