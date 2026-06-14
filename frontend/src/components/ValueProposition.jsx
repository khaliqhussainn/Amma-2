import React from 'react';
import { Award, Heart, Globe, Users } from 'lucide-react';

const ValueProposition = () => {
  const values = [
    {
      icon: <Award className="w-7 h-7" />,
      title: "Professional Excellence",
      items: [
        "Mentorship programs connecting students with experts",
        "Continuing Medical Education (CME) opportunities",
        "Networking with 2,000+ professionals nationwide"
      ],
      bgColor: "from-emerald-50 to-emerald-100"
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Moral & Spiritual Growth",
      items: [
        "Islamic ethics in medical practice",
        "Prophetic compassion in patient care",
        "Faith-centered professional development"
      ],
      bgColor: "from-amber-50 to-amber-100"
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "Impact & Community",
      items: [
        "Local chapter engagement and service",
        "Global humanitarian initiatives",
        "Community health outreach programs"
      ],
      bgColor: "from-rose-50 to-rose-100"
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Unified Advocacy",
      items: [
        "Healthcare policy influence at national level",
        "Professional representation in medical field",
        "Collective voice for Muslim physicians"
      ],
      bgColor: "from-teal-50 to-teal-100"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 font-bold text-[var(--amma-emerald)]">
            Why Join AMMA?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            We offer a unique combination of professional growth, spiritual development, and meaningful impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div 
              key={index} 
              className={`relative p-8 rounded-2xl bg-gradient-to-br ${value.bgColor} border border-gray-200 hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[var(--amma-emerald)] text-white">
                  {value.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-[var(--amma-emerald)]">
                    {value.title}
                  </h3>
                  <ul className="space-y-3">
                    {value.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0 bg-[var(--amma-burgundy)]"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity bg-[var(--amma-emerald)]"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
