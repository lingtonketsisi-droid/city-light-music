-- ============================================================
-- SQL Migration: Fix Storage Permissions
-- Target Bucket: audio-uploads
-- ============================================================

-- 1. Enable Row Level Security (RLS) on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy to allow authenticated users to upload files
-- Policy name: Allow uploads
-- Operation: INSERT
-- Role: authenticated
-- Condition: true
CREATE POLICY "Allow uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Create a policy to allow public access to files
-- Policy name: Allow public read
-- Operation: SELECT
-- Role: public
-- Condition: true
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
TO public
USING (true);

-- 4. Ensure the bucket "audio-uploads" is set to public
-- This ensures that public URLs can be generated and accessed.
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-uploads', 'audio-uploads', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- NOTE: If you use "upsert: true" in your code (as seen in Upload.jsx), 
-- you may also need an UPDATE policy if you intend to overwrite files.
-- You can run the following if needed:
-- CREATE POLICY "Allow updates" ON storage.objects FOR UPDATE TO authenticated USING (true);
