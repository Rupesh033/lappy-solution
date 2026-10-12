'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandLogoRenderer } from './BrandLogoRenderer';

export const BrandShowcase: React.FC = () => {
  const { brands } = useStore();
  const [showAll, setShowAll] = useState(false);

  const activeBrands = (brands || [])
    .filter((b) => b.isVisible !== false)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  if (activeBrands.length === 0) return null;

  // Initial showcase shows first 18 brands (2 clean rows on desktop, 3 on tablet)
  const INITIAL_LIMIT = 18;
  const displayedBrands = showAll || activeBrands.length <= INITIAL_LIMIT
    ? activeBrands
    : activeBrands.slice(0, INITIAL_LIMIT);

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Section Heading */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#1A56DB]" />
            <h3 className="text-[17px] sm:text-[19px] font-bold text-[#111827] tracking-tight">
              Top Brands We Deal In
            </h3>
          </div>
          <span className="text-xs text-gray-500 hidden sm:inline">
            Direct Official Brand Warranty Across India
          </span>
        </div>

        {/* Brands Responsive Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-1.5 sm:gap-2.5">
          {displayedBrands.map((b) => {
            const href = b.query?.startsWith('/')
              ? b.query
              : `/shop?search=${encodeURIComponent(b.query || b.name)}`;

            return (
              <Link
                key={b.id || b.name}
                href={href}
                title={`View all ${b.name} products`}
                className="bg-white border border-[#E5E7EB] hover:border-[#1A56DB]/50 hover:shadow-xs rounded-xl h-[52px] sm:h-[60px] px-2 sm:px-3 flex items-center justify-center transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] group"
              >
                <div className="flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200 w-full overflow-hidden">
                  <BrandLogoRenderer brand={b} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All / Collapse Toggle (if more than 18 brands) */}
        {activeBrands.length > INITIAL_LIMIT && (
          <div className="mt-3 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-[#1A56DB] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <span>
                {showAll
                  ? 'Show Less Brands'
                  : `View All ${activeBrands.length} Authorized Brands`}
              </span>
              {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Indian Reassurance Tagline */}
        <div className="mt-3.5 text-center">
          <p className="text-[12px] sm:text-[12.5px] text-[#4B5563] font-medium tracking-wide">
            <span className="text-[#15803D] font-bold">100% Original Products</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-[#1A56DB] font-bold">18% GST Bill Included</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-[#D97706] font-bold">All-India Brand Warranty</span>
          </p>
        </div>

      </div>
    </section>
  );
};
