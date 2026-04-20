import { useState } from 'react';
import {
  DollarSign, TrendingUp, Download, PieChart,
  ArrowUpRight, ArrowDownRight, CreditCard,
  Wallet, Calendar, Filter, CheckCircle, BarChart2
} from 'lucide-react';

const STATS = [
  { label: 'Total Earnings',    value: '$12,450.80', change: '+14.2%',          up: true,  icon: TrendingUp,  color: '#22C55E' },
  { label: 'Available Balance', value: '$3,820.15',  change: 'Payout Apr 1st',  up: null,  icon: Wallet,      color: '#1677FF' },
  { label: 'Monthly Revenue',   value: '$1,240.00',  change: '+5.4% vs last mo',up: true,  icon: BarChart2,   color: '#F59E0B' },
];

const TRANSACTIONS = [
  { id: 1, type: 'Payout',             date: 'Mar 15, 2026', amount: '-$2,450.00', status: 'Completed', method: 'Standard Bank **** 4410',       out: true  },
  { id: 2, type: 'Streaming Royalties',date: 'Mar 01, 2026', amount: '+$3,240.50', status: 'Processed', method: 'Spotify · Apple Music · CLM',    out: false },
  { id: 3, type: 'Sync Licensing',     date: 'Feb 24, 2026', amount: '+$850.00',   status: 'Processed', method: 'Video Production "Neon Sky"',     out: false },
  { id: 4, type: 'Payout',             date: 'Feb 15, 2026', amount: '-$1,800.00', status: 'Completed', method: 'PayPal — pulse@clm.fm',           out: true  },
  { id: 5, type: 'Streaming Royalties',date: 'Feb 01, 2026', amount: '+$2,100.30', status: 'Processed', method: 'YouTube Music · Audiomack · CLM', out: false },
];

const PLATFORMS = [
  { name: 'Spotify',    pct: 45, color: '#22C55E' },
  { name: 'YouTube',    pct: 25, color: '#EF4444'  },
  { name: 'Apple Music',pct: 20, color: '#818CF8'  },
  { name: 'Other',      pct: 10, color: '#94A3B8'  },
];

const TIME_FILTERS = ['30D', '90D', '1Y', 'ALL'];

const RoyaltiesPage = () => {
  const [timeFilter, setTimeFilter] = useState('30D');

  return (
    <div className="ry-page fade-in">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="ry-header">
        <div>
          <div className="eyebrow"><DollarSign size={13} className="text-gold" /> FINANCIAL HUB</div>
          <h1 className="ry-h1">Royalties &amp; Earnings</h1>
          <p className="ry-sub">Detailed breakdown of your creative revenue and dividends.</p>
        </div>
        <button className="ry-export-btn">
          <Download size={15} /> Export Tax Report
        </button>
      </div>

      {/* ── Stat cards ──────────────────────────────────────── */}
      <div className="ry-stats-grid">
        {STATS.map(s => (
          <div key={s.label} className="ry-stat-card">
            <div className="ry-stat-top">
              <div className="ry-stat-icon" style={{ background: `${s.color}18`, color: s.color }}>
                <s.icon size={20} />
              </div>
              {s.up !== null
                ? <span className="ry-badge-up"><ArrowUpRight size={11} /> {s.change}</span>
                : <span className="ry-badge-info">{s.change}</span>
              }
            </div>
            <p className="ry-stat-label">{s.label}</p>
            <p className="ry-stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Main layout ─────────────────────────────────────── */}
      <div className="ry-layout">

        {/* Left col */}
        <div className="ry-main-col">

          {/* Platform breakdown */}
          <div className="ry-panel">
            <div className="ry-panel-hd">
              <h3 className="ry-panel-title"><PieChart size={17} className="text-blue" /> Earnings by Platform</h3>
              <div className="ry-time-tabs">
                {TIME_FILTERS.map(f => (
                  <button key={f}
                    className={`ry-time-tab ${timeFilter === f ? 'active' : ''}`}
                    onClick={() => setTimeFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="ry-chart-body">
              {/* Donut visual */}
              <div className="ry-donut-wrap">
                <div className="ry-donut" />
                <div className="ry-donut-center">
                  <span className="ry-donut-val">$12.4K</span>
                  <span className="ry-donut-sub">total</span>
                </div>
              </div>
              {/* Legend */}
              <div className="ry-legend">
                {PLATFORMS.map(p => (
                  <div key={p.name} className="ry-legend-item">
                    <span className="ry-legend-dot" style={{ background: p.color }} />
                    <span className="ry-legend-name">{p.name}</span>
                    <span className="ry-legend-pct">{p.pct}%</span>
                    {/* Bar */}
                    <div className="ry-legend-bar-bg">
                      <div className="ry-legend-bar-fill" style={{ width: `${p.pct}%`, background: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction history */}
          <div className="ry-panel">
            <div className="ry-panel-hd">
              <h3 className="ry-panel-title"><CreditCard size={17} className="text-blue" /> Transaction History</h3>
              <button className="ry-filter-btn"><Filter size={13} /> Filter</button>
            </div>
            <div className="ry-tx-list">
              {TRANSACTIONS.map(tx => (
                <div key={tx.id} className="ry-tx-row">
                  <div className={`ry-tx-icon ${tx.out ? 'out' : 'in'}`}>
                    {tx.out ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                  <div className="ry-tx-info">
                    <p className="ry-tx-type">{tx.type}</p>
                    <p className="ry-tx-method">{tx.method}</p>
                  </div>
                  <div className="ry-tx-mid">
                    <span className="ry-tx-date"><Calendar size={11} /> {tx.date}</span>
                    <span className={`ry-tx-status ${tx.status.toLowerCase()}`}>{tx.status}</span>
                  </div>
                  <span className={`ry-tx-amount ${tx.out ? 'out' : 'in'}`}>{tx.amount}</span>
                </div>
              ))}
            </div>
            <button className="ry-view-more">View All Transactions</button>
          </div>
        </div>

        {/* Right col — payout sidebar */}
        <aside className="ry-sidebar">

          {/* Payout CTA card */}
          <div className="ry-payout-card">
            <p className="ry-payout-label">AVAILABLE FOR WITHDRAWAL</p>
            <p className="ry-payout-amount">$3,820.15</p>
            <p className="ry-payout-note">Minimum $50 · Processed within 48 hours</p>
            <button className="ry-payout-btn">Transfer to Bank <ArrowUpRight size={15} /></button>
          </div>

          {/* Payout method */}
          <div className="ry-method-card">
            <p className="ry-method-title"><Wallet size={15} className="text-blue" /> Payout Method</p>
            <div className="ry-method-item">
              <div className="ry-method-icon"><CreditCard size={18} /></div>
              <div className="ry-method-info">
                <p className="ry-method-name">Standard Bank</p>
                <p className="ry-method-detail">**** **** **** 4410</p>
              </div>
              <CheckCircle size={16} className="ry-method-check" />
            </div>
            <button className="ry-manage-btn">Manage Methods</button>
          </div>

          {/* Release performance */}
          <div className="ry-perf-card">
            <p className="ry-perf-title"><BarChart2 size={15} className="text-blue" /> Top Earning Releases</p>
            {[
              { title: 'Frequency',    streams: '410K', earned: '$1,280' },
              { title: 'Night Bloom',  streams: '312K', earned: '$940'   },
              { title: 'Afterglow',    streams: '278K', earned: '$835'   },
            ].map((r, i) => (
              <div key={r.title} className="ry-perf-row">
                <span className="ry-perf-num">{i + 1}</span>
                <div className="ry-perf-info">
                  <p className="ry-perf-name">{r.title}</p>
                  <p className="ry-perf-streams">{r.streams} streams</p>
                </div>
                <span className="ry-perf-earned">{r.earned}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <style>{`
        .ry-page { padding-bottom: 3rem; }

        /* Header */
        .ry-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap; }
        .ry-h1 { font-size: 2.2rem; font-weight: 900; color: var(--text-main); font-family: 'Outfit', sans-serif; letter-spacing: -0.03em; margin: 0.25rem 0; }
        .ry-sub { color: var(--text-gray); font-size: 0.95rem; }
        .ry-export-btn { display: flex; align-items: center; gap: 0.5rem; background: #fff; border: 1.5px solid rgba(15,23,42,0.1); border-radius: 10px; padding: 0.6rem 1.1rem; font-size: 0.82rem; font-weight: 700; color: var(--text-gray); cursor: pointer; transition: all 0.15s ease; flex-shrink: 0; }
        .ry-export-btn:hover { border-color: rgba(22,119,255,0.3); color: var(--accent-blue); }

        /* Stat cards */
        .ry-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 2rem; }
        @media (max-width: 900px) { .ry-stats-grid { grid-template-columns: 1fr; } }
        .ry-stat-card { background: #fff; border: 1px solid rgba(15,23,42,0.06); border-radius: 18px; padding: 1.75rem; box-shadow: 0 2px 12px rgba(15,23,42,0.04); }
        .ry-stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
        .ry-stat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .ry-badge-up { display: flex; align-items: center; gap: 3px; font-size: 0.72rem; font-weight: 800; color: #22C55E; background: rgba(34,197,94,0.1); padding: 0.22rem 0.6rem; border-radius: 20px; }
        .ry-badge-info { font-size: 0.72rem; font-weight: 700; color: var(--accent-blue); background: rgba(22,119,255,0.08); padding: 0.22rem 0.6rem; border-radius: 20px; }
        .ry-stat-label { font-size: 0.78rem; font-weight: 600; color: var(--text-gray); margin-bottom: 0.35rem; }
        .ry-stat-value { font-size: 2rem; font-weight: 900; color: var(--text-main); font-family: 'Outfit', sans-serif; letter-spacing: -0.03em; }

        /* Layout */
        .ry-layout { display: grid; grid-template-columns: 1fr 320px; gap: 1.75rem; }
        @media (max-width: 1100px) { .ry-layout { grid-template-columns: 1fr; } }
        .ry-main-col { display: flex; flex-direction: column; gap: 1.75rem; }

        /* Panel */
        .ry-panel { background: #fff; border: 1px solid rgba(15,23,42,0.06); border-radius: 20px; overflow: hidden; box-shadow: 0 2px 12px rgba(15,23,42,0.04); }
        .ry-panel-hd { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 1.75rem; border-bottom: 1px solid rgba(15,23,42,0.06); }
        .ry-panel-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; font-weight: 800; color: var(--text-main); font-family: 'Outfit', sans-serif; }

        /* Time tabs */
        .ry-time-tabs { display: flex; gap: 0.25rem; background: var(--bg-elevated); border-radius: 8px; padding: 0.25rem; }
        .ry-time-tab { padding: 0.3rem 0.7rem; font-size: 0.72rem; font-weight: 800; color: var(--text-dim); border-radius: 6px; cursor: pointer; transition: all 0.15s ease; }
        .ry-time-tab.active { background: #fff; color: var(--accent-blue); box-shadow: 0 1px 4px rgba(15,23,42,0.08); }

        /* Chart body */
        .ry-chart-body { display: flex; align-items: center; gap: 3rem; padding: 2rem 1.75rem; }
        
        @media (max-width: 1024px) {
          .ry-h1 { font-size: 1.8rem; }
          .ry-stat-value { font-size: 1.6rem; }
        }

        @media (max-width: 700px) { 
          .ry-chart-body { flex-direction: column; gap: 1.5rem; } 
          .ry-legend-item { grid-template-columns: 10px 1fr auto; }
          .ry-legend-bar-bg { display: none; }
          .ry-tx-row { padding: 1rem; gap: 0.75rem; }
          .ry-tx-mid { display: none; }
          .ry-header { flex-direction: column; align-items: flex-start; }
          .ry-export-btn { width: 100%; justify-content: center; }
        }

        /* Donut */
        .ry-donut-wrap { position: relative; width: 160px; height: 160px; flex-shrink: 0; }
        .ry-donut {
          width: 160px; height: 160px; border-radius: 50%;
          background: conic-gradient(
            #22C55E 0% 45%,
            #EF4444 45% 70%,
            #818CF8 70% 90%,
            #94A3B8 90% 100%
          );
        }
        .ry-donut::after { content: ''; position: absolute; inset: 30px; background: #fff; border-radius: 50%; }
        .ry-donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1; }
        .ry-donut-val { font-size: 1.1rem; font-weight: 900; color: var(--text-main); font-family: 'Outfit', sans-serif; }
        .ry-donut-sub { font-size: 0.65rem; color: var(--text-dim); font-weight: 600; }

        /* Legend */
        .ry-legend { flex: 1; display: flex; flex-direction: column; gap: 0.9rem; }
        .ry-legend-item { display: grid; grid-template-columns: 10px 1fr auto 120px; align-items: center; gap: 0.6rem; }
        .ry-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .ry-legend-name { font-size: 0.82rem; font-weight: 600; color: var(--text-gray); }
        .ry-legend-pct { font-size: 0.78rem; font-weight: 800; color: var(--text-main); text-align: right; }
        .ry-legend-bar-bg { height: 6px; background: var(--bg-elevated); border-radius: 99px; overflow: hidden; }
        .ry-legend-bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }

        /* Transactions */
        .ry-filter-btn { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; font-weight: 700; color: var(--text-gray); background: var(--bg-elevated); border-radius: 8px; padding: 0.4rem 0.8rem; cursor: pointer; transition: color 0.15s ease; }
        .ry-filter-btn:hover { color: var(--accent-blue); }
        .ry-tx-list { display: flex; flex-direction: column; }
        .ry-tx-row { display: flex; align-items: center; gap: 1rem; padding: 1.1rem 1.75rem; border-bottom: 1px solid rgba(15,23,42,0.05); transition: background 0.15s ease; }
        .ry-tx-row:last-child { border-bottom: none; }
        .ry-tx-row:hover { background: rgba(22,119,255,0.02); }
        .ry-tx-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ry-tx-icon.in { background: rgba(34,197,94,0.1); color: #22C55E; }
        .ry-tx-icon.out { background: rgba(239,68,68,0.08); color: #EF4444; }
        .ry-tx-info { flex: 1; min-width: 0; }
        .ry-tx-type { font-size: 0.88rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px; }
        .ry-tx-method { font-size: 0.73rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ry-tx-mid { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
        .ry-tx-date { display: flex; align-items: center; gap: 4px; font-size: 0.7rem; color: var(--text-muted); }
        .ry-tx-status { font-size: 0.62rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.15rem 0.45rem; border-radius: 4px; }
        .ry-tx-status.completed { background: rgba(34,197,94,0.1); color: #22C55E; }
        .ry-tx-status.processed { background: rgba(22,119,255,0.08); color: var(--accent-blue); }
        .ry-tx-amount { font-size: 0.9rem; font-weight: 900; flex-shrink: 0; font-family: 'Outfit', sans-serif; }
        .ry-tx-amount.in  { color: #22C55E; }
        .ry-tx-amount.out { color: var(--text-main); }
        .ry-view-more { width: 100%; padding: 1rem; font-size: 0.82rem; font-weight: 700; color: var(--accent-blue); text-align: center; border-top: 1px solid rgba(15,23,42,0.06); cursor: pointer; transition: background 0.15s ease; }
        .ry-view-more:hover { background: rgba(22,119,255,0.04); }

        /* Sidebar */
        .ry-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }

        /* Payout card */
        .ry-payout-card { background: var(--accent-blue); border-radius: 20px; padding: 2rem; }
        .ry-payout-label { font-size: 0.62rem; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.65); margin-bottom: 0.5rem; }
        .ry-payout-amount { font-size: 2.4rem; font-weight: 900; color: #fff; font-family: 'Outfit', sans-serif; letter-spacing: -0.03em; margin-bottom: 0.4rem; }
        .ry-payout-note { font-size: 0.75rem; color: rgba(255,255,255,0.65); margin-bottom: 1.5rem; line-height: 1.4; }
        .ry-payout-btn { display: flex; align-items: center; justify-content: center; gap: 0.4rem; width: 100%; background: rgba(255,255,255,0.15); color: #fff; border: 1.5px solid rgba(255,255,255,0.25); border-radius: 12px; padding: 0.8rem; font-size: 0.9rem; font-weight: 800; cursor: pointer; transition: all 0.15s ease; }
        .ry-payout-btn:hover { background: rgba(255,255,255,0.25); }

        /* Method card */
        .ry-method-card { background: #fff; border: 1px solid rgba(15,23,42,0.06); border-radius: 18px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(15,23,42,0.04); }
        .ry-method-title { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem; font-family: 'Outfit', sans-serif; }
        .ry-method-item { display: flex; align-items: center; gap: 0.75rem; background: var(--bg-elevated); border-radius: 12px; padding: 0.875rem 1rem; margin-bottom: 1rem; border: 1.5px solid rgba(22,119,255,0.15); }
        .ry-method-icon { width: 36px; height: 36px; background: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-gray); box-shadow: 0 1px 4px rgba(15,23,42,0.08); flex-shrink: 0; }
        .ry-method-info { flex: 1; }
        .ry-method-name { font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
        .ry-method-detail { font-size: 0.73rem; color: var(--text-muted); }
        .ry-method-check { color: #22C55E; flex-shrink: 0; }
        .ry-manage-btn { width: 100%; padding: 0.6rem; font-size: 0.78rem; font-weight: 700; color: var(--accent-blue); border: 1.5px solid rgba(22,119,255,0.2); border-radius: 10px; cursor: pointer; transition: all 0.15s ease; }
        .ry-manage-btn:hover { background: rgba(22,119,255,0.05); }

        /* Performance card */
        .ry-perf-card { background: #fff; border: 1px solid rgba(15,23,42,0.06); border-radius: 18px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(15,23,42,0.04); }
        .ry-perf-title { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem; font-family: 'Outfit', sans-serif; }
        .ry-perf-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 0; border-bottom: 1px solid rgba(15,23,42,0.05); }
        .ry-perf-row:last-child { border-bottom: none; padding-bottom: 0; }
        .ry-perf-num { width: 20px; height: 20px; border-radius: 6px; background: var(--bg-elevated); font-size: 0.65rem; font-weight: 900; color: var(--text-dim); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ry-perf-info { flex: 1; }
        .ry-perf-name { font-size: 0.82rem; font-weight: 700; color: var(--text-main); }
        .ry-perf-streams { font-size: 0.7rem; color: var(--text-muted); }
        .ry-perf-earned { font-size: 0.85rem; font-weight: 800; color: #22C55E; flex-shrink: 0; }
      `}</style>
    </div>
  );
};

export default RoyaltiesPage;
