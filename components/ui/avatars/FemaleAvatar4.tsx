import React from 'react';

interface AvatarProps {
  className?: string;
  size?: number;
}

/**
 * Professional icon-based female avatar design
 * Modern, clean icon style with KOMOT branding elements
 */
export const FemaleAvatar4: React.FC<AvatarProps> = ({ className = '', size = 400 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Female avatar professional icon design"
    >
      <defs>
        <linearGradient id="bgGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3F4F6" />
          <stop offset="100%" stopColor="#E5E7EB" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="400" fill="url(#bgGradient4)" rx="200" />

      {/* Icon base circle */}
      <circle cx="200" cy="180" r="90" fill="#10B981" opacity="0.1" />

      {/* Head */}
      <circle cx="200" cy="160" r="70" fill="#FDE7D5" />

      {/* Hair - professional bun style */}
      <path
        d="M 200 95 Q 250 100 270 135 Q 275 150 270 165 L 265 155 Q 268 140 255 125 Q 235 105 200 100 Z"
        fill="#374151"
      />
      <path
        d="M 200 95 Q 150 100 130 135 Q 125 150 130 165 L 135 155 Q 132 140 145 125 Q 165 105 200 100 Z"
        fill="#374151"
      />
      <ellipse cx="200" cy="110" rx="45" ry="35" fill="#374151" />

      {/* Hair bun */}
      <circle cx="200" cy="95" r="25" fill="#374151" />
      <circle cx="200" cy="95" r="18" fill="#1F2937" />

      {/* Face features - clean icon style */}
      <circle cx="180" cy="160" r="5" fill="#374151" />
      <circle cx="220" cy="160" r="5" fill="#374151" />

      {/* Eyebrows - professional */}
      <rect x="165" y="143" width="20" height="3" fill="#374151" rx="1.5" transform="rotate(-10 175 145)" />
      <rect x="215" y="143" width="20" height="3" fill="#374151" rx="1.5" transform="rotate(10 225 145)" />

      {/* Smile - friendly professional */}
      <path
        d="M 185 185 Q 200 192 215 185"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Neck */}
      <rect x="180" y="225" width="40" height="35" fill="#FDE7D5" />

      {/* Professional attire - blazer/jacket */}
      <path
        d="M 140 260 L 165 260 L 180 330 L 180 400 L 120 400 L 120 280 Z"
        fill="#10B981"
      />
      <path
        d="M 260 260 L 235 260 L 220 330 L 220 400 L 280 400 L 280 280 Z"
        fill="#10B981"
      />

      {/* Shirt/collar */}
      <rect x="180" y="260" width="40" height="140" fill="#FFFFFF" />

      {/* Collar detail */}
      <path
        d="M 180 260 L 170 280 L 180 290"
        fill="#F3F4F6"
        stroke="#E5E7EB"
        strokeWidth="1"
      />
      <path
        d="M 220 260 L 230 280 L 220 290"
        fill="#F3F4F6"
        stroke="#E5E7EB"
        strokeWidth="1"
      />

      {/* Professional badge/ID accent */}
      <rect x="185" y="320" width="30" height="40" fill="#10B981" opacity="0.2" rx="3" />
      <rect x="190" y="328" width="20" height="3" fill="#10B981" rx="1.5" />
      <rect x="190" y="336" width="15" height="2" fill="#059669" opacity="0.6" rx="1" />
      <rect x="190" y="342" width="18" height="2" fill="#059669" opacity="0.6" rx="1" />

      {/* Decorative professional elements */}
      <circle cx="150" cy="290" r="8" fill="#059669" opacity="0.3" />
      <circle cx="250" cy="290" r="8" fill="#059669" opacity="0.3" />
    </svg>
  );
};

export default FemaleAvatar4;
