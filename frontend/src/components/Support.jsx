import React from 'react';
import { Heart, CheckCircle } from 'lucide-react';

const Support = () => {
  const points = [
    "Fund medical missions and humanitarian relief",
    "Support student scholarships and mentorship",
    "Expand advocacy efforts nationwide",
    "Grow chapter infrastructure and programs"
  ];

  return (
    <section id="donate" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-12 overflow-hidden bg-[var(--amma-emerald)] text-white shadow-2xl shadow-emerald-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 bg-white"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 bg-[var(--amma-gold)]"></div>
          
          <div className="relative text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-[var(--amma-gold)] text-white shadow-lg">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 font-bold">
              Support the Mission
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              Your donations power AMMA's humanitarian work, advocacy efforts, and community programs. Together, we heal humanity.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              {points.map((point, index) => (
                <div key={index} className="flex items-center gap-3 text-left text-white/90">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{point}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button className="px-8 py-4 rounded-lg bg-white text-lg transition-all hover:shadow-xl text-[var(--amma-emerald)]">
                Make a Donation
              </button>
              <button className="px-8 py-4 rounded-lg border-2 border-white text-white text-lg transition-all hover:bg-white/10">
                Learn More
              </button>
            </div>
            <p className="text-sm text-white/80 italic font-medium">
              All donations are tax-deductible. AMMA National is a 501(c)(3) organization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
