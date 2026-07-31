import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    badge: "From Coast to Coast, Healing Humanity",
    headline: "One Faith. One Profession. Endless Impact.",
    subtext: "If you are a Muslim medical professional in the USA, you belong here.",
    cta: "Become a Founding Member Today (Limited Spots)",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1080",
    type: "intro"
  },
  {
    id: 2,
    badge: "Why AMMA",
    headline: "Building the Future of Muslim Healthcare in America",
    subtext: "Uniting thousands of Muslim physicians and healthcare professionals under one mission — to serve humanity with excellence, compassion, and faith.",
    cta: "Become a Premier Member Today",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1080",
    highlights: [
      "50K+ Physicians Network Potential",
      "100K+ Healthcare Professionals",
      "10K Membership Goal by 2026"
    ],
    type: "stats"
  },
  {
    id: 3,
    badge: "Nationwide Presence",
    headline: "A Growing Nationwide Network",
    subtext: "Active chapters across key cities, with rapid expansion underway.",
    cta: "Join as a Founding Chapter Member",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1080",
    chapters: "New Jersey • Baltimore • Detroit • Oklahoma City • Atlanta • Pittsburgh • Miami / Fort Lauderdale",
    footer: "More Cities Coming Soon",
    type: "chapters"
  },
  {
    id: 4,
    badge: "Professional Excellence",
    headline: "Connecting Every Medical Specialty",
    subtext: "A unified network of Muslim healthcare professionals across all major disciplines.",
    cta: "Explore Clinical Network",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1080",
    specialties: [
      { code: "AMIM", name: "Internal Med" },
      { code: "AMFM", name: "Family Med" },
      { code: "AMPS", name: "Pediatrics" },
      { code: "AMEM", name: "Emergency" },
      { code: "AMCARD", name: "Cardiology" },
      { code: "AMRAD", name: "Radiology" }
    ],
    type: "specialties"
  }
];

const Hero = ({ onJoinClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section id="home" className="relative min-h-[700px] lg:min-h-[850px] flex items-center bg-[#F3EFEB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-12 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Content Side */}
            <div className="space-y-6 lg:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 rounded-full border-2 border-[var(--amma-gold)] text-[var(--amma-gold)] font-medium text-sm"
              >
                {slide.badge}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl leading-tight font-bold text-[var(--amma-emerald)]"
              >
                {slide.headline}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg lg:text-xl text-gray-700 max-w-xl"
              >
                {slide.subtext}
              </motion.p>

              {/* Special Content for Slide 2 */}
              {slide.type === 'stats' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2"
                >
                  {slide.highlights.map((item, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[var(--amma-emerald)] font-semibold text-xs border border-emerald-100 uppercase tracking-wide">
                      {item}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Special Content for Slide 3 */}
              {slide.type === 'chapters' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/50 p-6 rounded-2xl border border-emerald-100/50 backdrop-blur-sm"
                >
                  <p className="text-[var(--amma-emerald)] font-semibold leading-relaxed text-sm lg:text-base">
                    {slide.chapters}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--amma-gold)] animate-pulse"></span>
                    <p className="text-gray-500 italic text-xs font-medium uppercase tracking-widest">
                      {slide.footer}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Special Content for Slide 4 */}
              {slide.type === 'specialties' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                >
                  {slide.specialties.map((spec, i) => (
                    <div key={i} className="px-3 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-[var(--amma-emerald)] transition-colors group">
                      <div className="text-[var(--amma-emerald)] font-bold text-sm mb-0.5 group-hover:scale-105 transition-transform">{spec.code}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{spec.name}</div>
                    </div>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 pt-2"
              >
                <button 
                  onClick={onJoinClick}
                  className="group px-8 py-4 rounded-lg text-white text-lg transition-all hover:opacity-90 bg-[var(--amma-emerald)] shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-3"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>

            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
                <motion.img
                  key={slide.image}
                  src={slide.image}
                  alt={slide.headline}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full blur-3xl opacity-30 bg-[var(--amma-gold)]"></div>
              <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full blur-3xl opacity-30 bg-[var(--amma-emerald)]"></div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i
                  ? 'w-10 bg-[var(--amma-emerald)]'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
