import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, 
  IndianRupee, Globe, Search, Rocket, 
  Target, Zap, Clock, PieChart, Info, ArrowUpRight
} from 'lucide-react';
import { analyticsAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics-full'],
    queryFn: async () => {
      try {
        const resp = await analyticsAPI.getSummary(); // Using summary for now
        return resp.data.data;
      } catch (err) {
        // Fallback for demo
        return {
          revenue: 1250000,
          leads: 142,
          projects: 12,
          messages: 8,
          notifications: 3
        };
      }
    }
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase tracking-widest leading-tight">
            Agency <span className="gradient-text">Performance</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Advanced metrics and conversion analytics for "THE STACK GUY".
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-6 h-12 glass-card bg-white/5 border border-white/5 flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#6b7280]">
             Last 30 Days <TrendingUp size={16} className="text-green-500" />
          </div>
          <button className="btn-secondary h-12 text-[10px] no-underline font-black uppercase tracking-widest px-8 border-white/5">Export Report</button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatsCard label="Gross Revenue" val={`₹${analytics?.revenue?.toLocaleString('en-IN') || 0}`} icon={IndianRupee} trend="+18.5%" color="blue" />
         <StatsCard label="Lead Score (Avg)" val="78" icon={Target} trend="+5%" color="green" />
         <StatsCard label="Client Retention" val="92%" icon={Users} trend="+2%" color="cyan" />
         <StatsCard label="Support SLA" val="98.8%" icon={Zap} trend="-0.2%" color="orange" down={true} />
      </div>

      {/* Charts Section Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Monthly Growth Chart (Mock) */}
         <div className="lg:col-span-8 glass-card p-10 min-h-[500px] flex flex-col bg-gradient-to-br from-[#111118] to-[#0a0a0f] border-white/5 border-2">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                   <TrendingUp size={24} className="text-[#3b82f6]" /> Revenue Velocity
                </h3>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2 text-[10px] text-[#6b7280] font-black uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Target</div>
                   <div className="flex items-center gap-2 text-[10px] text-[#6b7280] font-black uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-[#39ff14]" /> Actual</div>
                </div>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-4 pt-10">
               {[40, 60, 45, 78, 90, 85, 95, 80, 100, 110, 120, 140].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                     <div className="relative w-full flex flex-col items-center justify-end h-64 gap-1">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${v}%` }}
                          transition={{ duration: 1, delay: i * 0.05 }}
                          className="w-full bg-[#3b82f6]/20 border border-[#3b82f6]/40 rounded-t-lg group-hover:bg-[#3b82f6]/40 transition-all cursor-pointer relative"
                        >
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] font-black uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{v}K</div>
                        </motion.div>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${v * 0.8}%` }}
                          transition={{ duration: 1.2, delay: i * 0.05 }}
                          className="w-full max-w-[50%] bg-[#39ff14]/30 border border-[#39ff14]/50 rounded-t-lg absolute bottom-0 shadow-glow-green/10"
                        />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#4b5563] group-hover:text-white transition-colors">M0{i+1}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Distribution Summary */}
         <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-10 bg-[#0a0a11] border-white/5 border-2">
               <h3 className="text-sm font-black text-[#6b7280] uppercase tracking-widest mb-10 pb-6 border-b border-white/5 flex items-center justify-between">
                  Service Popularity
                  <PieChart size={16} />
               </h3>
               
               <div className="space-y-8">
                  {[
                    { label: 'Business Web', val: 45, color: 'bg-blue-500 shadow-glow-blue/40' },
                    { label: 'E-commerce', val: 32, color: 'bg-[#39ff14] shadow-glow-green/40' },
                    { label: 'Landing Pages', val: 18, color: 'bg-[#22d3ee] shadow-glow-cyan/40' },
                    { label: 'SaaS Builds', val: 5, color: 'bg-orange-500 shadow-glow-orange/40' }
                  ].map(item => (
                    <div key={item.label} className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-white">{item.label}</span>
                          <span className="text-[#6b7280]">{item.val}%</span>
                       </div>
                       <div className="progress-bar h-1.5 opacity-50">
                          <div className={`progress-fill ${item.color}`} style={{ width: `${item.val}%` }} />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-12 pt-10 border-t border-white/5 text-center">
                  <p className="text-[10px] text-[#4b5563] font-bold uppercase tracking-widest italic mb-2 leading-relaxed">Most Growth Seen In</p>
                  <p className="text-xl font-black text-white font-display uppercase tracking-widest">Tier 2 Markets</p>
               </div>
            </div>

            {/* Quick Action Feature */}
            <div className="glass-card p-10 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/10 text-center">
               <Rocket size={48} className="text-[#3b82f6] mx-auto mb-8" />
               <h4 className="text-white font-bold mb-4 uppercase tracking-widest">Scale Your Reach</h4>
               <p className="text-[10px] text-[#9ca3af] leading-relaxed mb-8 uppercase font-bold italic tracking-widest">Activate AI-driven prospecting for your most popular services.</p>
               <button className="btn-primary w-full justify-center h-12 text-[10px] font-black uppercase tracking-widest no-underline shadow-glow-blue/20">Launch Campaign</button>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatsCard({ label, val, icon: Icon, trend, color, down }) {
   const colors = {
      blue: 'text-blue-500 bg-blue-500/5 border-blue-500/10',
      green: 'text-[#39ff14] bg-[#39ff14]/5 border-[#39ff14]/10',
      cyan: 'text-[#22d3ee] bg-[#22d3ee]/5 border-[#22d3ee]/10',
      orange: 'text-orange-500 bg-orange-500/5 border-orange-500/10'
   };
   
   return (
      <div className={`glass-card p-10 border-2 transition-transform hover:scale-105 ${colors[color]} bg-gradient-to-br from-white/2 to-transparent`}>
         <div className="flex justify-between items-center mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 ${colors[color]}`}>
               <Icon size={24} />
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${down ? 'text-red-500' : 'text-green-500'}`}>
               {down ? <TrendingDown size={14} /> : <TrendingUp size={14} />} {trend}
            </div>
         </div>
         <h4 className="text-4xl font-black font-display tracking-wider leading-none text-white mb-2">{val}</h4>
         <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">{label}</p>
      </div>
   );
}
