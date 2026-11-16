import React from 'react';

interface MaleAvatar3Props {
  size?: number;
  className?: string;
}

/**
 * Modern Gradient Silhouette
 * Bold silhouette design with gradient accents
 */
export const MaleAvatar3: React.FC<MaleAvatar3Props> = ({
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
      aria-label="Male avatar with gradient silhouette"
    >
      <defs>
        {/* Gradient definitions */}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8F5F1" />
          <stop offset="100%" stopColor="#D1FAE5" />
        </linearGradient>

        <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1F2937" />
        </linearGradient>

        <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="400" fill="url(#bgGradient)" rx="200" />

      {/* Head silhouette */}
      <ellipse cx="200" cy="160" rx="80" ry="95" fill="url(#headGradient)" />

      {/* Hair detail - top of head */}
      <path
        d="M 130 130 Q 150 90 200 80 Q 250 90 270 130 Q 260 100 200 90 Q 140 100 130 130 Z"
        fill="#111827"
      />

      {/* Ear detail */}
      <ellipse cx="125" cy="170" rx="12" ry="20" fill="#4B5563" opacity="0.8" />
      <ellipse cx="275" cy="170" rx="12" ry="20" fill="#4B5563" opacity="0.8" />

      {/* Neck */}
      <rect x="170" y="240" width="60" height="60" fill="#6B7280" />

      {/* Shoulders and torso */}
      <path
        d="M 100 300 L 170 300 L 170 400 L 100 400 Z"
        fill="url(#shirtGradient)"
      />
      <path
        d="M 230 300 L 300 300 L 300 400 L 230 400 Z"
        fill="url(#shirtGradient)"
      />

      {/* Center torso */}
      <rect x="170" y="300" width="60" height="100" fill="url(#shirtGradient)" />

      {/* Collar detail */}
      <path
        d="M 170 300 L 190 320 L 200 310 L 210 320 L 230 300 L 230 290 L 200 280 L 170 290 Z"
        fill="#D1D5DB"
      />

      {/* Accent circle - decorative element */}
      <circle cx="320" cy="100" r="25" fill="#10B981" opacity="0.3" />
      <circle cx="80" cy="320" r="20" fill="#10B981" opacity="0.2" />
    </svg>
  );
};

export default MaleAvatar3;
