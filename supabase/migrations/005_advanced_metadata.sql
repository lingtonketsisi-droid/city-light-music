-- Add advanced metadata fields for professional distribution

-- 1. Extend the releases table
ALTER TABLE public.releases 
ADD COLUMN IF NOT EXISTS main_artist text,
ADD COLUMN IF NOT EXISTS featured_artists text,
ADD COLUMN IF NOT EXISTS producer text,
ADD COLUMN IF NOT EXISTS record_label text,
ADD COLUMN IF NOT EXISTS copyright_year text,
ADD COLUMN IF NOT EXISTS copyright_owner text,
ADD COLUMN IF NOT EXISTS genre text,
ADD COLUMN IF NOT EXISTS is_explicit boolean DEFAULT false;

-- 2. Extend the tracks table
ALTER TABLE public.tracks
ADD COLUMN IF NOT EXISTS version_type text,
ADD COLUMN IF NOT EXISTS composer_songwriter text,
ADD COLUMN IF NOT EXISTS primary_language text;
