import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Calendar, Clock, ArrowRight, BookOpen,
  MapPin, Video, CalendarDays
} from 'lucide-react';
import { newsArticles, categories as newsCategories } from '../data/newsData';
import { upcomingEvents, eventCategories } from '../data/eventsData';

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'news', label: 'News & Updates' },
  { id: 'events', label: 'Upcoming Events' },
];

// ─── Shared category pill ─────────────────────────────────────────────────────
const CategoryPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-6 rounded-full font-sans font-bold text-sm cursor-pointer transition-all shrink-0 border border-transparent ${active
        ? 'bg-[#042C53] text-white shadow-sm'
        : 'bg-gray-100 hover:bg-gray-200 text-[#333333]'
      }`}
  >
    {label}
  </button>
);

// ─── News Card ────────────────────────────────────────────────────────────────
const NewsCard = ({ article, onRead }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.35 }}
    className="bg-white rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group overflow-hidden"
  >
    <div className="aspect-[16/10] relative overflow-hidden">
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#042C53] py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
        {article.category}
      </span>
    </div>

    <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 font-sans">
          <span className="flex items-center gap-1"><Calendar size={12} />{article.date}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock size={12} />{article.readTime}</span>
        </div>
        <h3 className="font-display font-bold text-lg text-[#042C53] leading-snug group-hover:text-[#AD1F23] transition-colors duration-300">
          {article.title}
        </h3>
        <p className="text-on-surface-variant text-sm font-sans leading-relaxed">
          {article.excerpt}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#F2F2F7] gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#042C53]/5 flex items-center justify-center font-display font-semibold text-xs text-[#042C53]">
            {article.author.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-sans font-bold text-xs text-gray-700">{article.author}</span>
        </div>
        <button
          onClick={() => onRead(article.slug)}
          className="flex items-center gap-1 font-sans font-bold text-xs text-[#AD1F23] hover:underline cursor-pointer"
        >
          Read <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </motion.div>
);

// ─── Event Card ───────────────────────────────────────────────────────────────
const EventCard = ({ event, onViewDetails }) => {
  const isPast = new Date(event.date) < new Date('2026-07-19');
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group overflow-hidden"
    >
      {/* Image */}
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
          {event.isVirtual ? <Video size={11} /> : null}
          {event.category}
        </span>
        <span className={`absolute top-4 right-4 text-white py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
          isPast ? 'bg-gray-500/90' : 'bg-emerald-600/90'
        }`}>
          {isPast ? 'Completed' : 'Upcoming'}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 space-y-4 justify-between">
        <div className="space-y-2">
          <h3 className="font-display font-bold text-lg text-[#042C53] leading-snug group-hover:text-[#AD1F23] transition-colors duration-300">
            {event.title}
          </h3>
          <p className="text-on-surface-variant text-sm font-sans leading-relaxed line-clamp-3">
            {event.description}
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {/* Details block */}
          <div className="bg-[#f8f9ff] rounded-xl p-4 space-y-2 text-xs font-sans text-gray-600 border border-[#F2F2F7]">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-[#AD1F23] shrink-0" />
              <span className="font-semibold text-gray-800">{event.dateText}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-gray-400 shrink-0" />
              <span>{event.timeText}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-gray-400 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F2F2F7] flex items-center justify-end">
            <button
              onClick={() => onViewDetails(event.slug)}
              className="flex items-center gap-1 font-sans font-bold text-xs text-[#AD1F23] hover:underline cursor-pointer"
            >
              View Details <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const NewsEventsPage = () => {
  const navigate = useNavigate();

  // Tab state persisted in URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'events' ? 'events' : 'news';

  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  // News state
  const [searchQuery, setSearchQuery] = useState('');
  const [newsCategory, setNewsCategory] = useState('All');

  // Events state
  const [eventsCategory, setEventsCategory] = useState('All');
  const [eventStatus, setEventStatus] = useState('all'); // 'all', 'upcoming', 'past'

  // News filter
  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = newsCategory === 'All' || article.category === newsCategory;
    return matchesSearch && matchesCategory;
  });
  const featuredArticle = newsArticles.find(a => a.featured);

  // Events filter & sorting
  const filteredEvents = upcomingEvents
    .filter(event => {
      const matchesCategory = eventsCategory === 'All' || event.category === eventsCategory;
      const isPastEvent = new Date(event.date) < new Date('2026-07-19');
      const matchesStatus =
        eventStatus === 'all' ||
        (eventStatus === 'upcoming' && !isPastEvent) ||
        (eventStatus === 'past' && isPastEvent);
      return matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      // Sort upcoming events ascending (soonest first) and past events descending (most recent first)
      const aPast = new Date(a.date) < new Date('2026-07-19');
      const bPast = new Date(b.date) < new Date('2026-07-19');
      if (aPast !== bPast) {
        return aPast ? 1 : -1; // Upcoming first
      }
      return aPast
        ? new Date(b.date) - new Date(a.date) // Past: Descending
        : new Date(a.date) - new Date(b.date); // Upcoming: Ascending
    });

  const isNews = activeTab === 'news';

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1 bg-[#f8f9ff]">
        {/* ─── Hero Banner ─── */}
        <section className="relative bg-[#042C53] text-white py-16 md:py-20 px-[4%] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] islamic-pattern pointer-events-none" />
          <div className="absolute top-[-50%] right-[-20%] w-[60%] h-[120%] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)] blur-3xl pointer-events-none" />

          <div className="max-w-container-max mx-auto px-md relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <span className="inline-block py-1 px-3.5 rounded-full bg-white/10 text-white/95 text-xs font-bold tracking-widest uppercase">
                AMMA Press Room
              </span>
              <h1 className="text-[clamp(36px,5vw,56px)] font-display font-extrabold tracking-tight leading-none">
                News &amp; Events
              </h1>
              <p className="text-white/70 text-body-md font-medium max-w-2xl">
                Stay informed with the latest announcements, clinical insights, humanitarian mission reports, and upcoming AMMA events.
              </p>

              {/* Tab Switcher */}
              <div className="flex items-center gap-2 pt-2">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-5 rounded-full font-sans font-bold text-sm cursor-pointer transition-all duration-200 border ${activeTab === tab.id
                        ? 'bg-white text-[#042C53] border-white shadow-md'
                        : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search — only for news tab */}
            {/* <AnimatePresence>
              {isNews && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="w-full md:w-80 relative"
                >
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-6 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white focus:text-[#042C53] focus:placeholder-gray-400 focus:ring-4 focus:ring-white/10 transition-all text-sm font-sans"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={18} />
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>
        </section>

        {/* ─── Category Bar (changes per tab) ─── */}
        <section className="border-b border-[#F2F2F7] bg-white sticky top-[80px] z-50 py-4 px-[4%]">
          <div className="max-w-container-max mx-auto px-md flex gap-2 overflow-x-auto hide-scrollbar">
            <AnimatePresence mode="wait">
              {isNews ? (
                <motion.div
                  key="news-cats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2"
                >
                  {newsCategories.map(cat => (
                    <CategoryPill
                      key={cat}
                      label={cat}
                      active={newsCategory === cat}
                      onClick={() => setNewsCategory(cat)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="events-cats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2"
                >
                  {eventCategories.map(cat => (
                    <CategoryPill
                      key={cat}
                      label={cat}
                      active={eventsCategory === cat}
                      onClick={() => setEventsCategory(cat)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ─── Content ─── */}
        <section className="py-12 md:py-16 px-[4%]">
          <div className="max-w-container-max mx-auto px-md">
            <AnimatePresence mode="wait">
              {/* ══ NEWS TAB ══ */}
              {isNews ? (
                <motion.div
                  key="news-content"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >

                  {/* Articles Grid */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-4">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#666666] font-sans">
                        {searchQuery || newsCategory !== 'All' ? 'Search Results' : 'All Updates'} ({filteredArticles.length})
                      </h2>
                    </div>
                    <AnimatePresence mode="popLayout">
                      {filteredArticles.length > 0 ? (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {filteredArticles.map(article => (
                            <NewsCard
                              key={article.id}
                              article={article}
                              onRead={(slug) => navigate(`/news/${slug}`)}
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-20 bg-white rounded-3xl border border-outline-variant/10 shadow-sm"
                        >
                          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                          <h3 className="font-display font-bold text-xl text-[#042C53] mb-2">No Articles Found</h3>
                          <p className="text-gray-500 font-sans text-sm max-w-sm mx-auto">
                            We couldn't find any news articles matching your search query or selected category.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                /* ══ EVENTS TAB ══ */
                <motion.div
                  key="events-content"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2F2F7] pb-4 gap-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#666666] font-sans">
                      {eventStatus === 'upcoming' ? 'Upcoming Sessions' : eventStatus === 'past' ? 'Completed Sessions' : 'All Sessions'} ({filteredEvents.length})
                    </h2>
                    
                    {/* Status Filter Toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                      {['all', 'upcoming', 'past'].map(status => (
                        <button
                          key={status}
                          onClick={() => setEventStatus(status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all ${
                            eventStatus === status
                              ? 'bg-white text-[#042C53] shadow-sm'
                              : 'text-gray-500 hover:text-[#042C53]'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
 
                  <AnimatePresence mode="popLayout">
                    {filteredEvents.length > 0 ? (
                      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map(event => (
                          <EventCard
                            key={event.id}
                            event={event}
                            onViewDetails={(slug) => navigate(`/events/${slug}`)}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-3xl border border-outline-variant/10 shadow-sm"
                      >
                        <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                        <h3 className="font-display font-bold text-xl text-[#042C53] mb-2">No Events Found</h3>
                        <p className="text-gray-500 font-sans text-sm max-w-sm mx-auto">
                          There are currently no upcoming events listed under the {eventsCategory} category.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NewsEventsPage;
