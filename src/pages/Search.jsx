import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Music, Users, Disc, Loader2, AlertCircle, Play, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MediaCard from '../components/ui/MediaCard';
import ArtistCard from '../components/ui/ArtistCard';
import { usePlayer } from '../context/PlayerContext';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ tracks: [], artists: [], albums: [] });
  const [loading, setLoading] = useState(false);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // 1. Search Tracks
      const { data: tracks } = await supabase
        .from('tracks')
        .select('*, releases(title, cover_url, profiles(username))')
        .ilike('title', `%${query}%`)
        .limit(10);

      // 2. Search Artists (Profiles)
      const { data: artists } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${query}%`)
        .limit(10);

      // 3. Search Releases (Albums)
      const { data: albums } = await supabase
        .from('releases')
        .select('*, profiles(username)')
        .ilike('title', `%${query}%`)
        .limit(10);

      setResults({
        tracks: (tracks || []).map(t => ({
          id: t.id,
          title: t.title,
          artist: t.releases?.profiles?.username || 'Unknown',
          cover: t.releases?.cover_url,
          url: t.audio_url
        })),
        artists: (artists || []).map(a => ({
          ...a,
          name: a.username,
          avatar: a.avatar_url
        })),
        albums: (albums || []).map(al => ({
          id: al.id,
          title: al.title,
          artist: al.profiles?.username,
          cover: al.cover_url
        }))
      });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasResults = results.tracks.length > 0 || results.artists.length > 0 || results.albums.length > 0;

  return (
    <div className="search-page fade-in p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-2">Search Results</h1>
        <p className="text-gray italic">Showing results for "{query}"</p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-accent-blue" size={40} />
          <p className="text-gray font-bold">Scanning the district...</p>
        </div>
      ) : hasResults ? (
        <div className="space-y-12">
          {results.artists.length > 0 && (
            <section>
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <Users size={20} className="text-accent-blue" /> Artists
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {results.artists.map(artist => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {results.tracks.length > 0 && (
            <section>
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <Music size={20} className="text-accent-blue" /> Tracks
              </h2>
              <div className="space-y-2">
                {results.tracks.map((track, i) => {
                  const active = currentTrack?.id === track.id;
                  return (
                    <div 
                      key={track.id}
                      className={`flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer ${active ? 'bg-accent-blue/10' : ''}`}
                      onClick={() => playTrack(track)}
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={track.cover} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                           {active && isPlaying ? <Pause size={16} fill="#fff" /> : <Play size={16} fill="#fff" />}
                        </div>
                      </div>
                      <div className="flex-1 min-width-0">
                        <p className={`font-bold truncate ${active ? 'text-accent-blue' : ''}`}>{track.title}</p>
                        <p className="text-xs text-gray truncate">{track.artist}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {results.albums.length > 0 && (
            <section>
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <Disc size={20} className="text-accent-blue" /> Albums & Releases
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {results.albums.map(album => (
                  <MediaCard key={album.id} item={album} type="music" />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 glass-v2 rounded-[32px]">
          <AlertCircle size={48} className="mx-auto text-gray-600" />
          <h2 className="text-2xl font-black">No Results Found</h2>
          <p className="text-gray max-w-xs mx-auto">We couldn't find any artists, tracks, or albums matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
