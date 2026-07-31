import React from 'react';
import { ArrowRight } from 'lucide-react';

const Events = () => {
  const events = [
    {
      title: "Annual National Summit",
      date: "OCT 12-14",
      description: "Washington D.C.: Shaping the future of faith-based healthcare policy and ethical leadership.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyfn-cIyGes7SjVzKwEBgsoO4pjvgXlI5PuIlXsrcIcxhOHf7Gkm6MzEnFyLF0sPMqskCrGgrMJIvqlWe0V1ElOCRN7o5OmuWW0GOHjvnVRJs-DlyJGxKpCfL9ikayS5PWXebP6ASaXtCDUQ_BPgq6_lBGGkdnTOAckzMeUTzOi2gDqOQPTaZS-Do0gTW8LKCSsChAasW5V9MXLiBB5_JH5QxvUYrBNd3pOKLFYFsSSbE3rC9pRO6U-NFGEiMkZl7nGhfM8HJs3_aG",
      linkText: "Register Now"
    },
    {
      title: "Clinical Ethics Series",
      date: "MONTHLY",
      description: "Virtual Masterclasses: CME-accredited sessions bridging modern medicine with timeless ethics.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxnfZ7VTJJwmGrl9A5Y6fMylXlQf6HxCc-HJQymXeDqO9jciMNM6orw6IvODoR1Af6de2v-A2xhoHT2hyImWLiSTIbQNDC_RPF7eGeQ1Tkw2vniYhlpxuQTgD0Gm_ilnD9EZjVflZUtDRPJ4vMf8LH28KxIFINPLJCqzMeS7Rsx-1GGQQrOQdZ9pluqQevGgz9TlxkHEzk0jl_OE0_W0UKrQGYVD64uzCGzKiA66V4rR3yVYHOp9WDvM6uA9yNsk9udbWfoTzBy4Ky",
      linkText: "View Schedule"
    },
    {
      title: "Regional Mixers",
      date: "LOCAL",
      description: "Nationwide Locations: Strengthening ties through informal networking and local collaboration.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBssDttsc_gtZDqHIGx9bmeb0L97WmP9s_kqVaDXzAiPlv9ItE9oxJedQFIjO6DxZJpAPY3G25EBW11ms4bkx8DAiZtiQ_WX7z_7eo8Pjh2vnVMXwLyiANqS-lDeJltzb-bvIT5RMriMkMKg3p2bWb9a4UkV4gR0_FjhT3kDSRj1_6I-RsT9p4ze2GAOJnXagmCKzi-0BrJOdFjeoK9QK6T3-zP_E6yyjKwaxWh5wnl3Uj86NtjWFUEhyy17LT7EpBvZdzH77EbO9cd",
      linkText: "Find Nearest"
    }
  ];

  return (
    <section className="py-xl">
      <div className="max-w-container-max mx-auto px-md">
        <div className="text-center mb-xl max-w-2xl mx-auto">
          <h2 className="font-display-lg text-headline-lg text-primary">Signature Engagements</h2>
          <div className="w-16 h-1 bg-secondary mx-auto mt-base rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {events.map((event, index) => (
            <div key={index} className="group">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-lg shadow-premium relative">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={event.title} 
                  src={event.image} 
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-md py-xs rounded-lg font-bold text-label-sm text-primary shadow-lg">
                  {event.date}
                </div>
              </div>
              <h3 className="font-headline-md text-headline-md mb-xs text-primary group-hover:text-secondary transition-colors">
                {event.title}
              </h3>
              <p className="text-on-surface-variant text-body-md mb-md">
                {event.description}
              </p>
              <a className="font-bold text-label-md uppercase tracking-widest text-secondary inline-flex items-center gap-1 group-hover:gap-3 transition-all" href="#">
                {event.linkText} <ArrowRight size={20} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
