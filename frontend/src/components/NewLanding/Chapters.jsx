import React from 'react';
import { PlusCircle } from 'lucide-react';

const Chapters = () => {
  const cities = ["New Jersey", "Baltimore", "Detroit", "Oklahoma City", "Atlanta", "Pittsburgh"];

  return (
    <section className="py-xl bg-surface-container-low overflow-hidden">
      <div className="max-w-container-max mx-auto px-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          <div className="space-y-lg">
            <h2 className="font-display-lg text-headline-lg text-primary">
              A Growing Nationwide <br/>
              <span className="text-secondary">Infrastructure</span>
            </h2>
            <p className="text-on-surface-variant text-body-lg max-w-2xl leading-relaxed">
              Our local chapters represent the vibrant communities of Muslim healthcare leaders across American cities.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
              {cities.map((city, index) => (
                <div key={index} className="px-md py-base bg-white rounded-xl shadow-sm border border-outline-variant/20 font-label-md text-center hover:shadow-md transition-shadow">
                  {city}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-xs text-secondary font-bold text-label-md uppercase tracking-widest pt-md">
              <span className="animate-pulse flex items-center gap-2">
                <PlusCircle size={20} /> 8 New Cities Loading
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-secondary/10 blur-3xl rounded-full"></div>
            <div className="relative bg-primary-container rounded-3xl aspect-[4/3] overflow-hidden shadow-premium group">
              <img 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                alt="Stylized network map" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFMTtsFdlcxNoMjymtev-BWq0Fb49A3rRdf5iHB7y-D9uTZAFntG2yw_UaBnc6b_L544rVnQCGR91XWIkmTF-th8IE9A6zodE0eUNu9-PIuMnRXM640jmgO6xpuAslR0pFQpGwKodevyDeYmrdER8JebGqKT0GnXTMC8WPkECgt2rkqQujbqo5cAdiLsUX-HQakquC_Wd_NmrvK40u2DcFXBtCQfS-_IJBo3eO9AX0bOuT45c9BISkxZmOVdPxmvDMWrdBORA3odgk" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 via-transparent to-transparent flex items-center justify-center p-xl">
                <button className="bg-white text-primary px-lg py-md rounded-full font-bold text-label-md tracking-widest shadow-2xl hover:scale-105 transition-all">
                  Launch Local Chapter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chapters;
