'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, ShoppingCart, Heart, User, 
  Phone, Menu, X, ArrowRight, MapPin, 
  ShieldCheck, MessageSquare, Flame, CheckCircle2
} from 'lucide-react';
import { STORE_INFO } from '../data/storeData';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  onOpenAccount?: () => void;
  onOpenWishlist?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAccount,
  onOpenWishlist
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    cart, 
    wishlistIds, 
    setIsCartOpen, 
    products, 
    setSelectedProduct,
    setIsAccountOpen,
    setAccountTab,
    siteSettings
  } = useStore();

  const handleOpenAccount = () => {
    router.push('/account');
  };

  const handleOpenWishlist = () => {
    router.push('/account?tab=wishlist');
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Search filter
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const navCategories = [
    { href: '/shop', label: 'All Categories' },
    { href: '/shop?cat=Laptops', label: 'Laptops', hot: true },
    { href: '/shop?cat=Computers', label: 'Desktops & Rigs' },
    { href: '/shop?cat=CCTV%20%26%20Security', label: 'CCTV Security' },
    { href: '/shop?cat=Accessories', label: 'Laptop Spares' },
    { href: '/shop?cat=Storage%20%26%20Parts', label: 'SSDs & RAM' },
    { href: '/shop?cat=Printers', label: 'Printers' },
    { href: '/shop?search=Deal', label: 'Festival Deals 🔥', special: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* 1. Indian E-Commerce Top Announcement Bar */}
      <div className="bg-[#1A56DB] text-white text-[11px] sm:text-[12px] py-1 sm:py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Location Delivery Selector (Indian standard) */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FEF08A] flex-shrink-0" />
            <span className="text-blue-100 hidden sm:inline">Deliver to:</span>
            <strong className="text-white font-semibold">Garhwa & Palamu (822114)</strong>
            <span className="hidden md:inline-block ml-2 text-blue-200">
              | Free Same-Day Delivery
            </span>
          </div>

          {/* Hindi/English Reassurance & Helpline */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
              {siteSettings?.announcementText || '100% Asli Samaan • 18% GST Bill'}
            </span>
            <span className="hidden sm:inline text-blue-300">|</span>
            <a 
              href={`tel:${siteSettings?.phone || STORE_INFO.phone}`} 
              className="flex items-center gap-1 text-white hover:text-yellow-200 font-medium transition-colors"
            >
              <Phone className="w-3 h-3 text-yellow-300" />
              <span>{siteSettings?.phone || STORE_INFO.phone}</span>
            </a>
            <Link 
              href="/account"
              className="text-white hover:text-yellow-200 font-medium transition-colors"
            >
              Track Order
            </Link>
          </div>

        </div>
      </div>

      {/* 2. Main E-Commerce Header Bar */}
      <div className="border-b border-[#E5E7EB] bg-white px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo with Indian Store Assured Badge */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1A56DB] flex items-center justify-center font-extrabold text-white text-[14px] sm:text-[15px] shadow-sm tracking-tight">
              LS
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[#111827] text-[16px] sm:text-[20px] leading-tight tracking-tight">
                {siteSettings?.siteName ? (
                  siteSettings.siteName
                ) : (
                  <>LAPPY<span className="text-[#1A56DB]">SOLUTION</span></>
                )}
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-[#15803D] font-bold flex items-center gap-1 leading-none mt-0.5">
                <CheckCircle2 className="w-2.5 h-2.5 text-[#15803D]" />
                Garhwa Verified Store
              </span>
            </div>
          </Link>

          {/* Flipkart / Amazon Style Wide Search Bar (Desktop) */}
          <div className="relative flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#F1F3F6] border border-[#D1D5DB] focus-within:border-[#1A56DB] focus-within:bg-white rounded-lg overflow-hidden transition-all shadow-2xs">
              <input
                type="text"
                placeholder="Search for genuine Laptops, SSDs, CP-PLUS CCTV, Keyboards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                className="w-full h-10 bg-transparent pl-3 pr-3 text-[13.5px] text-[#111827] placeholder-[#6B7280] focus:outline-none"
              />
              <button 
                type="submit"
                className="h-10 px-4 bg-[#1A56DB] hover:bg-[#1E40AF] text-white flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Search Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#CBD5E1] rounded-xl shadow-xl p-2 z-50 space-y-1">
                <div className="text-[11px] font-bold text-gray-500 uppercase px-2 py-1 tracking-wider border-b border-gray-100">
                  Top Matching Products ({searchResults.length})
                </div>
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onMouseDown={() => setSelectedProduct(p)}
                    className="p-2 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-10 h-10 rounded bg-[#F8FAFC] p-1 flex-shrink-0 border border-gray-100">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#111827] truncate">{p.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-[#1A56DB] font-bold">₹{p.price.toLocaleString('en-IN')}</span>
                          {p.mrp > p.price && (
                            <span className="text-[10.5px] text-gray-400 line-through">₹{p.mrp.toLocaleString('en-IN')}</span>
                          )}
                          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1 rounded">
                            {p.discount}% OFF
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons: WhatsApp, Wishlist, Account, Cart */}
          <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
            
            {/* Quick WhatsApp Inquiry Button */}
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Hello Lappy Solution Garhwa, I want to check laptop and CCTV prices.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#15803D] border border-[#A7F3D0] text-[13px] font-semibold transition-colors"
              title="Chat with Showroom on WhatsApp"
            >
              <MessageSquare className="w-4 h-4 text-[#16A34A]" />
              <span>WhatsApp</span>
            </a>

            {/* Account / Orders */}
            <button
              onClick={handleOpenAccount}
              className="h-8 sm:h-9 px-2 sm:px-3 rounded-lg text-[#374151] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors flex items-center gap-1.5 text-[12.5px] sm:text-[13px] font-semibold"
              title="My Account & Orders"
            >
              <User className="w-4 h-4 text-[#4B5563]" />
              <span className="hidden sm:inline">Account</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={handleOpenWishlist}
              className="relative h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg text-[#374151] hover:text-[#DC2626] hover:bg-[#F3F4F6] transition-colors flex items-center justify-center"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-[9.5px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button with Rupee Total */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-lg bg-[#FB641B] hover:bg-[#E0530F] text-white text-[12px] sm:text-[13px] font-bold flex items-center gap-1.5 sm:gap-2 transition-all shadow-xs active:scale-[0.98]"
              title="View Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="bg-white/20 text-white text-[10.5px] sm:text-[11px] font-extrabold px-1.5 py-0.2 rounded-md">
                {cartCount}
              </span>
              {cartTotal > 0 && (
                <span className="hidden xl:inline text-xs font-semibold">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Search Box */}
        <div className="md:hidden mt-2 relative">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#F1F3F6] border border-[#D1D5DB] rounded-lg overflow-hidden focus-within:border-[#1A56DB] focus-within:bg-white transition-all">
            <input
              type="text"
              placeholder="Search laptops, spares, CCTV kits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              className="w-full h-8.5 bg-transparent pl-3 pr-2 text-xs text-[#111827] placeholder-[#6B7280] focus:outline-none"
            />
            <button 
              type="submit" 
              className="h-8.5 px-3 bg-[#1A56DB] hover:bg-[#1E40AF] text-white flex items-center justify-center flex-shrink-0"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Instant Search Suggestions on Mobile */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#CBD5E1] rounded-xl shadow-xl p-2 z-50 space-y-1">
              <div className="text-[10px] font-bold text-gray-500 uppercase px-2 py-1 tracking-wider border-b border-gray-100 flex justify-between">
                <span>Matching ({searchResults.length})</span>
                <span className="text-[#1A56DB]">Tap to view</span>
              </div>
              {searchResults.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onMouseDown={() => {
                    setSelectedProduct(p);
                    setIsSearchFocused(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1">
                    <div className="w-8 h-8 rounded bg-[#F8FAFC] p-1 flex-shrink-0 border border-gray-100">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-medium text-[#111827] truncate">{p.name}</p>
                      <span className="text-[11px] text-[#1A56DB] font-bold">₹{p.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 3. Horizontal Indian E-Commerce Category Strip */}
      <nav className="border-b border-[#E5E7EB] bg-white px-3 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-6 text-[13px] font-semibold text-[#374151] whitespace-nowrap py-2">
          {navCategories.map((cat) => {
            const isActive = pathname === cat.href;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className={`py-1 px-2 rounded-md transition-colors flex items-center gap-1.5 ${
                  cat.special 
                    ? 'text-[#DC2626] font-bold hover:bg-red-50' 
                    : isActive 
                    ? 'text-[#1A56DB] bg-blue-50 font-bold' 
                    : 'hover:text-[#1A56DB] hover:bg-gray-50'
                }`}
              >
                <span>{cat.label}</span>
                {cat.hot && (
                  <span className="text-[9px] uppercase font-extrabold bg-[#FB641B] text-white px-1.5 py-0.2 rounded">
                    HOT
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-3">
          <div className="space-y-1">

            {navCategories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 text-sm font-medium text-gray-700 hover:text-[#1A56DB] hover:bg-blue-50 rounded-lg"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}`}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#25D366] text-white font-semibold text-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gray-100 text-gray-800 font-semibold text-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Call Showroom ({STORE_INFO.phone})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
