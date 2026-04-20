import { Link } from 'react-router-dom';
import { CheckCircle, Headphones, MapPin } from 'lucide-react';

const ArtistCard = ({ artist }) => (
  <Link to={`/profile`} className="ac-card">
    <div className="ac-avatar-wrap">
      <img src={artist.avatar} alt={artist.name} className="ac-avatar" />
      {artist.online && <span className="ac-online" />}
      {artist.verified && (
        <span className="ac-verified"><CheckCircle size={12} /></span>
      )}
    </div>
    <p className="ac-name">{artist.name}</p>
    <p className="ac-genre">{artist.genre}</p>
    <p className="ac-location"><MapPin size={10} /> {artist.location}</p>
    <div className="ac-stats">
      <span><Headphones size={10} /> {artist.monthlyListeners}</span>
      <span className={`ac-collab ${artist.collabStatus === 'open' ? 'ac-open' : ''}`}>
        {artist.collabStatus === 'open' ? 'Open' : 'Closed'}
      </span>
    </div>

    <style>{`
      .ac-card {
        display: flex; flex-direction: column; align-items: center;
        background: #fff; border: 1px solid rgba(15,23,42,0.06);
        border-radius: 18px; padding: 1.5rem 1.25rem;
        text-align: center; text-decoration: none;
        transition: all 0.25s ease;
        box-shadow: 0 2px 12px rgba(15,23,42,0.04);
      }
      .ac-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(15,23,42,0.1); border-color: rgba(22,119,255,0.15); }

      .ac-avatar-wrap { position: relative; margin-bottom: 0.9rem; }
      .ac-avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(15,23,42,0.06); transition: transform 0.3s ease; }
      .ac-card:hover .ac-avatar { transform: scale(1.05); }

      .ac-online {
        position: absolute; bottom: 3px; right: 3px;
        width: 11px; height: 11px; background: #22C55E;
        border-radius: 50%; border: 2px solid #fff;
      }
      .ac-verified {
        position: absolute; top: 0; right: -2px;
        background: #1677FF; color: #fff; border-radius: 50%;
        width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
      }

      .ac-name { font-size: 0.9rem; font-weight: 800; color: var(--text-main); font-family: 'Outfit', sans-serif; margin-bottom: 2px; }
      .ac-genre { font-size: 0.72rem; color: #1677FF; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; }
      .ac-location { font-size: 0.7rem; color: var(--text-muted); display: flex; align-items: center; gap: 3px; justify-content: center; margin-bottom: 0.75rem; }

      .ac-stats { display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 0.68rem; color: var(--text-muted); }
      .ac-stats span { display: flex; align-items: center; gap: 3px; }
      .ac-collab { padding: 0.15rem 0.5rem; border-radius: 20px; background: rgba(100,116,139,0.08); font-weight: 700; }
      .ac-collab.ac-open { background: rgba(34,197,94,0.1); color: #16a34a; }
    `}</style>
  </Link>
);

export default ArtistCard;
