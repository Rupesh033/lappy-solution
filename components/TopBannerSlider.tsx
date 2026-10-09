'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, 
  Truck, Receipt, MessageSquare, Flame, Sparkles, 
  Camera, Laptop, Cpu, Zap, Star
} from 'lucide-react';
import { STORE_INFO } from '../data/storeData';
import { useStore } from '../context/StoreContext';

interface BannerSlide {
  id: string;
  badge: string;
  badgeIcon: React.ReactNode;
  badgeBg: string;
  badgeText: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  perks: string[];
  priceTag: string;
  priceNote: string;
  ctaText: string;
  ctaLink: string;
  whatsappMessage: string;
  image: string;
  fullBleedImage?: boolean;
  bgGradient: string;
  accentBorder: string;
}

const DEFAULT_BANNERS: BannerSlide[] = [
    // 00. OFFICIAL REFURBISHED LAPTOPS & PRINTERS BANNER (USER ASSET)
    {
      id: 'banner-refurbished-official',
      badge: 'CERTIFIED REFURBISHED • WORK SMARTER SPEND LESS',
      badgeIcon: <Laptop className="w-3.5 h-3.5 text-amber-400" />,
      badgeBg: 'bg-amber-500/20 border-amber-400/40 text-amber-200',
      badgeText: 'text-amber-300',
      title: 'Refurbished Laptops & Printers',
      titleHighlight: 'Tested Quality • Reliable Performance • Smart Prices',
      subtitle: 'Dell, HP, Lenovo, Acer, ASUS Grade-A business laptops & commercial Canon, Epson, HP printers. 100% quality checked, fast delivery and warranty support in Garhwa.',
      perks: [
        '28-Point Quality Checked Hardware',
        'Testing Warranty + Showroom Lab Support',
        'CBIC Rule 46 GST 18% Tax Bill'
      ],
      priceTag: 'Tested Laptops from ₹14,999',
      priceNote: 'Printers starting from ₹3,499',
      ctaText: 'Shop Refurbished Now',
      ctaLink: '/shop?cat=Laptops',
      whatsappMessage: 'Hello Lapiez Garhwa, I want to inquire about certified refurbished laptops and printers.',
      image: '/images/banners/refurbished-laptops-printers.png',
      fullBleedImage: true,
      bgGradient: 'from-[#0A1633] via-[#0E2A68] to-[#1E3A8A]',
      accentBorder: 'border-amber-400/40'
    },
    // 0. FRONTECH OFFICIAL HARDWARE ECOSYSTEM
    {
      id: 'banner-frontech-ecosystem',
      badge: "INDIA'S TRUSTED HARDWARE BRAND • 131+ ITEMS IN STOCK",
      badgeIcon: <ShieldCheck className="w-3.5 h-3.5 text-[#6EE7B7]" />,
      badgeBg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200',
      badgeText: 'text-emerald-300',
      title: 'Complete Frontech Hardware & Gaming Store',
      titleHighlight: 'Monitors, Keyboards, CCTV, Audio & Spares',
      subtitle: 'Official Frontech brand catalog in Garhwa! High-refresh curved gaming monitors, mechanical RGB keyboards, deep-bass soundbars, and CCTV kits with 18% GST bill.',
      perks: [
        '100% Brand Sealed Pack & Official Warranty',
        'GST 18% ITC Invoicing for Businesses',
        'Instant Counter Pickup on Chiniya Road'
      ],
      priceTag: 'Frontech Hardware from ₹199',
      priceNote: 'Direct brand warranty across India',
      ctaText: 'Explore All 131 Frontech Items',
      ctaLink: '/shop?brand=Frontech',
      whatsappMessage: 'Hello Lapiez Garhwa, I want to explore the official Frontech product range.',
      image: 'https://frontechonline.com/cdn/shop/files/Banner_900x240_v2_a2d0c753-543d-472d-816a-d810a97f08c1.jpg?v=1791359069&width=3840',
      bgGradient: 'from-[#051F20] via-[#0B3C35] to-[#047857]',
      accentBorder: 'border-emerald-400/30'
    },
    // 0B. FRONTECH CURVED GAMING DISPLAYS
    {
      id: 'banner-frontech-monitors',
      badge: 'OFFICIAL FRONTECH STORE • 3-YEAR WARRANTY',
      badgeIcon: <Zap className="w-3.5 h-3.5 text-yellow-400" />,
      badgeBg: 'bg-yellow-500/20 border-yellow-400/40 text-yellow-200',
      badgeText: 'text-yellow-300',
      title: 'Frontech Ultima Curved Gaming Displays',
      titleHighlight: '100Hz & 165Hz Frameless Monitors from ₹5,999',
      subtitle: 'Experience ultra-immersive curved viewing with 99% sRGB color gamut, low blue light eye care & built-in stereo speakers. Tested on showroom counter.',
      perks: [
        'Frameless Curved IPS Display Panel',
        'Dual HDMI + VGA Connectivity',
        '3-Year All-India On-Site Warranty'
      ],
      priceTag: 'Frontech Displays from ₹5,999',
      priceNote: '18% GST tax invoice included',
      ctaText: 'Shop Frontech Monitors',
      ctaLink: '/shop?brand=Frontech&cat=Computers',
      whatsappMessage: 'Hello Lapiez Garhwa, I want to inquire about Frontech curved gaming monitors.',
      image: 'https://frontechonline.com/cdn/shop/files/Curved_MON_Banner_900x240_4d9d539a-9786-4acc-a586-25da2266c152.jpg?v=1776420392&width=3840',
      bgGradient: 'from-[#0A1633] via-[#0D224E] to-[#1E3A8A]',
      accentBorder: 'border-yellow-400/30'
    },
    // 0C. FRONTECH KEYBOARDS & MICE
    {
      id: 'banner-frontech-keyboards',
      badge: 'HIGH-PRECISION ERGONOMIC PERIPHERALS',
      badgeIcon: <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />,
      badgeBg: 'bg-purple-500/20 border-purple-400/40 text-purple-200',
      badgeText: 'text-purple-300',
      title: 'Frontech RGB Gaming Keyboards & Wireless Combos',
      titleHighlight: 'Durable Mechanical Feel • Starting @ ₹449',
      subtitle: 'Spill-resistant ergonomic typing, multi-DPI gaming optical sensors, and silent wireless office combos with 1-year brand warranty.',
      perks: [
        'Spill-Resistant Ergonomic Design',
        'High-Speed USB Plug & Play',
        '1-Year Frontech Brand Replacement'
      ],
      priceTag: 'Combos Starting @ ₹449',
      priceNote: 'Up to 65% OFF MRP',
      ctaText: 'Shop Keyboards & Mice',
      ctaLink: '/shop?brand=Frontech&cat=Accessories',
      whatsappMessage: 'Hello Lapiez Garhwa, I want to buy Frontech keyboard and mouse combo.',
      image: 'https://frontechonline.com/cdn/shop/files/KEYBOARD_MOUSE__3840_x_1000_v2.jpg?v=1782379136&width=3840',
      bgGradient: 'from-[#1E0836] via-[#35105D] to-[#5B21B6]',
      accentBorder: 'border-purple-400/30'
    },
    // 0D. FRONTECH AUDIO & SOUNDBARS
    {
      id: 'banner-frontech-audio',
      badge: 'THUNDEROUS SOUND • PARTY & HOME THEATER',
      badgeIcon: <Flame className="w-3.5 h-3.5 text-[#F43F5E]" />,
      badgeBg: 'bg-rose-500/20 border-rose-400/40 text-rose-200',
      badgeText: 'text-rose-300',
      title: 'Frontech Soundbars, Tower & Trolley Speakers',
      titleHighlight: 'Deep Bass Bluetooth 5.0 Audio from ₹999',
      subtitle: 'Fill your home with heavy bass! Powerful wireless soundbars with subwoofer, karaoke party trolley speakers, and sleek multimedia desktop speakers.',
      perks: [
        'Bluetooth 5.0 Wireless + AUX/USB',
        'Deep Bass Woofer Acoustics',
        'Remote Control & Karaoke Mic Included'
      ],
      priceTag: 'Audio Systems from ₹999',
      priceNote: 'Heavy wooden cabinet sound',
      ctaText: 'Explore Frontech Audio',
      ctaLink: '/shop?brand=Frontech&search=Speaker',
      whatsappMessage: 'Hello Lapiez Garhwa, I want to inquire about Frontech soundbars and trolley speakers.',
      image: 'https://frontechonline.com/cdn/shop/files/SPEAKER_3840_x_1000_v2.jpg?v=1782379243&width=3840',
      bgGradient: 'from-[#2B091B] via-[#4C0E31] to-[#9F1239]',
      accentBorder: 'border-rose-400/30'
    },
    // 1. MEGA LAPTOP FESTIVAL
    {
      id: 'banner-laptop-fest',
      badge: 'FESTIVAL DHAMAKA SALE • GARHWA SHOWROOM',
      badgeIcon: <Flame className="w-3.5 h-3.5 fill-[#EF4444] text-[#EF4444]" />,
      badgeBg: 'bg-red-500/20 border-red-400/40 text-red-200',
      badgeText: 'text-red-300',
      title: 'Upgrade to 12th & 13th Gen Laptops',
      titleHighlight: 'Save Up to 45% + 18% GST Bill',
      subtitle: 'HP 15s, Dell Inspiron, Lenovo ThinkPad & ASUS in stock with 16GB RAM + 512GB SSD. Ready for immediate counter pickup or same-day delivery.',
      perks: [
        '100% Brand Sealed Pack',
        'Official Brand Warranty All-India',
        'No Cost EMI Available'
      ],
      priceTag: 'Laptops Starting @ ₹24,999',
      priceNote: '18% GST ITC claimable for business',
      ctaText: 'Shop Laptop Deals',
      ctaLink: '/shop?cat=Laptops',
      whatsappMessage: 'Hello Lapiez Garhwa, I want to inquire about festival laptop offers and pricing.',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      bgGradient: 'from-[#0A1633] via-[#0F2960] to-[#1A56DB]',
      accentBorder: 'border-blue-400/30'
    },
    // 2. CP-PLUS & HIKVISION CCTV SECURITY
    {
      id: 'banner-cctv-security',
      badge: 'HOME & BUSINESS SECURITY SPECIAL',
      badgeIcon: <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />,
      badgeBg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200',
      badgeText: 'text-emerald-300',
      title: 'CP-PLUS 4-Camera 5MP Night-Vision Kit',
      titleHighlight: 'Full Color 24/7 Security @ ₹18,499',
      subtitle: 'Complete package with 4x 5MP cameras, 4-Channel AI DVR, 1TB Seagate Purple HDD, power supply & mobile live view app anywhere in the world.',
      perks: [
        'Color Night-Vision in Complete Darkness',
        'Seagate 1TB Purple HDD Included',
        'Free On-Site Guidance in Garhwa'
      ],
      priceTag: 'Complete 4-Camera Kit ₹18,499',
      priceNote: 'MRP ₹24,000 • Save ₹5,501 (23% OFF)',
      ctaText: 'View CCTV Packages',
      ctaLink: '/shop?cat=CCTV%20%26%20Security',
      whatsappMessage: 'Hello Lapiez Garhwa, I want a quote for 4-camera CP-PLUS CCTV security kit.',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
      bgGradient: 'from-[#03241C] via-[#064E3B] to-[#047857]',
      accentBorder: 'border-emerald-400/30'
    },
    // 3. CUSTOM CREATOR & GAMING RIGS
    {
      id: 'banner-custom-pc',
      badge: 'CUSTOM WORKSTATIONS • BUILT & TESTED IN GARHWA',
      badgeIcon: <Cpu className="w-3.5 h-3.5 text-[#A78BFA]" />,
      badgeBg: 'bg-purple-500/20 border-purple-400/40 text-purple-200',
      badgeText: 'text-purple-300',
      title: 'Intel Core i5/i7 + RTX Graphics Workstations',
      titleHighlight: 'Zero Bottleneck • Towers from ₹38,999',
      subtitle: 'Engineered for 4K video rendering, AutoCAD, 3D animations, and high-FPS gaming. Tested on counter with live temperature & benchmark reports.',
      perks: [
        'Ultra-Fast Gen4 NVMe M.2 SSD',
        'RGB High-Airflow Thermal Case',
        'Free Lifetime OS & Hardware Setup'
      ],
      priceTag: 'Creator Towers from ₹38,999',
      priceNote: 'Benchmark tested with warranty',
      ctaText: 'Explore Custom PCs',
      ctaLink: '/shop?cat=Computers',
      whatsappMessage: 'Hello Lapiez Garhwa, I want to configure a custom PC for video editing / gaming.',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
      bgGradient: 'from-[#171033] via-[#2E1065] to-[#4338CA]',
      accentBorder: 'border-purple-400/30'
    },
    // 4. ORIGINAL SPARES & SSD UPGRADES
    {
      id: 'banner-spares-upgrade',
      badge: 'INSTANT 10X SPEED BOOST • FREE SHOWROOM FITTING',
      badgeIcon: <Zap className="w-3.5 h-3.5 text-[#FCD34D]" />,
      badgeBg: 'bg-amber-500/20 border-amber-400/40 text-amber-200',
      badgeText: 'text-amber-300',
      title: 'Crucial & Kingston NVMe SSDs & Laptop Spares',
      titleHighlight: 'Genuine Adapters, Batteries & SSDs from ₹499',
      subtitle: 'Revive your slow laptop! Crucial, Kingston & WD NVMe M.2 SSDs starting at ₹1,299 with free showroom fitting and OS migration at our Chiniya Road lab.',
      perks: [
        '10X Faster Boot & Smooth Multitasking',
        'Genuine OEM 65W/90W Smart Chargers',
        '30-Minute Counter Fitting in Garhwa'
      ],
      priceTag: 'High-Speed SSDs from ₹1,299',
      priceNote: 'Adapters from ₹899 • Free Installation',
      ctaText: 'Explore Spares & SSDs',
      ctaLink: '/shop?search=SSD',
      whatsappMessage: 'Hello Lapiez Garhwa, I want to upgrade my laptop SSD / buy original adapter.',
      image: '/images/categories/laptop-ssd.png',
      bgGradient: 'from-[#381504] via-[#78350F] to-[#EA580C]',
      accentBorder: 'border-orange-400/30'
    }
  ];

export const TopBannerSlider: React.FC = () => {
  const { banners: cmsBanners, siteSettings } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const banners: BannerSlide[] = useMemo(() => {
    if (cmsBanners && cmsBanners.length > 0) {
      const active = cmsBanners
        .filter((b) => b.status !== 'inactive')
        .sort((a, b) => a.position - b.position);
      if (active.length > 0) {
        return [DEFAULT_BANNERS[0], ...active.map((b, idx) => ({
          id: b.id || `banner-${idx}`,
          badge: b.badge || 'FESTIVAL SPECIAL • GARHWA SHOWROOM',
          badgeIcon: <Flame className="w-3.5 h-3.5 fill-[#EF4444] text-[#EF4444]" />,
          badgeBg: 'bg-red-500/20 border-red-400/40 text-red-200',
          badgeText: 'text-red-300',
          title: b.title,
          titleHighlight: b.titleHighlight || '',
          subtitle: b.subtitle || 'Authorized sales & repair center on Chiniya Road, Garhwa.',
          perks: [
            '100% Brand Sealed Pack',
            'Official Brand Warranty All-India',
            'Same-Day Garhwa Delivery'
          ],
          priceTag: 'Verified Showroom Price',
          priceNote: '18% GST ITC Bill Included',
          ctaText: b.buttonText || 'Shop Now',
          ctaLink: b.buttonUrl || '/shop',
          whatsappMessage: b.whatsappMsg || 'Hello Lapiez Garhwa, I want to inquire about this offer.',
          image: b.desktopImage || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
          bgGradient: b.bgGradient || 'from-[#0A1633] via-[#0F2960] to-[#1A56DB]',
          accentBorder: 'border-blue-400/30'
        }))];
      }
    }
    return DEFAULT_BANNERS;
  }, [cmsBanners]);

  const totalSlides = banners.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay timer (4.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch Swipe Handlers for mobile users
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section 
      className="w-full relative pt-2 pb-1"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional Banners Carousel"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Banner Frame Container */}
        <div className="relative overflow-hidden rounded-2xl shadow-md border border-[#E5E7EB]">
          
          {/* Slides Track */}
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((slide, index) => {
              if (slide.fullBleedImage) {
                return (
                  <Link
                    key={slide.id}
                    href={slide.ctaLink}
                    aria-label={slide.ctaText}
                    className="min-w-full block bg-white"
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-auto object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </Link>
                );
              }

              return (
              <div 
                key={slide.id}
                className={`min-w-full relative bg-gradient-to-r ${slide.bgGradient} text-white p-4 sm:p-7 md:p-9 lg:p-10 flex flex-col justify-between overflow-hidden min-h-[250px] sm:min-h-[320px] md:min-h-[350px]`}
              >
                {/* Background Tech Watermark / Pattern */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-end pr-10">
                  <div className="w-96 h-96 rounded-full border-8 border-white/20 blur-2xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 items-center relative z-10">
                  
                  {/* Left Column: Copy & CTAs (7-8 cols on desktop) */}
                  <div className="md:col-span-8 space-y-2 sm:space-y-3.5">
                    
                    {/* Top Eyebrow Pill */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border text-[10px] sm:text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${slide.badgeBg}`}>
                        {slide.badgeIcon}
                        <span>{slide.badge}</span>
                      </div>
                      
                      {/* Slide Indicator Badge */}
                      <span className="text-[10px] sm:text-[11px] font-semibold text-white/60 bg-black/20 px-2 py-0.5 rounded-full hidden sm:inline-block">
                        Deal {index + 1} of {totalSlides}
                      </span>
                    </div>

                    {/* Headline */}
                    <div>
                      <h2 className="text-[17px] sm:text-2xl md:text-3xl lg:text-[34px] font-extrabold text-white tracking-tight leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-[13.5px] sm:text-[18px] md:text-[20px] font-bold text-[#FDE047] tracking-tight mt-0.5 leading-snug">
                        {slide.titleHighlight}
                      </p>
                    </div>

                    {/* Subtitle */}
                    <p className="text-[11px] sm:text-[13.5px] text-white/80 line-clamp-2 leading-relaxed max-w-xl">
                      {slide.subtitle}
                    </p>

                    {/* Quick Perks Checklist */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs text-white/90 font-medium pt-0.5">
                      {slide.perks.map((perk, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                          <span>{perk}</span>
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons & Pricing */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1.5 sm:pt-2">
                      <Link
                        href={slide.ctaLink}
                        className="h-8.5 sm:h-11 px-3.5 sm:px-6 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-extrabold text-[12px] sm:text-[14px] flex items-center gap-1.5 sm:gap-2 transition-all shadow-md active:scale-[0.98]"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Link>

                      <a
                        href={`https://wa.me/${siteSettings?.whatsapp || STORE_INFO.whatsapp}?text=${encodeURIComponent(slide.whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8.5 sm:h-11 px-3 sm:px-5 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-[12px] sm:text-[13.5px] flex items-center gap-1.5 sm:gap-2 transition-all shadow-md active:scale-[0.98]"
                      >
                        <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
                        <span className="hidden sm:inline">WhatsApp Order</span>
                        <span className="sm:hidden">WhatsApp</span>
                      </a>

                      {/* Rupee Price Tag Badge */}
                      <div className="hidden lg:flex flex-col pl-3 border-l border-white/20">
                        <span className="text-[13px] font-extrabold text-white leading-tight">
                          {slide.priceTag}
                        </span>
                        <span className="text-[10.5px] text-white/70">
                          {slide.priceNote}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Hero Visual Showcase (4-5 cols on desktop) */}
                  <div className="hidden md:flex md:col-span-4 items-center justify-center relative">
                    <div className="relative w-full aspect-[4/3] max-w-[320px] rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="max-h-full max-w-full object-contain filter drop-shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                      
                      {/* Price Tag Pill on Image */}
                      <div className="absolute -bottom-2 -left-2 bg-[#111827] text-white text-[11px] font-extrabold px-3 py-1 rounded-lg border border-white/20 shadow-lg flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                        <span>Ready at Chiniya Rd</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
              );
            })}
          </div>

          {/* Left Arrow Navigation Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-1.5 sm:left-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 shadow-lg z-20 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Arrow Navigation Button */}
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-1.5 sm:right-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 shadow-lg z-20 active:scale-95"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Bottom Indicators & Thumb Navigation Bar */}
          <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full h-2 ${
                  currentSlide === i 
                    ? 'w-7 sm:w-8 bg-[#FDE047] shadow-sm' 
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
