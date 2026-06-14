import React from 'react';
import { Users, Target, MapPin } from 'lucide-react';

const Impact = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "2,000+",
      label: "Active Professionals",
      description: "Serving communities nationwide"
    },
    {
      icon: <Target className="w-8 h-8" />,
      value: "10,000",
      label: "2026 Membership Goal",
      description: "Growing our impact together"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      value: "12",
      label: "Established Chapters",
      description: "From coast to coast"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 font-bold text-[var(--amma-emerald)]">
            Our Impact
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
            To serve the nation and the global community by providing elite medical care and advocacy,
            healing humanity irrespective of race, color, or religion.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity bg-[var(--amma-emerald)]"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[#F3EFEB] text-[var(--amma-emerald)]">
                  {stat.icon}
                </div>
                <div className="text-4xl mb-2 text-[var(--amma-emerald)]">
                  {stat.value}
                </div>
                <div className="text-xl mb-2 text-[var(--amma-burgundy)]">
                  {stat.label}
                </div>
                <p className="text-gray-600">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
