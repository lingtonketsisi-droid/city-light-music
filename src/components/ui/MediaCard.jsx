import { Play, Pause, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';

const MediaCard = ({ item, type = 'music' }) => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const isActive = currentTrack?.id === item.id;

  const handlePlay = e => {
    e.preventDefault();
    playTrack(item);
  };

  return (
    <Link to={`/release/${type}/${item.id}`} className="mc-card">
      <div className="mc-cover-wrap">
        <img src={item.cover || item.thumbnail} alt={item.title} className="mc-cover" />
        <button className={`mc-play-btn ${isActive && isPlaying ? 'mc-playing' : ''}`} onClick={handlePlay}>
          {isActive && isPlaying
            ? <Pause size={18} fill="#fff" />
            : <Play  size={18} fill="#fff" style={{ marginLeft: 2 }} />}
        </button>
        {item.genre && <span className="mc-genre-tag">{item.genre}</span>}
      </div>
      <div className="mc-body">
        <p className="mc-title">{item.title}</p>
        <p className="mc-artist">{item.artist || item.host}</p>
        {item.streams && (
          <p className="mc-streams"><BarChart2 size={11} /> {item.streams}</p>
        )}
      </div>

      <style>{`
        .mc-card {
          display: flex; flex-direction: column;
          background: #fff; border: 1px solid rgba(15,23,42,0.06);
          border-radius: 16px; overflow: hidden;
          transition: all 0.25s ease; text-decoration: none;
          box-shadow: 0 2px 12px rgba(15,23,42,0.04);
        }
        .mc-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(15,23,42,0.1); border-color: rgba(22,119,255,0.15); }

        .mc-cover-wrap { position: relative; aspect-ratio: 1; overflow: hidden; }
        .mc-cover { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .mc-card:hover .mc-cover { transform: scale(1.06); }

        .mc-play-btn {
          position: absolute; bottom: 10px; right: 10px;
          width: 40px; height: 40px; border-radius: 50%;
          background: #1677FF; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transform: translateY(6px) scale(0.9);
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(22,119,255,0.4);
        }
        .mc-card:hover .mc-play-btn,
        .mc-play-btn.mc-playing { opacity: 1; transform: translateY(0) scale(1); }

        .mc-genre-tag {
          position: absolute; top: 10px; left: 10px;
          background: rgba(255,255,255,0.92); backdrop-filter: blur(8px);
          font-size: 0.6rem; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--text-main);
          padding: 0.2rem 0.55rem; border-radius: 6px;
        }

        .mc-body { padding: 0.9rem 1rem; }
        .mc-title {
          font-size: 0.88rem; font-weight: 700; color: var(--text-main);
          margin-bottom: 2px; font-family: 'Outfit', sans-serif;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .mc-artist { font-size: 0.75rem; color: var(--text-gray); margin-bottom: 4px; }
        .mc-streams { font-size: 0.68rem; color: var(--text-muted); display: flex; align-items: center; gap: 3px; }
      `}</style>
    </Link>
  );
};

export default MediaCard;
