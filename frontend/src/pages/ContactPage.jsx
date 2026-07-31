import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import pagesData from '../data/pagesData.json';
import { motion } from 'framer-motion';
import { Mail, Clock, Send, Loader2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const { contact } = pagesData;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/public/contact', formData);
      toast.success('Thank you! Your message has been sent.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1">
        <section className="relative h-[40vh] md:h-[60vh] flex items-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="Contact Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#AD1F23]/95 to-[#AD1F23]/70"></div>
          </div>

          <div className="max-w-[1200px] mx-auto w-full relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-[clamp(32px,6vw,64px)] font-bold mb-6 tracking-tight leading-tight text-white">
                {contact.title}
              </h1>
              <p className="text-xl md:text-2xl text-red-50 max-w-2xl leading-relaxed">
                {contact.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-20">
              {/* Contact Form */}
              <div className="bg-gray-50 p-8 md:p-12 rounded-[48px]">
                <h3 className="text-3xl font-bold text-[#042C53] mb-8">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#AD1F23] outline-none transition-all" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#AD1F23] outline-none transition-all" 
                        placeholder="john@example.com" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#AD1F23] outline-none transition-all" 
                      placeholder="How can we help?" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                    <textarea 
                      name="message"
                      rows="5" 
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#AD1F23] outline-none transition-all resize-none" 
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>
                  <button 
                    disabled={loading}
                    className="w-full py-5 rounded-2xl bg-[#042C53] text-white font-bold flex items-center justify-center gap-3 hover:bg-[#042C53]/90 transition-all shadow-lg shadow-blue-900/10 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Info Cards */}
              <div className="space-y-12 py-6">
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Mail className="text-[#042C53]" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#042C53] mb-1">Email Us</h4>
                      <p className="text-gray-600 leading-relaxed">
                        <a 
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.info.email}&cc=bpiracha@hotmail.com,abdur833@yahoo.com`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#042C53] font-bold hover:text-[#AD1F23] transition-colors underline decoration-dotted underline-offset-4 cursor-pointer"
                        >
                          {contact.info.email}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Clock className="text-[#AD1F23]" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#042C53] mb-1">Office Hours</h4>
                      <p className="text-gray-600 leading-relaxed">{contact.info.hours}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#042C53] text-white p-8 rounded-[32px] relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-2">Need immediate assistance?</h4>
                    <p className="text-blue-100 opacity-70 mb-0">Our support team is available during office hours to help with your membership queries.</p>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
