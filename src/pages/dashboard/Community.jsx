import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Heart, Share2, Plus, Zap, 
  TrendingUp, Send, Code, HelpCircle, Rocket, X 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { communityAPI } from '../../services/api';
import { useAuthStore } from '../../store';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function Community() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', type: 'general', title: '', tags: '' });
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState('');

  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['community-posts'],
    queryFn: async () => {
      const resp = await communityAPI.getAll();
      return resp.data.data;
    }
  });

  useEffect(() => {
    if (!token) return;
    const socket = io(window.location.origin, { auth: { token } });

    socket.on('new-post', (post) => {
      queryClient.setQueryData(['community-posts'], (old = []) => [post, ...old]);
      toast.success(`New post from ${post.author.name}`, { icon: '🌐' });
    });

    socket.on('post-updated', (updatedPost) => {
      queryClient.setQueryData(['community-posts'], (old = []) => 
        old.map(p => p._id === updatedPost._id ? updatedPost : p)
      );
    });

    return () => socket.disconnect();
  }, [token, queryClient]);

  const createMutation = useMutation({
    mutationFn: (data) => communityAPI.create(data),
    onSuccess: () => {
      setIsModalOpen(false);
      setNewPost({ content: '', type: 'general', title: '', tags: '' });
      queryClient.invalidateQueries(['community-posts']);
      toast.success('System update broadcasted!');
    }
  });

  const likeMutation = useMutation({
    mutationFn: (id) => communityAPI.like(id),
    onSuccess: (resp, id) => {
      queryClient.setQueryData(['community-posts'], (old = []) => 
        old.map(p => p._id === id ? { ...p, likes: resp.data.data } : p)
      );
    }
  });

  const commentMutation = useMutation({
    mutationFn: ({ id, content }) => communityAPI.comment(id, { content }),
    onSuccess: () => {
      setCommentText('');
      setActiveCommentPost(null);
      queryClient.invalidateQueries(['community-posts']);
      toast.success('Comment processed.');
    }
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 font-display uppercase tracking-tighter leading-none">
            Developer <span className="gradient-text-blue">Commune</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium italic">
            Connecting high-performance builders across the Stack Guy ecosystem.
          </p>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Create Update
        </motion.button>
      </div>

      {/* Featured Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Builders', value: '1,280+', icon: Users, color: 'text-blue-500' },
          { label: 'Lines Shipped', value: '4.2M', icon: Zap, color: 'text-yellow-500' },
          { label: 'Network Growth', value: '+22%', icon: TrendingUp, color: 'text-green-500' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 border-white/5 bg-white/[0.02] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Community Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode='popLayout'>
            {posts?.map((post, i) => (
              <motion.div
                key={post._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-8 border-white/5 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-blue-500 font-bold overflow-hidden">
                      {post.author.avatar ? <img src={post.author.avatar} alt="" className="w-full h-full object-cover" /> : post.author.name[0]}
                    </div>
                    <div>
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        {post.author.name}
                        {post.author.role === 'admin' && <Zap size={12} className="text-yellow-500 fill-yellow-500" />}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1">
                        {post.author.role} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-widest ${post.type === 'code-share' ? 'text-green-500' : 'text-blue-500'}`}>
                      {post.type}
                    </span>
                  </div>
                </div>
                
                {post.title && <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{post.title}</h3>}
                <p className="text-gray-300 text-lg leading-relaxed mb-6 italic">
                  "{post.content}"
                </p>

                {post.codeSnippet?.code && (
                  <div className="mb-6 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-sm text-blue-400 overflow-x-auto">
                    <pre><code>{post.codeSnippet.code}</code></pre>
                  </div>
                )}
                
                <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => likeMutation.mutate(post._id)}
                    className={`flex items-center gap-2 text-xs font-black transition-colors uppercase tracking-widest ${post.likes.includes(user?._id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                  >
                    <Heart size={16} fill={post.likes.includes(user?._id) ? 'currentColor' : 'none'} /> {post.likes.length}
                  </button>
                  <button 
                    onClick={() => setActiveCommentPost(activeCommentPost === post._id ? null : post._id)}
                    className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-blue-500 transition-colors uppercase tracking-widest"
                  >
                    <MessageSquare size={16} /> {post.comments.length}
                  </button>
                </div>

                {/* Comment Section */}
                <AnimatePresence>
                  {activeCommentPost === post._id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 space-y-4 overflow-hidden"
                    >
                      <div className="flex gap-4">
                        <input 
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Type your response..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                        />
                        <button 
                          onClick={() => commentMutation.mutate({ id: post._id, content: commentText })}
                          disabled={!commentText.trim()}
                          className="p-2 rounded-xl bg-blue-600 text-white disabled:opacity-50"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[10px] text-blue-500 font-bold">
                              {comment.author.name[0]}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">{comment.author.name}</p>
                                <p className="text-xs text-gray-400 mt-1">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <aside className="lg:col-span-4 space-y-8 text-white">
          <div className="glass-card p-8 border-blue-500/10 bg-blue-500/[0.02]">
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" /> Trending Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {['#ReactOS', '#AICopilot', '#StackGuyElite', '#Web3OS', '#NeuralInterface'].map(tag => (
                <button key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-black text-gray-400 hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest border border-white/5">
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-8 border-white/5">
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
               <Rocket size={20} className="text-purple-500" /> System Sprints
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Next-Gen Auth UI', date: 'March 25, 2026', color: 'bg-blue-500' },
                { title: 'Global CDN Edge', date: 'April 02, 2026', color: 'bg-purple-500' }
              ].map((sprint, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className={`w-1 ${sprint.color} rounded-full transition-all group-hover:w-2`} />
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">{sprint.title}</p>
                    <p className="text-[10px] text-gray-500 font-bold italic">{sprint.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl glass-card border-white/10 p-8 bg-[#0a0a0f]"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Broadcast <span className="text-blue-500">Update</span></h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24}/></button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">System Type</label>
                    <select 
                      value={newPost.type}
                      onChange={(e) => setNewPost({...newPost, type: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    >
                      <option value="general">General</option>
                      <option value="question">Question</option>
                      <option value="code-share">Code Share</option>
                      <option value="sprint-update">Sprint Update</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Post Title</label>
                    <input 
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      placeholder="Enter title..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Transmission Content</label>
                  <textarea 
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Warp speed ahead..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-4">
                    <button 
                      onClick={() => createMutation.mutate(newPost)}
                      disabled={!newPost.content || createMutation.isPending}
                      className="flex-1 btn-primary py-4 rounded-2xl flex items-center justify-center gap-2"
                    >
                      {createMutation.isPending ? 'Broadcasting...' : <>Generate Signal <Send size={18}/></>}
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
