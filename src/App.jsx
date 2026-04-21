import { Routes, Route, useLocation } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { AuthProvider } from './context/AuthContext';
import Shell from './components/layout/Shell';
import StickyPlayer from './components/player/StickyPlayer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home          from './pages/Home';
import MusicPage     from './pages/Music';
import VideosPage    from './pages/Videos';
import PodcastsPage  from './pages/Podcasts';
import ArtistDashboard from './pages/Dashboard';
import UploadRelease from './pages/Upload';
import ArtistProfile from './pages/ArtistProfile';
import ReleaseDetail from './pages/ReleaseDetail';
import Royalties     from './pages/Royalties';
import AdminDashboard from './pages/AdminDashboard';
import NewsPage      from './pages/News';
import MessagesPage  from './pages/Messages';
import Wallet        from './pages/Wallet';
import Legal         from './pages/Legal';
import SearchPage     from './pages/Search';
import AuthPage       from './pages/Auth';
import PlaylistsPage  from './pages/Playlists';

const ContentUpload = () => (
  <div className="p-10 fade-in text-center">
    <h1 className="text-4xl mb-2">Content Upload</h1>
    <p className="text-gray mb-4">Choose what you want to share with your fans on the City Light Media discovery platform.</p>
    <div className="flex justify-center gap-2 mt-4">
      <div className="glass p-4 rounded-2xl w-80 cursor-pointer card-hover">
        <h2 className="text-2xl gold-gradient-text mb-1">Music Video</h2>
        <p className="text-sm text-gray">Upload cinematic 4K videos to your profile.</p>
      </div>
      <div className="glass p-4 rounded-2xl w-80 cursor-pointer card-hover">
        <h2 className="text-2xl gold-gradient-text mb-1">Podcast Episode</h2>
        <p className="text-sm text-gray">Share your stories and insights via audio.</p>
      </div>
    </div>
  </div>
);

const App = () => {
  const location = useLocation();

  return (
    <AuthProvider>
      <PlayerProvider>

        {/* ── /auth is standalone (outside Shell) ── */}
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          {/* All other routes live inside Shell */}
          <Route path="*" element={
            <Shell>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/"               element={<Home />} />
                  <Route path="/music"          element={<MusicPage />} />
                  <Route path="/search"         element={<SearchPage />} />
                  <Route path="/videos"         element={<VideosPage />} />
                  <Route path="/podcasts"       element={<PodcastsPage />} />
                  <Route path="/playlists"      element={<PlaylistsPage />} />
                  <Route path="/playlist/:id"   element={<PlaylistsPage />} />
                  <Route path="/news"           element={<NewsPage />} />
                  <Route path="/legal"          element={<Legal />} />
                  <Route path="/profile"        element={<ArtistProfile />} />
                  <Route path="/profile/:id"    element={<ArtistProfile />} />
                  <Route path="/release/:type/:id" element={<ReleaseDetail />} />

                  {/* ── Protected routes — require auth ── */}
                  <Route path="/dashboard"      element={<ProtectedRoute><ArtistDashboard /></ProtectedRoute>} />
                  <Route path="/upload"         element={<ProtectedRoute><UploadRelease /></ProtectedRoute>} />
                  <Route path="/royalties"      element={<ProtectedRoute><Royalties /></ProtectedRoute>} />
                  <Route path="/messages"       element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
                  <Route path="/wallet"         element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                  <Route path="/admin"          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/content-upload" element={<ProtectedRoute><ContentUpload /></ProtectedRoute>} />
                </Routes>
              </AnimatePresence>
            </Shell>
          } />
        </Routes>

        <StickyPlayer />
      </PlayerProvider>
    </AuthProvider>
  );
};

export default App;
