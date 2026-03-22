import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Gift, Share2, Copy,
  CheckCircle, TrendingUp, DollarSign,
  ArrowRight, Award, Zap, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://stackguy.com/ref/dev_7721";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const referralStats = [
    { label: 'Total Referrals', value: '12', icon: Users, color: 'text-blue-500' },
    { label: 'Pending Rewards', value: '₹4,500', icon: Clock, color: 'text-orange-500' },
    { label: 'Total Earned', value: '₹18,200', icon: DollarSign, color: 'text-green-500' },
    { label: 'Conversion Rate', value: '18%', icon: TrendingUp, color: 'text-purple-500' }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="glass-card-premium p-12 md:p-20 border-blue-500/10 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 relative overflow-hidden rounded-[48px]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8"
            >
              <Award size={14} /> Elite Partner Program
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white mb-8 font-display uppercase tracking-tight leading-none"
            >
              Spread the <span className="gradient-text-blue">Stack</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 italic mb-12 leading-relaxed"
            >
              Refer a fellow builder or business to THE STACK GUY OS. When they sign up for a project, you both earn ₹5,000 in ecosystem credits.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-gray-300 font-mono outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-2 h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <button className="btn-os flex items-center justify-center gap-3 px-8">
                <Share2 size={18} /> Share
              </button>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="glass-card p-10 relative z-10 border-white/5 bg-white/[0.02]"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                  <Gift size={24} />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Rewards Pool</h3>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-500 uppercase font-black tracking-widest">Next Milestone</span>
                  <span className="text-white font-bold">₹50,000</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[65%] shadow-glow-blue" />
                </div>
                <p className="text-[10px] text-gray-500 italic">You're ₹17,500 away from unlocking the "Platinum Partner" badge.</p>
              </div>
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[80px] -z-10" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {referralStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 border-white/5 hover:bg-white/[0.03] transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <TrendingUp size={14} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-white font-display uppercase tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <div className="space-y-8">
        <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-4">
          <Zap className="text-blue-500" /> Three Steps to Scale
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Invite', desc: 'Share your unique partner link with friends, clients, or founders.', step: '01' },
            { title: 'Onboard', desc: 'They initialize their first OS project and deposit milestone credits.', step: '02' },
            { title: 'Reward', desc: 'Receive instant cash-back or project credits in your treasury.', step: '03' }
          ].map((step, i) => (
            <div key={i} className="glass-card p-10 border-white/5 bg-white/[0.01] relative overflow-hidden group">
              <span className="absolute -right-4 -top-4 text-8xl font-black text-white/[0.02] transition-colors group-hover:text-blue-500/5">{step.step}</span>
              <h4 className="text-2xl font-black text-white uppercase tracking-widest mb-4 z-10 relative">{step.title}</h4>
              <p className="text-sm text-gray-500 italic leading-relaxed z-10 relative">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="glass-card p-10 border-white/5">
        <h3 className="text-lg font-black text-white uppercase tracking-widest mb-8">Recent Partner Activity</h3>
        <div className="space-y-6">
          {[
            { user: 'Vikram Mehta', action: 'initialized project via your link', reward: '+₹5,000', time: '2h ago' },
            { user: 'Sarah Chen', action: 'signed up for AI Studio', reward: 'Pending', time: '5h ago' },
            { user: 'Digital Pulse Ltd', action: 'completed milestone 01', reward: '+₹12,400', time: '1d ago' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">
                  {item.user[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-widest">{item.user}</p>
                  <p className="text-[10px] text-gray-500 italic">{item.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${item.reward === 'Pending' ? 'text-orange-500' : 'text-green-500'}`}>{item.reward}</p>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6] hover:underline underline-offset-4">View Full History</button>
        </div>
      </div>

      {/* Impact Section */}
      <div className="p-12 md:p-20 glass-card-premium bg-[#050508] border-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-12 rounded-[48px] overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] opacity-30 rounded-full" />
        <div className="flex gap-8 items-center relative z-10 max-w-2xl">
          <div className="w-20 h-20 rounded-[30px] bg-white/5 flex items-center justify-center text-red-500 shadow-glow-red/20 border border-white/10 shrink-0">
            <Heart size={40} />
          </div>
          <div>
            <h4 className="text-3xl font-black text-white mb-3 uppercase tracking-widest leading-none">High Influence?</h4>
            <p className="text-lg font-medium text-[#9ca3af] italic">
              Are you a creator or agency owner? Apply for our manual affiliate tier with 20% lifetime recurring commissions.
            </p>
          </div>
        </div>
        <button className="btn-primary h-14 bg-white text-black font-black uppercase tracking-widest px-10 no-underline shadow-glow-white/20 relative z-10 shrink-0">
          Apply Now <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function Clock({ size, className }) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
