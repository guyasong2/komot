-- Migration: Create analytics tables
-- Description: Tables for tracking profile views, QR scans, and link clicks
-- Author: KOMOT Team
-- Date: 2026-11-16

-- ============================================================================
-- ANALYTICS TABLES
-- ============================================================================

-- QR scans analytics
CREATE TABLE komot.qr_scans (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  qr_code_id UUID NOT NULL REFERENCES komot.qr_codes(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  country TEXT,
  city TEXT
);

-- Profile views analytics
CREATE TABLE komot.profile_views (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  referrer TEXT,
  ip_address INET
);

-- Social link clicks analytics
CREATE TABLE komot.link_clicks (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  social_link_id UUID NOT NULL REFERENCES komot.social_links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR ANALYTICS
-- ============================================================================

CREATE INDEX idx_komot_qr_scans_qr_code_id ON komot.qr_scans(qr_code_id);
CREATE INDEX idx_komot_qr_scans_scanned_at ON komot.qr_scans(qr_code_id, scanned_at DESC);
CREATE INDEX idx_komot_profile_views_profile_id ON komot.profile_views(profile_id);
CREATE INDEX idx_komot_profile_views_viewed_at ON komot.profile_views(profile_id, viewed_at DESC);
CREATE INDEX idx_komot_link_clicks_link_id ON komot.link_clicks(social_link_id);
CREATE INDEX idx_komot_link_clicks_clicked_at ON komot.link_clicks(social_link_id, clicked_at DESC);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE komot.qr_scans IS 'QR code scan tracking for analytics';
COMMENT ON TABLE komot.profile_views IS 'Profile view tracking for analytics';
COMMENT ON TABLE komot.link_clicks IS 'Social link click tracking for analytics';
