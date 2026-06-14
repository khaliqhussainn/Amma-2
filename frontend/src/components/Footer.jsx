import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MessageCircle, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="AMMA Logo" className="h-24 w-auto object-contain" />
              <div className="font-bold text-gray-900 leading-tight">AMMA National</div>
            </div>
            <p className="text-gray-600 mb-6 font-medium text-sm leading-relaxed">
              American Muslims Medical Association - Healing humanity through faith, excellence, and service.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Facebook size={20} />, href: "https://www.facebook.com/share/18ZuYQ6BGS/" },
                { icon: <Twitter size={20} />, href: "https://x.com/ammanational" },
                { icon: <Instagram size={20} />, href: "https://www.instagram.com/ammanational?igsh=YnAxaThkNjdxdzhh" },
                { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/company/ammanational/" },
                { icon: <Youtube size={20} />, href: "https://www.youtube.com/@ammanational" }
              ].map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-[var(--amma-emerald)] hover:bg-[var(--amma-emerald)] hover:text-white hover:border-transparent transition-all shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 font-bold text-[var(--amma-emerald)] uppercase tracking-wider text-xs">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "#about" },
                { label: "Chapters", href: "#chapters" },
                { label: "Specialties", href: "#specialties" },
                { label: "Membership", href: "#membership" },
                { label: "Contact", href: "#contact" },
                { label: "Donate", href: "#donate" }
              ].map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-600 hover:text-[var(--amma-emerald)] transition-colors font-medium text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-6 font-bold text-[var(--amma-emerald)] uppercase tracking-wider text-xs">Resources</h3>
            <ul className="space-y-3">
              {[
                { label: "Clinical Directory", href: "#" },
                { label: "CME Opportunities", href: "#" },
                { label: "Member Resources", href: "#" },
                { label: "News & Updates", href: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-600 hover:text-[var(--amma-emerald)] transition-colors font-medium text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="https://wa.me/community" className="text-gray-600 hover:text-[var(--amma-emerald)] transition-colors font-medium text-sm flex items-center gap-2">
                  <MessageCircle size={16} />
                  WhatsApp Community
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 font-bold text-[var(--amma-emerald)] uppercase tracking-wider text-xs">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--amma-emerald)]" />
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@ammanational.org&cc=bpiracha@hotmail.com,abdur833@yahoo.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--amma-emerald)] transition-colors font-medium text-sm">
                  info@ammanational.org
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--amma-emerald)]" />
                <a href="tel:+1234567890" className="hover:text-[var(--amma-emerald)] transition-colors font-medium text-sm">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-xs font-medium">
            &copy; {new Date().getFullYear()} AMMA National. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
