import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, Heart, Share2, MoreHorizontal, Clock, Calendar, Disc, User, Globe, MessageSquare } from 'lucide-react';
import { MOCK_MUSIC, MOCK_VIDEOS, MOCK_PODCASTS } from '../data/mockData';
import { usePlayer } from '../context/PlayerContext';

const ReleaseDetail = () => {
  const { type, id } = useParams();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  // Find the item based on type and id
  let item = null;
  if (type === 'music') item = MOCK_MUSIC.find(m => m.id === parseInt(id));
  else if (type === 'video') item = MOCK_VIDEOS.find(v => v.id === parseInt(id));
  else if (type === 'podcast') item = MOCK_PODCASTS.find(p => p.id === parseInt(id));

  if (!item) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl mb-4">Release not found</h2>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const isCurrent = currentTrack?.id === item.id;

  return (
    <div className="page-release-detail fade-in">
      <div className="release-header-premium">
        <div className="release-cover-large glass gold-glow">
          <img src={item.cover || item.thumbnail} alt={item.title} />
          {type !== 'video' && (
            <button 
              className="play-overlay-btn" 
              onClick={() => isCurrent ? togglePlay() : playTrack(item)}
            >
              {isCurrent && isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" />}
            </button>
          )}
        </div>
        
        <div className="release-info-main">
          <div className="type-badge">{type.toUpperCase()}</div>
          <h1 className="release-title-large">{item.title}</h1>
          <div className="release-meta-row">
            <Link to="/profile" className="artist-link">
              <User size={18} className="gold-gradient-text" /> 
              <span>{item.artist || item.host}</span>
            </Link>
            <span className="dot">•</span>
            <span className="flex items-center gap-1"><Calendar size={16} /> {item.releaseDate || item.date || '2026'}</span>
            <span className="dot">•</span>
            {item.duration && <span className="flex items-center gap-1"><Clock size={16} /> {item.duration}</span>}
            {item.genre && <span className="dot">•</span>}
            {item.genre && <span className="flex items-center gap-1"><Disc size={16} /> {item.genre}</span>}
          </div>
          
          <div className="release-actions mt-10">
            {type === 'video' ? (
               <button className="btn-primary-large"><Play size={20} fill="#000" /> Watch Video</button>
            ) : (
               <button 
                className="btn-primary-large" 
                onClick={() => isCurrent ? togglePlay() : playTrack(item)}
               >
                {isCurrent && isPlaying ? <Pause size={20} fill="#000" /> : <Play size={20} fill="#000" />}
                {isCurrent && isPlaying ? 'Pause' : 'Play Now'}
               </button>
            )}
            <button className="btn-icon-round"><Heart size={24} /></button>
            <button className="btn-icon-round"><Share2 size={24} /></button>
            <button className="btn-icon-round"><MoreHorizontal size={24} /></button>
          </div>
        </div>
      </div>

      <div className="release-content-grid mt-20">
        <div className="content-main-col">
          <section className="description-section glass mb-12">
            <h3 className="text-xl mb-4 font-heading">About this {type}</h3>
            <p className="text-gray leading-relaxed">
              {item.description || `Experience the latest ${type} from ${item.artist || item.host}. " ${item.title} " represents a new chapter in cinematic sound, blending urban textures with high-fidelity production. Distributed globally via City Light Media.`}
            </p>
          </section>

          <section className="credits-section glass">
            <h3 className="text-xl mb-6 font-heading">Credits</h3>
            <div className="credits-list">
              <div className="credit-item">
                <span className="role">Artist</span>
                <span className="name">{item.artist || item.host}</span>
              </div>
              <div className="divider" />
              <div className="credit-item">
                <span className="role">Release Date</span>
                <span className="name">{item.releaseDate || item.date || 'March 24, 2026'}</span>
              </div>
              <div className="divider" />
              <div className="credit-item">
                <span className="role">Label / Distribution</span>
                <span className="name">City Light Media</span>
              </div>
              <div className="divider" />
              <div className="credit-item">
                <span className="role">UPC / ISRC</span>
                <span className="name">CLM-982-441-209</span>
              </div>
            </div>
          </section>
        </div>

        <aside className="content-sidebar-col">
          <div className="sidebar-card glass mb-8">
            <h3 className="text-lg mb-4 font-heading flex items-center gap-2"><Globe size={18} className="gold-gradient-text" /> Distribution Info</h3>
            <p className="text-sm text-gray mb-4">This release is managed via City Light Media and distributed to:</p>
            <div className="platform-pills">
              <span className="platform-pill">Spotify</span>
              <span className="platform-pill">Apple Music</span>
              <span className="platform-pill">YouTube Music</span>
              <span className="platform-pill">Audiomack</span>
              <span className="platform-pill">SoundCloud</span>
            </div>
          </div>
          
          <div className="sidebar-card glass">
             <h3 className="text-lg mb-4 font-heading flex items-center gap-2"><MessageSquare size={18} className="gold-gradient-text" /> Artist Interaction</h3>
             <button className="btn-outline w-full mb-3">View Artist Profile</button>
             <button className="btn-outline w-full">Message Artist</button>
          </div>
        </aside>
      </div>

      <style>{`
        .release-header-premium {
          display: flex;
          gap: 4rem;
          align-items: flex-end;
          padding-top: 2rem;
        }

        .release-cover-large {
          flex: 0 0 400px;
          height: 400px;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
        }

        .release-cover-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .play-overlay-btn {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: var(--transition-smooth);
        }

        .release-cover-large:hover .play-overlay-btn {
          opacity: 1;
        }

        .type-badge {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--accent-gold);
          margin-bottom: 1rem;
        }

        .release-title-large {
          font-size: 5rem;
          line-height: 1;
          margin-bottom: 1.5rem;
          font-weight: 800;
        }

        .release-meta-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          color: var(--text-gray);
          font-size: 1.1rem;
        }

        .artist-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-white);
          font-weight: 600;
        }

        .btn-primary-large {
          padding: 1rem 2.5rem;
          background: var(--accent-gold);
          color: #000;
          border-radius: 50px;
          font-weight: 800;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 30px var(--accent-glow);
        }

        .release-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .btn-icon-round {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .btn-icon-round:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--accent-gold);
          transform: translateY(-2px);
        }

        .release-content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 4rem;
        }

        .description-section, .credits-section, .sidebar-card {
          padding: 2.5rem;
          border-radius: 24px;
        }

        .credits-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .credit-item {
          display: flex;
          justify-content: space-between;
        }

        .credit-item .role {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .credit-item .name {
          font-weight: 600;
        }

        .divider {
          height: 1px;
          background: var(--border-light);
        }

        .platform-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .platform-pill {
          padding: 0.4rem 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-gray);
          border: 1px solid var(--border-light);
        }

        .btn-outline {
          border: 1px solid var(--border-light);
          padding: 0.75rem;
          border-radius: 12px;
          font-weight: 600;
          transition: var(--transition-smooth);
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--text-white);
        }

        @media (max-width: 1200px) {
          .release-header-premium {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .release-meta-row {
            justify-content: center;
          }
          .release-actions {
            justify-content: center;
          }
          .release-content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ReleaseDetail;
