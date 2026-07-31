import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WHATSAPP_COMMUNITY_LINK = 'https://chat.whatsapp.com/JXDOW0jCurH22ZkA1e01y6';

const WhatsAppCommunityCard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  const hasAccess = user && (user.role === 'ADMIN' || user.status === 'APPROVED');

  return (
    <div
      className="mt-12 w-full rounded-full relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 py-5 px-6 md:py-4 md:px-8 text-center md:text-left"
      style={{
        backgroundImage: 'linear-gradient(rgba(4, 44, 83, 0.82), rgba(4, 44, 83, 0.82)), url("/whatsapp-flag-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 relative z-10">
        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white/15 shrink-0">
          {hasAccess ? <MessageCircle className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white" />}
        </div>
        <p className="text-white font-sans font-bold text-base md:text-lg leading-snug">
          {hasAccess
            ? 'Join the AMMA WhatsApp Community'
            : 'Members-only WhatsApp Community. Sign in to access.'}
        </p>
      </div>

      {hasAccess ? (
        <a
          href={WHATSAPP_COMMUNITY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex items-center gap-2 py-3 px-6 rounded-full bg-[#AD1F23] hover:bg-[#911a1d] text-white font-sans font-bold text-sm whitespace-nowrap transition-colors shrink-0"
        >
          Join Now
          <ArrowRight size={16} />
        </a>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="relative z-10 inline-flex items-center gap-2 py-3 px-6 rounded-full bg-[#AD1F23] hover:bg-[#911a1d] text-white font-sans font-bold text-sm whitespace-nowrap transition-colors shrink-0 cursor-pointer"
        >
          Sign In
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};

export default WhatsAppCommunityCard;
