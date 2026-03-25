import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Zap, AlertCircle, ChevronLeft, Eye, EyeOff, ShieldCheck, Phone, CheckCircle, Sparkles, Briefcase, CreditCard, Globe } from 'lucide-react';
import { useAuthStore } from '../../store';
import { authAPI } from '../../services/api';
import { Helmet } from 'react-helmet-async';

const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  referralCode: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      // Clean data for API
      const { confirmPassword, ...registerData } = data;
      const resp = await authAPI.register(registerData);
      const { user, token } = resp.data.data;
      login(user, token);
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Helmet>
        <title>Sign Up | The Stack Guy – Start Your Project Today</title>

        <meta
          name="description"
          content="Create your account with The Stack Guy and start building high-performance MERN stack applications. Fast, scalable, and SEO-ready solutions for your business."
        />
    </Helmet>
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Animated Background Orbs */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-blue-500/10 blur-[200px] -z-10 rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] bg-[#39ff14]/5 blur-[200px] -z-10 rounded-full animate-pulse-slow" />
      
      <div className="container-custom relative z-10">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Pitch */}
          <div className="lg:col-span-5 hidden lg:block">

             <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-10 md:p-5 rounded-[40px] border-white/5 border-2 shadow-glow-blue/5"
            >
              <div className="mb-10 lg:text-left text-center">
                <h1 className="text-3xl font-bold text-white mb-2 font-display uppercase tracking-wider">Create Account</h1>
                <p className="text-[#9ca3af] text-sm italic font-medium">Join THE STACK operating system today.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] flex items-center gap-2">
                      <User size={12} /> Full Name
                    </label>
                    <input 
                      {...register('name')}
                      type="text" 
                      placeholder="Enter Full Name" 
                      className={`input-field h-12 ${errors.name ? 'border-red-500/50' : 'hover:border-white/10'}`}
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-bold tracking-tight">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] flex items-center gap-2">
                      <Phone size={12} /> Phone (Optional)
                    </label>
                    <input 
                      {...register('phone')}
                      type="tel" 
                      placeholder="+91 00000 00000" 
                      className="input-field h-12 hover:border-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] flex items-center gap-2">
                    <Mail size={12} /> Email Address
                  </label>
                  <input 
                    {...register('email')}
                    type="email" 
                    placeholder="name@company.com" 
                    className={`input-field h-12 pr-4 ${errors.email ? 'border-red-500/50' : 'hover:border-white/10'}`}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-bold tracking-tight">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] flex items-center gap-2">
                      <Lock size={12} /> Password
                    </label>
                    <div className="relative">
                      <input 
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••" 
                        className={`input-field h-12 pr-12 ${errors.password ? 'border-red-500/50' : 'hover:border-white/10'}`}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[10px] text-red-500 font-bold tracking-tight">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] flex items-center gap-2">
                      <Lock size={12} /> Confirm
                    </label>
                    <input 
                      {...register('confirmPassword')}
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className={`input-field h-12 ${errors.confirmPassword ? 'border-red-500/50' : 'hover:border-white/10'}`}
                    />
                    {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold tracking-tight">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] flex items-center gap-2">
                    <Zap size={12} /> Referral Code (Optional)
                  </label>
                  <input 
                    {...register('referralCode')}
                    type="text" 
                    placeholder="XXXX-XXXX" 
                    className="input-field h-12 hover:border-white/10 uppercase font-black"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-500"
                    >
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <p className="text-xs font-bold leading-relaxed">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full h-16 text-lg font-black uppercase tracking-widest justify-center shadow-glow-blue/10"
                  >
                    {loading ? 'Creating Account...' : (
                      <>
                        Register <UserPlus size={20} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-10 text-center">
                <p className="text-[#6b7280] text-xs font-bold">
                  ALREADY HAVE AN ACCOUNT? <Link to="/login" className="text-blue-500 hover:text-blue-400 no-underline ml-1">LOGIN HERE</Link>
                </p>
              </div>
              
             
            </motion.div>
          </div>

          {/* Right Side: Form Card */}
          <div className="lg:col-span-7">
           <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >

              <h2 className="text-4xl font-bold text-white mb-6 font-display uppercase tracking-widest leading-tight">
              Turn Skills into <span className="gradient-text">Income</span> 💸
            </h2>

            <p className="text-gray-400 text-sm mb-8">
              Everything you need to start, grow, and scale your freelance business — in one place.
            </p>

            <ul className="space-y-6">
              {[
                {
                  icon: <Sparkles size={16} />,
                  title: 'AI-Powered Proposals',
                  desc: 'Create winning proposals in seconds.'
                },
                {
                  icon: <Briefcase size={16} />,
                  title: 'All-in-One Workspace',
                  desc: 'Manage projects, clients & files effortlessly.'
                },
                {
                  icon: <CreditCard size={16} />,
                  title: 'Get Paid Seamlessly',
                  desc: 'Razorpay integration with GST-ready invoices.'
                },
                {
                  icon: <Globe size={16} />,
                  title: 'Work Without Limits',
                  desc: 'Build your freelance business from anywhere.'
                }
              ].map(item => (
                <li key={item.title} className="flex gap-4 group">
                  <div className="w-8 h-8 rounded-lg bg-[#39ff14]/10 flex items-center justify-center text-[#39ff14] shrink-0 mt-1 group-hover:bg-[#39ff14]/20 transition">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[#9ca3af] text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-12 pt-10 border-t border-white/5">
              <p className="text-[#6b7280] text-xs font-bold uppercase tracking-widest mb-4">
                🚀 Join the new wave
              </p>
              <p className="text-gray-400 text-sm">
                50+ freelancers already building smarter businesses.
              </p>
            </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
