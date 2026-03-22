import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSignature, CheckCircle, Clock, Trash2, 
  Settings, MessageSquare, CreditCard, 
  Rocket, Zap, Filter, MoreVertical, 
  CheckCheck, AlertCircle, TrendingUp, Send, 
  ArrowRight, User, Eye, Download, ShieldCheck
} from 'lucide-react';
import { proposalsAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { useAuthStore } from '../../store';

export default function Proposals() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: list, isLoading } = useQuery({
    queryKey: ['proposals-list'],
    queryFn: async () => {
      try {
        const resp = await proposalsAPI.getAll();
        return resp.data.data;
      } catch (err) {
        // Fallback for demo
        return [
          { _id: '1', proposalNumber: 'PR-2026-001', title: 'Next-Gen Frontend Overhaul', total: 45000, status: 'sent', createdAt: new Date() },
          { _id: '2', proposalNumber: 'PR-2026-002', title: 'AI Content Engine Integration', total: 32000, status: 'signed', createdAt: new Date() }
        ];
      }
    }
  });

  if (isLoading) return <LoadingScreen />;

  const filteredList = list?.filter(prop => {
    if (filter === 'all') return true;
    return prop.status === filter;
  }) || [];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase tracking-widest leading-tight">
            Proposal <span className="gradient-text">Forge</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Review, sign, and launch your next high-performance business asset.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex rounded-xl bg-white/5 border border-white/5 p-1 overflow-hidden">
             {['all', 'sent', 'signed'].map((s) => (
                <button 
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-6 h-10 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${filter === s ? 'bg-[#3b82f6] text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}
                >
                   {s}
                </button>
             ))}
          </div>
          {isAdmin && (
            <button className="btn-primary h-12 text-xs no-underline font-black uppercase tracking-widest px-8 shadow-glow-blue/20">
               <Send size={16} className="mr-2" /> New Proposal
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary (Admin focus) */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="glass-card p-8 bg-gradient-to-br from-[#3b82f6]/5 to-transparent border-blue-500/10">
              <p className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest mb-2">Proposals Sent</p>
              <h3 className="text-4xl font-black text-white font-display leading-none">{list?.filter(p => p.status === 'sent').length || 0}</h3>
              <div className="mt-4 flex gap-2 items-center text-[8px] text-[#6b7280] font-black uppercase tracking-wider">
                 <Clock size={10} className="text-blue-500" /> Pending Approval
              </div>
           </div>
           <div className="glass-card p-8 bg-gradient-to-br from-[#39ff14]/5 to-transparent border-[#39ff14]/10 border-2">
              <p className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest mb-2">Signed Contracts</p>
              <h3 className="text-4xl font-black text-[#39ff14] font-display leading-none">{list?.filter(p => p.status === 'signed').length || 0}</h3>
              <div className="mt-4 flex gap-2 items-center text-[8px] text-[#6b7280] font-black uppercase tracking-wider">
                 <CheckCircle size={10} className="text-[#39ff14]" /> Automated Signatures
              </div>
           </div>
           <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#9ca3af] mb-4">
                  <FileSignature size={24} />
               </div>
               <p className="text-xs text-[#9ca3af] font-bold">Conversion Rate: <span className="text-white">82%</span></p>
               <button className="mt-6 text-[10px] font-black uppercase tracking-widest text-[#3b82f6] hover:underline underline-offset-4">Optimize Templates</button>
           </div>
        </div>
      )}

      {/* List of Proposals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {filteredList.map((prop) => (
           <motion.div 
             key={prop._id}
             layout
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className={`glass-card p-10 relative overflow-hidden group hover:border-blue-500/20 border-2 transition-all border-white/5 ${prop.status === 'signed' ? 'bg-[#39ff14]/2 border-[#39ff14]/10' : 'bg-gradient-to-br from-[#111118] to-transparent'}`}
           >
              <div className="flex justify-between items-start mb-10">
                 <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 ${prop.status === 'signed' ? 'bg-[#39ff14]/10 text-[#39ff14] shadow-glow-green/10' : 'bg-blue-600/10 text-[#3b82f6] shadow-glow-blue/10'}`}>
                       <FileSignature size={24} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold text-white font-display uppercase tracking-widest group-hover:text-blue-500 transition-colors leading-tight mb-2">#{prop.proposalNumber}</h3>
                       <p className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest italic">{prop.title}</p>
                    </div>
                 </div>
                 <div className={`px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${prop.status === 'signed' ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-blue-500 bg-blue-500/10 border-blue-500/20'}`}>
                    {prop.status === 'signed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                    {prop.status}
                 </div>
              </div>

              <div className="space-y-6 mb-12">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6b7280] font-bold uppercase tracking-widest text-[10px]">Estimated Budget</span>
                    <span className="text-white font-black text-xl">₹{prop.total?.toLocaleString('en-IN')}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6b7280] font-bold uppercase tracking-widest text-[10px]">Project Deadline</span>
                    <span className="text-white font-bold">{new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 60).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                 </div>
                 <div className="flex flex-wrap gap-2 pt-4">
                    {['SaaS Development', 'SEO Optimization', 'Cloud Hosting'].map(tag => (
                       <span key={tag} className="px-3 py-1 rounded bg-white/2 border border-white/5 text-[8px] font-black uppercase tracking-tighter text-[#4b5563]">{tag}</span>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                 <button className="btn-primary w-full h-14 text-sm font-black uppercase tracking-widest justify-center shadow-glow-blue/10">
                    {prop.status === 'signed' ? 'VIEW CONTRACT' : 'SIGN PROPOSAL'} <ArrowRight size={18} className="ml-2" />
                 </button>
                 <div className="flex gap-4">
                    <button className="flex-1 h-12 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                       <Download size={14} className="mr-2" /> PDF Copy
                    </button>
                    <button className="h-12 w-12 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-white transition-all">
                       <MessageSquare size={18} />
                    </button>
                 </div>
              </div>
              
              {/* Trust Footer */}
              <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-3 text-[#6b7280] text-[8px] font-black uppercase tracking-widest opacity-40">
                 <ShieldCheck size={12} /> Legal Binding Agreement via THE STACK OS
              </div>
           </motion.div>
         ))}
         
         {filteredList.length === 0 && (
           <div className="col-span-full py-32 text-center glass-card border-dashed">
              <FileSignature size={48} className="text-white/5 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-white mb-2 italic">No proposals found</h3>
              <p className="text-[#4b5563] text-sm font-medium italic leading-relaxed">Select a different category or wait for the engineering team to draft your roadmap.</p>
           </div>
         )}
      </div>

      {/* Featured Insight */}
      <div className="p-10 glass-card bg-gradient-to-r from-[#39ff14]/5 to-transparent border-[#39ff14]/10 flex flex-col md:flex-row items-center justify-between gap-10 rounded-[32px] mt-20 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#39ff14]/10 blur-[100px] opacity-30 rounded-full" />
         <div className="flex gap-8 items-center relative z-10">
            <div className="w-16 h-16 rounded-[24px] bg-[#39ff14]/10 flex items-center justify-center text-[#39ff14] border border-[#39ff14]/20 shadow-glow-green/10">
               <Zap size={32} />
            </div>
            <div>
               <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-widest leading-none">Automated Proposal Engine</h4>
               <p className="text-sm font-medium text-[#9ca3af] italic max-w-md">
                 Our system uses previous project metrics and your specific requirements to generate high-conversion roadmaps.
               </p>
            </div>
         </div>
         <button className="btn-secondary h-12 text-[10px] no-underline font-black uppercase tracking-widest px-8 border-[#39ff14]/20 text-[#39ff14]">Configure Templates</button>
      </div>
    </div>
  );
}
