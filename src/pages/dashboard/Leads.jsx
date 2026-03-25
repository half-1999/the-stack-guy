import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Mail, Phone, 
  Search, Filter, MoreHorizontal, 
  Trash2, Zap, MessageSquare, 
  CheckCircle, AlertCircle, TrendingUp,
  Calendar
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { leadsAPI, aiAPI } from '../../services/api';
import toast from 'react-hot-toast';
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
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      try {
        const resp = await leadsAPI.getAll();
        return resp.data.data;
      } catch (err) {
        return [];
      }
    }
  });

  const handleAIAnalyze = async (id) => {
    setIsAnalyzing(true);
    try {
      const resp = await aiAPI.analyzeLead(id);
      setAnalysis(resp.data.data);
      toast.success('Neural Strategy Audit Complete.');
    } catch (err) {
      toast.error('AI Strategy engine failed to initialize.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => leadsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      toast.success('Lead purged from system.');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => leadsAPI.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      toast.success('Pipeline status updated.');
    }
  });

  if (!isAdmin) return <div className="p-20 text-center font-black uppercase text-white tracking-[0.3em]">Access Violation: Unauthorized Operator</div>;
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
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 font-display uppercase tracking-widest leading-tight">
            Lead <span className="gradient-text-blue">Capture</span>
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
                  className={`px-6 h-10 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${activeStatus === s ? 'bg-blue-600 text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}
                >
                   {s}
                </button>
             ))}
          </div>
          <button className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
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
            className="glass-card p-10 relative overflow-hidden group hover:translate-y-[-8px] border-2 transition-all border-white/5 bg-white/[0.01]"
          >
             {/* Lead Scoring Badge */}
             <div className="absolute top-0 right-0 p-4">
                <div className={`w-12 h-12 rounded-bl-3xl border-l-[3px] border-b-[3px] flex flex-col items-center justify-center ${lead.score > 70 ? 'border-green-500/30' : 'border-blue-500/20'}`}>
                   <span className={`text-lg font-black font-display leading-none ${lead.score > 70 ? 'text-green-500' : 'text-blue-500'}`}>{lead.score}</span>
                   <span className="text-[6px] font-black uppercase tracking-widest opacity-60">SCORE</span>
                </div>
             </div>

             <div className="mb-8">
                <div className="flex gap-2 mb-4">
                   <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-widest">{lead.source}</span>
                   <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest">{lead.urgency || 'MEDIUM'}</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 leading-tight uppercase tracking-tighter">{lead.name}</h3>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest italic">{lead.projectType || 'General Inquiry'}</p>
             </div>

             <div className="space-y-4 mb-10 pb-10 border-b border-white/5">
                <div className="flex items-center gap-4 text-xs text-gray-500 font-bold italic">
                   <Mail size={14} className="text-blue-500 shrink-0" /> <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-bold italic">
                   <Phone size={14} className="text-blue-500 shrink-0" /> {lead.phone}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-bold italic leading-relaxed">
                   <MessageSquare size={14} className="text-blue-500 shrink-0" /> <span className="line-clamp-2">{lead.requirements || lead.message}</span>
                </div>
             </div>

             <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                   <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Status</p>
                   <select 
                     value={lead.status}
                     onChange={(e) => updateStatusMutation.mutate({ id: lead._id, status: e.target.value })}
                     className="bg-transparent text-[10px] text-white font-black uppercase outline-none border-b border-white/10 pb-1 w-full"
                   >
                     {leadStatuses.map(s => <option key={s.id} value={s.id} className="bg-[#0a0a0f]">{s.label.toUpperCase()}</option>)}
                   </select>
                </div>
                
                <div className="flex gap-2 shrink-0">
                   <button 
                     title="Neural Audit"
                     disabled={isAnalyzing}
                     onClick={() => handleAIAnalyze(lead._id)}
                     className={`h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 hover:bg-blue-600/20 transition-all ${isAnalyzing ? 'animate-pulse' : ''}`}
                   >
                      <Zap size={16} />
                   </button>
                   <button 
                     onClick={() => {
                        const date = prompt('Enter meeting date (YYYY-MM-DD):');
                        const time = prompt('Enter meeting time (HH:MM):');
                        if (date && time) {
                          leadsAPI.scheduleMeeting(lead._id, { date, time }).then(() => {
                            toast.success('Meeting scheduled!');
                            queryClient.invalidateQueries(['leads']);
                          }).catch(err => toast.error('Failed to schedule meeting'));
                        }
                     }}
                     className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-green-500 transition-all"
                   >
                      <Calendar size={16} />
                   </button>
                   <button 
                     onClick={() => {
                       if(confirm('Purge this lead from memory?')) deleteMutation.mutate(lead._id);
                     }}
                     className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
             </div>
          </motion.div>
        ))}
        
        {filteredLeads.length === 0 && (
          <div className="col-span-full py-32 text-center opacity-30 font-black uppercase tracking-widest text-xs text-gray-600 italic">
            No incoming signals detected.
          </div>
        )}
      </div>

      {/* AI Analysis Modal */}
      <AnimatePresence>
         {analysis && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setAnalysis(null)}
                 className="absolute inset-0 bg-black/80 backdrop-blur-md"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-2xl glass-card border-white/10 p-10 bg-[#0a0a0f] overflow-hidden rounded-[40px]"
               >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32" />
                  
                  <div className="flex justify-between items-start mb-12 relative">
                     <div>
                        <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2 italic">Neural <span className="text-blue-500">Strategy</span> Audit</h3>
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] italic">Predictive Conversion Engine v1.0</p>
                     </div>
                     <button onClick={() => setAnalysis(null)} className="p-3 rounded-2xl bg-white/5 text-gray-500 hover:text-white transition-colors border border-white/10"><CheckCircle size={24}/></button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                     <div className="md:col-span-1 p-8 rounded-[32px] bg-blue-600/10 border border-blue-500/20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none" />
                        <p className="text-6xl font-black text-white font-display tracking-tighter relative z-10">{analysis.conversionChance}%</p>
                        <p className="text-[8px] text-blue-500 font-black uppercase tracking-[0.3em] mt-3 relative z-10">Conv. Index</p>
                     </div>
                     <div className="md:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Strategic Verticals</h4>
                        <div className="flex flex-wrap gap-2">
                           {analysis.suggestedServices?.map(s => (
                              <span key={s} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">{s}</span>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8 relative">
                     <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 relative group">
                        <div className="absolute top-4 right-8"><TrendingUp size={24} className="text-blue-500 opacity-20" /></div>
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 italic">
                           <Zap size={16} /> Strategy Intel
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed italic pr-6 whitespace-pre-line">{analysis.strategicAdvice}</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-[32px] bg-red-500/5 border border-red-500/10">
                           <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 italic">
                              <AlertCircle size={16} /> Blockers
                           </h4>
                           <ul className="space-y-3">
                              {analysis.riskFactors?.map(r => (
                                 <li key={r} className="text-[9px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-glow-red" /> {r}
                                 </li>
                              ))}
                           </ul>
                        </div>
                        <div className="p-8 rounded-[32px] bg-green-500/5 border border-green-500/10 flex items-center justify-center">
                           <button className="btn-primary w-full py-4 text-[10px] font-black uppercase tracking-widest">Execute Roadmap</button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}

function StatsBox(props) {
   const { label, val, color } = props;
   const colors = {
      blue: 'text-blue-500 bg-blue-500/5 border-blue-500/10',
      green: 'text-green-500 bg-green-500/5 border-green-500/10',
      cyan: 'text-cyan-500 bg-cyan-500/5 border-cyan-500/10',
      orange: 'text-orange-500 bg-orange-500/5 border-orange-500/10'
   };
   
   return (
      <div className={`glass-card p-8 border-2 transition-all hover:translate-y-[-5px] ${colors[color]}`}>
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3 italic">{label}</p>
         <h4 className="text-4xl font-black font-display tracking-tighter text-white uppercase">{val}</h4>
      </div>
   );
}
