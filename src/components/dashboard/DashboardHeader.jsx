
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bell, Search, HelpCircle, Menu, ChevronRight,
  LayoutDashboard, User, Settings, LogOut
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore, useUIStore } from '../../store';
import GlobalSearch from './GlobalSearch';

export default function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Extract title
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageTitle = pathParts[pathParts.length - 1] || 'overview';

  const isDashboardHome = location.pathname === "/dashboard";

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 h-20 px-6 lg:px-10 flex items-center justify-between backdrop-blur-xl bg-[#0a0a11]/70 border-b border-white/5">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-500">
            {!isDashboardHome && (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
                <ChevronRight size={14} />
              </>
            )}
            <span className="text-white">{pageTitle.replace('-', ' ')}</span>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="hidden md:flex flex-1 mx-10">
          <button
            onClick={() => setShowSearch(true)}
            className="w-full h-12 flex items-center gap-3 px-4 rounded-2xl bg-white/[0.04] border border-white/5 text-gray-400 hover:text-white transition-all"
          >
            <Search size={18} />
            <span className="text-sm">Search anything...</span>

            <div className="ml-auto flex gap-1">
              <kbd className="px-2 py-1 text-[10px] bg-white/5 rounded border border-white/10">⌘</kbd>
              <kbd className="px-2 py-1 text-[10px] bg-white/5 rounded border border-white/10">K</kbd>
            </div>
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* Support */}
          <button
            onClick={() => alert('Open support modal')}
            className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <HelpCircle size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white"
            >
              <Bell size={20} />
            </button>

            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#0a0a11] border border-white/10 shadow-xl p-4"
                >
                  <p className="text-xs text-gray-400">Notifications</p>
                  <div className="mt-3 space-y-2 text-sm text-white">
                    <p>🚀 New project created</p>
                    <p>💬 You have 3 unread messages</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(prev => !prev)}
              className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#0a0a11] border border-white/10 shadow-xl p-3"
                >
                  <div className="px-3 py-2 border-b border-white/5 mb-2">
                    <p className="text-sm text-white font-bold">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white">
                    <User size={16} /> Profile
                  </button>

                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white">
                    <Settings size={16} /> Settings
                  </button>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* GLOBAL SEARCH */}
      <GlobalSearch showSearch={showSearch} setShowSearch={setShowSearch} />
    </>
  );
}
