import React, { useState, useEffect, useCallback } from 'react';

const slides = [
  { src: '/Slide-1.png', alt: 'Estimated number of Muslim Healthcare Professionals in the US' },
  { src: '/Our Vision Within One Year.png', alt: 'Our Vision Within One Year', rounded: true },
  { src: '/Slide-2.png', alt: 'Why AMMA - Together We Grow' },
  // { src: '/Slide-3.png', alt: 'Chapters and Specialities' },
  { src: '/Slide-4.png', alt: 'AMMA Timeline' },
];

const Hero = ({ onJoinClick }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (paused) return;
    // Specifically reduce speed on mobile (8000ms) vs desktop (5000ms)
    const t = setInterval(next, isMobile ? 8000 : 5000);
    return () => clearInterval(t);
  }, [paused, next, isMobile]);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setPaused(true); // Pause while touching
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setPaused(false); // Resume after touching
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }
  };

  return (
    <section className="w-full bg-white px-[1.8%] pt-[12px] pb-0 box-border flex flex-col gap-[clamp(40px,6vw,80px)]">
      {/* ── Carousel ── */}
      <div
        className="relative w-full aspect-[4/3] md:aspect-[1390/640] rounded-[32px] md:rounded-[clamp(32px,6vw,88px)] overflow-hidden box-border bg-[radial-gradient(101.25%_101.25%_at_90.36%_5.78%,_#E0ECFC_0%,_#F0F6FD_42%,_#F5F9FD_100%)]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Track */}
        <div
          className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: `${slides.length * 100}%`,
            transform: `translateX(-${(current * 100) / slides.length}%)`,
          }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              className="h-full shrink-0 flex items-center justify-center"
              style={{ width: `${100 / slides.length}%` }}
            >
              <img
                src={s.src}
                alt={s.alt}
                draggable={false}
                className="w-full h-full object-contain md:object-cover object-center select-none pointer-events-none"
                style={s.rounded ? { borderRadius: '40px' } : undefined}
              />
            </div>
          ))}
        </div>

        {/* Prev arrow - hidden on small mobile */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="hidden sm:flex absolute left-[2%] top-1/2 -translate-y-1/2 w-[clamp(32px,3.2vw,48px)] h-[clamp(32px,3.2vw,48px)] rounded-full bg-[rgba(255,255,255,0.88)] border-none cursor-pointer text-[clamp(18px,2vw,26px)] text-[#042C53] items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.14)] z-10 transition-colors duration-200 hover:bg-white"
        >
          ‹
        </button>

        {/* Next arrow - hidden on small mobile */}
        <button
          onClick={next}
          aria-label="Next slide"
          className="hidden sm:flex absolute right-[2%] top-1/2 -translate-y-1/2 w-[clamp(32px,3.2vw,48px)] h-[clamp(32px,3.2vw,48px)] rounded-full bg-[rgba(255,255,255,0.88)] border-none cursor-pointer text-[clamp(18px,2vw,26px)] text-[#042C53] items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.14)] z-10 transition-colors duration-200 hover:bg-white"
        >
          ›
        </button>

        {/* Dots */}
        <div className="block md:hidden absolute bottom-[3%] left-1/2 -translate-x-1/2 flex gap-[8px] z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-[8px] rounded-[4px] border-none p-0 cursor-pointer transition-all duration-300 ease-in-out ${i === current ? 'w-[32px] bg-[#AD1F23]' : 'w-[8px] bg-[rgba(4,44,83,0.35)]'
                }`}
            />
          ))}
        </div>
      </div>

      {/* ── CTA Bar ── */}
      <div
        className="w-full relative rounded-[40px] md:rounded-[clamp(40px,8vw,160px)] py-[32px] md:py-[clamp(24px,3vw,40px)] px-[24px] md:px-[clamp(24px,5vw,80px)] flex flex-col md:flex-row justify-between items-center gap-[24px] box-border overflow-hidden text-center md:text-left"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url("/american-flag.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Left content */}
        <div className="flex flex-col md:flex-row items-center gap-[clamp(16px,2.5vw,32px)] relative z-10">
          <div className="w-[120px] md:w-[clamp(100px,12vw,160px)] h-[60px] md:h-[clamp(50px,6vw,80px)] rounded-[60px] bg-white shrink-0 flex items-center justify-center overflow-hidden border-[3px] border-white/10 shadow-lg">
            <img
              src="/become-member.png"
              alt="Become a member"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <span className="font-sans font-bold text-[22px] md:text-[clamp(18px,2.2vw,30px)] leading-[1.2] text-white">
            Join the Muslim Medical Professionals Community.
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={onJoinClick}
          className="relative z-10 w-full md:w-auto py-[16px] md:py-[clamp(12px,1.4vw,18px)] px-[32px] md:px-[clamp(24px,3vw,48px)] min-h-[56px] bg-[#AD1F23] hover:bg-[#911a1d] border border-white/10 rounded-[40px] font-sans font-bold text-[16px] md:text-[clamp(14px,1.2vw,18px)] text-white cursor-pointer whitespace-nowrap shrink-0 transition-all duration-300 shadow-md"
        >
          Become a member today
        </button>
      </div>
    </section>
  );
};

export default Hero;
