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
    { name: 'Saved Papers', path: '/history', icon: History },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/90 border-r border-slate-200/50 text-slate-700 backdrop-blur-md">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100">
        <GraduationCap className="h-7 w-7 text-indigo-600 animate-pulse" />
        <span className="font-extrabold text-base tracking-tight text-slate-900">
          Question<span className="text-indigo-650">Wallah</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-3 text-xs font-bold rounded-xl transition-all duration-200 ${
                active
                  ? 'clay-btn-indigo text-white'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${active ? 'text-white' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Teacher Profile Footer Info */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs clay-badge">
            {user?.name?.[0] || 'T'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">
              {user?.name || 'Teacher User'}
            </p>
            <p className="text-[10px] text-slate-400 font-medium truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full mt-3 px-3 py-2.5 text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all clay-btn clay-btn-flat"
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>
          {/* Sliding container */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-white animate-slide-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main View Wrapper */}
      <div id="main-scroll-content" className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-100/60 scroll-smooth bg-grid-pattern">
        {/* Top Navbar */}
        <header className="h-14 flex items-center justify-between px-6 bg-white/80 border-b border-slate-150 sticky top-0 z-40 backdrop-blur-md shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden h-8 w-8 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-extrabold text-slate-850 capitalize">
              {navItems.find((n) => isActive(n.path))?.name || 'Question Paper Builder'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl flex items-center justify-center transition-all shadow-sm clay-badge"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-slate-650" />
              )}
            </button>

            {/* Action Item details */}
            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-650 bg-indigo-50 border border-indigo-150 px-2.5 py-1 rounded-lg clay-badge">
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
