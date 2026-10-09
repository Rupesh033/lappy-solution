'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, ShoppingCart, Heart, User, 
  Phone, Menu, X, ArrowRight, MapPin, 
  ShieldCheck, MessageSquare, ChevronDown, ChevronUp,
  ShoppingBag, ExternalLink, Sparkles
} from 'lucide-react';
import { STORE_INFO } from '../data/storeData';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  onOpenAccount?: () => void;
  onOpenWishlist?: () => void;
}

// Exact 4-column mega menu hierarchy as shown in the user's uploaded reference image
const MEGA_MENU_COLUMNS = [
  // Column 1
  {
    groups: [
      {
        title: 'Laptop Parts',
        href: '/shop?cat=Laptop%20Parts%20%26%20Spares',
        items: [
          { label: 'Laptop Body', href: '/shop?search=Laptop%20Body' },
          { label: 'Laptop Parts', href: '/shop?cat=Laptop%20Parts%20%26%20Spares' },
        ],
      },
      {
        title: 'Printer',
        href: '/shop?cat=Printers%20%26%20Parts',
        items: [
          { label: 'Toner & Ink', href: '/shop?search=Toner%20Ink' },
          { label: 'Printers', href: '/shop?cat=Printers%20%26%20Parts' },
        ],
      },
    ],
  },

  // Column 2
  {
    groups: [
      {
        title: 'Computer Peripherals',
        href: '/shop?cat=Computer%20Peripherals',
        items: [
          { label: 'Mouse & Keyboard', href: '/shop?search=Keyboard' },
          { label: 'SPEAKER', href: '/shop?search=Speaker' },
          { label: 'Computer Peripherals', href: '/shop?cat=Computer%20Peripherals' },
          { label: 'Cable & Connector', href: '/shop?search=Cable' },
        ],
      },
      {
        title: 'Accessories',
        href: '/shop?cat=Computer%20Peripherals',
        items: [
          { label: 'Pendrive & SD Card', href: '/shop?search=Pendrive' },
          { label: 'Cable & Connector', href: '/shop?search=Cable' },
        ],
      },
    ],
  },

  // Column 3
  {
    groups: [
      {
        title: 'Printer Parts',
        href: '/shop?cat=Printers%20%26%20Parts',
        items: [
          { label: 'Toner & Ink', href: '/shop?search=Toner' },
          { label: 'Paper &Sticker', href: '/shop?search=Paper' },
          { label: 'Printer Parts', href: '/shop?cat=Printers%20%26%20Parts' },
        ],
      },
      {
        title: 'Other Collections',
        href: '/shop',
        items: [
          { label: 'Toner & Ink', href: '/shop?search=Toner' },
          { label: 'Mouse & Keyboard', href: '/shop?search=Mouse' },
          { label: 'CCTV', href: '/shop?cat=CCTV%20%26%20Security' },
          { label: 'Printers', href: '/shop?cat=Printers%20%26%20Parts' },
          { label: 'More ▾', href: '/shop' },
        ],
      },
    ],
  },

  // Column 4
  {
    groups: [
      {
        title: 'CCTV',
        href: '/shop?cat=CCTV%20%26%20Security',
        items: [
          { label: 'CCTV', href: '/shop?cat=CCTV%20%26%20Security' },
          { label: 'Cable & Connector', href: '/shop?search=Cable' },
        ],
      },
    ],
  },
];

export const Navbar: React.FC<NavbarProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    cart, 
    wishlistIds, 
    setIsCartOpen, 
    products, 
    setSelectedProduct,
    siteSettings,
    customer
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const shopMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or route change
  useEffect(() => {
    setIsShopMenuOpen(false);
    setIsMoreMenuOpen(false);
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
      setIsSearchOpen(false);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Instant Search Suggestions
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      
      {/* 1. Indian E-Commerce Top Announcement Bar */}
      <div className="bg-[#1A56DB] text-white text-[11px] sm:text-[12px] py-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FEF08A] flex-shrink-0" />
            <span className="text-blue-100 hidden sm:inline">Deliver to:</span>
            <strong className="text-white font-semibold">Garhwa & Palamu (822114)</strong>
            <span className="hidden md:inline-block ml-2 text-blue-200">
              | Free Same-Day Delivery
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
              {siteSettings?.announcementText || '100% Asli Samaan • 18% GST Bill • Lapiez Garhwa'}
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

      {/* 2. Main E-Commerce Header Bar (Matching Reference Screenshot) */}
      <div className="border-b border-[#E5E7EB] bg-white px-4 sm:px-8 py-3 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* LEFT: Nav Links (Home, Shop ^, About Us, Support, More v) */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-semibold text-[#1E3A8A]">
            
            {/* Home Link */}
            <Link 
              href="/" 
              className={`hover:text-[#2563EB] transition-colors ${pathname === '/' ? 'text-[#2563EB] font-bold' : ''}`}
            >
              Home
            </Link>

            {/* Shop with Mega Dropdown */}
            <div 
              ref={shopMenuRef}
              className="relative"
              onMouseEnter={() => setIsShopMenuOpen(true)}
            >
              <button
                type="button"
                onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
                className={`flex items-center gap-1.5 hover:text-[#2563EB] transition-colors py-1 cursor-pointer ${
                  isShopMenuOpen ? 'text-[#2563EB] font-bold' : ''
                }`}
              >
                <span>Shop</span>
                {isShopMenuOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#2563EB] stroke-[2.5]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 stroke-[2.5]" />
                )}
              </button>
            </div>

            {/* About Us Link */}
            <Link 
              href="/contact" 
              className={`hover:text-[#2563EB] transition-colors ${pathname === '/contact' ? 'text-[#2563EB] font-bold' : ''}`}
            >
              About Us
            </Link>

            {/* Support Link */}
            <Link 
              href="/contact" 
              className="hover:text-[#2563EB] transition-colors"
            >
              Support
            </Link>

            {/* More with dropdown */}
            <div 
              ref={moreMenuRef}
              className="relative"
              onMouseEnter={() => setIsMoreMenuOpen(true)}
              onMouseLeave={() => setIsMoreMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="flex items-center gap-1 hover:text-[#2563EB] transition-colors py-1 cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                  <Link 
                    href="/blogs" 
                    className="block px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-[#1A56DB] font-medium"
                  >
                    Tech Guides & Tutorials
                  </Link>
                  <Link 
                    href="/contact" 
                    className="block px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-[#1A56DB] font-medium"
                  >
                    Showroom Location & Counter
                  </Link>
                  <Link 
                    href="/account?tab=gst" 
                    className="block px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-[#1A56DB] font-medium"
                  >
                    18% GST Invoicing & ITC
                  </Link>
                  <Link 
                    href="/pages/terms-conditions" 
                    className="block px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-[#1A56DB] font-medium"
                  >
                    Terms & Conditions
                  </Link>
                  <Link 
                    href="/pages/privacy-policy" 
                    className="block px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-[#1A56DB] font-medium"
                  >
                    Privacy Policy
                  </Link>
                </div>
              )}
            </div>

          </nav>

          {/* CENTER: Shopping Cart Logo with LAPIEZ text (Exact replica of reference) */}
          <Link href="/" className="flex flex-col items-center justify-center group mx-auto lg:mx-0">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                {/* Shopping cart icon styled like the user's logo */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1A56DB] to-[#0A2560] text-white flex items-center justify-center shadow-sm transform group-hover:scale-105 transition-transform">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="flex flex-col">
                <span className="text-[20px] sm:text-[22px] font-black tracking-tight text-[#111827] leading-none">
                  {siteSettings?.siteName ? (
                    siteSettings.siteName.toLowerCase().includes('lapiez') ? (
                      <>LAP<span className="text-[#1A56DB]">IEZ</span></>
                    ) : (
                      <span className="text-[#111827]">{siteSettings.siteName}</span>
                    )
                  ) : (
                    <>LAP<span className="text-[#1A56DB]">IEZ</span></>
                  )}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold leading-none mt-0.5">
                  {siteSettings?.tagline || 'Garhwa Hardware Store'}
                </span>
              </div>
            </div>
          </Link>

          {/* RIGHT: Action Icons (Search, User, WhatsApp, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            
            {/* Search Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full text-gray-600 hover:text-[#1A56DB] hover:bg-gray-100 transition-colors cursor-pointer"
              title="Search store"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account Button */}
            <Link
              href="/account"
              className="p-2 rounded-full text-gray-600 hover:text-[#1A56DB] hover:bg-gray-100 transition-colors"
              title={customer ? `Account (${customer.email})` : 'Account & Sign In'}
            >
              {customer?.user_metadata?.avatar_url ? (
                <img 
                  src={customer.user_metadata.avatar_url} 
                  alt="Account" 
                  className="w-5 h-5 rounded-full object-cover border border-blue-400"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>

            {/* WhatsApp Support Button */}
            <a
              href={`https://wa.me/${siteSettings?.whatsapp || STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hello ${siteSettings?.siteName || 'Lapiez'}, I want to inquire about products.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-[#16A34A] hover:bg-emerald-50 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-5 h-5" />
            </a>

            {/* Wishlist Button */}
            <Link
              href="/account?tab=wishlist"
              className="relative p-2 rounded-full text-gray-600 hover:text-[#DC2626] hover:bg-red-50 transition-colors hidden sm:flex"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-[#DC2626] text-white text-[9.5px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-gray-800 hover:text-[#1A56DB] hover:bg-gray-100 transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FB641B] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Drawer Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* Search Bar Flyout (When Search Icon is clicked) */}
        {isSearchOpen && (
          <div className="max-w-2xl mx-auto mt-3 pt-3 border-t border-gray-100">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                autoFocus
                placeholder="Search genuine laptops, SSDs, CP-PLUS CCTV, keyboards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                className="w-full h-11 pl-4 pr-12 rounded-xl bg-gray-50 border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#1A56DB] focus:outline-none shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-2 h-8 px-3 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-xs font-bold transition-colors"
              >
                Search
              </button>
            </form>

            {/* Instant Search Suggestions */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 divide-y divide-gray-50">
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onMouseDown={() => {
                      setSelectedProduct(p);
                      setIsSearchOpen(false);
                    }}
                    className="p-2 hover:bg-gray-50 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={p.image} alt={p.name} className="w-9 h-9 object-contain rounded p-0.5 border border-gray-100" />
                      <div className="truncate text-xs">
                        <span className="font-bold text-gray-900 block truncate">{p.name}</span>
                        <span className="text-[#1A56DB] font-extrabold">₹{p.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. MEGA DROPDOWN MENU (MATCHING EXACT SCREENSHOT COLUMNS)  */}
        {/* ========================================================= */}
        {isShopMenuOpen && (
          <div 
            className="hidden lg:block absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-2xl z-50 transition-all animate-in fade-in slide-in-from-top-2 duration-150"
            onMouseEnter={() => setIsShopMenuOpen(true)}
            onMouseLeave={() => setIsShopMenuOpen(false)}
          >
            <div className="max-w-7xl mx-auto px-8 py-8">
              
              {/* 4 Clean Columns Exactly as shown in the uploaded screenshot */}
              <div className="grid grid-cols-4 gap-8">
                {MEGA_MENU_COLUMNS.map((col, colIdx) => (
                  <div key={colIdx} className="space-y-6">
                    {col.groups.map((group, grpIdx) => (
                      <div key={grpIdx} className="space-y-2.5">
                        
                        {/* Column Heading */}
                        <Link
                          href={group.href}
                          className="block font-black text-[15px] text-[#1E3A8A] hover:text-[#2563EB] tracking-tight transition-colors"
                        >
                          {group.title}
                        </Link>

                        {/* Subcategory Links */}
                        <ul className="space-y-2 text-[13.5px] font-semibold text-[#2563EB]">
                          {group.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <Link
                                href={item.href}
                                className="hover:text-[#1D4ED8] hover:underline transition-colors block py-0.5"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Bottom Quick Bar */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1A56DB]" />
                  <span>Showroom Counter: Opp G P Plaza, Chiniya Road, Garhwa • 100% Genuine Certified Hardware</span>
                </div>
                <Link
                  href="/shop"
                  className="font-bold text-[#1A56DB] hover:text-[#1E40AF] flex items-center gap-1"
                >
                  <span>Explore Entire Store Inventory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          
          <div className="space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-800 hover:text-[#1A56DB]"
            >
              Home
            </Link>

            {/* Mobile Shop Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                className="w-full flex items-center justify-between py-2 text-sm font-bold text-[#1A56DB]"
              >
                <span>Shop by Category</span>
                {mobileShopOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {mobileShopOpen && (
                <div className="pl-3 py-2 space-y-4 border-l-2 border-blue-200 mt-1">
                  {MEGA_MENU_COLUMNS.flatMap(col => col.groups).map((group, gIdx) => (
                    <div key={gIdx} className="space-y-1.5">
                      <Link
                        href={group.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block font-black text-xs text-[#1E3A8A]"
                      >
                        {group.title}
                      </Link>
                      <div className="pl-2 space-y-1 text-xs text-[#2563EB]">
                        {group.items.map((item, iIdx) => (
                          <Link
                            key={iIdx}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-0.5 hover:underline"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-800 hover:text-[#1A56DB]"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-800 hover:text-[#1A56DB]"
            >
              Support & Contact
            </Link>

            <Link
              href="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-800 hover:text-[#1A56DB]"
            >
              Tech Blogs & Tutorials
            </Link>

            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-gray-800 hover:text-[#1A56DB]"
            >
              My Account & Orders
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
            <a
              href={`https://wa.me/${siteSettings?.whatsapp || STORE_INFO.whatsapp}?text=${encodeURIComponent(`Hello ${siteSettings?.siteName || 'Lapiez'}, I need quick support.`)}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Showroom Desk</span>
            </a>
            <a
              href={`tel:${siteSettings?.phone || STORE_INFO.phone}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gray-100 text-gray-800 font-bold text-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Call ({siteSettings?.phone || STORE_INFO.phone})</span>
            </a>
          </div>

        </div>
      )}

    </header>
  );
};
