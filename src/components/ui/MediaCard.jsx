import { Play, Pause, BarChart2, Plus, ListMusic, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useState } from 'react';

const MediaCard = ({ item, type = 'music' }) => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { user } = useAuth();
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState(new Set());
  
  const isActive = currentTrack?.id === item.id;

  const handlePlay = e => {
    e.preventDefault();
    playTrack(item);
  };

  const togglePlaylists = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert('Sign in to save playlists!');
    
    setShowPlaylists(!showPlaylists);
    if (!showPlaylists && playlists.length === 0) {
      setLoading(true);
      const { data } = await supabase.from('playlists').select('id, title').eq('user_id', user.id);
      setPlaylists(data || []);
      setLoading(false);
    }
  };

  const addToPlaylist = async (e, playlistId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('playlist_tracks')
        .insert({ playlist_id: playlistId, track_id: item.id });
      
      if (error) {
        if (error.code === '23505') alert('Already in playlist!');
        else throw error;
      } else {
        setAddedIds(prev => new Set([...prev, playlistId]));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mc-wrap relative">
      <Link to={`/release/${type}/${item.id}`} className="mc-card">
        <div className="mc-cover-wrap">
          <img src={item.cover || item.thumbnail} alt={item.title} className="mc-cover" />
          <button className={`mc-play-btn ${isActive && isPlaying ? 'mc-playing' : ''}`} onClick={handlePlay}>
            {isActive && isPlaying
              ? <Pause size={18} fill="#fff" />
              : <Play  size={18} fill="#fff" style={{ marginLeft: 2 }} />}
          </button>
          
          <button 
            className={`mc-add-btn ${showPlaylists ? 'active' : ''}`} 
            onClick={togglePlaylists}
            title="Add to Playlist"
          >
            <Plus size={16} />
          </button>

          {item.genre && <span className="mc-genre-tag">{item.genre}</span>}
        </div>
        <div className="mc-body">
          <p className="mc-title">{item.title}</p>
          <p className="mc-artist">{item.artist || item.host}</p>
          {item.streams && (
            <p className="mc-streams"><BarChart2 size={11} /> {item.streams}</p>
          )}
        </div>
      </Link>

      {showPlaylists && (
        <div className="absolute top-2 right-2 z-50 bg-city-dark border border-white/10 rounded-xl shadow-2xl p-2 w-48 fade-in">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray px-2 py-1 mb-1 border-b border-white/5 flex items-center gap-2">
            <ListMusic size={10} /> Save to Collection
          </p>
          <div className="max-h-40 overflow-y-auto clm-scrollbar">
            {loading ? (
              <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-accent-blue" size={16} /></div>
            ) : playlists.length > 0 ? (
              playlists.map(p => (
                <button 
                  key={p.id}
                  onClick={(e) => addToPlaylist(e, p.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-accent-blue hover:text-white flex items-center justify-between group transition-colors"
                >
                  <span className="truncate">{p.title}</span>
                  {addedIds.has(p.id) ? <Check size={12} className="text-green-500 group-hover:text-white" /> : <Plus size={12} className="opacity-0 group-hover:opacity-100" />}
                </button>
              ))
            ) : (
              <Link to="/playlists" className="block p-4 text-center text-[10px] text-gray italic hover:text-white">Create a Playlist first</Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        .mc-wrap { height: 100%; }
        .mc-card {
          display: flex; flex-direction: column;
          background: rgba(255,255,255,0.03); border: 1.5px solid var(--border-light);
          border-radius: 20px; overflow: hidden;
          transition: all 0.25s ease; text-decoration: none;
          height: 100%;
        }
        .mc-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(0,0,0,0.4); border-color: rgba(22,119,255,0.2); }

        .mc-cover-wrap { position: relative; aspect-ratio: 1; overflow: hidden; }
        .mc-cover { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .mc-card:hover .mc-cover { transform: scale(1.06); }

        .mc-play-btn {
          position: absolute; bottom: 10px; right: 10px;
          width: 44px; height: 44px; border-radius: 14px;
          background: var(--accent-blue); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transform: translateY(6px) scale(0.9);
          transition: all 0.2s ease;
          box-shadow: 0 8px 16px rgba(22,119,255,0.3);
          z-index: 5;
        }
        .mc-card:hover .mc-play-btn,
        .mc-play-btn.mc-playing { opacity: 1; transform: translateY(0) scale(1); }

        .mc-add-btn {
          position: absolute; top: 10px; right: 10px;
          width: 32px; height: 32px; border-radius: 10px;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1); color: #fff;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: all 0.2s ease; cursor: pointer;
          z-index: 5;
        }
        .mc-card:hover .mc-add-btn, .mc-add-btn.active { opacity: 1; }
        .mc-add-btn:hover { background: var(--accent-blue); border-color: var(--accent-blue); }

        .mc-genre-tag {
          position: absolute; bottom: 10px; left: 10px;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
          font-size: 0.6rem; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; color: #fff;
          padding: 0.25rem 0.6rem; border-radius: 6px;
          z-index: 5;
        }

        .mc-body { padding: 1rem; flex: 1; display: flex; flex-direction: column; }
        .mc-title {
          font-size: 0.95rem; font-weight: 800; color: #fff;
          margin-bottom: 2px; font-family: 'Outfit', sans-serif;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .mc-artist { font-size: 0.8rem; color: var(--text-gray); margin-bottom: 8px; }
        .mc-streams { font-size: 0.72rem; color: var(--text-muted); display: flex; align-items: center; gap: 3.5px; margin-top: auto; }
      `}</style>
    </div>
  );
};

export default MediaCard;
