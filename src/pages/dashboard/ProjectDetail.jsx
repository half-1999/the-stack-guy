import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, ExternalLink, TrendingUp, 
  Calendar, Zap, Rocket, Clock, Plus, 
  Trash2, AlertCircle, X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { projectsAPI, aiAPI } from '../../services/api';
import { useAuthStore } from '../../store';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user, token } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', dueDate: '' });
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  const { data: resp, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsAPI.getOne(id),
  });

  const project = resp?.data?.data;

  useEffect(() => {
    if (!token || !id) return;
    const socket = io(window.location.origin, { auth: { token } });
    
    socket.emit('join-project', id);
    socket.on('project-updated', (updatedProject) => {
      queryClient.setQueryData(['project', id], { data: { data: updatedProject } });
    });

    return () => socket.disconnect();
  }, [id, token, queryClient]);

  const addMilestoneMutation = useMutation({
    mutationFn: (data) => projectsAPI.addMilestone(id, data),
    onSuccess: () => {
      setIsMilestoneModalOpen(false);
      setNewMilestone({ title: '', description: '', dueDate: '' });
      queryClient.invalidateQueries(['project', id]);
      toast.success('Sprint milestone initialized.');
    }
  });

  const updateMilestoneMutation = useMutation({
    mutationFn: ({ milestoneId, data }) => projectsAPI.updateMilestone(id, milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id]);
      toast.success('Milestone synchronized.');
    }
  });

  const deleteMilestoneMutation = useMutation({
    mutationFn: (milestoneId) => projectsAPI.deleteMilestone(id, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id]);
      toast.error('Milestone purged.');
    }
  });

  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    const toastId = toast.loading('Architecting Neural Roadmap...');
    try {
      const roadmapResp = await aiAPI.generateRoadmap(id);
      const { milestones } = roadmapResp.data.data;
      
      toast.loading(`Synchronizing ${milestones.length} neural sprints...`, { id: toastId });
      
      // Sequential addition to maintain order
      for (const m of milestones) {
        await projectsAPI.addMilestone(id, m);
      }
      
      queryClient.invalidateQueries(['project', id]);
      toast.success('Neural Roadmap synchronized successfully.', { id: toastId });
    } catch (err) {
      toast.error('AI Strategy engine failed to compute roadmap.', { id: toastId });
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (!project) return <div className="p-20 text-center text-white font-black uppercase">Project Nullified</div>;

  return (
    <div className="space-y-12 pb-32">
      {/* OS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-widest">
              SYSTEM ID: {project._id.slice(-6)}
            </span>
            <span className={`px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest ${project.priority === 'urgent' ? 'text-red-500' : 'text-gray-400'}`}>
              PRIORITY: {project.priority}
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none font-display">
            {project.title}
          </h1>
          <p className="text-lg text-gray-400 italic font-medium leading-relaxed mb-4">
            {project.description}
          </p>
        </motion.div>

        <div className="flex gap-4">
          <button className="btn-primary flex items-center gap-2">
            <ExternalLink size={18} /> Deploy Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Neural Sprint Timeline */}
          <section className="glass-card-premium p-10 border-white/5 bg-white/[0.01]">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-4 italic">
                <Rocket size={24} className="text-blue-500" /> Sprint Timeline
              </h3>
              <div className="flex gap-4">
                {isAdmin && (
                  <>
                    <button 
                      onClick={handleGenerateRoadmap}
                      disabled={isGeneratingRoadmap}
                      className={`px-4 py-2 rounded-xl bg-blue-600/10 text-blue-500 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600/20 transition-all ${isGeneratingRoadmap ? 'animate-pulse' : ''}`}
                    >
                      <Zap size={14} /> Neural Roadmap
                    </button>
                    <button 
                      onClick={() => setIsMilestoneModalOpen(true)}
                      className="p-2 rounded-xl bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="relative space-y-8 pl-8 border-l-2 border-white/5 ml-4">
              {project.milestones?.map((m, i) => (
                <div key={m._id} className="relative">
                  <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-[#0a0a0f] z-10 
                    ${m.status === 'completed' ? 'bg-green-500 shadow-glow-green' : 
                      m.status === 'in-progress' ? 'bg-blue-500 shadow-glow-blue' : 'bg-white/10'}`} 
                  />
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className={`text-lg font-black uppercase tracking-widest ${m.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
                          {m.title}
                        </h4>
                        {m.status === 'completed' && <CheckCircle size={16} className="text-green-500" />}
                      </div>
                      <p className="text-xs text-gray-500 italic mb-4">{m.description}</p>
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                           <Calendar size={12} /> {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : 'NO DEADLINE'}
                         </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {m.status !== 'completed' && (
                          <button 
                            onClick={() => updateMilestoneMutation.mutate({ milestoneId: m._id, data: { status: 'completed' } })}
                            className="p-2 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteMilestoneMutation.mutate(m._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {(!project.milestones || project.milestones.length === 0) && (
                <div className="py-10 text-center text-gray-600 italic">No developmental sprints initialized.</div>
              )}
            </div>
          </section>

          {/* Technical Specs & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="glass-card p-8 border-white/5 bg-white/[0.01]">
              <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6 italic">Engineering Notes</h4>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                {project.notes || "Awaiting architectural input from the engineering lead."}
              </p>
            </section>
            <section className="glass-card p-8 border-white/5 bg-white/[0.01]">
              <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6 italic">Core Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map(tech => (
                  <span key={tech} className="px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    {tech}
                  </span>
                )) || <span className="text-gray-700 italic text-xs">Awaiting stack selection.</span>}
              </div>
            </section>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-10">
          {/* Status HUD */}
          <div className="glass-card-premium p-10 bg-white/[0.01] border-white/5 rounded-[40px]">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-8 italic">Project Pulse</h3>
            
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-white font-display tracking-tighter">{project.progress}%</p>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Signal Coverage</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                  <TrendingUp size={28} />
                </div>
              </div>

              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-glow-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                 <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-white font-black">{project.status.toUpperCase()}</p>
                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">CURRENT PHASE</p>
                 </div>
                 <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-white font-black">₹{project.amountPaid.toLocaleString()}</p>
                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">FUNDS COMMITTED</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Client Identity */}
          <div className="glass-card p-10 bg-gradient-to-br from-blue-600/5 to-transparent border-blue-500/10">
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-8 italic">Partner Identity</h4>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-black shadow-glow-blue/20">
                {project.clientId.avatar ? <img src={project.clientId.avatar} className="w-full h-full object-cover rounded-3xl" /> : project.clientId.name[0]}
              </div>
              <div>
                <p className="text-xl font-black text-white uppercase tracking-widest">{project.clientId.name}</p>
                <p className="text-[10px] text-gray-600 font-black uppercase italic">{project.clientId.company}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Milestone Modal */}
      <AnimatePresence>
        {isMilestoneModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMilestoneModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl glass-card border-white/10 p-10 bg-[#0a0a0f]"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Initialize <span className="text-blue-500">Sprint</span></h3>
                <button onClick={() => setIsMilestoneModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24}/></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 block">Milestone Title</label>
                  <input 
                    type="text"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                    placeholder="e.g., Schema Architecture"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 block">Strategic Description</label>
                  <textarea 
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                    placeholder="Briefly define the tactical objective..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 block">Target Deadline</label>
                  <input 
                    type="date"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone({...newMilestone, dueDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                  />
                </div>

                <div className="pt-6">
                    <button 
                      onClick={() => addMilestoneMutation.mutate(newMilestone)}
                      disabled={!newMilestone.title || addMilestoneMutation.isPending}
                      className="w-full btn-primary py-5 rounded-[24px] flex items-center justify-center gap-3 text-sm"
                    >
                      {addMilestoneMutation.isPending ? 'SYNCHRONIZING...' : <>Broadcast Milestone <Send size={20}/></>}
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Send({ size }) {
    return <Rocket size={size} />;
}
