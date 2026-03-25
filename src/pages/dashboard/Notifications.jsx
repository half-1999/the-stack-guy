import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { 
  Bell, CheckCircle, Clock, Trash2, 
  Settings, MessageSquare, CreditCard, 
  Rocket, Zap, Filter, MoreVertical, 
  CheckCheck, AlertCircle, TrendingUp, Loader2
} from 'lucide-react';
import { notificationsAPI } from '../../services/api';
import { useAuthStore } from '../../store';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function Notifications() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const resp = await notificationsAPI.getAll();
      return resp.data.data;
    }
  });

  useEffect(() => {
    if (!token) return;

    const socket = io(window.location.origin, {
      auth: { token }
    });

    socket.on('new-notification', (notif) => {
      queryClient.setQueryData(['notifications'], (old = []) => {
        // Prevent duplicates
        if (old.find(n => n._id === notif._id)) return old;
        return [notif, ...old];
      });
    });

    return () => socket.disconnect();
  }, [token, queryClient]);

  const readMutation = useMutation({
    mutationFn: (id) => notificationsAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsAPI.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  const getIcon = (type) => {
    switch (type) {
      case 'message': return { icon: MessageSquare, color: 'text-blue-500 bg-blue-500/10' };
      case 'payment': return { icon: CreditCard, color: 'text-green-500 bg-green-500/10' };
      case 'project': return { icon: Rocket, color: 'text-purple-500 bg-purple-500/10' };
      case 'system': return { icon: Zap, color: 'text-orange-500 bg-orange-500/10' };
      default: return { icon: Bell, color: 'text-[#6b7280] bg-white/5' };
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-10 border-b border-white/5">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase tracking-widest">
            Activity <span className="gradient-text">Stream</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Keep track of every update, payment, and message in real-time.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="h-12 px-6 rounded-xl bg-white/2 border border-white/5 text-[#6b7280] hover:text-white transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
          >
            {markAllReadMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <CheckCheck size={16} />}
            Mark all read
          </button>
          <button className="h-12 w-12 rounded-xl bg-white/2 border border-white/5 text-[#6b7280] hover:text-white transition-all flex items-center justify-center">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {notifications?.map((notif) => {
            const { icon: NotifIcon, color } = getIcon(notif.type);
            return (
              <motion.div 
                key={notif._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-card p-6 flex flex-col md:flex-row items-start md:items-center gap-6 border-2 transition-all ${
                  notif.read ? 'border-transparent opacity-60' : 'border-blue-500/20 shadow-glow-blue/5'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 ${color}`}>
                  <NotifIcon size={24} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-lg font-bold leading-tight ${notif.read ? 'text-[#9ca3af]' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-[#6b7280] leading-relaxed italic mb-4">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-4">
                    {!notif.read && (
                      <button 
                        onClick={() => readMutation.mutate(notif._id)}
                        className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6] hover:underline underline-offset-4"
                      >
                         Mark as Read
                      </button>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#4b5563] flex items-center gap-1">
                      <Clock size={10} /> {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                   <button className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#4b5563] hover:text-white transition-all">
                      <MoreVertical size={16} />
                   </button>
                   <button className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#4b5563] hover:text-red-500 transition-all">
                      <Trash2 size={16} />
                   </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {notifications?.length === 0 && (
          <div className="py-24 text-center glass-card border-dashed">
            <Bell size={48} className="text-white/5 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-2 italic">Silent Mode</h3>
            <p className="text-[#4b5563] text-sm font-medium">You're all caught up! No recent notifications to show.</p>
          </div>
        )}
      </div>

      {/* Featured Insight Card */}
      <div className="p-10 glass-card bg-gradient-to-r from-blue-600/10 to-transparent border-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-10 rounded-[32px] mt-20">
         <div className="flex gap-8 items-center">
            <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 flex items-center justify-center text-[#3b82f6] border border-blue-500/20 shadow-glow-blue/10">
               <TrendingUp size={32} />
            </div>
            <div>
               <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-widest leading-none">Smart Notifications</h4>
               <p className="text-sm font-medium text-[#9ca3af] italic max-w-md">
                 Our system uses AI to prioritize urgent events, ensuring you never miss a critical message or payment deadline.
               </p>
            </div>
         </div>
         <button className="btn-secondary h-12 text-[10px] no-underline font-black uppercase tracking-widest px-8 border-white/5">Configure Alerts</button>
      </div>
    </div>
  );
}
