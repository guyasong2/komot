import React from 'react';

interface AvatarProps {
  className?: string;
  size?: number;
}

/**
 * Modern gradient silhouette female avatar design
 * Smooth gradients with elegant profile silhouette
 */
export const FemaleAvatar3: React.FC<AvatarProps> = ({ className = '', size = 400 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Female avatar gradient silhouette design"
    >
      <defs>
        {/* Gradient definitions */}
        <linearGradient id="bgGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="hairGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1F2937" />
        </linearGradient>
        <linearGradient id="accentGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <radialGradient id="faceGradient3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF3E2" />
          <stop offset="100%" stopColor="#FDE7D5" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="400" fill="url(#bgGradient3)" rx="200" />

      {/* Silhouette base - head and shoulders */}
      <ellipse cx="200" cy="200" rx="120" ry="140" fill="url(#faceGradient3)" />

      {/* Hair - flowing gradient silhouette */}
      <path
        d="M 200 70 Q 260 80 290 120 Q 300 150 295 180 L 280 170 Q 285 140 270 120 Q 245 95 200 90 Q 155 95 130 120 Q 115 140 120 170 L 105 180 Q 100 150 110 120 Q 140 80 200 70 Z"
        fill="url(#hairGradient3)"
      />

      {/* Hair detail - side sweep */}
      <path
        d="M 105 180 Q 95 200 95 220 Q 95 240 105 255 L 120 245 Q 115 230 115 215 Q 115 200 120 185 Z"
        fill="url(#hairGradient3)"
        opacity="0.9"
      />

      {/* Face features - subtle */}
      <ellipse cx="170" cy="190" rx="6" ry="8" fill="#374151" opacity="0.8" />
      <ellipse cx="230" cy="190" rx="6" ry="8" fill="#374151" opacity="0.8" />

      {/* Subtle blush */}
      <ellipse cx="155" cy="210" rx="15" ry="10" fill="#F87171" opacity="0.2" />
      <ellipse cx="245" cy="210" rx="15" ry="10" fill="#F87171" opacity="0.2" />

      {/* Lips - soft gradient */}
      <ellipse cx="200" cy="240" rx="20" ry="10" fill="#EF4444" opacity="0.4" />

      {/* Neck and shoulders with gradient */}
      <rect x="170" y="280" width="60" height="50" fill="url(#faceGradient3)" />
      <ellipse cx="200" cy="355" rx="110" ry="70" fill="url(#accentGradient3)" />

      {/* Decorative gradient elements */}
      <circle cx="130" cy="340" r="30" fill="url(#accentGradient3)" opacity="0.3" />
      <circle cx="270" cy="340" r="30" fill="url(#accentGradient3)" opacity="0.3" />

      {/* Accent circles */}
      <circle cx="200" cy="370" r="15" fill="#FFFFFF" opacity="0.3" />
    </svg>
  );
};

export default FemaleAvatar3;
