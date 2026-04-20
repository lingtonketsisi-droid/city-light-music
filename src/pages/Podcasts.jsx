import { Play, Mic2, Clock, Headphones, ChevronRight, Share2, Mic } from 'lucide-react';
import { MOCK_PODCASTS } from '../data/mockData';

const PodcastsPage = () => {
  return (
    <div className="pod-page fade-in">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="pod-header">
        <div>
          <div className="eyebrow"><Mic2 size={13} className="text-magenta" /> PODCAST NETWORK</div>
          <h1 className="pod-h1">Voices &amp; Conversations</h1>
          <p className="pod-sub">Podcasts, interviews, and stories shaping the culture.</p>
        </div>
      </div>

      {MOCK_PODCASTS.length > 0 ? (
        <div className="pod-grid">
           {/* Real podcast mapping logic would go here */}
        </div>
      ) : (
        <div className="glass-v2 p-20 text-center rounded-[32px] border border-dashed flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <Mic size={40} />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black">No Podcasts Found</h2>
                <p className="text-gray max-w-sm mx-auto">The City Light podcast network is getting its studios ready. Check back soon for exclusive creator insights, industry talk, and deep-dive artist interviews.</p>
            </div>
            <button className="btn-primary" onClick={() => window.location.href='/upload'}>
                Distribute Your Content
            </button>
        </div>
      )}

      <style>{`
        .pod-page { padding-bottom: 2rem; }
        .pod-h1 { font-size: 2.22rem; font-weight: 900; family: 'Outfit', sans-serif; letter-spacing: -0.03em; margin: 5px 0; }
        .pod-sub { color: var(--text-gray); font-size: 0.95rem; }
      `}</style>
    </div>
  );
};

export default PodcastsPage;
