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
      case STATUSES.LIVE: return '#22c55e';
      case STATUSES.IN_REVIEW: return 'var(--accent-magenta)';
      case STATUSES.PROCESSING: return 'var(--accent-cyan)';
      case STATUSES.DRAFT: return 'var(--text-dim)';
      case STATUSES.TAKEN_DOWN: return '#ef4444';
      default: return '#22c55e'; // Default to Live for now
    }
  };

  return (
    <div className="page-dashboard fade-in">
      <header className="dashboard-header-premium mb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-dim uppercase tracking-widest mb-2">
            <span className="blue-dot" /> Professional Hub
          </div>
          <h1 className="text-4xl font-heading text-main">Artist Dashboard</h1>
          <p className="text-gray text-lg">Infrastructure for <span className="text-blue font-bold">{profile?.username || user?.email?.split('@')[0] || 'Artist'}</span></p>
          {user && (
            <p className="db-user-pill">Signed in as <strong>{user.email}</strong></p>
          )}
        </div>
        <div className="header-actions">
          <Link to="/upload" className="btn-primary-v2">
            <PlusCircle size={20} /> New Release
          </Link>
          <button className="db-signout-btn" onClick={handleSignOut}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <div className="stats-grid-premium mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card-premium glass-card">
            <div className="stat-header">
              <div className="stat-icon-wrap" style={{ color: stat.color }}>{stat.icon}</div>
              <span className="stat-change">{stat.change}</span>
            </div>
            <div className="stat-content">
              <h4 className="stat-label-premium">{stat.label}</h4>
              <p className="stat-value-premium font-heading">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="main-col">
          <section className="releases-panel glass-v2 shadow-card mb-8">
            <header className="panel-header-v2">
              <h3 className="text-xl font-heading flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-500" /> 
                Distribution Statistics
              </h3>
            </header>
            
            <div className="distribution-table">
              <div className="table-head">
                <span>RELEASE TITLE</span>
                <span>STATUS</span>
                <span>UPC / ISRC</span>
                <span>ACTION</span>
              </div>
              
              {loading ? (
                <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-accent-blue" /></div>
              ) : releases.length > 0 ? (
                releases.map(release => (
                  <div key={release.id} className="table-row-premium">
                    <div className="release-info-cell">
                      <img src={release.cover_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500'} alt="" className="mini-cover" />
                      <div>
                        <p className="release-name-primary">{release.title}</p>
                        <p className="release-type-sub">{release.tracks?.length || 0} Tracks</p>
                      </div>
                    </div>
                    <div className="status-cell">
                      <span className="status-indicator" style={{ background: getStatusColor(STATUSES.LIVE) }} />
                      <span className="status-text" style={{ color: getStatusColor(STATUSES.LIVE) }}>{STATUSES.LIVE}</span>
                    </div>
                    <div className="code-cell text-xs font-mono text-muted uppercase">
                      Pending...
                    </div>
                    <div className="actions-cell">
                      <button className="icon-btn-sm hover:text-white"><ChevronRight size={18} /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <Music size={32} />
                  </div>
                  <p className="text-gray font-bold">No releases yet. Start distributions to see stats.</p>
                  <Link to="/upload" className="btn-primary-v3 inline-block">Create First Release</Link>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="side-col">
          <div className="dashboard-widget-v2 mb-8 billboard-blue-bg text-white">
            <h3 className="font-heading text-lg mb-4">City Light Pro</h3>
            <p className="text-sm text-white/80 mb-6">You are on the Free Distributor plan. Upgrade to City Light Pro for 100% royalties and global label representation.</p>
            <button className="btn-white-sm w-full">View Plans</button>
          </div>

          <div className="dashboard-widget-v2">
             <h3 className="font-heading text-lg mb-6">Recent Activity</h3>
             <div className="activity-list text-sm">
                <p className="text-gray italic">No recent activity. Activity will appear here once your tracks are live on DSPs.</p>
             </div>
          </div>
        </aside>
      </div>

      <style>{`
        .page-dashboard { padding: 2.5rem; background-color: var(--bg-city); min-height: 100vh; }
        .dashboard-header-premium { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 2.5rem; border-bottom: 1px solid var(--border-light); margin-bottom: 3.5rem; }
        .blue-dot { width: 8px; height: 8px; background: var(--accent-blue); border-radius: 50%; display: inline-block; box-shadow: 0 0 10px rgba(0, 112, 243, 0.4); }
        .db-user-pill { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.78rem; color: var(--text-muted); background: rgba(22,119,255,0.06); border: 1px solid rgba(22,119,255,0.12); border-radius: 20px; padding: 0.25rem 0.85rem; margin-top: 0.5rem; }
        .db-user-pill strong { color: var(--accent-blue); font-weight: 700; }
        .db-signout-btn { display: flex; align-items: center; gap: 0.4rem; background: transparent; border: 1.5px solid rgba(15,23,42,0.1); border-radius: 10px; padding: 0.65rem 1.1rem; font-size: 0.82rem; font-weight: 700; color: var(--text-gray); cursor: pointer; transition: all 0.15s ease; }
        .btn-primary-v2 { background: var(--accent-blue); color: #fff; padding: 0.85rem 2rem; border-radius: 10px; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 30px rgba(0, 112, 243, 0.2); transition: var(--transition-smooth); border: none; cursor: pointer; }
        .stats-grid-premium { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        .stat-card-premium { padding: 2.25rem; border-radius: 16px; display: flex; flex-direction: column; gap: 1.5rem; background: #fff; border: 1px solid var(--border-light); box-shadow: var(--shadow-card); }
        .stat-value-premium { font-size: 2rem; font-weight: 900; }
        .dashboard-grid { display: grid; grid-template-columns: 1fr 400px; gap: 2.5rem; }
        .releases-panel { background: #fff; border-radius: 20px; border: 1px solid var(--border-light); overflow: hidden; }
        .panel-header-v2 { padding: 2rem; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; }
        .distribution-table { padding: 1rem; }
        .table-head { display: grid; grid-template-columns: 2fr 1.2fr 1.2fr 0.5fr; padding: 1.25rem 2rem; font-size: 0.7rem; font-weight: 900; color: var(--text-dim); border-bottom: 1px solid var(--border-light); }
        .table-row-premium { display: grid; grid-template-columns: 2fr 1.2fr 1.2fr 0.5fr; padding: 2rem; align-items: center; border-bottom: 1px solid var(--border-light); }
        .mini-cover { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; margin-right: 1rem; }
        .release-info-cell { display: flex; align-items: center; }
        .billboard-blue-bg { background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-cyan) 100%); }
        .btn-white-sm { background: #fff; color: var(--accent-blue); padding: 0.8rem; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; }
        .btn-primary-v3 { background: var(--accent-blue); color: #fff; padding: 0.8rem 1.5rem; border-radius: 10px; font-weight: 700; width: fit-content; }
        @media (max-width: 1400px) { .stats-grid-premium { grid-template-columns: repeat(2, 1fr); } .dashboard-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default ArtistDashboard;
