import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Flame, PlayCircle, Star, Pause, Loader2, Video as VideoIcon, 
  Crown, ChevronRight, Sparkles, TrendingUp
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const Home = () => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // 1. Fetch Tracks
      const { data: tData } = await supabase
        .from('tracks')
        .select(`*, releases (title, cover_url, profiles (username))`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (tData) {
        setTracks(tData.map(t => ({
          id: t.id,
          title: t.title,
          artist: t.releases?.profiles?.username || 'Unknown Artist',
          cover: t.releases?.cover_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
          url: t.audio_url,
          genre: 'New Release'
        })));
      }

      // 2. Fetch Videos
      const { data: vData } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (vData) setVideos(vData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-home fade-in">
      {/* ── 1. CINEMATIC VIDEO HERO ─────────────────────────────────── */}
      <section className="hm-hero relative mb-12 rounded-[32px] overflow-hidden border border-white/10 group bg-[#09090b]">
        {/* Video Background Layer */}
        <div className="absolute inset-0 z-0">
          <video 
            src="https://dsxwsfdovfzgvbngfsvs.supabase.co/storage/v1/object/public/videos/nasty-c-pass-the-aux.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{ filter: 'brightness(1.12) contrast(1.08) saturate(1.05)' }}
            className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-[10s] ease-out"
          />
          {/* Lighter Transparent Dark Overlay for maximum video visibility */}
          <div className="absolute inset-0 bg-black/30 z-10" />
          
          {/* Subtle directional gradients for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent z-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/60 via-transparent to-transparent z-20" />
        </div>
        
        {/* Content Layer */}
        <div className="relative z-30 p-10 md:p-16 h-full flex flex-col justify-center max-w-4xl min-h-[500px]">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="text-accent-magenta font-black text-xs uppercase tracking-[0.2em] mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              CITY LIGHT MUSIC
            </div>
            <h1 className="text-5xl md:text-8xl font-black font-['Outfit'] text-white leading-[0.95] tracking-tight mb-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              Where Sound<br/>Meets Spotlight
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-0 max-w-2xl font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,1)] leading-relaxed">
              Discover the energy, the visuals, and the culture shaping what’s next.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 2. RECENT MUSIC ─────────────────────────────────────── */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6 px-1">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue mb-1">
              <Flame size={12} /> Fresh Drops
            </div>
            <h2 className="text-3xl font-black font-['Outfit']">Trending Audio</h2>
          </div>
          <Link to="/music" className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
            See All <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden"><LoaderSkeleton /></div>
        ) : tracks.length > 0 ? (
          <div className="netflix-row flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory">
            {tracks.map(track => (
              <motion.div 
                key={track.id} 
                whileHover={{ y: -8, scale: 1.02 }}
                className="flex-shrink-0 w-[220px] snap-start group cursor-pointer"
                onClick={() => playTrack(track)}
              >
                <div className="relative aspect-square rounded-[20px] overflow-hidden mb-3 border border-white/10 shadow-lg">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-accent-blue/90 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,112,243,0.6)] backdrop-blur-md transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      {currentTrack?.id === track.id && isPlaying ? <Pause size={24} fill="#fff" /> : <Play size={24} fill="#fff" className="ml-1" />}
                    </div>
                  </div>
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="absolute top-3 right-3 flex gap-1">
                      <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
                      <div className="w-1 h-4 bg-white rounded-full animate-pulse delay-75" />
                      <div className="w-1 h-2 bg-white rounded-full animate-pulse delay-150" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-[15px] truncate text-white">{track.title}</h3>
                <p className="text-[13px] text-gray-400 truncate">{track.artist}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState msg="No audio releases yet." />
        )}
      </section>

      {/* ── 3. RECENT VIDEOS ─────────────────────────────────────── */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6 px-1">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent-magenta mb-1">
              <VideoIcon size={12} /> Watch Now
            </div>
            <h2 className="text-3xl font-black font-['Outfit']">New Music Videos</h2>
          </div>
          <Link to="/videos" className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
            Explore Network <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden"><LoaderSkeleton wide /></div>
        ) : videos.length > 0 ? (
          <div className="netflix-row flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory">
            {videos.map(video => (
              <motion.div 
                key={video.id} 
                whileHover={{ y: -8, scale: 1.02 }}
                className="flex-shrink-0 w-[400px] snap-start group border border-white/10 rounded-[20px] overflow-hidden bg-black/40 backdrop-blur-sm cursor-pointer shadow-xl"
              >
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                   {/* We use a video element without controls for preview purposes, or a simple gradient fallback */}
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-black z-0" />
                   <video src={video.video_url} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-300" preload="metadata" muted />
                   
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                     <Link to="/videos" className="w-16 h-16 bg-accent-magenta/90 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(255,0,128,0.6)] backdrop-blur-md transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play size={28} fill="#fff" className="ml-1" />
                     </Link>
                   </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 truncate text-white">{video.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{video.artist_name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState msg="The video network is currently empty." />
        )}
      </section>
      
      {/* ── 4. CURATED SPOTLIGHT ─────────────────────────────────────── */}
      <section className="mb-8">
         <div className="glass-v2 border border-white/5 rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-blue/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-accent-blue/20 transition-colors duration-700" />
            <div className="relative z-10 max-w-xl">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue mb-2">
                 <Crown size={12} /> Exclusives
               </div>
               <h2 className="text-4xl font-black font-['Outfit'] mb-3">Live Sessions Room</h2>
               <p className="text-gray-400 font-medium mb-6">Discover intimate acoustic performances and behind-the-scenes documentaries from the brightest rising stars in the district.</p>
               <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-6 py-2.5 font-bold text-sm transition-all backdrop-blur-md">
                 Enter Room
               </button>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-4 flex-shrink-0 w-full md:w-auto">
               <div className="w-[140px] h-[140px] rounded-2xl bg-[url('https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=500&auto=format&fit=crop')] bg-cover bg-center border-2 border-[#161618] shadow-2xl rotate-[-6deg] hover:rotate-0 transition-transform duration-300" />
               <div className="w-[140px] h-[140px] rounded-2xl bg-[url('https://images.unsplash.com/photo-1516280440502-65f53703c5ec?q=80&w=500&auto=format&fit=crop')] bg-cover bg-center border-2 border-[#161618] shadow-2xl rotate-[6deg] hover:rotate-0 transition-transform duration-300 mt-6" />
            </div>
         </div>
      </section>

      <style>{`
        .page-home { padding-top: 1rem; }
        
        /* Cinematic Hero */
        .hm-hero {
          min-height: 500px;
          display: flex; flex-direction: column; 
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.8);
        }
        
        /* Netflix style horizontally scrolling rows */
        .netflix-row {
          scrollbar-width: none; /* Firefox */
          -webkit-overflow-scrolling: touch;
        }
        .netflix-row::-webkit-scrollbar { display: none; /* Chrome, Safari */ }
      `}</style>
    </div>
  );
};

const LoaderSkeleton = ({ wide }) => (
  <>
    {[1,2,3,4,5].map(i => (
      <div key={i} className={`flex-shrink-0 ${wide ? 'w-[400px]' : 'w-[220px]'} animate-pulse`}>
         <div className={`w-full ${wide ? 'aspect-video' : 'aspect-square'} bg-white/5 rounded-[20px] mb-3`} />
         <div className="w-3/4 h-4 bg-white/5 rounded mb-2" />
         <div className="w-1/2 h-3 bg-white/5 rounded" />
      </div>
    ))}
  </>
);

const EmptyState = ({ msg }) => (
  <div className="glass-v2 p-12 text-center rounded-[24px] border border-dashed border-white/10 text-gray-500 text-sm font-medium">
    {msg}
  </div>
);

export default Home;
