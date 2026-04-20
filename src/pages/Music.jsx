import { useState, useEffect } from 'react';
import { Search, Filter, Play, Pause, TrendingUp, Clock, Star, Flame,
  BarChart2, ArrowUpRight, ChevronRight, Headphones, Loader2, Music as MusicIcon, Trash2 } from 'lucide-react';
import { MOCK_MUSIC, MOCK_TRENDING, MOCK_ARTISTS, MOCK_EDITORIAL_PICKS,
  MOCK_HOT_THIS_WEEK } from '../data/mockData';
import MediaCard from '../components/ui/MediaCard';
import ArtistCard from '../components/ui/ArtistCard';
import { usePlayer } from '../context/PlayerContext';
import { supabase } from '../lib/supabase';

const GENRES = ['All', 'Electronic', 'Hip Hop', 'R&B', 'Pop', 'Amapiano', 'Afrobeat', 'Jazz', 'Classical'];
const SORTS  = [
  { id: 'new',      icon: Clock,      label: 'New Releases' },
  { id: 'trending', icon: Flame,      label: 'Trending'      },
  { id: 'top',      icon: Star,       label: 'Top Rated'     },
];

const MusicPage = () => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [genre, setGenre]   = useState('All');
  const [sort, setSort]     = useState('new');
  const [query, setQuery]   = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [deletingTrackId, setDeletingTrackId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user));
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [genre, sort]);

  const handleDeleteTrack = async (track, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${track.title}"?`)) return;

    setDeletingTrackId(track.id);
    try {
      if (track.audio_path) {
        const { error: storageError } = await supabase.storage
          .from('audio-uploads')
          .remove([track.audio_path]);
        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from('tracks')
        .delete()
        .eq('id', track.id);
      
      if (dbError) throw dbError;

      setTracks(prev => prev.filter(t => t.id !== track.id));
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Failed to delete track: ${err.message}`);
    } finally {
      setDeletingTrackId(null);
    }
  };

  const fetchTracks = async () => {
    setLoading(true);
    try {
      let q = supabase
        .from('tracks')
        .select(`
          *,
          releases (
            title,
            cover_url,
            user_id,
            profiles (
              username
            )
          )
        `);

      if (sort === 'new') {
        q = q.order('created_at', { ascending: false });
      }

      const { data, error } = await q;

      if (error) throw error;

      // Transform to match the UI expectations
      const formatted = data.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.releases?.profiles?.username || 'Unknown Artist',
        cover: t.releases?.cover_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
        url: t.audio_url,
        audio_path: t.audio_path,
        user_id: t.releases?.user_id || t.user_id,
        genre: t.genre || 'Music',
        duration: '3:45', // Placeholder
        streams: '0'
      }));

      // Client-side genre filtering for now
      const filtered = genre === 'All' 
        ? formatted 
        : formatted.filter(t => t.genre === genre);

      setTracks(filtered);
    } catch (err) {
      console.error('Error fetching tracks:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayTracks = query
    ? tracks.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.artist.toLowerCase().includes(query.toLowerCase()))
    : tracks;

  return (
    <div className="mu-page fade-in">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="mu-header">
        <div>
          <div className="eyebrow"><Headphones size={13} className="text-blue" /> MUSIC CATALOG</div>
          <h1 className="mu-h1">Discover What's Moving</h1>
          <p className="mu-sub">Stream independent music from artists worldwide — trending now.</p>
        </div>
      </div>

      {/* ── Search + filters ────────────────────────────────── */}
      <div className="mu-controls">
        <div className="mu-search">
          <Search size={16} className="mu-search-ic" />
          <input
            className="mu-search-input"
            placeholder="Search tracks, artists, albums..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="mu-sort-tabs">
          {SORTS.map(s => (
            <button key={s.id}
              className={`mu-sort-tab ${sort === s.id ? 'active' : ''}`}
              onClick={() => setSort(s.id)}>
              <s.icon size={13} /> {s.label}
            </button>
          ))}
        </div>
        <button className="mu-filter-btn"><Filter size={16} /></button>
      </div>

      {/* ── Genre pills ─────────────────────────────────────── */}
      <div className="mu-genres">
        {GENRES.map(g => (
          <button key={g}
            className={`mu-genre-pill ${genre === g ? 'active' : ''}`}
            onClick={() => setGenre(g)}>{g}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-accent-blue" size={40} />
          <p className="text-gray font-bold">Fetching latest music...</p>
        </div>
      ) : displayTracks.length > 0 ? (
        <>
          {/* ── Results list ─────────────────────────────── */}
          <section className="mu-section">
            <div className="section-hd">
              <div>
                <div className="eyebrow"><Flame size={12} className="text-blue" /> LIVE FEED</div>
                <h2>Recent Uploads</h2>
              </div>
            </div>
            <div className="mu-track-list">
              {displayTracks.map((track, i) => {
                const active = currentTrack?.id === track.id;
                return (
                  <div key={track.id}
                    className={`mu-track-row ${active ? 'mu-track-active' : ''}`}
                    onClick={() => playTrack(track)}>
                    <span className="mu-track-num">{active && isPlaying ? '▶' : i + 1}</span>
                    <div className="mu-track-img-wrap">
                      <img src={track.cover} alt={track.title} className="mu-track-img" />
                      <div className="mu-track-play">
                        {active && isPlaying
                          ? <Pause size={14} fill="#fff" />
                          : <Play  size={14} fill="#fff" style={{ marginLeft: 1 }} />}
                      </div>
                    </div>
                    <div className="mu-track-info">
                      <p className="mu-track-title">{track.title}</p>
                      <p className="mu-track-artist">{track.artist}</p>
                    </div>
                    <span className="mu-track-genre">{track.genre}</span>
                    <span className="mu-track-streams"><BarChart2 size={11} /> {track.streams}</span>
                    <span className="mu-track-dur">{track.duration}</span>
                    {currentUser?.id === track.user_id && (
                      <button 
                        className="mu-delete-btn flex items-center justify-center text-sm font-medium transition-colors disabled:opacity-50"
                        onClick={(e) => handleDeleteTrack(track, e)}
                        disabled={deletingTrackId === track.id}
                        title="Delete track"
                      >
                        {deletingTrackId === track.id ? (
                          <span className="flex items-center gap-2 text-xs font-bold whitespace-nowrap"><Loader2 size={13} className="animate-spin" /> Deleting...</span>
                        ) : (
                          <span className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 whitespace-nowrap"><Trash2 size={13} /> Delete</span>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Grid mode for discovery ─────────────────────────────── */}
          <section className="mu-section">
            <div className="section-hd">
              <div>
                <div className="eyebrow"><Star size={12} className="text-gold" /> DISCOVERY</div>
                <h2>Visual Catalog</h2>
              </div>
            </div>
            <div className="mu-releases-grid">
              {displayTracks.map(song => (
                <MediaCard key={song.id} item={song} type="music" />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="glass-v2 p-20 text-center rounded-[32px] space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <MusicIcon size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black">No Music Found</h2>
            <p className="text-gray max-w-sm mx-auto">The district is quiet for now. Be the first to break the silence by uploading your latest release!</p>
          </div>
          <button className="btn-primary" onClick={() => window.location.href='/upload'}>
            Upload Now
          </button>
        </div>
      )}

      <style>{`
        .mu-page { padding-bottom: 2rem; }

        .mu-header { margin-bottom: 2rem; }
        .mu-h1 { font-size: 2.2rem; font-weight: 900; color: var(--text-main); font-family: 'Outfit', sans-serif; letter-spacing: -0.03em; margin: 0.25rem 0; }
        .mu-sub { color: var(--text-gray); font-size: 0.95rem; }

        /* Controls */
        .mu-controls { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .mu-search {
          display: flex; align-items: center; gap: 0.65rem;
          background: rgba(255,255,255,0.03); border: 1.5px solid var(--border-light);
          border-radius: 12px; padding: 0.6rem 1rem; flex: 1; min-width: 220px;
          transition: border-color 0.2s;
        }
        .mu-search:focus-within { border-color: rgba(22,119,255,0.3); }
        .mu-search-ic { color: var(--text-muted); flex-shrink: 0; }
        .mu-search-input { flex: 1; border: none; outline: none; background: transparent; font-size: 0.875rem; color: var(--text-main); }
        .mu-search-input::placeholder { color: var(--text-muted); }

        .mu-sort-tabs { display: flex; gap: 0.4rem; }
        .mu-sort-tab {
          display: flex; align-items: center; gap: 0.35rem;
          background: rgba(255,255,255,0.03); border: 1.5px solid var(--border-light);
          border-radius: 10px; padding: 0.5rem 0.85rem;
          font-size: 0.78rem; font-weight: 700; color: var(--text-gray);
          cursor: pointer; transition: all 0.15s ease; white-space: nowrap;
        }
        .mu-sort-tab:hover { border-color: rgba(22,119,255,0.2); color: var(--accent-blue); }
        .mu-sort-tab.active { background: var(--accent-blue); color: #fff; border-color: var(--accent-blue); }

        .mu-filter-btn {
          width: 40px; height: 40px; background: rgba(255,255,255,0.03);
          border: 1.5px solid var(--border-light); border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-gray); cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
        }
        .mu-filter-btn:hover { border-color: rgba(22,119,255,0.2); color: var(--accent-blue); }

        /* Genre pills */
        .mu-genres { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
        .mu-genre-pill {
          padding: 0.4rem 1rem; background: rgba(255,255,255,0.03);
          border: 1.5px solid var(--border-light); border-radius: 20px;
          font-size: 0.8rem; font-weight: 600; color: var(--text-gray);
          cursor: pointer; transition: all 0.15s ease;
        }
        .mu-genre-pill:hover { border-color: rgba(22,119,255,0.2); color: var(--accent-blue); }
        .mu-genre-pill.active { background: var(--accent-blue); color: #fff; border-color: var(--accent-blue); }

        .mu-section { margin-bottom: 3.5rem; }

        /* Track list */
        .mu-track-list { display: flex; flex-direction: column; gap: 0.35rem; }
        .mu-track-row {
          display: grid;
          grid-template-columns: 28px 48px 1fr auto auto auto auto;
          align-items: center; gap: 1rem;
          padding: 0.75rem 1.25rem;
          border-radius: 12px; cursor: pointer;
          transition: background 0.15s ease;
        }
        .mu-track-row:hover { background: rgba(255,255,255,0.05); }
        .mu-track-active { background: rgba(22,119,255,0.1) !important; }
        .mu-track-num { font-size: 0.82rem; font-weight: 700; color: var(--text-dim); text-align: center; }
        .mu-track-active .mu-track-num { color: var(--accent-blue); }
        .mu-track-img-wrap { position: relative; width: 48px; height: 48px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
        .mu-track-img { width: 100%; height: 100%; object-fit: cover; }
        .mu-track-play {
          position: absolute; inset: 0; background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.15s ease; border-radius: 8px;
        }
        .mu-track-row:hover .mu-track-play,
        .mu-track-active .mu-track-play { opacity: 1; }
        .mu-track-info { min-width: 0; }
        .mu-track-title { font-size: 0.88rem; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mu-track-active .mu-track-title { color: var(--accent-blue); }
        .mu-track-artist { font-size: 0.75rem; color: var(--text-gray); }
        .mu-track-genre { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.2rem 0.6rem; border-radius: 20px; background: var(--bg-elevated); color: var(--text-gray); white-space: nowrap; }
        .mu-track-streams { font-size: 0.72rem; color: var(--text-muted); display: flex; align-items: center; gap: 3px; white-space: nowrap; }
        .mu-track-dur { font-size: 0.72rem; color: var(--text-dim); font-variant-numeric: tabular-nums; }

        /* Releases grid */
        .mu-releases-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.25rem; }
        @media (max-width: 1300px) { .mu-releases-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 1000px) { .mu-releases-grid { grid-template-columns: repeat(3, 1fr); } }

        .mu-delete-btn { display: flex; align-items: center; justify-content: center; height: 28px; padding: 0 10px; border-radius: 8px; color: var(--text-dim); transition: all 0.15s ease; border: none; background: transparent; cursor: pointer; }
        .mu-delete-btn:hover:not(:disabled) { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .mu-delete-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 900px) {
          .mu-track-row { grid-template-columns: 24px 44px 1fr auto auto; }
          .mu-track-genre, .mu-track-streams { display: none; }
        }
      `}</style>
    </div>
  );
};

export default MusicPage;
