-- Migration: Create KOMOT schema and core tables
-- Description: Initialize the komot schema with profiles, organizations, and member management
-- Author: KOMOT Team
-- Date: 2026-11-16

-- Create dedicated komot schema
CREATE SCHEMA IF NOT EXISTS komot;

-- Enable UUID extension in komot schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- Grant usage on komot schema
GRANT USAGE ON SCHEMA komot TO postgres, anon, authenticated, service_role;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA komot GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA komot GRANT SELECT ON TABLES TO anon, authenticated;

-- ============================================================================
-- CORE IDENTITY TABLES
-- ============================================================================

-- Profiles table (extends Supabase Auth users)
CREATE TABLE komot.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL CHECK (account_type IN ('individual', 'organization')),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  location TEXT,
  profile_image_url TEXT,
  cover_image_url TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]+$'),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30)
);

-- Organizations table
CREATE TABLE komot.organizations (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID UNIQUE NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  logo_url TEXT,
  official_email TEXT,
  official_phone TEXT,
  address TEXT,
  founded_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_email CHECK (official_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR official_email IS NULL)
);

-- Organization members table
CREATE TABLE komot.organization_members (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES komot.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'social_manager')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(organization_id, user_id)
);

-- ============================================================================
-- INDEXES FOR CORE TABLES
-- ============================================================================

CREATE INDEX idx_komot_profiles_username ON komot.profiles(username);
CREATE INDEX idx_komot_profiles_account_type ON komot.profiles(account_type);
CREATE INDEX idx_komot_profiles_is_public ON komot.profiles(is_public);
CREATE INDEX idx_komot_organizations_profile_id ON komot.organizations(profile_id);
CREATE INDEX idx_komot_org_members_org_id ON komot.organization_members(organization_id);
CREATE INDEX idx_komot_org_members_user_id ON komot.organization_members(user_id);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON SCHEMA komot IS 'KOMOT digital identity platform schema';
COMMENT ON TABLE komot.profiles IS 'Core user and organization profiles';
COMMENT ON TABLE komot.organizations IS 'Organization-specific details';
COMMENT ON TABLE komot.organization_members IS 'Organization team members and their roles';
