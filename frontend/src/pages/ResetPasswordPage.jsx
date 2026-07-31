import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Hash, Mail, CheckCircle2, RefreshCw } from 'lucide-react';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resetPassword, forgotPassword } = useAuth();
  
  const [step, setStep] = useState('otp'); // 'otp' or 'password'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Email is required');
    if (otp.length !== 6) return toast.error('Please enter a valid 6-digit OTP');
    
    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      setStep('password');
    } catch (error) {
      console.error('OTP verification failed', error);
      // Error toast is handled by api interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    
    setIsLoading(true);
    try {
      await resetPassword(email, otp, password);
      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Reset password failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return toast.error('Email is required');
    setIsResending(true);
    try {
      await forgotPassword(email);
      toast.success('New OTP sent to your email');
    } catch (error) {
      console.error('Resend OTP failed', error);
    } finally {
      setIsResending(false);
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
          <AnimatePresence mode="wait">
            {step === 'otp' ? (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-[#042C53] mb-3">Verify OTP</h2>
                  <p className="text-gray-500">We've sent a 6-digit code to <span className="text-[#042C53] font-bold">{email}</span></p>
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 max-w-2xl mx-auto mt-4">
                    <p className="text-sm text-[#042C53] font-medium italic">
                      "Please check you Junk box too and make our address as Non Junk in your inbox"
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-[0.15em] ml-1">6-Digit Code</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#AD1F23] transition-colors">
                        <Hash size={20} />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        required
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all duration-200 font-bold text-[#042C53] tracking-[0.5em] text-center text-xl"
                        placeholder="000000"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-5 bg-[#042C53] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#031d38] transition-all shadow-xl shadow-blue-900/10 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Verify & Continue'}
                      <ArrowRight size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="text-sm font-bold text-[#AD1F23] flex items-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      <RefreshCw size={16} className={isResending ? 'animate-spin' : ''} />
                      {isResending ? 'Sending...' : 'Resend Code'}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="password-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#042C53] mb-3">Set New Password</h2>
                  <p className="text-gray-500">OTP verified! Now create a secure new password.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-[0.15em] ml-1">New Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#AD1F23] transition-colors">
                        <Lock size={20} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-14 pr-14 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all duration-200 font-medium text-[#042C53]"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-[#042C53] transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-[0.15em] ml-1">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#AD1F23] transition-colors">
                        <Lock size={20} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-14 pr-14 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all duration-200 font-medium text-[#042C53]"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5 bg-[#AD1F23] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#8e191d] transition-all shadow-xl shadow-red-900/10 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                    <ArrowRight size={20} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
