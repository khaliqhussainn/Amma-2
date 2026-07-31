import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Mail, Award, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PendingApprovalPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (!user?.id || isApproved) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/auth/status/${user.id}`);
        if (data.token) {
          localStorage.setItem('token', data.token);
          setIsApproved(true);
          toast.success('Account Approved! Welcome to AMMA.', {
            icon: '🎉',
            duration: 4000
          });
          setTimeout(() => navigate('/member/dashboard'), 3000);
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, navigate, isApproved]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1 flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#042C53]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#AD1F23]/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[700px] w-full bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 relative z-10"
        >
          <div className="p-6 md:p-12 text-center space-y-8">
            <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto ${isApproved ? 'bg-green-50' : 'bg-amber-50'}`}>
              {isApproved ? (
                <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12 text-green-500" />
              ) : (
                <Clock className="w-8 h-8 md:w-12 md:h-12 text-amber-500 animate-pulse" />
              )}
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl md:text-4xl font-bold text-[#042C53] px-2">
                {isApproved ? 'Account Approved!' : 'Identity Verification Pending'}
              </h1>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-[500px] mx-auto px-4">
                {isApproved 
                  ? 'Congratulations! Your account has been verified. Redirecting you to your dashboard...' 
                  : 'Thank you for joining AMMA! Your profile has been submitted and is currently being reviewed by our administration.'
                }
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-5 md:p-8 border border-gray-100 text-left space-y-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                <span className="text-[10px] md:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Full Name</span>
                <span className="text-[#042C53] font-bold text-sm md:text-base">{user?.fullName || user?.name || 'Valued Member'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 pt-4 border-t border-gray-100/50">
                <span className="text-[10px] md:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Category</span>
                <span className="text-[#042C53] font-bold text-sm md:text-base">{user?.package || 'Membership'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 pt-4 border-t border-gray-100/50">
                <span className="text-[10px] md:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Status</span>
                <span className={`font-bold text-sm md:text-base ${isApproved ? 'text-green-600' : 'text-amber-600'}`}>
                  {isApproved ? 'Verified & Active' : 'Awaiting Admin Review'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {!isApproved && (
                <div className="p-6 bg-[#042C53]/5 rounded-2xl border border-[#042C53]/10">
                   <p className="text-xs md:text-sm text-[#042C53] font-medium leading-relaxed">
                    Our team typically reviews applications within 24-48 hours. You will receive an email notification once your account is active.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="text-[12px] md:text-sm font-bold text-gray-400 hover:text-[#AD1F23] transition-colors flex items-center gap-2 mx-auto pt-4"
            >
              <ArrowLeft size={16} />
              Sign Out & Return Home
            </button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PendingApprovalPage;
