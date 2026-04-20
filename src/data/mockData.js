/* ─────────────────────────────────────────────────────────────
   CITY LIGHT MEDIA — GLOBAL MOCK DATA REGISTRY
   This file provides the necessary structures for the application
   to render without errors during the migration to live data.
───────────────────────────────────────────────────────────── */

export const STATUSES = {
  PENDING: 'Pending',
  LIVE: 'Live',
  REVIEW: 'In Review',
  REJECTED: 'Rejected',
  DRAFT: 'Draft',
  PROCESSING: 'Processing',
  TAKEN_DOWN: 'Removed'
};

// Distribution & Releases
export const MOCK_RELEASES = [];
export const MOCK_MUSIC = [];
export const MOCK_VIDEOS = [];
export const MOCK_PODCASTS = [];
export const MOCK_RECENTLY_UPLOADED = [];
export const MOCK_HOT_THIS_WEEK = [];
export const MOCK_EDITORIAL_PICKS = [];
export const MOCK_TRENDING = [];

// Artists & Profiles
export const MOCK_ARTISTS = [];
export const MOCK_FEATURED_ARTISTS = [];
export const MOCK_COLLAB_REQUESTS = [];

// Operations & Admin
export const MOCK_ADMIN_COLLABS = [];
export const MOCK_DEALS = [];
export const MOCK_NEWS = [];
export const MOCK_NOTIFICATIONS = [];

// Messaging
export const MOCK_CONVERSATIONS = [];
export const MOCK_DM_MESSAGES = {};

// Wallet & Finance
export const MOCK_WALLET = {
  available: 'R0.00',
  pending: 'R0.00',
  onHold: 'R0.00',
  lifetime: 'R0.00'
};
export const MOCK_TRANSACTIONS = [];
export const MOCK_PAYOUT_METHODS = [];
export const MOCK_WITHDRAWALS = [];

/* ─────────────────────────────────────────────────────────────
   DEFAULT EXPORT (for legacy imports)
───────────────────────────────────────────────────────────── */
export default {
  STATUSES,
  MOCK_RELEASES,
  MOCK_MUSIC,
  MOCK_VIDEOS,
  MOCK_PODCASTS,
  MOCK_RECENTLY_UPLOADED,
  MOCK_HOT_THIS_WEEK,
  MOCK_EDITORIAL_PICKS,
  MOCK_TRENDING,
  MOCK_ARTISTS,
  MOCK_FEATURED_ARTISTS,
  MOCK_COLLAB_REQUESTS,
  MOCK_ADMIN_COLLABS,
  MOCK_DEALS,
  MOCK_NEWS,
  MOCK_NOTIFICATIONS,
  MOCK_CONVERSATIONS,
  MOCK_DM_MESSAGES,
  MOCK_WALLET,
  MOCK_TRANSACTIONS,
  MOCK_PAYOUT_METHODS,
  MOCK_WITHDRAWALS
};
