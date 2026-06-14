import React, { useState } from 'react';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import pagesData from '../data/pagesData.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MembershipInfoPage = () => {
  const { membershipInfo } = pagesData;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const plansRef = React.useRef(null);

  React.useEffect(() => {
    if (window.location.hash === '#plans') {
      setTimeout(() => {
        plansRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1">
        <section className="relative h-[40vh] md:h-[60vh] flex items-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="Membership Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#042C53]/95 to-[#042C53]/60"></div>
          </div>

          <div className="max-w-[1200px] mx-auto w-full relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-[clamp(32px,6vw,64px)] font-bold mb-6 tracking-tight leading-tight text-white">
                {membershipInfo.title}
              </h1>
              <p className="text-xl md:text-2xl text-blue-50 max-w-2xl leading-relaxed">
                {membershipInfo.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 mb-24">
              <div className="space-y-12">
                <p className="text-2xl font-bold text-[#042C53] leading-snug">
                  {membershipInfo.description}
                </p>

                <div className="space-y-8">
                  {membershipInfo.benefits.map((b, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <Check className="text-[#AD1F23]" size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-[#042C53] mb-1">{b.title}</h4>
                        <p className="text-gray-600">{b.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <img
                  src="/about-section.png"
                  className="w-full h-full object-cover rounded-[48px] shadow-2xl"
                  alt="Community"
                />
              </div>
            </div>

            <div id="plans" ref={plansRef} className="space-y-12">
              <h3 className="text-4xl font-bold text-[#042C53] text-center mb-16">Membership Categories</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {membershipInfo.tiers.map((card, i) => {
                  const imgs = [
                    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop",
                    "https://plus.unsplash.com/premium_photo-1667511093147-49d50916cd79?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop"
                  ];
                  return (
                    <div key={i} className="bg-white border border-gray-100 rounded-[40px] overflow-hidden flex flex-col shadow-lg hover:scale-105 transition-all duration-300">
                      {/* Top Section */}
                      <div
                        className="w-full h-[220px] relative flex flex-col items-center justify-center p-6 text-center"
                        style={{
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.85)), url(${imgs[i]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {/* <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                          <span className="text-white/90 font-bold uppercase tracking-[0.2em] text-[9px]">
                            Membership Category
                          </span>
                        </div> */}

                        <h3 className="text-2xl md:text-xl font-bold text-white leading-tight drop-shadow-md px-2">
                          {card.name}
                        </h3>
                      </div>

                      {/* Overlapping Button */}
                      {!user && (
                        <div className="flex justify-center -mt-6 relative z-10 px-4">
                          <button
                            onClick={() => navigate(`/register?tier=${encodeURIComponent(card.name)}`)}
                            className="w-full py-4 bg-[#05308C] text-white rounded-xl font-bold hover:bg-[#042C53] transition-colors shadow-lg text-sm"
                          >
                            Join Now
                          </button>
                        </div>
                      )}

                      <div className="p-6 pt-10 space-y-4 flex-1 flex flex-col items-center text-center">
                        <p className="text-[12px] font-extrabold text-[#AD1F23] uppercase tracking-widest">{card.bestFor}</p>
                        <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-3">{card.description}</p>

                        <div className="pt-3 border-t border-gray-50 space-y-1.5">
                          <p className="text-[9px] font-extrabold text-[#042C53]/40 uppercase tracking-widest mb-1">Includes:</p>
                          {(card.inclusions || []).slice(0, 4).map(feat => (
                            <div key={feat} className="flex items-center gap-2 text-[11px] text-gray-600">
                              <div className="w-1 h-1 rounded-full bg-[#AD1F23]" />
                              {feat}
                            </div>
                          ))}
                          {(card.inclusions || []).length > 4 && (
                            <button
                              onClick={() => setSelectedPlan(card)}
                              className="text-[10px] text-[#AD1F23] font-bold mt-1 hover:underline flex items-center gap-1"
                            >
                              + {(card.inclusions.length - 4)} more categories (View All)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="absolute inset-0 bg-[#042C53]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>

                <div className="space-y-8">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#AD1F23] uppercase tracking-[0.2em]">{selectedPlan.name}</span>
                    <h2 className="text-3xl font-bold text-[#042C53] mt-2">Full Category Details</h2>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {selectedPlan.description}
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-[11px] font-extrabold text-[#042C53]/40 uppercase tracking-widest">Complete Inclusion List</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      {(selectedPlan.inclusions || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-[13px] text-gray-600">
                          <Check size={14} className="text-[#AD1F23] shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {!user && (
                    <button
                      onClick={() => {
                        navigate(`/register?tier=${encodeURIComponent(selectedPlan.name)}`);
                        setSelectedPlan(null);
                      }}
                      className="w-full py-5 bg-[#042C53] text-white rounded-2xl font-bold hover:bg-[#031d38] transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2"
                    >
                      Continue to Registration
                      <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MembershipInfoPage;
