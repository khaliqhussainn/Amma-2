import React from 'react';
import { MapPin, Mail } from 'lucide-react';

const Chapters = () => {
  const chapters = [
    { name: "New Jersey Chapter", members: "350+", location: "New Jersey" },
    { name: "Baltimore Chapter", members: "180+", location: "Maryland" },
    { name: "Detroit Chapter", members: "220+", location: "Michigan" },
    { name: "Oklahoma City Chapter", members: "120+", location: "Oklahoma" },
    { name: "Atlanta Chapter", members: "160+", location: "Georgia" },
    { name: "Pittsburgh Chapter", members: "140+", location: "Pennsylvania" },
    { name: "Miami/Fort Lauderdale Chapter", members: "190+", location: "Florida" }
  ];

  return (
    <section id="chapters" className="py-20 bg-[#F3EFEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 font-bold text-[var(--amma-emerald)]">
            Our Chapters
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Connect with Muslim medical professionals in your area through our established chapters across the nation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {chapters.map((chapter, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold mb-2 text-[var(--amma-emerald)]">{chapter.name}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin size={16} />
                <span className="text-sm font-medium">{chapter.location}</span>
              </div>
              <button
                className="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-gray-50 text-[var(--amma-emerald)] border-2"
                style={{ borderColor: 'var(--amma-emerald)' }}
              >
                <Mail size={18} />
                <span>Contact Chapter</span>
              </button>
            </div>
          ))}
        </div>

        <div className="text-center p-12 rounded-3xl border-2 border-dashed border-[var(--amma-emerald)] bg-white/50">
          <h3 className="text-2xl font-bold mb-4 text-[var(--amma-emerald)]">
            Don't see your area?
          </h3>
          <p className="text-gray-700 mb-6 font-medium">
            Help us expand AMMA's reach by starting a chapter in your community.
          </p>
          <button className="px-8 py-3 rounded-lg text-white font-bold transition-all hover:opacity-90 bg-[var(--amma-emerald)] shadow-lg shadow-emerald-900/10">
            Start a Chapter
          </button>
        </div>
      </div>
    </section>
  );
};

export default Chapters;
