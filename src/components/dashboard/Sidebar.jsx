import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, FileText, CreditCard,
  MessageSquare, Calendar, Bell, Settings, LogOut, Zap, Users,
  BarChart3, MessageCircle, Sparkles, Globe,
  ShieldCheck, HelpCircle, HardDrive, Gift, X, Target, Instagram
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, notificationCount } = useUIStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const mainItems = [
    { label: 'OS Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Studio', path: '/dashboard/ai-studio', icon: Sparkles, badge: 'NEW' },
    { label: 'Community', path: '/dashboard/community', icon: Globe },
    { label: 'Alerts Hub', path: '/dashboard/notifications', icon: Bell, count: notificationCount },
    { label: 'Partner Program', path: '/dashboard/referral', icon: Gift, badge: '₹₹₹' },
    { label: 'Intelligence', path: '/dashboard/analytics', icon: BarChart3 },
  ];

  const operationalItems = [
    { label: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
    { label: 'Digital Vault', path: '/dashboard/vault', icon: HardDrive },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageCircle, count: 3 },
    { label: 'Invoices', path: '/dashboard/invoices', icon: CreditCard },
  ];

  const ecosystemItems = [
    { label: 'Leads', path: '/dashboard/leads', icon: Users },
    { label: 'Lead Generator', path: '/dashboard/lead-generator', icon: Target, badge: 'AI' },
    { label: 'Bookings', path: '/dashboard/appointments', icon: Calendar },
    { label: 'Users', path: '/dashboard/users', icon: Users },
    { label: 'Portfolio', path: '/dashboard/portfolio', icon: HardDrive },
    { label: 'Blogs', path: '/dashboard/blog', icon: FileText },
    { label: 'Auto Blog', path: '/dashboard/auto-blog', icon: Zap, badge: 'AI' },
    { label: 'Project Gen', path: '/dashboard/project-generator', icon: Sparkles, badge: 'NEW' },
    { label: 'Insta Post', path: '/dashboard/insta-post', icon: Instagram, badge: 'AI' },
    { label: 'Support', path: '/dashboard/support', icon: HelpCircle },
    { label: 'Website Audit', path: '/dashboard/audit', icon: Globe },
    { label: 'Security Audit', path: '/dashboard/audit-logs', icon: ShieldCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-[280px] bg-[#050508] border-r border-white/5 flex flex-col z-50 overflow-hidden transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      {/* Mobile Close Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden absolute top-6 right-6 text-gray-500 hover:text-white"
      >
        <X size={24} />
      </button>

      {/* Brand Header */}
      <div className="p-8 pb-8 flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg transform transition-transform group-hover:rotate-6">
          <Zap size={24} color="#fff" fill="#fff" />
        </div>
        <div>
          <span className="font-black text-white text-xl font-display uppercase tracking-widest leading-none block">
            THE STACK
          </span>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] leading-none mt-1 block">
            GUY OS v2.0
          </span>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scrollbar-hide">
        <div>
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2 italic">Core System</p>
          <div className="space-y-1">
            {mainItems.map(item => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </div>
        </div>

        {isAdmin && (
          <div>
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2 italic">Ecosystem</p>
            <div className="space-y-1">
              {ecosystemItems.map(item => (
                <SidebarLink key={item.path} {...item} />
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2 italic">Operations</p>
          <div className="space-y-1">
            {operationalItems.map(item => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </div>
        </div>

        
      </div>

      {/* User Session Footer */}
      <div className="p-6 mt-auto bg-gradient-to-t from-black to-transparent">
        <div className="glass-card p-4 border-white/5 bg-white/[0.02] flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black text-xs">
            {user?.name?.substring(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white uppercase tracking-widest truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">{user?.role}</p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-glow-green"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="flex-1 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 h-12 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ label, path, icon: Icon, badge, count }) {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) => `
        flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-black transition-all no-underline relative group uppercase tracking-[0.15em]
        ${isActive ? 'text-white bg-white/[0.05] border border-white/5 shadow-inner' : 'text-gray-500 hover:text-gray-300 hover:translate-x-1'}
      `}
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className={isActive ? 'text-blue-500' : 'text-inherit'} />
          <span className="flex-1">{label}</span>

          {badge && (
            <span className="text-[8px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full animate-pulse tracking-normal">
              {badge}
            </span>
          )}

          {count && !isActive && (
            <span className="text-[9px] font-black text-blue-500">
              0{count}
            </span>
          )}

          {isActive && (
            <motion.div
              layoutId="active-indicator"
              className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-glow-blue"
            />
          )}
        </>
      )}
    </NavLink>
  );
}
