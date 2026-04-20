import { useState } from 'react';
import {
  DollarSign, Clock, RefreshCw, Shield, CheckCircle,
  AlertTriangle, Upload, ChevronDown, ChevronUp,
  Lock, Unlock, Package, Zap, X, Check
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const PLATFORM_FEE_RATE = 0.10; // 10%

const STAGES = [
  { key: 'proposal',         short: 'Proposal',  icon: '📋' },
  { key: 'pending_payment',  short: 'Payment',   icon: '💳' },
  { key: 'in_escrow',        short: 'Escrow',    icon: '🔒' },
  { key: 'work_in_progress', short: 'Working',   icon: '🎵' },
  { key: 'delivered',        short: 'Delivered', icon: '📦' },
  { key: 'approved',         short: 'Approved',  icon: '✅' },
  { key: 'released',         short: 'Paid Out',  icon: '💰' },
];

/* maps a status string to its stage index (0-6) */
const stageIndex = status => {
  const map = {
    proposal: 0,
    pending_payment: 1,
    in_escrow: 2,
    work_in_progress: 3,
    delivered: 4,
    revision_requested: 4,
    approved: 5,
    released: 6,
    disputed: null,
    cancelled: null,
  };
  return map[status] ?? 0;
};

const STATUS_CFG = {
  proposal:           { label: 'Proposal',           color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
  pending_payment:    { label: 'Awaiting Payment',   color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.25)' },
  in_escrow:          { label: 'Funds in Escrow',    color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)' },
  work_in_progress:   { label: 'Work in Progress',   color: '#818cf8', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)' },
  delivered:          { label: 'Awaiting Approval',  color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.25)' },
  revision_requested: { label: 'Revision Requested', color: '#fb923c', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.25)' },
  approved:           { label: 'Approved',           color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)' },
  released:           { label: 'Payment Released',   color: '#ffd700', bg: 'rgba(255,215,0,0.08)',   border: 'rgba(255,215,0,0.25)' },
  disputed:           { label: 'Disputed',           color: '#f87171', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)' },
  cancelled:          { label: 'Cancelled',          color: '#64748b', bg: 'rgba(100,116,139,0.06)', border: 'rgba(100,116,139,0.15)' },
};

const fmt = (amount, currency) => {
  const symbols = { ZAR: 'R', USD: '$', EUR: '€', GBP: '£', NGN: '₦' };
  const sym = symbols[currency] || currency + ' ';
  return `${sym}${Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
};

/* ─────────────────────────────────────────────────────────────
   PROGRESS STEPPER
───────────────────────────────────────────────────────────── */
const ProgressStepper = ({ status }) => {
  const current = stageIndex(status);
  const isDisputed  = status === 'disputed';
  const isCancelled = status === 'cancelled';

  return (
    <div className="dc-stepper">
      {STAGES.map((stage, i) => {
        const done    = !isDisputed && !isCancelled && i < current;
        const active  = !isDisputed && !isCancelled && i === current;
        const pending = isDisputed || isCancelled || i > current;

        return (
          <div key={stage.key} className="dc-step-wrap">
            <div className={`dc-step-node ${done ? 'done' : active ? 'active' : ''} ${isDisputed && i <= current ? 'disputed' : ''}`}>
              {done ? <Check size={10} /> : (
                <span className="dc-step-num">{i + 1}</span>
              )}
            </div>
            <span className={`dc-step-label ${active ? 'label-active' : ''} ${done ? 'label-done' : ''}`}>
              {stage.short}
            </span>
            {i < STAGES.length - 1 && (
              <div className={`dc-step-line ${done ? 'line-done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ESCROW BREAKDOWN
───────────────────────────────────────────────────────────── */
const EscrowBreakdown = ({ amount, currency, escrow, status }) => {
  const fee    = escrow?.fee    ?? Math.round(amount * PLATFORM_FEE_RATE);
  const payout = escrow?.payout ?? (amount - fee);
  const isPaid = escrow?.paid;

  return (
    <div className="dc-escrow-block">
      <div className="dc-escrow-header">
        {isPaid ? <Lock size={13} /> : <Unlock size={13} />}
        <span>{isPaid ? 'Escrow Secured' : 'Escrow Estimate'}</span>
        {isPaid && escrow?.paidAt && (
          <span className="dc-escrow-date">paid {escrow.paidAt}</span>
        )}
      </div>
      <div className="dc-escrow-rows">
        <div className="dc-escrow-row">
          <span>Deal Amount</span>
          <span className="dc-escrow-val">{fmt(amount, currency)}</span>
        </div>
        <div className="dc-escrow-row">
          <span>Platform Fee (10%)</span>
          <span className="dc-escrow-val dc-fee">−{fmt(fee, currency)}</span>
        </div>
        <div className="dc-escrow-divider" />
        <div className="dc-escrow-row dc-escrow-payout">
          <span>Artist Payout</span>
          <span className="dc-escrow-val dc-payout-val">{fmt(payout, currency)}</span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN DEAL CARD
───────────────────────────────────────────────────────────── */
const DealCard = ({ dealData, sender, onAction }) => {
  const [expanded, setExpanded] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);

  const isMe     = sender === 'me';
  const myRole   = dealData.myRole || (isMe ? 'buyer' : 'seller');
  const isBuyer  = myRole === 'buyer';
  const isSeller = myRole === 'seller';

  const { status, amount, currency, escrow, projectName, type, deadline, deliverables, revisions } = dealData;
  const cfg = STATUS_CFG[status] || STATUS_CFG.proposal;

  const isTerminal = ['released', 'cancelled'].includes(status);
  const isDisputed = status === 'disputed';

  const handleAction = action => onAction?.(action, dealData);

  const submitRevision = () => {
    if (!revisionNote.trim()) return;
    handleAction('revision');
    setShowRevisionInput(false);
    setRevisionNote('');
  };

  return (
    <div
      className={`dc-card ${isMe ? 'dc-card-me' : 'dc-card-them'} ${isDisputed ? 'dc-card-disputed' : ''}`}
      style={{ '--status-color': cfg.color, '--status-bg': cfg.bg, '--status-border': cfg.border }}
    >

      {/* ── Header ─────────────────────────────────────── */}
      <div className="dc-header">
        <div className="dc-header-left">
          <Shield size={14} style={{ color: 'var(--accent-gold)' }} />
          <span className="dc-label">Escrow Deal</span>
          <span className="dc-type-badge">{type}</span>
        </div>
        <span className="dc-status-pill" style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
          {isDisputed && <AlertTriangle size={10} style={{ marginRight: 3 }} />}
          {cfg.label}
        </span>
      </div>

      {/* ── Project name ───────────────────────────────── */}
      <p className="dc-project">{projectName}</p>

      {/* ── Key metrics ────────────────────────────────── */}
      <div className="dc-metrics">
        <div className="dc-metric">
          <DollarSign size={13} className="dc-metric-icon" />
          <div>
            <span className="dc-metric-label">Amount</span>
            <span className="dc-metric-val dc-amount">{fmt(amount, currency)}</span>
          </div>
        </div>
        <div className="dc-metric">
          <Clock size={13} className="dc-metric-icon" />
          <div>
            <span className="dc-metric-label">Deadline</span>
            <span className="dc-metric-val">{deadline}</span>
          </div>
        </div>
        <div className="dc-metric">
          <RefreshCw size={13} className="dc-metric-icon" />
          <div>
            <span className="dc-metric-label">Revisions</span>
            <span className="dc-metric-val">{revisions} included</span>
          </div>
        </div>
      </div>

      {/* ── Deliverables (collapsible) ─────────────────── */}
      <div className="dc-deliverables-wrap">
        <button className="dc-deliver-toggle" onClick={() => setExpanded(v => !v)}>
          <Package size={12} /> Deliverables ({deliverables?.length || 0})
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        {expanded && (
          <ul className="dc-deliver-list">
            {deliverables?.map((d, i) => (
              <li key={i} className="dc-deliver-item">
                <span className="dc-deliver-dot" />
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Progress stepper ───────────────────────────── */}
      <ProgressStepper status={status} />

      {/* ── Disputed banner ────────────────────────────── */}
      {isDisputed && (
        <div className="dc-dispute-banner">
          <AlertTriangle size={14} />
          <span>This deal is under dispute. Our admin team has been notified and will review within 48 hours.</span>
        </div>
      )}

      {/* ── Escrow breakdown ───────────────────────────── */}
      {!isTerminal && !isDisputed && (
        <EscrowBreakdown amount={amount} currency={currency} escrow={escrow} status={status} />
      )}
      {status === 'released' && (
        <div className="dc-released-banner">
          <Zap size={14} />
          <span>{fmt(escrow?.payout ?? (amount - amount * PLATFORM_FEE_RATE), currency)} has been sent to the artist's wallet.</span>
        </div>
      )}

      {/* ── Revision input ─────────────────────────────── */}
      {showRevisionInput && (
        <div className="dc-revision-panel">
          <textarea
            className="dc-revision-input"
            placeholder="Describe what needs to be revised…"
            value={revisionNote}
            onChange={e => setRevisionNote(e.target.value)}
            rows={2}
          />
          <div className="dc-revision-actions">
            <button className="dc-action-btn dc-btn-amber" onClick={submitRevision}>Send Revision Request</button>
            <button className="dc-action-btn dc-btn-ghost" onClick={() => setShowRevisionInput(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Action buttons ─────────────────────────────── */}
      {!isTerminal && !showRevisionInput && (
        <div className="dc-actions">

          {/* Buyer: accept a received proposal */}
          {isBuyer && status === 'proposal' && !isMe && (
            <>
              <button className="dc-action-btn dc-btn-green" onClick={() => handleAction('accept_proposal')}>
                <Check size={13} /> Accept Deal
              </button>
              <button className="dc-action-btn dc-btn-ghost" onClick={() => handleAction('decline_proposal')}>
                <X size={13} /> Decline
              </button>
            </>
          )}

          {/* Buyer: pay into escrow */}
          {isBuyer && status === 'pending_payment' && (
            <button className="dc-action-btn dc-btn-gold dc-btn-pay" onClick={() => handleAction('pay')}>
              <Lock size={14} />
              Pay Now — {fmt(amount, currency)}
            </button>
          )}

          {/* Buyer: delivered — approve or request revision or dispute */}
          {isBuyer && status === 'delivered' && (
            <>
              <button className="dc-action-btn dc-btn-green" onClick={() => handleAction('approve')}>
                <CheckCircle size={13} /> Approve & Release Payment
              </button>
              <button className="dc-action-btn dc-btn-amber" onClick={() => setShowRevisionInput(true)}>
                <RefreshCw size={13} /> Request Revision
              </button>
              <button className="dc-action-btn dc-btn-red" onClick={() => handleAction('dispute')}>
                <AlertTriangle size={13} /> Dispute
              </button>
            </>
          )}

          {/* Buyer: revision_requested by buyer already */}
          {isBuyer && status === 'revision_requested' && (
            <div className="dc-waiting-msg">
              <RefreshCw size={13} /> Revision requested — waiting for seller to resubmit.
            </div>
          )}

          {/* Buyer: approved state */}
          {isBuyer && status === 'approved' && (
            <div className="dc-waiting-msg">
              <CheckCircle size={13} /> Approved! Payment is being released to the artist.
            </div>
          )}

          {/* Seller: escrow ready, mark work started */}
          {isSeller && status === 'in_escrow' && (
            <button className="dc-action-btn dc-btn-indigo" onClick={() => handleAction('start')}>
              <Zap size={13} /> Mark Work Started
            </button>
          )}

          {/* Seller: upload delivery */}
          {isSeller && status === 'work_in_progress' && (
            <button className="dc-action-btn dc-btn-indigo" onClick={() => handleAction('deliver')}>
              <Upload size={13} /> Upload & Submit Delivery
            </button>
          )}

          {/* Seller: revision requested */}
          {isSeller && status === 'revision_requested' && (
            <button className="dc-action-btn dc-btn-amber" onClick={() => handleAction('deliver')}>
              <Upload size={13} /> Submit Revision
            </button>
          )}

          {/* Either: dispute button for in-progress stages */}
          {['in_escrow', 'work_in_progress'].includes(status) && isBuyer && (
            <button className="dc-action-btn dc-btn-red dc-btn-sm" onClick={() => handleAction('dispute')}>
              <AlertTriangle size={13} /> Dispute
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const DealCardStyles = () => (
  <style>{`
    .dc-card {
      width: 400px;
      max-width: 90vw;
      border-radius: 18px;
      padding: 1.2rem 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      font-size: 0.88rem;
    }
    .dc-card-me {
      background: rgba(255,215,0,0.05);
      border: 1px solid rgba(255,215,0,0.18);
    }
    .dc-card-them {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .dc-card-disputed {
      border-color: rgba(239,68,68,0.3) !important;
      background: rgba(239,68,68,0.03) !important;
    }

    /* Header */
    .dc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .dc-header-left {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .dc-label {
      font-size: 0.68rem;
      font-weight: 800;
      color: var(--accent-gold);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }
    .dc-type-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 5px;
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--border-light);
      color: var(--text-muted);
    }
    .dc-status-pill {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }

    /* Project title */
    .dc-project {
      font-size: 1rem;
      font-weight: 800;
      color: var(--text-white);
      margin: 0;
      line-height: 1.2;
    }

    /* Metrics row */
    .dc-metrics {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .dc-metric {
      display: flex;
      align-items: flex-start;
      gap: 0.4rem;
    }
    .dc-metric-icon { color: var(--text-muted); margin-top: 2px; flex-shrink: 0; }
    .dc-metric-label {
      font-size: 0.62rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: block;
      margin-bottom: 1px;
    }
    .dc-metric-val {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-white);
      display: block;
    }
    .dc-amount { color: var(--accent-gold); font-size: 1rem; }

    /* Deliverables */
    .dc-deliverables-wrap { display: flex; flex-direction: column; gap: 0.4rem; }
    .dc-deliver-toggle {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-muted);
      transition: color 0.15s;
    }
    .dc-deliver-toggle:hover { color: var(--text-white); }
    .dc-deliver-list {
      list-style: none;
      padding: 0.5rem 0.75rem;
      margin: 0;
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border-light);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .dc-deliver-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-gray);
    }
    .dc-deliver-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--accent-gold);
      flex-shrink: 0;
    }

    /* Stepper */
    .dc-stepper {
      display: flex;
      align-items: flex-start;
      gap: 0;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .dc-step-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      flex: 1;
      min-width: 0;
    }
    .dc-step-node {
      width: 22px; height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--border-light);
      background: rgba(255,255,255,0.03);
      color: var(--text-muted);
      font-size: 0.6rem;
      font-weight: 700;
      position: relative;
      z-index: 1;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .dc-step-node.done {
      background: rgba(16,185,129,0.15);
      border-color: #10b981;
      color: #10b981;
    }
    .dc-step-node.active {
      background: rgba(255,215,0,0.15);
      border-color: var(--accent-gold);
      color: var(--accent-gold);
      box-shadow: 0 0 8px rgba(255,215,0,0.25);
    }
    .dc-step-node.disputed {
      background: rgba(239,68,68,0.12);
      border-color: #ef4444;
      color: #ef4444;
    }
    .dc-step-num { font-size: 0.55rem; }
    .dc-step-label {
      font-size: 0.58rem;
      color: var(--text-muted);
      text-align: center;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      padding: 0 2px;
    }
    .dc-step-label.label-active { color: var(--accent-gold); font-weight: 700; }
    .dc-step-label.label-done   { color: #10b981; }
    .dc-step-line {
      position: absolute;
      top: 11px;
      left: 50%;
      width: 100%;
      height: 2px;
      background: var(--border-light);
      z-index: 0;
    }
    .dc-step-line.line-done { background: #10b981; }

    /* Escrow block */
    .dc-escrow-block {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border-light);
      border-radius: 12px;
      overflow: hidden;
    }
    .dc-escrow-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 0.9rem;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid var(--border-light);
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-gray);
    }
    .dc-escrow-date {
      margin-left: auto;
      font-size: 0.65rem;
      color: var(--text-muted);
      font-weight: 400;
    }
    .dc-escrow-rows {
      padding: 0.75rem 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .dc-escrow-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: var(--text-gray);
    }
    .dc-escrow-val { font-weight: 700; color: var(--text-white); }
    .dc-fee { color: #f87171; }
    .dc-escrow-divider {
      height: 1px;
      background: var(--border-light);
      margin: 0.25rem 0;
    }
    .dc-escrow-payout { font-weight: 700; }
    .dc-payout-val { color: var(--accent-gold) !important; font-size: 0.9rem; }

    /* Dispute / released banners */
    .dc-dispute-banner {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: rgba(239,68,68,0.08);
      border: 1px solid rgba(239,68,68,0.25);
      border-radius: 10px;
      font-size: 0.78rem;
      color: #f87171;
      line-height: 1.4;
    }
    .dc-released-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1rem;
      background: rgba(255,215,0,0.07);
      border: 1px solid rgba(255,215,0,0.2);
      border-radius: 10px;
      font-size: 0.78rem;
      color: var(--accent-gold);
      font-weight: 600;
    }

    /* Revision input */
    .dc-revision-panel {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .dc-revision-input {
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border-light);
      border-radius: 10px;
      padding: 0.6rem 0.75rem;
      color: var(--text-white);
      font-size: 0.82rem;
      outline: none;
      resize: none;
      font-family: inherit;
      transition: border-color 0.2s;
      width: 100%;
    }
    .dc-revision-input:focus { border-color: rgba(249,115,22,0.4); }
    .dc-revision-input::placeholder { color: var(--text-muted); }
    .dc-revision-actions { display: flex; gap: 0.5rem; }

    /* Waiting message */
    .dc-waiting-msg {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      color: var(--text-muted);
      padding: 0.6rem 0;
    }

    /* Action buttons */
    .dc-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .dc-action-btn {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      border-radius: 9px;
      font-size: 0.8rem;
      font-weight: 700;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .dc-btn-pay {
      width: 100%;
      justify-content: center;
      padding: 0.75rem;
      font-size: 0.9rem;
      border-radius: 12px;
    }
    .dc-btn-sm { padding: 0.4rem 0.75rem; font-size: 0.75rem; }

    .dc-btn-gold    { background: var(--accent-gold); color: #000; border: none; }
    .dc-btn-gold:hover { filter: brightness(1.08); }
    .dc-btn-green   { background: rgba(16,185,129,0.1);  border: 1px solid rgba(16,185,129,0.3);  color: #10b981; }
    .dc-btn-green:hover  { background: rgba(16,185,129,0.18); }
    .dc-btn-amber   { background: rgba(251,191,36,0.1);  border: 1px solid rgba(251,191,36,0.3);  color: #fbbf24; }
    .dc-btn-amber:hover  { background: rgba(251,191,36,0.18); }
    .dc-btn-red     { background: rgba(239,68,68,0.08);  border: 1px solid rgba(239,68,68,0.25);  color: #f87171; }
    .dc-btn-red:hover    { background: rgba(239,68,68,0.15); }
    .dc-btn-indigo  { background: rgba(99,102,241,0.1);  border: 1px solid rgba(99,102,241,0.3);  color: #818cf8; }
    .dc-btn-indigo:hover { background: rgba(99,102,241,0.18); }
    .dc-btn-ghost   { background: rgba(255,255,255,0.05); border: 1px solid var(--border-light);  color: var(--text-muted); }
    .dc-btn-ghost:hover  { background: rgba(255,255,255,0.09); color: var(--text-white); }
  `}</style>
);

/* Export both so the page can render the styles once */
DealCard.Styles = DealCardStyles;

export default DealCard;
