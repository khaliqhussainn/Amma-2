import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, User, Clock, Video, PlusCircle, CheckCircle } from 'lucide-react';
import { upcomingEvents, eventCategories } from '../data/eventsData';
import EventRegistrationModal from '../components/EventRegistrationModal';



const EventsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // event object

  // Filter logic
  const filteredEvents = upcomingEvents.filter(event => {
    return selectedCategory === 'All' || event.category === selectedCategory;
  });

  const handleOpenModal = (event) => {
    if (registeredEvents.includes(event.id)) return;
    setActiveModal(event);
  };

  const handleRegistrationSuccess = (eventId) => {
    setRegisteredEvents(prev => [...prev, eventId]);
    setActiveModal(null);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1 bg-[#f8f9ff]">
        {/* Banner Hero */}
        <section className="relative bg-[#042C53] text-white py-16 md:py-20 px-[4%] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] islamic-pattern pointer-events-none" />
          <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[120%] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)] blur-3xl pointer-events-none" />

          <div className="max-w-container-max mx-auto px-md relative z-10 space-y-4">
            <span className="inline-block py-1 px-3.5 rounded-full bg-white/10 text-white/95 text-xs font-bold tracking-widest uppercase">
              Events Calendar
            </span>
            <h1 className="text-[clamp(36px,5vw,56px)] font-display font-extrabold tracking-tight leading-none">
              Signature Engagements
            </h1>
            <p className="text-white/70 text-body-md font-medium max-w-2xl">
              Connect, learn, and grow. Join clinical symposia, networking dinners, and webinars organized by national committees and local chapters.
            </p>
          </div>
        </section>

        {/* Categories Bar */}
        <section className="border-b border-[#F2F2F7] bg-white sticky top-[80px] z-50 py-4 px-[4%]">
          <div className="max-w-container-max mx-auto px-md flex gap-2 overflow-x-auto hide-scrollbar">
            {eventCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-6 rounded-full font-sans font-bold text-sm cursor-pointer transition-all shrink-0 border border-transparent ${selectedCategory === cat
                  ? 'bg-[#042C53] text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-[#333333]'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-12 md:py-16 px-[4%]">
          <div className="max-w-container-max mx-auto px-md space-y-12">
            <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#666666] font-sans">
                Upcoming Sessions ({filteredEvents.length})
              </h2>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredEvents.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredEvents.map((event) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      key={event.id}
                      className="bg-white rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group overflow-hidden"
                    >
                      <div>
                        {/* Image Header with Date Overlay */}
                        <div className="aspect-[16/10] relative overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-lg font-display font-bold text-xs text-[#042C53] shadow-md text-center">
                            {event.badgeDate}
                          </div>
                          <span className="absolute top-4 left-4 bg-[#042C53] text-white py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                            {event.isVirtual ? <Video size={12} /> : null}
                            {event.category}
                          </span>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 space-y-4">
                          <h3 className="font-display font-bold text-xl text-[#042C53] leading-snug group-hover:text-[#AD1F23] transition-colors duration-300">
                            {event.title}
                          </h3>
                          <p className="text-on-surface-variant text-sm font-sans leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      {/* Details & CTA Footer */}
                      <div className="p-6 pt-0 space-y-4">
                        <div className="bg-[#f8f9ff] rounded-xl p-4 space-y-2 text-xs font-sans text-gray-600 border border-[#F2F2F7]">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#AD1F23] shrink-0" />
                            <span className="font-semibold text-gray-800">{event.dateText}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400 shrink-0" />
                            <span>{event.timeText}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 pt-1 border-t border-[#F2F2F7]">
                            <User size={14} className="text-[#042C53] shrink-0" />
                            <span className="font-medium">Hosted by: {event.host}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenModal(event)}
                          className={`w-full py-3 rounded-xl font-sans font-bold text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shadow-sm border ${registeredEvents.includes(event.id)
                            ? 'bg-emerald-500 border-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-[#AD1F23] border-[#AD1F23] hover:bg-[#911a1d] text-white hover:shadow-md'
                            }`}
                        >
                          {registeredEvents.includes(event.id) ? (
                            <>
                              <CheckCircle size={16} />
                              Registered
                            </>
                          ) : (
                            'Register Now'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-outline-variant/10 shadow-sm">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="font-display font-bold text-xl text-[#042C53] mb-2">No Events Found</h3>
                  <p className="text-gray-500 font-sans text-sm max-w-sm mx-auto">
                    There are currently no upcoming events listed under the {selectedCategory} category.
                  </p>
                </div>
              )}
            </AnimatePresence>

            {/* Host local chapters CTA banner */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#042C53] rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 shadow-premium"
            >
              <div className="absolute inset-0 opacity-[0.03] islamic-pattern pointer-events-none" />
              <div className="space-y-3 relative z-10 text-center md:text-left">
                <h3 className="font-display font-extrabold text-2xl md:text-3xl leading-tight">
                  Want to Launch a Chapter Event?
                </h3>
                <p className="text-white/70 text-sm md:text-base font-sans max-w-xl">
                  AMMA supports local chapters in hosting networking sessions, clinical debates, dinners, and CME forums. Get in touch with us to align support.
                </p>
              </div>
              <a
                href="/contact"
                className="w-full md:w-auto py-4 px-8 bg-[#AD1F23] hover:bg-[#911a1d] rounded-xl text-white font-bold text-center text-sm transition-all duration-200 shadow-md shrink-0 flex items-center justify-center gap-2 group relative z-10 cursor-pointer"
              >
                <PlusCircle size={18} />
                Get Event Support
              </a>
            </motion.div> */}
          </div>
        </section>
      </main>

      {/* Registration Modal */}
      {activeModal && (
        <EventRegistrationModal
          event={activeModal}
          onClose={() => setActiveModal(null)}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      <Footer />
    </div>
  );
};

export default EventsPage;
