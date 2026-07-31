import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import { motion } from 'framer-motion';
import { Stethoscope, Activity, Heart, Loader2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const SpecialtiesPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/public/coming-soon', { 
        email, 
        interest_area: 'Specialties' 
      });
      toast.success("Interest noted! We'll update you on specialty networks.");
      setEmail('');
    } catch (error) {
      console.error('Notify error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />
      
      <main className="flex-1 flex items-center justify-center py-20 px-6 relative overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#042C53]/5 to-transparent blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#AD1F23]/5 to-transparent blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-10 group">
            <div className="absolute inset-0 bg-[#AD1F23]/5 rounded-full scale-150 animate-pulse" />
            <div className="absolute inset-0 bg-[#042C53]/10 rounded-full scale-125 transition-transform duration-500 group-hover:scale-150" />
            <div className="w-28 h-28 bg-white border border-gray-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center relative z-10 -rotate-3 transition-transform duration-500 group-hover:rotate-0 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
              <Stethoscope className="w-12 h-12 text-[#042C53]" strokeWidth={1.5} />
            </div>
            
            {/* Floating micro-icons */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-50 z-20"
            >
              <Heart className="w-5 h-5 text-[#AD1F23]" strokeWidth={2} />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-2 -right-6 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-50 z-20"
            >
              <Activity className="w-6 h-6 text-[#AD1F23]" strokeWidth={1.5} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#042C53]/10 text-[#042C53] text-sm font-bold tracking-widest uppercase mb-6">
              Expertise Network
            </span>
            <h1 className="text-[clamp(36px,5vw,64px)] font-extrabold text-[#042C53] mb-6 tracking-tight leading-[1.1]">
              Specialties Coming Soon
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
              Our expert networks are being finalized. Check back shortly to explore and collaborate within dedicated medical specialties.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 max-w-[350px] mx-auto">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for updates" 
                className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-[#AD1F23] focus:ring-2 focus:ring-[#AD1F23]/20 transition-all font-sans text-gray-700 bg-gray-50/50 focus:bg-white text-center"
              />
              <button 
                type="submit"
                disabled={loading}
                className="px-10 py-4 rounded-full bg-[#AD1F23] hover:bg-[#8e1214] text-white font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap hover:-translate-y-1 disabled:opacity-70 flex items-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {loading ? 'Processing...' : 'Notify Me'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default SpecialtiesPage;
