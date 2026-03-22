import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bell, Search, Plus, Zap, MessageSquare, 
  HelpCircle, Menu, X, ChevronRight, LayoutDashboard 
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';

export default function DashboardHeader() {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  // Extract page title from pathname
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageTitle = pathParts[pathParts.length - 1] || 'Overview';

  return (
    <header className="sticky top-0 right-0 left-0 h-20 glass-card border-b border-white/5 z-40 px-8 flex items-center justify-between bg-gradient-to-r from-transparent via-[#0a0a11]/10 to-transparent">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white"
      >
        <Menu size={20} />
      </button>

      {/* Left Side: Breadcrumbs / Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[#4b5563] text-xs font-black uppercase tracking-widest">
           <LayoutDashboard size={14} /> 
           <ChevronRight size={14} />
           <span className="text-white">{pageTitle.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-lg mx-12">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563]" size={18} />
          <input 
            type="text" 
            placeholder={isAdmin ? "Search leads, projects, invoices..." : "Search my projects, messages..."} 
            className="w-full h-12 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#3b82f6]/40 transition-all font-medium"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
            <span className="w-5 h-5 rounded bg-white/5 border border-white/10 text-[#6b7280] flex items-center justify-center text-[10px] font-black uppercase">⌘</span>
            <span className="w-5 h-5 rounded bg-white/5 border border-white/10 text-[#6b7280] flex items-center justify-center text-[10px] font-black uppercase">F</span>
          </div>
        </div>
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Help */}
        <button className="hidden sm:flex w-10 h-10 rounded-xl bg-white/2 border border-white/5 items-center justify-center text-[#9ca3af] hover:text-white transition-all">
          <HelpCircle size={20} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="w-10 h-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-white transition-all">
            <Bell size={20} />
          </button>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a11] animate-pulse" />
        </div>

        {/* Action Button */}
        {isAdmin ? (
          <button className="btn-primary h-12 text-xs no-underline font-black uppercase tracking-widest px-6 shadow-glow-blue/20">
            <Plus size={16} /> Create
          </button>
        ) : (
          <button className="btn-secondary h-12 text-xs no-underline font-black uppercase tracking-widest px-6 border-blue-500/20 text-[#3b82f6]">
            <Zap size={16} /> Book Call
          </button>
        )}
      </div>
    </header>
  );
}
