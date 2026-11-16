import React from 'react';

interface MaleAvatar2Props {
  size?: number;
  className?: string;
}

/**
 * Minimalist Line Art Portrait
 * Clean line drawing style with continuous stroke aesthetic
 */
export const MaleAvatar2: React.FC<MaleAvatar2Props> = ({
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
      aria-label="Male avatar with minimalist line art"
    >
      {/* Background */}
      <rect width="400" height="400" fill="#FAFAFA" rx="200" />

      {/* Accent circle background */}
      <circle cx="200" cy="200" r="140" fill="#E8F5F1" />

      {/* Face outline - continuous line */}
      <path
        d="M 150 130 Q 200 100 250 130 L 250 220 Q 200 260 150 220 Z"
        stroke="#1F2937"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#F9FAFB"
      />

      {/* Hair - line art style */}
      <path
        d="M 150 130 Q 160 110 180 105 Q 200 100 220 105 Q 240 110 250 130"
        stroke="#1F2937"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 160 115 Q 170 108 180 106"
        stroke="#1F2937"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 220 106 Q 230 108 240 115"
        stroke="#1F2937"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left eye */}
      <ellipse cx="175" cy="165" rx="6" ry="7" fill="#1F2937" />

      {/* Right eye */}
      <ellipse cx="225" cy="165" rx="6" ry="7" fill="#1F2937" />

      {/* Eyebrows */}
      <path
        d="M 160 150 Q 170 148 180 150"
        stroke="#1F2937"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 220 150 Q 230 148 240 150"
        stroke="#1F2937"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Nose - minimal line */}
      <path
        d="M 200 175 L 200 195 M 195 195 L 205 195"
        stroke="#1F2937"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Mouth - simple smile */}
      <path
        d="M 180 215 Q 200 225 220 215"
        stroke="#1F2937"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Neck */}
      <path
        d="M 175 250 L 175 290"
        stroke="#1F2937"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 225 250 L 225 290"
        stroke="#1F2937"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Shoulders - line art */}
      <path
        d="M 120 290 Q 140 270 175 290 L 175 320"
        stroke="#10B981"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 280 290 Q 260 270 225 290 L 225 320"
        stroke="#10B981"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Collar accent */}
      <path
        d="M 175 290 L 200 310 L 225 290"
        stroke="#10B981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default MaleAvatar2;
