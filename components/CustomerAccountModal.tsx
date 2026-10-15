'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  X, Package, Heart, ShoppingCart, Trash2, ArrowRight, ExternalLink, FileText,
  LogOut, Sparkles, User as UserIcon, Minus, Plus
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
    cart,
    updateQuantity,
    removeFromCart,
    wishlistIds, 
    products, 
    addToCart, 
    toggleWishlist, 
    customer,
    signInWithGoogle,
    signOutCustomer,
    showToast
  } = useStore();

  if (!isAccountOpen) return null;

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));
  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const totalCartAmount = cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);

  const customerOrders = React.useMemo(() => {
    if (!customer) return orders;
    const email = customer.email?.toLowerCase();
    const phone = customer.phone;
    return orders.filter((o: any) => {
      if (o.customerId && o.customerId === customer.id) return true;
      if (email && (o.customerEmail?.toLowerCase() === email || o.email?.toLowerCase() === email || o.customer?.email?.toLowerCase() === email)) return true;
      if (phone && (o.customerPhone === phone || o.phone === phone)) return true;
      return false;
    });
  }, [customer, orders]);

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
            <p className="text-xs text-slate-500">Track orders, manage active cart, and view saved hardware</p>
          </div>
          <button
            onClick={() => setIsAccountOpen(false)}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Profile Status */}
        {customer ? (
          <div className="pt-2">
            <div className="mb-2 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                  {(customer.user_metadata?.full_name || (customer as any).name || 'U')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate block">
                    {customer.user_metadata?.full_name || (customer as any).name || 'Customer'}
                  </span>
                  <p className="text-[10px] text-slate-500 truncate">{customer.email || 'Guest Profile'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => signOutCustomer()}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 rounded-lg border border-slate-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        ) : null}

        {/* Tab switcher */}
        <div className="flex items-center justify-between gap-2 pt-4 pb-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setAccountTab('orders')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                accountTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders ({customerOrders.length})</span>
            </button>

            <button
              onClick={() => setAccountTab('cart' as any)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                accountTab === ('cart' as any)
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>My Cart ({totalCartCount})</span>
            </button>

            <button
              onClick={() => setAccountTab('wishlist')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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
            <span>Full Account Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Orders list */}
        {accountTab === 'orders' && (
          <div className="space-y-3">
            {customerOrders.length > 0 ? (
              customerOrders.map((ord: any) => (
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

        {/* Cart Items List */}
        {accountTab === ('cart' as any) && (
          <div className="space-y-3.5">
            {cart.length > 0 ? (
              <>
                <div className="space-y-2.5 max-h-[42vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div 
                      key={item.product.id} 
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img 
                          src={item.product.image || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'} 
                          alt={item.product.name} 
                          className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-slate-200 flex-shrink-0" 
                        />
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate" title={item.product.name}>
                            {item.product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="font-extrabold text-blue-600 font-mono">
                              ₹{item.product.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 font-mono">
                              Total: <strong className="text-slate-800">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Modifier & Remove Button */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Qty Selector */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeFromCart(item.product.id);
                                showToast(`Removed ${item.product.name.slice(0, 16)}... from cart`);
                              } else {
                                updateQuantity(item.product.id, item.quantity - 1);
                              }
                            }}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                            title="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-900 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                            title="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Direct Trash / Remove Button */}
                        <button
                          type="button"
                          onClick={() => {
                            removeFromCart(item.product.id);
                            showToast(`Removed ${item.product.name.slice(0, 18)}... from cart`);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-200"
                          title="Remove item from cart"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Checkout Action Bar */}
                <div className="pt-3 border-t border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Cart Total ({totalCartCount} items):</span>
                    <span className="text-base font-extrabold text-blue-600 font-mono">
                      ₹{totalCartAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountOpen(false);
                        router.push('/checkout');
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <ShoppingCart className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-bold text-slate-800 text-sm">Your cart is empty</p>
                <p className="text-xs">Browse our catalog and choose products to add to your order.</p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountOpen(false);
                      router.push('/shop');
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Browse Products
                  </button>
                </div>
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
