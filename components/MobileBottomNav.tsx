'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, ShoppingBag, Flame, MessageSquare, ShoppingCart, User
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/storeData';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cart, setIsCartOpen, setIsAccountOpen, setAccountTab } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
      isActive: pathname === '/'
    },
    {
      label: 'Catalog',
      icon: ShoppingBag,
      href: '/shop',
      isActive: pathname === '/shop'
    },
    {
      label: 'Deals 🔥',
      icon: Flame,
      href: '/shop?search=Deal',
      isActive: false,
      isSpecial: true
    },
    {
      label: 'WhatsApp',
      icon: MessageSquare,
      href: `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Hello Lappy Solution Garhwa, I want to inquire about products.')}`,
      isExternal: true,
      isGreen: true
    }
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.isExternal) {
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center flex-1 py-1 text-center group active:scale-95 transition-transform"
            >
              <div className="w-5 h-5 flex items-center justify-center text-[#16A34A] group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4 fill-emerald-100" />
              </div>
              <span className="text-[10px] font-bold text-[#16A34A] mt-0.5 leading-tight">
                {item.label}
              </span>
            </a>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors active:scale-95 ${
              item.isActive
                ? 'text-[#1A56DB] font-extrabold'
                : item.isSpecial
                ? 'text-[#DC2626] font-bold'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Icon className={`w-4 h-4 ${item.isSpecial ? 'fill-[#DC2626]' : ''}`} />
            </div>
            <span className={`text-[10px] mt-0.5 leading-tight ${item.isActive ? 'font-extrabold' : 'font-semibold'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Cart Button with Counter */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center flex-1 py-1 text-center transition-transform active:scale-95 text-[#FB641B]"
        aria-label="View Shopping Cart"
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-[#DC2626] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-[#FB641B] mt-0.5 leading-tight">
          Cart
        </span>
      </button>
    </nav>
  );
};
