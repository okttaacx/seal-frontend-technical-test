import { useState } from 'react';
import { NAV_CATEGORIES } from '../api/beritaApi';

export default function Footer({ onCategoryChange }) {
  const [email, setEmail] = useState('');

  return (
    // Background menyesuaikan warna dark pada desain Figma
    <footer className="bg-[#2B3542] py-12 text-white">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-4 md:px-8 lg:gap-12">
        
        {/* Kolom 1: Logo & Social Media */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="2"/>
              <path d="M10 10 C10 10, 16 8, 22 10 C22 10, 16 14, 10 10Z" fill="white"/>
              <path d="M10 22 C10 22, 16 24, 22 22 C22 22, 16 18, 10 22Z" fill="white"/>
              <path d="M10 10 C8 16, 10 22, 10 22" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M22 10 C24 16, 22 22, 22 22" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
            <span className="text-xl font-bold">Berita Kini</span>
          </div>
          <p className="text-sm text-gray-300">© 2023 Berita Kini. All Rights Reserved.</p>
          
          <div className="mt-4">
            <p className="mb-3 font-semibold">Ikuti Kami</p>
            <div className="flex gap-4">
              <a href="#" aria-label="YouTube" className="text-white hover:text-blue-400 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.2v2c0 2 .3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.6 12 21.6 12 21.6s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l6.6 3.6-6.6 3.5z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-white hover:text-blue-400 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.2 4.8 1.7 5 5 .1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.2 3.3-1.7 4.8-5 5-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.2-4.8-1.7-5-5C2.1 15.6 2 15.3 2 12c0-3.2 0-3.6.1-4.8.2-3.3 1.7-4.8 5-5C8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="text-white hover:text-blue-400 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23.1 10.1 24v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.4l-.5 3.5h-2.8V24C19.6 23.1 24 18.1 24 12.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Kolom 2: Telusuri */}
        <div>
          <h4 className="mb-4 text-lg font-semibold">Telusuri</h4>
          <ul className="flex flex-col gap-3">
            {NAV_CATEGORIES.map(cat => (
              <li key={cat.id}>
                <button 
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                  onClick={() => onCategoryChange && onCategoryChange(cat.id)}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom 3: Bantuan */}
        <div>
          <h4 className="mb-4 text-lg font-semibold">Bantuan</h4>
          <ul className="flex flex-col gap-3 text-sm text-gray-300">
            <li><button className="hover:text-white transition-colors">Kontak Kami</button></li>
            <li><button className="hover:text-white transition-colors">Laporan Pembajakan</button></li>
            <li><button className="hover:text-white transition-colors">Kebijakan</button></li>
          </ul>
        </div>

        {/* Kolom 4: Newsletter */}
        <div>
          <h4 className="mb-4 text-lg font-semibold">Berlangganan Berita Terbaru</h4>
          <div className="relative flex items-center">
            <input
              type="email"
              placeholder="Masukan email"
              className="w-full rounded-md px-4 py-3 pr-14 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {/* Tombol Subscribe diposisikan absolut agar berada di dalam input */}
            <button 
              className="absolute right-1 top-1 bottom-1 flex items-center justify-center rounded bg-[#007BFF] px-3 text-white hover:bg-blue-600 transition-colors"
              aria-label="Subscribe"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}