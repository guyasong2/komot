-- Migration: Storage buckets and policies
-- Description: Create storage buckets for profile images and configure access policies
-- Author: KOMOT Team
-- Date: 2026-11-16
-- Note: This creates the bucket configuration; actual bucket creation happens via Supabase Dashboard or CLI

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Insert storage bucket for profile images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Insert storage bucket for cover images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cover-images',
  'cover-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Insert storage bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Profile images: Anyone can view
CREATE POLICY "profile_images_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Profile images: Authenticated users can upload their own
CREATE POLICY "profile_images_insert_own"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Profile images: Users can update their own
CREATE POLICY "profile_images_update_own"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Profile images: Users can delete their own
CREATE POLICY "profile_images_delete_own"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Cover images: Anyone can view
CREATE POLICY "cover_images_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'cover-images');

-- Cover images: Authenticated users can upload their own
CREATE POLICY "cover_images_insert_own"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cover-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Cover images: Users can update their own
CREATE POLICY "cover_images_update_own"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'cover-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Cover images: Users can delete their own
CREATE POLICY "cover_images_delete_own"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'cover-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Project images: Anyone can view
CREATE POLICY "project_images_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Project images: Authenticated users can upload their own
CREATE POLICY "project_images_insert_own"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Project images: Users can update their own
CREATE POLICY "project_images_update_own"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Project images: Users can delete their own
CREATE POLICY "project_images_delete_own"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "profile_images_select_public" ON storage.objects IS 'Anyone can view profile images';
COMMENT ON POLICY "cover_images_select_public" ON storage.objects IS 'Anyone can view cover images';
COMMENT ON POLICY "project_images_select_public" ON storage.objects IS 'Anyone can view project images';
