import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

const features = [
  'Access to all chapter events',
  'Mentorship pairing',
  'Member directory',
  'WhatsApp community',
  'Newsletter and resources',
];

const MembershipModal = ({ isOpen, onClose, data }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#042C53]/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[40px] p-8 md:p-12 shadow-2xl overflow-hidden"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={24} className="text-gray-400" />
          </button>

          <div className="mb-8">
            <span className="text-[12px] font-extrabold text-[#AD1F23] uppercase tracking-[0.2em] mb-2 block">Membership Detail</span>
            <h3 className="text-3xl font-bold text-[#042C53] mb-4">{data.tier}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#042C53]">{data.price}</span>
              <span className="text-gray-400 font-medium">/year</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-[#042C53] mb-2">Who is this for?</h4>
              <p className="text-gray-600 leading-relaxed">{data.sub}</p>
            </div>

            <div>
              <h4 className="font-bold text-[#042C53] mb-4">Included Benefits</h4>
              <div className="grid grid-cols-1 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 size={18} className="text-[#AD1F23]" />
                    <span className="text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="w-full mt-10 py-5 bg-[#042C53] text-white rounded-2xl font-bold hover:bg-[#AD1F23] transition-colors shadow-lg shadow-blue-900/10">
            Proceed with Application
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const MembershipCard = ({ tier, price, sub, buttonLabel, bgImage, onJoinClick, onViewDetail }) => (
  <div className="w-full flex-1 bg-white border border-[#F2F2F7] rounded-[40px] overflow-hidden flex flex-col shadow-sm transition-transform duration-300 hover:scale-[1.02]">
    {/* Top Section */}
    <div
      className="w-full h-[260px] md:h-[280px] relative flex flex-col items-center justify-end pb-10 box-border shrink-0"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.9)), url(${bgImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Tier Label (Prominent) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 px-6">
        <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
          <span className="font-sans font-extrabold text-[12px] text-white tracking-[0.2em] uppercase">
            Membership Tier
          </span>
        </div>
        <h3 className="font-sans font-bold text-[28px] md:text-[32px] text-white text-center leading-tight drop-shadow-lg">
          {tier}
        </h3>
        <p className="font-sans font-medium text-[13px] text-white/70 text-center mt-4 max-w-[200px] leading-snug">
          {sub}
        </p>
      </div>
    </div>

    {/* CTA Button, Overlapping */}
    <div className="flex justify-center -mt-[24px] relative z-10 px-8 box-border">
      <button
        onClick={() => onJoinClick(tier)}
        className="w-full h-[52px] bg-[#05308C] hover:bg-[#042C53] rounded-[12px] font-sans font-semibold text-[15px] text-white cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border-none"
      >
        {buttonLabel}
      </button>
    </div>

    {/* Features List */}
    <div className="p-8 pt-10 flex flex-col flex-1">
      {features.map((item, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-3 py-3.5">
            <span className="text-[#666666] font-sans text-[14px] flex items-center">
              <span className="mr-2.5 text-[#333]">✓</span> {item}
            </span>
          </div>
          {i < features.length - 1 && (
            <div className="w-full h-[1px] bg-[#F2F2F7]" />
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onViewDetail({ tier, price, sub })}
        className="mt-6 text-[13px] font-bold text-[#AD1F23] hover:underline uppercase tracking-widest text-center"
      >
        View Details
      </button>
    </div>
  </div>
);

const Membership = ({ onJoinClick }) => {
  const [selectedTier, setSelectedTier] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/subscription-plans/active');
        setPlans(response.data.data.plans);
      } catch (error) {
        console.error('Failed to fetch plans', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const getBgImage = (name) => {
    if (name.includes('Student')) return "https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?q=80&w=600&auto=format&fit=crop";
    if (name.includes('Allied') || name.includes('Public')) return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop";
    if (name.includes('Licensed')) return "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=600&auto=format&fit=crop";
    return "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop";
  };

  const tiersData = plans.map(plan => ({
    tier: plan.name,
    price: plan.price === 0 ? "Free" : `$${plan.price}`,
    sub: plan.description,
    buttonLabel: `Join as ${plan.name.split(' ')[0]}`,
    bgImage: getBgImage(plan.name)
  }));

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AD1F23]"></div>
      </div>
    );
  }

  return (
    <section className="w-full bg-white px-[4%] pb-[clamp(60px,8vw,100px)] box-border flex flex-col items-center gap-[clamp(40px,5vw,60px)]">
      {/* Header */}
      <div className="text-center max-w-2xl px-4">
        <h2 className="font-sans font-bold text-[clamp(24px,3.5vw,44px)] text-[#1A1A1A] m-0 mb-4 tracking-tight">
          Choose your path
        </h2>
        <p className="font-sans font-normal text-[clamp(14px,1.2vw,18px)] text-[#666666] m-0 leading-relaxed">
          Four membership tiers, designed for where you are in your career.
        </p>
      </div>

      {/* Pricing Cards Container */}
      <div className="w-full overflow-x-auto lg:overflow-visible hide-scrollbar px-4 md:px-0 snap-x snap-mandatory">
        <div className="flex flex-row flex-nowrap lg:flex-wrap gap-6 md:gap-8 justify-start lg:justify-center w-full lg:max-w[1200px] lg:mx-auto items-stretch pb-4 lg:pb-0">
          {tiersData.map((tier, idx) => (
            <div key={idx} className="min-w-[85%] md:min-w-[320px] lg:min-w-[280px] lg:flex-1 lg:max-w-[350px] flex snap-center">
              <MembershipCard
                {...tier}
                onJoinClick={onJoinClick}
                onViewDetail={(data) => setSelectedTier(data)}
              />
            </div>
          ))}
        </div>
      </div>

      <MembershipModal
        isOpen={!!selectedTier}
        onClose={() => setSelectedTier(null)}
        data={selectedTier || {}}
      />
    </section>
  );
};

export default Membership;
