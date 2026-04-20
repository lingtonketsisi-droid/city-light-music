import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Shield, DollarSign, Clock, Plus, Trash2, Lock, Check } from 'lucide-react';

const DEAL_TYPES = [
  { key: 'Feature',          label: 'Feature',          desc: 'Vocal or instrumental feature on a track',      color: '#818cf8' },
  { key: 'Full Collaboration',label: 'Full Collab',     desc: 'Co-write, co-produce and co-release a project',  color: '#10b981' },
  { key: 'Production Only',  label: 'Production',       desc: 'Beats, instrumentals and production services',   color: '#fbbf24' },
  { key: 'Mixing & Mastering',label: 'Mix & Master',    desc: 'Professional audio mixing and mastering',        color: '#60a5fa' },
  { key: 'Visual Art',       label: 'Visual Art',       desc: 'Cover art, music video, brand visuals',          color: '#f472b6' },
  { key: 'Co-Writing',       label: 'Co-Writing',       desc: 'Songwriting and lyric contribution',             color: '#fb923c' },
];

const CURRENCIES = ['ZAR (R)', 'USD ($)', 'EUR (€)', 'GBP (£)', 'NGN (₦)'];
const REVISION_OPTIONS = ['1 revision', '2 revisions', '3 revisions', 'Unlimited'];

const PLATFORM_FEE = 0.10;

const fmtAmount = (amount, currency) => {
  if (!amount || isNaN(Number(amount))) return '—';
  const sym = currency?.match(/\((.+)\)/)?.[1] || '';
  return `${sym}${Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
};

const StepBar = ({ step }) => (
  <div className="cdm-stepbar">
    {['Deal Type', 'Project Details', 'Payment & Terms'].map((label, i) => (
      <div key={i} className={`cdm-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
        <div className="cdm-step-node">
          {i < step ? <Check size={11} /> : <span>{i + 1}</span>}
        </div>
        <span className="cdm-step-label">{label}</span>
        {i < 2 && <div className="cdm-step-connector" />}
      </div>
    ))}
  </div>
);

const CreateDealModal = ({ artistName, onClose, onSend }) => {
  const [step, setStep]   = useState(0);
  const [sent, setSent]   = useState(false);
  const [form, setForm]   = useState({
    type: '',
    projectName: '',
    description: '',
    deliverables: [''],
    revisions: '2 revisions',
    amount: '',
    currency: 'ZAR (R)',
    deadline: '',
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  /* Deliverables helpers */
  const setDeliverable = (i, val) => {
    const next = [...form.deliverables];
    next[i] = val;
    set('deliverables', next);
  };
  const addDeliverable = () => set('deliverables', [...form.deliverables, '']);
  const removeDeliverable = i => set('deliverables', form.deliverables.filter((_, j) => j !== i));

  /* Validation gates */
  const can0 = !!form.type;
  const can1 = form.projectName.trim().length >= 3 &&
               form.deliverables.some(d => d.trim().length > 0);
  const can2 = form.amount && !isNaN(Number(form.amount)) && Number(form.amount) > 0 && form.deadline;

  /* Calculated values */
  const grossAmt   = Number(form.amount) || 0;
  const fee        = Math.round(grossAmt * PLATFORM_FEE);
  const payout     = grossAmt - fee;
  const revNum     = parseInt(form.revisions) || 0;

  const handleSend = () => {
    const dealData = {
      projectName: form.projectName,
      type: form.type,
      amount: grossAmt,
      currency: form.currency.split(' ')[0], // 'ZAR'
      deadline: form.deadline,
      deliverables: form.deliverables.filter(d => d.trim()),
      revisions: revNum,
      status: 'proposal',
      myRole: 'buyer',
      escrow: { paid: false, fee, payout }
    };
    onSend(dealData);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="cdm-overlay" onClick={onClose}>
        <div className="cdm-card" onClick={e => e.stopPropagation()}>
          <div className="cdm-sent">
            <div className="cdm-sent-icon">
              <Shield size={32} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <h2 className="cdm-sent-title">Deal Proposal Sent</h2>
            <p className="cdm-sent-sub">
              Your deal proposal for <strong>{form.projectName}</strong> has been sent to{' '}
              <strong>{artistName}</strong>. Once they accept, you'll be prompted to pay into escrow.
            </p>
            <div className="cdm-sent-summary">
              <div className="cdm-sent-row"><span>Project</span><span>{form.projectName}</span></div>
              <div className="cdm-sent-row"><span>Type</span><span>{form.type}</span></div>
              <div className="cdm-sent-row"><span>Amount</span><span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{fmtAmount(form.amount, form.currency)}</span></div>
              <div className="cdm-sent-row"><span>Platform Fee (10%)</span><span style={{ color: '#f87171' }}>−{fmtAmount(fee, form.currency)}</span></div>
              <div className="cdm-sent-divider" />
              <div className="cdm-sent-row"><span>Artist Receives</span><span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>{fmtAmount(payout, form.currency)}</span></div>
              <div className="cdm-sent-row"><span>Deadline</span><span>{form.deadline}</span></div>
            </div>
            <button className="cdm-done-btn" onClick={onClose}>Done</button>
          </div>
          <CdmStyles />
        </div>
      </div>
    );
  }

  return (
    <div className="cdm-overlay" onClick={onClose}>
      <div className="cdm-card" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="cdm-header">
          <div>
            <p className="cdm-eyebrow"><Shield size={12} /> Escrow Deal</p>
            <h2 className="cdm-title">Create Deal with {artistName}</h2>
          </div>
          <button className="cdm-close" onClick={onClose}><X size={18} /></button>
        </div>

        <StepBar step={step} />

        {/* ── Step 0: Deal Type ─────────────────────────── */}
        {step === 0 && (
          <div className="cdm-body">
            <p className="cdm-section-hint">Choose the type of work for this deal.</p>
            <div className="cdm-type-grid">
              {DEAL_TYPES.map(t => (
                <button
                  key={t.key}
                  className={`cdm-type-card ${form.type === t.key ? 'selected' : ''}`}
                  style={{ '--type-color': t.color }}
                  onClick={() => set('type', t.key)}
                >
                  <span className="cdm-type-name">{t.label}</span>
                  <span className="cdm-type-desc">{t.desc}</span>
                  {form.type === t.key && <div className="cdm-type-check"><Check size={11} /></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Project Details ───────────────────── */}
        {step === 1 && (
          <div className="cdm-body">
            <div className="cdm-field">
              <label className="cdm-label">Project Name</label>
              <input
                className="cdm-input"
                placeholder="e.g. City Lights EP – Feature Verse"
                value={form.projectName}
                onChange={e => set('projectName', e.target.value)}
              />
            </div>
            <div className="cdm-field">
              <label className="cdm-label">Brief Description <span className="cdm-optional">(optional)</span></label>
              <textarea
                className="cdm-input cdm-textarea"
                placeholder="Describe what you need, the direction and any references…"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
              />
            </div>
            <div className="cdm-field">
              <label className="cdm-label">Deliverables</label>
              <p className="cdm-field-hint">List exactly what the seller must provide.</p>
              <div className="cdm-deliverables">
                {form.deliverables.map((d, i) => (
                  <div key={i} className="cdm-deliver-row">
                    <input
                      className="cdm-input cdm-deliver-input"
                      placeholder={`Deliverable ${i + 1}`}
                      value={d}
                      onChange={e => setDeliverable(i, e.target.value)}
                    />
                    {form.deliverables.length > 1 && (
                      <button className="cdm-del-btn" onClick={() => removeDeliverable(i)}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
                <button className="cdm-add-deliver-btn" onClick={addDeliverable}>
                  <Plus size={13} /> Add Deliverable
                </button>
              </div>
            </div>
            <div className="cdm-field">
              <label className="cdm-label">Revisions Included</label>
              <div className="cdm-pill-group">
                {REVISION_OPTIONS.map(r => (
                  <button
                    key={r}
                    className={`cdm-pill ${form.revisions === r ? 'selected' : ''}`}
                    onClick={() => set('revisions', r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Payment & Terms ───────────────────── */}
        {step === 2 && (
          <div className="cdm-body">
            <div className="cdm-payment-row">
              <div className="cdm-field cdm-field-flex">
                <label className="cdm-label">Currency</label>
                <select
                  className="cdm-input cdm-select"
                  value={form.currency}
                  onChange={e => set('currency', e.target.value)}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="cdm-field cdm-field-flex2">
                <label className="cdm-label">Amount</label>
                <input
                  className="cdm-input"
                  type="number"
                  min="1"
                  placeholder="5000"
                  value={form.amount}
                  onChange={e => set('amount', e.target.value)}
                />
              </div>
            </div>
            <div className="cdm-field">
              <label className="cdm-label">Deadline</label>
              <input
                className="cdm-input"
                type="date"
                value={form.deadline}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => set('deadline', e.target.value)}
              />
            </div>

            {/* Live escrow breakdown */}
            {grossAmt > 0 && (
              <div className="cdm-breakdown">
                <div className="cdm-breakdown-header">
                  <Lock size={13} /> Escrow Breakdown
                </div>
                <div className="cdm-breakdown-rows">
                  <div className="cdm-br-row">
                    <span>Gross Amount</span>
                    <span>{fmtAmount(grossAmt, form.currency)}</span>
                  </div>
                  <div className="cdm-br-row cdm-br-fee">
                    <span>Platform Fee (10%)</span>
                    <span>−{fmtAmount(fee, form.currency)}</span>
                  </div>
                  <div className="cdm-br-divider" />
                  <div className="cdm-br-row cdm-br-payout">
                    <span>{artistName} Receives</span>
                    <span>{fmtAmount(payout, form.currency)}</span>
                  </div>
                </div>
                <p className="cdm-escrow-note">
                  <Lock size={10} /> Funds are held in escrow until you approve the delivery. You can request revisions or raise a dispute if needed.
                </p>
              </div>
            )}

            {/* Deal summary */}
            <div className="cdm-review-card">
              <p className="cdm-review-title">Deal Summary</p>
              <div className="cdm-review-rows">
                <div className="cdm-review-row"><span>Type</span><span>{form.type}</span></div>
                <div className="cdm-review-row"><span>Project</span><span>{form.projectName}</span></div>
                <div className="cdm-review-row"><span>Deliverables</span><span>{form.deliverables.filter(d => d.trim()).length} items</span></div>
                <div className="cdm-review-row"><span>Revisions</span><span>{form.revisions}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Footer navigation */}
        <div className="cdm-footer">
          {step > 0 ? (
            <button className="cdm-back-btn" onClick={() => setStep(s => s - 1)}>
              <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <button className="cdm-back-btn" onClick={onClose}>Cancel</button>
          )}

          {step < 2 ? (
            <button
              className={`cdm-next-btn ${(step === 0 ? can0 : can1) ? 'active' : ''}`}
              disabled={step === 0 ? !can0 : !can1}
              onClick={() => setStep(s => s + 1)}
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className={`cdm-send-btn ${can2 ? 'active' : ''}`}
              disabled={!can2}
              onClick={handleSend}
            >
              <Shield size={15} /> Send Deal Proposal
            </button>
          )}
        </div>

        <CdmStyles />
      </div>
    </div>
  );
};

/* ── Styles ─────────────────────────────────────────────────── */
const CdmStyles = () => (
  <style>{`
    .cdm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 1.5rem;
    }
    .cdm-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: 24px;
      width: 100%;
      max-width: 560px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .cdm-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.75rem 2rem 1rem;
      border-bottom: 1px solid var(--border-light);
      flex-shrink: 0;
    }
    .cdm-eyebrow {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.68rem;
      font-weight: 800;
      color: var(--accent-gold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.3rem;
    }
    .cdm-title {
      font-size: 1.2rem;
      font-weight: 900;
      color: var(--text-white);
    }
    .cdm-close {
      color: var(--text-muted);
      padding: 0.35rem;
      border-radius: 8px;
      transition: all 0.15s;
      flex-shrink: 0;
    }
    .cdm-close:hover { background: rgba(255,255,255,0.07); color: var(--text-white); }

    /* Step bar */
    .cdm-stepbar {
      display: flex;
      align-items: center;
      padding: 1rem 2rem;
      border-bottom: 1px solid var(--border-light);
      flex-shrink: 0;
      gap: 0;
    }
    .cdm-step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
    }
    .cdm-step-node {
      width: 24px; height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: 800;
      border: 2px solid var(--border-light);
      color: var(--text-muted);
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .cdm-step.active .cdm-step-node {
      background: rgba(255,215,0,0.15);
      border-color: var(--accent-gold);
      color: var(--accent-gold);
    }
    .cdm-step.done .cdm-step-node {
      background: rgba(16,185,129,0.15);
      border-color: #10b981;
      color: #10b981;
    }
    .cdm-step-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      white-space: nowrap;
    }
    .cdm-step.active .cdm-step-label { color: var(--accent-gold); font-weight: 800; }
    .cdm-step.done  .cdm-step-label { color: #10b981; }
    .cdm-step-connector {
      flex: 1;
      min-width: 24px;
      height: 2px;
      background: var(--border-light);
      margin: 0 0.5rem;
    }
    .cdm-step.done + .cdm-step .cdm-step-connector { background: #10b981; }

    /* Body */
    .cdm-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .cdm-body::-webkit-scrollbar { width: 4px; }
    .cdm-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

    .cdm-section-hint {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin: 0;
    }

    /* Type grid */
    .cdm-type-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .cdm-type-card {
      padding: 1rem;
      border-radius: 14px;
      border: 1px solid var(--border-light);
      background: rgba(255,255,255,0.02);
      text-align: left;
      position: relative;
      transition: all 0.2s;
      cursor: pointer;
    }
    .cdm-type-card:hover {
      background: rgba(255,255,255,0.04);
      border-color: var(--type-color, var(--border-light));
    }
    .cdm-type-card.selected {
      background: color-mix(in srgb, var(--type-color, var(--accent-gold)) 8%, transparent);
      border-color: var(--type-color, var(--accent-gold));
    }
    .cdm-type-name {
      display: block;
      font-size: 0.88rem;
      font-weight: 800;
      color: var(--text-white);
      margin-bottom: 0.3rem;
    }
    .cdm-type-card.selected .cdm-type-name { color: var(--type-color, var(--accent-gold)); }
    .cdm-type-desc {
      display: block;
      font-size: 0.72rem;
      color: var(--text-muted);
      line-height: 1.3;
    }
    .cdm-type-check {
      position: absolute;
      top: 0.6rem; right: 0.6rem;
      width: 18px; height: 18px;
      border-radius: 50%;
      background: var(--type-color, var(--accent-gold));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
    }

    /* Fields */
    .cdm-field { display: flex; flex-direction: column; gap: 0.4rem; }
    .cdm-label {
      font-size: 0.72rem;
      font-weight: 800;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }
    .cdm-optional { font-weight: 400; text-transform: none; letter-spacing: 0; color: var(--text-muted); opacity: 0.7; }
    .cdm-field-hint { font-size: 0.75rem; color: var(--text-muted); margin: 0; }

    .cdm-input {
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border-light);
      border-radius: 10px;
      padding: 0.65rem 0.9rem;
      color: var(--text-white);
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s;
      font-family: inherit;
      width: 100%;
    }
    .cdm-input:focus { border-color: rgba(255,215,0,0.35); }
    .cdm-input::placeholder { color: var(--text-muted); }
    .cdm-textarea { resize: none; }
    .cdm-select { cursor: pointer; }
    .cdm-select option { background: #1a1a1a; }

    /* Deliverables */
    .cdm-deliverables { display: flex; flex-direction: column; gap: 0.4rem; }
    .cdm-deliver-row { display: flex; gap: 0.4rem; align-items: center; }
    .cdm-deliver-input { flex: 1; }
    .cdm-del-btn {
      width: 32px; height: 36px;
      border-radius: 8px;
      background: rgba(239,68,68,0.08);
      border: 1px solid rgba(239,68,68,0.2);
      color: #f87171;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s;
    }
    .cdm-del-btn:hover { background: rgba(239,68,68,0.15); }
    .cdm-add-deliver-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--accent-gold);
      padding: 0.4rem 0;
      transition: opacity 0.15s;
    }
    .cdm-add-deliver-btn:hover { opacity: 0.8; }

    /* Pills */
    .cdm-pill-group { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .cdm-pill {
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      border: 1px solid var(--border-light);
      background: rgba(255,255,255,0.03);
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 700;
      transition: all 0.15s;
    }
    .cdm-pill.selected {
      background: rgba(255,215,0,0.1);
      border-color: rgba(255,215,0,0.3);
      color: var(--accent-gold);
    }

    /* Payment row */
    .cdm-payment-row { display: flex; gap: 0.75rem; }
    .cdm-field-flex  { flex: 0 0 140px; }
    .cdm-field-flex2 { flex: 1; }

    /* Escrow breakdown */
    .cdm-breakdown {
      background: rgba(16,185,129,0.04);
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: 14px;
      overflow: hidden;
    }
    .cdm-breakdown-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.65rem 1rem;
      font-size: 0.72rem;
      font-weight: 800;
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      background: rgba(16,185,129,0.06);
      border-bottom: 1px solid rgba(16,185,129,0.15);
    }
    .cdm-breakdown-rows {
      padding: 0.75rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .cdm-br-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.82rem;
      color: var(--text-gray);
    }
    .cdm-br-fee { color: #f87171; }
    .cdm-br-row span:last-child { font-weight: 700; color: var(--text-white); }
    .cdm-br-divider { height: 1px; background: rgba(16,185,129,0.15); margin: 0.25rem 0; }
    .cdm-br-payout { font-weight: 800; font-size: 0.9rem; }
    .cdm-br-payout span:last-child { color: var(--accent-gold) !important; }
    .cdm-escrow-note {
      display: flex;
      align-items: flex-start;
      gap: 0.35rem;
      padding: 0.6rem 1rem;
      font-size: 0.72rem;
      color: var(--text-muted);
      border-top: 1px solid rgba(16,185,129,0.1);
      line-height: 1.4;
      margin: 0;
    }

    /* Review card */
    .cdm-review-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 1rem;
    }
    .cdm-review-title {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 0.75rem;
    }
    .cdm-review-rows { display: flex; flex-direction: column; gap: 0.4rem; }
    .cdm-review-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.82rem;
    }
    .cdm-review-row span:first-child { color: var(--text-muted); }
    .cdm-review-row span:last-child  { color: var(--text-white); font-weight: 600; }

    /* Footer */
    .cdm-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 2rem;
      border-top: 1px solid var(--border-light);
      flex-shrink: 0;
    }
    .cdm-back-btn {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--text-muted);
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.55rem 1rem;
      border-radius: 10px;
      transition: all 0.15s;
    }
    .cdm-back-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-white); }
    .cdm-next-btn, .cdm-send-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.65rem 1.5rem;
      border-radius: 12px;
      font-size: 0.88rem;
      font-weight: 800;
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--border-light);
      color: var(--text-muted);
      cursor: not-allowed;
      transition: all 0.2s;
    }
    .cdm-next-btn.active, .cdm-send-btn.active {
      background: var(--accent-gold);
      border-color: var(--accent-gold);
      color: #000;
      cursor: pointer;
    }
    .cdm-next-btn.active:hover, .cdm-send-btn.active:hover { filter: brightness(1.08); }

    /* Sent state */
    .cdm-sent {
      padding: 2.5rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
    }
    .cdm-sent-icon {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: rgba(255,215,0,0.1);
      border: 2px solid rgba(255,215,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cdm-sent-title {
      font-size: 1.4rem;
      font-weight: 900;
      color: var(--text-white);
      margin: 0;
    }
    .cdm-sent-sub {
      font-size: 0.88rem;
      color: var(--text-muted);
      max-width: 380px;
      line-height: 1.5;
      margin: 0;
    }
    .cdm-sent-summary {
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border-light);
      border-radius: 14px;
      padding: 1rem 1.25rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .cdm-sent-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.82rem;
    }
    .cdm-sent-row span:first-child { color: var(--text-muted); }
    .cdm-sent-row span:last-child  { color: var(--text-white); font-weight: 600; }
    .cdm-sent-divider { height: 1px; background: var(--border-light); margin: 0.25rem 0; }
    .cdm-done-btn {
      background: var(--accent-gold);
      color: #000;
      font-weight: 800;
      font-size: 0.9rem;
      padding: 0.75rem 2.5rem;
      border-radius: 12px;
      transition: filter 0.15s;
      margin-top: 0.5rem;
    }
    .cdm-done-btn:hover { filter: brightness(1.08); }
  `}</style>
);

export default CreateDealModal;
