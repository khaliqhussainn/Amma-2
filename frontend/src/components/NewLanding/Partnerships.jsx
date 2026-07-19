import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Partnerships = () => {
  const navigate = useNavigate();

  return (
    <section id="partnerships" className="w-full bg-[#f8f9ff] py-xl px-[4%] islamic-pattern relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Side: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -inset-4 bg-secondary/5 blur-3xl rounded-full"></div>
            <div className="relative bg-[#042C53] rounded-[32px] aspect-[4/3] lg:aspect-[4/5] overflow-hidden shadow-premium group">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop"
                alt="Muslim doctors volunteering in local communities and providing humanitarian relief"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#042C53]/70 via-[#042C53]/20 to-transparent flex flex-col justify-end p-8">
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2 font-sans">Humanitarian Relief</span>
                <p className="text-white text-lg font-display font-bold leading-snug">
                  "Serving humanity, representing clinical excellence and compassionate service."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Header and Organization Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Header Text */}
            <div className="space-y-4">
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#042C53]/5 text-[#042C53] text-sm font-bold tracking-widest uppercase">
                Strategic Humanitarian Partnerships
              </span>
              <h2 className="font-display text-headline-lg text-[#042C53] tracking-tight">
                Together Beyond Healthcare
              </h2>
              <p className="text-on-surface-variant text-body-md leading-relaxed font-sans max-w-2xl">
                AMMA proudly collaborates with leading humanitarian organizations to extend compassionate medical care, disaster relief, and community outreach across the United States and around the world.
              </p>
            </div>

            {/* Organization Cards Stacking Vertically */}
            <div className="flex flex-col gap-6">

              {/* Card 1: ICNA Relief */}
              <div className="p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-outline-variant/10 flex items-center justify-center p-2.5 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#0A3E7B]" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" rx="20" fill="#0A3E7B" />
                    <path d="M50 20 C35 20 25 30 25 45 C25 65 50 80 50 80 C50 80 75 65 75 45 C75 30 65 20 50 20 Z" fill="#0E4E96" />
                    <circle cx="50" cy="45" r="14" fill="none" stroke="#FFFFFF" strokeWidth="4" />
                    <path d="M50 38 V52 M43 45 H57" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                    <path d="M32 70 C40 60 60 60 68 70" stroke="#F15A24" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-[#042C53] mb-1">ICNA Relief</h3>
                    <p className="text-on-surface-variant text-sm font-sans leading-relaxed">
                      Working together to deliver healthcare services, disaster response, medical outreach, free clinics, refugee assistance, and compassionate support to underserved communities throughout the United States.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://icnarelief.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AD1F23] hover:text-[#911a1d] font-bold text-sm flex items-center gap-1 cursor-pointer hover:gap-1.5 transition-all"
                    >
                      Explore Partnership
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2: HHRD */}
              <div className="p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-outline-variant/10 flex items-center justify-center p-2.5 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#10B981]" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" rx="20" fill="#10B981" />
                    <circle cx="50" cy="50" r="30" fill="#059669" />
                    <path d="M35 50 C40 45 45 42 50 45 C55 42 60 45 65 50 C70 55 60 70 50 75 C40 70 30 55 35 50 Z" fill="#FFFFFF" />
                    <path d="M50 25 C58 25 65 32 65 40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-[#042C53] mb-1">Helping Hand for Relief & Development (HHRD)</h3>
                    <p className="text-on-surface-variant text-sm font-sans leading-relaxed">
                      Partnering to provide international humanitarian assistance through medical missions, healthcare initiatives, emergency response, sustainable development, and global relief efforts.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://hhrd.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AD1F23] hover:text-[#911a1d] font-bold text-sm flex items-center gap-1 cursor-pointer hover:gap-1.5 transition-all"
                    >
                      Discover Our Work
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* CTA Container
            <div className="pt-4">
              <button
                onClick={() => navigate('/membership-info#plans')}
                className="w-full sm:w-auto py-4 px-8 bg-[#AD1F23] hover:bg-[#911a1d] text-white rounded-xl font-bold text-base transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-center"
              >
                Become a Member & Make an Impact
              </button>
            </div> */}

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Partnerships;
