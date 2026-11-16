/**
 * Avatar utility functions for KOMOT profile image handling
 * Handles OAuth images, user uploads, and default avatars
 */

export type Gender = 'male' | 'female' | 'prefer-not-to-say'

export interface Profile {
  profile_image_url?: string | null
  selected_avatar?: string | null
  gender?: Gender | null
}

/**
 * Get profile image URL with fallback priority:
 * 1. OAuth provider image
 * 2. User uploaded image
 * 3. Selected default avatar
 * 4. Random default avatar based on gender
 */
export function getProfileImageUrl(profile: Profile): string {
  // Priority 1: OAuth or uploaded image
  if (profile.profile_image_url) {
    return profile.profile_image_url
  }

  // Priority 2: User selected avatar
  if (profile.selected_avatar) {
    return profile.selected_avatar
  }

  // Priority 3: Random default based on gender
  return getRandomDefaultAvatar(profile.gender || 'prefer-not-to-say')
}

/**
 * Get a specific default avatar by gender and index
 * @param gender - User's gender preference
 * @param index - Avatar index (0-3 for male/female)
 * @returns Avatar identifier string
 */
export function getDefaultAvatarByGender(
  gender: Gender,
  index: number = 0
): string {
  if (gender === 'prefer-not-to-say') {
    // Randomly choose from all avatars
    const allAvatars = [
      ...Array.from({ length: 4 }, (_, i) => `male-${i + 1}`),
      ...Array.from({ length: 4 }, (_, i) => `female-${i + 1}`),
    ]
    return allAvatars[index % allAvatars.length]
  }

  const clampedIndex = Math.max(0, Math.min(3, index))
  return `${gender}-${clampedIndex + 1}`
}

/**
 * Get a random default avatar based on gender
 * @param gender - User's gender preference
 * @returns Random avatar identifier
 */
export function getRandomDefaultAvatar(gender: Gender): string {
  if (gender === 'prefer-not-to-say') {
    // Choose randomly from all 8 avatars
    const randomIndex = Math.floor(Math.random() * 8)
    return randomIndex < 4
      ? `male-${randomIndex + 1}`
      : `female-${randomIndex - 3}`
  }

  // Choose randomly from gender-specific avatars (1-4)
  const randomIndex = Math.floor(Math.random() * 4) + 1
  return `${gender}-${randomIndex}`
}

/**
 * Get all available default avatars for a gender
 * @param gender - Gender to filter by, or 'all' for all avatars
 * @returns Array of avatar identifiers
 */
export function getAvailableAvatars(gender: Gender | 'all' = 'all'): string[] {
  const maleAvatars = Array.from({ length: 4 }, (_, i) => `male-${i + 1}`)
  const femaleAvatars = Array.from({ length: 4 }, (_, i) => `female-${i + 1}`)

  if (gender === 'all' || gender === 'prefer-not-to-say') {
    return [...maleAvatars, ...femaleAvatars]
  }

  return gender === 'male' ? maleAvatars : femaleAvatars
}

/**
 * Parse avatar identifier to get component import path
 * @param avatarId - Avatar identifier (e.g., 'male-1', 'female-3')
 * @returns Object with gender and number for component selection
 */
export function parseAvatarId(avatarId: string): {
  gender: 'male' | 'female'
  number: number
} | null {
  const match = avatarId.match(/^(male|female)-(\d+)$/)
  if (!match) return null

  return {
    gender: match[1] as 'male' | 'female',
    number: parseInt(match[2], 10),
  }
}

/**
 * Check if a URL is an OAuth provider image
 * @param url - Image URL to check
 * @returns true if URL is from Google or GitHub
 */
export function isOAuthImage(url: string): boolean {
  if (!url) return false

  const oauthDomains = [
    'googleusercontent.com',
    'githubusercontent.com',
    'avatars.githubusercontent.com',
    'lh3.googleusercontent.com',
  ]

  return oauthDomains.some(domain => url.includes(domain))
}
