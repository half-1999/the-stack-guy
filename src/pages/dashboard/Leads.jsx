import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Mail, Phone, Briefcase, 
  Search, Filter, MoreHorizontal, 
  Trash2, UserPlus, Zap, MessageSquare, 
  CheckCircle, Clock, AlertCircle, ArrowRight, TrendingUp, IndianRupee
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { leadsAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';

const leadStatuses = [
  { id: 'new', label: 'New Lead', color: 'text-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'text-cyan-500' },
  { id: 'qualified', label: 'Qualified', color: 'text-[#39ff14]' },
  { id: 'lost', label: 'Lost', color: 'text-red-500' }
];

export default function Leads() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [activeStatus, setActiveStatus] = useState('all');

  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      try {
        const resp = await leadsAPI.getAll();
        return resp.data.data;
      } catch (err) {
        // Fallback for demo
        return [
          { _id: '1', name: 'Aman Sharma', email: 'aman@example.com', phone: '+91 9876543210', status: 'new', score: 85, source: 'Website', projectType: 'SaaS Build', createdAt: new Date() },
          { _id: '2', name: 'Sarah Miller', email: 'sarah@global.co', phone: '+1 555-0199', status: 'qualified', score: 92, source: 'LinkedIn', projectType: 'Mobile OS', createdAt: new Date() }
        ];
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => leadsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
    }
  });

  if (!isAdmin) return <div className="p-20 text-center">Unauthorized.</div>;
  if (isLoading) return <LoadingScreen />;

  const filteredLeads = leads?.filter(l => {
    if (activeStatus === 'all') return true;
    return l.status === activeStatus;
  }) || [];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase tracking-widest leading-tight">
            Lead <span className="gradient-text">Capture</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Automated lead scoring and conversion pipeline for growing your agency.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex rounded-xl bg-white/5 border border-white/5 p-1 overflow-hidden">
             {['all', 'new', 'contacted', 'qualified'].map((s) => (
                <button 
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  className={`px-6 h-10 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${activeStatus === s ? 'bg-[#3b82f6] text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}
                >
                   {s}
                </button>
             ))}
          </div>
          <button className="h-12 w-12 rounded-xl bg-[#39ff14]/10 border border-[#39ff14]/20 flex items-center justify-center text-[#39ff14] hover:bg-[#39ff14]/20 transition-all shadow-glow-green/10">
             <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Pipeline Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <StatsBox label="Total Incoming" val={leads?.length || 0} color="blue" />
         <StatsBox label="Qualified" val={leads?.filter(l => l.status === 'qualified').length || 0} color="green" />
         <StatsBox label="Conversion Rate" val={`${Math.round(((leads?.filter(l => l.status === 'qualified').length || 0) / (leads?.length || 1)) * 100)}%`} color="cyan" />
         <StatsBox label="Est. Pipeline Value" val={`₹${(leads?.length || 0) * 15000}`} color="orange" />
      </div>

      {/* Grid of Leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLeads.map((lead) => (
          <motion.div 
            key={lead._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 relative overflow-hidden group hover:border-blue-500/20 border-2 transition-all border-white/5 bg-gradient-to-br from-[#111118] to-transparent"
          >
             {/* Lead Scoring Badge */}
             <div className="absolute top-0 right-0 p-4">
                <div className={`w-12 h-12 rounded-bl-3xl border-l-[3px] border-b-[3px] flex flex-col items-center justify-center ${lead.score > 70 ? 'border-green-500/30' : 'border-blue-500/20'}`}>
                   <span className={`text-lg font-black font-display leading-none ${lead.score > 70 ? 'text-[#39ff14]' : 'text-[#3b82f6]'}`}>{lead.score}</span>
                   <span className="text-[6px] font-black uppercase tracking-widest opacity-60">SCORE</span>
                </div>
             </div>

             <div className="mb-8">
                <div className="flex gap-2 mb-2">
                   <span className="badge badge-blue bg-blue-500/10 text-[8px] py-0.5">{lead.source}</span>
                   <span className="badge badge-green bg-[#39ff14]/10 text-[8px] py-0.5">{lead.urgency || 'Medium'}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-white transition-colors capitalize">{lead.name}</h3>
                <p className="text-[10px] text-[#3b82f6] font-black uppercase tracking-widest italic">{lead.projectType || 'General Inquiry'}</p>
             </div>

             <div className="space-y-4 mb-10 pb-10 border-b border-white/5">
                <div className="flex items-center gap-4 text-sm text-[#9ca3af] font-medium italic">
                   <Mail size={16} className="text-[#3b82f6] shrink-0" /> <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#9ca3af] font-medium italic">
                   <Phone size={16} className="text-[#3b82f6] shrink-0" /> {lead.phone}
                </div>
                <div className="flex items-center gap-4 text-sm text-[#9ca3af] font-medium italic">
                   <Briefcase size={16} className="text-[#3b82f6] shrink-0" /> {lead.company || 'Private Business'}
                </div>
                <div className="flex items-center gap-4 text-sm text-[#9ca3af] font-medium italic leading-relaxed">
                   <MessageSquare size={16} className="text-[#3b82f6] shrink-0" /> <span className="line-clamp-2">{lead.message}</span>
                </div>
             </div>

             <div className="flex items-center justify-between">
                <div>
                   <p className="text-[8px] text-[#6b7280] font-black uppercase tracking-widest mb-1">Capture Date</p>
                   <p className="text-xs text-white font-bold">{new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="flex gap-2">
                   <button className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-white transition-all">
                      <Trash2 size={16} />
                   </button>
                   <button className="btn-secondary h-10 px-6 text-[10px] font-black uppercase tracking-widest no-underline border-[#3b82f6]/20 text-[#3b82f6] hover:bg-[#3b82f6]/5">
                      Open Log <ArrowRight size={14} className="ml-2" />
                   </button>
                </div>
             </div>
          </motion.div>
        ))}
        
        {filteredLeads.length === 0 && (
          <div className="col-span-full py-32 text-center opacity-30 italic text-sm text-[#4b5563]">
            No leads captured in this category yet.
          </div>
        )}
      </div>

      {/* Bulk Conversion CTA */}
      <div className="p-10 glass-card bg-[#3b82f6] text-white flex flex-col md:flex-row items-center justify-between gap-10 rounded-[32px] shadow-glow-blue border-none relative overflow-hidden">
         <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[60px] rounded-full" />
         <div className="flex gap-6 items-center relative z-10">
            <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center">
               <TrendingUp size={32} />
            </div>
            <div>
               <h4 className="text-xl font-bold mb-1 uppercase tracking-widest leading-none">Ready to Scale?</h4>
               <p className="text-sm font-medium opacity-80 italic">You have {leads?.filter(l => l.status === 'qualified').length || 0} qualified prospects waiting for a proposal.</p>
            </div>
         </div>
         <button className="btn-primary h-14 bg-white text-[#3b82f6] hover:bg-white/90 font-black uppercase tracking-widest px-10 no-underline shadow-xl relative z-10">
            Start Mass Prospecting <UserPlus size={18} className="ml-2" />
         </button>
      </div>
    </div>
  );
}

function StatsBox({ label, val, color }) {
   const colors = {
      blue: 'text-[#3b82f6] bg-blue-500/10 border-blue-500/20 shadow-glow-blue/5',
      green: 'text-[#39ff14] bg-[#39ff14]/10 border-[#39ff14]/20 shadow-glow-green/5',
      cyan: 'text-[#22d3ee] bg-[#22d3ee]/10 border-[#22d3ee]/20 shadow-glow-cyan/5',
      orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-glow-orange/5'
   };
   
   return (
      <div className={`glass-card p-8 border-2 transition-transform hover:scale-105 ${colors[color]}`}>
         <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{label}</p>
         <h4 className="text-4xl font-black font-display tracking-wider leading-none text-white">{val}</h4>
      </div>
   );
}
