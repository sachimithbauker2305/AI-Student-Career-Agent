import React from 'react';
import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { authService } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header({ title, subtitle, rightElement }) {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Name';
  const initials = displayName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-0 border-b border-slate-100 gap-4">
      <div>
        {title && <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>}
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4 self-end md:self-auto">
        {rightElement}
        <div className="relative pl-4 border-l border-slate-100">
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-50 transition-colors" aria-expanded={menuOpen}>
            <div className="w-9 h-9 rounded-full bg-[#e8f0e7] border border-[#b8d0bb] text-[#28705a] font-bold text-xs flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-sm font-semibold text-slate-700">{displayName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-14 z-30 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-sm font-bold text-slate-800">{displayName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'name@gmail.com'}</p>
              </div>
              <Link to="/student-profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50"><UserRound className="w-4 h-4" /> My profile</Link>
              <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50"><Settings className="w-4 h-4" /> Settings</Link>
              <button type="button" onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"><LogOut className="w-4 h-4" /> Sign out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
