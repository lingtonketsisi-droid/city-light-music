import { useState, useRef } from 'react';
import {
  Upload, Music, CheckCircle, ArrowRight, ArrowLeft,
  Globe, Shield, Info, Plus, X, Sparkles, AlertCircle, Loader2,
  FileAudio, Image as ImageIcon, Check, ChevronRight, Video, FileVideo
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const STEPS = [
  { n: 1, label: 'Media' },
  { n: 2, label: 'Details' },
  { n: 3, label: 'Finish' },
];

const STORAGE_BUCKET_AUDIO = 'audio-uploads';
const STORAGE_BUCKET_VIDEO = 'video-uploads';

const ProgressBar = ({ label, pct, color = 'var(--accent-blue)' }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray mb-1.5 px-1">
      <span>{label}</span>
      <span>{Math.round(pct)}%</span>
    </div>
    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-light">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        className="h-full rounded-full"
        style={{ background: color, boxShadow: `0 0 10px ${color}44` }}
      />
    </div>
  </div>
);

const UploadRelease = () => {
  const [uploadType, setUploadType] = useState('audio'); // 'audio' or 'video'
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    artistName: '',
    genre: 'Electronic',
    releaseDate: new Date().toISOString().split('T')[0],
    isExplicit: false,
    confirmedRights: false,
  });

  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState({ audio: 0, cover: 0, video: 0, db: 0 });
  const [error, setError] = useState(null);

  const audioRef = useRef();
  const coverRef = useRef();
  const videoRef = useRef();

  const set = patch => setForm(f => ({ ...f, ...patch }));

  const resetForm = () => {
    setAudioFile(null);
    setCoverFile(null);
    setVideoFile(null);
    setForm({
      title: '', artistName: '', genre: 'Electronic',
      releaseDate: new Date().toISOString().split('T')[0],
      isExplicit: false, confirmedRights: false,
    });
    setStep(1);
  };

  const uploadFile = async (bucket, path, file, key) => {
    let fake = 0;
    const interval = setInterval(() => {
      fake = Math.min(fake + 5, 95);
      setProgress(p => ({ ...p, [key]: fake }));
    }, 150);

    const { data, error: uErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true, contentType: file.type });

    clearInterval(interval);
    if (uErr) throw new Error(`${key.toUpperCase()} Upload: ${uErr.message}`);

    setProgress(p => ({ ...p, [key]: 100 }));
    return data.path;
  };

  const getPublicUrl = (bucket, path) => {
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!form.confirmedRights) {
      setError("Please confirm you own the rights to this content.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setProgress({ audio: 0, cover: 0, video: 0, db: 0 });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Authentication required');
      const userId = session.user.id;

      if (uploadType === 'audio') {
        const audioPath = audioFile
          ? await uploadFile(STORAGE_BUCKET_AUDIO, `${userId}/tracks/${Date.now()}-${audioFile.name}`, audioFile, 'audio')
          : null;

        const coverPath = coverFile
          ? await uploadFile(STORAGE_BUCKET_AUDIO, `${userId}/cover/${Date.now()}_${coverFile.name}`, coverFile, 'cover')
          : null;

        const audioUrl = audioPath ? getPublicUrl(STORAGE_BUCKET_AUDIO, audioPath) : null;
        const coverUrl = coverPath ? getPublicUrl(STORAGE_BUCKET_AUDIO, coverPath) : null;

        setProgress(p => ({ ...p, db: 30 }));

        const { data: release, error: rErr } = await supabase
          .from('releases')
          .insert({
            user_id: userId,
            title: form.title || 'Untitled Release',
            cover_url: coverUrl,
            release_date: form.releaseDate,
          })
          .select().single();

        if (rErr) throw new Error(`Database (Release): ${rErr.message}`);
        setProgress(p => ({ ...p, db: 70 }));

        const { error: tErr } = await supabase
          .from('tracks')
          .insert({
            release_id: release.id,
            title: form.title || 'Untitled Track',
            audio_url: audioUrl,
            audio_path: audioPath,
          });

        if (tErr) throw new Error(`Database (Track): ${tErr.message}`);
      } else {
        const videoPath = videoFile
          ? await uploadFile(STORAGE_BUCKET_VIDEO, `${userId}/videos/${Date.now()}-${videoFile.name}`, videoFile, 'video')
          : null;

        const videoUrl = videoPath ? getPublicUrl(STORAGE_BUCKET_VIDEO, videoPath) : null;
        setProgress(p => ({ ...p, db: 50 }));

        const { error: vErr } = await supabase
          .from('videos')
          .insert({
            user_id: userId,
            title: form.title || 'Untitled Video',
            artist_name: form.artistName || 'Unknown Artist',
            video_url: videoUrl,
            video_path: videoPath,
          });

        if (vErr) throw new Error(`Database (Video): ${vErr.message}`);
      }

      setProgress(p => ({ ...p, db: 100 }));
      setStep(4);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderSteps = () => (
    <div className="flex items-center justify-between mb-12 max-w-md mx-auto relative px-4 text-center">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-10" />
      {STEPS.map((s) => (
        <div key={s.n} className="flex flex-col items-center gap-2 bg-[var(--bg-city)] px-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
            step === s.n 
              ? 'bg-accent-blue border-accent-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.5)]' 
              : step > s.n 
                ? 'bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                : 'bg-black/20 border-white/10 text-gray-400 shadow-inner'
          }`}>
            {step > s.n ? <Check size={18} /> : s.n}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            step === s.n ? 'text-accent-blue' : 'text-gray-400'
          }`}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fade-in max-w-4xl mx-auto py-6">
      {step < 4 && (
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Global Distribution</h1>
          <p className="text-gray text-lg">Upload your content once, reach fans everywhere.</p>
        </div>
      )}

      {step < 4 && (
        <div className="flex justify-center gap-4 mb-10">
          <button 
            className={`px-6 py-2 rounded-full font-bold transition-all border ${uploadType === 'audio' ? 'bg-accent-blue text-white border-accent-blue shadow-[0_0_15px_rgba(0,112,243,0.3)]' : 'bg-black/20 text-gray-400 border-white/10 hover:bg-white/5'}`}
            onClick={() => { setUploadType('audio'); resetForm(); }}
          >
            <Music size={16} className="inline mr-2" /> Audio Release
          </button>
          <button 
            className={`px-6 py-2 rounded-full font-bold transition-all border ${uploadType === 'video' ? 'bg-accent-magenta text-white border-accent-magenta shadow-[0_0_15px_rgba(255,0,128,0.3)]' : 'bg-black/20 text-gray-400 border-white/10 hover:bg-white/5'}`}
            onClick={() => { setUploadType('video'); resetForm(); }}
          >
            <Video size={16} className="inline mr-2" /> Music Video
          </button>
        </div>
      )}

      {step < 4 && renderSteps()}

      <div className="glass-v2 p-8 shadow-premium rounded-[32px] overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {uploadType === 'audio' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Audio Upload */}
                  <div 
                    className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer group flex flex-col items-center justify-center gap-4 ${
                      audioFile ? 'border-accent-blue bg-accent-blue/10' : 'border-white/10 hover:border-accent-blue hover:bg-white/5'
                    }`}
                    onClick={() => audioRef.current.click()}
                  >
                    <input ref={audioRef} type="file" hidden accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} />
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      audioFile ? 'bg-accent-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.5)]' : 'bg-white/5 text-gray-400 group-hover:scale-110'
                    }`}>
                      {audioFile ? <Check size={32} /> : <FileAudio size={32} />}
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{audioFile ? 'Audio Ready' : 'Select Audio'}</h3>
                      <p className="text-xs text-gray mt-1">
                        {audioFile ? audioFile.name : 'MP3, WAV, or FLAC'}
                      </p>
                    </div>
                  </div>

                  {/* Cover Upload */}
                  <div 
                    className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer group flex flex-col items-center justify-center gap-4 ${
                      coverFile ? 'border-accent-blue bg-accent-blue/10' : 'border-white/10 hover:border-accent-blue hover:bg-white/5'
                    }`}
                    onClick={() => coverRef.current.click()}
                  >
                    <input ref={coverRef} type="file" hidden accept="image/*" onChange={e => setCoverFile(e.target.files[0])} />
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      coverFile ? 'bg-accent-blue text-white shadow-[0_0_15px_rgba(0,112,243,0.5)]' : 'bg-white/5 text-gray-400 group-hover:scale-110'
                    }`}>
                      {coverFile ? <Check size={32} /> : <ImageIcon size={32} />}
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{coverFile ? 'Cover Ready' : 'Select Artwork'}</h3>
                      <p className="text-xs text-gray mt-1">
                        {coverFile ? coverFile.name : 'JPG, PNG, or WebP'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-xl mx-auto">
                  {/* Video Upload */}
                  <div 
                    className={`relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer group flex flex-col items-center justify-center gap-4 ${
                      videoFile ? 'border-accent-magenta bg-accent-magenta/10' : 'border-white/10 hover:border-accent-magenta hover:bg-white/5'
                    }`}
                    onClick={() => videoRef.current.click()}
                  >
                    <input ref={videoRef} type="file" hidden accept="video/mp4,video/webm,video/quicktime" onChange={e => setVideoFile(e.target.files[0])} />
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all ${
                      videoFile ? 'bg-accent-magenta text-white shadow-[0_0_20px_rgba(255,0,128,0.5)]' : 'bg-white/5 text-gray-400 group-hover:scale-110'
                    }`}>
                      {videoFile ? <Check size={40} /> : <FileVideo size={40} />}
                    </div>
                    <div className="text-center mt-2">
                      <h3 className="font-bold text-xl">{videoFile ? 'Video Ready' : 'Select Music Video'}</h3>
                      <p className="text-sm text-gray mt-1">
                        {videoFile ? videoFile.name : 'MP4, WEBM, or MOV (max 2GB)'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button 
                  disabled={uploadType === 'audio' ? (!audioFile || !coverFile) : !videoFile}
                  onClick={() => setStep(2)}
                  className={`btn-primary gap-2 ${(uploadType === 'audio' ? (!audioFile || !coverFile) : !videoFile) && 'opacity-50 cursor-not-allowed'}`}
                >
                  Next Details <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
                  <label className="text-xs font-black uppercase tracking-widest text-gray px-1">
                    {uploadType === 'audio' ? 'Track Title' : 'Video Title'}
                  </label>
                  <input 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all text-white"
                    placeholder="Enter title..."
                    value={form.title}
                    onChange={e => set({ title: e.target.value })}
                  />
                </div>

                {uploadType === 'audio' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray px-1">Genre</label>
                      <select 
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all appearance-none text-white"
                        value={form.genre}
                        onChange={e => set({ genre: e.target.value })}
                      >
                        {['Electronic', 'Hip Hop', 'R&B', 'Pop', 'Amapiano', 'Afrobeat', 'Jazz', 'Classical'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray px-1">Release Date</label>
                      <input 
                        type="date"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all text-white"
                        value={form.releaseDate}
                        onChange={e => set({ releaseDate: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-3 bg-black/20 border border-white/5 p-4 rounded-xl self-end h-[58px]">
                      <input 
                        type="checkbox" id="explicit" className="w-5 h-5 rounded accent-accent-blue"
                        checked={form.isExplicit} onChange={e => set({ isExplicit: e.target.checked })}
                      />
                      <label htmlFor="explicit" className="font-bold text-sm cursor-pointer">Explicit Content</label>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray px-1">Artist Name</label>
                    <input 
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-magenta/30 focus:border-accent-magenta transition-all text-white"
                      placeholder="Who performed this video?"
                      value={form.artistName}
                      onChange={e => set({ artistName: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-6 border-top border-light">
                <button onClick={() => setStep(1)} className="text-gray font-bold px-6 hover:text-accent-blue transition-colors">
                  Back
                </button>
                <button 
                  disabled={!form.title || (uploadType === 'video' && !form.artistName)}
                  onClick={() => setStep(3)}
                  className={`btn-primary gap-2 ${(!form.title || (uploadType === 'video' && !form.artistName)) && 'opacity-50 cursor-not-allowed'}`}
                >
                  Final Review <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {submitting ? (
                <div className="py-8 space-y-8">
                  <div className="text-center space-y-2">
                    <Loader2 className="mx-auto animate-spin text-accent-blue mb-4" size={48} />
                    <h2 className="text-2xl font-black">Distributing Release...</h2>
                    <p className="text-gray">Preparing files for worldwide distribution</p>
                  </div>
                  <div className="max-w-md mx-auto">
                    {uploadType === 'audio' ? (
                      <>
                        <ProgressBar label="Processing Audio" pct={progress.audio} />
                        <ProgressBar label="Uploading Artwork" pct={progress.cover} />
                      </>
                    ) : (
                      <ProgressBar label="Processing Video" pct={progress.video} color="var(--accent-magenta)" />
                    )}
                    <ProgressBar label="Finalizing Database" pct={progress.db} color="var(--accent-gold)" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-6 bg-black/20 p-6 rounded-2xl border border-white/10 shadow-inner">
                    {uploadType === 'audio' ? (
                      <div className="w-32 h-32 rounded-xl border border-light overflow-hidden flex-shrink-0 shadow-[0_0_20px_rgba(0,112,243,0.15)]">
                        {coverFile && <img src={URL.createObjectURL(coverFile)} className="w-full h-full object-cover" alt="Cover Preview" />}
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-xl border border-light overflow-hidden flex-shrink-0 flex items-center justify-center bg-black shadow-[0_0_20px_rgba(255,0,128,0.15)]">
                        <Video size={40} className="text-accent-magenta" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center">
                      <h2 className="text-3xl font-black mb-1">{form.title}</h2>
                      {uploadType === 'audio' ? (
                        <>
                          <p className="text-accent-blue font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            {form.genre} <div className="w-1 h-1 rounded-full bg-accent-blue/30" /> {form.releaseDate}
                          </p>
                          {audioFile && (
                            <div className="mt-4 flex items-center gap-2 text-gray text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 self-start">
                              <Music size={14} /> {audioFile.name}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-accent-magenta font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            MUSIC VIDEO <div className="w-1 h-1 rounded-full bg-accent-magenta/30" /> {form.artistName}
                          </p>
                          {videoFile && (
                            <div className="mt-4 flex items-center gap-2 text-gray text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 self-start">
                              <FileVideo size={14} /> {videoFile.name}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                    <input 
                      type="checkbox" id="rights" className="mt-1 w-5 h-5 rounded accent-orange-500"
                      checked={form.confirmedRights} onChange={e => set({ confirmedRights: e.target.checked })}
                    />
                    <label htmlFor="rights" className="text-sm font-medium text-orange-200 cursor-pointer">
                      I confirm that I own 100% of the rights to this {uploadType === 'audio' ? 'audio recording and artwork' : 'video footage'}, and have permission to distribute it via City Light Music.
                    </label>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold flex gap-3 animate-shake">
                      <AlertCircle size={20} className="flex-shrink-0" /> {error}
                    </div>
                  )}

                  <div className="flex justify-between pt-6 border-top border-light">
                    <button onClick={() => setStep(2)} className="text-gray font-bold px-6 hover:text-accent-blue transition-colors">
                      Back
                    </button>
                    <button 
                      onClick={handleSubmit}
                      className={`btn-primary gap-2 bg-gradient-to-r ${uploadType === 'audio' ? 'from-accent-blue to-accent-blue/90' : 'from-accent-magenta to-accent-magenta/90'}`}
                    >
                      Publish Release <Sparkles size={18} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-200">
                <Check size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tight">Success!</h2>
                <p className="text-gray text-lg">Your {uploadType} release "{form.title}" is now uploaded to the network.</p>
              </div>
              <p className="text-sm text-gray font-medium">It may take a few minutes for the heavy assets to be globally accessible.</p>
              <div className="pt-6">
                <button onClick={resetForm} className="btn-primary">
                  Upload Another Release
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default UploadRelease;