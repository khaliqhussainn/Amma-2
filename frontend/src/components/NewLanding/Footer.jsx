import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Loader2, Mail, Instagram } from 'lucide-react';

const FacebookIcon = () => (
  <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 11.5H10L11 7.5H7.5V5.5C7.5 4.47 7.5 3.5 9.5 3.5H11V0.14C10.674 0.097 9.443 0 8.142 0C5.428 0 3.5 1.657 3.5 4.7V7.5H0.5V11.5H3.5V20H7.5V11.5Z" fill="#181D27" />
  </svg>
);
const YoutubeIcon = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.543 2.498A2.506 2.506 0 0017.779.734C16.254.25 10 .25 10 .25S3.746.25 2.221.734A2.506 2.506 0 00.457 2.498C0 4.025 0 7.214 0 7.214s0 3.189.457 4.716a2.506 2.506 0 001.764 1.764C3.746 14.178 10 14.178 10 14.178s6.254 0 7.779-.484a2.507 2.507 0 001.764-1.764C20 10.403 20 7.214 20 7.214s0-3.189-.457-4.716zM8 10.178V4.25l5.196 2.964L8 10.178z" fill="#181D27" />
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.6.75H15.054L9.694 6.858 16 15.25h-4.937L7.196 10.169 2.771 15.25H.316L6.049 8.715 0 .75h5.063L8.558 5.393 12.6.75ZM11.74 13.77h1.359L4.324 2.141H2.865L11.74 13.77Z" fill="#181D27" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 1.428C0 .639.653 0 1.458 0h17.084C19.347 0 20 .639 20 1.428v17.144C20 19.362 19.347 20 18.542 20H1.458C.653 20 0 19.362 0 18.572V1.428ZM6.179 16.786V7.714H3.214v9.072h2.965ZM4.696 6.5c1 0 1.697-.733 1.697-1.643C6.375 3.929 5.696 3.214 4.714 3.214c-.982 0-1.696.715-1.696 1.643 0 .91.696 1.643 1.661 1.643h.017ZM10.804 16.786V11.714c0-.268.018-.535.089-.732.196-.536.678-1.089 1.5-1.089 1.071 0 1.5.821 1.5 2.036v4.857h2.964V11.57c0-2.75-1.464-4.017-3.41-4.017-1.554 0-2.268.803-2.661 1.375V7.714H7.821c.036.893 0 9.072 0 9.072h2.983Z" fill="#181D27" />
  </svg>
);

const SocialBtn = ({ children, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-[40px] h-[40px] border border-[#D5D7DA] rounded-full bg-white no-underline shrink-0 transition-colors duration-200 hover:border-[#AD1F23] hover:bg-[#fdf2f2]"
  >
    {children}
  </a>
);

const Col = ({ title, links }) => (
  <div className="flex flex-col gap-[20px] min-w-[100px]">
    <span className="font-sans font-semibold text-[clamp(14px,1.2vw,18px)] tracking-[-0.36px] text-[#181D27]">
      {title}
    </span>
    <div className="flex flex-col gap-[14px]">
      {links.map((l) => (
        l.href.startsWith('http') ? (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans font-normal text-[clamp(13px,1.1vw,16px)] tracking-[-0.32px] text-black no-underline transition-colors duration-200 hover:text-[#AD1F23]"
          >
            {l.label}
          </a>
        ) : (
          <Link
            key={l.label}
            to={l.href}
            className="font-sans font-normal text-[clamp(13px,1.1vw,16px)] tracking-[-0.32px] text-black no-underline transition-colors duration-200 hover:text-[#AD1F23]"
          >
            {l.label}
          </Link>
        )
      ))}
    </div>
  </div>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/public/subscribe', { email });
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-white border-t border-[#F2F2F7] pt-[clamp(40px,5vw,72px)] px-[4%] pb-[clamp(24px,3vw,40px)] box-border">
      {/* Main row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start w-full">
        {/* Left brand block */}
        <div className="flex flex-col gap-[16px] lg:col-span-4 md:col-span-1">
          <Link to="/">
            <img
              src="/logo.png"
              alt="AMMA Logo"
              className="w-[clamp(100px,12vw,160px)] h-auto object-contain"
            />
          </Link>
          <p className="font-sans font-medium text-[clamp(18px,2.2vw,32px)] leading-[1.2] tracking-[-1.28px] text-black m-0 max-w-[420px]">
            The Premier Network of Muslim Medical Professionals in the USA.
          </p>
          <div className="flex gap-[8px] pt-[4px]">
            <SocialBtn href="https://www.facebook.com/share/18ZuYQ6BGS/"><FacebookIcon /></SocialBtn>
            <SocialBtn href="https://www.youtube.com/@ammanational"><YoutubeIcon /></SocialBtn>
            <SocialBtn href="https://x.com/ammanational"><XIcon /></SocialBtn>
            <SocialBtn href="https://www.linkedin.com/company/ammanational/"><LinkedInIcon /></SocialBtn>
            <SocialBtn href="https://www.instagram.com/ammanational?igsh=YnAxaThkNjdxdzhh">
              <Instagram size={18} color="#181D27" />
            </SocialBtn>
          </div>
          <div className="pt-2">
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=info@ammanational.org&cc=bpiracha@hotmail.com,abdur833@yahoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#042C53] hover:text-[#AD1F23] transition-colors flex items-center gap-2 no-underline cursor-pointer"
            >
              <Mail size={16} />
              info@ammanational.org
            </a>
          </div>
        </div>

        {/* Right columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:col-span-5 md:col-span-1">
          <Col
            title="Product"
            links={[
              { label: 'Membership', href: '/membership-info' },
              { label: 'Donate', href: 'https://charitystack.com/donate/2b78c2eb-b329-4f23-a4e3-61088b0e1bde' },
              { label: 'Specialities', href: '/specialties' },
              { label: 'Chapters', href: '/chapters' },
              { label: 'Pricing Plans', href: '/membership-info' }
            ]}
          />
          <Col
            title="Company"
            links={[
              { label: 'About Us', href: '/about' },
              { label: 'Meet Our Team', href: '#' },
              { label: 'Blog / Insights', href: '#' },
              { label: 'FAQs', href: '#' },
              { label: 'Contact', href: '/contact' }
            ]}
          />
          <Col
            title="Legal & Support"
            links={[
              { label: 'Terms & Conditions', href: '#' },
              { label: 'Privacy Policy', href: '#' },
              { label: 'Cookie Policy', href: '#' },
              { label: 'Help Center', href: '#' }
            ]}
          />
        </div>

        {/* Newsletter Column */}
        <div className="flex flex-col gap-[20px] lg:col-span-3 md:col-span-2 md:mt-6 lg:mt-0 max-w-full">
            <span className="font-sans font-semibold text-[clamp(14px,1.2vw,18px)] tracking-[-0.36px] text-[#181D27]">
              Newsletter
            </span>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-8 lg:gap-[12px] w-full justify-between items-start">
              <div className="flex flex-col gap-[12px] flex-1 w-full">
                <p className="font-sans font-normal text-[clamp(13px,1.1vw,16px)] text-[#666] m-0">
                  Subscribe to stay updated with the latest news and events.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-[10px] items-center w-full">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full sm:flex-1 h-[48px] px-[20px] rounded-[12px] border border-[#D5D7DA] font-sans text-[14px] outline-none transition-all focus:border-[#AD1F23] focus:ring-2 focus:ring-[#AD1F23]/10"
                  />
                  <button
                    disabled={loading}
                    className="w-full sm:w-auto h-[48px] px-[24px] bg-[#AD1F23] hover:bg-[#911a1d] text-white rounded-[12px] font-sans font-bold text-[14px] border-none cursor-pointer transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-70 flex items-center justify-center min-w-[80px]"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Join'}
                  </button>
                </form>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-block w-fit shrink-0 sm:mx-0 mx-auto">
                <p className="text-[10px] font-extrabold text-[#AD1F23] uppercase tracking-widest mb-3 text-center">Scan to Support AMMA</p>
                <div className="bg-white p-2 rounded-xl shadow-sm">
                  <img
                    src="/Donation-QR.PNG"
                    alt="Donation QR Code"
                    className="w-32 h-32 lg:w-40 lg:h-40 object-contain mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-[clamp(24px,3vw,40px)] pt-[clamp(16px,2vw,24px)] border-t border-[#F2F2F7] text-center">
        <p className="font-sans font-normal text-[clamp(11px,0.9vw,14px)] text-[#999] m-0">
          © {new Date().getFullYear()} American Muslim Medical Association. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
