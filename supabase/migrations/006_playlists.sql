-- Create Playlists and Playlist Tracks tables

-- 1. Playlists Table
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Playlist Tracks Table (Junction)
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    added_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(playlist_id, track_id)
);

-- 3. Enable RLS
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Playlists
CREATE POLICY "Public playlists are viewable by everyone" 
ON public.playlists FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can manage their own playlists" 
ON public.playlists FOR ALL 
USING (auth.uid() = user_id);

-- 5. Policies for Playlist Tracks
CREATE POLICY "Public playlist tracks are viewable by everyone" 
ON public.playlist_tracks FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.playlists 
        WHERE id = playlist_tracks.playlist_id AND is_public = true
    )
);

CREATE POLICY "Users can manage tracks in their own playlists" 
ON public.playlist_tracks FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.playlists 
        WHERE id = playlist_tracks.playlist_id AND user_id = auth.uid()
    )
);
