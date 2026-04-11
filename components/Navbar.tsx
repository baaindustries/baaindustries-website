'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#00C2FF] text-[#0A0A0A] text-xs py-1.5 px-4 flex justify-between items-center">
        <span>🌍 Free shipping on orders over $99 to US & EU</span>
        <div className="flex gap-4 items-center">
          <Link href="/track-order" className="hover:underline font-medium">Track Order</Link>
          <Link href="/bulk-enquiry" className="hover:underline font-medium">Bulk Enquiry</Link>
          <Link href="/support" className="hover:underline font-medium">Support</Link>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-[#111111] border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-extrabold text-white tracking-tight">
              BAA<span className="text-[#00C2FF]">.</span>
            </span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="flex items-center bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden focus-within:border-[#00C2FF] transition-colors">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for motors, sensors, Arduino, kits..."
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none"
              />
              <button className="bg-[#00C2FF] hover:bg-[#00a8e0] transition-colors px-4 py-2.5 text-[#0A0A0A] font-semibold text-sm">
                Search
              </button>
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Account */}
            <Link href="/account" className="flex flex-col items-center text-gray-400 hover:text-white transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-0.5">Account</span>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="flex flex-col items-center text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs mt-0.5">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex flex-col items-center text-gray-400 hover:text-white transition-colors relative">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-[#00C2FF] text-[#0A0A0A] text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">0</span>
              </div>
              <span className="text-xs mt-0.5">Cart</span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-400 hover:text-white ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Category nav */}
        <div className="border-t border-[#1E1E1E] bg-[#0F0F0F]">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto scrollbar-hide py-2.5 text-sm">
            <Link href="/categories" className="bg-[#00C2FF] text-[#0A0A0A] font-semibold px-3 py-1 rounded text-xs whitespace-nowrap flex-shrink-0">
              ☰ All Categories
            </Link>
            {['Microcontrollers', 'Motors & Drives', 'Sensors', 'Drones & FPV', 'Power & Batteries', 'Kits & Bundles', 'New Arrivals', 'Bulk Orders'].map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="text-gray-400 hover:text-white transition-colors whitespace-nowrap flex-shrink-0"
              >
                {cat}
              </Link>
            ))}
            <Link href="/build-with-us" className="text-[#00C2FF] font-semibold hover:text-white transition-colors whitespace-nowrap flex-shrink-0">
              ⚡ Build With Us
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#111111] border-b border-[#222] px-4 py-3 space-y-2 text-sm text-gray-300">
          {['Microcontrollers', 'Motors & Drives', 'Sensors', 'Drones & FPV', 'Power & Batteries', 'Kits & Bundles', 'New Arrivals', 'Bulk Orders', 'Build With Us'].map((item) => (
            <Link key={item} href="#" className="block py-1.5 hover:text-white transition-colors border-b border-[#1E1E1E]">
              {item}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
