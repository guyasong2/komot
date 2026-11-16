-- Row Level Security Policies for KOMOT
-- This migration sets up security policies for all tables

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Public organizations are viewable by everyone"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = organizations.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "Organization members can view their organization"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can update their organization"
  ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
    )
  );

-- Education policies
CREATE POLICY "Public education is viewable by everyone"
  ON education FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = education.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "Users can manage their own education"
  ON education FOR ALL
  USING (profile_id = auth.uid());

-- Work experience policies
CREATE POLICY "Public work experience is viewable by everyone"
  ON work_experience FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = work_experience.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "Users can manage their own work experience"
  ON work_experience FOR ALL
  USING (profile_id = auth.uid());

-- Skills policies
CREATE POLICY "Public skills are viewable by everyone"
  ON skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = skills.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "Users can manage their own skills"
  ON skills FOR ALL
  USING (profile_id = auth.uid());

-- Certifications policies
CREATE POLICY "Public certifications are viewable by everyone"
  ON certifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = certifications.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "Users can manage their own certifications"
  ON certifications FOR ALL
  USING (profile_id = auth.uid());

-- Projects policies
CREATE POLICY "Public projects are viewable by everyone"
  ON projects FOR SELECT
  USING (
    is_visible = true AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = projects.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "Users can manage their own projects"
  ON projects FOR ALL
  USING (profile_id = auth.uid());

-- Social links policies
CREATE POLICY "Public social links are viewable by everyone"
  ON social_links FOR SELECT
  USING (
    is_visible = true AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.is_public = true
    )
  );

CREATE POLICY "Users can manage their own social links"
  ON social_links FOR ALL
  USING (profile_id = auth.uid());

-- QR codes policies
CREATE POLICY "Users can view their own QR codes"
  ON qr_codes FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can manage their own QR codes"
  ON qr_codes FOR ALL
  USING (profile_id = auth.uid());

-- QR visibility policies
CREATE POLICY "Users can manage QR visibility"
  ON qr_visibility FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM qr_codes
      WHERE qr_codes.id = qr_visibility.qr_code_id
      AND qr_codes.profile_id = auth.uid()
    )
  );

-- QR scans policies (analytics)
CREATE POLICY "Anyone can insert QR scans"
  ON qr_scans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own QR scan analytics"
  ON qr_scans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM qr_codes
      WHERE qr_codes.id = qr_scans.qr_code_id
      AND qr_codes.profile_id = auth.uid()
    )
  );

-- Connections policies
CREATE POLICY "Users can view their own connections"
  ON connections FOR SELECT
  USING (
    requester_id = auth.uid() OR recipient_id = auth.uid()
  );

CREATE POLICY "Users can create connection requests"
  ON connections FOR INSERT
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update connections they're part of"
  ON connections FOR UPDATE
  USING (
    requester_id = auth.uid() OR recipient_id = auth.uid()
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Profile views policies (analytics)
CREATE POLICY "Anyone can insert profile views"
  ON profile_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own profile analytics"
  ON profile_views FOR SELECT
  USING (profile_id = auth.uid());

-- Link clicks policies (analytics)
CREATE POLICY "Anyone can insert link clicks"
  ON link_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own link click analytics"
  ON link_clicks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM social_links
      WHERE social_links.id = link_clicks.social_link_id
      AND social_links.profile_id = auth.uid()
    )
  );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connections_updated_at
  BEFORE UPDATE ON connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
