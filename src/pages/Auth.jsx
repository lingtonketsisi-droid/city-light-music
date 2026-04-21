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
  const [username, setUsername] = useState('');
  const [artistName, setArtistName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const reset = () => { 
    setError(null); 
    setSuccess(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setArtistName('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    reset();

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const { error } = await signUp(email, password, {
        username,
        display_name: artistName
      });

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

                {mode === 'signup' && (
                  <>
                    {/* Username */}
                    <div className="auth-field">
                      <label className="auth-label">Username</label>
                      <div className="auth-input-wrap">
                        <Mail size={16} className="auth-input-icon" />
                        <input
                          className="auth-input"
                          type="text"
                          placeholder="urban_vibe"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Artist Name */}
                    <div className="auth-field">
                      <label className="auth-label">Artist/Stage Name</label>
                      <div className="auth-input-wrap">
                        <Music size={16} className="auth-input-icon" />
                        <input
                          className="auth-input"
                          type="text"
                          placeholder="Urban Pulse"
                          value={artistName}
                          onChange={e => setArtistName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

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

                {mode === 'signup' && (
                  /* Confirm Password */
                  <div className="auth-field">
                    <label className="auth-label">Confirm Password</label>
                    <div className="auth-input-wrap">
                      <Lock size={16} className="auth-input-icon" />
                      <input
                        className="auth-input"
                        type={showPw ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                )}

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
          filter: blur(100px);
          opacity: 0.15;
          pointer-events: none;
        }
        .auth-blob-1 {
          width: 500px; height: 500px;
          background: var(--accent-blue);
          top: -100px; left: -100px;
        }
        .auth-blob-2 {
          width: 400px; height: 400px;
          background: var(--accent-magenta);
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
          box-shadow: 0 6px 20px rgba(0, 112, 243, 0.4);
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

        /* Card - Switched to Premium Dark */
        .auth-card {
          width: 100%;
          background: var(--bg-panel);
          border-radius: 28px;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-premium);
          padding: 2.5rem;
          backdrop-filter: blur(20px);
        }

        /* Tabs */
        .auth-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 14px;
          padding: 0.35rem;
          margin-bottom: 2.5rem;
          border: 1px solid var(--border-subtle);
        }
        .auth-tab {
          flex: 1;
          padding: 0.65rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
        }
        .auth-tab.active {
          background: var(--bg-elevated);
          color: #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-light);
        }

        .auth-heading {
          font-size: 1.75rem;
          font-weight: 900;
          color: var(--text-main);
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.02em;
          margin-bottom: 0.3rem;
        }
        .auth-subheading {
          font-size: 0.9rem;
          color: var(--text-gray);
          margin-bottom: 2.5rem;
        }

        /* Form */
        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .auth-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .auth-label { 
          font-size: 0.75rem; 
          font-weight: 800; 
          color: var(--text-muted); 
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-left: 0.25rem;
        }

        .auth-input-wrap {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          border: 1.5px solid var(--border-light);
          border-radius: 14px;
          padding: 0 1.1rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-input-wrap:focus-within {
          border-color: var(--accent-blue);
          background: rgba(0, 0, 0, 0.3);
          box-shadow: 0 0 0 4px rgba(0, 112, 243, 0.15);
        }
        .auth-input-icon { color: var(--text-dim); flex-shrink: 0; }
        .auth-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 0.9rem 0.75rem;
          font-size: 0.95rem;
          color: #FFFFFF !important;  /* Force white text */
          font-family: inherit;
          caret-color: var(--accent-blue);
        }
        .auth-input::placeholder { color: var(--text-muted); transition: opacity 0.2s; }
        .auth-input:focus::placeholder { opacity: 0.5; }

        /* Chrome Autofill fix */
        .auth-input:-webkit-autofill,
        .auth-input:-webkit-autofill:hover, 
        .auth-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #FFFFFF !important;
          -webkit-box-shadow: 0 0 0px 1000px #000000 inset !important;
          transition: background-color 5000s ease-in-out 0s;
          border-radius: inherit;
        }

        .auth-pw-toggle {
          color: var(--text-dim);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          transition: color 0.15s ease;
        }
        .auth-pw-toggle:hover { color: var(--text-main); }

        /* Error / Success */
        .auth-error, .auth-success {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding: 0.85rem 1.1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1.4;
        }
        .auth-error   { background: rgba(239,68,68,0.08);  color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
        .auth-success { background: rgba(34,197,94,0.08);  color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }

        /* Submit */
        .auth-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          padding: 1rem;
          background: var(--accent-blue);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 8px 20px rgba(0, 112, 243, 0.3);
          margin-top: 0.75rem;
          letter-spacing: 0.01em;
        }
        .auth-submit:hover:not(:disabled) { 
          background: #0060d0; 
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 112, 243, 0.4);
        }
        .auth-submit:active:not(:disabled) { transform: translateY(0); }
        .auth-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-footer-note {
          margin-top: 1.75rem;
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .auth-switch-link {
          color: var(--accent-blue);
          font-weight: 800;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-left: 0.25rem;
        }
        .auth-switch-link:hover { text-decoration: underline; color: #38bdf8; }

        .auth-bottom-note {
          font-size: 0.75rem;
          color: var(--text-dim);
          text-align: center;
          opacity: 0.8;
        }
        .auth-legal-link {
          color: var(--text-muted);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .auth-legal-link:hover { color: var(--text-main); }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .auth-spin { animation: spin 0.9s linear infinite; }
      `}</style>
    </div>
  );
};

export default AuthPage;
