import { useState } from 'react';
import { NAV_CATEGORIES } from '../api/beritaApi';

export default function Navbar({ activeCategory, onCategoryChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-8">
        
        {/* Logo */}
        <div 
          className="flex cursor-pointer items-center gap-2" 
          onClick={() => onCategoryChange('beranda')}
        >
          {/* SVG Logo - Disesuaikan dengan warna biru dari Figma */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="#007BFF" strokeWidth="2"/>
            <path d="M10 10 C10 10, 16 8, 22 10 C22 10, 16 14, 10 10Z" fill="#007BFF"/>
            <path d="M10 22 C10 22, 16 24, 22 22 C22 22, 16 18, 10 22Z" fill="#007BFF"/>
            <path d="M10 10 C8 16, 10 22, 10 22" stroke="#007BFF" strokeWidth="1.5" fill="none"/>
            <path d="M22 10 C24 16, 22 22, 22 22" stroke="#007BFF" strokeWidth="1.5" fill="none"/>
          </svg>
          <span className="text-xl font-bold text-gray-800">Berita Kini</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_CATEGORIES.map(cat => (
            <li key={cat.id}>
              <button
                className={`text-sm font-medium transition-colors duration-200 hover:text-blue-500 
                  ${activeCategory === cat.id ? 'text-blue-500' : 'text-gray-600'}
                `}
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button */}
        <button 
          className="flex flex-col gap-1.5 md:hidden" 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`block h-0.5 w-6 bg-gray-800 transition-transform ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-gray-800 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-gray-800 transition-transform ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="absolute left-0 top-full w-full border-t bg-white shadow-md md:hidden">
          <ul className="flex flex-col p-4">
            {NAV_CATEGORIES.map(cat => (
              <li key={cat.id}>
                <button
                  className={`block w-full text-left py-3 text-sm font-medium border-b border-gray-100 last:border-0
                    ${activeCategory === cat.id ? 'text-blue-500' : 'text-gray-600'}
                  `}
                  onClick={() => { 
                    onCategoryChange(cat.id); 
                    setMobileOpen(false); 
                  }}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}