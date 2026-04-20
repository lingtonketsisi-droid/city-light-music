import { useState } from 'react';
import {
  ShieldCheck, CheckCircle, XCircle, Search,
  MoreVertical, Eye, Users, Disc, FileText, Handshake,
  Flag, AlertTriangle, MessageSquare, X, Check,
  RefreshCw, Ban, DollarSign, Lock, AlertOctagon
} from 'lucide-react';
import { MOCK_RELEASES, STATUSES, MOCK_ADMIN_COLLABS, MOCK_DEALS } from '../data/mockData';

/* ─────────────────────────────────────────────────────────────
   STATUS CONFIGS
───────────────────────────────────────────────────────────── */
const COLLAB_STATUSES = ['pending', 'accepted', 'declined', 'completed', 'disputed'];

const DEAL_STATUS_CFG = {
  proposal:         { label: 'Proposal',       bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.3)',  text: '#a78bfa' },
  pending_payment:  { label: 'Pending Payment', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)',  text: '#fbbf24' },
  in_escrow:        { label: 'In Escrow',       bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
  work_in_progress: { label: 'In Progress',     bg: 'rgba(91,156,246,0.1)', border: 'rgba(91,156,246,0.3)', text: '#5b9cf6' },
  delivered:        { label: 'Delivered',        bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', text: '#818cf8' },
  approved:         { label: 'Approved',         bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
  released:         { label: 'Released',         bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: '#6ee7b7' },
  revision_requested: { label: 'Revision',       bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', text: '#fde68a' },
  disputed:         { label: 'Disputed',         bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  text: '#f87171' },
  cancelled:        { label: 'Cancelled',        bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)', text: '#9ca3af' },
};
const DealStatusBadge = ({ status }) => {
  const cfg = DEAL_STATUS_CFG[status] || DEAL_STATUS_CFG.cancelled;
  return (
    <span className="collab-status-badge" style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}>
      {cfg.label}
    </span>
  );
};

const statusConfig = {
  pending:    { label: 'Pending',    bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)',  text: '#fbbf24' },
  accepted:   { label: 'Accepted',   bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
  declined:   { label: 'Declined',   bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  text: '#ef4444' },
  completed:  { label: 'Completed',  bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', text: '#818cf8' },
  disputed:   { label: 'Disputed',   bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', text: '#fb923c' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className="collab-status-badge"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────
   DEAL DETAIL MODAL
───────────────────────────────────────────────────────────── */
const DealDetailModal = ({ deal, onClose, onStatusChange, onFlag }) => {
  const [adminNote, setAdminNote] = useState(deal.adminNotes || '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass" onClick={e => e.stopPropagation()} style={{ maxWidth: 620 }}>
        <div className="modal-header">
          <div>
            <p className="modal-eyebrow"><DollarSign size={13} /> Escrow Deal Detail</p>
            <h2 className="modal-title">{deal.projectName}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Parties */}
        <div className="modal-parties">
          <div className="modal-party">
            <img src={deal.buyer.avatar} alt="" className="modal-avatar" />
            <div>
              <span className="modal-party-role">Buyer</span>
              <p className="modal-party-name">
                {deal.buyer.name}
                {deal.buyer.verified && <CheckCircle size={12} style={{ color: 'var(--accent-gold)', marginLeft: 4 }} />}
              </p>
            </div>
          </div>
          <div className="modal-arrow">→</div>
          <div className="modal-party">
            <img src={deal.seller.avatar} alt="" className="modal-avatar" />
            <div>
              <span className="modal-party-role">Seller</span>
              <p className="modal-party-name">
                {deal.seller.name}
                {deal.seller.verified && <CheckCircle size={12} style={{ color: 'var(--accent-gold)', marginLeft: 4 }} />}
              </p>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="modal-detail-grid">
          {[
            { label: 'Type',       value: deal.type },
            { label: 'Amount',     value: `${deal.currency} ${deal.amount.toLocaleString()}` },
            { label: 'Platform Fee', value: `${deal.currency} ${deal.escrow.fee.toLocaleString()}` },
            { label: 'Payout',     value: `${deal.currency} ${deal.escrow.payout.toLocaleString()}` },
            { label: 'Deadline',   value: deal.deadline },
            { label: 'Created',    value: deal.createdAt },
            { label: 'Escrow',     value: deal.escrow.paid
                ? <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.8rem' }}>✓ Paid {deal.escrow.paidAt}</span>
                : <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.8rem' }}>⏳ Awaiting payment</span> },
            { label: 'Status',     value: <DealStatusBadge status={deal.status} /> },
            { label: 'Flagged',    value: deal.flagged
                ? <span style={{ color: '#fb923c', fontWeight: 700, fontSize: '0.8rem' }}>⚑ Flagged</span>
                : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No</span> },
            { label: 'Revisions',  value: `${deal.revisionsUsed} / ${deal.revisions} used` },
          ].map(({ label, value }) => (
            <div key={label} className="modal-detail-item">
              <span className="modal-detail-label">{label}</span>
              <span className="modal-detail-val">{value}</span>
            </div>
          ))}
        </div>

        {/* Deliverables */}
        <div className="modal-section">
          <label className="modal-section-label">Deliverables</label>
          <ul style={{ paddingLeft: '1rem', color: 'var(--text-gray)', fontSize: '0.85rem', lineHeight: 1.8 }}>
            {deal.deliverables.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>

        {/* Admin notes */}
        <div className="modal-section">
          <label className="modal-section-label">Admin Notes</label>
          <textarea
            className="modal-notes-input"
            placeholder="Add internal notes about this deal…"
            value={adminNote}
            onChange={e => setAdminNote(e.target.value)}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <div className="modal-status-actions" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="modal-section-label" style={{ marginRight: '0.25rem' }}>Set Status:</span>
            {['pending_payment', 'in_escrow', 'work_in_progress', 'delivered', 'released', 'disputed', 'cancelled']
              .filter(s => s !== deal.status)
              .map(s => {
                const c = DEAL_STATUS_CFG[s];
                return (
                  <button
                    key={s}
                    className="modal-status-btn"
                    style={{ color: c.text, borderColor: c.border, background: c.bg }}
                    onClick={() => onStatusChange(deal.id, s)}
                  >
                    {c.label}
                  </button>
                );
              })}
          </div>
          <div className="modal-mod-actions">
            <button
              className={`modal-mod-btn flag-btn ${deal.flagged ? 'flagged' : ''}`}
              onClick={() => onFlag(deal.id)}
            >
              <Flag size={14} />
              {deal.flagged ? 'Unflag' : 'Flag for Review'}
            </button>
            <button className="modal-mod-btn chat-btn">
              <MessageSquare size={14} /> View Chat History
            </button>
            {deal.status === 'disputed' && (
              <button
                className="modal-mod-btn"
                style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)' }}
                onClick={() => onStatusChange(deal.id, 'released')}
              >
                <Check size={14} /> Release Funds
              </button>
            )}
            {deal.status === 'disputed' && (
              <button
                className="modal-mod-btn suspend-btn"
                onClick={() => onStatusChange(deal.id, 'cancelled')}
              >
                <Ban size={14} /> Cancel & Refund
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   COLLAB DETAIL MODAL
───────────────────────────────────────────────────────────── */
const DetailModal = ({ collab, onClose, onStatusChange, onFlag }) => {
  const [adminNote, setAdminNote] = useState(collab.notes || '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="modal-eyebrow"><Handshake size={13} /> Collaboration Detail</p>
            <h2 className="modal-title">{collab.projectName}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Parties */}
        <div className="modal-parties">
          <div className="modal-party">
            <img src={collab.sender.avatar} alt="" className="modal-avatar" />
            <div>
              <span className="modal-party-role">Sender</span>
              <p className="modal-party-name">
                {collab.sender.name}
                {collab.sender.verified && <CheckCircle size={12} style={{ color: 'var(--accent-gold)', marginLeft: 4 }} />}
              </p>
            </div>
          </div>
          <div className="modal-arrow">→</div>
          <div className="modal-party">
            <img src={collab.recipient.avatar} alt="" className="modal-avatar" />
            <div>
              <span className="modal-party-role">Recipient</span>
              <p className="modal-party-name">
                {collab.recipient.name}
                {collab.recipient.verified && <CheckCircle size={12} style={{ color: 'var(--accent-gold)', marginLeft: 4 }} />}
              </p>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="modal-detail-grid">
          {[
            { label: 'Type',   value: collab.collabType },
            { label: 'Terms',  value: collab.terms },
            { label: 'Budget', value: collab.budget || '—' },
            { label: 'Date',   value: collab.date },
            { label: 'Status', value: <StatusBadge status={collab.status} /> },
            { label: 'Flagged', value: collab.flagged
                ? <span style={{ color: '#fb923c', fontWeight: 700, fontSize: '0.8rem' }}>⚑ Flagged</span>
                : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No</span> },
          ].map(({ label, value }) => (
            <div key={label} className="modal-detail-item">
              <span className="modal-detail-label">{label}</span>
              <span className="modal-detail-val">{value}</span>
            </div>
          ))}
        </div>

        {/* Admin notes */}
        <div className="modal-section">
          <label className="modal-section-label">Admin Notes</label>
          <textarea
            className="modal-notes-input"
            placeholder="Add internal notes about this collaboration…"
            value={adminNote}
            onChange={e => setAdminNote(e.target.value)}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <div className="modal-status-actions">
            <span className="modal-section-label" style={{ marginRight: '0.5rem' }}>Change Status:</span>
            {COLLAB_STATUSES.filter(s => s !== collab.status).map(s => {
              const cfg = statusConfig[s];
              return (
                <button
                  key={s}
                  className="modal-status-btn"
                  style={{ color: cfg.text, borderColor: cfg.border, background: cfg.bg }}
                  onClick={() => onStatusChange(collab.id, s)}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
          <div className="modal-mod-actions">
            <button
              className={`modal-mod-btn flag-btn ${collab.flagged ? 'flagged' : ''}`}
              onClick={() => onFlag(collab.id)}
            >
              <Flag size={14} />
              {collab.flagged ? 'Unflag' : 'Flag for Review'}
            </button>
            <button className="modal-mod-btn chat-btn">
              <MessageSquare size={14} /> View Chat History
            </button>
            <button className="modal-mod-btn suspend-btn">
              <Ban size={14} /> Suspend Artist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState(
    MOCK_RELEASES.map(r => ({
      ...r,
      artist: 'Urban Pulse',
      submittedAt: 'Mar 23, 2026',
    }))
  );
  const [collabs, setCollabs] = useState(MOCK_ADMIN_COLLABS.map(c => ({ ...c })));
  const [deals, setDeals]     = useState(MOCK_DEALS.map(d => ({ ...d })));
  const [activeTab, setActiveTab]       = useState('releases');
  const [submissionFilter, setSubmissionFilter] = useState('Pending');
  const [collabFilter, setCollabFilter] = useState('all');
  const [collabSearch, setCollabSearch] = useState('');
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [releaseSearch, setReleaseSearch] = useState('');
  const [dealFilter, setDealFilter]     = useState('all');
  const [dealSearch, setDealSearch]     = useState('');
  const [selectedDeal, setSelectedDeal] = useState(null);

  const stats = [
    { label: 'Pending Review',   value: '12',    icon: <FileText size={20} />,   color: 'var(--accent-amber)' },
    { label: 'Approved Today',   value: '45',    icon: <CheckCircle size={20} />, color: '#10b981' },
    { label: 'Active Collabs',   value: collabs.filter(c => c.status === 'accepted').length.toString(),
                                                  icon: <Handshake size={20} />,  color: '#818cf8' },
    { label: 'Active Artists',   value: '1,240', icon: <Users size={20} />,       color: 'var(--accent-gold)' },
  ];

  const handleReleaseStatus = (id, newStatus) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleCollabStatus = (id, newStatus) => {
    setCollabs(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (selectedCollab?.id === id) setSelectedCollab(prev => ({ ...prev, status: newStatus }));
  };

  const handleCollabFlag = id => {
    setCollabs(prev => prev.map(c => c.id === id ? { ...c, flagged: !c.flagged } : c));
    if (selectedCollab?.id === id) setSelectedCollab(prev => ({ ...prev, flagged: !prev.flagged }));
  };

  const handleDealStatus = (id, newStatus) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    if (selectedDeal?.id === id) setSelectedDeal(prev => ({ ...prev, status: newStatus }));
  };

  const handleDealFlag = id => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, flagged: !d.flagged } : d));
    if (selectedDeal?.id === id) setSelectedDeal(prev => ({ ...prev, flagged: !prev.flagged }));
  };

  const filteredDeals = deals.filter(d => {
    const matchStatus = dealFilter === 'all' ? true : d.status === dealFilter;
    const matchSearch = !dealSearch ||
      d.buyer.name.toLowerCase().includes(dealSearch.toLowerCase()) ||
      d.seller.name.toLowerCase().includes(dealSearch.toLowerCase()) ||
      d.projectName.toLowerCase().includes(dealSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  const disputedDeals  = deals.filter(d => d.status === 'disputed').length;
  const flaggedDeals   = deals.filter(d => d.flagged).length;

  const filteredCollabs = collabs.filter(c => {
    const matchStatus = collabFilter === 'all' ? true : c.status === collabFilter;
    const matchSearch = !collabSearch ||
      c.sender.name.toLowerCase().includes(collabSearch.toLowerCase()) ||
      c.recipient.name.toLowerCase().includes(collabSearch.toLowerCase()) ||
      c.projectName.toLowerCase().includes(collabSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  const disputedCount = collabs.filter(c => c.status === 'disputed').length;
  const flaggedCount  = collabs.filter(c => c.flagged).length;

  return (
    <div className="page-admin fade-in">

      {/* Header */}
      <header className="admin-header-premium mb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-2">
            <ShieldCheck size={14} /> CLM Internal Control
          </div>
          <h1 className="text-4xl font-heading">Admin Operations</h1>
          <p className="text-gray text-lg">Content reviews, distribution queues, and collaboration oversight.</p>
        </div>
        <div className="header-actions">
          <div className="search-pill-admin glass">
            <Search size={18} />
            <input
              type="text"
              placeholder={activeTab === 'releases' ? "Search UPC, Artist, Title…" : "Search collabs…"}
              value={activeTab === 'releases' ? releaseSearch : collabSearch}
              onChange={e => activeTab === 'releases'
                ? setReleaseSearch(e.target.value)
                : setCollabSearch(e.target.value)
              }
            />
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-grid-premium mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card-premium glass-card">
            <div className="stat-content">
              <div className="flex justify-between items-center mb-4">
                <h4 className="stat-label-premium">{stat.label}</h4>
                <div className="stat-icon-wrap" style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              <p className="stat-value-premium font-heading">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main tabs */}
      <div className="admin-main-tabs">
        <button
          className={`admin-main-tab ${activeTab === 'releases' ? 'active' : ''}`}
          onClick={() => setActiveTab('releases')}
        >
          <Disc size={16} /> Releases
        </button>
        <button
          className={`admin-main-tab ${activeTab === 'collabs' ? 'active' : ''}`}
          onClick={() => setActiveTab('collabs')}
        >
          <Handshake size={16} /> Collaborations
          {(disputedCount > 0 || flaggedCount > 0) && (
            <span className="main-tab-alert">{disputedCount + flaggedCount}</span>
          )}
        </button>
        <button
          className={`admin-main-tab ${activeTab === 'deals' ? 'active' : ''}`}
          onClick={() => setActiveTab('deals')}
        >
          <DollarSign size={16} /> Escrow Deals
          {(disputedDeals > 0 || flaggedDeals > 0) && (
            <span className="main-tab-alert">{disputedDeals + flaggedDeals}</span>
          )}
        </button>
      </div>

      {/* ── RELEASES TAB ──────────────────────────────────────── */}
      {activeTab === 'releases' && (
        <div className="admin-content glass shadow-premium">
          <nav className="admin-tabs">
            {['Pending', 'Approved', 'Rejected', 'All'].map(tab => (
              <button
                key={tab}
                className={`admin-tab-btn ${submissionFilter === tab ? 'active' : ''}`}
                onClick={() => setSubmissionFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="submission-table">
            <div className="table-head">
              <span>SUBMISSION</span>
              <span>ARTIST</span>
              <span>DATE</span>
              <span>STATUS</span>
              <span>ACTIONS</span>
            </div>
            <div className="table-body">
              {submissions
                .filter(s => submissionFilter === 'All' ? true : s.status === submissionFilter)
                .filter(s => !releaseSearch ||
                  s.title.toLowerCase().includes(releaseSearch.toLowerCase()) ||
                  s.artist.toLowerCase().includes(releaseSearch.toLowerCase()))
                .map(sub => (
                  <div key={sub.id} className="submission-row">
                    <div className="sub-info-cell">
                      <img src={sub.cover} alt="" className="sub-cover-mini" />
                      <div>
                        <p className="sub-title">{sub.title}</p>
                        <p className="sub-type">{sub.type} • {sub.tracks} tracks</p>
                      </div>
                    </div>
                    <div className="artist-cell font-bold text-white">{sub.artist}</div>
                    <div className="date-cell text-sm text-gray">{sub.submittedAt}</div>
                    <div className="status-cell">
                      <select
                        className={`status-select-admin ${sub.status.toLowerCase().replace(' ', '-')}`}
                        value={sub.status}
                        onChange={e => handleReleaseStatus(sub.id, e.target.value)}
                      >
                        {Object.values(STATUSES).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="actions-cell">
                      <div className="flex gap-2">
                        <button className="icon-btn-admin hover-gold" title="Approve"
                          onClick={() => handleReleaseStatus(sub.id, STATUSES.LIVE)}>
                          <CheckCircle size={18} />
                        </button>
                        <button className="icon-btn-admin hover-red" title="Reject"
                          onClick={() => handleReleaseStatus(sub.id, STATUSES.REJECTED)}>
                          <XCircle size={18} />
                        </button>
                        <button className="icon-btn-admin hover-white" title="View">
                          <Eye size={18} />
                        </button>
                        <button className="icon-btn-admin hover-white">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── COLLABORATIONS TAB ───────────────────────────────── */}
      {activeTab === 'collabs' && (
        <div className="admin-content glass shadow-premium">
          {/* Alerts */}
          {(disputedCount > 0 || flaggedCount > 0) && (
            <div className="collab-alerts-row">
              {disputedCount > 0 && (
                <div className="collab-alert disputed-alert">
                  <AlertTriangle size={14} />
                  <strong>{disputedCount}</strong> disputed collaboration{disputedCount > 1 ? 's' : ''} require review
                  <button onClick={() => setCollabFilter('disputed')}>View &rarr;</button>
                </div>
              )}
              {flaggedCount > 0 && (
                <div className="collab-alert flagged-alert">
                  <Flag size={14} />
                  <strong>{flaggedCount}</strong> flagged request{flaggedCount > 1 ? 's' : ''}
                  <button onClick={() => setCollabFilter('all')}>View all &rarr;</button>
                </div>
              )}
            </div>
          )}

          {/* Filter bar */}
          <div className="collab-filter-bar">
            <div className="collab-status-filters">
              {['all', ...COLLAB_STATUSES].map(s => {
                const label = s === 'all' ? 'All' : statusConfig[s]?.label || s;
                const count = s === 'all' ? collabs.length : collabs.filter(c => c.status === s).length;
                return (
                  <button
                    key={s}
                    className={`collab-filter-btn ${collabFilter === s ? 'active' : ''}`}
                    onClick={() => setCollabFilter(s)}
                  >
                    {label}
                    <span className="filter-count">{count}</span>
                  </button>
                );
              })}
            </div>
            <button className="collab-refresh-btn" title="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Table */}
          <div className="collab-table">
            <div className="collab-table-head">
              <span>SENDER → RECIPIENT</span>
              <span>PROJECT</span>
              <span>TYPE</span>
              <span>TERMS / BUDGET</span>
              <span>DATE</span>
              <span>STATUS</span>
              <span>ACTIONS</span>
            </div>
            <div className="collab-table-body">
              {filteredCollabs.length === 0 ? (
                <div className="collab-empty">No collaborations match this filter.</div>
              ) : (
                filteredCollabs.map(collab => (
                  <div
                    key={collab.id}
                    className={`collab-row ${collab.flagged ? 'collab-row-flagged' : ''}`}
                  >
                    {/* Parties */}
                    <div className="collab-parties-cell">
                      <div className="collab-party-mini">
                        <img src={collab.sender.avatar} alt="" className="collab-mini-avatar" />
                        <span className="collab-mini-name">
                          {collab.sender.name}
                          {collab.sender.verified && <CheckCircle size={10} style={{ color: 'var(--accent-gold)' }} />}
                        </span>
                      </div>
                      <span className="collab-arrow">→</span>
                      <div className="collab-party-mini">
                        <img src={collab.recipient.avatar} alt="" className="collab-mini-avatar" />
                        <span className="collab-mini-name">
                          {collab.recipient.name}
                          {collab.recipient.verified && <CheckCircle size={10} style={{ color: 'var(--accent-gold)' }} />}
                        </span>
                      </div>
                      {collab.flagged && <Flag size={12} style={{ color: '#fb923c', flexShrink: 0 }} />}
                    </div>

                    {/* Project */}
                    <div className="collab-project-cell">
                      <span className="collab-project-name">{collab.projectName}</span>
                    </div>

                    {/* Type */}
                    <div className="collab-type-cell">
                      <span className="collab-type-pill">{collab.collabType}</span>
                    </div>

                    {/* Terms */}
                    <div className="collab-terms-cell">
                      <span>{collab.terms}</span>
                      {collab.budget && (
                        <span className="collab-budget-tag">{collab.budget}</span>
                      )}
                    </div>

                    {/* Date */}
                    <div className="collab-date-cell">{collab.date}</div>

                    {/* Status */}
                    <div className="collab-status-cell">
                      <StatusBadge status={collab.status} />
                    </div>

                    {/* Actions */}
                    <div className="collab-actions-cell">
                      <button
                        className="icon-btn-admin hover-white"
                        title="View Full Details"
                        onClick={() => setSelectedCollab(collab)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={`icon-btn-admin ${collab.flagged ? 'flagged-active' : 'hover-orange'}`}
                        title={collab.flagged ? 'Unflag' : 'Flag for Review'}
                        onClick={() => handleCollabFlag(collab.id)}
                      >
                        <Flag size={16} />
                      </button>
                      {collab.status === 'disputed' && (
                        <button
                          className="icon-btn-admin hover-green"
                          title="Mark Resolved"
                          onClick={() => handleCollabStatus(collab.id, 'completed')}
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button className="icon-btn-admin hover-white" title="More">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="collab-table-footer">
            <span>{filteredCollabs.length} result{filteredCollabs.length !== 1 ? 's' : ''}</span>
            <span>Platform total: {collabs.length} collaborations</span>
          </div>
        </div>
      )}

      {/* ── DEALS TAB ─────────────────────────────────────────── */}
      {activeTab === 'deals' && (
        <div className="admin-content glass shadow-premium">
          {/* Alerts */}
          {(disputedDeals > 0 || flaggedDeals > 0) && (
            <div className="collab-alerts-row">
              {disputedDeals > 0 && (
                <div className="collab-alert disputed-alert">
                  <AlertOctagon size={14} />
                  <strong>{disputedDeals}</strong> disputed deal{disputedDeals > 1 ? 's' : ''} — funds held in escrow
                  <button onClick={() => setDealFilter('disputed')}>View &rarr;</button>
                </div>
              )}
              {flaggedDeals > 0 && (
                <div className="collab-alert flagged-alert">
                  <Flag size={14} />
                  <strong>{flaggedDeals}</strong> flagged deal{flaggedDeals > 1 ? 's' : ''}
                  <button onClick={() => setDealFilter('all')}>View all &rarr;</button>
                </div>
              )}
            </div>
          )}

          {/* Filter bar */}
          <div className="collab-filter-bar">
            <div className="collab-status-filters">
              {['all', 'pending_payment', 'in_escrow', 'work_in_progress', 'delivered', 'released', 'disputed'].map(s => {
                const label = s === 'all' ? 'All' : (DEAL_STATUS_CFG[s]?.label || s);
                const count = s === 'all' ? deals.length : deals.filter(d => d.status === s).length;
                return (
                  <button
                    key={s}
                    className={`collab-filter-btn ${dealFilter === s ? 'active' : ''}`}
                    onClick={() => setDealFilter(s)}
                  >
                    {label}
                    <span className="filter-count">{count}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="deal-search-pill">
                <Search size={13} />
                <input
                  placeholder="Search deals…"
                  value={dealSearch}
                  onChange={e => setDealSearch(e.target.value)}
                />
              </div>
              <button className="collab-refresh-btn" title="Refresh"><RefreshCw size={14} /></button>
            </div>
          </div>

          {/* Table */}
          <div className="collab-table">
            <div className="deal-table-head">
              <span>BUYER → SELLER</span>
              <span>PROJECT</span>
              <span>TYPE</span>
              <span>AMOUNT / ESCROW</span>
              <span>DEADLINE</span>
              <span>STATUS</span>
              <span>ACTIONS</span>
            </div>
            <div className="collab-table-body">
              {filteredDeals.length === 0 ? (
                <div className="collab-empty">No deals match this filter.</div>
              ) : (
                filteredDeals.map(deal => (
                  <div
                    key={deal.id}
                    className={`collab-row ${deal.flagged ? 'collab-row-flagged' : ''} ${deal.status === 'disputed' ? 'collab-row-disputed' : ''}`}
                  >
                    {/* Parties */}
                    <div className="collab-parties-cell">
                      <div className="collab-party-mini">
                        <img src={deal.buyer.avatar} alt="" className="collab-mini-avatar" />
                        <span className="collab-mini-name">
                          {deal.buyer.name}
                          {deal.buyer.verified && <CheckCircle size={10} style={{ color: 'var(--accent-gold)' }} />}
                        </span>
                      </div>
                      <span className="collab-arrow">→</span>
                      <div className="collab-party-mini">
                        <img src={deal.seller.avatar} alt="" className="collab-mini-avatar" />
                        <span className="collab-mini-name">
                          {deal.seller.name}
                          {deal.seller.verified && <CheckCircle size={10} style={{ color: 'var(--accent-gold)' }} />}
                        </span>
                      </div>
                      {deal.flagged && <Flag size={12} style={{ color: '#fb923c', flexShrink: 0 }} />}
                    </div>

                    {/* Project */}
                    <div className="collab-project-cell">
                      <span className="collab-project-name">{deal.projectName}</span>
                    </div>

                    {/* Type */}
                    <div className="collab-type-cell">
                      <span className="collab-type-pill">{deal.type}</span>
                    </div>

                    {/* Amount / Escrow */}
                    <div className="collab-terms-cell">
                      <span className="collab-budget-tag" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        {deal.currency} {deal.amount.toLocaleString()}
                      </span>
                      {deal.escrow.paid
                        ? <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 3 }}><Lock size={10} /> Secured</span>
                        : <span style={{ fontSize: '0.7rem', color: '#fbbf24' }}>Awaiting payment</span>
                      }
                    </div>

                    {/* Deadline */}
                    <div className="collab-date-cell">{deal.deadline}</div>

                    {/* Status */}
                    <div className="collab-status-cell">
                      <DealStatusBadge status={deal.status} />
                    </div>

                    {/* Actions */}
                    <div className="collab-actions-cell">
                      <button
                        className="icon-btn-admin hover-white"
                        title="View Details"
                        onClick={() => setSelectedDeal(deal)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={`icon-btn-admin ${deal.flagged ? 'flagged-active' : 'hover-orange'}`}
                        title={deal.flagged ? 'Unflag' : 'Flag for Review'}
                        onClick={() => handleDealFlag(deal.id)}
                      >
                        <Flag size={16} />
                      </button>
                      {deal.status === 'disputed' && (
                        <button
                          className="icon-btn-admin hover-green"
                          title="Release Funds"
                          onClick={() => handleDealStatus(deal.id, 'released')}
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button className="icon-btn-admin hover-white" title="More">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="collab-table-footer">
            <span>{filteredDeals.length} result{filteredDeals.length !== 1 ? 's' : ''}</span>
            <span>
              Total escrow: ZAR {deals.filter(d => d.escrow.paid).reduce((s, d) => s + d.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedCollab && (
        <DetailModal
          collab={selectedCollab}
          onClose={() => setSelectedCollab(null)}
          onStatusChange={(id, status) => { handleCollabStatus(id, status); setSelectedCollab(null); }}
          onFlag={handleCollabFlag}
        />
      )}

      {/* Deal detail modal */}
      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onStatusChange={(id, status) => { handleDealStatus(id, status); setSelectedDeal(null); }}
          onFlag={handleDealFlag}
        />
      )}

      {/* ── STYLES ──────────────────────────────────────────── */}
      <style>{`
        .admin-header-premium {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-light);
        }

        .search-pill-admin {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          width: 350px;
          border: 1px solid var(--border-light);
        }
        .search-pill-admin input {
          background: none; border: none; outline: none;
          color: #fff; width: 100%; font-size: 0.9rem;
        }
        .search-pill-admin input::placeholder { color: var(--text-muted); }

        .stats-grid-premium {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .stat-card-premium {
          padding: 2rem;
          border-radius: 24px;
          border: 1px solid var(--border-light);
        }
        .stat-label-premium { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }
        .stat-value-premium { font-size: 2rem; font-weight: 900; color: var(--text-white); margin-top: 0.5rem; }
        .stat-icon-wrap {
          background: rgba(255,255,255,0.03);
          padding: 0.5rem;
          border-radius: 10px;
        }

        /* Main tabs */
        .admin-main-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .admin-main-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.4rem;
          border-radius: 12px;
          border: 1px solid var(--border-light);
          background: rgba(255,255,255,0.03);
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 700;
          transition: all 0.2s;
          position: relative;
        }
        .admin-main-tab.active {
          background: rgba(255,215,0,0.07);
          border-color: rgba(255,215,0,0.25);
          color: var(--accent-gold);
        }
        .main-tab-alert {
          background: #fb923c;
          color: #000;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 0.1rem 0.4rem;
          border-radius: 999px;
          margin-left: 0.2rem;
        }

        /* Release sub-tabs */
        .admin-tabs {
          display: flex;
          gap: 3rem;
          padding: 0 2rem;
          border-bottom: 1px solid var(--border-light);
        }
        .admin-tab-btn {
          padding: 1.5rem 0;
          font-weight: 800;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          position: relative;
        }
        .admin-tab-btn.active { color: var(--accent-gold); }
        .admin-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 2px;
          background: var(--accent-gold);
          box-shadow: 0 0 10px var(--accent-glow);
        }

        /* Release table */
        .submission-table { padding: 1rem; }
        .table-head {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr 1fr;
          padding: 1.5rem 2rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .submission-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr 1fr;
          padding: 1.5rem 2rem;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background 0.15s;
        }
        .submission-row:hover { background: rgba(255,255,255,0.02); }
        .sub-info-cell {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .sub-cover-mini {
          width: 56px; height: 56px;
          border-radius: 8px; object-fit: cover;
        }
        .sub-title { font-weight: 700; font-size: 1rem; margin-bottom: 0.2rem; }
        .sub-type { font-size: 0.8rem; color: var(--text-muted); }
        .status-select-admin {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          outline: none;
          cursor: pointer;
        }
        .status-select-admin option { background: #1a1a1a; }

        /* Icon buttons */
        .icon-btn-admin {
          width: 34px; height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: var(--text-gray);
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .hover-gold:hover  { background: rgba(255,215,0,0.1);   color: var(--accent-gold); }
        .hover-red:hover   { background: rgba(239,68,68,0.1);   color: #ef4444; }
        .hover-green:hover { background: rgba(16,185,129,0.1);  color: #10b981; }
        .hover-orange:hover{ background: rgba(249,115,22,0.1);  color: #fb923c; }
        .hover-white:hover { background: rgba(255,255,255,0.07); color: var(--text-white); }
        .flagged-active    { background: rgba(249,115,22,0.12); color: #fb923c; }

        /* ── COLLAB TABLE ─────────────────────────────────── */
        .collab-alerts-row {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-light);
          flex-wrap: wrap;
        }
        .collab-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .collab-alert button {
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: underline;
          margin-left: 0.25rem;
          opacity: 0.8;
        }
        .disputed-alert {
          background: rgba(249,115,22,0.1);
          border: 1px solid rgba(249,115,22,0.3);
          color: #fb923c;
        }
        .flagged-alert {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }

        .collab-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-light);
          gap: 1rem;
          flex-wrap: wrap;
        }
        .collab-status-filters {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .collab-filter-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.9rem;
          border-radius: 8px;
          border: 1px solid var(--border-light);
          background: rgba(255,255,255,0.03);
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 700;
          transition: all 0.15s;
        }
        .collab-filter-btn.active {
          background: rgba(255,215,0,0.07);
          border-color: rgba(255,215,0,0.25);
          color: var(--accent-gold);
        }
        .filter-count {
          background: rgba(255,255,255,0.08);
          color: var(--text-muted);
          font-size: 0.65rem;
          padding: 0.1rem 0.35rem;
          border-radius: 999px;
        }
        .collab-filter-btn.active .filter-count {
          background: rgba(255,215,0,0.15);
          color: var(--accent-gold);
        }
        .collab-refresh-btn {
          color: var(--text-muted);
          padding: 0.4rem;
          border-radius: 8px;
          transition: all 0.15s;
        }
        .collab-refresh-btn:hover { color: var(--text-white); background: rgba(255,255,255,0.05); }

        .collab-table { overflow-x: auto; }
        .collab-table-head {
          display: grid;
          grid-template-columns: 2.5fr 1.5fr 1fr 1.2fr 1fr 1fr 1fr;
          padding: 1rem 1.5rem;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-light);
        }
        .collab-table-body { min-height: 100px; }
        .collab-row {
          display: grid;
          grid-template-columns: 2.5fr 1.5fr 1fr 1.2fr 1fr 1fr 1fr;
          padding: 1.1rem 1.5rem;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background 0.15s;
          gap: 0.5rem;
        }
        .collab-row:hover { background: rgba(255,255,255,0.02); }
        .collab-row-flagged {
          border-left: 3px solid #fb923c;
          background: rgba(249,115,22,0.03);
        }

        .collab-parties-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
          flex-wrap: wrap;
        }
        .collab-party-mini {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .collab-mini-avatar {
          width: 26px; height: 26px;
          border-radius: 50%; object-fit: cover;
          flex-shrink: 0;
        }
        .collab-mini-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-white);
          display: flex;
          align-items: center;
          gap: 0.2rem;
          white-space: nowrap;
        }
        .collab-arrow { color: var(--text-muted); font-size: 0.75rem; }

        .collab-project-cell { min-width: 0; }
        .collab-project-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-white);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }

        .collab-type-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-light);
          color: var(--text-gray);
          white-space: nowrap;
        }

        .collab-terms-cell {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          font-size: 0.8rem;
          color: var(--text-gray);
        }
        .collab-budget-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--accent-gold);
        }

        .collab-date-cell { font-size: 0.78rem; color: var(--text-muted); }

        .collab-status-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          white-space: nowrap;
        }

        .collab-actions-cell {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .collab-empty {
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .collab-table-footer {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-light);
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .deal-table-head {
          display: grid;
          grid-template-columns: 2.2fr 1.8fr 1fr 1.2fr 1fr 1fr 0.8fr;
          padding: 0.85rem 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .deal-search-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.9rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-light);
          border-radius: 50px;
          color: var(--text-muted);
        }
        .deal-search-pill input {
          background: none; border: none; outline: none;
          color: var(--text-white); font-size: 0.8rem; width: 150px;
        }
        .deal-search-pill input::placeholder { color: var(--text-muted); }

        .collab-row-disputed {
          border-left: 2px solid rgba(239,68,68,0.5);
          background: rgba(239,68,68,0.025);
        }

        /* ── DETAIL MODAL ─────────────────────────────────── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }
        .modal-card {
          width: 100%;
          max-width: 600px;
          border-radius: 24px;
          border: 1px solid var(--border-light);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .modal-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.35rem;
        }
        .modal-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--text-white);
        }
        .modal-close-btn {
          color: var(--text-muted);
          padding: 0.4rem;
          border-radius: 8px;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .modal-close-btn:hover { background: rgba(255,255,255,0.07); color: var(--text-white); }

        .modal-parties {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-light);
          border-radius: 14px;
        }
        .modal-party {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }
        .modal-avatar {
          width: 46px; height: 46px;
          border-radius: 50%; object-fit: cover;
          border: 2px solid var(--border-light);
        }
        .modal-party-role {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 0.2rem;
        }
        .modal-party-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-white);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .modal-arrow {
          font-size: 1.2rem;
          color: var(--text-muted);
        }

        .modal-detail-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-light);
          border-radius: 14px;
        }
        .modal-detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .modal-detail-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .modal-detail-val {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-white);
        }

        .modal-section { display: flex; flex-direction: column; gap: 0.5rem; }
        .modal-section-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: inline-flex;
          align-items: center;
        }
        .modal-notes-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: var(--text-white);
          font-size: 0.85rem;
          outline: none;
          resize: none;
          font-family: inherit;
          transition: border-color 0.2s;
          width: 100%;
        }
        .modal-notes-input:focus { border-color: rgba(255,215,0,0.3); }
        .modal-notes-input::placeholder { color: var(--text-muted); }

        .modal-actions { display: flex; flex-direction: column; gap: 1rem; }
        .modal-status-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .modal-status-btn {
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          transition: filter 0.15s;
        }
        .modal-status-btn:hover { filter: brightness(1.15); }

        .modal-mod-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          border-top: 1px solid var(--border-light);
          padding-top: 1rem;
        }
        .modal-mod-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          transition: all 0.15s;
        }
        .flag-btn {
          background: rgba(249,115,22,0.08);
          border: 1px solid rgba(249,115,22,0.25);
          color: #fb923c;
        }
        .flag-btn:hover, .flag-btn.flagged {
          background: rgba(249,115,22,0.15);
        }
        .chat-btn {
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.25);
          color: #818cf8;
        }
        .chat-btn:hover { background: rgba(99,102,241,0.14); }
        .suspend-btn {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }
        .suspend-btn:hover { background: rgba(239,68,68,0.14); }

        @media (max-width: 1024px) {
          .page-admin { padding: 1.5rem; }
          .admin-header-premium { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .header-actions { width: 100%; }
          .search-pill-admin { width: 100%; max-width: none; }
          .admin-main-tabs { overflow-x: auto; padding-bottom: 0.5rem; }
          .admin-main-tab { white-space: nowrap; }
          .submission-table, .collab-table { overflow-x: auto; }
          .table-head, .submission-row, .collab-table-head, .deal-table-head, .collab-row { min-width: 900px; }
        }

        @media (max-width: 640px) {
          .page-admin { padding: 1rem; }
          .admin-header-premium h1 { font-size: 2rem; }
          .stats-grid-premium { grid-template-columns: 1fr; }
          .modal-overlay { padding: 1rem; }
          .modal-card { padding: 1.5rem; border-radius: 16px; }
          .modal-parties { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .modal-arrow { transform: rotate(90deg); align-self: center; }
          .modal-detail-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
