import { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Scale, 
  Lock, 
  Copyright, 
  Users, 
  CreditCard,
  ChevronRight,
  Printer,
  Download,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Legal = () => {
  const [activeTab, setActiveTab] = useState('Terms of Service');

  const policyTabs = [
    { name: 'Terms of Service', icon: <FileText size={18} /> },
    { name: 'Distribution Terms', icon: <CreditCard size={18} /> },
    { name: 'Collaboration Terms', icon: <Users size={18} /> },
    { name: 'Payment Terms', icon: <Scale size={18} /> },
    { name: 'Privacy Policy', icon: <Lock size={18} /> },
    { name: 'Copyright Policy', icon: <Copyright size={18} /> },
    { name: 'Community Rules', icon: <Shield size={18} /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Terms of Service':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-heading text-white">Terms of Service</h2>
            <p className="text-gray leading-relaxed text-lg">Last Updated: March 24, 2026</p>
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-gold">1. Acceptance of Terms</h3>
              <p className="text-white/70 leading-relaxed">
                By accessing or using City Light Media ("CLM"), you agree to be bound by these Terms of Service. CLM is a luxury music distribution and media hosting platform designed for serious independent artists. If you do not agree to these terms, you must not use our services.
              </p>
            </section>
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-gold">2. Artist Conduct</h3>
              <p className="text-white/70 leading-relaxed">
                Artists are expected to maintain the highest standard of professionalism. CLM reserves the right to terminate accounts that engage in fraud, streaming manipulation, or harassment within the community.
              </p>
            </section>
            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex gap-4">
               <AlertTriangle className="text-amber-500 shrink-0" />
               <p className="text-sm text-amber-500/80">
                 Failure to comply with our commercial terms may result in the immediate forfeiture of un-withdrawn royalties.
               </p>
            </div>
          </div>
        );
      case 'Distribution Terms':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-heading text-white">Distribution Terms</h2>
            <p className="text-gray leading-relaxed text-lg">Direct Store Delivery Agreement</p>
            <section className="space-y-4">
               <h3 className="text-xl font-bold text-gold">Rights & Exclusivity</h3>
               <p className="text-white/70 leading-relaxed">
                 CLM operates on a non-exclusive basis. You retain 100% ownership of your masters. By distributing through CLM, you grant us a non-exclusive license to sub-license your music to Digital Service Providers (DSPs) such as Spotify, Apple Music, and YouTube.
               </p>
            </section>
            <section className="space-y-4">
               <h3 className="text-xl font-bold text-gold">Takedowns</h3>
               <p className="text-white/70 leading-relaxed">
                 Takedown requests are processed within 7 business days. CLM reserves the right to issue mandatory takedowns if a copyright dispute is validated by our legal team.
               </p>
            </section>
          </div>
        );
      case 'Collaboration Terms':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-heading text-white">Collaboration Terms</h2>
            <p className="text-gray leading-relaxed text-lg">Smart Split & Escrow Framework</p>
            <section className="space-y-4 text-white/70">
               <p>All collaboration deals on CLM are governed by the **Smart-Contract Framework**.</p>
               <ul className="list-disc pl-6 space-y-2">
                 <li>Funds remain in **Escrow** until both parties confirm fulfillment.</li>
                 <li>Copyright splits are immutable once the release has been submitted for distribution.</li>
                 <li>Disputes are handled by the CLM Artist Mediation Board.</li>
               </ul>
            </section>
          </div>
        );
      case 'Payment Terms':
        return (
          <div className="space-y-6">
             <h2 className="text-3xl font-heading text-white">Payment & Payout Terms</h2>
             <section className="space-y-4">
                <h3 className="text-xl font-bold text-gold">Royalty Cycles</h3>
                <p className="text-white/70 leading-relaxed">
                  Royalties from major DSPs typically have a 45-90 day delay. CLM updates balances as soon as store reports are received and audited.
                </p>
             </section>
             <section className="space-y-4">
                <h3 className="text-xl font-bold text-gold">Minimum Threshold</h3>
                <p className="text-white/70 leading-relaxed">
                   The default minimum payout threshold is **R1,000.00**. This can be adjusted in your Wallet Settings.
                </p>
             </section>
          </div>
        );
      default:
        return (
          <div className="py-20 text-center opacity-50">
            <FileText size={48} className="mx-auto mb-4" />
            <p>Policy content for {activeTab} is currently being finalized by legal counsel.</p>
          </div>
        );
    }
  };

  return (
    <div className="page-legal fade-in p-10 max-w-6xl mx-auto">
      <header className="mb-16">
        <h1 className="text-5xl font-heading mb-4 italic uppercase">Trust & Compliance</h1>
        <p className="text-gray text-xl max-w-2xl">
          City Light Media is built on transparency and legal integrity. Read our full governing frameworks below.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          {policyTabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeTab === tab.name 
                  ? 'bg-gold text-black font-bold shadow-[0_0_20px_rgba(255,215,0,0.2)]' 
                  : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                {tab.icon}
                <span className="text-sm">{tab.name}</span>
              </div>
              <ChevronRight size={16} className={activeTab === tab.name ? 'opacity-1' : 'opacity-0'} />
            </button>
          ))}

          <div className="pt-10 mt-10 border-t border-white/5 space-y-4">
             <button className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">
               <Printer size={14} /> Print Documentation
             </button>
             <button className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">
               <Download size={14} /> Download PDF
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[40px] border border-white/5 p-12 min-h-[500px]"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>

      <style>{`
        .page-legal {
          min-height: 100vh;
        }
        .font-heading {
          font-family: 'DM Serif Display', serif;
          letter-spacing: -0.01em;
        }
        .glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        p { letter-spacing: 0.01em; }
      `}</style>
    </div>
  );
};

export default Legal;
