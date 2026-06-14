import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import pagesData from '../data/pagesData.json';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const { about } = pagesData;
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1">
        {/* Modern Banner with Background Image */}
        <section className="relative h-[40vh] md:h-[60vh] flex items-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/about-banner.png"
              className="w-full h-full object-cover object-center"
              alt="About Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#042C53]/95 to-[#042C53]/60"></div>
          </div>

          <div className="max-w-[1200px] mx-auto w-full relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-[clamp(32px,6vw,64px)] font-bold mb-6 tracking-tight leading-tight text-white">
                {about.title}
              </h1>
              <p className="text-xl md:text-2xl text-blue-50 opacity-90 max-w-2xl leading-relaxed">
                {about.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-24 px-6">
          <div className="max-w-[900px] mx-auto space-y-16">
            <div className="text-center">
              <h2 className="text-[12px] font-extrabold text-[#AD1F23] uppercase tracking-[0.2em] mb-4">Our Mission</h2>
              <p className="text-[clamp(24px,3vw,32px)] font-bold text-[#042C53] leading-tight">
                {about.mission}
              </p>
            </div>
            <div className="pt-16 border-t border-gray-100 text-center">
              <h2 className="text-[12px] font-extrabold text-[#AD1F23] uppercase tracking-[0.2em] mb-4">Our Vision</h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                {about.vision}
              </p>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-center text-[clamp(28px,4vw,40px)] font-bold text-[#042C53] mb-16">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {about.values.map((v, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-[#AD1F23] font-bold text-xl">{i + 1}</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#042C53] mb-3">{v.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
