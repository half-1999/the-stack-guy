import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, FolderKanban, Clock, CheckCircle, 
  MoreHorizontal, Play, Pause, ExternalLink, 
  MessageSquare, Paperclip, Star, ArrowRight, X, Layout, LayoutPanelLeft, ListFilter
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { projectsAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { Link } from 'react-router-dom';

const kanbanColumns = [
  { id: 'todo', label: 'To Do', color: 'text-[#6b7280]' },
  { id: 'in-progress', label: 'In Progress', color: 'text-blue-500' },
  { id: 'review', label: 'In Review', color: 'text-orange-500' },
  { id: 'completed', label: 'Completed', color: 'text-[#39ff14]' }
];

export default function Projects() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'kanban'

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const resp = await projectsAPI.getAll();
        return resp.data.data;
      } catch (err) {
        // Fallback to static data
        const { projects: mockProjects } = await import('../../services/mockData');
        return mockProjects;
      }
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => projectsAPI.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    }
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase tracking-widest">
            Projects <span className="gradient-text">Hub</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Manage your active development cycles and milestones.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex rounded-xl bg-white/5 border border-white/5 p-1 overflow-hidden">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#3b82f6] text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}
             >
                <LayoutPanelLeft size={16} />
             </button>
             <button 
               onClick={() => setViewMode('kanban')}
               className={`p-3 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-[#3b82f6] text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}
             >
                <FolderKanban size={16} />
             </button>
          </div>
          {isAdmin && (
            <button className="btn-primary h-12 text-xs no-underline font-black uppercase tracking-widest px-8 shadow-glow-blue/20">
              <Plus size={16} className="mr-2" /> New Project
            </button>
          )}
        </div>
      </div>

      {/* Kanban View (Admin focused) */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {kanbanColumns.map((col) => (
            <div key={col.id} className="space-y-6">
              <div className="flex items-center justify-between px-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black uppercase tracking-widest ${col.color}`}>{col.label}</span>
                  <span className="w-5 h-5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-[#6b7280]">
                    {projects?.filter(p => p.status === col.id).length || 0}
                  </span>
                </div>
                <button className="text-[#4b5563] hover:text-white transition-colors"><MoreHorizontal size={14} /></button>
              </div>
              
              <div className="space-y-4">
                {projects?.filter(p => p.status === col.id).map((project) => (
                  <ProjectCard key={project._id} project={project} compact={true} />
                ))}
                {projects?.filter(p => p.status === col.id).length === 0 && (
                  <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center opacity-30">
                    <Clock size={24} className="text-[#4b5563] mb-4" />
                    <p className="text-[10px] uppercase font-black tracking-widest text-[#4b5563]">No Projects</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid View (Client/Admin alternative) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects?.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
          {projects?.length === 0 && (
            <div className="col-span-full py-24 text-center glass-card border-dashed">
              <FolderKanban size={48} className="text-white/5 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">No active projects</h3>
              <p className="text-[#4b5563]">Start your first project or wait for the administrator to assign you one.</p>
              <button className="btn-secondary mt-10 h-10 px-10 text-xs no-underline justify-center">Create First Project</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, compact = false }) {
  const isAdmin = useAuthStore(s => s.user?.role === 'admin');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card overflow-hidden group border-white/5 border-2 hover:border-[#3b82f6]/20 transition-all ${compact ? 'p-6' : 'p-10'}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 items-center mb-2">
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
              project.priority === 'high' ? 'text-red-500 border-red-500/20' : 
              project.priority === 'medium' ? 'text-blue-500 border-blue-500/20' : 'text-[#6b7280] border-white/5'
            }`}>
              {project.priority} priority
            </span>
            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/2 text-[#6b7280]">{project.category}</span>
          </div>
          <Link to={`/dashboard/projects/${project._id}`} className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-white truncate hover:text-[#3b82f6] transition-colors block no-underline`}>
            {project.title}
          </Link>
        </div>
        <button className="w-8 h-8 rounded-lg bg-white/2 flex items-center justify-center text-[#4b5563] hover:text-white hover:bg-white/5">
          <MoreHorizontal size={14} />
        </button>
      </div>

      {!compact && <p className="text-sm text-[#9ca3af] mb-10 leading-relaxed italic line-clamp-2">{project.description}</p>}

      {/* Progress Section */}
      <div className="mb-10 space-y-3">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-[#6b7280]">Progress: <span className="text-white">{project.progress}%</span></span>
          <span className="text-[#3b82f6] flex items-center gap-1">
            <Clock size={12} /> Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'TBD'}
          </span>
        </div>
        <div className="progress-bar h-2">
          <div className="progress-fill shadow-glow-blue" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/5">
        <div className="flex -space-x-3 items-center">
          <img src="https://i.pravatar.cc/150?u=proj1" className="w-8 h-8 rounded-full border-2 border-[#0a0a11]" />
          <img src="https://i.pravatar.cc/150?u=proj2" className="w-8 h-8 rounded-full border-2 border-[#0a0a11]" />
          <div className="w-8 h-8 rounded-full bg-[#1e1e2a] border-2 border-[#0a0a11] flex items-center justify-center text-[8px] font-black text-[#6b7280]">
            +2
          </div>
        </div>

        <div className="flex gap-3">
          <button className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/5 transition-all">
             <MessageSquare size={16} />
          </button>
          {!compact && (
            <Link 
              to={`/dashboard/projects/${project._id}`} 
              className="btn-secondary h-10 text-[xs] no-underline font-black uppercase tracking-widest px-6 flex items-center gap-2 group-hover:border-[#3b82f6]/40 text-[#3b82f6]"
            >
              Open Dashboard <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
