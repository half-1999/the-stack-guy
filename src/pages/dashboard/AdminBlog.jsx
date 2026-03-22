import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, FileText, Search, MoreHorizontal,
  Trash2, Edit, ExternalLink, Eye,
  CheckCircle, Clock, AlertCircle, ArrowRight,
  Filter, Image as ImageIcon, Tag, Hash, Globe, Settings, Layout, Zap
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { blogAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { Link } from 'react-router-dom';

export default function AdminBlog() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      try {
        const resp = await blogAPI.getPublished({ limit: 100 });
        return resp.data.data;
      } catch (err) {
        // Fallback to mock posts for demo
        return [
          { _id: '1', title: 'Scaling SaaS with AI Agents', category: 'Engineering', status: 'published', readTime: 12, views: 1240, tags: ['AI', 'SaaS'], slug: 'scaling-saas', featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
          { _id: '2', title: 'Why SEO Strategy is Changing in 2026', category: 'Marketing', status: 'draft', readTime: 8, views: 0, tags: ['SEO', 'Google'], slug: 'seo-2026', featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' }
        ];
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => blogAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-posts']);
    }
  });

  if (!isAdmin) return <div className="p-20 text-center">Unauthorized.</div>;
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase leading-tight">
            Content <span className="gradient-text">Engine</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Automate your SEO and content marketing strategy from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex rounded-xl bg-white/5 border border-white/5 p-1 overflow-hidden">
            {['all', 'published', 'draft'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-6 h-10 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${filter === s ? 'bg-[#3b82f6] text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="btn-primary h-12 text-xs no-underline font-black uppercase tracking-widest px-8 shadow-glow-blue/20">
            <Plus size={16} className="mr-2" /> New Article
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatsBox label="Live Articles" val={posts?.length || 0} icon={Globe} color="blue" />
        <StatsBox label="Total Reads" val={posts?.reduce((acc, p) => acc + (p.views || 0), 0).toLocaleString() || 0} icon={Eye} color="green" />
        <StatsBox label="Avg. Read Time" val={`${posts?.length ? Math.round(posts.reduce((acc, p) => acc + (p.readTime || 0), 0) / posts.length) : 0}m`} icon={Clock} color="cyan" />
        <StatsBox label="Total Tags Uses" val={posts?.reduce((acc, p) => acc + (p.tags?.length || 0), 0) || 0} icon={Tag} color="orange" />
      </div>

      {/* Grid of Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <motion.article
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden group hover:border-[#3b82f6]/30 border-2 border-white/5 transition-all flex flex-col"
          >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden shrink-0">
              <img src={post.featuredImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a11] to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4">
                <span className="badge badge-blue bg-blue-600/30 backdrop-blur-md text-[10px] font-black uppercase px-3 py-1">{post.category}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white group-hover:text-[#3b82f6] transition-colors line-clamp-2 leading-tight no-underline mb-0">{post.title}</h3>
              </div>

              <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-[#6b7280] mb-8 pb-4 border-b border-white/5">
                <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime} MIN</span>
                <span className="flex items-center gap-1"><Eye size={12} /> {post.views || 0} VIEWS</span>
                <span className="flex items-center gap-1"><Tag size={12} /> {post.tags?.length || 0} TAGS</span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${post.status === 'published' ? 'bg-[#39ff14]' : 'bg-orange-500'} shadow-[0_0_10px_currentColor] animate-pulse`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#4b5563]">{post.status}</span>
                </div>
                <div className="flex gap-2">
                  <button className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-[#3b82f6] transition-all">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(post._id)}
                    className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-red-500 transition-all font-bold"
                  >
                    <Trash2 size={16} />
                  </button>
                  <Link to={`/blog/${post.slug}`} className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-all">
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>
        ))}

        {posts?.length === 0 && (
          <div className="col-span-full py-32 text-center opacity-30 italic text-sm text-[#4b5563]">
            Your article library is currently empty.
          </div>
        )}
      </div>

      {/* SEO Tip / Automation Banner */}
      <div className="p-10 glass-card bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-10 rounded-[32px] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] opacity-30 rounded-full" />
        <div className="flex gap-8 items-center relative z-10">
          <div className="w-16 h-16 rounded-[24px] bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-glow-purple/10">
            <Settings size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-widest leading-none">AI Content Generator</h4>
            <p className="text-sm font-medium text-[#9ca3af] italic">
              Don't have time to write? Use our integrated AI to generate SEO-optimized articles based on your case studies.
            </p>
          </div>
        </div>
        <button className="btn-primary h-14 bg-purple-600 border-none hover:bg-purple-500 font-black uppercase tracking-widest px-10 no-underline shadow-glow-purple/20 relative z-10">
          Generate with AI <Zap size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );
}

function StatsBox({ label, val, icon: Icon, color }) {
  const colors = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    green: 'text-[#39ff14] bg-[#39ff14]/10 border-[#39ff14]/20',
    cyan: 'text-[#22d3ee] bg-[#22d3ee]/10 border-[#22d3ee]/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20'
  };

  return (
    <div className={`glass-card p-8 border-2 transition-transform hover:scale-105 ${colors[color]}`}>
      <div className="flex justify-between items-center mb-6">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
        <Icon size={16} className="opacity-40" />
      </div>
      <h4 className="text-4xl font-black font-display tracking-wider leading-none text-white">{val}</h4>
    </div>
  );
}

function TrendingUp({ size, className }) {
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
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
