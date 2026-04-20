import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Music, Video, Mic2, LayoutDashboard, Upload, DollarSign,
  ShieldCheck, Newspaper, MessageCircle, Wallet, Scale, Search,
  Bell, ChevronRight, ChevronDown, Play, Users, TrendingUp, BarChart2, Settings,
  Radio, Compass, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Nav config ─────────────────────────────────────────────── */
const NAV_DISCOVER = [
  { to: '/',         icon: Compass,    label: 'Browse'      },
  { to: '/music',    icon: Music,      label: 'Music'       },
  { to: '/videos',   icon: Video,      label: 'Music Videos'},
  { to: '/podcasts', icon: Mic2,       label: 'Podcasts'    },
  { to: '/news',     icon: Newspaper,  label: 'Editorial'   },
];

const NAV_CREATOR = [
  { to: '/dashboard',icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/upload',   icon: Upload,          label: 'Upload Hub'     },
  { to: '/royalties',icon: DollarSign,      label: 'Earnings'  },
  { to: '/wallet',   icon: Wallet,          label: 'Wallet'     },
  { to: '/messages', icon: MessageCircle,   label: 'Collabs'    },
  { to: '/royalties',icon: BarChart2,       label: 'Analytics'  },
];

const NAV_SYSTEM = [
  { to: '/admin', icon: ShieldCheck, label: 'Admin Panel' },
  { to: '/legal', icon: Scale,       label: 'Legal'       },
];

/* ─── Sidebar ────────────────────────────────────────────────── */
const Sidebar = () => {
  const [creatorOpen, setCreatorOpen] = useState(false);
  const location = useLocation();

  // If we navigate to a creator route directly, expand it automatically
  useEffect(() => {
    if (NAV_CREATOR.some(n => location.pathname.startsWith(n.to))) {
      setCreatorOpen(true);
    }
  }, [location.pathname]);

  return (
    <aside className="clm-sidebar">
      {/* Logo */}
      <Link to="/" className="clm-logo">
        <div className="clm-logo-icon">
          <Radio size={18} color="#fff" />
        </div>
        <div className="clm-logo-text">
          <span className="clm-logo-brand">CITY LIGHT</span>
          <span className="clm-logo-sub">MUSIC</span>
        </div>
      </Link>

      <div className="clm-sidebar-scroll">
        {/* Discover */}
        <NavSection label="Discover" items={NAV_DISCOVER} />

        {/* Creator Hub (Collapsible) */}
        <div className="clm-nav-section mt-4">
          <button 
            className="clm-nav-label-btn" 
            onClick={() => setCreatorOpen(!creatorOpen)}
          >
            <div className="flex items-center gap-1.5">
              <Crown size={12} className="text-accent-magenta" />
              <span>Creator Hub</span>
            </div>
            <motion.div animate={{ rotate: creatorOpen ? 180 : 0 }}>
              <ChevronDown size={14} />
            </motion.div>
          </button>
          
          <AnimatePresence initial={false}>
            {creatorOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 flex flex-col gap-0.5">
                  {NAV_CREATOR.map(({ to, icon: Icon, label: lbl }) => (
                    <NavLink
                      key={lbl}
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) => `clm-nav-link clm-nav-link-sub${isActive ? ' clm-nav-active' : ''}`}
                    >
                      <Icon size={16} />
                      <span>{lbl}</span>
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System */}
        <div className="mt-4">
          <NavSection label="System" items={NAV_SYSTEM} />
        </div>
      </div>

      {/* User profile */}
      <Link to="/profile" className="clm-user-row">
        <div className="clm-user-avatar">UP</div>
        <div className="clm-user-info">
          <span className="clm-user-name">Urban Pulse</span>
          <span className="clm-user-plan">Pro Member</span>
        </div>
        <ChevronRight size={14} className="clm-user-chevron" />
      </Link>
    </aside>
  );
};

const NavSection = ({ label, items }) => (
  <nav className="clm-nav-section">
    <p className="clm-nav-label">{label}</p>
    {items.map(({ to, icon: Icon, label: lbl }) => (
      <NavLink
        key={lbl}
        to={to}
        end={to === '/'}
        className={({ isActive }) => `clm-nav-link${isActive ? ' clm-nav-active' : ''}`}
      >
        <Icon size={17} />
        <span>{lbl}</span>
      </NavLink>
    ))}
  </nav>
);

/* ─── Top Bar ────────────────────────────────────────────────── */
const TopBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const onSearch = e => {
    e.preventDefault();
    if (query.trim()) navigate('/music');
  };

  return (
    <header className="clm-topbar">
      <form className="clm-search-form" onSubmit={onSearch}>
        <Search size={16} className="clm-search-ic" />
        <input
          type="text"
          className="clm-search-input"
          placeholder="Search for songs, artists, or podcasts..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </form>
      <div className="clm-topbar-actions">
        <Link to="/music" className="clm-listen-btn">
          <Play size={13} fill="currentColor" /> Web Player
        </Link>
        <button className="clm-icon-btn" aria-label="Notifications">
          <Bell size={19} />
          <span className="clm-notif-dot" />
        </button>
        <button className="clm-icon-btn" aria-label="Settings">
          <Settings size={19} />
        </button>
        <Link to="/profile" className="clm-avatar-btn">UP</Link>
      </div>
    </header>
  );
};

/* ─── Shell ──────────────────────────────────────────────────── */
const Shell = ({ children }) => (
  <div className="clm-shell">
    <Sidebar />
    <div className="clm-main">
      <TopBar />
      <main className="clm-content">{children}</main>
    </div>

    <style>{`
      /* ══ Shell Layout ══════════════════════════════════════════ */
      .clm-shell {
        display: flex;
        height: 100vh;
        background: transparent;
        overflow: hidden;
      }

      /* ══ Sidebar ═══════════════════════════════════════════════ */
      .clm-sidebar {
        width: 250px;
        flex-shrink: 0;
        height: 100%;
        background: rgba(9, 9, 11, 0.65);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-right: 1px solid var(--border-light);
        display: flex;
        flex-direction: column;
        padding: 1.25rem 1rem 1rem;
        gap: 0.25rem;
        z-index: 20;
      }
      .clm-sidebar-scroll {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        padding-top: 1rem;
      }
      .clm-sidebar-scroll::-webkit-scrollbar { display: none; }

      /* Logo */
      .clm-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.25rem 0.5rem;
        margin-bottom: 0.5rem;
        text-decoration: none;
        flex-shrink: 0;
      }
      .clm-logo-icon {
        width: 36px; height: 36px;
        background: var(--accent-magenta);
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 4px 15px rgba(255,0,128,0.25);
      }
      .clm-logo-text { display: flex; flex-direction: column; line-height: 1; }
      .clm-logo-brand {
        font-family: 'Outfit', sans-serif;
        font-size: 0.85rem; font-weight: 900;
        letter-spacing: 0.06em; color: var(--text-main);
      }
      .clm-logo-sub {
        font-size: 0.62rem; font-weight: 800;
        letter-spacing: 0.28em; color: var(--text-muted);
        margin-top: 1px;
      }

      /* Nav sections */
      .clm-nav-label {
        font-size: 0.65rem; font-weight: 800;
        letter-spacing: 0.15em; text-transform: uppercase;
        color: var(--text-dim); padding: 0 0.75rem;
        margin-bottom: 0.5rem;
      }
      .clm-nav-label-btn {
        width: 100%; display: flex; align-items: center; justify-content: space-between;
        font-size: 0.65rem; font-weight: 800;
        letter-spacing: 0.15em; text-transform: uppercase;
        color: var(--text-dim); padding: 0 0.75rem;
        margin-bottom: 0.2rem; cursor: pointer;
        background: transparent; border: none;
        transition: color 0.15s ease;
      }
      .clm-nav-label-btn:hover { color: var(--text-main); }
      
      .clm-nav-link {
        display: flex; align-items: center; gap: 0.75rem;
        padding: 0.6rem 0.75rem;
        font-size: 0.9rem; font-weight: 600;
        color: var(--text-gray);
        border-radius: 10px;
        transition: all 0.15s ease;
        margin-bottom: 0.25rem;
        text-decoration: none;
      }
      .clm-nav-link-sub {
        font-size: 0.825rem;
        font-weight: 500;
        padding: 0.5rem 0.75rem 0.5rem 2.25rem;
      }
      .clm-nav-link-sub svg { width: 14px; height: 14px; }
      
      .clm-nav-link:hover {
        color: var(--text-main);
        background: rgba(255,255,255,0.05);
      }
      .clm-nav-active {
        color: #fff !important;
        background: rgba(255,255,255,0.1) !important;
        box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
      }
      
      /* User row */
      .clm-user-row {
        display: flex; align-items: center; gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 12px;
        border: 1px solid var(--border-light);
        background: rgba(255,255,255,0.03);
        margin-top: 1rem;
        transition: background 0.2s ease;
        text-decoration: none;
        flex-shrink: 0;
      }
      .clm-user-row:hover { background: rgba(255,255,255,0.08); }
      .clm-user-avatar {
        width: 36px; height: 36px;
        background: linear-gradient(135deg, var(--accent-magenta), #FF4D4D);
        border-radius: 50%;
        color: #fff; font-size: 0.72rem; font-weight: 800;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .clm-user-info { flex: 1; min-width: 0; }
      .clm-user-name {
        font-size: 0.82rem; font-weight: 700;
        color: var(--text-main);
        display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .clm-user-plan { font-size: 0.68rem; color: var(--accent-magenta); font-weight: 600; }
      .clm-user-chevron { color: var(--text-dim); flex-shrink: 0; }

      /* ══ Top Bar ════════════════════════════════════════════════ */
      .clm-topbar {
        height: 72px;
        display: flex; align-items: center;
        justify-content: space-between;
        padding: 0 2rem;
        background: transparent;
        position: sticky; top: 0; z-index: 10;
        gap: 1.5rem;
      }

      /* Search */
      .clm-search-form {
        display: flex; align-items: center; gap: 0.75rem;
        flex: 1; max-width: 360px;
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--border-light);
        border-radius: 99px;
        padding: 0.6rem 1.25rem;
        transition: border-color 0.2s ease, background 0.2s ease;
        backdrop-filter: blur(12px);
      }
      .clm-search-form:focus-within {
        background: rgba(255,255,255,0.08);
        border-color: rgba(255,255,255,0.3);
      }
      .clm-search-ic { color: var(--text-dim); flex-shrink: 0; }
      .clm-search-input {
        flex: 1; border: none; outline: none;
        background: transparent;
        font-size: 0.82rem; color: var(--text-main); font-weight: 500;
        font-family: inherit;
      }
      .clm-search-input::placeholder { color: var(--text-muted); font-weight: 400; }

      /* Actions */
      .clm-topbar-actions {
        display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;
      }
      .clm-listen-btn {
        display: flex; align-items: center; gap: 0.4rem;
        background: rgba(255,255,255,0.1); color: #fff;
        border-radius: 99px; padding: 0.55rem 1.25rem;
        font-size: 0.8rem; font-weight: 700;
        transition: all 0.2s ease; border: 1px solid rgba(255,255,255,0.05);
        backdrop-filter: blur(12px);
      }
      .clm-listen-btn:hover { background: #fff; color: #000; transform: scale(1.02); }
      .clm-icon-btn {
        position: relative;
        width: 40px; height: 40px;
        display: flex; align-items: center; justify-content: center;
        border-radius: 50%; color: var(--text-gray);
        transition: all 0.15s ease; cursor: pointer;
        border: none; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light);
        backdrop-filter: blur(12px);
      }
      .clm-icon-btn:hover { background: rgba(255,255,255,0.1); color: var(--text-main); }
      .clm-notif-dot {
        position: absolute; top: 9px; right: 9px;
        width: 8px; height: 8px;
        background: var(--accent-magenta); border-radius: 50%;
        border: 2px solid #000;
      }
      .clm-avatar-btn {
        width: 40px; height: 40px;
        background: linear-gradient(135deg, var(--accent-magenta), #FF4D4D);
        border-radius: 50%;
        color: #fff; font-size: 0.75rem; font-weight: 800;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.15s ease; cursor: pointer;
        box-shadow: 0 4px 10px rgba(255,0,128,0.2);
      }
      .clm-avatar-btn:hover { transform: scale(1.05); }

      /* ══ Main + Content ═════════════════════════════════════════ */
      .clm-main {
        flex: 1;
        display: flex; flex-direction: column;
        overflow: hidden;
        min-width: 0;
      }
      .clm-content {
        flex: 1;
        overflow-y: auto;
        padding: 2rem 3rem;
        padding-bottom: 130px;
        background: transparent;
      }

      /* Scrollbar in content area */
      .clm-content::-webkit-scrollbar { width: 6px; }
      .clm-content::-webkit-scrollbar-track { background: transparent; }
      .clm-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 99px; }
      .clm-content::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
    `}</style>
  </div>
);

export default Shell;
