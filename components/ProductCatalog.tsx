'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Filter, Search, ArrowUpDown, ChevronDown, Check, X,
  Star, Laptop, Monitor, Camera, Printer, HardDrive, 
  Wifi, LayoutGrid, Sparkles, SlidersHorizontal, ChevronRight,
  ShieldCheck, CheckCircle2
} from 'lucide-react';
import { Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

interface ProductCatalogProps {
  initialCategory?: string;
  initialSearch?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  initialCategory = 'All',
  initialSearch = ''
}) => {
  const { products } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [displayLimit, setDisplayLimit] = useState<number>(24);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [minRating, setMinRating] = useState<number>(0);
  const [brandSearch, setBrandSearch] = useState<string>('');
  const [showAllBrands, setShowAllBrands] = useState<boolean>(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const categories = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Laptops', icon: Laptop },
    { name: 'Computers', icon: Monitor },
    { name: 'CCTV & Security', icon: Camera },
    { name: 'Printers', icon: Printer },
    { name: 'Accessories', icon: Sparkles },
    { name: 'Storage & Parts', icon: HardDrive },
    { name: 'Networking', icon: Wifi }
  ];

  // Derive unique brands with product count
  const brandListWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });
    const unique = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort();
    return unique.map((b) => ({
      name: b,
      count: counts[b] || 0
    }));
  }, [products]);

  const displayedBrands = useMemo(() => {
    let list = brandListWithCounts;
    if (brandSearch.trim()) {
      list = list.filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase()));
    }
    return showAllBrands ? list : list.slice(0, 8);
  }, [brandListWithCounts, brandSearch, showAllBrands]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'All' && selectedCategory !== 'All Products' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) {
        return false;
      }
      if (onlyInStock && !p.inStock) {
        return false;
      }
      if (p.price > maxPrice) {
        return false;
      }
      if (minRating > 0 && (p.rating || 0) < minRating) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesSpecs = p.specs.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesBrand && !matchesSpecs) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedBrand, onlyInStock, searchQuery, maxPrice, minRating, sortBy]);

  const visibleProducts = filteredProducts.slice(0, displayLimit);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setOnlyInStock(false);
    setMaxPrice(100000);
    setMinRating(0);
    setBrandSearch('');
    setSearchQuery('');
  };

  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const activeFilterCount = (selectedCategory !== 'All' && selectedCategory !== 'All Products' ? 1 : 0) +
    (selectedBrand !== 'All' ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (maxPrice < 100000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="py-4 sm:py-8 bg-[#F1F3F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Top Breadcrumb & Title */}
        <div className="mb-3 sm:mb-5">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 mb-1">
            <Link href="/" className="hover:text-[#1A56DB]">Home</Link>
            <span>/</span>
            <span className="text-[#1A56DB] font-semibold">Store Catalog</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-bold">{selectedCategory}</span>
              </>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-[#111827]">
                {selectedCategory === 'All' ? 'All Hardware & Spares Collection' : `${selectedCategory}`}
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Showing <strong className="text-gray-900 font-bold">{filteredProducts.length}</strong> genuine products in Garhwa showroom inventory
              </p>
            </div>

            {/* Search Input in Catalog */}
            <div className="w-full sm:w-72 relative">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search catalog items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-8.5 pr-7 py-1.5 sm:py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1A56DB] shadow-2xs"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Fast-Swipe Category Chips (Phone Optimized) */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-3">
          {categories.map((cat) => {
            const count = cat.name === 'All' ? products.length : products.filter(p => p.category === cat.name).length;
            const isSelected = selectedCategory === cat.name || (cat.name === 'All' && selectedCategory === 'All Products');
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setDisplayLimit(24);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#1A56DB] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                <span>{cat.name}</span>
                <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile Filter & Sort Bar (Phone Optimized) */}
        <div className="lg:hidden flex items-center justify-between gap-2 bg-white border border-[#E5E7EB] rounded-xl p-2.5 mb-3 shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 h-9 px-3 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#111827] text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-gray-200"
          >
            <Filter className="w-3.5 h-3.5 text-[#1A56DB]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#1A56DB] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-9 bg-[#F1F5F9] border border-gray-200 rounded-lg px-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:border-[#1A56DB]"
            >
              <option value="featured">Featured Deals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* E-Commerce Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* Desktop Left Sidebar Filters (Flipkart / Amazon Style) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm sticky top-24">
            
            {/* Header with Title & Clear All */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-extrabold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#1A56DB]" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#1A56DB] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-[#1A56DB] hover:text-[#1E40AF] transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* 1. Category Tree Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Categories</span>
                <span className="text-[10px] font-semibold text-gray-400">282 Items</span>
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const count = cat.name === 'All' 
                    ? products.length 
                    : products.filter(p => p.category === cat.name).length;
                  const isSelected = selectedCategory === cat.name || (cat.name === 'All' && selectedCategory === 'All Products');

                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setDisplayLimit(24);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex justify-between items-center transition-all ${
                        isSelected
                          ? 'bg-blue-50 text-[#1A56DB] font-extrabold border border-blue-200 shadow-2xs'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#1A56DB]' : 'text-gray-400'}`} />
                        <span>{cat.name}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-[#1A56DB] text-white font-bold' : 'text-gray-400 bg-gray-100 font-semibold'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Brand Filter with Search & Checkboxes */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Brand
                </h3>
                {selectedBrand !== 'All' && (
                  <button 
                    onClick={() => setSelectedBrand('All')} 
                    className="text-[10px] font-bold text-[#1A56DB]"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Brand Search input */}
              <div className="relative mb-2">
                <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search brand..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md pl-6.5 pr-2 py-1 text-[11px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              {/* Brand list with checkbox and count */}
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {/* All Brands Option */}
                <button
                  onClick={() => setSelectedBrand('All')}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs flex justify-between items-center transition-colors ${
                    selectedBrand === 'All' ? 'font-bold text-[#1A56DB]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                      selectedBrand === 'All' ? 'bg-[#1A56DB] border-[#1A56DB] text-white' : 'border-gray-300 bg-white'
                    }`}>
                      {selectedBrand === 'All' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                    <span>All Brands</span>
                  </div>
                  <span className="text-[10px] text-gray-400">({products.length})</span>
                </button>

                {displayedBrands.map((b) => (
                  <button
                    key={b.name}
                    onClick={() => setSelectedBrand(b.name)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs flex justify-between items-center transition-colors ${
                      selectedBrand === b.name ? 'font-bold text-[#1A56DB]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        selectedBrand === b.name ? 'bg-[#1A56DB] border-[#1A56DB] text-white' : 'border-gray-300 bg-white'
                      }`}>
                        {selectedBrand === b.name && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span>{b.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">({b.count})</span>
                  </button>
                ))}
              </div>

              {/* Expand / Collapse Brands */}
              {brandListWithCounts.length > 8 && !brandSearch && (
                <button
                  onClick={() => setShowAllBrands(!showAllBrands)}
                  className="mt-1.5 text-[11px] font-bold text-[#1A56DB] hover:text-[#1E40AF] flex items-center gap-1"
                >
                  <span>{showAllBrands ? 'Show Less' : `+ ${brandListWithCounts.length - 8} More Brands`}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showAllBrands ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* 3. Price Filter Slider & Quick Range Chips */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Max Price
                </h3>
                <span className="text-xs font-extrabold text-[#1A56DB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input 
                type="range"
                min="500"
                max="100000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1A56DB] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5 mb-2">
                <span>₹500</span>
                <span>₹50,000</span>
                <span>₹1,00,000</span>
              </div>

              {/* Quick Range Chips */}
              <div className="grid grid-cols-2 gap-1 pt-1">
                {[
                  { label: 'All', val: 100000 },
                  { label: 'Under ₹2K', val: 2000 },
                  { label: 'Under ₹10K', val: 10000 },
                  { label: 'Under ₹35K', val: 35000 },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => setMaxPrice(chip.val)}
                    className={`py-1 px-1.5 text-[10.5px] rounded border text-center font-medium transition-colors ${
                      maxPrice === chip.val 
                        ? 'bg-[#1A56DB] text-white border-[#1A56DB] font-bold' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Customer Rating Filter (Flipkart & Amazon style) */}
            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Customer Rating
              </h3>
              <div className="space-y-1">
                {[
                  { rating: 4, label: '4★ & Above' },
                  { rating: 3, label: '3★ & Above' },
                  { rating: 0, label: 'All Ratings' }
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setMinRating(r.rating)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                      minRating === r.rating ? 'bg-blue-50 text-[#1A56DB] font-bold' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Star className={`w-3.5 h-3.5 ${minRating === r.rating ? 'fill-yellow-400 text-yellow-500' : 'text-gray-400'}`} />
                      <span>{r.label}</span>
                    </div>
                    {minRating === r.rating && <Check className="w-3.5 h-3.5 text-[#1A56DB]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. In-Stock Garhwa Showroom Verification Toggle */}
            <div className="pt-3 border-t border-gray-100">
              <label className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-emerald-400 text-[#15803D] focus:ring-[#15803D] mt-0.5"
                />
                <div>
                  <div className="font-extrabold text-[11.5px] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Garhwa Showroom In-Stock Only</span>
                  </div>
                  <p className="text-[10px] text-emerald-800 leading-tight mt-0.5">
                    Ready for 30-min store pickup or same-day delivery
                  </p>
                </div>
              </label>
            </div>

          </aside>

          {/* Right Product Grid Area */}
          <main className="lg:col-span-9 space-y-4">
            
            {/* Sorting & Result Controls Strip (Desktop) */}
            <div className="hidden lg:flex bg-white border border-[#E5E7EB] rounded-xl p-3 items-center justify-between gap-2 shadow-2xs">
              <span className="text-xs text-gray-500">
                Displaying 1 - {Math.min(visibleProducts.length, filteredProducts.length)} of <strong>{filteredProducts.length}</strong> items
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800 font-semibold focus:outline-none focus:border-[#1A56DB]"
                >
                  <option value="featured">Featured Deals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Responsive 2-Col Mobile, 3-Col Desktop Product Grid */}
            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-4">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No products match your criteria</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                  Try adjusting the category, lowering the price threshold, or searching for a broader term.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredProducts.length > displayLimit && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setDisplayLimit(prev => prev + 24)}
                  className="px-6 py-2.5 rounded-lg bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-bold transition-all shadow-xs"
                >
                  Load More Products ({filteredProducts.length - displayLimit} remaining)
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* ========================================================= */}
      {/* MOBILE FILTER BOTTOM SHEET DRAWER (Phone Optimized)        */}
      {/* ========================================================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#1A56DB]" />
                <h3 className="font-extrabold text-sm text-[#111827]">
                  Filter Products ({filteredProducts.length})
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-[#1A56DB]"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Body */}
            <div className="p-4 overflow-y-auto space-y-5 text-xs flex-1">
              
              {/* Category Options */}
              <div>
                <span className="font-bold text-gray-900 uppercase tracking-wider block mb-2">
                  Select Category
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((cat) => {
                    const count = cat.name === 'All' ? products.length : products.filter(p => p.category === cat.name).length;
                    const isSelected = selectedCategory === cat.name || (cat.name === 'All' && selectedCategory === 'All Products');
                    return (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setDisplayLimit(24);
                        }}
                        className={`p-2 rounded-lg text-left text-xs font-medium border flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-blue-50 border-[#1A56DB] text-[#1A56DB] font-bold'
                            : 'bg-[#F9FAFB] border-gray-200 text-gray-700'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-gray-400">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Slider */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-gray-900 uppercase tracking-wider">
                    Maximum Budget
                  </span>
                  <span className="text-sm font-extrabold text-[#1A56DB]">
                    ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <input 
                  type="range"
                  min="500"
                  max="100000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1A56DB] cursor-pointer"
                />
              </div>

              {/* Brand Chips */}
              <div className="pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-900 uppercase tracking-wider block mb-2">
                  Brand ({brandListWithCounts.length} brands)
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  <button
                    key="All"
                    onClick={() => setSelectedBrand('All')}
                    className={`px-2.5 py-1 rounded-md text-xs border font-medium transition-colors ${
                      selectedBrand === 'All'
                        ? 'bg-[#1A56DB] text-white border-[#1A56DB] font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>
                  {brandListWithCounts.map((b) => (
                    <button
                      key={b.name}
                      onClick={() => setSelectedBrand(b.name)}
                      className={`px-2.5 py-1 rounded-md text-xs border font-medium transition-colors ${
                        selectedBrand === b.name
                          ? 'bg-[#1A56DB] text-white border-[#1A56DB] font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {b.name} ({b.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Stock Garhwa Checkbox */}
              <div className="pt-3 border-t border-gray-100">
                <label className="flex items-center gap-2.5 text-xs text-gray-800 font-semibold cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#1A56DB] focus:ring-[#1A56DB]"
                  />
                  <span>Show In-Stock Garhwa Showroom Only</span>
                </label>
              </div>

            </div>

            {/* Bottom Apply CTA */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full h-11 rounded-xl bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98"
              >
                <span>Apply & View {filteredProducts.length} Products</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
