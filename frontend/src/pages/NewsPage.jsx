import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, User, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { newsArticles, categories } from '../data/newsData';



const NewsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter logic
  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = newsArticles.find(a => a.featured);

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1 bg-[#f8f9ff]">
        {/* Banner Hero */}
        <section className="relative bg-[#042C53] text-white py-16 md:py-20 px-[4%] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] islamic-pattern pointer-events-none" />
          <div className="absolute top-[-50%] right-[-20%] w-[60%] h-[120%] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)] blur-3xl pointer-events-none" />

          <div className="max-w-container-max mx-auto px-md relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <span className="inline-block py-1 px-3.5 rounded-full bg-white/10 text-white/95 text-xs font-bold tracking-widest uppercase">
                AMMA Press Room
              </span>
              <h1 className="text-[clamp(36px,5vw,56px)] font-display font-extrabold tracking-tight leading-none">
                News &amp; Updates
              </h1>
              <p className="text-white/70 text-body-md font-medium max-w-2xl">
                Stay informed with the latest announcements, clinical insights, humanitarian mission reports, and chapter activities.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-6 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white focus:text-[#042C53] focus:placeholder-gray-400 focus:ring-4 focus:ring-white/10 transition-all text-sm font-sans"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none group-focus-within:text-gray-400" size={18} />
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <section className="border-b border-[#F2F2F7] bg-white sticky top-[80px] z-50 py-4 px-[4%]">
          <div className="max-w-container-max mx-auto px-md flex gap-2 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => (
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

        {/* Content Section */}
        <section className="py-12 md:py-16 px-[4%]">
          <div className="max-w-container-max mx-auto px-md space-y-12">

            {/* Show Featured Article only if we are in "All" and no search query */}
            {selectedCategory === 'All' && searchQuery === '' && featuredArticle && (
              <div className="space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#666666] font-sans">Spotlight Story</h2>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-outline-variant/10 shadow-premium overflow-hidden flex flex-col lg:flex-row hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="lg:w-1/2 relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-6 left-6 bg-[#AD1F23] text-white py-1 px-3.5 rounded-full text-xs font-bold uppercase shadow-md">
                      Featured
                    </span>
                  </div>
                  <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 font-sans">
                        <span className="text-[#042C53] uppercase tracking-wide bg-[#042C53]/5 px-2.5 py-1 rounded-md">{featuredArticle.category}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {featuredArticle.date}
                        </div>
                      </div>
                      <h3 className="font-display font-bold text-2xl md:text-3xl text-[#042C53] leading-snug group-hover:text-[#AD1F23] transition-colors duration-300">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-on-surface-variant text-body-md leading-relaxed font-sans">
                        {featuredArticle.excerpt}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-[#F2F2F7]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#042C53]/10 flex items-center justify-center font-display font-bold text-[#042C53]">
                          {featuredArticle.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-sans font-bold text-sm text-[#042C53] m-0">{featuredArticle.author}</p>
                          <p className="font-sans text-xs text-gray-500 m-0">{featuredArticle.authorTitle}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/news/${featuredArticle.slug}`)}
                        className="flex items-center gap-2 font-sans font-bold text-sm text-[#AD1F23] group-hover:gap-3 transition-all cursor-pointer"
                      >
                        Read Spotlight <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#666666] font-sans">
                  {searchQuery || selectedCategory !== 'All' ? 'Search Results' : 'All Updates'} ({filteredArticles.length})
                </h2>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredArticles.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {filteredArticles.map((article) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        key={article.id}
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
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {article.date}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {article.readTime}
                              </span>
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
                              onClick={() => navigate(`/news/${article.slug}`)}
                              className="flex items-center gap-1 font-sans font-bold text-xs text-[#AD1F23] hover:underline cursor-pointer"
                            >
                              Read <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
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

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NewsPage;
