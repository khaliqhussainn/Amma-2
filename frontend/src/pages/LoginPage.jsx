import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome as Google } from 'lucide-react';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaEmail, setMfaEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { user, login, googleLogin, verifyAdminMfa } = useAuth();

  React.useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.status === 'PENDING') navigate('/pending-approval');
      else navigate('/member/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user info from Google using the access token
        const { data: googleUser } = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const googleData = {
          googleId: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name
        };

        const user = await googleLogin(googleData);
        if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (user.status === 'PENDING') {
          navigate('/pending-approval');
        } else if (user.status === 'BLOCKED') {
          toast.error('Your account has been restricted. Please contact support.');
        } else {
          navigate('/member/dashboard');
        }
      } catch (error) {
        console.error('Google login failed', error);
        if (error.response?.status === 404) {
          toast.error('Account not found. Please register first.');
          setTimeout(() => navigate('/register'), 2000);
        } else if (error.response?.status === 403) {
          toast.error(error.response.data.message || 'Account restricted');
        } else {
          toast.error('Google login failed. Please try again.');
        }
      }
    },
    onError: () => {
      toast.error('Google Login Failed');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData.email, formData.password, remember);
      
      if (response && response.requiresMfa) {
        setMfaRequired(true);
        setMfaEmail(response.email);
        return;
      }

      const user = response;
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.status === 'PENDING') {
        navigate('/pending-approval');
      } else {
        navigate('/member/dashboard');
      }
    } catch (error) {
      console.error('Login failed', error);
      if (error.response?.status === 403) {
        toast.error(error.response.data.message || 'Access Denied');
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      }
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await verifyAdminMfa(mfaEmail, otp);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/member/dashboard');
      }
    } catch (error) {
      console.error('MFA failed', error);
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#042C53]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#AD1F23]/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[1200px] bg-white rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col lg:flex-row overflow-hidden relative z-10"
        >
          {/* Left Side: Visual/Branding */}
          <div className="hidden lg:flex lg:w-1/2 bg-[#042C53] p-10 md:p-16 lg:p-20 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=60&w=600&auto=format&fit=crop"
                className="w-full h-full object-cover opacity-30"
                alt="Medical Background"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#042C53] via-[#042C53]/90 to-[#AD1F23]/40"></div>
            </div>

            {/* <div className="relative z-10">
              <Link to="/">
                <img src="/logo.png" alt="AMMA" className="h-16 w-auto object-contain" />
              </Link>
            </div> */}

            <div className="relative z-10 space-y-8">
              <h1 className="text-4xl xl:text-6xl font-bold text-white leading-tight">
                Welcome Back to <br />
                <span className="text-[#AD1F23]">AMMA Portal.</span>
              </h1>
              <p className="text-lg xl:text-xl text-blue-100/70 leading-relaxed max-w-[90%]">
                Connect with the Premier Network of Muslim Healthcare Professionals across the United States.
              </p>

              {/* <div className="pt-8 flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-[#042C53] bg-gray-200 overflow-hidden shadow-lg">
                      <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-blue-100/60 font-medium">
                  Join 15,000+ members today
                </p>
              </div> */}
            </div>

            <div className="relative z-10 text-sm text-blue-100/40 font-medium">
              © 2026 AMMA. Excellence Guided by Faith.
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-[#042C53] mb-3">
                {mfaRequired ? 'Admin Verification' : 'Sign In'}
              </h2>
              <p className="text-gray-500">
                {mfaRequired ? 'Enter the 6-digit code sent to your email.' : 'Enter your credentials to access your account'}
              </p>
            </div>

            {!mfaRequired ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-[0.15em] ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#AD1F23] transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all duration-200 font-medium text-[#042C53]"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-[0.15em]">Password</label>
                    <Link to="/forgot-password" size={123} className="text-xs font-bold text-[#AD1F23] hover:underline">Forgot Password?</Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#AD1F23] transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
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

                <div className="flex items-center gap-3 px-1">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#AD1F23] focus:ring-[#AD1F23]" 
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600 font-medium cursor-pointer">Remember me for 30 days</label>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-[#042C53] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#031d38] transition-all shadow-xl shadow-blue-900/10 active:scale-[0.98]"
                >
                  Sign In to Portal
                  <ArrowRight size={20} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleMfaSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-[0.15em] ml-1">Authentication Code</label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all duration-200 font-medium text-[#042C53] tracking-widest text-center text-xl"
                      placeholder="• • • • • •"
                      maxLength="6"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Please enter the 6-digit code sent to your email.
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-[#042C53] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#031d38] transition-all shadow-xl shadow-blue-900/10 active:scale-[0.98]"
                >
                  Verify & Sign In
                  <ArrowRight size={20} />
                </button>
              </form>
            )}

            {!mfaRequired && (
              <div className="mt-10">
                <div className="relative flex items-center justify-center mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <span className="relative bg-white px-6 text-sm text-gray-400 font-medium">Or continue with</span>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-2xl hover:border-gray-200 hover:bg-gray-50 transition-all font-bold text-[#042C53] text-sm"
                >
                  <Google size={18} className="text-[#AD1F23]" />
                  Continue with Google
                </button>
              </div>
            )}

            <p className="mt-12 text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-[#AD1F23] hover:underline">Create an Account</Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
