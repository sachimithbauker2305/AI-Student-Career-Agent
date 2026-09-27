import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Sparkles,
  Compass,
  CheckCircle2,
  CalendarCheck,
  Settings,
  GraduationCap,
  BriefcaseBusiness,
  LogOut
} from 'lucide-react';
import { authService } from '../services/authService';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/student-profile', icon: User },
    { label: 'AI Analysis', path: '/profile-analysis', icon: Sparkles },
    { label: 'Recommendations', path: '/career-recommendations', icon: Compass },
    { label: 'Eligibility Check', path: '/eligibility-check', icon: CheckCircle2 },
    { label: 'Action Plan', path: '/action-plan', icon: CalendarCheck },
    { label: 'Scholarship Finder', path: '/scholarships', icon: GraduationCap },
    { label: 'Internship Finder', path: '/internships', icon: BriefcaseBusiness },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <aside className="app-sidebar fixed left-0 top-0 z-30 w-64 bg-[#fffdf8] border-r border-[#d8dfd7] flex flex-col justify-between h-screen shrink-0 select-none">
      <div>
        {/* Brand Logo */}
        <div className="p-6 border-b border-[#edf0eb] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-md shadow-[#27483d]/20 bg-white">
            <img src="/nextstep-logo.png" alt="NextStep logo" className="w-full h-full object-cover" />
          </div>
          <span className="sidebar-brand-lockup text-[#27483d]">
            <strong className="sidebar-brand-name">NextStep</strong>
            <span className="sidebar-brand-tagline">From Uncertainty to Clarity</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path === '/career-recommendations' && location.pathname.startsWith('/career-details')) ||
              (item.path === '/student-profile' && (location.pathname === '/detailed-profile' || location.pathname === '/personalized-questions'));

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-[#e4eee7] text-[#32755c] font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-[#f4f6f2] hover:text-[#27483d]'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#32755c]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-[#edf0eb]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
