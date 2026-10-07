'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  X, Package, Heart, ShoppingCart, Trash2, ArrowRight, ExternalLink, FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CustomerAccountModal: React.FC = () => {
  const router = useRouter();
  const { 
    isAccountOpen, 
    setIsAccountOpen, 
    accountTab, 
    setAccountTab,
    orders,
    wishlistIds,
    products,
    addToCart,
    toggleWishlist
  } = useStore();

  if (!isAccountOpen) return null;

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Customer Account</h2>
            <p className="text-xs text-slate-500">Track orders and manage saved hardware</p>
          </div>
          <button
            onClick={() => setIsAccountOpen(false)}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-between gap-2 pt-4 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAccountTab('orders')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                accountTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setAccountTab('wishlist')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                accountTab === 'wishlist'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist ({wishlistProducts.length})</span>
            </button>
          </div>

          <Link
            href="/account"
            onClick={() => setIsAccountOpen(false)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Full Account Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Orders list */}
        {accountTab === 'orders' && (
          <div className="space-y-3">
            {orders.length > 0 ? (
              orders.map((ord: any) => (
                <div key={ord.orderId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900">#{ord.orderId}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {ord.paymentStatus || 'Confirmed'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{ord.orderDate} • ₹{Number(ord.totalAmount || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        router.push(`/invoice/${ord.orderId}`);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1 transition-colors border border-emerald-200"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        router.push(`/order-success/${ord.orderId}`);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-800 text-sm">No orders yet</p>
                <p className="text-xs mt-0.5">Your orders will appear here with live tracking updates.</p>
              </div>
            )}
          </div>
        )}

        {/* Wishlist list */}
        {accountTab === 'wishlist' && (
          <div className="space-y-3">
            {wishlistProducts.length > 0 ? (
              wishlistProducts.map((p) => (
                <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-slate-200 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">{p.name}</h4>
                      <p className="text-xs font-bold text-blue-600 font-mono">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        addToCart(p);
                        setIsAccountOpen(false);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(p)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Heart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-800 text-sm">Your wishlist is empty</p>
                <p className="text-xs mt-0.5">Click the heart icon on any hardware product to save it.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
