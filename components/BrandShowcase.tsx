'use client';

import React from 'react';
import Link from 'next/link';
import { Award } from 'lucide-react';

interface BrandItem {
  name: string;
  query: string;
  logo: React.ReactNode;
}

export const BrandShowcase: React.FC = () => {
  const brands: BrandItem[] = [
    // 1. HP
    {
      name: 'HP',
      query: 'HP',
      logo: (
        <svg viewBox="0 0 100 100" className="h-8 w-auto" fill="none">
          <circle cx="50" cy="50" r="46" fill="#0096D6" />
          <path
            d="M34 68L48 24h6L40 68h-6zm12-14l6-18h6l-6 18h-6zm6 14l14-44h6L58 68h-6zm12-14l6-18h6l-6 18h-6z"
            fill="white"
          />
        </svg>
      )
    },
    // 2. Lenovo
    {
      name: 'Lenovo',
      query: 'Lenovo',
      logo: (
        <div className="bg-[#E2231A] px-3 py-1 rounded-[3px] flex items-center justify-center">
          <span className="text-white font-extrabold text-[14px] tracking-tight font-sans">
            Lenovo
          </span>
        </div>
      )
    },
    // 3. DELL
    {
      name: 'Dell',
      query: 'Dell',
      logo: (
        <svg viewBox="0 0 120 120" className="h-8 w-auto" fill="none">
          <circle cx="60" cy="60" r="54" stroke="#007DB8" strokeWidth="6" fill="white" />
          <text
            x="60"
            y="69"
            textAnchor="middle"
            fill="#007DB8"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="bold"
            fontSize="26"
            letterSpacing="-1"
          >
            DELL
          </text>
        </svg>
      )
    },
    // 4. ASUS
    {
      name: 'ASUS',
      query: 'ASUS',
      logo: (
        <div className="flex items-center">
          <span 
            className="text-[#000000] font-black text-[18px] tracking-widest font-sans"
            style={{ letterSpacing: '0.12em' }}
          >
            ASUS
          </span>
        </div>
      )
    },
    // 5. acer
    {
      name: 'Acer',
      query: 'Acer',
      logo: (
        <div className="flex items-center">
          <span className="text-[#83B81A] font-bold text-[20px] tracking-tight font-sans lowercase">
            acer
          </span>
        </div>
      )
    },
    // 6. logitech
    {
      name: 'Logitech',
      query: 'Logitech',
      logo: (
        <div className="flex items-center">
          <span className="text-[#000000] font-bold text-[17px] tracking-tight font-sans lowercase">
            logitech
          </span>
        </div>
      )
    },
    // 7. HIKVISION
    {
      name: 'Hikvision',
      query: 'Hikvision',
      logo: (
        <div className="flex items-center font-black text-[15px] tracking-tight font-sans">
          <span className="text-[#D71920]">HIK</span>
          <span className="text-[#53565A]">VISION</span>
        </div>
      )
    },
    // 8. CP-PLUS
    {
      name: 'CP-PLUS',
      query: 'CP-PLUS',
      logo: (
        <div className="flex items-center font-black text-[14px] tracking-tight font-sans">
          <span className="text-[#E11D48]">CP</span>
          <span className="text-[#1E293B]">-PLUS</span>
        </div>
      )
    }
  ];

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

        {/* Brands Compact Grid (4 cols on mobile, 8 on desktop) */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-3">
          {brands.map((b) => (
            <Link
              key={b.name}
              href={`/shop?search=${encodeURIComponent(b.query)}`}
              title={`View all ${b.name} products`}
              className="bg-white border border-[#E5E7EB] hover:border-[#1A56DB]/50 rounded-xl h-[52px] sm:h-[60px] px-2 sm:px-3 flex items-center justify-center transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-xs group"
            >
              <div className="flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                {b.logo}
              </div>
            </Link>
          ))}
        </div>

        {/* Indian Reassurance Tagline */}
        <div className="mt-3.5 text-center">
          <p className="text-[12px] sm:text-[12.5px] text-[#4B5563] font-medium tracking-wide">
            <span className="text-[#15803D] font-bold">✓ 100% Original Products</span>
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
