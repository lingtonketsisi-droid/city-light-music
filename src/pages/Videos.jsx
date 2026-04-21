import { useState, useEffect, useRef } from 'react';
import { 
  Video, PlayCircle, Loader2, Trash2, Heart, Share2, 
  Bookmark, UserPlus, ChevronRight, Globe, BarChart2,
  MoreVertical, ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import VideoCard from '../components/ui/VideoCard';

const CATEGORIES = ["Mixed", "Afrobeat", "Official Video", "Live Performance", "Hip Hop", "Behind Scenes", "Interviews"];

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Mixed");
  const [deletingId, setDeletingId] = useState(null);
  const featuredRef = useRef(null);

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
      const relVideos = data || [];
      setVideos(relVideos);
      if (relVideos.length > 0) setFeaturedVideo(relVideos[0]);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (video, e) => {
    e?.stopPropagation();
    if (!window.confirm("Delete this video permanently?")) return;
    
    setDeletingId(video.id);
    try {
      await supabase.storage.from('video-uploads').remove([video.video_path]);
      await supabase.from('videos').delete().eq('id', video.id);
      setVideos(prev => prev.filter(v => v.id !== video.id));
      if (featuredVideo?.id === video.id) setFeaturedVideo(null);
    } catch (error) {
      console.error('Error deleting video:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredVideos = activeCategory === "Mixed" 
    ? videos 
    : videos.filter(v => v.title.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory === "Mixed");

  return (
    <div className="vp-broadcast-page fade-in">
      {loading ? (
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-accent-magenta" size={48} />
        </div>
      ) : videos.length > 0 ? (
        <div className="vp-layout-container lg:grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_420px] gap-8">
          
          {/* MAIN COLUMN: Watch Experience */}
          <main className="vp-watch-main">
            <AnimatePresence mode="wait">
              {featuredVideo && (
                <motion.div 
                  key={featuredVideo.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="vp-hero-watch"
                >
                  {/* Premium Player Container */}
                  <div className="vp-player-stage glass-v2 shadow-2xl rounded-2xl overflow-hidden border border-white/5 relative bg-black">
                    <video 
                      ref={featuredRef}
                      src={featuredVideo.video_url} 
                      className="w-full aspect-video object-contain h-full"
                      controls
                      autoPlay
                      preload="auto"
                    />
                    <div className="video-on-air-badge">
                       <span className="on-air-pulse" /> ON AIR
                    </div>
                  </div>

                  {/* Metadata & Discovery Row */}
                  <div className="vp-info-block mt-6">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-[10px] font-black text-accent-magenta tracking-[0.2em] uppercase">
                          <Globe size={10} /> World Wide Premiere
                       </div>
                       <h1 className="text-3xl font-black tracking-tight leading-tight uppercase font-['Outfit']">
                         {featuredVideo.title}
                       </h1>
                       <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase mt-1">
                          <p>{featuredVideo.artist_name}</p>
                          <span className="w-1 h-1 bg-white/20 rounded-full" />
                          <p>1.2M Views</p>
                          <span className="w-1 h-1 bg-white/20 rounded-full" />
                          <p>Released {new Date(featuredVideo.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>

                    {/* Engagement Actions */}
                    <div className="vp-engagement-row mt-8 flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-white/5">
                        <div className="flex items-center gap-4">
                           <button className="vp-action-btn group">
                              <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-accent-magenta/20 group-hover:text-accent-magenta transition-all">
                                <Heart size={18} fill={false ? "currentColor" : "none"} />
                              </div>
                              <span className="text-[10px] font-black uppercase">Appreciate</span>
                           </button>
                           <button className="vp-action-btn group">
                              <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-accent-blue/20 group-hover:text-accent-blue transition-all">
                                <Share2 size={18} />
                              </div>
                              <span className="text-[10px] font-black uppercase">Broadcast</span>
                           </button>
                           <button className="vp-action-btn group">
                              <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-white/20 transition-all">
                                <Bookmark size={18} />
                              </div>
                              <span className="text-[10px] font-black uppercase">Save</span>
                           </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                           <button className="broadcast-follow-btn">
                              <UserPlus size={16} />
                              <span>SUBSCRIBE TO ARTIST</span>
                           </button>
                           <button className="p-2 rounded-full hover:bg-white/5 text-gray-400">
                              <MoreVertical size={18} />
                           </button>
                        </div>
                    </div>

                    {/* Description Area */}
                    <div className="vp-desc-card mt-6 p-6 rounded-2xl bg-white/5 border border-white/5">
                       <p className="text-sm text-gray-300 font-medium leading-relaxed">
                          Visual presentation for "{featuredVideo.title}" by {featuredVideo.artist_name}. <br />
                          Exclusive premiere on the City Light Video Network. Support the artist by appreciating and sharing this broadcast.
                       </p>
                       <div className="mt-4 flex gap-2">
                          <span className="text-[10px] font-bold text-accent-magenta">#CityLightMusic</span>
                          <span className="text-[10px] font-bold text-accent-blue">#VisualArts</span>
                          <span className="text-[10px] font-bold text-gray-500">#IndependentArtists</span>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* SIDE COLUMN: Recommendations */}
          <aside className="vp-side-rail">
            <div className="vp-rail-header mb-4 flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Up Next</h3>
              <div className="h-[1px] flex-1 mx-4 bg-white/5" />
            </div>

            {/* Category Chips */}
            <div className="vp-categories-rail flex gap-2 overflow-x-auto pb-4 mb-4 clm-scrollbar no-scrollbar">
               {CATEGORIES.map(cat => (
                 <button
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`vp-cat-chip ${activeCategory === cat ? 'active' : ''}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>

            <div className="vp-recommendation-list space-y-4">
              {filteredVideos.filter(v => v.id !== featuredVideo?.id).map(v => (
                <div key={v.id} onClick={() => {
                  setFeaturedVideo(v);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                  <VideoCard 
                    video={v} 
                    variant="horizontal"
                    isOwner={currentUser?.id === v.user_id} 
                    onDelete={handleDeleteVideo}
                    deletingId={deletingId}
                  />
                </div>
              ))}
              {filteredVideos.length <= 1 && (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl">
                   <p className="text-[10px] font-bold text-gray-500 uppercase">End of Broadcast Feed</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : (
        <div className="vp-empty-state h-[70vh] flex flex-col items-center justify-center text-center p-10">
          <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-gray-600 mb-6 border border-white/5 shadow-2xl">
            <Video size={40} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight font-['Outfit']">Void In Signal</h2>
          <p className="text-gray-500 mt-2 max-w-xs font-bold text-xs uppercase tracking-widest leading-loose">The video network has no active streams. Switch to the Control Room to distribute new visual assets.</p>
        </div>
      )}

      <style>{`
        .vp-broadcast-page { padding: 2rem; background-color: #050505; min-height: 100vh; color: #fff; }
        
        .on-air-pulse { width: 8px; height: 8px; background: #FF0080; border-radius: 50%; display: inline-block; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0.5; } }
        
        .video-on-air-badge { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); padding: 4px 12px; border-radius: 4px; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.1); }

        .vp-action-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; color: #71717A; transition: all 0.2s; }
        .vp-action-btn:hover { color: #fff; transform: translateY(-2px); }

        .broadcast-follow-btn { background: #fff; color: #000; padding: 10px 20px; border-radius: 4px; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; display: flex; align-items: center; gap: 10px; transition: all 0.2s; }
        .broadcast-follow-btn:hover { background: #FF0080; color: #fff; box-shadow: 0 0 20px rgba(255,0,128,0.4); }

        .vp-cat-chip { background: rgba(255,255,255,0.05); color: #71717A; padding: 6px 14px; border-radius: 6px; font-size: 10px; font-weight: 900; white-space: nowrap; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.03); }
        .vp-cat-chip:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .vp-cat-chip.active { background: #fff; color: #000; border-color: #fff; }

        .clm-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @media (max-width: 1024px) {
           .vp-broadcast-page { padding: 1rem; }
           .vp-side-rail { margin-top: 3rem; }
           .vp-categories-rail { margin-left: -1rem; margin-right: -1rem; padding-left: 1rem; padding-right: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default VideosPage;
