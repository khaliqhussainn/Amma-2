import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onJoinClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const { user, logout } = useAuth();

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Chapters', href: '/chapters' },
    { label: 'Specialities', href: '/specialties' },
    { label: 'Membership', href: '/membership-info' },
    { label: 'News & Events', href: '/news-events' },
    { label: 'Donate', href: 'https://charitystack.com/donate/2b78c2eb-b329-4f23-a4e3-61088b0e1bde' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-[100] bg-white">
      {/* ── Top Bar ── */}
      {showTopBar && (
        <div className="bg-[#042C53] py-2 px-[4%] text-center relative">
          <p className="text-white text-[11px] md:text-[13px] font-sans m-0 tracking-wide">
            Join the Muslim Medical Professionals Community
          </p>
          <button
            onClick={() => setShowTopBar(false)}
            className="absolute right-[2%] top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-transparent border-none cursor-pointer transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
      {/* ── Nav Row ── */}
      <nav className="flex flex-row items-center justify-between h-[80px] px-[4%] w-full box-border border-b border-[#F2F2F7]">
        {/* Logo */}
        <Link to="/" className="flex items-center no-underline shrink-0">
          <img src="/logo.png" alt="AMMA Logo" className="w-[clamp(110px,15vw,160px)] max-h-[85px] h-auto object-contain" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex flex-row items-center gap-[clamp(14px,2vw,32px)] flex-1 justify-center">
          {navLinks.map((link) => (
            link.href.startsWith('http') ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-normal text-[clamp(12px,1vw,14px)] text-[#1A1A1A] no-underline whitespace-nowrap transition-colors duration-200 hover:text-[#AD1F23]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="font-sans font-normal text-[clamp(12px,1vw,14px)] text-[#1A1A1A] no-underline whitespace-nowrap transition-colors duration-200 hover:text-[#AD1F23]"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-[8px] shrink-0">
          {user ? (
            <>
              <Link
                to={user.role === 'ADMIN' ? '/admin/dashboard' : user.status === 'PENDING' ? '/pending-approval' : '/member/dashboard'}
                className="px-[clamp(16px,2vw,32px)] py-[7px] h-[34px] border border-[#CCCCCC] rounded-[17px] bg-transparent font-sans text-[clamp(11px,1vw,13px)] text-[#333333] cursor-pointer whitespace-nowrap transition-colors duration-200 hover:bg-[#f5f5f5] flex items-center justify-center no-underline font-bold"
              >
                {user.status === 'PENDING' ? 'View Status' : 'Dashboard'}
              </Link>
              <button
                onClick={logout}
                className="px-[clamp(16px,2vw,32px)] py-[7px] h-[34px] bg-[#AD1F23] rounded-[17px] border-none font-sans text-[clamp(11px,1vw,13px)] text-white cursor-pointer whitespace-nowrap transition-colors duration-200 hover:bg-[#8e1214] font-bold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-[clamp(16px,2vw,32px)] py-[7px] h-[34px] border border-[#CCCCCC] rounded-[17px] bg-transparent font-sans text-[clamp(11px,1vw,13px)] text-[#333333] cursor-pointer whitespace-nowrap transition-colors duration-200 hover:bg-[#f5f5f5] flex items-center justify-center no-underline"
              >
                Login
              </Link>
              <button
                onClick={onJoinClick}
                className="px-[clamp(16px,2vw,32px)] py-[7px] h-[34px] bg-[#AD1F23] rounded-[17px] border-none font-sans text-[clamp(11px,1vw,13px)] text-white cursor-pointer whitespace-nowrap transition-colors duration-200 hover:bg-[#8e1214]"
              >
                Join AMMA
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex lg:hidden flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2 z-50"
        >
          <div className={`w-6 h-0.5 bg-[#042C53] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-[#042C53] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-[#042C53] transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <div className={`fixed inset-0 bg-white z-[110] transition-transform duration-300 ease-in-out transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden flex flex-col p-[8%] pt-8 overflow-y-auto`}>
        <div className="flex justify-between items-start mb-10">
          <div className="flex flex-col gap-3">
            <img src="/logo.png" alt="AMMA Logo" className="w-[88px] h-auto object-contain" />
            <span className="text-[15px] font-bold text-[#042C53] leading-snug font-sans tracking-tight">
              American Muslims<br />Medical Association
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 -mr-2 -mt-2 text-[#AD1F23] bg-transparent border-none cursor-pointer"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
            link.href.startsWith('http') ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="font-sans font-bold text-2xl text-[#1A1A1A] no-underline"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-sans font-bold text-2xl text-[#1A1A1A] no-underline"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4">
          {user ? (
            <>
              <Link
                to={user.role === 'ADMIN' ? '/admin/dashboard' : user.status === 'PENDING' ? '/pending-approval' : '/member/dashboard'}
                onClick={() => setMenuOpen(false)}
                className="w-full h-14 border border-[#CCCCCC] rounded-[30px] font-sans font-bold text-lg text-[#333333] flex items-center justify-center no-underline"
              >
                {user.status === 'PENDING' ? 'View Status' : 'Dashboard'}
              </Link>
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="w-full h-14 bg-[#AD1F23] rounded-[30px] border-none font-sans font-bold text-lg text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full h-14 border border-[#CCCCCC] rounded-[30px] font-sans font-bold text-lg text-[#333333] flex items-center justify-center no-underline"
              >
                Login
              </Link>
              <button
                onClick={() => { setMenuOpen(false); onJoinClick(); }}
                className="w-full h-14 bg-[#AD1F23] rounded-[30px] border-none font-sans font-bold text-lg text-white"
              >
                Join AMMA
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
