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
    <div className="mt-12 max-w-2xl mx-auto rounded-3xl p-8 md:p-10 bg-[var(--amma-emerald)] text-white shadow-xl shadow-emerald-900/10 text-center">
      <div className="w-14 h-14 rounded-xl mb-6 mx-auto flex items-center justify-center bg-white/20">
        {hasAccess ? <MessageCircle className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
      </div>

      <h3 className="text-2xl font-bold mb-3">AMMA WhatsApp Community</h3>

      {hasAccess ? (
        <>
          <p className="text-white/90 mb-8 font-medium">
            Connect with fellow AMMA members, stay informed, and join real-time discussions.
          </p>
          <a
            href={WHATSAPP_COMMUNITY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white font-bold transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ color: 'var(--amma-emerald)' }}
          >
            <MessageCircle size={20} />
            Join WhatsApp Community
            <ArrowRight size={18} />
          </a>
        </>
      ) : (
        <>
          <p className="text-white/90 mb-8 font-medium">
            Members, please sign in to access.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white font-bold transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            style={{ color: 'var(--amma-emerald)' }}
          >
            Sign In
            <ArrowRight size={18} />
          </button>
        </>
      )}
    </div>
  );
};

export default WhatsAppCommunityCard;
