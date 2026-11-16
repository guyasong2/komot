import React from 'react';

interface MaleAvatar1Props {
  size?: number;
  className?: string;
}

/**
 * Geometric Abstract Face Avatar
 * Uses circles and shapes to create a modern, abstract male profile
 */
export const MaleAvatar1: React.FC<MaleAvatar1Props> = ({
  size = 400,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Male avatar with geometric design"
    >
      {/* Background */}
      <rect width="400" height="400" fill="#F3F4F6" rx="200" />

      {/* Head base - large circle */}
      <circle cx="200" cy="180" r="90" fill="#E5E7EB" />

      {/* Hair - geometric top */}
      <path
        d="M 140 140 Q 200 100 260 140 L 260 180 Q 200 160 140 180 Z"
        fill="#374151"
      />

      {/* Face highlight */}
      <circle cx="200" cy="190" r="70" fill="#D1D5DB" />

      {/* Eyes */}
      <circle cx="180" cy="175" r="8" fill="#374151" />
      <circle cx="220" cy="175" r="8" fill="#374151" />

      {/* Eyebrows - rounded rectangles */}
      <rect x="170" y="160" width="20" height="4" rx="2" fill="#374151" />
      <rect x="210" y="160" width="20" height="4" rx="2" fill="#374151" />

      {/* Nose - simple triangle */}
      <path d="M 200 185 L 195 200 L 205 200 Z" fill="#9CA3AF" />

      {/* Mouth - simple line */}
      <path
        d="M 185 215 Q 200 220 215 215"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Shoulders - abstract geometric shapes */}
      <ellipse cx="140" cy="320" rx="60" ry="80" fill="#10B981" />
      <ellipse cx="260" cy="320" rx="60" ry="80" fill="#10B981" />

      {/* Neck */}
      <rect x="175" y="250" width="50" height="70" fill="#D1D5DB" rx="10" />

      {/* Accent circle detail */}
      <circle cx="200" cy="340" r="30" fill="#059669" opacity="0.5" />
    </svg>
  );
};

export default MaleAvatar1;
