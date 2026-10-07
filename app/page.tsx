'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ShieldCheck, Truck, Receipt, 
  Store, Flame, Sparkles, MessageSquare, Phone,
  Layers, CheckCircle2, ChevronRight
} from 'lucide-react';
import { TopBannerSlider } from '../components/TopBannerSlider';
import { Hero } from '../components/Hero';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductCard } from '../components/ProductCard';
import { BrandShowcase } from '../components/BrandShowcase';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/storeData';

export default function Home() {
  const { products, homepageSections, siteSettings } = useStore();

  // Curate 8 top trending products for the homepage showcase
  const featuredLaptops = products.filter(p => p.category === 'Laptops').slice(0, 4);
  const featuredOther = products.filter(p => p.category !== 'Laptops').slice(0, 4);
  const homeTrendingProducts = [...featuredLaptops, ...featuredOther].slice(0, 8);

  const quickCategories = [
    { name: 'Laptops', count: 23, href: '/shop?cat=Laptops' },
    { name: 'Desktops & Rigs', count: 7, href: '/shop?cat=Computers' },
    { name: 'CCTV Security', count: 26, href: '/shop?cat=CCTV%20%26%20Security' },
    { name: 'Printers & Inks', count: 76, href: '/shop?cat=Printers' },
    { name: 'Laptop Spares', count: 118, href: '/shop?cat=Accessories' },
    { name: 'SSDs & RAM', count: 31, href: '/shop?cat=Storage%20%26%20Parts' },
  ];

  const sortedSections = useMemo(() => {
    if (homepageSections && homepageSections.length > 0) {
      return [...homepageSections]
        .filter((s) => s.isVisible && s.sectionKey !== 'hero')
        .sort((a, b) => a.position - b.position);
    }
    return [
      { sectionKey: 'banners', isVisible: true },
      { sectionKey: 'trust_bar', isVisible: true },
      { sectionKey: 'categories', isVisible: true },
      { sectionKey: 'featured', isVisible: true },
      { sectionKey: 'promo', isVisible: true },
      { sectionKey: 'brands', isVisible: true },
      { sectionKey: 'catalog_cta', isVisible: true },
      { sectionKey: 'showroom', isVisible: true },
    ];
  }, [homepageSections]);

  const renderSection = (key: string) => {
    switch (key) {
      case 'banners':
        return <TopBannerSlider key="banners" />;

      case 'hero':
        return <Hero key="hero" />;

      case 'trust_bar':
        return (
          <div key="trust_bar" className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            
            <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A56DB] flex-shrink-0">
                <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[12px] sm:text-[14px] font-bold text-[#111827] truncate">18% GST Invoicing</h4>
                <p className="text-[10px] sm:text-[11.5px] text-[#4B5563] truncate">Claim ITC for business</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-[#15803D] flex-shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[12px] sm:text-[14px] font-bold text-[#111827] truncate">Brand Warranty</h4>
                <p className="text-[10px] sm:text-[11.5px] text-[#4B5563] truncate">HP, Dell, Lenovo verified</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] flex-shrink-0">
                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[12px] sm:text-[14px] font-bold text-[#111827] truncate">30-Min Store Pickup</h4>
                <p className="text-[10px] sm:text-[11.5px] text-[#4B5563] truncate">Chiniya Road, Garhwa</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-[#7C3AED] flex-shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[12px] sm:text-[14px] font-bold text-[#111827] truncate">Free Local Delivery</h4>
                <p className="text-[10px] sm:text-[11.5px] text-[#4B5563] truncate">Garhwa & Palamu</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );

  case 'categories':
    return <CategoryGrid key="categories" />;

  case 'featured':
    return (
      <div key="featured" className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 mb-3 sm:mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#15803D] px-2 py-0.5 rounded bg-green-50 border border-green-200 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-[#15803D]" />
                BESTSELLERS & TOP DEALS
              </span>
            </div>
            <h2 className="text-[18px] sm:text-[26px] font-extrabold text-[#111827] tracking-tight">
              Featured In-Stock Products
            </h2>
            <p className="text-[11.5px] sm:text-[13px] text-[#4B5563] mt-0.5">
              Verified original laptops, desktop workstations, and CCTV security with immediate Garhwa availability.
            </p>
          </div>

          <Link
            href="/shop"
            className="h-8 sm:h-9 px-3.5 sm:px-4 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-[11.5px] sm:text-[12.5px] font-bold flex items-center gap-1.5 transition-colors w-fit shadow-xs self-start sm:self-auto"
          >
            <span>View All 280+ Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-Column Mobile, 4-Column Desktop Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {homeTrendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );

  case 'promo':
    return (
      <div key="promo" className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
          
          {/* Banner A: SSD & Memory Upgrade */}
          <div className="rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] p-4 sm:p-6 flex flex-col justify-between shadow-2xs relative overflow-hidden group">
            <div className="space-y-1.5 sm:space-y-2 z-10 max-w-md">
              <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#1D4ED8] px-2 py-0.5 rounded bg-white/90 border border-blue-200 inline-block">
                GENUINE NVME & RAM UPGRADES
              </span>
              <h3 className="text-[16px] sm:text-[22px] font-extrabold text-[#111827] tracking-tight leading-snug">
                Boost Your Laptop Speed by up to 10X
              </h3>
              <p className="text-[11.5px] sm:text-[12.5px] text-[#374151] leading-relaxed">
                Crucial, Kingston & WD NVMe M.2 SSDs in stock from ₹1,299 with free showroom installation and data transfer.
              </p>
            </div>
            <div className="pt-3 sm:pt-4 z-10">
              <Link
                href="/shop?search=SSD"
                className="h-8 sm:h-9 px-3.5 sm:px-4 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-[11.5px] sm:text-[12.5px] font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Explore SSD Upgrades</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Banner B: Business & Student Laptops */}
          <div className="rounded-xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#BBF7D0] p-4 sm:p-6 flex flex-col justify-between shadow-2xs relative overflow-hidden group">
            <div className="space-y-1.5 sm:space-y-2 z-10 max-w-md">
              <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#15803D] px-2 py-0.5 rounded bg-white/90 border border-emerald-200 inline-block">
                SEALED BOX WITH GST INVOICE
              </span>
              <h3 className="text-[16px] sm:text-[22px] font-extrabold text-[#111827] tracking-tight leading-snug">
                Certified Business Laptops Under ₹55,000
              </h3>
              <p className="text-[11.5px] sm:text-[12.5px] text-[#374151] leading-relaxed">
                HP 15s, Dell Inspiron, Lenovo ThinkPad & IdeaPad loaded with 16GB RAM, fast NVMe storage, and manufacturer warranty.
              </p>
            </div>
            <div className="pt-3 sm:pt-4 z-10">
              <Link
                href="/shop?cat=Laptops"
                className="h-8 sm:h-9 px-3.5 sm:px-4 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-[11.5px] sm:text-[12.5px] font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>View Laptop Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    );

  case 'brands':
    return <BrandShowcase key="brands" />;

  case 'catalog_cta':
    return (
      <div key="catalog_cta" className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-gradient-to-br from-[#0A1633] via-[#0F2960] to-[#1A56DB] text-white rounded-2xl p-5 sm:p-8 shadow-md relative overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none flex items-center justify-end pr-6">
            <div className="w-72 h-72 rounded-full border-8 border-white/30 blur-2xl" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-blue-200 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 inline-flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#4ADE80]" />
                COMPLETE GARHWA SHOWROOM INVENTORY
              </span>
            </div>

            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Looking for Specific Hardware, CCTV or Spare Parts?
              </h2>
              <p className="text-xs sm:text-[13.5px] text-blue-100 mt-1 leading-relaxed">
                Explore all 282+ in-stock products with advanced filters by brand, category, and price in ₹ with same-day showroom dispatch.
              </p>
            </div>

            {/* Quick Category Chips for Fast Phone Navigation */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
              {quickCategories.map((c) => (
                <Link
                  key={c.name}
                  href={c.href}
                  className="px-2.5 sm:px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] sm:text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] text-blue-200 opacity-80">({c.count})</span>
                </Link>
              ))}
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="h-10 sm:h-11 px-5 sm:px-6 rounded-lg bg-[#FB641B] hover:bg-[#E0530F] text-white font-extrabold text-xs sm:text-[13.5px] inline-flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Open Store Catalog (282 Products)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop?cat=Laptops"
                className="h-10 sm:h-11 px-4 sm:px-5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs sm:text-[13.5px] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Browse Laptops Only</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    );

  case 'showroom':
    return (
      <div key="showroom" className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5">
            <div className="space-y-1 sm:space-y-1.5 max-w-xl">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#1A56DB] block">
                GARHWA SHOWROOM VERIFICATION
              </span>
              <h3 className="text-base sm:text-xl font-extrabold text-[#111827]">
                Need Hands-On Hardware Inspection Before Paying?
              </h3>
              <p className="text-xs sm:text-[13px] text-[#4B5563] leading-relaxed">
                Visit our physical showroom opposite G P Plaza, Chiniya Road, Garhwa. Test display quality, keyboard travel, and specifications on the counter before making payment.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${siteSettings?.phone || STORE_INFO.phone}`}
                className="flex-1 sm:flex-none h-9 sm:h-10 px-3.5 sm:px-4 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store</span>
              </a>

              <a
                href={`https://wa.me/${(siteSettings?.whatsapp || STORE_INFO.whatsapp).replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Lappy Solution Garhwa, I want to inquire about in-stock products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none h-9 sm:h-10 px-3.5 sm:px-4 rounded-lg bg-[#25D366] hover:bg-[#1EBE5B] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );

  default:
    return null;
  }
};

  return (
    <div className="space-y-4 sm:space-y-7 pb-20 sm:pb-14 bg-[#F1F3F6] overflow-x-hidden">
      {sortedSections.map((sec) => renderSection(sec.sectionKey))}
    </div>
  );
}
