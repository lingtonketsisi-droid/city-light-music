import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, TrendingUp, Users, DollarSign, PlusCircle, Globe, Clock, CheckCircle2, AlertCircle, ArrowUpRight, ChevronRight, LogOut, Loader2, Music } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const STATUSES = {
  LIVE: 'Live',
  IN_REVIEW: 'In Review',
  PROCESSING: 'Processing',
  DRAFT: 'Draft',
  TAKEN_DOWN: 'Removed'
};

const ArtistDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(prof);

      // 2. Fetch Releases
      const { data: rels } = await supabase
        .from('releases')
        .select(`
          *,
          tracks (id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setReleases(rels || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const stats = [
    { label: 'Total Streams',    value: '0', change: 'Live',    icon: <TrendingUp size={20} />, color: 'var(--accent-blue)'    },
    { label: 'Followers',        value: '0', change: 'New',     icon: <Users size={20} />,     color: 'var(--accent-magenta)' },
    { label: 'Royalties',        value: '$0.00', change: '0.00', icon: <DollarSign size={20} />, color: 'var(--accent-cyan)'    },
    { label: 'Active Releases',  value: releases.length, change: 'Updated', icon : <CheckCircle2 size={20} />,  color: 'var(--accent-blue)'    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case STATUSES.LIVE: return '#00DFD8'; // Vibrant Cyan
      case STATUSES.IN_REVIEW: return '#FF0080'; // Neon Magenta
      case STATUSES.PROCESSING: return '#FFB800'; // Billboard Amber
      case STATUSES.DRAFT: return '#71717A'; // Muted
      case STATUSES.TAKEN_DOWN: return '#ef4444'; // Error Red
      default: return '#0070F3'; // Media Blue
    }
  };

  return (
    <div className="page-dashboard fade-in">
      <header className="dashboard-hero-section mb-12">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <div className="pulse-indicator" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full border border-accent-blue/20">
               NETWORK LIVE
             </span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-white leading-none mt-2">
            Control Room
          </h1>
          <p className="text-gray-400 text-xl font-medium tracking-tight">
             Broadcast Infrastructure for <span className="text-white border-b-2 border-accent-blue">{profile?.username || user?.email?.split('@')[0] || 'Artist'}</span>
          </p>
        </div>
        <div className="header-actions-broadcast">
          <Link to="/upload" className="broadcast-btn-primary">
            <PlusCircle size={20} /> DISTRIBUTE ASSET
          </Link>
          <button className="broadcast-btn-secondary" onClick={handleSignOut}>
            <LogOut size={16} /> END SESSION
          </button>
        </div>
      </header>

      <div className="stats-monitors-grid mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="broadcast-widget card-hover-gloss">
            <div className="widget-header">
              <div className="widget-icon" style={{ 
                background: `${stat.color}15`, 
                color: stat.color,
                boxShadow: `0 0 15px ${stat.color}25`
              }}>
                {stat.icon}
              </div>
              <div className="widget-trend">
                 <ArrowUpRight size={14} className="text-accent-cyan" />
                 <span>{stat.change}</span>
              </div>
            </div>
            <div className="widget-content mt-6">
              <h4 className="widget-label">{stat.label}</h4>
              <p className="widget-value tracking-tighter" style={{ textShadow: `0 0 15px ${stat.color}30` }}>
                {stat.value}
              </p>
            </div>
            <div className="widget-scanline" />
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="main-col">
          <section className="assets-panel broadcast-panel mb-8">
            <header className="panel-header-broadcast">
              <div className="flex flex-col">
                <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                  <Globe size={24} className="text-accent-blue" /> 
                  Global Distribution
                </h3>
                <p className="text-xs text-gray-500 font-bold tracking-widest mt-1">ASSET INVENTORY & BROADCAST STATUS</p>
              </div>
              <div className="monitoring-status">
                 <span className="live-rec-dot" />
                 LIVE MONITORING
              </div>
            </header>
            
            <div className="assets-inventory p-6 space-y-4">
              {loading ? (
                <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-accent-blue" size={40} /></div>
              ) : releases.length > 0 ? (
                releases.map(release => (
                  <div key={release.id} className="asset-row-broadcast group">
                    <div className="asset-thumbnail">
                      <img src={release.cover_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500'} alt="" />
                      <div className="asset-overlay-badge">{release.tracks?.length || 0} TRACKS</div>
                    </div>
                    
                    <div className="asset-meta flex-1 px-6">
                       <span className="text-[10px] font-black text-accent-magenta uppercase tracking-[0.2em] mb-1 block">CATALOG ID: {release.id.substring(0,8).toUpperCase()}</span>
                       <h4 className="asset-title-broadcast">{release.title}</h4>
                       <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
                             <Clock size={12} />
                             <span>Released {new Date(release.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
                             <Globe size={12} />
                             <span>Global Distribution</span>
                          </div>
                       </div>
                    </div>

                    <div className="asset-status-cell px-8 text-center shrink-0">
                       <div className="status-broadcast-pill" style={{ 
                         borderColor: `${getStatusColor(STATUSES.LIVE)}30`,
                         background: `${getStatusColor(STATUSES.LIVE)}08`,
                         color: getStatusColor(STATUSES.LIVE)
                       }}>
                          <span className="pill-dot" style={{ background: getStatusColor(STATUSES.LIVE) }} />
                          {STATUSES.LIVE}
                       </div>
                    </div>

                    <div className="asset-actions shrink-0">
                      <button className="broadcast-action-btn">
                         <span>MANAGE</span>
                         <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center space-y-6 broadcast-empty-state">
                  <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-white/20 border border-white/5 group-hover:border-accent-blue/30 transition-all">
                    <Music size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase">Archive Empty</h3>
                    <p className="text-gray-500 max-w-sm mx-auto font-bold uppercase text-xs tracking-widest">Your digital distribution vault is currently empty. Initialise your first broadcast asset.</p>
                  </div>
                  <Link to="/upload" className="broadcast-btn-primary-v2 mx-auto">START DISTRIBUTION</Link>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="side-col space-y-8">
          <div className="broadcast-upsell-card glossy-metallic">
            <div className="upsell-badge">PREMIUM ACCESS</div>
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mt-4">
              Unlock the <br /> <span className="text-accent-blue">Global District</span>
            </h3>
            <p className="text-white/60 text-sm font-bold uppercase tracking-wide mt-4">
               Upgrade to CITY LIGHT PRO for 100% Royalties and Worldwide label representation.
            </p>
            <button className="broadcast-btn-white mt-8">UPGRADE NOW</button>
            <div className="card-decoration-lines" />
          </div>

          <div className="broadcast-panel recent-activity">
             <header className="panel-header-broadcast-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">LIVE FEED / UPDATES</span>
                <div className="live-ping" />
             </header>
             <div className="p-6">
                <div className="activity-list-broadcast">
                    <div className="activity-item-broadcast empty">
                       <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest text-center py-10 italic">
                          Awaiting network activity... <br />
                          Connect your DSPs to see live pings.
                       </p>
                    </div>
                </div>
             </div>
          </div>
        </aside>
      </div>

      <style>{`
        .page-dashboard { padding: 3rem; background-color: #050505; min-height: 100vh; color: #fff; }
        
        /* HEROS & HEADERS */
        .dashboard-hero-section { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 4rem; position: relative; }
        .pulse-indicator { width: 10px; height: 10px; background: #FF0080; border-radius: 50%; animation: broadcastPulse 2s infinite; box-shadow: 0 0 15px #FF0080; }
        @keyframes broadcastPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }

        .header-actions-broadcast { display: flex; gap: 1rem; }
        .broadcast-btn-primary { background: #fff; color: #000; padding: 1rem 2rem; border-radius: 4px; font-weight: 900; font-size: 0.75rem; tracking: 0.1em; display: flex; align-items: center; gap: 0.75rem; transition: all 0.25s ease; border: 1px solid #fff; }
        .broadcast-btn-primary:hover { background: transparent; color: #fff; box-shadow: 0 0 30px rgba(255,255,255,0.1); }
        .broadcast-btn-secondary { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #71717A; padding: 1rem 1.5rem; border-radius: 4px; font-weight: 900; font-size: 0.75rem; tracking: 0.1em; display: flex; align-items: center; gap: 0.75rem; transition: all 0.25s ease; }
        .broadcast-btn-secondary:hover { border-color: #fff; color: #fff; }

        /* MONITORS / STATS */
        .stats-monitors-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .broadcast-widget { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.03); border-radius: 12px; padding: 2rem; position: relative; overflow: hidden; transition: all 0.3s ease; }
        .broadcast-widget::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); }
        .card-hover-gloss:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        
        .widget-header { display: flex; justify-content: space-between; align-items: center; }
        .widget-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .widget-trend { display: flex; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 900; color: #00DFD8; background: rgba(0,223,216,0.1); padding: 4px 10px; border-radius: 20px; }
        .widget-label { font-size: 0.65rem; font-weight: 900; color: #52525B; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem; }
        .widget-value { font-size: 2.75rem; font-weight: 900; color: #fff; font-family: 'Outfit', sans-serif; }
        .widget-scanline { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.01) 50.5%); background-size: 100% 4px; pointer-events: none; opacity: 0.5; }

        /* PANELS */
        .dashboard-grid { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; }
        .broadcast-panel { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden; position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .panel-header-broadcast { padding: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%); }
        .monitoring-status { display: flex; align-items: center; gap: 8px; font-size: 0.65rem; font-weight: 900; letter-spacing: 0.1em; color: #52525B; }
        .live-rec-dot { width: 6px; height: 6px; background: #FF0080; border-radius: 50%; box-shadow: 0 0 8px #FF0080; }

        /* MEDIA ASSETS */
        .asset-row-broadcast { display: flex; align-items: center; padding: 1.5rem; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); border-radius: 12px; transition: all 0.2s ease; }
        .asset-row-broadcast:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); transform: scale(1.01); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .asset-thumbnail { width: 80px; height: 80px; border-radius: 8px; overflow: hidden; position: relative; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.1); }
        .asset-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
        .asset-overlay-badge { position: absolute; bottom: 4px; right: 4px; background: #000; color: #fff; font-size: 8px; font-weight: 900; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); }
        .asset-title-broadcast { font-size: 1.25rem; font-weight: 900; color: #fff; font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
        .status-broadcast-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 6px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; border: 1px solid; letter-spacing: 0.05em; }
        .pill-dot { width: 4px; height: 4px; border-radius: 50%; }
        .broadcast-action-btn { background: rgba(255,255,255,0.05); color: #fff; padding: 10px 18px; border-radius: 6px; font-size: 0.65rem; font-weight: 900; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease; border: 1px solid rgba(255,255,255,0.05); }
        .broadcast-action-btn:hover { background: #fff; color: #000; border-color: #fff; }

        /* UPSELL CARD */
        .broadcast-upsell-card { padding: 2.5rem; border-radius: 20px; background: #111; position: relative; overflow: hidden; border: 1px solid rgba(0, 112, 243, 0.2); box-shadow: 0 0 50px rgba(0, 112, 243, 0.1); }
        .glossy-metallic { background: linear-gradient(135deg, #0a0a0a 0%, #151515 50%, #0a0a0a 100%); }
        .upsell-badge { display: inline-block; background: #0070F3; color: #fff; font-size: 9px; font-weight: 900; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.1em; }
        .broadcast-btn-white { background: #fff; color: #000; width: 100%; padding: 1rem; border-radius: 6px; font-weight: 900; font-size: 0.75rem; letter-spacing: 0.1em; }
        .card-decoration-lines { position: absolute; top: -10%; right: -10%; width: 200px; height: 200px; background: radial-gradient(circle, rgba(0, 112, 243, 0.1) 0%, transparent 70%); pointer-events: none; }

        /* ACTIVITY FEED */
        .panel-header-broadcast-sm { padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); }
        .live-ping { width: 6px; height: 6px; background: #00DFD8; border-radius: 50%; box-shadow: 0 0 10px #00DFD8; animation: pingGlow 1.5s infinite; }
        @keyframes pingGlow { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(2); opacity: 0; } 100% { transform: scale(1); opacity: 0; } }

        /* EMPTY STATE / RESPONSIVE */
        .broadcast-btn-primary-v2 { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 0.85rem 2rem; border-radius: 4px; font-weight: 900; font-size: 0.7rem; display: block; border: 1px solid #fff; }
        .broadcast-btn-primary-v2:hover { background: #fff; color: #000; }

        @media (max-width: 1400px) { .stats-monitors-grid { grid-template-columns: repeat(2, 1fr); } .dashboard-grid { grid-template-columns: 1fr; } }
        @media (max-width: 1024px) {
          .page-dashboard { padding: 1.5rem; }
          .dashboard-hero-section { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .header-actions-broadcast { width: 100%; display: grid; grid-template-columns: 1fr; gap: 0.5rem; }
          .broadcast-widget { padding: 1.5rem; }
          .widget-value { font-size: 2rem; }
        }
        @media (max-width: 640px) {
          .stats-monitors-grid { grid-template-columns: 1fr; }
          .asset-row-broadcast { flex-direction: column; align-items: flex-start; gap: 1rem; text-align: center; }
          .asset-thumbnail { margin: 0 auto; }
          .asset-meta { padding: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ArtistDashboard;
