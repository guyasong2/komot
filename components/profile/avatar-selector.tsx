'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Gender, getAvailableAvatars } from '@/lib/utils/avatar'
import {
  MaleAvatar1,
  MaleAvatar2,
  MaleAvatar3,
  MaleAvatar4,
  FemaleAvatar1,
  FemaleAvatar2,
  FemaleAvatar3,
  FemaleAvatar4,
} from '@/components/ui/avatars'
import { Button } from '@/components/ui/button'

interface AvatarSelectorProps {
  gender: Gender
  selectedAvatar?: string | null
  onSelect: (avatarId: string) => void
  className?: string
}

const avatarComponents = {
  'male-1': MaleAvatar1,
  'male-2': MaleAvatar2,
  'male-3': MaleAvatar3,
  'male-4': MaleAvatar4,
  'female-1': FemaleAvatar1,
  'female-2': FemaleAvatar2,
  'female-3': FemaleAvatar3,
  'female-4': FemaleAvatar4,
}

/**
 * Avatar selector component for onboarding
 * Displays grid of default avatars based on gender selection
 * Shows preview of selected avatar
 */
export function AvatarSelector({
  gender,
  selectedAvatar,
  onSelect,
  className = '',
}: AvatarSelectorProps) {
  const availableAvatars = getAvailableAvatars(gender)
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(
    selectedAvatar || null
  )

  const handleAvatarClick = (avatarId: string) => {
    setPreviewAvatar(avatarId)
    onSelect(avatarId)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Preview Section */}
      {previewAvatar && (
        <div className="flex flex-col items-center space-y-3 p-6 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">Selected Avatar</p>
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-background ring-4 ring-primary">
            {(() => {
              const AvatarComponent =
                avatarComponents[previewAvatar as keyof typeof avatarComponents]
              return AvatarComponent ? (
                <AvatarComponent size={96} />
              ) : null
            })()}
          </div>
        </div>
      )}

      {/* Avatar Grid */}
      <div className="space-y-3">
        <p className="text-sm font-medium">
          Choose your avatar {gender !== 'prefer-not-to-say' && `(${gender})`}
        </p>
        <div className="grid grid-cols-4 gap-3">
          {availableAvatars.map((avatarId) => {
            const AvatarComponent =
              avatarComponents[avatarId as keyof typeof avatarComponents]
            const isSelected = previewAvatar === avatarId

            return (
              <button
                key={avatarId}
                type="button"
                onClick={() => handleAvatarClick(avatarId)}
                className={`
                  relative aspect-square rounded-lg overflow-hidden
                  transition-all duration-200
                  hover:scale-105 hover:shadow-lg
                  ${
                    isSelected
                      ? 'ring-4 ring-primary shadow-lg scale-105'
                      : 'ring-2 ring-border hover:ring-primary/50'
                  }
                `}
              >
                {AvatarComponent && (
                  <div className="w-full h-full bg-muted">
                    <AvatarComponent size={100} />
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {!previewAvatar && (
        <p className="text-xs text-muted-foreground text-center">
          Select an avatar above to preview
        </p>
      )}
    </div>
  )
}

interface GenderSelectorProps {
  selected?: Gender | null
  onSelect: (gender: Gender) => void
  className?: string
}

/**
 * Gender selector for avatar assignment
 * Used in onboarding when no OAuth image is available
 */
export function GenderSelector({
  selected,
  onSelect,
  className = '',
}: GenderSelectorProps) {
  const genderOptions: { value: Gender; label: string; description: string }[] = [
    {
      value: 'male',
      label: 'Male',
      description: 'Show male avatar options',
    },
    {
      value: 'female',
      label: 'Female',
      description: 'Show female avatar options',
    },
    {
      value: 'prefer-not-to-say',
      label: 'Prefer not to say',
      description: 'Show all avatar options',
    },
  ]

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-sm font-medium">Select avatar style</p>
      <div className="grid gap-2">
        {genderOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all
              ${
                selected === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              {selected === option.value && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
