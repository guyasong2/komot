import React from 'react';

interface MaleAvatar4Props {
  size?: number;
  className?: string;
}

/**
 * Professional Icon-Based Design
 * Clean, corporate-friendly icon style with professional aesthetic
 */
export const MaleAvatar4: React.FC<MaleAvatar4Props> = ({
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
      aria-label="Male avatar with professional icon design"
    >
      {/* Background */}
      <rect width="400" height="400" fill="#F9FAFB" rx="200" />

      {/* Large background circle */}
      <circle cx="200" cy="200" r="160" fill="#E5E7EB" />

      {/* Inner accent circle */}
      <circle cx="200" cy="200" r="140" fill="#F3F4F6" />

      {/* Head circle */}
      <circle cx="200" cy="155" r="65" fill="#9CA3AF" />

      {/* Face detail circle */}
      <circle cx="200" cy="160" r="55" fill="#D1D5DB" />

      {/* Hair - rounded top */}
      <path
        d="M 145 135 Q 145 100 175 90 Q 200 85 225 90 Q 255 100 255 135 Q 255 155 200 155 Q 145 155 145 135 Z"
        fill="#4B5563"
      />

      {/* Eyes - simple dots */}
      <circle cx="185" cy="155" r="5" fill="#1F2937" />
      <circle cx="215" cy="155" r="5" fill="#1F2937" />

      {/* Eyebrows - minimal */}
      <rect x="178" y="143" width="14" height="3" rx="1.5" fill="#374151" />
      <rect x="208" y="143" width="14" height="3" rx="1.5" fill="#374151" />

      {/* Smile - arc */}
      <path
        d="M 185 175 Q 200 182 215 175"
        stroke="#374151"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Body - icon style */}
      <ellipse cx="200" cy="290" rx="100" ry="90" fill="#10B981" />

      {/* Neck connector */}
      <rect x="180" y="210" width="40" height="50" fill="#D1D5DB" />

      {/* Shirt collar V-neck */}
      <path
        d="M 150 250 L 180 250 L 200 270 L 220 250 L 250 250 L 250 260 L 200 290 L 150 260 Z"
        fill="#059669"
      />

      {/* Collar detail */}
      <path
        d="M 180 250 L 200 270 L 220 250"
        stroke="#F3F4F6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Accent badge/detail */}
      <circle cx="240" cy="280" r="8" fill="#FFFFFF" opacity="0.4" />
      <circle cx="160" cy="300" r="6" fill="#FFFFFF" opacity="0.3" />

      {/* KOMOT brand accent line */}
      <path
        d="M 170 330 L 230 330"
        stroke="#047857"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MaleAvatar4;
