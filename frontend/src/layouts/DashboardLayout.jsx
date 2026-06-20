import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  BrainCircuit,
  ScanLine,
  Database,
  History,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  User,
  GraduationCap
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Generator', path: '/generate', icon: BrainCircuit },
    { name: 'OCR Question Scanner', path: '/ocr-import', icon: ScanLine },
    { name: 'Question Bank', path: '/bank', icon: Database },
    { name: 'Saved Papers', path: '/history', icon: History },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
        <GraduationCap className="h-7 w-7 text-indigo-400" />
        <span className="font-extrabold text-base tracking-tight text-white">
          Question<span className="text-indigo-400">Wallah</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 ${
                active
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-100'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${active ? 'text-white' : 'text-slate-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Teacher Profile Footer Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/40 border border-slate-800/80 rounded-xl">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs">
            {user?.name?.[0] || 'T'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">
              {user?.name || 'Teacher User'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full mt-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-all"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay mask */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>
          {/* Sliding container */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-slate-900 animate-slide-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-slate-400 hover:bg-slate-850 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main View Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f1f5f9] scroll-smooth">
        {/* Top Navbar */}
        <header className="h-12 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden h-8 w-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-extrabold text-slate-100 capitalize">
              {navItems.find((n) => isActive(n.path))?.name || 'Question Paper Builder'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Action Item details */}
            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 rounded-md">
              Teacher Mode
            </span>
          </div>
        </header>

        {/* Dynamic Route Children Outlet Content */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
