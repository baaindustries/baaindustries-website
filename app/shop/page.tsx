'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { products, CATEGORIES } from '@/data/products';

const SORT_OPTIONS = [
  { label: 'Best Selling',     value: 'best-selling' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Top Rated',        value: 'rating' },
  { label: 'Newest',           value: 'newest' },
];

const BADGE_COLORS: Record<string, string> = {
  'Best Seller': 'bg-[#F5C100] text-[#111111]',
  'New':         'bg-[#111111] text-white',
  'Sale':        'bg-[#DC2626] text-white',
  'Popular':     'bg-[#7C3AED] text-white',
  'Limited':     'bg-[#EA580C] text-white',
};

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange]                 = useState<[number, number]>([0, 300]);
  const [inStockOnly, setInStockOnly]               = useState(false);
  const [sortBy, setSortBy]                         = useState('best-selling');
  const [search, setSearch]                         = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen]   = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)),
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    switch (sortBy) {
      case 'price-asc':     result.sort((a, b) => a.price - b.price);           break;
      case 'price-desc':    result.sort((a, b) => b.price - a.price);           break;
      case 'rating':        result.sort((a, b) => b.rating - a.rating);         break;
      case 'best-selling':  result.sort((a, b) => b.reviews - a.reviews);       break;
    }

    return result;
  }, [search, selectedCategories, priceRange, inStockOnly, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 300]);
    setInStockOnly(false);
    setSearch('');
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 300 ||
    inStockOnly;

  const Filters = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-[#111111] font-bold text-sm mb-3">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            return (
              <label key={cat} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 accent-[#F5C100] cursor-pointer"
                  />
                  <span className={`text-sm transition-colors ${selectedCategories.includes(cat) ? 'text-[#111111] font-semibold' : 'text-gray-600 group-hover:text-[#111111]'}`}>
                    {cat}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Price range */}
      <div>
        <h3 className="text-[#111111] font-bold text-sm mb-3">Price Range</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-[#111111]">${priceRange[0]}</span>
          <span className="text-gray-400 text-xs">—</span>
          <span className="text-sm font-semibold text-[#111111]">${priceRange[1]}</span>
        </div>
        <input
          type="range"
          min={0}
          max={300}
          step={5}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full accent-[#F5C100]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$0</span>
          <span>$300+</span>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* In stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-[#F5C100]"
          />
          <span className="text-sm text-gray-600">In Stock Only</span>
        </label>
      </div>

      {hasActiveFilters && (
        <>
          <div className="border-t border-gray-100" />
          <button
            onClick={clearFilters}
            className="w-full text-center text-sm text-[#111111] font-semibold border-2 border-gray-200 hover:border-[#F5C100] rounded-lg py-2 transition-colors"
          >
            Clear All Filters
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Page header */}
      <div className="bg-[#111111] text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <Link href="/" className="hover:text-[#F5C100] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Shop</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2">
            FPV <span className="text-[#F5C100]">Parts & Kits</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Everything you need to build, upgrade, and fly — delivered to the US & EU.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-gray-200 focus:border-[#F5C100] rounded-lg text-sm text-[#111111] outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border-2 border-gray-200 focus:border-[#F5C100] rounded-lg px-3 py-2.5 text-sm text-[#111111] outline-none transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#111111]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters {hasActiveFilters && <span className="bg-[#F5C100] text-[#111111] text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{selectedCategories.length || '!'}</span>}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#111111]">Filters</h2>
                {hasActiveFilters && (
                  <span className="text-xs bg-[#F5C100] text-[#111111] font-bold px-2 py-0.5 rounded-full">Active</span>
                )}
              </div>
              <Filters />
            </div>
          </aside>

          {/* Mobile filters overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-[#111111] text-lg">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-[#111111]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <Filters />
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-4">
              Showing <span className="font-semibold text-[#111111]">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''}
              {hasActiveFilters && ' (filtered)'}
            </p>

            {filtered.length === 0 ? (
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-16 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-[#111111] font-bold text-lg mb-1">No products found</p>
                <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search term.</p>
                <button onClick={clearFilters} className="bg-[#F5C100] text-[#111111] font-bold px-6 py-2.5 rounded-lg text-sm">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="bg-white border-2 border-gray-100 hover:border-[#F5C100] rounded-2xl overflow-hidden group transition-all hover:shadow-lg"
                  >
                    {/* Image area */}
                    <div className="relative bg-[#FEF9E7] h-36 flex items-center justify-center">
                      <span className="text-5xl">{product.emoji}</span>
                      {product.badge && (
                        <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded ${BADGE_COLORS[product.badge]}`}>
                          {product.badge}
                        </span>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 border-t border-gray-100">
                      <p className="text-gray-400 text-xs mb-0.5">{product.brand} · {product.category}</p>
                      <h3 className="text-[#111111] text-sm font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-[#333] transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[1,2,3,4,5].map((star) => (
                            <svg key={star} className={`h-3 w-3 ${star <= Math.round(product.rating) ? 'text-[#F5C100]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[#111111] font-bold text-base">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-gray-400 text-xs line-through ml-1">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        <button
                          className="bg-[#F5C100] hover:bg-[#e0b000] text-[#111111] text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                          onClick={(e) => { e.preventDefault(); }}
                        >
                          Add +
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
