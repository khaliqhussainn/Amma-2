import React from 'react';

const Impact = () => {
  const stats = [
    { label: "Active Members", value: "1,240+", color: "text-secondary" },
    { label: "Goal by 2026", value: "10K", color: "text-primary", border: true },
    { label: "Active Chapters", value: "12", color: "text-secondary" }
  ];

  return (
    <section className="relative -mt-20 z-30 max-w-container-max mx-auto px-md">
      <div className="glass-panel rounded-2xl p-xl shadow-premium grid grid-cols-1 md:grid-cols-3 gap-xl text-center">
        {stats.map((stat, index) => (
          <div key={index} className={`space-y-xs group ${stat.border ? 'border-y md:border-y-0 md:border-x border-outline-variant/30 py-md md:py-0' : ''}`}>
            <div className={`${stat.color} text-[48px] font-extrabold tracking-tighter transition-transform group-hover:scale-110`}>
              {stat.value}
            </div>
            <div className="text-on-surface-variant font-label-md uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      {/* <div className="mt-lg text-center">
        <p className="italic text-on-surface-variant font-body-lg max-w-2xl mx-auto opacity-70">
          "Serving humanity regardless of race, religion, or color."
        </p>
      </div> */}
    </section>
  );
};

export default Impact;
