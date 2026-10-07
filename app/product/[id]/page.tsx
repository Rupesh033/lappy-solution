'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, ShoppingCart, MessageSquare, Star, 
  ShieldCheck, Truck, Store, ArrowLeft, ArrowRight, 
  Check, RefreshCw, Phone, Share2, Award, Zap
} from 'lucide-react';
import { PRODUCTS, Product } from '../../../data/products';
import { STORE_INFO } from '../../../data/storeData';
import { useStore } from '../../../context/StoreContext';
import { ProductCard } from '../../../components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { addToCart, toggleWishlist, wishlistIds, showToast } = useStore();

  // Find product by id or numericId
  const product: Product | undefined = useMemo(() => {
    return PRODUCTS.find(p => p.id === productId || String(p.numericId) === productId);
  }, [productId]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'warranty'>('specs');

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Product Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          The requested hardware item may have been updated, sold out, or moved to our showroom archives.
        </p>
        <Link
          href="/shop"
          className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Available Products</span>
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistIds.includes(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[activeImageIndex] || product.image;

  const savings = product.mrp > product.price ? product.mrp - product.price : 0;

  // Related products from same category
  const relatedProducts = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    router.push('/checkout');
  };

  const handleWhatsApp = () => {
    const text = `Hello Lappy Solution Garhwa! I am interested in purchasing:\n\n*Product:* ${product.name}\n*SKU:* ${product.sku}\n*Price:* ₹${product.price.toLocaleString('en-IN')}\n\nIs this in stock for same-day pickup at your Chiniya Road showroom?`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Lappy Solution Garhwa for ₹${product.price.toLocaleString('en-IN')}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  return (
    <div className="bg-[#F1F3F6] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-5 overflow-x-auto pb-1">
          <Link href="/" className="hover:text-[#1A56DB] transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/shop" className="hover:text-[#1A56DB] transition-colors">Catalog</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/shop?cat=${encodeURIComponent(product.category)}`} className="hover:text-[#1A56DB] transition-colors">
            {product.category}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-12">
          
          {/* Left Column: Gallery & Highlights (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Image Display Card */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-8 flex items-center justify-center relative shadow-xs aspect-[4/3] overflow-hidden group">
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-[360px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />

              {/* Discount Chip */}
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 bg-[#DC2626] text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-xs">
                  {product.discount}% OFF
                </span>
              )}

              {/* Action Buttons: Share & Wishlist */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 shadow-2xs transition-colors"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-lg border shadow-2xs transition-colors ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-[#DC2626]'
                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-500 hover:text-[#DC2626]'
                  }`}
                  title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#DC2626]' : ''}`} />
                </button>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white p-1.5 border-2 transition-all flex-shrink-0 flex items-center justify-center ${
                      activeImageIndex === idx
                        ? 'border-[#1A56DB] shadow-xs'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Assurance Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl bg-white border border-[#E5E7EB] p-3.5 flex items-center gap-2.5 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A56DB] flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Direct Brand Warranty</h4>
                  <p className="text-[11px] text-gray-500">100% Authorized & Certified</p>
                </div>
              </div>

              <div className="rounded-xl bg-white border border-[#E5E7EB] p-3.5 flex items-center gap-2.5 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-[#15803D] flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Same-Day Garhwa Delivery</h4>
                  <p className="text-[11px] text-gray-500">Free door delivery in town</p>
                </div>
              </div>

              <div className="rounded-xl bg-white border border-[#E5E7EB] p-3.5 flex items-center gap-2.5 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] flex-shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Showroom Inspection</h4>
                  <p className="text-[11px] text-gray-500">Try before paying at Chiniya Rd</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Pricing, Specs & Purchase Actions (5 Cols Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4">
              
              {/* Brand & Stock Status Badge */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A56DB] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                  {product.brand}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-green-50 border border-green-200 px-2.5 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                  <span>In Stock at Garhwa ({product.stockQuantity || 8} units)</span>
                </div>
              </div>

              {/* Title & SKU */}
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight leading-snug">
                  {product.name}
                </h1>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  SKU: {product.sku} • Category: {product.category}
                </p>
              </div>

              {/* Reviews Star Rating */}
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="bg-[#15803D] text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span>{(product.rating || 4.4).toFixed(1)}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
                <span className="text-xs text-gray-500">({product.reviewsCount || 42} verified ratings & reviews)</span>
              </div>

              {/* Pricing Block */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-gray-200 space-y-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-xs font-bold text-[#15803D]">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-xs font-bold text-[#15803D]">
                    Special Price: You Save ₹{savings.toLocaleString('en-IN')}
                  </p>
                )}
                <p className="text-[11px] text-gray-500 pt-0.5">
                  Inclusive of 18% GST + Official Tax Invoice for business ITC claim.
                </p>
              </div>

              {/* Short Specs Highlight */}
              {product.specs && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    Configuration Summary
                  </label>
                  <p className="text-xs text-gray-700 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 leading-relaxed font-medium">
                    {product.specs}
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-0.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-7 h-7 rounded bg-white border border-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs hover:bg-gray-100 disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded bg-white border border-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Call-to-Actions (Flipkart / Amazon Style) */}
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    className="h-11 px-4 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="h-11 px-4 rounded-lg bg-[#FB641B] hover:bg-[#E0530F] text-white font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
                  >
                    <Zap className="w-4 h-4" />
                    <span>BUY NOW</span>
                  </button>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full h-10 px-4 rounded-lg bg-[#25D366] hover:bg-[#1EBE5B] text-white font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Garhwa Counter on WhatsApp</span>
                </button>
              </div>

              {/* Showroom Direct Pick-up Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                <Store className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block font-semibold">Chiniya Road Showroom Pickup</strong>
                  <span className="text-[11px] text-amber-800">
                    Order online and collect within 30 minutes with live hardware test and software setup.
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Detailed Information Tabs (Specs, Description, Reviews) */}
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-8 shadow-xs mb-10">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-2 px-4 rounded-lg text-xs sm:text-[13px] font-bold transition-all ${
                activeTab === 'specs'
                  ? 'bg-[#1A56DB] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Full Specifications
            </button>
            <button
              onClick={() => setActiveTab('warranty')}
              className={`py-2 px-4 rounded-lg text-xs sm:text-[13px] font-bold transition-all ${
                activeTab === 'warranty'
                  ? 'bg-[#1A56DB] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Warranty & Service Policy
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-4 rounded-lg text-xs sm:text-[13px] font-bold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-[#1A56DB] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Customer Reviews ({product.reviewsCount || 42})
            </button>
          </div>

          {/* TAB 1: Specs & Overview */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Product Description</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4">Technical Specifications</h3>
                <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-200 text-xs sm:text-sm">
                  <div className="grid grid-cols-3 p-3 bg-slate-50">
                    <span className="font-semibold text-slate-500">Brand</span>
                    <span className="col-span-2 text-slate-900 font-bold">{product.brand}</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-white">
                    <span className="font-semibold text-slate-500">Model Name</span>
                    <span className="col-span-2 text-slate-900 font-medium">{product.name}</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-slate-50">
                    <span className="font-semibold text-slate-500">Category</span>
                    <span className="col-span-2 text-slate-900 font-medium">{product.category}</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-white">
                    <span className="font-semibold text-slate-500">Stock Keeping Unit (SKU)</span>
                    <span className="col-span-2 text-slate-900 font-mono text-xs">{product.sku}</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-slate-50">
                    <span className="font-semibold text-slate-500">Configuration</span>
                    <span className="col-span-2 text-slate-900 font-medium">{product.specs || 'Certified Genuine Box Package'}</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-white">
                    <span className="font-semibold text-slate-500">Condition</span>
                    <span className="col-span-2 text-slate-900 font-medium">100% Brand New Box Pack with Seal</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-slate-50">
                    <span className="font-semibold text-slate-500">Showroom Availability</span>
                    <span className="col-span-2 text-emerald-700 font-bold">Ready for Instant Pickup in Garhwa</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Warranty & Service */}
          {activeTab === 'warranty' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <h3 className="text-base font-bold text-slate-900">Garhwa Showroom Warranty & Service Support</h3>
              <p className="leading-relaxed">
                Every purchase made through Lappy Solution is backed by official brand warranty and our in-house Garhwa service desk:
              </p>
              <ul className="space-y-2.5 pt-2">
                <li className="flex items-start gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Official Brand Warranty:</strong> Minimum 1 to 3 years warranty valid at all authorized service centres across India.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>7-Day Showroom Replacement:</strong> Instant replacement at our Chiniya Road showroom in case of any manufacturing defect.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Free Lifetime Software & Driver Support:</strong> Visit our store anytime for OS re-installation, BIOS update, or driver diagnostics.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>GST Tax Invoice:</strong> Official printed invoice with GSTIN for legitimate business tax input credit.</span>
                </li>
              </ul>
            </div>
          )}

          {/* TAB 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">{product.rating || 4.9}</span>
                    <span className="text-sm text-slate-400">/ 5.0</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Based on {product.reviewsCount || 42} verified local buyers</p>
                </div>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                {[
                  {
                    name: 'Amit Verma (Garhwa Sadar)',
                    date: '3 days ago',
                    rating: 5,
                    comment: 'Purchased for my office work. Machine is super fast, boot time is under 8 seconds. Lappy Solution team provided free setup and installed essential software on the spot.'
                  },
                  {
                    name: 'Dr. S. K. Pandey (Rehla)',
                    date: '1 week ago',
                    rating: 5,
                    comment: 'Genuine original sealed box with warranty card and GST bill. Better price than online and got it delivered on the same day without waiting.'
                  },
                  {
                    name: 'Vikas Kumar (Chiniya Road)',
                    date: '2 weeks ago',
                    rating: 5,
                    comment: 'Excellent customer service. The staff helped me compare options and gave me the best deal. Highly recommended technology showroom in Garhwa.'
                  }
                ].map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{rev.name}</span>
                      <span className="text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#111827] tracking-tight">
                  Similar & Related Products
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Explore other high-performance options in {product.category}
                </p>
              </div>
              <Link
                href={`/shop?cat=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-[#1A56DB] hover:text-[#1E40AF] flex items-center gap-1"
              >
                <span>View All in {product.category}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
