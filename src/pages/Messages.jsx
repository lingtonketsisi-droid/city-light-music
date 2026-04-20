import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Send, MoreHorizontal, Phone, Video, Info,
  CheckCheck, Smile, Paperclip, DollarSign,
  MessageSquare, Handshake, CheckCircle, X, Shield,
  ExternalLink, FileArchive, FileAudio,
  FileImage, File, Music, ChevronRight, Plus, Flag
} from 'lucide-react';
import { MOCK_CONVERSATIONS, MOCK_DM_MESSAGES } from '../data/mockData';
import CollabModal from '../components/ui/CollabModal';
import DealCard from '../components/ui/DealCard';
import CreateDealModal from '../components/ui/CreateDealModal';

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const OnlineDot = ({ online }) => (
  <span className={`online-dot ${online ? 'is-online' : 'is-offline'}`} />
);

const VerifiedBadge = () => (
  <CheckCircle size={13} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
);

const CollabBadge = ({ status }) =>
  status === 'open' ? (
    <span className="collab-badge open">Open to Collab</span>
  ) : (
    <span className="collab-badge closed">Project Finalized</span>
  );

const SeenIcon = ({ sender }) =>
  sender === 'me' ? (
    <CheckCheck size={12} className="seen-icon" />
  ) : null;

/* ─────────────────────────────────────────────────────────────
   TYPING INDICATOR
───────────────────────────────────────────────────────────── */
const TypingIndicator = () => (
  <div className="typing-row">
    <div className="typing-bubble">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
    <span className="typing-label">typing…</span>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   FILE MESSAGE BUBBLE
───────────────────────────────────────────────────────────── */
const FileBubble = ({ fileData, isMe }) => {
  const iconMap = {
    archive: <FileArchive size={22} />,
    audio: <FileAudio size={22} />,
    image: <FileImage size={22} />,
  };
  const icon = iconMap[fileData.fileType] || <File size={22} />;
  return (
    <div className="file-bubble shadow-sm">
      <div className="file-icon-wrap" style={{ background: 'rgba(0,112,243,0.05)', color: 'var(--accent-blue)' }}>{icon}</div>
      <div className="file-info">
        <span className="file-name" style={{ color: '#000' }}>{fileData.name}</span>
        <span className="file-size">{fileData.size}</span>
      </div>
      <button className="file-dl-btn" title="Download">
        <ExternalLink size={14} />
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   AUDIO MESSAGE BUBBLE
───────────────────────────────────────────────────────────── */
const AudioBubble = ({ audioData, isMe }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="audio-bubble shadow-sm">
      <button
        className="audio-play-btn"
        onClick={() => setPlaying(p => !p)}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <span className="audio-pause-icon">❚❚</span>
        ) : (
          <Music size={16} />
        )}
      </button>
      <div className="audio-waveform">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className={`waveform-bar ${playing ? 'waveform-active' : ''}`}
            style={{ height: `${8 + Math.sin(i * 0.8) * 8 + Math.random() * 6}px`, animationDelay: `${i * 0.04}s` }}
          />
        ))}
      </div>
      <div className="audio-meta">
        <span className="audio-duration" style={{ color: '#000' }}>{audioData.duration}</span>
        <span className="audio-name">{audioData.name}</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   COLLAB REQUEST CARD
───────────────────────────────────────────────────────────── */
const CollabRequestCard = ({ data, sender, onAccept, onDecline, onNegotiate }) => {
  const isMe = sender === 'me';
  const [negotiating, setNegotiating] = useState(false);
  const [counterOffer, setCounterOffer] = useState('');

  const submitCounter = () => {
    if (!counterOffer.trim()) return;
    onNegotiate(counterOffer.trim());
    setNegotiating(false);
    setCounterOffer('');
  };

  const statusColors = {
    pending: { bg: 'rgba(0,112,243,0.05)', border: 'rgba(0,112,243,0.2)', text: 'var(--accent-blue)' },
    accepted: { bg: 'rgba(0,243,112,0.05)', border: 'rgba(0,243,112,0.2)', text: 'var(--accent-emerald)' },
    declined: { bg: 'rgba(255,0,112,0.05)', border: 'rgba(255,0,112,0.2)', text: 'var(--accent-magenta)' },
    negotiating: { bg: 'rgba(0,112,243,0.08)', border: 'rgba(0,112,243,0.3)', text: 'var(--accent-blue)' },
  };
  const sc = statusColors[data.status] || statusColors.pending;

  return (
    <div className="cr-card shadow-lg">
      <div className="cr-card-header">
        <div className="cr-card-title-row">
          <Handshake size={15} className="text-blue" />
          <span className="cr-label">Media Collaboration Request</span>
        </div>
        <span
          className="cr-status-pill"
          style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}
        >
          {data.status.toUpperCase()}
        </span>
      </div>

      <p className="cr-project">{data.projectName}</p>

      <div className="cr-detail-grid">
        <div className="cr-detail-item">
          <span className="cr-detail-label">Type</span>
          <span className="cr-detail-val">{data.collabType}</span>
        </div>
        <div className="cr-detail-item">
          <span className="cr-detail-label">Terms</span>
          <span className="cr-detail-val">{data.terms}</span>
        </div>
        {data.budget && (
          <div className="cr-detail-item">
            <span className="cr-detail-label">Budget</span>
            <span className="cr-detail-val cr-budget">{data.budget}</span>
          </div>
        )}
      </div>

      {data.pitch && <p className="cr-pitch">{data.pitch}</p>}

      {/* Actions — only shown when received and still pending/negotiating */}
      {!isMe && (data.status === 'pending' || data.status === 'negotiating') && !negotiating && (
        <div className="cr-actions">
          <button className="cr-btn cr-accept" onClick={onAccept}>
            <CheckCircle size={14} /> Accept
          </button>
          <button className="cr-btn cr-negotiate" onClick={() => setNegotiating(true)}>
            <MessageSquare size={14} /> Negotiate
          </button>
          <button className="cr-btn cr-decline" onClick={onDecline}>
            <X size={14} /> Decline
          </button>
        </div>
      )}

      {/* Negotiate counter-offer inline */}
      {!isMe && negotiating && (
        <div className="cr-negotiate-panel">
          <textarea
            className="cr-counter-input"
            placeholder="Propose new terms or add a counter-offer message…"
            value={counterOffer}
            onChange={e => setCounterOffer(e.target.value)}
            rows={2}
          />
          <div className="cr-negotiate-actions">
            <button className="cr-btn cr-accept" onClick={submitCounter}>Send Counter</button>
            <button className="cr-btn cr-decline" onClick={() => setNegotiating(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MESSAGE BUBBLE
───────────────────────────────────────────────────────────── */
const MessageBubble = ({ msg, convId, onAcceptCollab, onDeclineCollab, onNegotiateCollab, onDealAction }) => {
  const isMe = msg.sender === 'me';

  if (msg.type === 'deal') {
    return (
      <div className={`msg-row ${isMe ? 'msg-row-me' : 'msg-row-them'}`}>
        <DealCard
          dealData={msg.dealData}
          sender={msg.sender}
          onAction={(action, dealData) => onDealAction?.(convId, msg.id, action, dealData)}
        />
        <span className="msg-time">{msg.time} <SeenIcon sender={msg.sender} /></span>
      </div>
    );
  }

  if (msg.type === 'system') {
    return (
      <div className="sys-msg">
        <Shield size={12} />
        <span>{msg.text}</span>
      </div>
    );
  }

  if (msg.type === 'collab_request') {
    return (
      <div className={`msg-row ${isMe ? 'msg-row-me' : 'msg-row-them'}`}>
        <CollabRequestCard
          data={msg.collabData}
          sender={msg.sender}
          onAccept={() => onAcceptCollab(convId, msg.id)}
          onDecline={() => onDeclineCollab(convId, msg.id)}
          onNegotiate={(offer) => onNegotiateCollab(convId, msg.id, offer)}
        />
        <span className="msg-time">{msg.time} <SeenIcon sender={msg.sender} /></span>
      </div>
    );
  }

  if (msg.type === 'file') {
    return (
      <div className={`msg-row ${isMe ? 'msg-row-me' : 'msg-row-them'}`}>
        <FileBubble fileData={msg.fileData} isMe={isMe} />
        <span className="msg-time">{msg.time} <SeenIcon sender={msg.sender} /></span>
      </div>
    );
  }

  if (msg.type === 'audio') {
    return (
      <div className={`msg-row ${isMe ? 'msg-row-me' : 'msg-row-them'}`}>
        <AudioBubble audioData={msg.audioData} isMe={isMe} />
        <span className="msg-time">{msg.time} <SeenIcon sender={msg.sender} /></span>
      </div>
    );
  }

  return (
    <div className={`msg-row ${isMe ? 'msg-row-me' : 'msg-row-them'}`}>
      <div className={`msg-bubble ${isMe ? 'msg-bubble-me' : 'msg-bubble-them'}`}>
        {msg.text}
      </div>
      <span className="msg-time">{msg.time} <SeenIcon sender={msg.sender} /></span>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   CONVERSATION SIDEBAR ITEM
───────────────────────────────────────────────────────────── */
const ConvItem = ({ conv, active, onClick }) => (
  <button className={`conv-item ${active ? 'conv-item-active' : ''}`} onClick={onClick}>
    <div className="conv-avatar-wrap">
      <img src={conv.avatar} alt={conv.name} className="conv-avatar" />
      <OnlineDot online={conv.online} />
    </div>
    <div className="conv-info">
      <div className="conv-name-row">
        <span className="conv-name">
          {conv.name}
          {conv.verified && <VerifiedBadge />}
        </span>
        <span className="conv-time">{conv.lastTime}</span>
      </div>
      <div className="conv-last-row">
        <span className="conv-last">{conv.lastMessage}</span>
        {conv.unread > 0 && <span className="conv-unread">{conv.unread}</span>}
      </div>
    </div>
  </button>
);

/* ─────────────────────────────────────────────────────────────
   DATE DIVIDER
───────────────────────────────────────────────────────────── */
const DateDivider = ({ date }) => (
  <div className="date-divider">
    <span>{date}</span>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const MessagesPage = () => {
  const [conversations, setConversations] = useState(
    MOCK_CONVERSATIONS.map(c => ({ ...c }))
  );
  const [messages, setMessages] = useState(
    Object.fromEntries(
      Object.entries(MOCK_DM_MESSAGES).map(([k, v]) => [k, v.map(m => ({ ...m }))])
    )
  );
  const [activeConvId, setActiveConvId] = useState('conv-001');
  const [inputText, setInputText]       = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [activeTab, setActiveTab]       = useState('all');
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [showDealModal, setShowDealModal]     = useState(false);
  const [isTyping, setIsTyping]         = useState(false);
  const [showInfo, setShowInfo]         = useState(false);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const fileInputRef = useRef(null);

  const MAX_CHARS    = 500;
  const RATE_LIMIT   = 50;

  const activeConv     = conversations.find(c => c.id === activeConvId);
  const activeMessages = messages[activeConvId] || [];

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, activeMessages.length, isTyping]);

  /* Mark as read on open */
  useEffect(() => {
    if (!activeConvId) return;
    setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, unread: 0 } : c));
  }, [activeConvId]);

  /* Simulate "them is typing" after user sends a message */
  const simulateTyping = useCallback(() => {
    setIsTyping(true);
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => setIsTyping(false), delay);
  }, []);

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  const filteredConvs = conversations.filter(c => {
    const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab =
      activeTab === 'all'    ? true :
      activeTab === 'unread' ? c.unread > 0 :
      activeTab === 'collab' ? (messages[c.id] || []).some(m => m.type === 'collab_request') :
      true;
    return matchSearch && matchTab;
  });

  /* Send text message */
  const sendMessage = () => {
    const text = inputText.trim();
    if (!text || !activeConvId) return;
    const myCount = activeMessages.filter(m => m.sender === 'me' && m.type === 'text').length;
    if (myCount >= RATE_LIMIT) return;

    const msg = {
      id: Date.now(), sender: 'me', text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };
    setMessages(prev => ({ ...prev, [activeConvId]: [...(prev[activeConvId] || []), msg] }));
    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? { ...c, lastMessage: text, lastTime: 'Just now' } : c
    ));
    setInputText('');
    simulateTyping();
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  /* File attach (simulated) */
  const handleFileAttach = e => {
    const file = e.target.files?.[0];
    if (!file || !activeConvId) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const isAudio = ['mp3','wav','flac','aiff','ogg','m4a'].includes(ext);

    if (isAudio) {
      const msg = {
        id: Date.now(), sender: 'me', type: 'audio',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioData: {
          name: file.name,
          duration: '0:00',
          size: `${(file.size / 1048576).toFixed(1)} MB`
        }
      };
      setMessages(prev => ({ ...prev, [activeConvId]: [...(prev[activeConvId] || []), msg] }));
    } else {
      const msg = {
        id: Date.now(), sender: 'me', type: 'file',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fileData: {
          name: file.name,
          size: `${(file.size / 1048576).toFixed(1)} MB`,
          fileType: ['jpg','jpeg','png','gif','webp'].includes(ext) ? 'image' : 'archive'
        }
      };
      setMessages(prev => ({ ...prev, [activeConvId]: [...(prev[activeConvId] || []), msg] }));
    }
    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? { ...c, lastMessage: `📎 ${file.name}`, lastTime: 'Just now' } : c
    ));
    e.target.value = '';
    simulateTyping();
  };

  /* Collab resolution */
  const resolveCollab = (convId, msgId, status) => {
    setMessages(prev => ({
      ...prev,
      [convId]: prev[convId].map(m =>
        m.id === msgId && m.type === 'collab_request'
          ? { ...m, collabData: { ...m.collabData, status } }
          : m
      )
    }));
    const sysText = status === 'accepted'
      ? '🤝 Collaboration accepted! You can now discuss the project details.'
      : status === 'declined'
      ? 'You declined this collaboration request.'
      : null;
    if (sysText) {
      const sys = {
        id: Date.now(), sender: 'system', type: 'system', text: sysText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => ({ ...prev, [convId]: [...prev[convId], sys] }));
    }
    if (status === 'accepted') simulateTyping();
  };

  /* Negotiate collab */
  const negotiateCollab = (convId, msgId, offer) => {
    setMessages(prev => ({
      ...prev,
      [convId]: prev[convId].map(m =>
        m.id === msgId && m.type === 'collab_request'
          ? { ...m, collabData: { ...m.collabData, status: 'negotiating' } }
          : m
      )
    }));
    const counterMsg = {
      id: Date.now(), sender: 'me', type: 'text', text: `Counter-offer: ${offer}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => ({ ...prev, [convId]: [...prev[convId], counterMsg] }));
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, lastMessage: `Counter-offer sent`, lastTime: 'Just now' } : c
    ));
    simulateTyping();
  };

  /* Deal action handler — drives the escrow state machine */
  const handleDealAction = (convId, msgId, action, dealData) => {
    const statusMap = {
      pay:              { status: 'in_escrow',          sysText: `🔒 ${dealData?.amount ? `R${dealData.amount.toLocaleString()}` : 'Funds'} secured in escrow. Work can now begin.` },
      start:            { status: 'work_in_progress',   sysText: '🎵 Seller has started working. Deadline is tracking.' },
      deliver:          { status: 'delivered',          sysText: '📦 Delivery submitted. Review and approve or request revisions.' },
      approve:          { status: 'released',           sysText: `💰 Payment released! ${dealData?.escrow?.payout ? `R${dealData.escrow.payout.toLocaleString()}` : 'Funds'} sent to artist wallet.` },
      revision:         { status: 'revision_requested', sysText: '🔄 Revision requested. Seller has been notified.' },
      dispute:          { status: 'disputed',           sysText: '⚠️ Dispute raised. Our team will review within 48 hours. Funds remain in escrow.' },
      accept_proposal:  { status: 'pending_payment',    sysText: '✅ Deal accepted! Complete payment to move funds into escrow.' },
      decline_proposal: { status: 'cancelled',          sysText: 'Deal declined.' },
    };
    const update = statusMap[action];
    if (!update) return;

    setMessages(prev => ({
      ...prev,
      [convId]: prev[convId].map(m =>
        m.id === msgId && m.type === 'deal'
          ? { ...m, dealData: { ...m.dealData, status: update.status,
              ...(action === 'pay' ? { escrow: { ...m.dealData.escrow, paid: true, paidAt: new Date().toLocaleDateString('en-ZA') } } : {})
            }}
          : m
      )
    }));

    const sys = {
      id: Date.now(), sender: 'system', type: 'system', text: update.sysText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => ({ ...prev, [convId]: [...prev[convId], sys] }));

    const convLabel = {
      pay: '🔒 Funds in escrow',
      deliver: '📦 Delivery submitted',
      approve: '💰 Payment released!',
      dispute: '⚠️ Dispute opened',
    }[action];
    if (convLabel) {
      setConversations(prev => prev.map(c =>
        c.id === convId ? { ...c, lastMessage: convLabel, lastTime: 'Just now' } : c
      ));
    }
    if (['pay', 'accept_proposal'].includes(action)) simulateTyping();
  };

  /* Deal create — sends a deal message */
  const handleDealCreate = dealData => {
    const msg = {
      id: Date.now(), sender: 'me', type: 'deal',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dealData: { ...dealData, dealId: `deal-${Date.now()}` },
    };
    setMessages(prev => ({ ...prev, [activeConvId]: [...(prev[activeConvId] || []), msg] }));
    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? { ...c, lastMessage: `🤝 Deal proposal: ${dealData.projectName}`, lastTime: 'Just now' } : c
    ));
  };

  /* Collab modal send */
  const handleCollabSend = form => {
    const msg = {
      id: Date.now(), sender: 'me', type: 'collab_request',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      collabData: { ...form, status: 'pending' }
    };
    setMessages(prev => ({ ...prev, [activeConvId]: [...(prev[activeConvId] || []), msg] }));
    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? { ...c, lastMessage: '🤝 Collaboration Request sent', lastTime: 'Just now' } : c
    ));
  };

  /* Group messages by date */
  const groupedMessages = activeMessages.reduce((groups, msg) => {
    const date = msg.date || 'Today';
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  const charCount = inputText.length;
  const charNear  = charCount > MAX_CHARS * 0.8;

  /* ── RENDER ─────────────────────────────────────────────────── */
  return (
    <div className="msg-page">

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className="msg-sidebar">

        {/* Header */}
        <div className="msg-sidebar-header">
          <div className="msg-header-top">
            <h2 className="msg-title">
              Messages
              {totalUnread > 0 && <span className="unread-badge">{totalUnread}</span>}
            </h2>
            <button
              className="compose-btn"
              title="New Message"
              onClick={() => setShowCollabModal(true)}
            >
              <Plus size={17} />
            </button>
          </div>

          {/* Search */}
          <div className="msg-search-wrap">
            <Search size={14} className="msg-search-icon" />
            <input
              className="msg-search-input"
              placeholder="Search conversations…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="msg-tabs">
            {[
              { key: 'all',    label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'collab', label: 'Collabs' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`msg-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {tab.key === 'unread' && totalUnread > 0 && (
                  <span className="tab-dot" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Platform notice */}
        <div className="platform-notice">
          <Shield size={11} />
          <span>Artist-only platform. Spam may result in suspension.</span>
        </div>

        {/* Conversation list */}
        <div className="conv-list">
          {filteredConvs.length === 0 ? (
            <div className="conv-empty">No conversations found.</div>
          ) : (
            filteredConvs.map(conv => (
              <ConvItem
                key={conv.id}
                conv={conv}
                active={activeConvId === conv.id}
                onClick={() => setActiveConvId(conv.id)}
              />
            ))
          )}
        </div>

        {/* Sidebar footer */}
        <div className="sidebar-footer-msg">
          <Link to="/music" className="discover-link">
            <Music size={14} className="text-blue" />
            Establish New Connection
            <ChevronRight size={12} className="ml-auto" />
          </Link>
        </div>
      </aside>

      {/* ── Chat Panel ────────────────────────────────────── */}
      <section className="msg-chat">
        {activeConv ? (
          <>
            {/* Chat header */}
            <header className="chat-header">
              <div className="chat-header-left">
                <div className="chat-avatar-wrap">
                  <img src={activeConv.avatar} alt={activeConv.name} className="chat-avatar" />
                  <OnlineDot online={activeConv.online} />
                </div>
                <div className="chat-header-info">
                  <div className="chat-name-row">
                    <span className="chat-name">{activeConv.name}</span>
                    {activeConv.verified && <VerifiedBadge />}
                    <CollabBadge status={activeConv.collabStatus} />
                  </div>
                  <span className="chat-sub">
                    {activeConv.online ? 'Online now' : `Last seen ${activeConv.lastTime}`}
                    {' · '}
                    {activeConv.genre}
                    {' · '}
                    {activeConv.location}
                  </span>
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="chat-action-btn" title="Voice Call">
                  <Phone size={18} />
                </button>
                <button className="chat-action-btn" title="Video Call">
                  <Video size={18} />
                </button>
                <button
                  className="chat-action-btn"
                  title="Request Collaboration"
                  onClick={() => setShowCollabModal(true)}
                >
                  <Handshake size={18} />
                </button>
                <button
                  className={`chat-action-btn ${showInfo ? 'active' : ''}`}
                  title="Profile Info"
                  onClick={() => setShowInfo(v => !v)}
                >
                  <Info size={18} />
                </button>
                <button className="chat-action-btn" title="More Options">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </header>

            {/* Chat body + optional info panel */}
            <div className="chat-body-wrap">
              {/* Messages */}
              <div className="chat-messages">
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    <DateDivider date={date} />
                    {msgs.map(msg => (
                      <MessageBubble
                        key={msg.id}
                        msg={msg}
                        convId={activeConvId}
                        onAcceptCollab={(cid, mid) => resolveCollab(cid, mid, 'accepted')}
                        onDeclineCollab={(cid, mid) => resolveCollab(cid, mid, 'declined')}
                        onNegotiateCollab={negotiateCollab}
                        onDealAction={handleDealAction}
                      />
                    ))}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {/* Info side-panel */}
              {showInfo && (
                <aside className="info-panel">
                  <div className="info-panel-avatar-wrap">
                    <img src={activeConv.avatar} alt="" className="info-panel-avatar" />
                    {activeConv.online && <span className="info-online-label">Online</span>}
                  </div>
                  <p className="info-panel-name">{activeConv.name}</p>
                  <p className="info-panel-genre">{activeConv.genre}</p>
                  <p className="info-panel-location">{activeConv.location}</p>
                  <CollabBadge status={activeConv.collabStatus} />
                  <Link to="/profile" className="info-profile-link">
                    View Full Profile <ChevronRight size={12} />
                  </Link>
                  <div className="info-panel-divider" />
                  <button
                    className="info-collab-btn"
                    onClick={() => { setShowCollabModal(true); setShowInfo(false); }}
                  >
                    <Handshake size={14} /> Send Collab Request
                  </button>
                  <button
                    className="info-deal-btn"
                    onClick={() => { setShowDealModal(true); setShowInfo(false); }}
                  >
                    <DollarSign size={14} /> Create Escrow Deal
                  </button>
                  <button className="info-flag-btn">
                    <Flag size={13} /> Report Artist
                  </button>
                </aside>
              )}
            </div>

            {/* Input area */}
            <div className="chat-input-area">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileAttach}
                accept="*/*"
              />
              <div className="chat-input-row">
                <button
                  className="input-action-btn"
                  title="Attach File"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={18} />
                </button>
                <button
                  className="input-action-btn deal-btn-inline"
                  title="Create Escrow Deal"
                  onClick={() => setShowDealModal(true)}
                >
                  <DollarSign size={18} />
                </button>
                <button
                  className="input-action-btn collab-btn-inline"
                  title="Send Collaboration Request"
                  onClick={() => setShowCollabModal(true)}
                >
                  <Handshake size={18} />
                </button>
                <div className="chat-input-wrap">
                  <textarea
                    ref={inputRef}
                    className="chat-input"
                    placeholder="Enter message for broadcast…"
                    value={inputText}
                    onChange={e => setInputText(e.target.value.slice(0, MAX_CHARS))}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <button className="emoji-btn" title="Emoji">
                    <Smile size={16} />
                  </button>
                </div>
                <button
                  className={`send-btn ${inputText.trim() ? 'send-btn-active' : ''}`}
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                >
                  <Send size={17} />
                </button>
              </div>
              {charNear && (
                <div className="char-counter">
                  <span style={{ color: charCount >= MAX_CHARS ? '#ef4444' : 'var(--text-muted)' }}>
                    {charCount}/{MAX_CHARS}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="chat-empty-state">
            <MessageSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </section>

      {/* Collab modal */}
      {showCollabModal && (
        <CollabModal
          artistName={activeConv?.name || 'Artist'}
          onClose={() => setShowCollabModal(false)}
          onSend={form => {
            handleCollabSend(form);
            setShowCollabModal(false);
          }}
        />
      )}

      {/* Deal modal */}
      {showDealModal && (
        <CreateDealModal
          artistName={activeConv?.name || 'Artist'}
          onClose={() => setShowDealModal(false)}
          onSend={dealData => {
            handleDealCreate(dealData);
            setShowDealModal(false);
          }}
        />
      )}

      {/* DealCard styles */}
      <DealCard.Styles />

      {/* ── Styles ──────────────────────────────────────────── */}
      <style>{`
        .msg-page {
          display: flex;
          height: calc(100vh - 80px);
          overflow: hidden;
          background-color: var(--bg-city);
          margin: -2rem;
        }

        /* ── Sidebar — Media Contacts ────────────────── */
        .msg-sidebar {
          width: 380px;
          min-width: 380px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border-light);
          background: #fff;
          overflow: hidden;
          box-shadow: 10px 0 30px rgba(0,0,0,0.02);
        }

        .msg-sidebar-header {
          padding: 2.5rem 2rem 1.5rem;
          border-bottom: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .msg-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .msg-title {
          font-size: 2.25rem;
          font-weight: 950;
          letter-spacing: -0.04em;
          color: #000;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .unread-badge {
          background: var(--accent-blue);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .compose-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--bg-city);
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          transition: var(--transition-base);
        }
        .compose-btn:hover {
          background: var(--accent-blue);
          color: #fff;
          border-color: var(--accent-blue);
        }

        .msg-search-wrap {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .msg-search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-dim);
          pointer-events: none;
        }

        .msg-search-input {
          width: 100%;
          background: var(--bg-city);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 0.85rem 1rem 0.85rem 3rem;
          color: #000;
          font-size: 0.9rem;
          font-weight: 700;
          outline: none;
          transition: var(--transition-base);
        }
        .msg-search-input:focus { border-color: var(--accent-blue); background: #fff; }

        .msg-tabs { display: flex; gap: 1rem; }
        .msg-tab-btn {
          padding: 0.5rem 0;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-dim);
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: var(--transition-base);
        }
        .msg-tab-btn.active { color: var(--accent-blue); border-bottom-color: var(--accent-blue); }

        .platform-notice {
          padding: 0.75rem 2rem;
          background: rgba(0, 112, 243, 0.03);
          border-bottom: 1px solid var(--border-light);
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--accent-blue);
          display: flex; align-items: center; gap: 8px;
        }

        .conv-list { flex: 1; overflow-y: auto; }
        .conv-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem 2rem;
          background: #fff;
          border: none; border-bottom: 1px solid var(--border-light);
          cursor: pointer; transition: var(--transition-base);
          text-align: left;
        }
        .conv-item:hover { background: var(--bg-city); }
        .conv-item-active { background: rgba(0, 112, 243, 0.02) !important; border-left: 4px solid var(--accent-blue); }

        .conv-avatar-wrap { position: relative; }
        .conv-avatar { width: 48px; height: 48px; border-radius: 12px; object-fit: cover; }
        .online-dot { 
          position: absolute; bottom: -2px; right: -2px; 
          width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; 
        }
        .online-dot.is-online { background: var(--accent-emerald); }
        .online-dot.is-offline { background: var(--text-dim); }

        .conv-info { flex: 1; min-width: 0; }
        .conv-name-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .conv-name { font-size: 1rem; font-weight: 900; color: #000; display: flex; align-items: center; gap: 6px; }
        .conv-time { font-size: 0.75rem; font-weight: 700; color: var(--text-dim); }
        .conv-last { font-size: 0.85rem; font-weight: 700; color: var(--text-gray); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
        .conv-unread { background: var(--accent-blue); color: #fff; font-size: 0.65rem; font-weight: 950; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

        /* ── Chat Panel — High Precision ────────────────── */
        .msg-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-city);
        }

        .chat-header {
          padding: 1.5rem 3rem;
          background: #fff;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          z-index: 10;
        }
        .chat-header-left { display: flex; align-items: center; gap: 1.5rem; }
        .chat-avatar { width: 56px; height: 56px; border-radius: 14px; object-fit: cover; }
        .chat-name { font-size: 1.5rem; font-weight: 950; color: #000; letter-spacing: -0.03em; }
        .chat-sub { font-size: 0.8rem; font-weight: 700; color: var(--text-dim); }
        .chat-header-actions { display: flex; gap: 0.5rem; }
        .chat-action-btn { 
          width: 44px; height: 44px; border-radius: 10px; background: var(--bg-city);
          color: var(--text-dim); display: flex; align-items: center; justify-content: center;
          transition: var(--transition-base);
        }
        .chat-action-btn:hover { background: var(--accent-blue); color: #fff; }

        .chat-body-wrap { flex: 1; display: flex; overflow: hidden; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 4rem 3rem; display: flex; flex-direction: column; gap: 1.5rem; }

        /* ── Message Bubbles ────────────────────────────── */
        .msg-row { display: flex; flex-direction: column; gap: 6px; }
        .msg-row-me { align-items: flex-end; }
        .msg-row-them { align-items: flex-start; }

        .msg-bubble {
          max-width: 650px;
          padding: 1.25rem 1.75rem;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.6;
        }
        .msg-bubble-me {
          background: var(--accent-blue);
          color: #fff;
          border-radius: 20px 20px 0 20px;
          box-shadow: 0 10px 30px rgba(0, 112, 243, 0.15);
        }
        .msg-bubble-them {
          background: #fff;
          color: #000;
          border-radius: 20px 20px 20px 0;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-card);
        }
        .msg-time { font-size: 0.7rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 8px; }
        .seen-icon { color: var(--accent-blue); }

        /* Helpers */
        .date-divider { display: flex; align-items: center; gap: 2rem; margin: 3rem 0; }
        .date-divider::before, .date-divider::after { content: ''; flex: 1; height: 1px; background: var(--border-light); }
        .date-divider span { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: var(--text-dim); background: var(--bg-city); padding: 0 1rem; }

        .sys-msg {
          align-self: center; background: #fff; border: 1px solid var(--border-light);
          padding: 0.6rem 1.5rem; border-radius: 99px; font-size: 0.75rem; font-weight: 900;
          color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px;
        }

        /* ── Input Area ─────────────────────────────────── */
        .chat-input-area {
          padding: 2rem 3rem 3rem;
          background: #fff;
          border-top: 1px solid var(--border-light);
        }
        .chat-input-row { display: flex; align-items: center; gap: 1rem; }
        .chat-input-wrap {
          flex: 1; background: var(--bg-city); border: 1px solid var(--border-light);
          border-radius: 12px; display: flex; align-items: center; padding: 0 1rem;
        }
        .chat-input {
          flex: 1; background: none; border: none; padding: 1.25rem 0.5rem;
          font-size: 1rem; font-weight: 700; outline: none; color: #000; resize: none;
        }
        .input-action-btn {
          width: 44px; height: 44px; border-radius: 10px; background: none; border: none;
          color: var(--text-dim); cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: var(--transition-base);
        }
        .input-action-btn:hover { background: var(--bg-city); color: var(--accent-blue); }
        
        .send-btn {
          width: 50px; height: 50px; border-radius: 12px; background: var(--border-light);
          color: #fff; display: flex; align-items: center; justify-content: center; border: none;
        }
        .send-btn-active { background: var(--accent-blue); box-shadow: 0 10px 25px rgba(0, 112, 243, 0.25); cursor: pointer; }

        /* ── Specialized Bubbles ────────────────────────── */
        .file-bubble, .audio-bubble {
          padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-light); background: #fff;
          display: flex; gap: 1.5rem; align-items: center; min-width: 320px;
        }
        .audio-play-btn { 
          width: 44px; height: 44px; background: var(--accent-blue); color: #fff; 
          border: none; border-radius: 10px; display: flex; align-items: center; justify-content: center;
        }
        .audio-waveform { display: flex; align-items: center; gap: 3px; height: 30px; flex: 1; }
        .waveform-bar { width: 3px; height: 10px; background: var(--border-light); border-radius: 2px; }
        .waveform-bar.waveform-active { background: var(--accent-blue); }

        .cr-card {
          background: #fff; border: 1px solid var(--border-light); border-radius: 20px; padding: 2rem;
          display: flex; flex-direction: column; gap: 1.5rem; box-shadow: var(--shadow-card);
        }
        .cr-label { 
          font-size: 0.7rem; font-weight: 950; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-blue); 
          background: rgba(0, 112, 243, 0.05); padding: 4px 10px; border-radius: 4px;
        }
        .cr-project { font-size: 1.25rem; font-weight: 950; color: #000; letter-spacing: -0.03em; }
        .cr-detail-label { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: var(--text-dim); }
        .cr-detail-val { font-size: 0.9rem; font-weight: 900; color: #000; }
        .cr-budget { color: var(--accent-emerald) !important; }
        
        .cr-btn { 
          padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 0.8rem; font-weight: 900; 
          text-transform: uppercase; display: flex; align-items: center; gap: 8px; cursor: pointer;
        }
        .cr-accept { background: var(--accent-emerald); color: #fff; border: none; }
        .cr-negotiate { background: #fff; border: 1px solid var(--border-light); color: var(--text-dim); }
        .cr-decline { background: rgba(255, 0, 112, 0.05); color: var(--accent-magenta); border: none; }

        /* Info panel side bar */
        .info-panel {
          width: 380px; background: #fff; border-left: 1px solid var(--border-light);
          display: flex; flex-direction: column; align-items: center; padding: 4rem 2.5rem;
          box-shadow: -10px 0 30px rgba(0,0,0,0.02);
        }
        .info-panel-avatar { width: 120px; height: 120px; border-radius: 32px; object-fit: cover; margin-bottom: 2rem; }
        .info-panel-name { font-size: 1.75rem; font-weight: 950; color: #000; margin-bottom: 4px; }
        .info-panel-genre { font-size: 1rem; font-weight: 700; color: var(--text-dim); }
        .info-panel-divider { width: 100%; height: 1px; background: var(--border-light); margin: 2.5rem 0; }
        
        .info-collab-btn { 
          width: 100%; background: var(--accent-blue); color: #fff; padding: 1.25rem; 
          border-radius: 12px; font-weight: 950; text-transform: uppercase; letter-spacing: 0.05em;
          box-shadow: 0 10px 25px rgba(0, 112, 243, 0.2); margin-bottom: 1rem;
        }
        .info-deal-btn {
          width: 100%; background: #fff; border: 1px solid var(--border-light); padding: 1.25rem;
          border-radius: 12px; font-weight: 950; text-transform: uppercase; color: var(--text-dim);
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;
