import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      
      // Navigate to reset page with email in state
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1500);
      
    } catch (error) {
      console.error('Forgot password failed', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#042C53]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#AD1F23]/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-10 relative z-10 border border-gray-100"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#042C53] mb-3">Reset Password</h2>
            <p className="text-gray-500">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-[0.15em] ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#AD1F23] transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all duration-200 font-medium text-[#042C53]"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-[#042C53] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#031d38] transition-all shadow-xl shadow-blue-900/10 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
                <ArrowRight size={20} />
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <Mail size={32} className="text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#042C53]">Check your email</h3>
                <p className="text-gray-500">We've sent a password reset link to <span className="font-bold">{email}</span></p>
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 max-w-2xl mx-auto mt-4">
                  <p className="text-sm text-[#042C53] font-medium italic">
                    "Please check you Junk box too and make our address as Non Junk in your inbox"
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-sm font-bold text-[#AD1F23] hover:underline"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-100">
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-[#042C53]/60 hover:text-[#AD1F23] transition-colors">
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
