import React from 'react';
import { TrendingUp, Star, Globe, Gavel } from 'lucide-react';

const WhyAmma = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Professional Growth",
      description: "Advanced networking, peer mentorship, and specialized career pathways."
    },
    {
      icon: Star,
      title: "Faith & Ethics",
      description: "Integrating Islamic medical ethics and spiritual grounding into clinical practice."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Humanitarian missions and international healthcare policy development."
    },
    {
      icon: Gavel,
      title: "Unified Advocacy",
      description: "A powerful collective voice representing our unique perspective in DC."
    }
  ];

  return (
    <section className="w-full bg-white px-[4%] box-border overflow-hidden pb-[clamp(60px,8vw,100px)]">
      <div className="max-w-container-max mx-auto px-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
          <div className="lg:col-span-4 space-y-md">
            <h2 className="font-display-lg text-headline-lg text-primary">
              Together We Grow. <br/>
              <span className="text-secondary">Together We Lead.</span>
            </h2>
            <p className="text-on-surface-variant text-body-lg max-w-2xl leading-relaxed">
              We provide the infrastructure for Muslim medical professionals to excel in their careers while staying true to their values.
            </p>
            <div className="w-16 h-1 bg-secondary rounded-full"></div>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {features.map((feature, index) => (
              <div key={index} className="p-lg bg-white rounded-2xl shadow-premium border border-outline-variant/10 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-md group-hover:bg-secondary group-hover:text-white transition-colors">
                  <feature.icon size={32} />
                </div>
                <h3 className="font-headline-md text-headline-md mb-xs text-primary">{feature.title}</h3>
                <p className="text-on-surface-variant text-body-md">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyAmma;
