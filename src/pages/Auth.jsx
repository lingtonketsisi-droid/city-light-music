import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]       = useState('login');   // 'login' | 'signup'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const reset = () => { setError(null); setSuccess(null); };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    reset();

    if (mode === 'signup') {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Account created! Check your email to confirm, then log in.');
        setMode('login');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      {/* Background blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="auth-container">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon"><Music size={20} color="#fff" /></div>
          <div>
            <p className="auth-logo-brand">CITY LIGHT</p>
            <p className="auth-logo-sub">MEDIA</p>
          </div>
        </Link>

        {/* Card */}
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Tab toggle */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); reset(); }}>
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); reset(); }}>
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={mode}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}>

              <h1 className="auth-heading">
                {mode === 'login' ? 'Welcome back' : 'Join City Light Media'}
              </h1>
              <p className="auth-subheading">
                {mode === 'login'
                  ? 'Sign in to your artist account'
                  : 'Start distributing your music globally'}
              </p>

              <form className="auth-form" onSubmit={handleSubmit}>

                {/* Email */}
                <div className="auth-field">
                  <label className="auth-label">Email address</label>
                  <div className="auth-input-wrap">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      className="auth-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="auth-field">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      className="auth-input"
                      type={showPw ? 'text' : 'password'}
                      placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    />
                    <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(p => !p)}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="auth-error">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="auth-success">
                    <CheckCircle size={14} />
                    <span>{success}</span>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading
                    ? <><Loader2 size={16} className="auth-spin" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                    : <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>}
                </button>
              </form>

              {mode === 'login' && (
                <p className="auth-footer-note">
                  Don't have an account?{' '}
                  <button className="auth-switch-link" onClick={() => { setMode('signup'); reset(); }}>
                    Sign up free
                  </button>
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <p className="auth-bottom-note">
          By continuing you agree to our{' '}
          <Link to="/legal" className="auth-legal-link">Terms of Service</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          background: var(--bg-city);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        /* Ambient blobs */
        .auth-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.12;
          pointer-events: none;
        }
        .auth-blob-1 {
          width: 500px; height: 500px;
          background: var(--accent-blue);
          top: -100px; left: -100px;
        }
        .auth-blob-2 {
          width: 400px; height: 400px;
          background: #a78bfa;
          bottom: -80px; right: -60px;
        }

        .auth-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
        }

        /* Logo */
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }
        .auth-logo-icon {
          width: 40px; height: 40px;
          background: var(--accent-blue);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 20px rgba(22,119,255,0.3);
        }
        .auth-logo-brand {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          color: var(--text-main);
          line-height: 1;
        }
        .auth-logo-sub {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.28em;
          color: var(--text-muted);
        }

        /* Card */
        .auth-card {
          width: 100%;
          background: #fff;
          border-radius: 24px;
          border: 1px solid rgba(15,23,42,0.06);
          box-shadow: 0 8px 40px rgba(15,23,42,0.1);
          padding: 2.5rem;
        }

        /* Tabs */
        .auth-tabs {
          display: flex;
          background: var(--bg-elevated);
          border-radius: 12px;
          padding: 0.3rem;
          margin-bottom: 2rem;
        }
        .auth-tab {
          flex: 1;
          padding: 0.55rem;
          border-radius: 9px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
        }
        .auth-tab.active {
          background: #fff;
          color: var(--accent-blue);
          box-shadow: 0 2px 8px rgba(15,23,42,0.08);
        }

        .auth-heading {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--text-main);
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.02em;
          margin-bottom: 0.3rem;
        }
        .auth-subheading {
          font-size: 0.875rem;
          color: var(--text-gray);
          margin-bottom: 2rem;
        }

        /* Form */
        .auth-form { display: flex; flex-direction: column; gap: 1rem; }
        .auth-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .auth-label { font-size: 0.8rem; font-weight: 700; color: var(--text-main); }

        .auth-input-wrap {
          display: flex;
          align-items: center;
          background: var(--bg-city);
          border: 1.5px solid rgba(15,23,42,0.1);
          border-radius: 12px;
          padding: 0 1rem;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .auth-input-wrap:focus-within {
          border-color: rgba(22,119,255,0.35);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(22,119,255,0.06);
        }
        .auth-input-icon { color: var(--text-muted); flex-shrink: 0; }
        .auth-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 0.75rem 0.6rem;
          font-size: 0.875rem;
          color: var(--text-main);
          font-family: inherit;
        }
        .auth-input::placeholder { color: var(--text-muted); }
        .auth-pw-toggle {
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          transition: color 0.15s ease;
        }
        .auth-pw-toggle:hover { color: var(--text-main); }

        /* Error / Success */
        .auth-error, .auth-success {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.82rem;
          line-height: 1.4;
        }
        .auth-error   { background: rgba(239,68,68,0.07);  color: #dc2626; border: 1px solid rgba(239,68,68,0.15); }
        .auth-success { background: rgba(34,197,94,0.07);  color: #16a34a; border: 1px solid rgba(34,197,94,0.15); }

        /* Submit */
        .auth-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.85rem;
          background: var(--accent-blue);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 4px 14px rgba(22,119,255,0.25);
          margin-top: 0.5rem;
        }
        .auth-submit:hover:not(:disabled) { background: #0060d0; transform: translateY(-1px); }
        .auth-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .auth-footer-note {
          margin-top: 1.25rem;
          text-align: center;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .auth-switch-link {
          color: var(--accent-blue);
          font-weight: 700;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .auth-switch-link:hover { text-decoration: underline; }

        .auth-bottom-note {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
        }
        .auth-legal-link {
          color: var(--accent-blue);
          font-weight: 600;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .auth-spin { animation: spin 0.9s linear infinite; }
      `}</style>
    </div>
  );
};

export default AuthPage;
