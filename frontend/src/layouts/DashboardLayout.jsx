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
    <div className="flex flex-col h-full bg-white border-r border-slate-200/60 text-slate-700">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100">
        <GraduationCap className="h-7 w-7 text-primary-600" />
        <span className="font-extrabold text-base tracking-tight text-slate-900">
          Question<span className="text-primary-600">Wallah</span>
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
                  ? 'bg-primary-50 text-primary-700'
                  : 'hover:bg-slate-50 text-slate-550 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${active ? 'text-primary-600' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Teacher Profile Footer Info */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-750 font-bold text-xs">
            {user?.name?.[0] || 'T'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">
              {user?.name || 'Teacher User'}
            </p>
            <p className="text-[10px] text-slate-450 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full mt-2 px-3 py-2 text-xs font-bold text-slate-450 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
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
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main View Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200/60 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden h-10 w-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-xl"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-base font-extrabold text-slate-900 capitalize">
              {navItems.find((n) => isActive(n.path))?.name || 'Question Paper Builder'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Action Item details */}
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
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
