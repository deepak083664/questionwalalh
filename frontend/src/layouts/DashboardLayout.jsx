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
    <div className="flex flex-col h-full bg-gradient-to-b from-[#100e2b] to-[#1e1b4b] border-r border-[#1a153b] text-indigo-200 backdrop-blur-md">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-indigo-950/50">
        <GraduationCap className="h-7 w-7 text-indigo-400 animate-pulse" />
        <span className="font-extrabold text-base tracking-tight text-white">
          Question<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-450 font-black">Wallah</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-3 text-xs font-bold rounded-xl transition-all duration-200 relative overflow-hidden ${
                active
                  ? 'bg-gradient-to-r from-indigo-500 to-[#8B5CF6] text-white shadow-[0_4px_15px_rgba(99,102,241,0.4)]'
                  : 'hover:bg-white/10 text-indigo-200/70 hover:text-white'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#22d3ee] animate-pulse"></span>
              )}
              <Icon className={`h-4.5 w-4.5 ${active ? 'text-cyan-300' : 'text-indigo-300/60'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Teacher Profile Footer Info */}
      <div className="p-4 border-t border-indigo-950/50">
        <div className="flex items-center gap-3 px-3.5 py-3 bg-white/5 border border-white/10 rounded-2xl shadow-sm">
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-white/10 text-white font-black text-xs clay-badge">
            {user?.name?.[0] || 'T'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {user?.name || 'Teacher User'}
            </p>
            <p className="text-[10px] text-indigo-300/60 font-semibold truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full mt-3 px-3 py-2.5 text-xs font-bold text-indigo-200 bg-white/5 hover:bg-red-500/20 hover:text-white border border-white/5 hover:border-red-500/30 rounded-xl transition-all"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent flex">
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
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-[#100e2b] animate-slide-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-indigo-200 hover:bg-white/10 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main View Wrapper */}
      <div id="main-scroll-content" className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-100/10 dark:bg-slate-950/10 scroll-smooth bg-grid-pattern">
        {/* Top Navbar */}
        <header className="h-14 flex items-center justify-between px-6 bg-white/40 dark:bg-slate-900/40 border-b border-slate-200/30 dark:border-slate-800/40 sticky top-0 z-40 backdrop-blur-md shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden h-8 w-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-extrabold text-slate-850 dark:text-white capitalize">
              {navItems.find((n) => isActive(n.path))?.name || 'Question Paper Builder'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="h-7.5 w-7.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg flex items-center justify-center transition-all shadow-sm clay-badge"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-slate-650" />
              )}
            </button>

            {/* Action Item details */}
            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border border-indigo-150 dark:border-indigo-900 px-2.5 py-1 rounded-lg clay-badge">
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
