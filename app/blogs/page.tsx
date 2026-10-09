'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Search, ArrowRight, Clock, User, 
  Calendar, Tag, Sparkles, ChevronRight, MessageSquare 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { STORE_INFO } from '../../data/storeData';

export default function BlogListingPage() {
  const { blogPosts, siteSettings } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const list = Array.from(new Set(blogPosts.map((b) => b.category).filter(Boolean)));
    return ['All', ...list];
  }, [blogPosts]);

  const filteredBlogs = useMemo(() => {
    return blogPosts.filter((b) => {
      if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = b.title.toLowerCase().includes(q);
        const matchesExcerpt = b.excerpt.toLowerCase().includes(q);
        const matchesTags = (b.tags || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesExcerpt && !matchesTags) return false;
      }
      return true;
    });
  }, [blogPosts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#1A56DB] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-gray-800">Tech Guides & Blogs</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-gradient-to-br from-[#0A1633] via-[#0F2960] to-[#1A56DB] rounded-2xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-blue-200 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#4ADE80]" />
              GARHWA TECH DIARY & HARDWARE GUIDES
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Hardware Advice, Reviews & Buying Guides
            </h1>
            <p className="text-xs sm:text-[13.5px] text-blue-100 leading-relaxed">
              Curated tutorials on refurbished laptops, Frontech curved monitors, CCTV security setups, and chip-level motherboard repair from Lapiez engineers.
            </p>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E5E7EB] rounded-xl p-3 shadow-2xs">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A56DB] text-white shadow-xs font-bold'
                      : 'bg-[#F8FAFC] text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-72">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tech articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-8 pr-7 bg-[#F9FAFB] border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1A56DB] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image Cover */}
                <Link href={`/blogs/${blog.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-[#1A56DB] shadow-xs backdrop-blur-xs">
                    {blog.category}
                  </span>
                </Link>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{blog.readTime || '4 min read'}</span>
                      </span>
                      <span>•</span>
                      <span>{blog.author || 'Lapiez Team'}</span>
                    </div>

                    <Link href={`/blogs/${blog.slug}`}>
                      <h3 className="font-extrabold text-gray-900 text-base sm:text-lg group-hover:text-[#1A56DB] transition-colors leading-snug line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* Footer link */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="text-xs font-bold text-[#1A56DB] hover:text-[#1E40AF] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <a
                      href={`https://wa.me/${siteSettings?.whatsapp || STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hello Lapiez, I read your article "${blog.title}" and have a query.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#25D366] transition-colors p-1"
                      title="Ask question on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">No articles match your criteria</h3>
            <p className="text-xs text-gray-500 mb-4">Try selecting another category or clear your search query.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="h-8.5 px-4 rounded-lg bg-[#1A56DB] text-white text-xs font-bold hover:bg-[#1E40AF]"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
