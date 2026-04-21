import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MediaCard from '../components/ui/MediaCard';
import {
  Play, MapPin, CheckCircle, Share2,
  MoreHorizontal, MessageSquare, Handshake, Music,
  Video, Info, ChevronRight, Radio, Zap,
  UserCheck, Loader2, AlertCircle, Globe, Instagram, Twitter
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const TABS = [
  { key: 'music',    label: 'Music',         icon: Music },
  { key: 'about',    label: 'About',          icon: Info },
];

const ArtistProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [artist, setArtist] = useState(null);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('music');

  const profileId = id || user?.id;

  useEffect(() => {
    if (profileId) {
      fetchArtistData();
    } else if (user === null) {
        setLoading(false);
    }
  }, [profileId, user]);

  const fetchArtistData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const { data: profile, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (pErr) throw pErr;

      // 2. Fetch Releases
      const { data: rels } = await supabase
        .from('releases')
        .select('*')
        .eq('user_id', profileId)
        .order('release_date', { ascending: false });

      setArtist({
        ...profile,
        name: profile.username || 'Independent Artist',
        avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400',
        banner: profile.banner_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600',
        genre: profile.bio ? 'Professional Creator' : 'Artist',
        location: profile.location || 'Global',
        bio: profile.bio || 'This artist has not yet shared their story.',
        verified: true
      });

      setReleases(rels || []);

    } catch (err) {
      console.error('Error fetching artist:', err);
      setArtist(null);
    } finally {
      setLoading(false);
    }
  };

  const albums = useMemo(() => releases.filter(r => r.genre === 'Album' || r.type === 'album'), [releases]);
  const singles = useMemo(() => releases.filter(r => r.genre !== 'Album' && r.type !== 'album'), [releases]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-city"><Loader2 className="animate-spin text-accent-blue" size={40} /></div>;

  if (!artist) return (
    <div className="h-screen flex flex-col items-center justify-center p-10 bg-city">
      <AlertCircle size={60} className="text-gray-600 mb-6" />
      <h2 className="text-2xl font-black mb-2 text-white">Artist Not Found</h2>
      <p className="text-gray-400 mb-8">This district hasn't been claimed by an artist yet, or they have moved on.</p>
      <Link to="/" className="btn-primary">Return to District</Link>
    </div>
  );

  return (
    <div className="page-profile fade-in">
      <header className="ap-hero" style={{ backgroundImage: `url(${artist.banner})` }}>
        <div className="ap-hero-gradient" />
        <div className="ap-breadcrumb-v2">
          <Link to="/" className="ap-bc-link-v2">District</Link>
          <ChevronRight size={14} className="text-dim" />
          <span className="ap-bc-current-v2">{artist.name}</span>
        </div>

        <div className="ap-identity">
          <div className="ap-avatar-wrap">
            <img src={artist.avatar} alt={artist.name} className="ap-avatar" />
          </div>
          <div className="ap-id-body">
            <div className="ap-verified-row">
              <span className="ap-verified-badge-v2"><CheckCircle size={14} /> Professional Partner</span>
            </div>
            <h1 className="ap-name">{artist.name}</h1>
            <div className="ap-genre-row">
              <span className="ap-genre-tag"><Music size={13} /> {artist.genre}</span>
              <span className="ap-sep">·</span>
              <span className="ap-location"><MapPin size={13} /> {artist.location}</span>
            </div>
          </div>
        </div>

        <div className="ap-actions-v2">
          <button className="ap-btn-play-v2"><Play size={18} fill="#fff" /> Media Kit</button>
          <button className={`ap-btn-follow-v2 ${following ? 'following' : ''}`} onClick={() => setFollowing(!following)}>
            {following ? 'Partnered' : '+ Follow'}
          </button>
          <button className="ap-btn-icon"><Share2 size={18} /></button>
        </div>
      </header>

      <nav className="ap-tab-nav-v2">
        {TABS.map(tab => (
          <button key={tab.key} className={`ap-tab-v2 ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </nav>

      <div className="ap-tab-pane">
        {activeTab === 'music' && (
          <div className="space-y-12">
            {releases.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {releases.map(rel => (
                  <MediaCard key={rel.id} item={{
                    id: rel.id,
                    title: rel.title,
                    artist: artist.name,
                    cover: rel.cover_url
                  }} type="music" />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500 italic">
                No music assets have been released by this artist yet.
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold mb-4 text-white">Biography</h3>
            <p className="text-gray-400 leading-relaxed text-lg mb-8">
              {artist.bio}
            </p>
            
            <div className="flex gap-4">
              {artist.website_url && <a href={artist.website_url} target="_blank" className="text-gray-400 hover:text-white"><Globe size={20} /></a>}
              {artist.instagram_url && <a href={artist.instagram_url} target="_blank" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>}
              {artist.twitter_url && <a href={artist.twitter_url} target="_blank" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .page-profile { background-color: var(--bg-city); min-height: 100vh; padding-bottom: 5rem; }
        .ap-hero { min-height: 60vh; background-size: cover; background-position: center; position: relative; display: flex; flex-direction: column; justify-content: flex-end; padding: 0; }
        .ap-hero-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, rgba(9, 9, 11, 0.4) 50%, var(--bg-city) 100%); }
        .ap-breadcrumb-v2 { position: absolute; top: 2rem; left: 5rem; display: flex; align-items: center; gap: 0.75rem; z-index: 10; font-size: 0.85rem; font-weight: 800; color: var(--text-dim); }
        .ap-identity { position: relative; z-index: 10; display: flex; align-items: flex-end; gap: 3rem; padding: 0 5rem; margin-bottom: 3.5rem; }
        .ap-avatar { width: 180px; height: 180px; border-radius: 24px; object-fit: cover; border: 4px solid var(--bg-city); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .ap-name { font-size: 5rem; font-weight: 950; letter-spacing: -0.05em; color: #fff; line-height: 1; }
        .ap-verified-badge-v2 { background: var(--accent-blue); color: #fff; font-size: 0.75rem; font-weight: 800; padding: 0.4rem 0.75rem; border-radius: 99px; display: inline-flex; align-items: center; gap: 0.5rem; }
        .ap-actions-v2 { position: relative; z-index: 10; display: flex; align-items: center; gap: 1rem; padding: 0 5rem 5rem; }
        .ap-btn-play-v2 { background: var(--accent-blue); color: #fff; padding: 1rem 2.5rem; border-radius: 12px; font-weight: 900; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: transform 0.2s; }
        .ap-btn-play-v2:hover { transform: scale(1.05); }
        .ap-btn-follow-v2 { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 1rem 2rem; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .ap-btn-follow-v2:hover { background: rgba(255,255,255,0.2); }
        .ap-btn-follow-v2.following { background: #fff; color: #000; }
        .ap-btn-icon { width: 48px; height: 48px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .ap-tab-nav-v2 { display: flex; gap: 3rem; padding: 0 5rem; border-bottom: 1px solid var(--border-light); margin-bottom: 3rem; }
        .ap-tab-v2 { padding: 1.25rem 0; font-weight: 800; color: var(--text-dim); border-bottom: 4px solid transparent; cursor: pointer; background: transparent; border-top: none; border-left: none; border-right: none; display: flex; align-items: center; gap: 0.75rem; }
        .ap-tab-v2.active { color: var(--accent-blue); border-bottom-color: var(--accent-blue); }
        .ap-tab-pane { padding: 0 5rem; }
        .ap-genre-row { display: flex; align-items: center; gap: 1rem; color: var(--text-gray); font-weight: 600; font-size: 1rem; }
        .ap-genre-tag { display: flex; align-items: center; gap: 0.5rem; color: #fff; }

        @media (max-width: 1024px) {
          .ap-name { font-size: 3.5rem; }
          .ap-identity { padding: 0 2rem; gap: 2rem; }
          .ap-actions-v2, .ap-tab-nav-v2, .ap-tab-pane { padding: 0 2rem; }
          .ap-avatar { width: 140px; height: 140px; }
        }
        @media (max-width: 640px) {
          .ap-name { font-size: 2.5rem; }
          .ap-identity { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .ap-avatar { width: 120px; height: 120px; }
          .ap-tab-nav-v2 { gap: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default ArtistProfile;
