import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="home-nav w-full sticky top-0 z-40">
      <div className="relative max-w-7xl mx-auto px-6 h-24 flex items-center justify-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="home-logo-mark w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shadow-md transition-transform bg-white">
            <img src="/nextstep-logo.png" alt="NextStep logo" className="w-full h-full object-cover" />
          </div>
          <span className="brand-lockup text-white">
            <strong className="brand-name">NextStep</strong>
            <span className="brand-tagline">From Uncertainty to Clarity</span>
          </span>
        </div>

      </div>
    </header>
  );
}
