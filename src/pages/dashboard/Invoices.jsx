import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, CreditCard, Download, ExternalLink, 
  Search, Filter, ChevronRight, Clock, CheckCircle, 
  AlertCircle, MoreHorizontal, FileText, IndianRupee, Printer, Settings
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { invoicesAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function Invoices() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [filterSlug, setFilterSlug] = useState('all');

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      try {
        const resp = await invoicesAPI.getAll();
        return resp.data.data;
      } catch (err) {
        // Fallback for demo
        return [
          { _id: '1', invoiceNumber: 'INV-26-001', total: 75000, status: 'paid', dueDate: new Date(), project: { title: 'OS v2 Overhaul' }, client: { name: 'Alpha Corp' } },
          { _id: '2', invoiceNumber: 'INV-26-002', total: 42000, status: 'sent', dueDate: new Date(Date.now() + 86400000 * 7), project: { title: 'AI Integration' }, client: { name: 'Beta Systems' } }
        ];
      }
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => invoicesAPI.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
    }
  });

  if (isLoading) return <LoadingScreen />;

  const filteredInvoices = invoices?.filter(inv => {
    if (filterSlug === 'all') return true;
    return inv.status === filterSlug;
  }) || [];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'paid': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'overdue': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'sent': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-[#6b7280] bg-white/5 border-white/5';
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase tracking-widest">
            Invoice <span className="gradient-text">Engine</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Track payments, GST invoices, and financial milestones.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex rounded-xl bg-white/5 border border-white/5 p-1 overflow-hidden">
             <button 
               onClick={() => setFilterSlug('all')}
               className={`px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${filterSlug === 'all' ? 'bg-[#3b82f6] text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}
             >
                All
             </button>
             <button 
               onClick={() => setFilterSlug('sent')}
               className={`px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${filterSlug === 'sent' ? 'bg-[#3b82f6] text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}
             >
                Unpaid
             </button>
             <button 
               onClick={() => setFilterSlug('paid')}
               className={`px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${filterSlug === 'paid' ? 'bg-[#3b82f6] text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}
             >
                History
             </button>
          </div>
          {isAdmin && (
            <button className="btn-primary h-12 text-xs no-underline font-black uppercase tracking-widest px-8 shadow-glow-blue/20">
              <Plus size={16} className="mr-2" /> Create Invoice
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary (Admin focus) */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="glass-card p-8 bg-gradient-to-br from-green-600/5 to-transparent border-green-500/10">
              <p className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest mb-2">Total Amount Received</p>
              <h3 className="text-4xl font-black text-[#39ff14] font-display">₹{invoices?.reduce((acc, inv) => inv.status === 'paid' ? acc + inv.total : acc, 0).toLocaleString('en-IN') || 0}</h3>
              <div className="mt-4 flex gap-2 items-center text-[8px] text-[#6b7280] font-black uppercase tracking-wider">
                 <CheckCircle size={10} className="text-green-500" /> GST Ready
                 <ChevronRight size={10} />
              </div>
           </div>
           <div className="glass-card p-8 bg-gradient-to-br from-red-600/5 to-transparent border-red-500/10">
              <p className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest mb-2">Pending Payments</p>
              <h3 className="text-4xl font-black text-red-500 font-display">₹{invoices?.reduce((acc, inv) => (inv.status === 'sent' || inv.status === 'overdue') ? acc + inv.total : acc, 0).toLocaleString('en-IN') || 0}</h3>
              <div className="mt-4 flex gap-2 items-center text-[8px] text-[#6b7280] font-black uppercase tracking-wider">
                 <Clock size={10} className="text-red-500" /> Tracking Overdue
              </div>
           </div>
           <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#9ca3af] mb-4">
                  <CreditCard size={24} />
               </div>
               <p className="text-xs text-[#9ca3af] font-bold">Standard Platform Fee: <span className="text-white">2.5%</span></p>
               <button className="mt-6 text-[10px] font-black uppercase tracking-widest text-[#3b82f6] hover:underline underline-offset-4">Change Gateway Settings</button>
           </div>
        </div>
      )}

      {/* Invoice List */}
      <div className="glass-card overflow-hidden border-2 border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0a0a11] border-b border-white/5">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Invoice ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Client / Project</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Due Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.map((inv) => (
                <tr key={inv._id} className="group hover:bg-white/2 transition-colors">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-[#3b82f6] transition-colors group-hover:bg-blue-500/10">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tighter">#{inv.invoiceNumber}</p>
                        <p className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest">GST Included</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <p className="text-sm font-bold text-white">{inv?.project?.title || "Manual Invoice"}</p>
                    <p className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest italic">{inv?.client?.name || "Private Client"}</p>
                  </td>
                  <td className="px-8 py-8 text-xl font-black text-white font-display">
                    ₹{inv.total.toLocaleString('en-IN')}
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-white font-bold">{new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      <p className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest">2026</p>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${getStatusStyle(inv.status)}`}>
                       {inv.status === 'paid' ? <CheckCircle size={12} /> : inv.status === 'overdue' ? <AlertCircle size={12} /> : <Clock size={12} />}
                       {inv.status}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-3">
                      {inv.status !== 'paid' && !isAdmin && (
                        <button className="btn-primary h-10 text-[xs] font-black uppercase px-6 no-underline shadow-glow-blue/20">PAY NOW</button>
                      )}
                      <button className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/10 transition-all">
                        <Download size={16} />
                      </button>
                      <button className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/10 transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center opacity-30 italic text-sm text-[#4b5563]">
                    No invoices match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Security / Support */}
      <div className="p-10 glass-card bg-gradient-to-r from-[#111118] to-transparent flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex gap-6 items-center">
            <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 flex items-center justify-center text-[#3b82f6] shadow-glow-blue/10 border border-blue-500/20">
               <ShieldCheck size={32} />
            </div>
            <div>
               <h4 className="text-xl font-bold text-white mb-1 uppercase tracking-widest">Secure Payments System</h4>
               <p className="text-sm text-[#9ca3af] leading-relaxed">
                 All transactions are processed through 256-bit encrypted gateways (Razorpay).<br/>GST Invoices are generated automatically upon successful payment.
               </p>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="btn-secondary h-12 text-xs no-underline font-black uppercase tracking-widest px-8">Talk to Billing</button>
            <button className="h-12 w-12 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-white transition-all"><Printer size={18} /></button>
         </div>
      </div>
    </div>
  );
}

function ShieldCheck({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
