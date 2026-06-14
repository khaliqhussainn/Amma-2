import React from 'react';
import { ArrowRight } from 'lucide-react';

const Specialties = () => {
  const specialties = [
    { code: "AMIM", name: "Internal Medicine" },
    { code: "AMFM", name: "Family Medicine" },
    { code: "AMPS", name: "Pediatric Surgery" },
    { code: "AMEM", name: "Emergency Medicine" },
    { code: "AMCARD", name: "Cardiology" },
    { code: "AMORTH", name: "Orthopedic Surgery" },
    { code: "AMRAD", name: "Radiology" },
    { code: "AMANES", name: "Anesthesiology" },
    { code: "AMPSYCH", name: "Psychiatry" },
    { code: "AMOBGYN", name: "Obstetrics & Gynecology" },
    { code: "AMDERM", name: "Dermatology" },
    { code: "AMNEURO", name: "Neurology" }
  ];

  return (
    <section id="specialties" className="py-20 bg-[#F3EFEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 font-bold text-[var(--amma-emerald)]">
            Medical Specialties
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Connect with professionals across diverse medical fields and specialties.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {specialties.map((spec, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[var(--amma-emerald)]"
            >
              <div className="text-xl font-bold mb-2 text-[var(--amma-emerald)]">
                {spec.code}
              </div>
              <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {spec.name}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 font-bold transition-all hover:shadow-lg border-[var(--amma-emerald)] text-[var(--amma-emerald)] hover:bg-[var(--amma-emerald)] hover:text-white">
            View Full Clinical Directory
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Specialties;
