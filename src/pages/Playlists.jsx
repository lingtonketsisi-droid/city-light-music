import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  Play, Plus, Music, ListMusic, Loader2, 
  MoreVertical, Trash2, Clock, Headphones, Disc
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const PlaylistsPage = () => {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (user) fetchPlaylists();
  }, [user]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_tracks (
            track_id,
            tracks (
              title,
              audio_url,
              releases (
                cover_url,
                profiles (username)
              )
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (err) {
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          user_id: user.id,
          title: newTitle.trim(),
          is_public: true
        })
        .select()
        .single();

      if (error) throw error;
      setPlaylists([data, ...playlists]);
      setNewTitle('');
    } catch (err) {
      console.error('Error creating playlist:', err);
    } finally {
      setCreating(false);
    }
  };

  const deletePlaylist = async (id) => {
    if (!window.confirm('Delete this playlist?')) return;
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setPlaylists(playlists.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (!user) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-black mb-4">Your Private District</h2>
      <p className="text-gray mb-8">Sign in to start building your personal music collections.</p>
      <Link to="/auth" className="btn-primary">Sign In</Link>
    </div>
  );

  return (
    <div className="playlists-page fade-in p-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <ListMusic className="text-accent-blue" size={36} /> My Playlists
          </h1>
          <p className="text-gray">Curate your own soundscapes within the district.</p>
        </div>
        <form onSubmit={createPlaylist} className="flex gap-2">
          <input 
            className="w-64 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-accent-blue"
            placeholder="Playlist Title..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <button type="submit" disabled={creating} className="btn-primary py-2 px-6 flex items-center gap-2">
            {creating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Create
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-accent-blue" size={40} />
          <p className="text-gray font-bold">InSyncing collections...</p>
        </div>
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {playlists.map(playlist => (
            <div key={playlist.id} className="glass-v2 p-6 rounded-[24px] group hover:border-accent-blue/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent-blue/10 rounded-xl flex items-center justify-center text-accent-blue">
                    <Headphones size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black truncate max-w-[200px]">{playlist.title}</h2>
                    <p className="text-xs text-gray uppercase tracking-widest font-black">
                      {playlist.playlist_tracks?.length || 0} TRACKS
                    </p>
                  </div>
                </div>
                <button onClick={() => deletePlaylist(playlist.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-2 mt-6">
                {(playlist.playlist_tracks || []).slice(0, 3).map((pt, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer" onClick={() => playTrack({
                    id: pt.tracks.id,
                    title: pt.tracks.title,
                    artist: pt.tracks.releases?.profiles?.username,
                    cover: pt.tracks.releases?.cover_url,
                    url: pt.tracks.audio_url
                  })}>
                    <img src={pt.tracks.releases?.cover_url} className="w-8 h-8 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{pt.tracks.title}</p>
                    </div>
                    <Play size={12} className="text-gray-600 group-hover:text-accent-blue transition-colors" />
                  </div>
                ))}
                {playlist.playlist_tracks?.length > 3 && (
                  <p className="text-xs text-center text-gray pt-2">+ {playlist.playlist_tracks.length - 3} more</p>
                )}
                {(!playlist.playlist_tracks || playlist.playlist_tracks.length === 0) && (
                  <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-xl text-gray-600 italic text-sm">
                    Empty Playlist
                  </div>
                )}
              </div>
              
              <Link to={`/playlist/${playlist.id}`} className="block w-full text-center mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all font-black text-xs uppercase tracking-widest">
                Open Collection
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-6 glass-v2 rounded-[32px]">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
             <ListMusic size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black">No Collections Yet</h2>
            <p className="text-gray max-w-sm mx-auto">Create your first playlist and start organizing the city's finest tracks.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;
