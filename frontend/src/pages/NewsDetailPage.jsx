import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, User, ArrowLeft, Share2, Twitter,
  Linkedin, Facebook, Link2, ArrowRight, BookOpen, Tag
} from 'lucide-react';
import { newsArticles } from '../data/newsData';
import toast from 'react-hot-toast';

const categoryColors = {
  Humanitarian: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Clinical Ethics': { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  Chapters: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Announcements: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
};

const NewsDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const article = newsArticles.find(a => a.slug === slug);
  const relatedArticles = newsArticles.filter(a => a.slug !== slug).slice(0, 3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (!article) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans">
        <Navbar onJoinClick={() => navigate('/register')} />
        <main className="flex-1 flex items-center justify-center bg-[#f8f9ff]">
          <div className="text-center py-24 px-6">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" strokeWidth={1.5} />
            <h1 className="font-display font-bold text-3xl text-[#042C53] mb-3">Article Not Found</h1>
            <p className="text-gray-500 font-sans text-base mb-8 max-w-sm mx-auto">
              This article does not exist or may have been moved.
            </p>
            <button
              onClick={() => navigate('/news-events?tab=news')}
              className="inline-flex items-center gap-2 font-sans font-bold text-sm bg-[#AD1F23] text-white px-6 py-3 rounded-xl hover:bg-[#911a1d] transition-all cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to News
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryStyle = categoryColors[article.category] || { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1 bg-[#f8f9ff]">

        {/* ─── Hero Image Block ─── */}
        <div className="relative w-full h-[55vh] min-h-[380px] max-h-[600px] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#042C53]/90 via-[#042C53]/40 to-transparent" />

          {/* Breadcrumbs inside hero */}
          <div className="absolute top-6 left-0 right-0 px-[4%]">
            <div className="max-w-5xl mx-auto">
              <nav className="flex items-center gap-2 text-white/70 text-xs font-sans font-semibold">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link to="/news-events?tab=news" className="hover:text-white transition-colors">News</Link>
                <span>/</span>
                <span className="text-white truncate max-w-[200px]">{article.title}</span>
              </nav>
            </div>
          </div>

          {/* Hero Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-[4%] pb-10">
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${categoryStyle.bg} ${categoryStyle.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`} />
                  {article.category}
                </span>
                {article.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#AD1F23] text-white">
                    Featured
                  </span>
                )}
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-display font-extrabold text-[clamp(24px,4vw,48px)] text-white leading-tight max-w-3xl"
              >
                {article.title}
              </motion.h1>
              <div className="flex items-center gap-5 text-white/75 text-xs font-sans flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {article.readTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={13} />
                  {article.author}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Content Section ─── */}
        <section className="py-12 px-[4%]">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

              {/* ── Main Article Body ── */}
              <div className="flex-1 min-w-0">

                {/* Author Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex items-center justify-between gap-4 mb-8 p-5 bg-white rounded-2xl border border-[#F2F2F7] shadow-sm flex-wrap"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#042C53]/10 flex items-center justify-center font-display font-bold text-[#042C53] text-lg shrink-0">
                      {article.author.split(' ').filter(n => n[0]).map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-sans font-bold text-[#042C53] text-sm">{article.author}</p>
                      <p className="font-sans text-xs text-gray-500">{article.authorTitle}</p>
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 font-sans mr-1">Share:</span>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
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

                {/* Article Body Content */}
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="prose-article space-y-6"
                >
                  {article.content.map((block, index) => {
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
                              {block.author}
                            </p>
                          )}
                        </blockquote>
                      );
                    }
                    if (block.type === 'image') {
                      return (
                        <figure key={index} className="my-8">
                          <img
                            src={block.src}
                            alt={block.alt || ''}
                            className="w-full rounded-2xl object-cover"
                          />
                          {block.caption && (
                            <figcaption className="mt-3 text-sm text-gray-500 font-sans text-center">
                              {block.caption}
                            </figcaption>
                          )}
                        </figure>
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
                  })}
                </motion.article>

                {/* Category Tag Footer */}
                <div className="mt-10 pt-8 border-t border-[#F2F2F7] flex items-center gap-3">
                  <Tag size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-sans font-bold">Filed under:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryStyle.bg} ${categoryStyle.text}`}>
                    {article.category}
                  </span>
                </div>

                {/* Back to News */}
                <div className="mt-8">
                  <button
                    onClick={() => navigate('/news-events?tab=news')}
                    className="inline-flex items-center gap-2 text-sm font-bold font-sans text-[#042C53] hover:text-[#AD1F23] transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={16} /> Back to All News
                  </button>
                </div>
              </div>

              {/* ── Sidebar ── */}
              <div className="lg:w-72 xl:w-80 shrink-0">
                <div className="sticky top-[96px] space-y-6">

                  {/* Latest Articles */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white rounded-2xl border border-[#F2F2F7] shadow-sm overflow-hidden"
                  >
                    <div className="p-5 border-b border-[#F2F2F7]">
                      <h3 className="font-display font-bold text-[#042C53] text-base">Latest Articles</h3>
                    </div>
                    <div className="divide-y divide-[#F2F2F7]">
                      {relatedArticles.map((related) => {
                        const relCat = categoryColors[related.category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
                        return (
                          <Link
                            key={related.id}
                            to={`/news/${related.slug}`}
                            className="flex gap-4 p-4 hover:bg-[#f8f9ff] transition-colors group"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                              <img
                                src={related.image}
                                alt={related.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${relCat.bg} ${relCat.text}`}>
                                {related.category}
                              </span>
                              <p className="font-sans font-semibold text-xs text-[#042C53] leading-snug group-hover:text-[#AD1F23] transition-colors line-clamp-2">
                                {related.title}
                              </p>
                              <p className="text-[10px] text-gray-400 font-sans mt-1">{related.date}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="p-4 border-t border-[#F2F2F7]">
                      <Link
                        to="/news"
                        className="flex items-center justify-center gap-2 text-xs font-bold font-sans text-[#AD1F23] hover:gap-3 transition-all"
                      >
                        View All News <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>

                  {/* Join CTA */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-gradient-to-br from-[#042C53] to-[#0a3d72] rounded-2xl p-6 text-white space-y-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Share2 size={18} />
                    </div>
                    <h4 className="font-display font-bold text-base leading-snug">
                      Stay Informed with AMMA
                    </h4>
                    <p className="text-white/70 text-xs font-sans leading-relaxed">
                      Become a member to receive clinical updates, mission reports, and AMMA news directly to your inbox.
                    </p>
                    <button
                      onClick={() => navigate('/register')}
                      className="w-full py-3 bg-[#AD1F23] hover:bg-[#911a1d] rounded-xl text-white font-bold text-sm transition-all duration-200 cursor-pointer"
                    >
                      Join AMMA Today
                    </button>
                  </motion.div>
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

export default NewsDetailPage;
