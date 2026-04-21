import { useRef } from 'react';
import { Play, Loader2, Trash2 } from 'lucide-react';

const VideoCard = ({ video, isOwner, onDelete, deletingId, variant = 'vertical' }) => {
  const vidRef = useRef(null);

  const isHorizontal = variant === 'horizontal';

  return (
    <div className={`vp-card group ${isHorizontal ? 'vp-card-horizontal' : 'vp-card-vertical'}`}>
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
            <Play size={isHorizontal ? 14 : 20} fill="currentColor" />
          </div>
        </div>
        <div className="vp-dur-badge">04:20</div>
      </div>
      
      <div className="vp-card-body">
        <h4 className="vp-card-title">{video.title}</h4>
        <p className="vp-card-artist">{video.artist_name}</p>
        <div className="vp-card-info">
          <span>{video.views || '1.2M'} Views</span>
          {!isHorizontal && <span className="vp-meta-dot" />}
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
        .vp-card { gap: 0.75rem; cursor: pointer; position: relative; display: flex; }
        .vp-card-vertical { flex-direction: column; }
        .vp-card-horizontal { flex-direction: row; align-items: center; gap: 1rem; }

        .vp-thumb-wrap {
          position: relative;
          aspect-ratio: 16/9;
          border-radius: 12px;
          overflow: hidden;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }
        .vp-card-vertical .vp-thumb-wrap { width: 100%; }
        .vp-card-horizontal .vp-thumb-wrap { width: 160px; }

        .vp-thumb-video { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .vp-card:hover .vp-thumb-video { transform: scale(1.05); }

        .vp-card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0); display: flex; align-items: center; justify-content: center; transition: background 0.3s ease; }
        .vp-card:hover .vp-card-overlay { background: rgba(0,0,0,0.3); }

        .vp-play-icon {
          background: #FF0080; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;
          opacity: 0; transform: scale(0.8); transition: all 0.25s ease; box-shadow: 0 4px 15px rgba(255, 0, 128, 0.4);
        }
        .vp-card-vertical .vp-play-icon { width: 48px; height: 48px; }
        .vp-card-horizontal .vp-play-icon { width: 32px; height: 32px; }
        .vp-card:hover .vp-play-icon { opacity: 1; transform: scale(1); }

        .vp-dur-badge { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 900; color: #fff; border: 1px solid rgba(255,255,255,0.1); }
        
        .vp-card-body { flex: 1; position: relative; min-width: 0; }
        .vp-card-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 2px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .vp-card-vertical .vp-card-title { font-size: 0.95rem; }
        .vp-card-horizontal .vp-card-title { font-size: 0.82rem; }

        .vp-card-artist { font-size: 0.75rem; font-weight: 600; color: #71717A; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.02em; }
        .vp-card-info { display: flex; align-items: center; gap: 0.5rem; font-size: 10px; font-weight: 800; color: #52525B; text-transform: uppercase; }
        .vp-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.1); }
        
        .vp-del-btn { position: absolute; top: 0.25rem; right: 0; color: #52525B; opacity: 0; transition: all 0.2s; }
        .vp-card:hover .vp-del-btn { opacity: 1; }
        .vp-del-btn:hover { color: #ef4444; }

        @media (max-width: 480px) {
           .vp-card-horizontal { flex-direction: column; align-items: flex-start; }
           .vp-card-horizontal .vp-thumb-wrap { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default VideoCard;
