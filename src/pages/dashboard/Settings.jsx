import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, 
  Bell, Shield, Zap, Save, 
  CheckCircle, Camera, CreditCard, 
  Settings as SettingsIcon, Share2, Globe, Calendar, ExternalLink, Activity, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional()
});

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone || '',
      company: user?.company || ''
    }
  });

  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      // Mock update for testing login
      if (user?._id?.includes('mock')) {
        updateUser({ ...user, ...data });
        toast.success('OS profile synced successfully!');
      } else {
        await authAPI.updateProfile(data);
        updateUser({ ...user, ...data });
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Identity' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'booking', icon: Calendar, label: 'Calendly' },
    { id: 'billing', icon: CreditCard, label: 'Treasury' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-32">
      {/* OS Dashboard Header */}
      <div className="relative p-12 overflow-hidden rounded-[40px] bg-white/[0.01] border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[32px] overflow-hidden border-2 border-blue-500/20 p-1 group-hover:border-blue-500 transition-all duration-500 transform group-hover:rotate-6">
               <div className="w-full h-full rounded-[28px] bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-black shadow-glow-blue/20 capitalize">
                 {user?.name?.charAt(0)}
               </div>
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-black border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <Camera size={14} />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 font-display uppercase tracking-widest leading-none">
              Client <span className="gradient-text-blue">Settings</span>
            </h1>
            <p className="text-gray-500 italic font-medium tracking-human">
               Configuration for your dedicated business operating system.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Navigation Rail */}
        <aside className="lg:col-span-3">
          <div className="space-y-2">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                   activeTab === tab.id 
                    ? 'bg-white/[0.05] text-white border border-white/10 shadow-lg' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                 }`}
               >
                 <tab.icon size={16} className={activeTab === tab.id ? 'text-blue-500' : ''} /> {tab.label}
               </button>
             ))}
          </div>
          
          <div className="mt-12 p-8 glass-card border-dashed border-white/5 opacity-50">
             <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                <Activity size={12} /> System Health
             </div>
             <p className="text-[10px] text-gray-400 italic">All systems operational in your region.</p>
          </div>
        </aside>

        {/* Dynamic Content Surface */}
        <main className="lg:col-span-9">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="glass-card-premium p-10 md:p-20 border-white/5 rounded-[40px] min-h-[600px] relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.02] blur-[120px] pointer-events-none" />

                {activeTab === 'profile' && (
                  <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-16">
                     <div className="flex flex-col md:flex-row gap-10 items-center justify-between pb-10 border-b border-white/5">
                        <div className="max-w-md">
                           <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest font-display">Personal Identity</h3>
                           <p className="text-gray-500 text-sm italic italic leading-relaxed">Your public representative data across the agency portal.</p>
                        </div>
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="btn-primary"
                        >
                           <Save size={18} /> {loading ? 'Syncing...' : 'Save Changes'}
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                              Full Name
                           </label>
                           <input 
                             {...register('name')}
                             className="input-field h-14 bg-white/[0.02] border-white/10 italic font-medium" 
                           />
                           {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-3 opacity-40">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                              Network Identity (Readonly)
                           </label>
                           <input 
                             {...register('email')}
                             disabled
                             className="input-field h-14 bg-white/[0.01] border-white/5 italic font-medium" 
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                              Secure Contact
                           </label>
                           <input 
                              {...register('phone')}
                              placeholder="+91 ...."
                              className="input-field h-14 bg-white/[0.02] border-white/10 italic font-medium" 
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                              Digital Headquarters
                           </label>
                           <input 
                              {...register('company')}
                              placeholder="Business / URL"
                              className="input-field h-14 bg-white/[0.02] border-white/10 italic font-medium" 
                           />
                        </div>
                     </div>
                  </form>
                )}

                {activeTab === 'booking' && (
                  <div className="space-y-12">
                     <div className="max-w-2xl">
                        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-widest font-display">Calendly <span className="text-blue-500">Integration</span></h3>
                        <p className="text-gray-400 italic leading-relaxed mb-10">
                           Connect your scheduling engine to allow direct project kick-offs and support calls within your OS.
                        </p>
                        
                        <div className="p-10 rounded-[32px] bg-white/[0.02] border-2 border-dashed border-white/10 text-center space-y-8">
                           <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto text-blue-500 border border-blue-500/20">
                              <Calendar size={32} />
                           </div>
                           <div>
                              <p className="text-lg font-bold text-white mb-2 uppercase tracking-widest">No Active Engine found</p>
                              <p className="text-xs text-gray-500 italic max-w-sm mx-auto">Input your Calendly link below to enable the smart booking module.</p>
                           </div>
                           <div className="flex gap-4 max-w-md mx-auto">
                              <input 
                                 type="text" 
                                 placeholder="calendly.com/your-id"
                                 className="input-field h-12 bg-white/[0.03] border-white/5"
                              />
                              <button className="btn-primary h-12 px-6 text-[10px]">CONNECT</button>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'security' && (
                   <div className="space-y-16">
                      <div className="pb-10 border-b border-white/5 space-y-6">
                         <h3 className="text-2xl font-black text-white uppercase tracking-widest font-display">Session Lockdown</h3>
                         <p className="text-gray-400 italic text-sm max-w-xl">Enable high-tier security protocols for your project data.</p>
                         <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                            <ShieldCheck className="text-green-500" size={24} />
                            <div className="flex-1">
                               <p className="text-xs font-black text-white uppercase tracking-widest">MFA / 2FA Status</p>
                               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Currently Protected by OS Layer</p>
                            </div>
                            <button className="btn-os">RECONFIGURE</button>
                         </div>
                      </div>
                      
                      <div className="space-y-10">
                        <h3 className="text-xl font-bold text-white uppercase tracking-widest">Update Secure Key</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Current Key</label>
                              <input type="password" placeholder="••••••••" className="input-field h-14 bg-white/[0.02] border-white/10" />
                           </div>
                           <div className="space-y-3 md:col-start-1">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">New Protocol Key</label>
                              <input type="password" placeholder="••••••••" className="input-field h-14 bg-white/[0.02] border-white/10" />
                           </div>
                        </div>
                        <button className="btn-primary">DEPLOY NEW KEY</button>
                      </div>
                   </div>
                )}

                {activeTab === 'billing' && (
                   <div className="flex flex-col items-center justify-center text-center space-y-10 py-20">
                      <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-blue-600/10 to-transparent flex items-center justify-center text-blue-500 border border-blue-500/10 shadow-glow-blue/10">
                         <CreditCard size={64} strokeWidth={1} />
                      </div>
                      <div className="max-w-md space-y-4">
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter font-display">Treasury Hub</h4>
                        <p className="text-gray-400 italic leading-relaxed">
                           You are on a **Premium Development Retainer**. All technical maintenance and hosting fees are consolidated.
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <button className="btn-primary">Download Last Invoice</button>
                        <button className="btn-os">Manage Payment Methods</button>
                      </div>
                   </div>
                )}

                {activeTab === 'notifications' && (
                   <div className="space-y-12">
                      <h3 className="text-2xl font-black text-white uppercase tracking-widest font-display">Alert Protocols</h3>
                      <div className="space-y-6">
                        {[
                          { title: 'Project Updates', desc: 'Real-time build and task status changes', icon: Activity, active: true },
                          { title: 'Critical Invoices', desc: 'Immediate alerts for treasury actions', icon: CreditCard, active: true },
                          { title: 'Agency Dispatch', desc: 'Weekly development digest from the team', icon: Mail, active: false }
                        ].map((item, i) => (
                          <div key={i} className={`flex items-center justify-between p-8 rounded-3xl border border-white/5 transition-all ${item.active ? 'bg-white/[0.03]' : 'bg-transparent opacity-50'}`}>
                             <div className="flex gap-6 items-center">
                                <div className={`w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center ${item.active ? 'text-blue-500' : 'text-gray-600'}`}>
                                   <item.icon size={20} />
                                </div>
                                <div>
                                   <p className="text-sm font-black text-white uppercase tracking-widest">{item.title}</p>
                                   <p className="text-[10px] text-gray-500 font-bold italic">{item.desc}</p>
                                </div>
                             </div>
                             <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${item.active ? 'bg-blue-600' : 'bg-white/10'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${item.active ? 'translate-x-7' : 'translate-x-0'}`} />
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                )}
             </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
