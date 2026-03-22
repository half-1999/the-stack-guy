import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  File, FileText, Image as ImageIcon, 
  Download, Trash2, Upload, Search, 
  MoreVertical, Filter, Folder, Layout, 
  Grid, List, CheckCircle, ExternalLink, Shield, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Drive() {
  const [view, setView] = useState('grid');
  const [isUploading, setIsUploading] = useState(false);

  const mockFiles = [
    { id: 1, name: 'Brand_Guidelines_v2.pdf', size: '4.2 MB', type: 'pdf', date: '2026-03-20', category: 'Assets' },
    { id: 2, name: 'Landing_Mockup_Final.fig', size: '12.8 MB', type: 'figma', date: '2026-03-18', category: 'Design' },
    { id: 3, name: 'Contract_Signed_Alpha.pdf', size: '1.5 MB', type: 'pdf', date: '2026-03-15', category: 'Legal' },
    { id: 4, name: 'Logo_Pack_Dark.zip', size: '24.1 MB', type: 'zip', date: '2026-03-10', category: 'Assets' },
    { id: 5, name: 'Database_Schema.png', size: '0.8 MB', type: 'image', date: '2026-03-21', category: 'Dev' },
    { id: 6, name: 'Sprint_Report_Q1.xlsx', size: '2.4 MB', type: 'excel', date: '2026-03-22', category: 'Reports' }
  ];

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Files uploaded successfully to the OS Vault!');
    }, 2000);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 font-display uppercase tracking-tight leading-none">
            Digital <span className="gradient-text-blue">Vault</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium italic">
            Secure, high-speed file handling for your business assets.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex rounded-xl bg-white/5 border border-white/5 p-1 overflow-hidden">
             <button onClick={() => setView('grid')} className={`p-3 rounded-lg transition-all ${view === 'grid' ? 'bg-[#3b82f6] text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}>
                <Grid size={16} />
             </button>
             <button onClick={() => setView('list')} className={`p-3 rounded-lg transition-all ${view === 'list' ? 'bg-[#3b82f6] text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}>
                <List size={16} />
             </button>
          </div>
          <button onClick={handleUpload} className="btn-primary h-12 text-xs no-underline font-black uppercase tracking-widest px-8 shadow-glow-blue/20">
             {isUploading ? <span className="animate-pulse">Vaulting...</span> : <><Upload size={16} className="mr-2" /> Upload Assets</>}
          </button>
        </div>
      </div>

      {/* Storage HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-card p-8 border-white/5 bg-gradient-to-br from-blue-600/5 to-transparent relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
               <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Total Used</p>
               <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Shield size={16} />
               </div>
            </div>
            <h3 className="text-3xl font-black text-white font-display uppercase tracking-tighter mb-4">42.8 <span className="text-lg text-gray-500">GB</span></h3>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 w-[42%] shadow-glow-blue" />
            </div>
            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-4">Standard Encryption Active</ p>
         </div>
         <div className="glass-card p-8 border-white/5 bg-white/[0.01]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] mb-8">Asset Breakdown</p>
            <div className="flex gap-2 h-2 rounded-full overflow-hidden">
               <div className="bg-blue-500 w-[50%]" />
               <div className="bg-purple-500 w-[20%]" />
               <div className="bg-cyan-500 w-[15%]" />
               <div className="bg-white/5 w-[15%]" />
            </div>
            <div className="flex gap-4 mt-6">
               <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-gray-500"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> PDF</div>
               <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-gray-500"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Design</div>
               <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-gray-500"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Web</div>
            </div>
         </div>
         <div className="glass-card p-8 border-white/5 flex flex-col items-center justify-center text-center group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 mb-4 group-hover:scale-110 transition-transform">
               <ExternalLink size={20} />
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Backup Sync</h4>
            <p className="text-[10px] text-gray-600 italic">Sync your OS Vault with S3 or Dropbox.</p>
         </div>
      </div>

      {/* File Explorer */}
      <div className="glass-card p-10 border-white/5 bg-white/[0.01]">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="relative w-full md:w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
               <input 
                 type="text" 
                 placeholder="Search Vault..."
                 className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold tracking-widest uppercase"
               />
            </div>
            <div className="flex gap-4">
               <button className="btn-os flex items-center gap-2 h-12 text-[10px] px-6"><Filter size={14} /> Category</button>
               <button className="btn-os flex items-center gap-2 h-12 text-[10px] px-6"><Clock size={14} /> Newest First</button>
            </div>
         </div>

         {view === 'grid' ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {mockFiles.map(file => (
                <motion.div 
                  key={file.id}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] group transition-all"
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        file.type === 'pdf' ? 'bg-red-500/10 text-red-500' :
                        file.type === 'figma' ? 'bg-purple-500/10 text-purple-500' :
                        file.type === 'image' ? 'bg-cyan-500/10 text-cyan-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                         {file.type === 'image' ? <ImageIcon size={20} /> : <FileText size={20} />}
                      </div>
                      <button className="text-gray-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><MoreVertical size={16} /></button>
                   </div>
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1 truncate">{file.name}</h4>
                   <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em]">{file.size} • {file.category}</p>
                   
                   <div className="flex gap-2 mt-6 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="flex-1 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500/20 transition-all"><Download size={14} /></button>
                      <button className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all"><Trash2 size={14} /></button>
                   </div>
                </motion.div>
              ))}
           </div>
         ) : (
           <div className="space-y-4">
              {mockFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                   <div className="flex items-center gap-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                         <File size={18} />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-white uppercase tracking-widest">{file.name}</h4>
                         <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">{file.category} • {file.date}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{file.size}</span>
                      <div className="flex gap-2">
                        <button className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-white transition-all"><Download size={16} /></button>
                        <button className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
         )}
      </div>

      {/* Cloud Integration */}
      <div className="p-12 glass-card-premium bg-gradient-to-r from-blue-600/10 to-transparent border-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-10 rounded-[32px] overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
         <div className="flex gap-8 items-center relative z-10 max-w-2xl text-center md:text-left">
            <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-[#3b82f6] shadow-glow-blue/10 border border-white/10 shrink-0 mx-auto md:mx-0">
               <Upload size={32} className="animate-bounce" />
            </div>
            <div>
               <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-widest leading-none">Drop Anywhere</h4>
               <p className="text-sm font-medium text-[#9ca3af] italic leading-relaxed">
                 The OS Vault supports drag-and-drop from your OS or directly from external URLs. Max file size: 2GB per asset.
               </p>
            </div>
         </div>
         <button className="btn-primary h-14 bg-white text-black font-black uppercase tracking-widest px-10 no-underline shadow-glow-white/20 relative z-10 shrink-0">Initialize Sync</button>
      </div>
    </div>
  );
}
