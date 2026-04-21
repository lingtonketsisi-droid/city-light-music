-- Enhance profiles table and add genre metadata to content

-- 1. Extend Profiles (Artists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT;

-- 2. Add genre_slug to Releases and Tracks
ALTER TABLE public.releases 
ADD COLUMN IF NOT EXISTS genre_slug TEXT;

ALTER TABLE public.tracks 
ADD COLUMN IF NOT EXISTS genre_slug TEXT;

-- 3. [Update] Make sure music/videos/tracks select is public
-- (Existing policies might need adjustment if users want public browsing)
-- Assuming we want public readability for discovery:

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone' AND tablename = 'profiles') THEN
        CREATE POLICY "Public profiles are viewable by everyone" 
        ON public.profiles FOR SELECT 
        USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public releases are viewable by everyone' AND tablename = 'releases') THEN
        CREATE POLICY "Public releases are viewable by everyone" 
        ON public.releases FOR SELECT 
        USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public tracks are viewable by everyone' AND tablename = 'tracks') THEN
        CREATE POLICY "Public tracks are viewable by everyone" 
        ON public.tracks FOR SELECT 
        USING (true);
    END IF;
END $$;
