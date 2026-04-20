import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MOCK_ARTISTS, MOCK_MUSIC, MOCK_VIDEOS, MOCK_PODCASTS
} from '../data/mockData';
import MediaCard from '../components/ui/MediaCard';
import {
  Play, MapPin, CheckCircle, Share2,
  MoreHorizontal, MessageSquare, Handshake, Music,
  Video, Info, ChevronRight, Radio, Zap,
  UserCheck, Loader2, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const TABS = [
  { key: 'music',    label: 'Music',         icon: Music },
  { key: 'videos',   label: 'Videos',        icon: Video },
  { key: 'podcasts', label: 'Podcasts',       icon: Radio },
  { key: 'about',    label: 'About',          icon: Info },
];

const ArtistProfile = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('music');

  useEffect(() => {
    fetchArtist();
  }, [id]);

  const fetchArtist = async () => {
    setLoading(true);
    try {
      // If we have an ID, fetch from Supabase, otherwise look at mock (which is now empty)
      if (id) {
         const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
         if (data) {
           setArtist({
             name: data.username,
             avatar: data.avatar_url || 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400',
             banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600',
             genre: 'Independent Artist',
             location: 'South Africa',
             joinedDate: '2026',
             bio: 'The professional independent creator on City Light Media.',
             monthlyListeners: '0',
             followers: '0',
             releases: '0',
             countries: '1',
             verified: true,
             online: true
           });
         }
      } else {
        // Fallback for demo
        if (MOCK_ARTISTS.length > 0) {
          setArtist(MOCK_ARTISTS[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue" size={40} /></div>;

  if (!artist) return (
    <div className="h-screen flex flex-col items-center justify-center p-10 bg-city">
      <AlertCircle size={60} className="text-gray-300 mb-6" />
      <h2 className="text-2xl font-black mb-2">Artist Not Found</h2>
      <p className="text-gray mb-8">This district hasn't been claimed by an artist yet.</p>
      <Link to="/" className="btn-primary">Return to District</Link>
    </div>
  );

  return (
    <div className="page-profile fade-in">
      <header className="ap-hero" style={{ backgroundImage: `url(${artist.banner})` }}>
        <div className="ap-hero-gradient" />
        <div className="ap-breadcrumb-v2">
          <Link to="/" className="ap-bc-link-v2">Entertainment District</Link>
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
        <h2 className="ap-section-title">{activeTab.toUpperCase()}</h2>
        <div className="py-20 text-center text-gray italic">
           No {activeTab} assets have been released by this artist yet.
        </div>
      </div>

      <style>{`
        .page-profile { background-color: var(--bg-city); min-height: 100vh; }
        .ap-hero { min-height: 60vh; background-size: cover; background-position: center; position: relative; display: flex; flex-direction: column; justify-content: flex-end; padding: 0; }
        .ap-hero-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 60%, var(--bg-city) 100%); }
        .ap-breadcrumb-v2 { position: absolute; top: 3rem; left: 5rem; display: flex; align-items: center; gap: 0.75rem; z-index: 10; font-size: 0.85rem; font-weight: 800; color: var(--text-dim); }
        .ap-identity { position: relative; z-index: 10; display: flex; align-items: flex-end; gap: 3rem; padding: 0 5rem; margin-bottom: 3.5rem; }
        .ap-avatar { width: 200px; height: 200px; border-radius: 20px; object-fit: cover; border: 4px solid #fff; box-shadow: var(--shadow-premium); }
        .ap-name { font-size: 5rem; font-weight: 950; letter-spacing: -0.05em; color: #000; }
        .ap-actions-v2 { position: relative; z-index: 10; display: flex; align-items: center; gap: 1rem; padding: 0 5rem 5rem; }
        .ap-btn-play-v2 { background: var(--accent-blue); color: #fff; padding: 1rem 2rem; border-radius: 12px; font-weight: 900; border: none; cursor: pointer; }
        .ap-tab-nav-v2 { display: flex; gap: 3rem; padding: 0 5rem; border-bottom: 1px solid var(--border-light); margin-bottom: 4rem; }
        .ap-tab-v2 { padding: 1.5rem 0; font-weight: 800; color: var(--text-dim); border-bottom: 4px solid transparent; cursor: pointer; }
        .ap-tab-v2.active { color: var(--accent-blue); border-bottom-color: var(--accent-blue); }
        .ap-section-title { font-size: 2rem; font-weight: 950; margin-bottom: 2rem; }
      `}</style>
    </div>
  );
};

export default ArtistProfile;
