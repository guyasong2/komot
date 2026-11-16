-- Migration: Add avatar and gender fields to profiles
-- Description: Add gender and selected_avatar fields to support avatar selection and OAuth image handling
-- Author: KOMOT Team
-- Date: 2026-11-16

-- Add gender field for avatar preference
ALTER TABLE komot.profiles
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'prefer-not-to-say') OR gender IS NULL);

-- Add selected_avatar field to store chosen default avatar identifier
ALTER TABLE komot.profiles
ADD COLUMN IF NOT EXISTS selected_avatar TEXT;

-- Add comments
COMMENT ON COLUMN komot.profiles.gender IS 'Gender preference for default avatar selection';
COMMENT ON COLUMN komot.profiles.selected_avatar IS 'Selected default avatar identifier (e.g., male-1, female-3)';
COMMENT ON COLUMN komot.profiles.profile_image_url IS 'Profile image URL from OAuth provider or user upload';

-- Create index for faster avatar queries
CREATE INDEX IF NOT EXISTS idx_komot_profiles_gender ON komot.profiles(gender);
