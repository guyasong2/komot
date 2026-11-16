-- Migration: Create social and QR code tables
-- Description: Social media links and QR code management system
-- Author: KOMOT Team
-- Date: 2026-11-16

-- ============================================================================
-- SOCIAL LINKS TABLE
-- ============================================================================

CREATE TABLE komot.social_links (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_url CHECK (url ~* '^https?://.*')
);

-- ============================================================================
-- QR CODE TABLES
-- ============================================================================

-- QR codes table
CREATE TABLE komot.qr_codes (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  qr_name TEXT NOT NULL,
  qr_token TEXT UNIQUE NOT NULL,
  qr_type TEXT NOT NULL CHECK (qr_type IN ('individual', 'organization')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT token_format CHECK (qr_token ~ '^[a-zA-Z0-9_-]+$'),
  CONSTRAINT token_length CHECK (char_length(qr_token) >= 16)
);

-- QR visibility settings
CREATE TABLE komot.qr_visibility (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  qr_code_id UUID NOT NULL REFERENCES komot.qr_codes(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,

  UNIQUE(qr_code_id, section_name)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_komot_social_links_profile_id ON komot.social_links(profile_id);
CREATE INDEX idx_komot_social_links_visible ON komot.social_links(profile_id, is_visible);
CREATE INDEX idx_komot_social_links_display_order ON komot.social_links(profile_id, display_order);
CREATE INDEX idx_komot_qr_codes_profile_id ON komot.qr_codes(profile_id);
CREATE INDEX idx_komot_qr_codes_token ON komot.qr_codes(qr_token);
CREATE INDEX idx_komot_qr_codes_active ON komot.qr_codes(profile_id, is_active);
CREATE INDEX idx_komot_qr_visibility_qr_code_id ON komot.qr_visibility(qr_code_id);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE komot.social_links IS 'Social media links and custom URLs';
COMMENT ON TABLE komot.qr_codes IS 'Dynamic QR codes for profiles';
COMMENT ON TABLE komot.qr_visibility IS 'Per-QR code section visibility settings';
