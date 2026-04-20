import { useState } from 'react';
import {
  TrendingUp, Clock, Flame, Globe, Music,
  Briefcase, Palette, ChevronRight, Rss, Search, BookOpen, Newspaper
} from 'lucide-react';
import { MOCK_NEWS } from '../data/mockData';

const NewsPage = () => {
  return (
    <div className="np-page fade-in">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="np-header">
        <div>
          <div className="eyebrow"><BookOpen size={13} className="text-blue" /> ENTERTAINMENT NEWS</div>
          <h1 className="np-h1">What's Happening</h1>
          <p className="np-sub">Music, culture, and industry stories shaping the entertainment landscape.</p>
        </div>
      </div>

      {MOCK_NEWS.length > 0 ? (
        <div className="np-grid">
           {/* Real news mapping logic would go here */}
        </div>
      ) : (
        <div className="glass-v2 p-20 text-center rounded-[32px] border border-dashed flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <Newspaper size={40} />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black">No Stories Found</h2>
                <p className="text-gray max-w-sm mx-auto">The City Light newsroom is currently silent. We are preparing to bring you the latest independent music news, culture highlights, and industry breakthroughs.</p>
            </div>
        </div>
      )}

      <style>{`
        .np-page { padding-bottom: 2rem; }
        .np-h1 { font-size: 2.22rem; font-weight: 900; family: 'Outfit', sans-serif; letter-spacing: -0.03em; margin: 5px 0; }
        .np-sub { color: var(--text-gray); font-size: 0.95rem; }
      `}</style>
    </div>
  );
};

export default NewsPage;
