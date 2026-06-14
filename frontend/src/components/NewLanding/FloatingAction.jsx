import React from 'react';
import { HelpCircle } from 'lucide-react';

const FloatingAction = () => {
  return (
    <a 
      className="fixed bottom-lg right-lg w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(176,45,41,0.5)] hover:scale-110 transition-all z-[200] group" 
      href="#"
    >
      <HelpCircle size={32} />
      <span className="absolute right-full mr-md glass-panel px-md py-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap text-label-md font-bold text-primary shadow-xl">
        Contact Membership Support
      </span>
    </a>
  );
};

export default FloatingAction;
