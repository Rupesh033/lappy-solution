'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, MessageSquare, Star, Truck, Check } from 'lucide-react';
import { Product } from '../data/products';
import { STORE_INFO, getCleanWhatsAppNumber } from '../data/storeData';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    wishlistIds,
    siteSettings
  } = useStore();

  const isWishlisted = wishlistIds.includes(product.id);
  const isOutOfStock = product.inStock === false || (product.stockQuantity !== undefined && product.stockQuantity !== null && Number(product.stockQuantity) <= 0);

  const savings = product.mrp > product.price ? product.mrp - product.price : 0;
  const ratingValue = (product.rating || 4.4).toFixed(1);

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const storeTitle = siteSettings?.siteName || 'Lapiez Garhwa';
    const text = isOutOfStock
      ? `Hello ${storeTitle}, I am interested in:\n*${product.name}*\nPrice: ₹${Number(product.price || 0).toLocaleString('en-IN')}\nSKU: ${product.sku}\nThis product is currently marked as Out of Stock on your website. When will it be available for purchase at your showroom?`
      : `Hello ${storeTitle}, I want to purchase:\n*${product.name}*\nPrice: ₹${Number(product.price || 0).toLocaleString('en-IN')}\nSKU: ${product.sku}\nIs this in stock at your Chiniya Road showroom?`;
    const waNumber = getCleanWhatsAppNumber(siteSettings?.whatsapp);
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      className={`group relative bg-white border rounded-xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
        isOutOfStock ? 'border-gray-200 opacity-95' : 'border-[#E5E7EB] hover:border-[#CBD5E1]'
      }`}
    >
      <div>
        
        {/* Top Eyebrow: Brand + Rating + Wishlist */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              {product.brand}
            </span>
            {/* Flipkart style rating pill */}
            <span className="bg-[#15803D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span>{ratingValue}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </span>
          </div>

          <div className="flex items-center gap-1">
            {product.discount > 0 && !isOutOfStock && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-50 text-[#15803D] border border-green-200">
                {product.discount}% OFF
              </span>
            )}
            {isOutOfStock && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                OUT OF STOCK
              </span>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`p-1.5 rounded-md transition-colors ${
                isWishlisted
                  ? 'text-[#DC2626] bg-red-50'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
              aria-label="Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#DC2626]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Image Stage */}
        <Link 
          href={`/product/${product.id}`} 
          className="block relative aspect-[4/3] rounded-lg bg-[#F8FAFC] p-2 sm:p-3 overflow-hidden mb-3 border border-[#F1F5F9] group-hover:border-blue-100 transition-colors"
        >
          {isOutOfStock && (
            <span className="absolute top-2 left-2 z-10 text-[9.5px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded shadow-xs">
              Out of Stock
            </span>
          )}
          {(() => {
            const primaryImage = product.image?.includes('|||')
              ? product.image.split('|||')[0].trim()
              : (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image);
            return (
              <img 
                src={primaryImage || '/images/categories/laptop-adapters.png'} 
                alt={product.name}
                className={`w-full h-full object-contain mx-auto transition-transform duration-300 group-hover:scale-105 ${
                  isOutOfStock ? 'grayscale-[0.4] opacity-80' : ''
                }`}
                loading="lazy"
              />
            );
          })()}
        </Link>

        {/* Product Title */}
        <Link href={`/product/${product.id}`} className="block mb-1.5">
          <h3 className="text-[13.5px] sm:text-[14.5px] font-semibold text-[#111827] group-hover:text-[#1A56DB] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Technical Specs snippet */}
        <p className="text-[11.5px] sm:text-[12px] text-[#6B7280] line-clamp-1 mb-2.5 font-normal">
          {product.specs}
        </p>

      </div>

      <div className="pt-2 border-t border-[#F3F4F6]">
        
        {/* Price & Savings Display (Authentic Indian Style) */}
        <div className="mb-2.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[18px] sm:text-[20px] font-extrabold text-[#111827] tracking-tight">
              ₹{Number(product.price || 0).toLocaleString('en-IN')}
            </span>
            {Number(product.mrp || 0) > Number(product.price || 0) && (
              <span className="text-[12px] sm:text-[13px] text-gray-400 line-through">
                ₹{Number(product.mrp || 0).toLocaleString('en-IN')}
              </span>
            )}
            {savings > 0 && !isOutOfStock && (
              <span className="text-[11px] font-bold text-[#15803D]">
                Save ₹{Number(savings || 0).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[10.5px] mt-0.5">
            {isOutOfStock ? (
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                Out of Stock · Garhwa Store
              </span>
            ) : (
              <span className="text-[#15803D] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                In Stock · Garhwa Store
              </span>
            )}
            <span className="hidden sm:inline text-gray-500">
              {isOutOfStock ? 'Inquire for Stock' : 'Free Delivery'}
            </span>
          </div>
        </div>

        {/* Action Buttons: Add to Cart + WhatsApp Buy */}
        <div className="grid grid-cols-4 gap-1.5">
          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="col-span-3 h-9 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 text-[12px] font-bold flex items-center justify-center gap-1.5 cursor-not-allowed select-none"
              title="This product is currently out of stock"
            >
              <span>Out of Stock</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="col-span-3 h-9 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-[12.5px] sm:text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs active:scale-[0.98]"
              title="Add to Shopping Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className={`col-span-1 h-9 rounded-lg border flex items-center justify-center transition-colors shadow-2xs ${
              isOutOfStock
                ? 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700'
                : 'border-[#A7F3D0] bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#15803D]'
            }`}
            title={isOutOfStock ? "Inquire availability on WhatsApp" : "Order / Inquire on WhatsApp"}
            aria-label="Order on WhatsApp"
          >
            <MessageSquare className={`w-4 h-4 ${isOutOfStock ? 'text-amber-600' : 'text-[#16A34A]'}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
