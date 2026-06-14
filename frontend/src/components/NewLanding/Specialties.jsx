import React, { useState } from 'react';
import { 
  Activity, Brain, Microscope, Baby, Maximize, AlertTriangle, 
  Stethoscope, Heart, Eye, Bone, User, Pill, ChevronDown 
} from 'lucide-react';

const specialtiesData = [
  { icon: Activity, name: "Cardiology", category: "Internal Medicine" },
  { icon: Brain, name: "Neurology", category: "Internal Medicine" },
  { icon: Microscope, name: "Oncology", category: "Internal Medicine" },
  { icon: Baby, name: "Pediatrics", category: "All Fields" },
  { icon: Maximize, name: "Radiology", category: "All Fields" },
  { icon: AlertTriangle, name: "Emergency", category: "Surgery" },
  { icon: Stethoscope, name: "Family Med", category: "Internal Medicine" },
  { icon: Heart, name: "Vascular", category: "Surgery" },
  { icon: Eye, name: "Ophthalmology", category: "Surgery" },
  { icon: Bone, name: "Orthopedics", category: "Surgery" },
  { icon: User, name: "Dermatology", category: "All Fields" },
  { icon: Pill, name: "Pharmacy", category: "All Fields" },
];

const Specialties = () => {
  const [activeTab, setActiveTab] = useState('All Fields');
  const [showMore, setShowMore] = useState(false);

  const tabs = ['All Fields', 'Surgery', 'Internal Medicine'];

  const filteredSpecialties = specialtiesData.filter(item => 
    activeTab === 'All Fields' || item.category === activeTab
  );

  const visibleSpecialties = showMore ? filteredSpecialties : filteredSpecialties.slice(0, 6);

  return (
    <section className="py-xl">
      <div className="max-w-container-max mx-auto px-md">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-xl gap-md">
          <div className="max-w-2xl">
            <h2 className="font-display-lg text-headline-lg text-primary mb-xs">Medical Specialties</h2>
            <p className="text-on-surface-variant text-body-lg leading-relaxed">Facilitating cross-specialty collaboration and expert networking.</p>
          </div>
          <div className="flex gap-xs bg-surface-container p-1 rounded-full overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <span 
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setShowMore(false);
                }}
                className={`${
                  activeTab === tab 
                    ? 'bg-secondary text-white shadow-md' 
                    : 'text-on-surface-variant hover:bg-white/50'
                } px-lg py-sm rounded-full text-label-md font-bold cursor-pointer whitespace-nowrap transition-all`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md transition-all duration-500">
          {visibleSpecialties.map((item, index) => (
            <div 
              key={`${activeTab}-${index}`} 
              className="bg-white aspect-square flex flex-col items-center justify-center rounded-2xl shadow-premium border border-outline-variant/10 hover:border-secondary transition-all cursor-pointer group hover:-translate-y-2 p-md text-center"
            >
              <div className="mb-sm transition-transform duration-300 group-hover:scale-125 text-secondary">
                <item.icon size={40} />
              </div>
              <span className="font-label-md text-primary uppercase tracking-tighter">{item.name}</span>
            </div>
          ))}
        </div>

        {filteredSpecialties.length > 6 && (
          <div className="mt-xl text-center">
            <button 
              onClick={() => setShowMore(!showMore)}
              className="inline-flex items-center gap-2 px-xl py-md rounded-full border border-outline-variant/30 text-primary font-bold text-label-md hover:bg-primary hover:text-white transition-all group shadow-sm active:scale-95"
            >
              {showMore ? 'Show Less' : 'Explore More Specialties'}
              <ChevronDown className={`transition-transform duration-300 ${showMore ? 'rotate-180' : ''}`} size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Specialties;
