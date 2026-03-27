
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell, Search, HelpCircle, Menu, ChevronRight,
  LayoutDashboard, User, Settings, LogOut, Loader2,
  MessageSquare, CreditCard, Rocket, Zap, Clock, Check,
  Users, FileText, Calendar, CheckCheck, Inbox
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useUIStore } from '../../store';
import { notificationsAPI } from '../../services/api';
import GlobalSearch from './GlobalSearch';

const getNotifIcon = (type) => {
  switch (type) {
    case 'message': return { icon: MessageSquare, color: 'text-blue-500 bg-blue-500/10' };
    case 'payment': return { icon: CreditCard, color: 'text-emerald-500 bg-emerald-500/10' };
    case 'project': 
    case 'project-update': return { icon: Rocket, color: 'text-purple-500 bg-purple-500/10' };
    case 'system': return { icon: Zap, color: 'text-orange-500 bg-orange-500/10' };
    case 'lead': return { icon: Users, color: 'text-cyan-500 bg-cyan-500/10' };
    case 'invoice': return { icon: FileText, color: 'text-emerald-500 bg-emerald-500/10' };
    case 'proposal': return { icon: Inbox, color: 'text-indigo-500 bg-indigo-500/10' };
    case 'appointment': return { icon: Calendar, color: 'text-pink-500 bg-pink-500/10' };
    default: return { icon: Bell, color: 'text-[#6b7280] bg-white/5' };
  }
};

export default function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const { toggleSidebar, notificationCount, setNotificationCount } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Fetch notifications
  const { data: notifications, isLoading: isNotifLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const resp = await notificationsAPI.getAll();
      return resp.data.data;
    }
  });

  const readMutation = useMutation({
    mutationFn: (id) => notificationsAPI.markRead(id),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['notifications'], (old = []) => 
        old.map(n => n._id === variables ? { ...n, read: true } : n)
      );
      setNotificationCount(Math.max(0, notificationCount - 1));
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsAPI.markAllRead(),
    onSuccess: () => {
      queryClient.setQueryData(['notifications'], (old = []) => 
        old.map(n => ({ ...n, read: true }))
      );
      setNotificationCount(0);
    }
  });

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
              className={`relative w-10 h-10 rounded-xl bg-white/[0.03] border flex items-center justify-center transition-all ${
                notificationCount > 0 
                  ? 'border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                  : 'border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <motion.div
                animate={notificationCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
              >
                <Bell size={20} className={notificationCount > 0 ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" : ""} />
              </motion.div>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-black text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl bg-[#0a0a11]/95 backdrop-blur-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                  style={{ transformOrigin: 'top right' }}
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        Alert Hub
                      </p>
                      {notificationCount > 0 && (
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-black tracking-wider shadow-glow-blue/10">
                          {notificationCount} NEW
                        </span>
                      )}
                    </div>
                    {notificationCount > 0 && (
                      <button
                        onClick={() => markAllReadMutation.mutate()}
                        disabled={markAllReadMutation.isPending}
                        className="text-[10px] text-gray-400 hover:text-white font-black uppercase tracking-widest transition-colors flex items-center gap-1"
                      >
                        {markAllReadMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />}
                        Mark All Read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto w-full custom-scrollbar">
                    {isNotifLoading ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <Loader2 className="animate-spin text-gray-500 mb-2" size={24} />
                      </div>
                    ) : notifications && notifications.length > 0 ? (
                      <div className="flex flex-col">
                        {notifications.slice(0, 5).map(notif => {
                          const { icon: NotifIcon, color } = getNotifIcon(notif.type);
                          return (
                            <div 
                              key={notif._id} 
                              className={`p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors group flex gap-4 ${notif.read ? 'opacity-60' : ''}`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${color}`}>
                                <NotifIcon size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold truncate ${notif.read ? 'text-gray-400' : 'text-white'}`}>
                                  {notif.title}
                                </p>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                                  {notif.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[#4b5563] flex items-center gap-1">
                                    <Clock size={10} /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {!notif.read && (
                                    <button 
                                      onClick={() => readMutation.mutate(notif._id)}
                                      disabled={readMutation.isPending}
                                      className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 ml-auto flex items-center gap-1"
                                    >
                                      Mark Read
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-10 text-center flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-3">
                          <Check size={20} />
                        </div>
                        <p className="text-sm font-medium text-gray-400">All caught up!</p>
                        <p className="text-xs text-gray-500 mt-1">No pending alerts</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 bg-white/[0.02] border-t border-white/5">
                    <button 
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/dashboard/notifications');
                      }}
                      className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black text-white uppercase tracking-widest transition-all"
                    >
                      View All Activity ({(notifications?.length || 0)})
                    </button>
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
