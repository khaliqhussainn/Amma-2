import React, { useState } from 'react';
import { CheckCircle, Mail, Lock, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/public/subscribe', { email });
      toast.success('Welcome to the source! You have successfully subscribed.');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-surface-container-low relative overflow-hidden">
      {/* Background Islamic Pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-[0.03]"></div>
      
      <div className="max-w-container-max mx-auto px-md relative z-10">
        <div className="bg-[#0F172A] rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
          {/* Subtle glow effects for depth */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-10">
            <h2 className="font-display-lg text-[40px] md:text-[64px] leading-[1.1] text-white font-extrabold tracking-tight">
              Stay Connected <br />
              to the <span className="text-secondary">Source.</span>
            </h2>
            
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Join 12,000+ clinicians receiving our weekly briefings on medical ethics, chapter news, and national medical advocacy.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto pt-4">
              <input 
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white placeholder:text-white/30 focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all outline-none text-lg" 
                placeholder="Enter your professional email" 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                disabled={loading}
                className="bg-secondary px-10 py-5 font-bold uppercase tracking-widest rounded-full hover:bg-secondary/90 transition-all shadow-[0_10px_30px_-10px_rgba(176,45,41,0.5)] text-white whitespace-nowrap text-lg active:scale-95 disabled:opacity-70 flex items-center justify-center min-w-[200px]"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : 'Subscribe Now'}
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-12 border-t border-white/5">
              <div className="flex items-center gap-3 text-white/80 font-medium group cursor-default">
                <CheckCircle size={20} className="text-secondary transition-transform group-hover:scale-110" />
                <span>Verified Community</span>
              </div>
              <div className="flex items-center gap-3 text-white/80 font-medium group cursor-default">
                <Mail size={20} className="text-secondary transition-transform group-hover:scale-110" />
                <span>Weekly Briefings</span>
              </div>
              <div className="flex items-center gap-3 text-white/80 font-medium group cursor-default">
                <Lock size={20} className="text-secondary transition-transform group-hover:scale-110" />
                <span>Privacy Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
