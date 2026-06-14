import React, { useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';

const Header = ({ onJoinClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="AMMA Logo" className="h-18 w-auto object-contain" />
            <div className="hidden sm:block">
              <div className="font-bold text-gray-900 leading-tight">AMMA National</div>
              <div className="text-[7px] uppercase tracking-widest text-gray-500 font-bold">American Muslims Medical Association</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-[var(--amma-emerald)] transition-colors">Home</a>
            <a href="#about" className="text-gray-700 hover:text-[var(--amma-emerald)] transition-colors">About</a>
            <a href="#chapters" className="text-gray-700 hover:text-[var(--amma-emerald)] transition-colors">Chapters</a>
            <a href="#specialties" className="text-gray-700 hover:text-[var(--amma-emerald)] transition-colors">Specialties</a>
            <a href="#membership" className="text-gray-700 hover:text-[var(--amma-emerald)] transition-colors">Membership</a>
            <a href="#contact" className="text-gray-700 hover:text-[var(--amma-emerald)] transition-colors">Contact</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="px-6 py-2.5 rounded-lg border-2 transition-all border-[var(--amma-emerald)] text-[var(--amma-emerald)] hover:bg-[var(--amma-emerald)] hover:text-white">
              Donate
            </button>
            <button 
              onClick={onJoinClick}
              className="px-6 py-2.5 rounded-lg text-white transition-all bg-[var(--amma-emerald)] hover:opacity-90"
            >
              Become a Member
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:text-[var(--amma-emerald)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 bg-white absolute top-20 left-0 w-full shadow-lg animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col px-4 gap-4">
              <a href="#home" className="text-gray-700 hover:text-[var(--amma-emerald)] py-2 border-b border-gray-50">Home</a>
              <a href="#about" className="text-gray-700 hover:text-[var(--amma-emerald)] py-2 border-b border-gray-50">About</a>
              <a href="#chapters" className="text-gray-700 hover:text-[var(--amma-emerald)] py-2 border-b border-gray-50">Chapters</a>
              <a href="#specialties" className="text-gray-700 hover:text-[var(--amma-emerald)] py-2 border-b border-gray-50">Specialties</a>
              <a href="#membership" className="text-gray-700 hover:text-[var(--amma-emerald)] py-2 border-b border-gray-50">Membership</a>
              <a href="#contact" className="text-gray-700 hover:text-[var(--amma-emerald)] py-2 border-b border-gray-50">Contact</a>
              <div className="flex flex-col gap-3 pt-2 pb-4">
                <button className="w-full px-6 py-2.5 rounded-lg border-2 border-[var(--amma-emerald)] text-[var(--amma-emerald)]">
                  Donate
                </button>
                <button 
                  onClick={onJoinClick}
                  className="w-full px-6 py-2.5 rounded-lg text-white bg-[var(--amma-emerald)]"
                >
                  Become a Member
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>

    </header>
  );
};

export default Header;
