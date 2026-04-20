import { useState } from 'react';
import {
  Wallet as WalletIcon, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle, CreditCard, Banknote,
  Download, ChevronRight, X, Plus, ShieldCheck,
  DollarSign, TrendingUp, FileText, AlertCircle
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import {
  MOCK_WALLET,
  MOCK_TRANSACTIONS,
  MOCK_PAYOUT_METHODS,
  MOCK_WITHDRAWALS
} from '../data/mockData';

const TABS = ['Overview', 'Settings'];

const BALANCE_CARDS = [
  { label: 'Available Balance', key: 'available', icon: WalletIcon,   color: '#1677FF', desc: 'Ready for withdrawal'      },
  { label: 'Pending Balance',   key: 'pending',   icon: Clock,        color: '#F59E0B', desc: 'Processing from stores'    },
  { label: 'On Hold (Escrow)', key: 'onHold',    icon: ShieldCheck,  color: '#818CF8', desc: 'Awaiting collab approval'  },
  { label: 'Lifetime Earnings',key: 'lifetime',  icon: TrendingUp,   color: '#22C55E', desc: 'Total revenue to date'     },
];

const STATUS_CONFIG = {
  'Completed': { bg: 'rgba(34,197,94,0.1)',  color: '#22C55E' },
  'On Hold':   { bg: 'rgba(129,140,248,0.1)',color: '#818CF8' },
  'Pending':   { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  'Requested': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  'Paid':      { bg: 'rgba(34,197,94,0.1)',  color: '#22C55E' },
};

const WalletPage = () => {
  const [tab, setTab]                     = useState('Overview');
  const [showModal, setShowModal]         = useState(false);
  const [step, setStep]                   = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(MOCK_PAYOUT_METHODS[0] || null);
  const [amount, setAmount]               = useState('');
  const [confirming, setConfirming]       = useState(false);
  const [done, setDone]                   = useState(false);

  const resetModal = () => {
    setShowModal(false);
    setStep(1);
    setAmount('');
    setConfirming(false);
    setDone(false);
  };

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => { setConfirming(false); setDone(true); setStep(3); }, 1500);
  };

  return (
    <div className="wl-page fade-in">
      <div className="wl-header">
        <div>
          <div className="eyebrow"><WalletIcon size={13} className="text-blue" /> FINANCIAL DISTRICT</div>
          <h1 className="wl-h1">Wallet &amp; Payouts</h1>
          <p className="wl-sub">Manage your royalties, settlements, and escrow accounts.</p>
        </div>
        <div className="wl-header-actions">
          <button className="wl-payout-trigger" onClick={() => setShowModal(true)}>
            <ArrowUpRight size={16} /> Withdraw Funds
          </button>
        </div>
      </div>

      <div className="wl-balance-grid">
        {BALANCE_CARDS.map(card => (
          <div key={card.key} className="wl-balance-card">
            <div className="wl-bc-top">
              <div className="wl-bc-icon" style={{ background: `${card.color}18`, color: card.color }}>
                <card.icon size={19} />
              </div>
            </div>
            <p className="wl-bc-label">{card.label}</p>
            <p className="wl-bc-value">{MOCK_WALLET[card.key] || 'R0.00'}</p>
            <p className="wl-bc-desc">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="wl-panel p-20 text-center">
         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <TrendingUp size={32} />
         </div>
         <h2 className="text-xl font-black mb-2">No Transactions Yet</h2>
         <p className="text-gray max-w-sm mx-auto">Your settlement pipeline is empty. Once your music is live and streaming, your royalties will appear here.</p>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="wl-modal-backdrop" onClick={resetModal}>
            <div className="wl-modal" onClick={e => e.stopPropagation()}>
              <button className="wl-modal-close" onClick={resetModal}><X size={20} /></button>
              <div className="wl-modal-body p-8 text-center">
                 <AlertCircle size={40} className="mx-auto mb-4 text-gray-300" />
                 <h2 className="text-xl font-bold mb-2">Payout Method Required</h2>
                 <p className="text-gray mb-6">Please add a bank account or PayPal in settings to initiate withdrawals.</p>
                 <button className="btn-primary w-full" onClick={resetModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .wl-page { padding: 2.5rem; }
        .wl-h1 { font-size: 2.22rem; font-weight: 950; letter-spacing: -0.03em; }
        .wl-balance-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: 2rem; margin-bottom: 2rem; }
        .wl-balance-card { background: #fff; border: 1px solid var(--border-light); border-radius: 18px; padding: 1.5rem; box-shadow: var(--shadow-card); }
        .wl-bc-value { font-size: 1.6rem; font-weight: 900; }
        .wl-payout-trigger { background: var(--accent-blue); color: #fff; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 800; }
        .wl-modal-backdrop { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
        .wl-modal { background: #fff; border-radius: 24px; max-width: 400px; width: 90%; }
      `}</style>
    </div>
  );
};

export default WalletPage;
