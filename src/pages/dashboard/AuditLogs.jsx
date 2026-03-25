import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Clock, User, Info, 
  Search, Filter, ChevronLeft, ChevronRight,
  AlertTriangle, Key, Trash2, CheckCircle, Zap, RefreshCw
} from 'lucide-react';
import { auditAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';

const logIcons = {
  'admin-login': <Key className="text-blue-500" size={18} />,
  'lead-deleted': <Trash2 className="text-red-500" size={18} />,
  'project-deleted': <Trash2 className="text-red-500" size={18} />,
  'settings-updated': <RefreshCw className="text-cyan-500" size={18} />,
  'milestone-added': <CheckCircle className="text-green-500" size={18} />,
  'roadmap-generated': <Zap className="text-yellow-500" size={18} />,
  'crm-sync': <RefreshCw className="text-blue-500" size={18} />
};

export default function AuditLogs() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('all');

  const { data: resp, isLoading } = useQuery({
    queryKey: ['audit-logs', page, type],
    queryFn: () => auditAPI.getLogs({ page, type }),
    keepPreviousData: true
  });

  if (isLoading) return <LoadingScreen />;

  const logs = resp?.data?.data || [];
  const pagination = resp?.data?.pagination || { total: 0, pages: 1 };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 font-display uppercase tracking-widest leading-tight">
            System <span className="gradient-text-blue">Audit</span> Logs
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Immutable security trail for all high-tier administrative operations.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white font-black uppercase outline-none focus:border-blue-500/50"
          >
            <option value="all">ALL PROTOCOLS</option>
            <option value="admin-login">Logins</option>
            <option value="lead-deleted">Deletions</option>
            <option value="crm-sync">Sync Actions</option>
            <option value="settings-updated">Config Changes</option>
          </select>
        </div>
      </div>

      <div className="glass-card-premium overflow-hidden border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Operator</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Event Description</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Metadata</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      {logIcons[log.type] || <Info size={16} className="text-gray-500" />}
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{log.type}</span>
                  </div>
                </td>
                <td className="p-6">
                   <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-300 uppercase">{log.userId?.name || 'SYSTEM'}</span>
                      <span className="text-[8px] text-gray-600 font-bold italic">{log.userId?.role?.toUpperCase()}</span>
                   </div>
                </td>
                <td className="p-6">
                   <div className="flex flex-col gap-1">
                      <span className="text-xs text-white font-bold">{log.title}</span>
                      <span className="text-[10px] text-gray-500 italic">{log.description}</span>
                   </div>
                </td>
                <td className="p-6">
                   <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[8px] font-black">IP: {log.ip}</span>
                      <button 
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all"
                        onClick={() => alert(JSON.stringify(log.metadata, null, 2))}
                      >
                         <Info size={12} />
                      </button>
                   </div>
                </td>
                <td className="p-6">
                   <div className="flex items-center gap-2 text-gray-500">
                      <Clock size={12} />
                      <span className="text-[10px] font-black">{new Date(log.createdAt).toLocaleString()}</span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {logs.length === 0 && (
          <div className="py-20 text-center text-gray-600 italic uppercase font-black text-[10px] tracking-widest">
             No security records found in current timeline.
          </div>
        )}
      </div>

      <div className="flex justify-between items-center bg-white/[0.01] p-6 rounded-[32px] border border-white/5">
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">
          Total Records: {pagination.total} signals detected
        </p>
        <div className="flex gap-4">
           <button 
             disabled={page === 1}
             onClick={() => setPage(p => p - 1)}
             className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 disabled:opacity-30"
           >
              <ChevronLeft size={18} />
           </button>
           <button 
             disabled={page === pagination.pages}
             onClick={() => setPage(p => p + 1)}
             className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 disabled:opacity-30"
           >
              <ChevronRight size={18} />
           </button>
        </div>
      </div>
    </div>
  );
}
