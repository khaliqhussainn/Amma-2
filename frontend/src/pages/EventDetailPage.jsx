import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, User, ArrowLeft, Share2, Twitter,
  Linkedin, Facebook, Link2, ArrowRight, CalendarDays,
  MapPin, Video, Award, CheckCircle, Camera, X
} from 'lucide-react';
import { upcomingEvents } from '../data/eventsData';
import toast from 'react-hot-toast';

const categoryColors = {
  National: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Educational: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  Chapters: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Webinars: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
};

const EventDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(null);

  const event = upcomingEvents.find(e => e.slug === slug);
  const otherEvents = upcomingEvents.filter(e => e.slug !== slug).slice(0, 3);

  // Check if event is expired/past based on current system time (July 19, 2026)
  const isPast = event ? new Date(event.date) < new Date('2026-07-19') : false;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (!event) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans">
        <Navbar onJoinClick={() => navigate('/register')} />
        <main className="flex-1 flex items-center justify-center bg-[#f8f9ff]">
          <div className="text-center py-24 px-6">
            <CalendarDays className="w-20 h-20 text-gray-300 mx-auto mb-6" strokeWidth={1.5} />
            <h1 className="font-display font-bold text-3xl text-[#042C53] mb-3">Event Not Found</h1>
            <p className="text-gray-500 font-sans text-base mb-8 max-w-sm mx-auto">
              This event does not exist or may have been completed.
            </p>
            <button
              onClick={() => navigate('/news-events?tab=events')}
              className="inline-flex items-center gap-2 font-sans font-bold text-sm bg-[#AD1F23] text-white px-6 py-3 rounded-xl hover:bg-[#911a1d] transition-all cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to News &amp; Events
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryStyle = categoryColors[event.category] || { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1 bg-[#f8f9ff]">

        {/* ─── Hero Image Block ─── */}
        <div className="relative w-full h-[55vh] min-h-[380px] max-h-[600px] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#042C53]/90 via-[#042C53]/40 to-transparent" />

          {/* Breadcrumbs inside hero */}
          <div className="absolute top-6 left-0 right-0 px-[4%]">
            <div className="max-w-5xl mx-auto">
              <nav className="flex items-center gap-2 text-white/70 text-xs font-sans font-semibold">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link to="/news-events?tab=events" className="hover:text-white transition-colors">Events</Link>
                <span>/</span>
                <span className="text-white truncate max-w-[200px]">{event.title}</span>
              </nav>
            </div>
          </div>

          {/* Hero Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-[4%] pb-10">
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${categoryStyle.bg} ${categoryStyle.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`} />
                  {event.category}
                </span>
                {isPast ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500 text-white">
                    Past Event
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#AD1F23] text-white">
                    Upcoming
                  </span>
                )}
                {event.isVirtual && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#042C53] text-white flex items-center gap-1">
                    <Video size={12} /> Virtual
                  </span>
                )}
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-display font-extrabold text-[clamp(24px,4vw,48px)] text-white leading-tight max-w-3xl"
              >
                {event.title}
              </motion.h1>
              <div className="flex items-center gap-5 text-white/75 text-xs font-sans flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#AD1F23]" />
                  {event.dateText}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {event.timeText}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {event.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Content Section ─── */}
        <section className="py-12 px-[4%]">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

              {/* ── Main Event Body ── */}
              <div className="flex-1 min-w-0">

                {/* Host Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex items-center justify-between gap-4 mb-8 p-5 bg-white rounded-2xl border border-[#F2F2F7] shadow-sm flex-wrap"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#042C53]/10 flex items-center justify-center font-display font-bold text-[#042C53] text-lg shrink-0">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-sans font-bold text-gray-400 text-[10px] uppercase tracking-wider">Hosted By</p>
                      <p className="font-sans font-bold text-[#042C53] text-sm">{event.host}</p>
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 font-sans mr-1">Share:</span>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(event.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2] hover:text-white text-[#1DA1F2] flex items-center justify-center transition-all duration-200 cursor-pointer"
                    >
                      <Twitter size={15} />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-[#0077B5]/10 hover:bg-[#0077B5] hover:text-white text-[#0077B5] flex items-center justify-center transition-all duration-200 cursor-pointer"
                    >
                      <Linkedin size={15} />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2] hover:text-white text-[#1877F2] flex items-center justify-center transition-all duration-200 cursor-pointer"
                    >
                      <Facebook size={15} />
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#042C53] hover:text-white text-gray-600 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    >
                      <Link2 size={15} />
                    </button>
                  </div>
                </motion.div>

                {/* Event Body Content */}
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="prose-article space-y-6"
                >
                  {event.content ? (
                    event.content.map((block, index) => {
                      if (block.type === 'intro') {
                        return (
                          <p key={index} className="text-lg text-[#333333] font-sans leading-relaxed font-medium border-l-4 border-[#AD1F23] pl-5 py-1">
                            {block.text}
                          </p>
                        );
                      }
                      if (block.type === 'heading') {
                        return (
                          <h2 key={index} className="font-display font-bold text-2xl text-[#042C53] mt-10 mb-2 leading-snug">
                            {block.text}
                          </h2>
                        );
                      }
                      if (block.type === 'paragraph') {
                        return (
                          <p key={index} className="text-base text-[#444444] font-sans leading-relaxed">
                            {block.text}
                          </p>
                        );
                      }
                      if (block.type === 'quote') {
                        return (
                          <blockquote
                            key={index}
                            className="relative my-8 bg-gradient-to-br from-[#042C53]/5 to-[#042C53]/10 rounded-2xl p-7 border-l-4 border-[#042C53]"
                          >
                            <span className="absolute top-4 left-6 text-5xl text-[#042C53]/20 font-serif leading-none select-none">"</span>
                            <p className="text-xl font-display font-semibold text-[#042C53] leading-snug italic pl-5 relative z-10">
                              {block.text}
                            </p>
                            {block.author && (
                              <p className="mt-4 text-sm font-sans font-bold text-[#042C53]/60 pl-5">
                                — {block.author}
                              </p>
                            )}
                          </blockquote>
                        );
                      }
                      if (block.type === 'list') {
                        return (
                          <ul key={index} className="space-y-3 my-4">
                            {block.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-3 text-base text-[#444444] font-sans">
                                <span className="w-2 h-2 rounded-full bg-[#AD1F23] mt-2.5 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <>
                      <p className="text-lg text-[#333333] font-sans leading-relaxed font-medium border-l-4 border-[#AD1F23] pl-5 py-1">
                        {event.description}
                      </p>
                      <p className="text-base text-[#444444] font-sans leading-relaxed">
                        Join us for {event.title} organized by {event.host}. This session is focused on addressing key areas under the {event.category} track. Please see the highlights below for more details on what will be covered.
                      </p>
                    </>
                  )}

                  {/* Highlights section */}
                  {event.highlights && event.highlights.length > 0 && (
                    <div className="mt-8 bg-white border border-[#F2F2F7] rounded-3xl p-6 md:p-8 shadow-sm">
                      <h3 className="font-display font-bold text-lg text-[#042C53] mb-4 flex items-center gap-2">
                        <Award size={18} className="text-[#AD1F23]" /> Key Event Highlights
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {event.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2.5 text-sm text-[#444444] font-sans font-medium">
                            <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Gallery Section */}
                  {event.gallery && event.gallery.length > 0 && (
                    <div className="mt-8 bg-white border border-[#F2F2F7] rounded-3xl p-6 md:p-8 shadow-sm">
                      <h3 className="font-display font-bold text-lg text-[#042C53] mb-5 flex items-center gap-2">
                        <Camera size={18} className="text-[#AD1F23]" /> Event Gallery
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {event.gallery.map((imgUrl, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setActiveImage(imgUrl)}
                            className="aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group relative shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <img 
                              src={imgUrl} 
                              alt={`Event photo ${idx + 1}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-[#042C53]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="text-white text-xs font-sans font-bold bg-[#042C53]/85 px-3.5 py-1.5 rounded-xl shadow-sm">
                                View Photo
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.article>

                {/* Back to Events */}
                <div className="mt-12 pt-8 border-t border-[#F2F2F7]">
                  <button
                    onClick={() => navigate('/news-events?tab=events')}
                    className="inline-flex items-center gap-2 text-sm font-bold font-sans text-[#042C53] hover:text-[#AD1F23] transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={16} /> Back to News &amp; Events
                  </button>
                </div>
              </div>

              {/* ── Sidebar ── */}
              <div className="lg:w-72 xl:w-80 shrink-0">
                <div className="sticky top-[96px] space-y-6">

                  {/* Event Details Panel */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white rounded-2xl border border-[#F2F2F7] shadow-sm overflow-hidden"
                  >
                    <div className="p-5 border-b border-[#F2F2F7] bg-[#042C53]/5">
                      <h3 className="font-display font-bold text-[#042C53] text-sm uppercase tracking-wider">Event Details</h3>
                    </div>
                    <div className="p-5 space-y-4 font-sans text-sm">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date &amp; Time</p>
                        <p className="font-semibold text-[#042C53]">{event.dateText}</p>
                        <p className="text-xs text-gray-500">{event.timeText}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</p>
                        <p className="font-semibold text-[#042C53] flex items-center gap-1.5">
                          {event.isVirtual ? <Video size={14} className="shrink-0" /> : <MapPin size={14} className="shrink-0" />}
                          {event.location}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Registration Cost</p>
                        <p className="font-semibold text-amber-700">{event.price}</p>
                      </div>

                      {!isPast && event.spotsLeft !== undefined && (
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Available Capacity</p>
                          <p className="font-semibold text-emerald-600">{event.spotsLeft} spots remaining</p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Event Track</p>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mt-1 ${categoryStyle.bg} ${categoryStyle.text}`}>
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Other Events list */}
                  {otherEvents.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="bg-white rounded-2xl border border-[#F2F2F7] shadow-sm overflow-hidden"
                    >
                      <div className="p-5 border-b border-[#F2F2F7]">
                        <h3 className="font-display font-bold text-[#042C53] text-sm">Other Sessions</h3>
                      </div>
                      <div className="divide-y divide-[#F2F2F7]">
                        {otherEvents.map((oe) => {
                          const oeCat = categoryColors[oe.category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
                          return (
                            <Link
                              key={oe.id}
                              to={`/events/${oe.slug}`}
                              className="flex gap-4 p-4 hover:bg-[#f8f9ff] transition-colors group"
                            >
                              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                <img
                                  src={oe.image}
                                  alt={oe.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${oeCat.bg} ${oeCat.text}`}>
                                  {oe.category}
                                </span>
                                <p className="font-sans font-semibold text-xs text-[#042C53] leading-snug group-hover:text-[#AD1F23] transition-colors line-clamp-2">
                                  {oe.title}
                                </p>
                                <p className="text-[10px] text-gray-400 font-sans mt-1">{oe.dateText}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Gallery Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#042C53]/90 backdrop-blur-sm"
            onClick={() => setActiveImage(null)}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border-none"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-white"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={activeImage} 
                alt="Enlarged gallery view" 
                className="max-w-full max-h-[80vh] object-contain block"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default EventDetailPage;
