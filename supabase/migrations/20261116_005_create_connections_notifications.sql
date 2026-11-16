-- Migration: Create connections and notifications tables
-- Description: User connections and notification system
-- Author: KOMOT Team
-- Date: 2026-11-16

-- ============================================================================
-- CONNECTIONS TABLE
-- ============================================================================

CREATE TABLE komot.connections (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(requester_id, recipient_id),
  CONSTRAINT no_self_connection CHECK (requester_id != recipient_id)
);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE komot.notifications (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DEPARTMENTS TABLE (for organizations)
-- ============================================================================

CREATE TABLE komot.departments (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES komot.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  head_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_komot_connections_requester ON komot.connections(requester_id);
CREATE INDEX idx_komot_connections_recipient ON komot.connections(recipient_id);
CREATE INDEX idx_komot_connections_status ON komot.connections(status);
CREATE INDEX idx_komot_notifications_user_id ON komot.notifications(user_id);
CREATE INDEX idx_komot_notifications_unread ON komot.notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_komot_departments_org_id ON komot.departments(organization_id);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE komot.connections IS 'User-to-user connection requests and relationships';
COMMENT ON TABLE komot.notifications IS 'User notifications for various events';
COMMENT ON TABLE komot.departments IS 'Organization departments and divisions';
