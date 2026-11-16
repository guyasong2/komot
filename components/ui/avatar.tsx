'use client'

import { useState } from 'react'
import Image from 'next/image'
import { User } from 'lucide-react'
import { parseAvatarId } from '@/lib/utils/avatar'
import {
  MaleAvatar1,
  MaleAvatar2,
  MaleAvatar3,
  MaleAvatar4,
  FemaleAvatar1,
  FemaleAvatar2,
  FemaleAvatar3,
  FemaleAvatar4,
} from './avatars'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: number
  className?: string
  fallback?: React.ReactNode
}

/**
 * Smart avatar display component
 * Handles OAuth images, uploaded images, default avatars, and loading states
 * Works with Next.js Image optimization
 */
export function Avatar({
  src,
  alt = 'Profile picture',
  size = 40,
  className = '',
  fallback,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // If src is a default avatar identifier (e.g., 'male-1', 'female-3')
  const avatarInfo = src && !src.startsWith('http') ? parseAvatarId(src) : null

  // Render default avatar component
  if (avatarInfo && !imageError) {
    const avatarComponents = {
      male: [MaleAvatar1, MaleAvatar2, MaleAvatar3, MaleAvatar4],
      female: [FemaleAvatar1, FemaleAvatar2, FemaleAvatar3, FemaleAvatar4],
    }

    const AvatarComponent =
      avatarComponents[avatarInfo.gender]?.[avatarInfo.number - 1]

    if (AvatarComponent) {
      return (
        <div
          className={`relative flex items-center justify-center overflow-hidden rounded-full bg-muted ${className}`}
          style={{ width: size, height: size }}
        >
          <AvatarComponent size={size} />
        </div>
      )
    }
  }

  // Render external image (OAuth or uploaded)
  if (src && src.startsWith('http') && !imageError) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-full bg-muted ${className}`}
        style={{ width: size, height: size }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <User className="w-1/2 h-1/2 text-muted-foreground" />
          </div>
        )}
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={`rounded-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true)
            setIsLoading(false)
          }}
          unoptimized={src.includes('googleusercontent.com') || src.includes('githubusercontent.com')}
        />
      </div>
    )
  }

  // Render fallback
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-full bg-muted ${className}`}
      style={{ width: size, height: size }}
    >
      {fallback || <User className="w-1/2 h-1/2 text-muted-foreground" />}
    </div>
  )
}

interface ProfileAvatarProps {
  profile: {
    profile_image_url?: string | null
    selected_avatar?: string | null
    full_name?: string | null
    username?: string
  }
  size?: number
  className?: string
}

/**
 * Profile-aware avatar component
 * Automatically handles profile image priority and fallbacks
 */
export function ProfileAvatar({ profile, size = 40, className = '' }: ProfileAvatarProps) {
  const src = profile.profile_image_url || profile.selected_avatar
  const alt = profile.full_name || profile.username || 'Profile picture'

  return <Avatar src={src} alt={alt} size={size} className={className} />
}
