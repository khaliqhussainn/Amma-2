import React from 'react';
import { GraduationCap, Stethoscope, Heart, Check } from 'lucide-react';

const Membership = ({ onJoinClick }) => {
  const tiers = [
    {
      name: "Student/Resident",
      price: "$50",
      description: "Building the next generation",
      icon: <GraduationCap className="w-8 h-8" />,
      color: "var(--amma-gold)",
      features: [
        "Access to mentorship programs",
        "Career development resources",
        "Networking opportunities",
        "CME credits and webinars",
        "Chapter access"
      ]
    },
    {
      name: "Professional",
      price: "$150",
      description: "The heartbeat of the organization",
      icon: <Stethoscope className="w-8 h-8" />,
      color: "var(--amma-emerald)",
      popular: true,
      features: [
        "All Student/Resident benefits",
        "Leadership opportunities",
        "Priority event registration",
        "National summit discount",
        "Clinical directory listing",
        "Voting rights"
      ]
    },
    {
      name: "Sustaining",
      price: "$500",
      description: "Fueling national advocacy and growth",
      icon: <Heart className="w-8 h-8" />,
      color: "var(--amma-burgundy)",
      features: [
        "All Professional benefits",
        "Strategic advisory access",
        "VIP summit perks",
        "Recognition in publications",
        "Direct advocacy involvement",
        "Legacy building"
      ]
    }
  ];

  return (
    <section id="membership" className="py-20 bg-[#F3EFEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 font-bold text-[var(--amma-emerald)]">
            Membership Tiers
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Choose the membership level that aligns with your career stage and commitment to our mission.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 bg-white border border-gray-200 ${tier.popular ? 'ring-4 scale-105 z-10' : ''
                }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-bold bg-[var(--amma-emerald)]">
                  Most Popular
                </div>
              )}

              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[#F3EFEB]" style={{ color: tier.color }}>
                {tier.icon}
              </div>

              <h3 className="text-2xl font-bold mb-2" style={{ color: tier.color }}>
                {tier.name}
              </h3>
              <p className="text-gray-600 mb-6 font-medium">
                {tier.description}
              </p>

              <div className="mb-8">
                <span className="text-4xl text-[var(--amma-emerald)]">{tier.price}</span>
                <span className="text-gray-600 ml-2">per year</span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onJoinClick(tier.name)}
                className={`w-full py-3 rounded-lg transition-all ${tier.popular
                    ? 'bg-[var(--amma-emerald)] text-white'
                    : 'bg-transparent border-2'
                  }`}
                style={{
                  borderColor: tier.popular ? 'transparent' : tier.color,
                  color: tier.popular ? 'white' : tier.color
                }}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => onJoinClick()}
            className="px-8 py-4 rounded-lg text-white text-lg font-bold transition-all hover:opacity-90 bg-[var(--amma-emerald)] shadow-lg shadow-emerald-900/10"
          >
            Join AMMA National
          </button>
        </div>
      </div>
    </section>
  );
};

export default Membership;
