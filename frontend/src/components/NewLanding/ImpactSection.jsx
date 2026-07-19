import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartHandshake, Users, Activity, Globe, ArrowRight } from 'lucide-react';

const ImpactSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: HeartHandshake,
      title: "Medical Missions",
      description: "Participate in local and international healthcare missions that transform lives."
    },
    {
      icon: Users,
      title: "Community Outreach",
      description: "Support underserved communities through health education, screenings, and volunteer programs."
    },
    {
      icon: Activity,
      title: "Emergency Response",
      description: "Provide medical assistance during humanitarian crises and natural disasters."
    },
    {
      icon: Globe,
      title: "Global Humanitarian Impact",
      description: "Work alongside respected organizations to expand healthcare access worldwide."
    }
  ];

  return (
    <section className="w-full bg-white py-xl px-[4%] relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Illustration / Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            {/* Soft decorative background glow */}
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

          {/* Right Side: Feature List and Heading */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Header Text */}
            <div className="space-y-4">
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#AD1F23]/5 text-[#AD1F23] text-sm font-bold tracking-widest uppercase">
                Creating Greater Impact Together
              </span>
              <h2 className="font-display text-headline-lg text-[#042C53] tracking-tight">
                Stronger Partnerships.<br/>
                <span className="text-secondary">Greater Impact.</span>
              </h2>
              <p className="text-on-surface-variant text-body-md leading-relaxed font-sans max-w-2xl">
                By collaborating with trusted humanitarian organizations, AMMA empowers Muslim healthcare professionals to serve communities beyond hospitals and clinics—creating meaningful impact through medical expertise, volunteerism, advocacy, and compassionate care.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className="p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center mb-4 text-[#042C53] group-hover:bg-[#042C53] group-hover:text-white transition-colors duration-300">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-[#042C53] mb-1.5">{feature.title}</h3>
                    <p className="text-on-surface-variant text-sm font-sans leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA Container */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={() => navigate('/membership-info#plans')}
                className="w-full sm:w-auto py-4 px-8 bg-[#AD1F23] hover:bg-[#911a1d] text-white rounded-xl font-bold text-base transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-center"
              >
                Become a Member & Make an Impact
              </button>
              <a
                href="#partnerships"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('partnerships')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[#AD1F23] hover:text-[#911a1d] font-bold text-sm flex items-center gap-1.5 transition-all hover:gap-2 cursor-pointer group"
              >
                Learn More About Our Partnerships
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
