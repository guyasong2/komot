import React from 'react';

interface AvatarProps {
  className?: string;
  size?: number;
}

/**
 * Geometric abstract female avatar design
 * Uses circles and shapes to create a modern, abstract representation
 */
export const FemaleAvatar1: React.FC<AvatarProps> = ({ className = '', size = 400 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Female avatar geometric design"
    >
      {/* Background */}
      <rect width="400" height="400" fill="#F3F4F6" rx="200" />

      {/* Hair - geometric circles */}
      <circle cx="200" cy="140" r="100" fill="#374151" />
      <circle cx="140" cy="120" r="50" fill="#374151" />
      <circle cx="260" cy="120" r="50" fill="#374151" />

      {/* Face */}
      <circle cx="200" cy="200" r="85" fill="#FDE7D5" />

      {/* Eyes */}
      <circle cx="180" cy="190" r="8" fill="#374151" />
      <circle cx="220" cy="190" r="8" fill="#374151" />

      {/* Eyebrows - curved lines */}
      <path
        d="M 165 175 Q 175 170 185 175"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 215 175 Q 225 170 235 175"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Nose - minimal */}
      <path
        d="M 200 200 L 200 215"
        stroke="#E5C4A8"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Lips */}
      <ellipse cx="200" cy="230" rx="15" ry="8" fill="#E57373" opacity="0.6" />

      {/* Neck */}
      <rect x="175" y="280" width="50" height="40" fill="#FDE7D5" />

      {/* Shoulders - geometric */}
      <ellipse cx="200" cy="340" rx="90" ry="60" fill="#10B981" />

      {/* Accent detail - geometric shapes */}
      <circle cx="140" cy="330" r="20" fill="#059669" opacity="0.7" />
      <circle cx="260" cy="330" r="20" fill="#059669" opacity="0.7" />
    </svg>
  );
};

export default FemaleAvatar1;
