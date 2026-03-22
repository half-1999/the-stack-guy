import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Database, Search, MoreHorizontal,
  Trash2, Edit, ExternalLink, Eye,
  CheckCircle, Clock, AlertCircle, ArrowRight, Share2,
  Filter, Image as ImageIcon, Tag, Hash, Globe, Settings, Layout, Code, TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { portfolioAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminPortfolio() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: async () => {
      try {
        const resp = await portfolioAPI.getAll();
        return resp.data.data;
      } catch (err) {
        // Fallback to mock items for demo
        return [
          { _id: '1', title: 'Fintech OS Dashboard', category: 'SaaS', description: 'Deep performance optimization for high-frequency trading assets.', technologies: ['Next.js', 'WebSockets', 'Rust'], image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', link: '#' },
          { _id: '2', title: 'E-commerce Engine v2', category: 'Web Design', description: 'Ultra-fast headless commerce prototype for luxury fashion.', technologies: ['React', 'Shopify', 'Three.js'], image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', link: '#' }
        ];
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: () => portfolioAPI.create({ title: `New Project Setup ${Math.floor(Math.random() * 1000)}`, industry: 'technology' }),
    onSuccess: (res) => {
      if (res?.data?._id) navigate(`/dashboard/portfolio/${res.data._id}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => portfolioAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-portfolio']);
      toast.success('Project Deleted');
    }
  });

  const handleShare = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/portfolio/${slug}`);
    toast.success('Link copied to clipboard');
  };

  const filteredItems = filter === 'all' ? items : items?.filter(item => item.industry === filter.toLowerCase() || item.category === filter);

  if (!isAdmin) return <div className="p-20 text-center">Unauthorized.</div>;
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 w-full">

        {/* LEFT */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase leading-tight">
            Work <span className="gradient-text">Showcase</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Manage your high-performance project case studies and stats.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:justify-end">

          {/* FILTER */}
          <div className="flex rounded-xl bg-white/5 border border-white/5 p-1 overflow-hidden">
            {['all', 'Web Design', 'SaaS', 'Mobile'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-6 h-10 rounded-lg transition-all text-[10px] font-black uppercase ${filter === s
                    ? 'bg-[#3b82f6] text-white shadow-glow-blue/20'
                    : 'text-[#6b7280] hover:text-white'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* BUTTON */}
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isLoading}
            className="flex items-center justify-center btn-primary h-12 text-xs font-black uppercase px-8 shadow-glow-blue/20 whitespace-nowrap"
          >
            {createMutation.isLoading ? (
              'Creating...'
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Add Case Study
              </>
            )}
          </button>

        </div>
      </div>

      {/* Grid of Portfolio Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems?.map((item) => {
          const coverImage = item.images && item.images.length > 0 && item.images[0].url
            ? item.images[0].url
            : item.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'; // fallback

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card overflow-hidden group hover:border-blue-500/20 border-2 border-white/5 transition-all flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative h-56 overflow-hidden shrink-0">
                <img src={coverImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a11] to-transparent opacity-80" />
                <div className="absolute top-4 right-4">
                  <span className="badge badge-blue bg-blue-600/30 backdrop-blur-md text-[8px] font-black uppercase px-3 py-1 border-white/10">{item.industry || item.category}</span>
                </div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="flex items-center gap-1 text-[8px] font-black uppercase text-[#39ff14] bg-white/5 backdrop-blur-md px-2 py-1 rounded border border-white/10"><TrendingUp size={10} /> {item.metrics?.trafficIncrease || item.stats?.increase || '+45%'} Traffic</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white group-hover:text-[#3b82f6] transition-colors line-clamp-1 leading-tight mb-4">{item.title}</h3>
                <p className="text-xs text-[#9ca3af] mb-10 leading-relaxed italic line-clamp-2">{item.description || 'No description provided'}</p>

                <div className="flex flex-wrap gap-3 mb-10 pb-6 border-b border-white/5">
                  {item.technologies?.map(tech => (
                    <span key={tech} className="text-[8px] font-black uppercase tracking-tighter text-[#6b7280] bg-white/1 px-3 py-1 rounded-full border border-white/5">{tech}</span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#4b5563] flex items-center gap-2">
                      <Layout size={12} className="text-[#3b82f6]" /> {item.status || 'Active'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleShare(item.slug)} className="h-10 w-10 text-white rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#3b82f6] transition-all">
                      <Share2 size={16} />
                    </button>
                    <Link to={`/dashboard/portfolio/${item._id}`} className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-[#3b82f6] transition-all">
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => deleteMutation.mutate(item._id)}
                      className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-red-500 transition-all font-bold"
                    >
                      <Trash2 size={16} />
                    </button>
                    <Link to={`/portfolio/${item.slug}`} className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-all">
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {items?.length === 0 && (
          <div className="col-span-full py-32 text-center glass-card border-dashed">
            <Database size={48} className="text-white/5 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-2 italic">Portfolio Data Vault Empty</h3>
            <p className="text-[#4b5563] text-sm font-medium italic">Begin uploading your high-performance case studies to convert global leads.</p>
          </div>
        )}
      </div>

      {/* Featured Insight */}
      <div className="p-10 glass-card bg-gradient-to-r from-blue-600/10 to-transparent border-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-10 rounded-[32px] mt-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] opacity-30 rounded-full" />
        <div className="flex gap-8 items-center relative z-10">
          <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 flex items-center justify-center text-[#3b82f6] border border-blue-500/20 shadow-glow-blue/10">
            <Code size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-widest leading-none">Automated Tech Stack Sync</h4>
            <p className="text-sm font-medium text-[#9ca3af] italic ">
              Our system can automatically sync your project repositories and generate tech-stack case studies to save you hours of manual work.
            </p>
          </div>
        </div>
        <button className="btn-secondary h-12 text-[10px] no-underline font-black uppercase tracking-widest px-8 border-white/5">Sync GitHub</button>
      </div>
    </div>
  );
}
