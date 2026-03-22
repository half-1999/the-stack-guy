import { motion } from 'framer-motion';
import { Users, MessageSquare, Heart, Share2, Plus, Zap, TrendingUp } from 'lucide-react';
import { communityPosts } from '../../services/mockData';

export default function Community() {
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
          className="btn-primary"
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
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Community Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          {communityPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="glass-card p-8 border-white/5 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-blue-500 font-bold">
                    {post.author[0]}
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm">{post.author}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{post.role} • {post.time}</p>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-white transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-8 italic">
                "{post.content}"
              </p>
              
              <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                <button className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest">
                  <Heart size={16} /> {post.likes}
                </button>
                <button className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-blue-500 transition-colors uppercase tracking-widest">
                  <MessageSquare size={16} /> {post.comments}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <aside className="lg:col-span-4 space-y-8">
          <div className="glass-card p-8 border-blue-500/10 bg-blue-500/[0.02]">
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6">Trending Topics</h3>
            <div className="space-y-4">
              {['#ReactOS', '#AICopilot', '#StackGuyElite', '#Web3OS'].map(tag => (
                <button key={tag} className="block w-full text-left p-3 rounded-xl bg-white/5 text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-8 border-white/5">
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6">Upcoming Sprints</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-1 bg-blue-500 rounded-full" />
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Next-Gen Auth UI</p>
                  <p className="text-[10px] text-gray-500 font-bold italic">Starts March 25, 2026</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-purple-500 rounded-full" />
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Global CDN Edge</p>
                  <p className="text-[10px] text-gray-500 font-bold italic">Starts April 02, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
