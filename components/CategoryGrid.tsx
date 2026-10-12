'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import { useStore, DEFAULT_SHOP_BY_CATEGORIES } from '../context/StoreContext';

export const CategoryGrid: React.FC = () => {
  const { categories } = useStore();

  const displayCategories = useMemo(() => {
    // Only show categories that are NOT inactive/hidden and not subcategories
    const visible = (categories || []).filter((c) => c.status !== 'inactive' && !c.parentId);
    if (visible.length > 0) {
      return [...visible].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }
    return DEFAULT_SHOP_BY_CATEGORIES;
  }, [categories]);

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Header section matching Indian e-commerce style */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 pb-1">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A56DB] uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>GENUINE HARDWARE INVENTORY</span>
            </div>
            <h2 className="text-[22px] sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight">
              Shop by Category
            </h2>
            <p className="text-[13px] text-[#4B5563] mt-0.5">
              Original laptop spares, adapters, SSDs, and accessories with showroom warranty.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-[13px] font-bold text-[#1A56DB] hover:text-[#1E40AF] flex items-center gap-1 self-start sm:self-end group"
          >
            <span>View all collections</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5 columns x 2 rows on desktop, 2 columns on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {displayCategories.map((cat) => {
            const title = cat.name || cat.title || 'Category';
            const price = cat.startingPrice || 'From Showroom';
            const img = cat.image || cat.imageUrl || '/images/categories/laptop-adapters.png';
            const cleanSearchQuery = (cat.name || '').replace(/^Laptop\s*/i, '').trim();
            const href = cat.href || `/shop?search=${encodeURIComponent(cleanSearchQuery || cat.slug)}`;

            return (
              <Link
                key={cat.id || cat.slug}
                href={href}
                title={cat.title || cat.name}
                className="group bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#1A56DB]/40 rounded-xl p-3 flex items-center justify-between min-h-[82px] sm:min-h-[88px] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-sm relative overflow-hidden"
              >
                {/* Left side text and starting price */}
                <div className="pr-2 z-10">
                  <span className="block text-[13px] sm:text-[14px] font-semibold text-[#111827] group-hover:text-[#1A56DB] transition-colors leading-snug">
                    {title}
                  </span>
                  {price && (
                    <span className="block text-[11px] font-bold text-[#15803D] mt-0.5">
                      {price}
                    </span>
                  )}
                </div>

                {/* Right side product image */}
                <div className="w-14 h-12 sm:w-16 sm:h-14 flex-shrink-0 flex items-center justify-end z-10">
                  <img
                    src={img}
                    alt={title}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
