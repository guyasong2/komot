-- Migration: Create journey tables (education, work, skills, certifications, projects)
-- Description: Tables for individual academic and professional journeys
-- Author: KOMOT Team
-- Date: 2026-11-16

-- ============================================================================
-- JOURNEY TABLES
-- ============================================================================

-- Education table
CREATE TABLE komot.education (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  achievements TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_education_dates CHECK (
    (start_date IS NULL OR end_date IS NULL OR start_date <= end_date) AND
    (is_current = false OR end_date IS NULL)
  )
);

-- Work experience table
CREATE TABLE komot.work_experience (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_work_dates CHECK (
    (start_date IS NULL OR end_date IS NULL OR start_date <= end_date) AND
    (is_current = false OR end_date IS NULL)
  )
);

-- Skills table
CREATE TABLE komot.skills (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency TEXT CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications table
CREATE TABLE komot.certifications (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  issuing_organization TEXT,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_cert_dates CHECK (
    issue_date IS NULL OR expiry_date IS NULL OR issue_date <= expiry_date
  )
);

-- Projects table
CREATE TABLE komot.projects (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES komot.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  project_url TEXT,
  image_url TEXT,
  start_date DATE,
  end_date DATE,
  technologies TEXT[],
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_project_dates CHECK (
    start_date IS NULL OR end_date IS NULL OR start_date <= end_date
  )
);

-- ============================================================================
-- INDEXES FOR JOURNEY TABLES
-- ============================================================================

CREATE INDEX idx_komot_education_profile_id ON komot.education(profile_id);
CREATE INDEX idx_komot_education_display_order ON komot.education(profile_id, display_order);
CREATE INDEX idx_komot_work_experience_profile_id ON komot.work_experience(profile_id);
CREATE INDEX idx_komot_work_experience_display_order ON komot.work_experience(profile_id, display_order);
CREATE INDEX idx_komot_skills_profile_id ON komot.skills(profile_id);
CREATE INDEX idx_komot_certifications_profile_id ON komot.certifications(profile_id);
CREATE INDEX idx_komot_projects_profile_id ON komot.projects(profile_id);
CREATE INDEX idx_komot_projects_visible ON komot.projects(profile_id, is_visible);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE komot.education IS 'Academic journey and educational background';
COMMENT ON TABLE komot.work_experience IS 'Professional work history';
COMMENT ON TABLE komot.skills IS 'Skills and competencies';
COMMENT ON TABLE komot.certifications IS 'Professional certifications and credentials';
COMMENT ON TABLE komot.projects IS 'Portfolio projects and accomplishments';
