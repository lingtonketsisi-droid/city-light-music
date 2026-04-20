import { useState, useEffect } from 'react';
import { Video, PlayCircle, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (video) => {
    if (!window.confirm("Are you sure you want to delete this music video? This action cannot be undone.")) return;
    
    setDeletingId(video.id);
    try {
      // 1. Delete from bucket
      const { error: storageErr } = await supabase.storage
        .from('video-uploads')
        .remove([video.video_path]);
        
      if (storageErr) throw storageErr;

      // 2. Delete from DB
      const { error: dbErr } = await supabase
        .from('videos')
        .delete()
        .eq('id', video.id);

      if (dbErr) throw dbErr;

      // 3. Update UI
      setVideos(prev => prev.filter(v => v.id !== video.id));
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="vp-page fade-in">
      <AnimatePresence mode="wait">
        <motion.div key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="vp-header flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center gap-2 text-[0.68rem] font-bold tracking-widest uppercase text-gray-400 mb-2">
                <Video size={13} className="text-accent-magenta" /> VIDEO NETWORK
              </div>
              <h1 className="text-4xl font-black font-['Outfit'] tracking-tight">Watch What's Moving</h1>
              <p className="text-gray-400 mt-2">Visual storytelling from independent artists worldwide.</p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="animate-spin text-accent-magenta" size={40} />
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {videos.map(video => (
                <div key={video.id} className="glass-v2 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300">
                  <div className="relative w-full aspect-video bg-black/50 border-b border-light">
                    <video 
                      controls 
                      src={video.video_url} 
                      className="w-full h-full object-contain"
                      preload="metadata"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg leading-tight mb-1">{video.title}</h3>
                    <p className="text-sm text-gray flex-1">{video.artist_name}</p>
                    
                    {currentUser?.id === video.user_id && (
                      <div className="mt-4 pt-4 border-t border-light flex justify-end">
                        <button
                          onClick={() => handleDeleteVideo(video)}
                          disabled={deletingId === video.id}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border border-red-500/20 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {deletingId === video.id ? (
                            <><Loader2 size={13} className="animate-spin" /> Deleting...</>
                          ) : (
                            <><Trash2 size={13} /> Delete Video</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-v2 p-20 text-center rounded-[32px] border border-dashed border-white/10 flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-white/5 shadow-inner rounded-full flex items-center justify-center text-gray-400">
                    <PlayCircle size={40} />
                </div>
                <div className="space-y-2 max-w-sm">
                    <h2 className="text-2xl font-black">No Videos Found</h2>
                    <p className="text-gray-400">The City Light video network is empty. Be the first to premiere your visual stories.</p>
                </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <style>{`
        .vp-page { padding-bottom: 2rem; }
      `}</style>
    </div>
  );
};

export default VideosPage;
