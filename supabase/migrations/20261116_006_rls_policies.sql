-- Migration: Row Level Security policies for all KOMOT tables
-- Description: Comprehensive RLS policies ensuring data security and privacy
-- Author: KOMOT Team
-- Date: 2026-11-16

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

ALTER TABLE komot.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.qr_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE komot.departments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Public profiles are viewable by everyone
CREATE POLICY "profiles_select_public"
  ON komot.profiles FOR SELECT
  USING (is_public = true);

-- Users can view their own profile
CREATE POLICY "profiles_select_own"
  ON komot.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile (during onboarding)
CREATE POLICY "profiles_insert_own"
  ON komot.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON komot.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "profiles_delete_own"
  ON komot.profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================================================
-- ORGANIZATIONS POLICIES
-- ============================================================================

-- Public organizations are viewable by everyone
CREATE POLICY "organizations_select_public"
  ON komot.organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM komot.profiles
      WHERE profiles.id = organizations.profile_id
      AND profiles.is_public = true
    )
  );

-- Organization members can view their organization
CREATE POLICY "organizations_select_members"
  ON komot.organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM komot.organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
    )
  );

-- Only organization owners/admins can update
CREATE POLICY "organizations_update_admin"
  ON komot.organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM komot.organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
    )
  );

-- Profile owner can insert organization (during onboarding)
CREATE POLICY "organizations_insert_own"
  ON komot.organizations FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- ============================================================================
-- ORGANIZATION MEMBERS POLICIES
-- ============================================================================

-- Members can view other members in same organization
CREATE POLICY "org_members_select"
  ON komot.organization_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM komot.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
    )
  );

-- Only owners/admins can manage members
CREATE POLICY "org_members_insert"
  ON komot.organization_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM komot.organization_members
      WHERE organization_id = organization_members.organization_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "org_members_update"
  ON komot.organization_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM komot.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "org_members_delete"
  ON komot.organization_members FOR DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM komot.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- EDUCATION POLICIES
-- ============================================================================

-- Public profiles: education is viewable by everyone
CREATE POLICY "education_select_public"
  ON komot.education FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM komot.profiles
      WHERE profiles.id = education.profile_id
      AND profiles.is_public = true
    )
  );

-- Users can view their own education
CREATE POLICY "education_select_own"
  ON komot.education FOR SELECT
  USING (profile_id = auth.uid());

-- Users can manage their own education
CREATE POLICY "education_insert_own"
  ON komot.education FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "education_update_own"
  ON komot.education FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "education_delete_own"
  ON komot.education FOR DELETE
  USING (profile_id = auth.uid());

-- ============================================================================
-- WORK EXPERIENCE POLICIES
-- ============================================================================

CREATE POLICY "work_experience_select_public"
  ON komot.work_experience FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM komot.profiles
      WHERE profiles.id = work_experience.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "work_experience_select_own"
  ON komot.work_experience FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "work_experience_manage_own"
  ON komot.work_experience FOR ALL
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- SKILLS POLICIES
-- ============================================================================

CREATE POLICY "skills_select_public"
  ON komot.skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM komot.profiles
      WHERE profiles.id = skills.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "skills_select_own"
  ON komot.skills FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "skills_manage_own"
  ON komot.skills FOR ALL
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- CERTIFICATIONS POLICIES
-- ============================================================================

CREATE POLICY "certifications_select_public"
  ON komot.certifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM komot.profiles
      WHERE profiles.id = certifications.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "certifications_select_own"
  ON komot.certifications FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "certifications_manage_own"
  ON komot.certifications FOR ALL
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- PROJECTS POLICIES
-- ============================================================================

CREATE POLICY "projects_select_public"
  ON komot.projects FOR SELECT
  USING (
    is_visible = true AND
    EXISTS (
      SELECT 1 FROM komot.profiles
      WHERE profiles.id = projects.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "projects_select_own"
  ON komot.projects FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "projects_manage_own"
  ON komot.projects FOR ALL
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- SOCIAL LINKS POLICIES
-- ============================================================================

CREATE POLICY "social_links_select_public"
  ON komot.social_links FOR SELECT
  USING (
    is_visible = true AND
    EXISTS (
      SELECT 1 FROM komot.profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "social_links_select_own"
  ON komot.social_links FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "social_links_manage_own"
  ON komot.social_links FOR ALL
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- QR CODES POLICIES
-- ============================================================================

CREATE POLICY "qr_codes_select_own"
  ON komot.qr_codes FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "qr_codes_manage_own"
  ON komot.qr_codes FOR ALL
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- QR VISIBILITY POLICIES
-- ============================================================================

CREATE POLICY "qr_visibility_manage"
  ON komot.qr_visibility FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM komot.qr_codes
      WHERE qr_codes.id = qr_visibility.qr_code_id
      AND qr_codes.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM komot.qr_codes
      WHERE qr_codes.id = qr_visibility.qr_code_id
      AND qr_codes.profile_id = auth.uid()
    )
  );

-- ============================================================================
-- ANALYTICS POLICIES (QR SCANS, PROFILE VIEWS, LINK CLICKS)
-- ============================================================================

-- Anyone can insert analytics data (public tracking)
CREATE POLICY "qr_scans_insert_public"
  ON komot.qr_scans FOR INSERT
  WITH CHECK (true);

-- Users can view their own QR scan analytics
CREATE POLICY "qr_scans_select_own"
  ON komot.qr_scans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM komot.qr_codes
      WHERE qr_codes.id = qr_scans.qr_code_id
      AND qr_codes.profile_id = auth.uid()
    )
  );

-- Anyone can insert profile views
CREATE POLICY "profile_views_insert_public"
  ON komot.profile_views FOR INSERT
  WITH CHECK (true);

-- Users can view their own profile analytics
CREATE POLICY "profile_views_select_own"
  ON komot.profile_views FOR SELECT
  USING (profile_id = auth.uid());

-- Anyone can insert link clicks
CREATE POLICY "link_clicks_insert_public"
  ON komot.link_clicks FOR INSERT
  WITH CHECK (true);

-- Users can view their own link click analytics
CREATE POLICY "link_clicks_select_own"
  ON komot.link_clicks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM komot.social_links
      WHERE social_links.id = link_clicks.social_link_id
      AND social_links.profile_id = auth.uid()
    )
  );

-- ============================================================================
-- CONNECTIONS POLICIES
-- ============================================================================

-- Users can view connections where they are involved
CREATE POLICY "connections_select_involved"
  ON komot.connections FOR SELECT
  USING (
    requester_id = auth.uid() OR recipient_id = auth.uid()
  );

-- Users can create connection requests
CREATE POLICY "connections_insert_own"
  ON komot.connections FOR INSERT
  WITH CHECK (requester_id = auth.uid());

-- Users can update connections they're involved in
CREATE POLICY "connections_update_involved"
  ON komot.connections FOR UPDATE
  USING (
    requester_id = auth.uid() OR recipient_id = auth.uid()
  )
  WITH CHECK (
    requester_id = auth.uid() OR recipient_id = auth.uid()
  );

-- Users can delete connections they're involved in
CREATE POLICY "connections_delete_involved"
  ON komot.connections FOR DELETE
  USING (
    requester_id = auth.uid() OR recipient_id = auth.uid()
  );

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

-- Users can only view their own notifications
CREATE POLICY "notifications_select_own"
  ON komot.notifications FOR SELECT
  USING (user_id = auth.uid());

-- System can insert notifications (handled server-side)
CREATE POLICY "notifications_insert"
  ON komot.notifications FOR INSERT
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update_own"
  ON komot.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "notifications_delete_own"
  ON komot.notifications FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- DEPARTMENTS POLICIES
-- ============================================================================

-- Organization members can view departments
CREATE POLICY "departments_select_members"
  ON komot.departments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM komot.organization_members
      WHERE organization_members.organization_id = departments.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );

-- Only owners/admins can manage departments
CREATE POLICY "departments_manage_admin"
  ON komot.departments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM komot.organization_members
      WHERE organization_members.organization_id = departments.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM komot.organization_members
      WHERE organization_members.organization_id = departments.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
    )
  );