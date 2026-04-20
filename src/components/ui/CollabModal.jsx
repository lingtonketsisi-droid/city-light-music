import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Send, ChevronDown, ChevronRight, ChevronLeft,
  Music, Mic2, PenTool, Headphones, DollarSign,
  Clock, Check, MessageSquare, ArrowRight
} from 'lucide-react';

/* ─── Config ────────────────────────────────────────────────── */
const COLLAB_TYPES = [
  {
    value: 'feature',
    label: 'Feature / Guest Verse',
    icon: Mic2,
    desc: 'One artist appears on the other\'s track — as a featured vocalist, rapper, or instrumentalist.',
    color: '#A78BFA'
  },
  {
    value: 'collab',
    label: 'Full Collaboration',
    icon: Music,
    desc: 'Co-created from scratch. Both artists share equal creative input, credits, and ownership.',
    color: '#FFD700'
  },
  {
    value: 'production',
    label: 'Production / Beat',
    icon: Headphones,
    desc: 'One artist produces or provides a beat. The other handles vocals, lyrics, or arrangement.',
    color: '#38BDF8'
  },
  {
    value: 'writing',
    label: 'Co-Writing / Credits',
    icon: PenTool,
    desc: 'Working together on lyrics, melody, or concept. Writing credits and royalties shared.',
    color: '#F472B6'
  },
];

const TIMELINE_OPTIONS = [
  { value: 'asap',    label: 'ASAP',       sub: 'Within days' },
  { value: '1-2wk',  label: '1–2 Weeks',  sub: 'Quick turnaround' },
  { value: '2-4wk',  label: '2–4 Weeks',  sub: 'Standard' },
  { value: '1mo+',   label: '1 Month+',   sub: 'Long-form project' },
];

const CONTRIBUTION_OPTIONS = [
  'Vocals', 'Lyrics / Songwriting', 'Beat / Production',
  'Mixing', 'Mastering', 'Music Video', 'Artwork'
];

const TERMS_OPTIONS = [
  'Revenue Share (50/50)',
  'Revenue Share (60/40)',
  'Revenue Share (70/30)',
  'Flat Fee',
  'Barter / No Payment',
  'To Be Discussed',
];

const CURRENCIES = ['ZAR (R)', 'USD ($)', 'EUR (€)', 'GBP (£)', 'NGN (₦)'];

/* ─── Step indicator ────────────────────────────────────────── */
const StepBar = ({ step }) => {
  const steps = ['Type', 'Project', 'Terms'];
  return (
    <div className="cm-step-bar">
      {steps.map((s, i) => (
        <div key={s} className="cm-step-entry">
          <div className={`cm-step-node ${i < step ? 'done' : i === step ? 'active' : ''}`}>
            {i < step ? <Check size={13} /> : i + 1}
          </div>
          <span className={`cm-step-label ${i === step ? 'active' : ''}`}>{s}</span>
          {i < steps.length - 1 && (
            <div className={`cm-step-line ${i < step ? 'done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
};

/* ─── Main component ────────────────────────────────────────── */
const CollabModal = ({ artist, onClose, onSend }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0, 1, 2 = form steps; 3 = sent
  const [form, setForm] = useState({
    collabType:     '',
    projectName:    '',
    pitch:          '',
    timeline:       '',
    contributions:  [],
    terms:          '',
    currency:       'ZAR (R)',
    budget:         '',
    includeBudget:  false,
    finalNote:      '',
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const toggleContrib = val =>
    set('contributions', form.contributions.includes(val)
      ? form.contributions.filter(c => c !== val)
      : [...form.contributions, val]
    );

  const canNext0 = !!form.collabType;
  const canNext1 = form.projectName.trim().length > 0 && form.pitch.trim().length > 0 && !!form.timeline;
  const canSend  = canNext1 && !!form.terms;

  const handleSend = () => {
    if (!canSend) return;
    setStep(3);
    setTimeout(() => onSend?.({ ...form }), 400);
  };

  const selectedType = COLLAB_TYPES.find(t => t.value === form.collabType);

  return (
    <div className="cm-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cm-shell glass">

        {/* ── Header ─────────────────────────────────── */}
        <div className="cm-header">
          <div className="cm-header-artist">
            <img src={artist.avatar} alt={artist.name} className="cm-header-avatar" />
            <div>
              <div className="cm-header-to">Collaboration Request</div>
              <div className="cm-header-name">to {artist.name}</div>
            </div>
          </div>
          <button className="cm-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* ── Step bar ────────────────────────────────── */}
        {step < 3 && <StepBar step={step} />}

        {/* ─────────────────────────────────────────────
            STEP 0 — Choose type
        ───────────────────────────────────────────── */}
        {step === 0 && (
          <div className="cm-body">
            <div className="cm-step-intro">
              <div className="cm-step-title">What type of collaboration?</div>
              <div className="cm-step-sub">Choose the format that best describes your project.</div>
            </div>
            <div className="cm-type-grid">
              {COLLAB_TYPES.map(t => {
                const Icon = t.icon;
                const active = form.collabType === t.value;
                return (
                  <button
                    key={t.value}
                    className={`cm-type-card ${active ? 'active' : ''}`}
                    style={{ '--type-color': t.color }}
                    onClick={() => set('collabType', t.value)}
                  >
                    <div className="cm-type-icon-wrap">
                      <Icon size={22} />
                    </div>
                    <div className="cm-type-label">{t.label}</div>
                    <div className="cm-type-desc">{t.desc}</div>
                    {active && <div className="cm-type-check"><Check size={14} /></div>}
                  </button>
                );
              })}
            </div>
            <div className="cm-footer">
              <button className="cm-cancel" onClick={onClose}>Cancel</button>
              <button
                className={`cm-next-btn btn-primary ${!canNext0 ? 'cm-disabled' : ''}`}
                disabled={!canNext0}
                onClick={() => setStep(1)}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────
            STEP 1 — Project details
        ───────────────────────────────────────────── */}
        {step === 1 && (
          <div className="cm-body">
            <div className="cm-step-intro">
              <div className="cm-step-title">Tell them about your project</div>
              <div className="cm-step-sub">
                A strong pitch shows you've thought it through. Be specific.
              </div>
            </div>

            {/* Project name */}
            <div className="cm-field">
              <label className="cm-label">Project Name <span className="cm-req">*</span></label>
              <input
                className="cm-input"
                placeholder="e.g. 'City Lights EP', 'Summer Drop 2026'"
                value={form.projectName}
                onChange={e => set('projectName', e.target.value)}
                maxLength={60}
              />
            </div>

            {/* Pitch */}
            <div className="cm-field">
              <label className="cm-label">Your Pitch <span className="cm-req">*</span></label>
              <textarea
                className="cm-textarea"
                placeholder={`Describe the vision, vibe, and why you want to work with ${artist.name} specifically. What makes this project worth their time?`}
                value={form.pitch}
                onChange={e => set('pitch', e.target.value)}
                maxLength={500}
                rows={4}
              />
              <div className="cm-char">{form.pitch.length}/500</div>
            </div>

            {/* Timeline */}
            <div className="cm-field">
              <label className="cm-label">Project Timeline <span className="cm-req">*</span></label>
              <div className="cm-timeline-grid">
                {TIMELINE_OPTIONS.map(t => (
                  <button
                    key={t.value}
                    className={`cm-timeline-btn ${form.timeline === t.value ? 'active' : ''}`}
                    onClick={() => set('timeline', t.value)}
                  >
                    <Clock size={13} />
                    <span className="cm-tl-label">{t.label}</span>
                    <span className="cm-tl-sub">{t.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contributions */}
            <div className="cm-field">
              <label className="cm-label">
                What will you contribute? <span className="cm-opt">(optional)</span>
              </label>
              <div className="cm-contrib-wrap">
                {CONTRIBUTION_OPTIONS.map(c => (
                  <button
                    key={c}
                    className={`cm-contrib-chip ${form.contributions.includes(c) ? 'active' : ''}`}
                    onClick={() => toggleContrib(c)}
                  >
                    {form.contributions.includes(c) && <Check size={11} />} {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="cm-footer">
              <button className="cm-back" onClick={() => setStep(0)}>
                <ChevronLeft size={15} /> Back
              </button>
              <button
                className={`cm-next-btn btn-primary ${!canNext1 ? 'cm-disabled' : ''}`}
                disabled={!canNext1}
                onClick={() => setStep(2)}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────
            STEP 2 — Terms, offer, review
        ───────────────────────────────────────────── */}
        {step === 2 && (
          <div className="cm-body">
            <div className="cm-step-intro">
              <div className="cm-step-title">Terms & Offer</div>
              <div className="cm-step-sub">Be transparent. Good terms lead to better collabs.</div>
            </div>

            {/* Terms */}
            <div className="cm-field">
              <label className="cm-label">Proposed Terms <span className="cm-req">*</span></label>
              <div className="cm-select-wrap">
                <select
                  className="cm-select"
                  value={form.terms}
                  onChange={e => set('terms', e.target.value)}
                >
                  <option value="">Select terms...</option>
                  {TERMS_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={15} className="cm-select-icon" />
              </div>
            </div>

            {/* Budget toggle */}
            <div className="cm-field">
              <div className="cm-toggle-row">
                <label className="cm-label" style={{ marginBottom: 0 }}>
                  Include specific offer / budget <span className="cm-opt">(optional)</span>
                </label>
                <button
                  className={`cm-toggle ${form.includeBudget ? 'on' : ''}`}
                  onClick={() => set('includeBudget', !form.includeBudget)}
                >
                  <span className="cm-toggle-thumb" />
                </button>
              </div>
              {form.includeBudget && (
                <div className="cm-budget-row">
                  <div className="cm-select-wrap" style={{ width: 140, flexShrink: 0 }}>
                    <select
                      className="cm-select"
                      value={form.currency}
                      onChange={e => set('currency', e.target.value)}
                    >
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={15} className="cm-select-icon" />
                  </div>
                  <div className="cm-budget-input-wrap">
                    <DollarSign size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                      className="cm-budget-input"
                      placeholder="Amount (e.g. 5000)"
                      value={form.budget}
                      onChange={e => set('budget', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Final note */}
            <div className="cm-field">
              <label className="cm-label">
                Final Note <span className="cm-opt">(optional)</span>
              </label>
              <textarea
                className="cm-textarea"
                placeholder="Anything else you'd like to add before sending..."
                value={form.finalNote}
                onChange={e => set('finalNote', e.target.value)}
                maxLength={200}
                rows={2}
              />
            </div>

            {/* Review summary */}
            <div className="cm-review-card">
              <div className="cm-review-label">Request Summary</div>
              <div className="cm-review-row">
                <span className="cm-rv-key">Type</span>
                <span className="cm-rv-val">{selectedType?.label || '—'}</span>
              </div>
              <div className="cm-review-row">
                <span className="cm-rv-key">Project</span>
                <span className="cm-rv-val">{form.projectName || '—'}</span>
              </div>
              <div className="cm-review-row">
                <span className="cm-rv-key">Timeline</span>
                <span className="cm-rv-val">
                  {TIMELINE_OPTIONS.find(t => t.value === form.timeline)?.label || '—'}
                </span>
              </div>
              <div className="cm-review-row">
                <span className="cm-rv-key">Terms</span>
                <span className="cm-rv-val">{form.terms || '—'}</span>
              </div>
              {form.includeBudget && form.budget && (
                <div className="cm-review-row">
                  <span className="cm-rv-key">Offer</span>
                  <span className="cm-rv-val">{form.currency.split(' ')[1] || ''}{form.budget}</span>
                </div>
              )}
              {form.contributions.length > 0 && (
                <div className="cm-review-row">
                  <span className="cm-rv-key">Contributing</span>
                  <span className="cm-rv-val">{form.contributions.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="cm-footer">
              <button className="cm-back" onClick={() => setStep(1)}>
                <ChevronLeft size={15} /> Back
              </button>
              <button
                className={`cm-send-btn btn-primary ${!canSend ? 'cm-disabled' : ''}`}
                disabled={!canSend}
                onClick={handleSend}
              >
                <Send size={16} /> Send Request to {artist.name}
              </button>
            </div>

            <div className="cm-legal">
              Requests are private and visible only to you and {artist.name}.
              City Light Media does not mediate payments or enforce agreements.
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────
            STEP 3 — Sent confirmation
        ───────────────────────────────────────────── */}
        {step === 3 && (
          <div className="cm-sent-state">
            <div className="cm-sent-glow" />
            <div className="cm-sent-icon">🤝</div>
            <div className="cm-sent-title">Request Sent!</div>
            <div className="cm-sent-to">to {artist.name}</div>
            <div className="cm-sent-sub">
              Your collaboration request for <strong>{form.projectName}</strong> is in their inbox.
              You'll be notified when they respond — usually within 24–48 hours.
            </div>
            <div className="cm-sent-details glass">
              <div className="cm-sent-row">
                <span className="cm-sent-key">Type</span>
                <span className="cm-sent-val">{selectedType?.label}</span>
              </div>
              <div className="cm-sent-row">
                <span className="cm-sent-key">Terms</span>
                <span className="cm-sent-val">{form.terms}</span>
              </div>
              <div className="cm-sent-row">
                <span className="cm-sent-key">Timeline</span>
                <span className="cm-sent-val">
                  {TIMELINE_OPTIONS.find(t => t.value === form.timeline)?.label}
                </span>
              </div>
            </div>
            <div className="cm-sent-actions">
              <button className="btn-primary cm-goto-msg" onClick={() => { onClose(); navigate('/messages'); }}>
                <MessageSquare size={16} /> View in Messages
              </button>
              <button className="cm-close-sent" onClick={onClose}>Done</button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        /* ── Backdrop & shell ──────────────────────── */
        .cm-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .cm-shell {
          width: 100%;
          max-width: 580px;
          border-radius: 28px;
          border: 1px solid var(--border-gold);
          display: flex;
          flex-direction: column;
          max-height: 92vh;
          overflow: hidden;
          background: rgba(12,12,12,0.97);
        }

        /* ── Header ────────────────────────────────── */
        .cm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.75rem 1.25rem;
          border-bottom: 1px solid var(--border-light);
          flex-shrink: 0;
        }
        .cm-header-artist {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .cm-header-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-gold);
        }
        .cm-header-to {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.01em;
        }
        .cm-header-name {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .cm-close {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.07);
          color: var(--text-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .cm-close:hover { background: rgba(255,255,255,0.14); color: #fff; }

        /* ── Step bar ──────────────────────────────── */
        .cm-step-bar {
          display: flex;
          align-items: center;
          padding: 1rem 1.75rem;
          border-bottom: 1px solid var(--border-light);
          gap: 0;
          flex-shrink: 0;
        }
        .cm-step-entry {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }
        .cm-step-entry:last-child { flex: none; }
        .cm-step-node {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
          flex-shrink: 0;
          background: rgba(255,255,255,0.06);
          color: var(--text-muted);
          border: 1px solid var(--border-light);
          transition: all 0.25s;
        }
        .cm-step-node.active {
          background: var(--accent-gold);
          color: #000;
          border-color: var(--accent-gold);
        }
        .cm-step-node.done {
          background: rgba(34,197,94,0.15);
          color: #22c55e;
          border-color: rgba(34,197,94,0.4);
        }
        .cm-step-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .cm-step-label.active { color: var(--accent-gold); }
        .cm-step-line {
          flex: 1;
          height: 1px;
          background: var(--border-light);
          margin: 0 0.5rem;
        }
        .cm-step-line.done { background: rgba(34,197,94,0.4); }

        /* ── Body ──────────────────────────────────── */
        .cm-body {
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          overflow-y: auto;
          flex: 1;
        }
        .cm-body::-webkit-scrollbar { width: 4px; }
        .cm-body::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 4px; }

        .cm-step-intro { margin-bottom: 0.25rem; }
        .cm-step-title { font-size: 1.15rem; font-weight: 800; margin-bottom: 0.3rem; }
        .cm-step-sub { font-size: 0.82rem; color: var(--text-muted); }

        /* ── Type grid ─────────────────────────────── */
        .cm-type-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .cm-type-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 1.1rem;
          border-radius: 16px;
          border: 1px solid var(--border-light);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }
        .cm-type-card:hover {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.04);
        }
        .cm-type-card.active {
          border-color: var(--type-color);
          background: color-mix(in srgb, var(--type-color) 8%, transparent);
        }
        .cm-type-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--type-color);
        }
        .cm-type-card.active .cm-type-icon-wrap {
          background: color-mix(in srgb, var(--type-color) 15%, transparent);
        }
        .cm-type-label {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-white);
        }
        .cm-type-desc {
          font-size: 0.74rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .cm-type-check {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--type-color);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Form fields ────────────────────────────── */
        .cm-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .cm-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-gray);
          letter-spacing: 0.03em;
        }
        .cm-req { color: var(--accent-gold); margin-left: 2px; }
        .cm-opt { color: var(--text-muted); font-weight: 400; }

        .cm-input, .cm-textarea, .cm-select {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 0.72rem 0.95rem;
          color: var(--text-white);
          font-size: 0.88rem;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
          font-family: inherit;
        }
        .cm-input:focus, .cm-textarea:focus, .cm-select:focus {
          border-color: var(--border-gold);
        }
        .cm-input::placeholder, .cm-textarea::placeholder { color: var(--text-muted); }
        .cm-textarea { resize: vertical; }
        .cm-char {
          font-size: 0.68rem;
          color: var(--text-muted);
          text-align: right;
          margin-top: -0.2rem;
        }

        /* ── Timeline ──────────────────────────────── */
        .cm-timeline-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }
        .cm-timeline-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 0.6rem 0.4rem;
          border-radius: 10px;
          border: 1px solid var(--border-light);
          background: transparent;
          color: var(--text-gray);
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .cm-timeline-btn:hover { border-color: var(--text-white); color: var(--text-white); }
        .cm-timeline-btn.active {
          border-color: var(--accent-gold);
          background: rgba(255,215,0,0.07);
          color: var(--accent-gold);
        }
        .cm-tl-label { font-size: 0.8rem; font-weight: 700; }
        .cm-tl-sub { font-size: 0.62rem; color: var(--text-muted); }
        .cm-timeline-btn.active .cm-tl-sub { color: rgba(255,215,0,0.7); }

        /* ── Contribution chips ─────────────────────── */
        .cm-contrib-wrap { display: flex; flex-wrap: wrap; gap: 0.45rem; }
        .cm-contrib-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 0.38rem 0.9rem;
          border-radius: 50px;
          border: 1px solid var(--border-light);
          background: transparent;
          color: var(--text-gray);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .cm-contrib-chip:hover { border-color: var(--text-white); color: var(--text-white); }
        .cm-contrib-chip.active {
          border-color: var(--accent-gold);
          background: rgba(255,215,0,0.07);
          color: var(--accent-gold);
        }

        /* ── Terms select ──────────────────────────── */
        .cm-select-wrap { position: relative; }
        .cm-select {
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          padding-right: 2.5rem;
        }
        .cm-select option { background: #1a1a1a; }
        .cm-select-icon {
          position: absolute;
          right: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        /* ── Toggle ────────────────────────────────── */
        .cm-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .cm-toggle {
          width: 42px;
          height: 24px;
          border-radius: 50px;
          background: rgba(255,255,255,0.1);
          border: none;
          padding: 3px;
          cursor: pointer;
          transition: background 0.25s;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .cm-toggle.on { background: var(--accent-gold); }
        .cm-toggle-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.25s;
          display: block;
        }
        .cm-toggle.on .cm-toggle-thumb { transform: translateX(18px); }

        /* ── Budget row ────────────────────────────── */
        .cm-budget-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .cm-budget-input-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 0.72rem 0.95rem;
          transition: border-color 0.2s;
        }
        .cm-budget-input-wrap:focus-within { border-color: var(--border-gold); }
        .cm-budget-input {
          background: transparent;
          border: none;
          color: var(--text-white);
          font-size: 0.88rem;
          outline: none;
          flex: 1;
          font-family: inherit;
        }
        .cm-budget-input::placeholder { color: var(--text-muted); }

        /* ── Review card ────────────────────────────── */
        .cm-review-card {
          background: rgba(255,215,0,0.03);
          border: 1px solid var(--border-gold);
          border-radius: 16px;
          padding: 1.1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .cm-review-label {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        .cm-review-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
        .cm-rv-key { font-size: 0.75rem; color: var(--text-muted); flex-shrink: 0; }
        .cm-rv-val { font-size: 0.82rem; font-weight: 600; text-align: right; }

        /* ── Legal ─────────────────────────────────── */
        .cm-legal {
          font-size: 0.68rem;
          color: var(--text-muted);
          line-height: 1.55;
          text-align: center;
          padding: 0 0.5rem;
          margin-top: -0.5rem;
        }

        /* ── Footer ────────────────────────────────── */
        .cm-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.25rem;
          border-top: 1px solid var(--border-light);
        }
        .cm-cancel, .cm-back {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          border: 1px solid var(--border-light);
          background: transparent;
          color: var(--text-gray);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .cm-cancel:hover, .cm-back:hover {
          border-color: var(--text-white);
          color: var(--text-white);
        }
        .cm-next-btn, .cm-send-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.9rem;
          padding: 0.65rem 1.4rem;
        }
        .cm-disabled {
          opacity: 0.35;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* ── Sent state ────────────────────────────── */
        .cm-sent-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 3rem 2rem 2.5rem;
          gap: 0.85rem;
          position: relative;
          overflow: hidden;
        }
        .cm-sent-glow {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .cm-sent-icon { font-size: 3.5rem; }
        .cm-sent-title { font-size: 1.75rem; font-weight: 900; }
        .cm-sent-to { font-size: 0.85rem; color: var(--accent-gold); font-weight: 700; margin-top: -0.4rem; }
        .cm-sent-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
          max-width: 320px;
          line-height: 1.65;
        }
        .cm-sent-sub strong { color: var(--text-gray); }
        .cm-sent-details {
          width: 100%;
          max-width: 320px;
          border: 1px solid var(--border-light);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 0.25rem 0;
        }
        .cm-sent-row { display: flex; justify-content: space-between; }
        .cm-sent-key { font-size: 0.75rem; color: var(--text-muted); }
        .cm-sent-val { font-size: 0.8rem; font-weight: 600; }
        .cm-sent-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .cm-goto-msg {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.9rem;
        }
        .cm-close-sent {
          padding: 0.65rem 1.4rem;
          border-radius: 50px;
          border: 1px solid var(--border-light);
          background: transparent;
          color: var(--text-gray);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .cm-close-sent:hover { border-color: var(--text-white); color: var(--text-white); }
      `}</style>
    </div>
  );
};

export default CollabModal;
