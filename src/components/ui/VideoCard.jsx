import { useRef } from 'react';
import { Play, Loader2, Trash2 } from 'lucide-react';

const VideoCard = ({ video, isOwner, onDelete, deletingId }) => {
  const vidRef = useRef(null);

  return (
    <div className="vp-card group">
      <div className="vp-thumb-wrap glass-card">
        <video 
          ref={vidRef}
          src={video.video_url} 
          className="vp-thumb-video"
          muted
          loop
          onMouseOver={e => e.target.play()}
          onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
        />
        <div className="vp-card-overlay">
          <div className="vp-play-icon">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
        <div className="vp-dur-badge">{video.duration}</div>
      </div>
      
      <div className="vp-card-body">
        <h4 className="vp-card-title">{video.title}</h4>
        <p className="vp-card-artist">{video.artist_name}</p>
        <div className="vp-card-info">
          <span>{video.views}</span>
          <span className="vp-meta-dot" />
          <span>{new Date(video.created_at).toLocaleDateString()}</span>
        </div>
        
        {isOwner && (
          <button
            onClick={(e) => onDelete(video, e)}
            disabled={deletingId === video.id}
            className="vp-del-btn"
            title="Delete video"
          >
            {deletingId === video.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </button>
        )}
      </div>

      <style>{`
        .vp-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          cursor: pointer;
          position: relative;
        }
        .vp-thumb-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 12px;
          overflow: hidden;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .vp-thumb-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vp-card:hover .vp-thumb-video {
          transform: scale(1.05);
        }
        .vp-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }
        .vp-card:hover .vp-card-overlay {
          background: rgba(0,0,0,0.3);
        }
        .vp-play-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 0, 128, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 15px rgba(255, 0, 128, 0.4);
        }
        .vp-card:hover .vp-play-icon {
          opacity: 1;
          transform: scale(1);
        }
        .vp-dur-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(4px);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 800;
          color: #fff;
        }
        
        .vp-card-body { padding: 0.25rem 0.1rem; flex: 1; position: relative; }
        .vp-card-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 0.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .vp-card-artist {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-gray);
        }
        .vp-card-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-dim);
          margin-top: 0.2rem;
        }
        .vp-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.2); }
        
        .vp-del-btn {
          position: absolute;
          top: 0.25rem;
          right: 0;
          color: var(--text-dim);
          opacity: 0;
          transition: all 0.2s;
        }
        .vp-card:hover .vp-del-btn { opacity: 1; }
        .vp-del-btn:hover { color: #ef4444; }
      `}</style>
    </div>
  );
};

export default VideoCard;
