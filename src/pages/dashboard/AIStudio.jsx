import { motion } from 'framer-motion';
import { Sparkles, Terminal, Palette, Wand2, Zap, Brain, Rocket, ChevronRight } from 'lucide-react';
import { aiFeatures } from '../../services/mockData';

export default function AIStudio() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-20 px-8 rounded-[40px] bg-gradient-to-br from-blue-900/10 via-black to-cyan-900/10 border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full -ml-20 -mb-20" />
        
        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-black uppercase tracking-widest text-blue-400 mb-8"
          >
            <Sparkles size={14} /> NEW: GPT-4o Ready
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 font-display uppercase tracking-widest leading-none"
          >
            AI <span className="gradient-text-blue">Studio</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 italic font-medium leading-relaxed max-w-2xl"
          >
            Accelerate your business with integrated AI models for content, code, and design.
          </motion.p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {aiFeatures.map((feature, i) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="glass-card p-10 group relative border-white/5 bg-white/[0.01]"
          >
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-8 border border-blue-500/20 transition-transform group-hover:scale-110 group-hover:rotate-6">
              {i === 0 && <Sparkles size={32} />}
              {i === 1 && <Terminal size={32} />}
              {i === 2 && <Palette size={32} />}
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-4 font-display">{feature.title}</h3>
            <p className="text-gray-400 text-sm italic font-medium leading-relaxed mb-8">{feature.description}</p>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 group-hover:gap-4 transition-all">
              Initialize Engine <ChevronRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* AI OS Integration Section */}
      <div className="glass-card-premium p-12 md:p-20 border-white/5 bg-white/[0.02] relative overflow-hidden text-center rounded-[60px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-blue-500/5 to-transparent blur-[100px] pointer-events-none" />
        
        <div className="max-w-2xl mx-auto space-y-10 relative z-10">
          <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto shadow-glow-blue/40 animate-pulse">
            <Brain size={48} className="text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest font-display animate-fade-in-up">
            Connect <span className="gradient-text-blue">Your API</span>
          </h2>
          <p className="text-gray-400 text-lg italic tracking-human animate-fade-in-up">
            Integrate OpenAI, Anthropic, or Deepseek keys to power specialized dashboards elements. No server setup required.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
            <button className="btn-primary">
              <Rocket size={20} /> Configure Keys
            </button>
            <button className="btn-os text-gray-500">
              <Zap size={16} /> Read Documentation
            </button>
          </div>
        </div>
      </div>
      
      {/* Featured AI Workflow */}
      <div className="space-y-10">
        <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-4">
          <Wand2 className="text-blue-500" /> Active AI Sprints
        </h3>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
             <div key={i} className="glass-card p-6 border-white/5 flex flex-col md:flex-row items-center gap-8 bg-white/[0.02] transition-colors hover:bg-white/[0.05]">
               <div className="text-xs font-black text-gray-500 uppercase tracking-widest w-12 text-center">0{i}</div>
               <div className="flex-1">
                 <h4 className="text-white font-black uppercase tracking-widest text-sm mb-1">SEO Data Crawler v2</h4>
                 <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Training Stage: 88%</p>
               </div>
               <div className="w-full md:w-64 h-2 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${88 - (i * 10)}%` }}
                   className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                 />
               </div>
               <div className="text-xs font-black text-white/50 uppercase tracking-widest">STABLE</div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
