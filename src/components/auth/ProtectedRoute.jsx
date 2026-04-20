import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute
 * Wraps a page component and redirects to /auth if the user is not signed in.
 * Shows a spinner while the auth state is still loading from Supabase.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        flexDirection: 'column',
        gap: '1rem',
        color: 'var(--text-muted)',
      }}>
        <Loader2 size={28} style={{ animation: 'spin 0.9s linear infinite' }} />
        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Checking session…</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    // Preserve the page they were trying to reach so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
