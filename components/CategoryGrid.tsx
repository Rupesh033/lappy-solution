'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';

interface CategoryItem {
  id: string;
  title: string;
  fullTitle?: string;
  image: string;
  href: string;
  startingPrice?: string;
}

export const CategoryGrid: React.FC = () => {
  const categories: CategoryItem[] = [
    // Row 1 (Desktop)
    {
      id: 'frontech-monitors',
      title: 'Frontech Monitors',
      fullTitle: 'Frontech Ultima & Curved Monitors',
      image: 'https://cdn.shopify.com/s/files/1/0854/3227/1149/files/24.5_inch_mon_0087v_01.jpg?v=1772186717',
      href: '/shop?search=Monitor',
      startingPrice: 'From ₹5,999'
    },
    {
      id: 'laptop-adapters',
      title: 'Laptop Adapters',
      image: '/images/categories/laptop-adapters.png',
      href: '/shop?search=Adapter',
      startingPrice: 'From ₹899'
    },
    {
      id: 'laptop-keyboard',
      title: 'Laptop Keyboard',
      image: '/images/categories/laptop-keyboard.png',
      href: '/shop?search=Keyboard',
      startingPrice: 'From ₹650'
    },
    {
      id: 'headsets',
      title: 'Headsets & Audio',
      image: '/images/categories/headsets.png',
      href: '/shop?search=Headset',
      startingPrice: 'From ₹499'
    },
    {
      id: 'backpacks-and-carry-case',
      title: 'Laptop Bags',
      fullTitle: 'Backpacks and Carry Case',
      image: '/images/categories/backpacks.png',
      href: '/shop?search=Bag',
      startingPrice: 'From ₹799'
    },
    {
      id: 'cables-and-connectors',
      title: 'Cables & HDMI',
      image: '/images/categories/cables-and-connectors.png',
      href: '/shop?search=Cable',
      startingPrice: 'From ₹199'
    },
    // Row 2 (Desktop)
    {
      id: 'laptop-batteries',
      title: 'Laptop Batteries',
      image: '/images/categories/laptop-batteries.png',
      href: '/shop?search=Battery',
      startingPrice: 'From ₹1,499'
    },
    {
      id: 'laptop-screen',
      title: 'Laptop Screens',
      image: '/images/categories/laptop-screen.png',
      href: '/shop?search=Screen',
      startingPrice: 'From ₹2,800'
    },
    {
      id: 'mouse',
      title: 'Wireless Mouse',
      image: '/images/categories/mouse.png',
      href: '/shop?search=Mouse',
      startingPrice: 'From ₹299'
    },
    {
      id: 'web-cams',
      title: 'FHD Webcams',
      image: '/images/categories/web-cams.png',
      href: '/shop?search=Webcam',
      startingPrice: 'From ₹999'
    },
    {
      id: 'laptop-ssd',
      title: 'NVMe SSDs & RAM',
      image: '/images/categories/laptop-ssd.png',
      href: '/shop?search=SSD',
      startingPrice: 'From ₹1,299'
    }
  ];

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
          {categories.filter((cat) => cat.id !== 'frontech-monitors').map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              title={cat.fullTitle || cat.title}
              className="group bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#1A56DB]/40 rounded-xl p-3 flex items-center justify-between min-h-[82px] sm:min-h-[88px] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-sm relative overflow-hidden"
            >
              {/* Left side text and starting price */}
              <div className="pr-2 z-10">
                <span className="block text-[13px] sm:text-[14px] font-semibold text-[#111827] group-hover:text-[#1A56DB] transition-colors leading-snug">
                  {cat.title}
                </span>
                {cat.startingPrice && (
                  <span className="block text-[11px] font-bold text-[#15803D] mt-0.5">
                    {cat.startingPrice}
                  </span>
                )}
              </div>

              {/* Right side product image */}
              <div className="w-14 h-12 sm:w-16 sm:h-14 flex-shrink-0 flex items-center justify-end z-10">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-200"
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
