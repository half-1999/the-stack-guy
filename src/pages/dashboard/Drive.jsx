import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store';
import { projectsAPI, vaultAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { useState } from 'react';
import { ExternalLink, Grid, List, Search, Shield, Upload } from 'lucide-react';

export default function Drive() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [view, setView] = useState('grid');
  const [selectedProject, setSelectedProject] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects-vault'],
    queryFn: async () => {
      const res = await projectsAPI.getAll({ limit: 100 });
      return res.data.data;
    }
  });

  const deleteFileMutation = useMutation({
    mutationFn: ({ projectId, fileId }) => vaultAPI.deleteFile(projectId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects-vault']);
      toast.success('File removed from vault');
    }
  });

  if (isLoading) return <LoadingScreen />;

  // Flatten all files across projects or filter by selected
  const allFiles = projects?.reduce((acc, p) => {
    if (selectedProject !== 'all' && p._id !== selectedProject) return acc;
    const projectFiles = p.files.map(f => ({ ...f, projectId: p._id, projectName: p.title }));
    return [...acc, ...projectFiles];
  }, []) || [];

  const filteredFiles = allFiles.filter(f => {
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
    // Clients only see files with visibility 'client'
    if (!isAdmin && f.visibility !== 'client') return false;
    return true;
  });

  const handleUpload = () => {
    if (selectedProject === 'all') return toast.error('Select a specific project first');
    const name = prompt('File Name:');
    const url = prompt('Cloudinary/File URL:');
    const category = prompt('Category (assets/documents/source-code/invoices):', 'documents');
    
    if (name && url) {
      setIsUploading(true);
      vaultAPI.addFile(selectedProject, { name, url, category, type: 'link', size: 0 }).then(() => {
        toast.success('File added to vault!');
        queryClient.invalidateQueries(['projects-vault']);
      }).finally(() => setIsUploading(false));
    }
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
            <h3 className="text-3xl font-black text-white font-display uppercase tracking-tighter mb-4">{Math.round(allFiles.reduce((acc, f) => acc + (f.size || 0), 0) / 1024 / 1024) || 0} <span className="text-lg text-gray-500">MB</span></h3>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 w-[15%] shadow-glow-blue" />
            </div>
            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-4">Standard Encryption Active</p>
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
               <select 
                 value={selectedProject}
                 onChange={(e) => setSelectedProject(e.target.value)}
                 className="bg-white/5 border border-white/5 rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none"
               >
                 <option value="all" className="bg-[#111]">All Projects</option>
                 {projects?.map(p => <option key={p._id} value={p._id} className="bg-[#111]">{p.title}</option>)}
               </select>
               <select 
                 value={categoryFilter}
                 onChange={(e) => setCategoryFilter(e.target.value)}
                 className="bg-white/5 border border-white/5 rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none"
               >
                 <option value="all" className="bg-[#111]">Category</option>
                 {['assets', 'documents', 'source-code', 'invoices', 'other'].map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
               </select>
            </div>
         </div>

         {view === 'grid' ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
               {filteredFiles.map(file => (
                <motion.div 
                  key={file._id}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] group transition-all"
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        file.name?.endsWith('.pdf') ? 'bg-red-500/10 text-red-500' :
                        file.category === 'assets' ? 'bg-cyan-500/10 text-cyan-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                         {file.name?.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? <ImageIcon size={20} /> : <FileText size={20} />}
                      </div>
                      <button className="text-gray-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><MoreVertical size={16} /></button>
                   </div>
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1 truncate">{file.name}</h4>
                   <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em]">{file.category} • {file.projectName}</p>
                   
                   <div className="flex gap-2 mt-6 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500/20 transition-all"
                      >
                        <Download size={14} />
                      </a>
                      {isAdmin && (
                        <button 
                          onClick={() => {
                            if (confirm('Delete this file?')) deleteFileMutation.mutate({ projectId: file.projectId, fileId: file._id });
                          }}
                          className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                   </div>
                </motion.div>
              ))}
           </div>
         ) : (
           <div className="space-y-4">
               {filteredFiles.map(file => (
                <div key={file._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                   <div className="flex items-center gap-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                         <File size={18} />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-white uppercase tracking-widest">{file.name}</h4>
                         <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">{file.category} • {file.projectName} • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{Math.round(file.size / 1024 / 1024) || 0} MB</span>
                      <div className="flex gap-2">
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-white transition-all"
                        >
                          <Download size={16} />
                        </a>
                        {isAdmin && (
                          <button 
                            onClick={() => {
                              if (confirm('Delete this file?')) deleteFileMutation.mutate({ projectId: file.projectId, fileId: file._id });
                            }}
                            className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
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
