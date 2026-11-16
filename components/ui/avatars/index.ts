/**
 * KOMOT Digital Identity Platform - Avatar Components
 *
 * Professional default profile avatars for user profiles.
 * Each design offers a unique aesthetic while maintaining brand consistency.
 *
 * Usage:
 * import { MaleAvatar1, FemaleAvatar1 } from '@/components/ui/avatars';
 *
 * <MaleAvatar1 size={64} />
 */

// Male Avatars
export { MaleAvatar1 } from './MaleAvatar1'
export { MaleAvatar2 } from './MaleAvatar2'
export { MaleAvatar3 } from './MaleAvatar3'
export { MaleAvatar4 } from './MaleAvatar4'

// Female Avatars
export { FemaleAvatar1 } from './FemaleAvatar1'
export { FemaleAvatar2 } from './FemaleAvatar2'
export { FemaleAvatar3 } from './FemaleAvatar3'
export { FemaleAvatar4 } from './FemaleAvatar4'

// Type for the avatar props
export interface AvatarProps {
  className?: string
  size?: number
}
