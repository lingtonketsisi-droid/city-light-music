import { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle,
  Volume2, VolumeX, Heart, ListMusic, Maximize2,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { motion } from 'framer-motion';

const StickyPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, volume, setVolume } = usePlayer();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [liked, setLiked]     = useState(false);
  const [muted, setMuted]     = useState(false);
  const [repeat, setRepeat]   = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const audioRef = useRef(null);

  // Handle play/pause when state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed:", e);
          if (isPlaying) togglePlay(); // Revert state if play blocked
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  if (!currentTrack) return null;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (duration > 0) {
        setProgress((audioRef.current.currentTime / duration) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (repeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      if (isPlaying) togglePlay();
      setProgress(0);
      setCurrentTime(0);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || duration === 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const seekPct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    audioRef.current.currentTime = seekPct * duration;
    setProgress(seekPct * 100);
  };

  const pct = `${progress}%`;
  const fmt = s => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="plr-wrap"
      initial={{ y: 110, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 120 }}
    >
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={(e) => console.error("Audio error:", e.target.error)}
      />

      <div className="plr-bar">
        {/* Progress rail — full width at top */}
        <div className="plr-rail-top" onClick={handleSeek}>
          <div className="plr-rail-fill" style={{ width: pct }}>
            <span className="plr-handle" />
          </div>
        </div>

        <div className="plr-inner">
          {/* Left — track info */}
          <div className="plr-track">
            <div className="plr-art-wrap">
              <img src={currentTrack.cover} alt={currentTrack.title} className="plr-art" />
              <div className="plr-art-glow" />
            </div>
            <div className="plr-track-text">
              <p className="plr-title">{currentTrack.title}</p>
              <p className="plr-artist">{currentTrack.artist}</p>
            </div>
            <button
              className={`plr-like ${liked ? 'liked' : ''}`}
              onClick={() => setLiked(l => !l)}
              aria-label="Like"
            >
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Centre — controls */}
          <div className="plr-center">
            <div className="plr-controls">
              <button className={`plr-btn plr-btn-sm ${shuffle ? 'active' : ''}`}
                onClick={() => setShuffle(s => !s)}>
                <Shuffle size={15} />
              </button>
              <button className="plr-btn plr-btn-md">
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button className="plr-play-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying
                  ? <Pause size={22} fill="#fff" />
                  : <Play  size={22} fill="#fff" style={{ marginLeft: 2 }} />}
              </button>
              <button className="plr-btn plr-btn-md">
                <SkipForward size={20} fill="currentColor" />
              </button>
              <button className={`plr-btn plr-btn-sm ${repeat ? 'active' : ''}`}
                onClick={() => setRepeat(r => !r)}>
                <Repeat size={15} />
              </button>
            </div>
            <div className="plr-time-row">
              <span className="plr-time">{fmt(currentTime)}</span>
              <span className="plr-time">{fmt(duration)}</span>
            </div>
          </div>

          {/* Right — volume + extras */}
          <div className="plr-right">
            <button className="plr-btn plr-btn-sm" onClick={() => setMuted(m => !m)}>
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div className="plr-vol-rail" onClick={e => {
              const r = e.currentTarget.getBoundingClientRect();
              const newVol = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
              setVolume(newVol);
              if (newVol > 0 && muted) setMuted(false);
              if (newVol === 0 && !muted) setMuted(true);
            }}>
              <div className="plr-vol-fill" style={{ width: muted ? '0%' : `${(volume ?? 0.8) * 100}%` }} />
            </div>
            <div className="plr-divider" />
            <button className="plr-btn plr-btn-sm" aria-label="Queue">
              <ListMusic size={16} />
            </button>
            <button className="plr-btn plr-btn-sm" aria-label="Full player">
              <Maximize2 size={15} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Wrapper ─────────────────────────────────────────── */
        .plr-wrap {
          position: fixed;
          bottom: 0; left: 248px; right: 0;
          z-index: 100;
          padding: 0 1.5rem 0.75rem;
        }

        .plr-bar {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 18px;
          box-shadow:
            0 -2px 40px rgba(15,23,42,0.08),
            0 8px 40px rgba(15,23,42,0.06);
          overflow: hidden;
        }

        /* ── Progress rail ───────────────────────────────────── */
        .plr-rail-top {
          width: 100%; height: 3px;
          background: rgba(15,23,42,0.06);
          cursor: pointer; position: relative;
        }
        .plr-rail-top:hover { height: 5px; }
        .plr-rail-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-blue), #3BA7FF);
          border-radius: 0 4px 4px 0;
          position: relative; transition: width 0.1s ease;
        }
        .plr-handle {
          position: absolute; right: -5px; top: 50%;
          transform: translateY(-50%) scale(0);
          width: 12px; height: 12px;
          background: var(--accent-blue); border-radius: 50%;
          box-shadow: 0 0 6px rgba(22,119,255,0.4);
          transition: transform 0.15s ease;
        }
        .plr-rail-top:hover .plr-handle { transform: translateY(-50%) scale(1); }

        /* ── Inner row ───────────────────────────────────────── */
        .plr-inner {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          gap: 1rem;
        }

        /* ── Track section ───────────────────────────────────── */
        .plr-track {
          display: flex; align-items: center;
          gap: 0.9rem; min-width: 0;
          width: 260px; flex-shrink: 0;
        }
        .plr-art-wrap { position: relative; flex-shrink: 0; }
        .plr-art {
          width: 52px; height: 52px;
          border-radius: 10px; object-fit: cover;
          display: block;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        .plr-art-glow {
          position: absolute; inset: -4px;
          border-radius: 14px;
          background: radial-gradient(ellipse, rgba(22,119,255,0.2) 0%, transparent 70%);
          animation: plrGlow 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes plrGlow {
          0%,100% { opacity: 0.4; } 50% { opacity: 0.9; }
        }
        .plr-track-text { flex: 1; min-width: 0; }
        .plr-title {
          font-size: 0.88rem; font-weight: 700;
          color: var(--text-main);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 2px;
        }
        .plr-artist {
          font-size: 0.75rem; color: var(--text-gray);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .plr-like {
          color: var(--text-dim); flex-shrink: 0;
          transition: color 0.15s ease, transform 0.15s ease;
          background: transparent; border: none; cursor: pointer;
          padding: 0.3rem;
        }
        .plr-like:hover { color: #EF4444; transform: scale(1.15); }
        .plr-like.liked { color: #EF4444; }

        /* ── Centre controls ─────────────────────────────────── */
        .plr-center {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: 0.35rem; max-width: 420px;
        }
        .plr-controls { display: flex; align-items: center; gap: 1.25rem; }
        .plr-btn {
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: none; cursor: pointer;
          color: var(--text-gray); transition: all 0.15s ease;
          border-radius: 8px; padding: 0.3rem;
        }
        .plr-btn-sm { color: var(--text-muted); }
        .plr-btn-md { color: var(--text-gray); }
        .plr-btn:hover { color: var(--text-main); transform: scale(1.1); }
        .plr-btn.active { color: var(--accent-blue); }

        .plr-play-btn {
          width: 46px; height: 46px; border-radius: 50%;
          background: var(--accent-blue); color: #fff;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(22,119,255,0.3);
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .plr-play-btn:hover { transform: scale(1.06); box-shadow: 0 6px 22px rgba(22,119,255,0.4); }
        .plr-play-btn:active { transform: scale(0.96); }

        .plr-time-row {
          display: flex; align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .plr-time {
          font-size: 0.65rem; color: var(--text-muted);
          font-variant-numeric: tabular-nums;
          font-family: 'Inter', sans-serif;
        }

        /* ── Right section ───────────────────────────────────── */
        .plr-right {
          display: flex; align-items: center;
          gap: 0.6rem; width: 240px;
          justify-content: flex-end; flex-shrink: 0;
        }
        .plr-vol-rail {
          width: 80px; height: 4px;
          background: rgba(15,23,42,0.1);
          border-radius: 4px; cursor: pointer; position: relative;
        }
        .plr-vol-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-blue), #3BA7FF);
          border-radius: 4px; transition: width 0.1s ease;
        }
        .plr-divider {
          width: 1px; height: 22px;
          background: rgba(15,23,42,0.08); flex-shrink: 0;
          margin: 0 0.25rem;
        }

        /* ── Responsive ──────────────────────────────────────── */
        @media (max-width: 1100px) {
          .plr-wrap { left: 0; padding: 0 1rem 0.75rem; }
          .plr-right { display: none; }
          .plr-track { width: 200px; }
        }
        @media (max-width: 700px) {
          .plr-track { width: 140px; }
          .plr-btn-sm { display: none; }
        }
      `}</style>
    </motion.div>
  );
};

export default StickyPlayer;
