import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Zap, AlertCircle, ChevronLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store';
import { authAPI } from '../../services/api';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore(state => state.login);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const resp = await authAPI.login(data);
      const { user, token } = resp.data.data;
      login(user, token);

      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Use provided Quick Access keys below.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoLogin = (email) => {
    const data = {
      email: email === 'admin' ? 'admin@thestackguy.com' : 'client@thestackguy.com',
      password: 'admin123'
    };
    onSubmit(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden relative bg-[#050508]">
      {/* Animated Background Orbs */}
      <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] -z-10 rounded-full animate-pulse" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] -z-10 rounded-full animate-pulse-slow" />

      <div className="container-custom relative z-10 px-6">
        <div className=" mx-auto">
          {/* Header Link */}
          <Link to="/" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-white transition-colors mb-10 no-underline text-xs font-black uppercase tracking-widest group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 md:p-14 rounded-[40px] border-white/5 border-2 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-50" />

            <div className="text-center mb-12">
              <div className="w-20 h-20 rounded-[30px] bg-gradient-to-br from-[#3b82f6] to-[#22d3ee] flex items-center justify-center mx-auto mb-8 shadow-glow-blue/20 rotate-3 transform transition-transform hover:rotate-6">
                <Zap size={40} color="#fff" />
              </div>
              <h1 className="text-4xl font-black text-white mb-2 font-display uppercase tracking-widest">Login <span className="gradient-text">OS</span></h1>
              <p className="text-[#9ca3af] text-sm italic font-medium">Access your agency command center.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6b7280] flex items-center gap-2">
                  <Mail size={12} className="text-blue-500" /> Identity / Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@company.com"
                  className={`input-field h-14 bg-white/[0.03] border-white/5 hover:border-white/10 focus:border-blue-500/50 rounded-2xl ${errors.email ? 'border-red-500/50' : ''}`}
                />
                {errors.email && <p className="text-[10px] text-red-400 font-bold uppercase tracking-tight">{errors.email.message}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6b7280] flex items-center gap-2">
                    <Lock size={12} className="text-blue-500" /> Secure Key
                  </label>
                  <Link to="/forgot-password" size={12} className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 no-underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`input-field h-14 bg-white/[0.03] border-white/5 hover:border-white/10 focus:border-blue-500/50 rounded-2xl ${errors.password ? 'border-red-500/50' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-400 font-bold uppercase tracking-tight">{errors.password.message}</p>}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-3 text-red-500"
                  >
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p className="text-xs font-bold leading-relaxed italic">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-16 text-sm font-black uppercase tracking-[0.3em] justify-center shadow-lg relative overflow-hidden group rounded-2xl"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                  {loading ? 'Processing...' : (
                    <>
                      Enter OS <LogIn size={20} />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Demo Credentials Section */}
            <div className="mt-10 pt-10 border-t border-white/5">
              <p className="text-[10px] font-black text-[#6b7280] uppercase tracking-[0.2em] mb-6 text-center italic">Quick Access Demo</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDemoLogin('admin')}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Admin Portal
                </button>
                <button
                  onClick={() => setDemoLogin('client')}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Client Hub
                </button>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-[#6b7280] text-[10px] font-black tracking-widest uppercase">
                New User? <Link to="/register" className="text-blue-500 hover:text-blue-400 no-underline ml-1">Deploy Account</Link>
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-3 text-[#4b5563] text-[10px] font-bold uppercase tracking-[0.2em]">
              <ShieldCheck size={14} className="text-green-500/50" /> AES-256 Session Encrypted
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
