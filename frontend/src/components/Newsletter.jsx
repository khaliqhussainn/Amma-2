import React from 'react';
import { Mail, ArrowRight, MessageCircle } from 'lucide-react';

const Newsletter = () => {
  return (
    <section id="contact" className="py-20 bg-[#F3EFEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Newsletter Card */}
          <div className="rounded-3xl p-10 bg-[var(--amma-burgundy)] text-white shadow-xl shadow-red-900/10">
            <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-white/20">
              <Mail className="w-7 h-7" />
            </div>
            <h2 className="text-3xl lg:text-4xl mb-4 font-bold">Stay Updated</h2>
            <p className="text-white/90 mb-8 text-lg font-medium">
              Subscribe to our newsletter for the latest news, events, and opportunities from AMMA National.
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg outline-none border-1 border-white/20 text-white font-medium"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg text-white font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2 bg-[var(--amma-emerald)]"
              >
                Subscribe
                <ArrowRight size={20} />
              </button>
            </form>
            <p className="text-white/70 text-sm mt-4 font-medium italic">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>

          {/* WhatsApp Card */}
          <div className="rounded-3xl p-10 bg-[var(--amma-emerald)] text-white shadow-xl shadow-emerald-900/10">
            <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-white/20">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h2 className="text-3xl lg:text-4xl mb-4 font-bold">Join Our Community</h2>
            <p className="text-white/90 mb-8 text-lg font-medium">
              Connect with fellow members, stay informed, and engage in real-time discussions on WhatsApp.
            </p>
            <a
              href="https://wa.me/community"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-white transition-all hover:shadow-xl"
              style={{ color: 'var(--amma-emerald)' }}
            >
              <MessageCircle size={24} />
              <span className="text-lg">Join WhatsApp Community</span>
              <ArrowRight size={20} />
            </a>
            <p className="text-white/70 text-sm mt-6 font-medium italic">
              Get instant updates and connect with 2,000+ members.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
