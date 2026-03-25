import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, FolderKanban, CreditCard, TrendingUp,
  MessageSquare, Bell, Calendar, Zap, Rocket,
  CheckCircle, Clock, AlertCircle, ArrowRight, Sparkles, Activity, Search, MessageCircle, Globe
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { analyticsAPI } from '../../services/api';
import { userStats, projects } from '../../services/mockData';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const resp = await analyticsAPI.getDashboard();
      return resp.data.data;
    },
    retry: 2
  });

  if (isLoading) return <LoadingScreen />;
  if (isError) return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
       <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
          <AlertCircle size={40} />
       </div>
       <h2 className="text-2xl font-black text-white uppercase tracking-tighter">System Offline</h2>
       <p className="text-gray-500 max-w-xs italic">Failed to synchronize with the core engine. Please refresh or check your connection.</p>
       <button onClick={() => window.location.reload()} className="btn-primary">Retry Synchronization</button>
    </div>
  );

  return (
    <div className="space-y-16 pb-32">
      {/* OS Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-500 mb-6 font-display">
            <Activity size={12} className="animate-pulse" /> SYSTEM ONLINE
          </div>
          <h1 className="text-3xl md:text-3xl font-black text-white mb-6 font-display uppercase tracking-tighter shrink-0 leading-[0.85]">
            Hello, <span className="gradient-text-blue">{user?.name || 'Guest'}</span>
          </h1>
          <p className="text-md text-gray-500 italic font-medium tracking-human leading-relaxed">
            {isAdmin
              ? "Your agency command center is synchronized. Managing global assets and development sprints."
              : "Welcome to your digital headquarters. Tracking your high-performance product build."}
          </p>
        </motion.div>

        <div className="flex gap-4">
          <div className="glass-card flex items-center gap-6 px-10 py-6 border-white/5 bg-white/[0.01]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg transform rotate-3">
              <Calendar size={24} color="#fff" />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mb-1 italic">Tactical Date</p>
              <p className="text-xl font-black text-white font-display uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {isAdmin ? (
          <>
            <StatCard label="Total Leads" val={summary?.leads || 0} icon={Users} trend={`+${summary?.recentLeads?.length || 0} today`} color="blue" />
            <StatCard label="Active Projects" val={summary?.projects || 0} icon={FolderKanban} trend="SYNCED" color="cyan" />
            <StatCard label="Monthly Revenue" val={`₹${summary?.revenue?.toLocaleString('en-IN') || 0}`} icon={TrendingUp} trend={`${summary?.revenueGrowth >= 0 ? '+' : ''}${summary?.revenueGrowth}%`} color="green" />
            <StatCard label="Live Alerts" val={summary?.notifications || 0} icon={Bell} trend="ACTION REQ" color="orange" />
          </>
        ) : (
          <>
            <StatCard label="Active Sprints" val={summary?.projects || 0} icon={FolderKanban} trend="IN PROGRESS" color="blue" />
            <StatCard label="Paid Invoices" val={summary?.invoiced || 0} icon={CreditCard} trend={`${summary?.pendingInvoices || 0} PENDING`} color="green" />
            <StatCard label="OS Notifications" val={summary?.notifications || 0} icon={Bell} trend="NEW" color="orange" />
            <StatCard label="Response Latency" val="12m" icon={Clock} trend="AVG TIME" color="cyan" />
          </>
        )}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Main Feed Surface */}
        <div className="lg:col-span-8 space-y-12">
          <div className="glass-card-premium p-12 border-white/5 bg-white/[0.01] rounded-[60px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.03] blur-[100px] pointer-events-none" />

            <div className="flex justify-between items-end mb-12 pb-8 border-b border-white/5">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-display flex items-center gap-4 italic shrink-0">
                  <Rocket size={32} className="text-blue-500" /> {isAdmin ? "Global Leads" : "Project Pulse"}
                </h3>
                <p className="text-xs text-gray-500 italic font-bold">Real-time update from the engineering layer.</p>
              </div>
              <Link to={isAdmin ? "/dashboard/leads" : "/dashboard/projects"} className="text-[10px] font-black text-blue-500 uppercase tracking-widest no-underline flex items-center gap-2 group transition-all">
                Access All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-6">
              {isAdmin ? (
                summary?.recentLeads?.length > 0 ? summary.recentLeads.map((lead, i) => (
                  <motion.div
                    key={lead?._id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-10 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-blue-600/20 to-cyan-500/10 flex items-center justify-center text-blue-500 text-sm font-black uppercase border border-blue-500/10 group-hover:rotate-6 transition-transform">
                      {lead?.name?.substring(0, 1) || 'L'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-black text-white uppercase tracking-widest truncate">{lead?.name || 'Unknown Lead'}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mt-2 italic flex items-center gap-2">
                        {lead?.projectType || 'Project'} <span className="w-1 h-1 rounded-full bg-gray-700" /> {lead?.status || 'Active'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-gray-600 font-black uppercase mb-2 tracking-widest">
                        {lead?.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                      <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20">Active</span>
                    </div>
                  </motion.div>
                )) : (
                  <div className="py-20 text-center text-[#6b7280] italic">No new leads today.</div>
                )
              ) : (
                // Client Timeline
                <div className="space-y-16 relative pl-12 border-l-4 border-white/5 py-6 translate-x-4">
                  {[
                    { label: 'Initial Design Prototyping', status: 'completed', time: 'Yesterday', icon: Sparkles },
                    { label: 'Backend API Integration', status: 'in-progress', time: 'Active Now', icon: Zap },
                    { label: 'Final Mobile Optimization', status: 'pending', time: 'In 2 days', icon: Rocket }
                  ].map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[64px] top-1 w-10 h-10 rounded-2xl border-4 border-[#050508] z-10 flex items-center justify-center ${step.status === 'completed' ? 'bg-[#39ff14] text-[#050508] shadow-glow-green/40' :
                        step.status === 'in-progress' ? 'bg-blue-600 text-white shadow-glow-blue/40' : 'bg-white/5 text-gray-500'
                        }`}>
                        <step.icon size={18} />
                      </div>
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <p className={`text-xl font-black uppercase tracking-widest ${step.status === 'pending' ? 'text-gray-700' : 'text-white font-display'}`}>{step.label}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mt-3 italic">{step.time}</p>
                        </div>
                        {step.status === 'in-progress' && (
                          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                            <span className="text-[9px] text-blue-500 font-black uppercase tracking-[0.2em]">Live Session</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Integration Surface */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-10 bg-gradient-to-br from-blue-600/5 to-transparent border-blue-500/10 group overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-[50px] group-hover:scale-150 transition-transform duration-700" />
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-8 border border-blue-500/20 transform group-hover:rotate-6 transition-transform">
                <MessageSquare size={32} strokeWidth={1.5} />
              </div>
              <h4 className="text-2xl font-black text-white mb-3 uppercase tracking-widest font-display">Neural Support</h4>
              <p className="text-gray-500 mb-12 leading-relaxed italic text-sm">
                Access the rapid engineering channel. Response times are currently under 15 minutes.
              </p>
              <button className="btn-primary w-full h-14 justify-center text-[10px]">
                <Zap size={16} className="mr-2" /> Start OS Session
              </button>
            </div>
            <div className="glass-card p-10 bg-gradient-to-br from-cyan-600/5 to-transparent border-cyan-500/10 group overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/5 blur-[50px] group-hover:scale-150 transition-transform duration-700" />
              <div className="w-16 h-16 rounded-2xl bg-cyan-600/10 flex items-center justify-center text-cyan-500 mb-8 border border-cyan-500/20 transform group-hover:rotate-6 transition-transform">
                <Sparkles size={32} strokeWidth={1.5} />
              </div>
              <h4 className="text-2xl font-black text-white mb-3 uppercase tracking-widest font-display">Intelligence</h4>
              <p className="text-gray-500 mb-12 leading-relaxed italic text-sm">
                Initialize new AI modules or audit your current business performance metrics.
              </p>
              <button className="btn-os w-full h-14 justify-center text-[10px] text-cyan-500 border-cyan-500/20 hover:bg-cyan-500/5">
                <Activity size={16} className="mr-2" /> Track Scaling
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Dispatch */}
        <aside className="lg:col-span-8 space-y-12">
          <div className="glass-card-premium p-10 rounded-[40px] border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-3">
                Dispatch Logs <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              </h3>
              <button className="text-gray-700 hover:text-white transition-colors"><Search size={16} /></button>
            </div>

            <div className="space-y-12 relative pl-4 border-l-2 border-white/5">
              {summary?.activity?.length > 0 ? summary.activity.map((act, i) => (
                <div key={act._id} className="relative">
                  <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-[#050508] border-2 border-blue-600 shadow-glow-blue" />
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 italic">
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-white font-medium italic leading-relaxed">
                    {act.action}
                  </p>
                </div>
              )) : (
                <div className="py-20 text-center">
                  <Clock size={40} className="text-white/5 mx-auto mb-4" />
                  <p className="text-xs text-[#4b5563] italic font-bold uppercase tracking-widest">Awaiting Logs</p>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 text-center">
              <button className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 hover:text-white transition-all">Clear Session History</button>
            </div>
          </div>

          {/* Quick Identity HUD */}
          <div className="glass-card-premium p-10 rounded-[40px] border-white/5 bg-white/[0.01] flex flex-col items-center text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-[32px] border-2 border-blue-500/20 p-2 transform transition-transform group-hover:rotate-12 duration-500">
                <div className="w-full h-full rounded-[24px] bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-black shadow-glow-blue/20 capitalize">
                  {user?.name?.substring(0, 1)}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-green-500 border-4 border-[#050508] shadow-glow-green" />
            </div>
            <h4 className="text-2xl font-black text-white uppercase tracking-widest shrink-0 mb-1 leading-none">{user?.name}</h4>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-10 italic">{user?.role} CORE HUB</p>

            <div className="grid grid-cols-2 gap-4 w-full mb-10">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-lg font-black text-white">12</p>
                <p className="text-[8px] text-blue-500 font-black uppercase tracking-widest">SPRINTS</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-lg font-black text-white">99%</p>
                <p className="text-[8px] text-green-500 font-black uppercase tracking-widest">UPTIME</p>
              </div>
            </div>

            <button className="btn-os w-full h-14 justify-center text-[10px]">
              RECONFIG ACCOUNT
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatCard(props) {
  const { label, val, icon: Icon, trend, color } = props;
  const colors = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    green: 'text-[#39ff14] bg-[#39ff14]/10 border-[#39ff14]/20',
    cyan: 'text-[#22d3ee] bg-[#22d3ee]/10 border-[#22d3ee]/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`glass-card p-5 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group`}
    >
      <div className="flex justify-between items-start mb-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 ${colors[color]} transform transition-transform group-hover:rotate-12`}>
          <Icon size={28} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity italic">{trend}</span>
      </div>
      <div>
        <p className="text-3xl font-black text-white font-display mb-3 tracking-tighter shrink-0">{val}</p>
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] italic">{label}</p>
      </div>
    </motion.div>
  );
}
