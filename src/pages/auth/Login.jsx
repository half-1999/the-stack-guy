import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Zap, AlertCircle, ChevronLeft, Eye, EyeOff, ShieldCheck, Phone, CheckCircle, LogIn, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../../store';
import { authAPI } from '../../services/api';
import { Helmet } from 'react-helmet-async';

const loginSchema = z.object({
  email: z.string().email('Enter valid email'),
  password: z.string().min(6, 'Min 6 characters')
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
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
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Helmet>
        <title>Login | The Stack Guy Dashboard</title>
        <meta name="description" content="Login to access high-performance MERN systems built by The Stack Guy." />
        <meta name="robots" content="noindex, nofollow" />
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
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
             <h2 className="text-3xl font-bold text-white mb-6 font-display uppercase tracking-widest leading-tight">
              Back to <span className="gradient-text">Building</span> 🚀
            </h2>

            <p className="text-gray-400 text-sm mb-8">
              Your projects. Your clients. Your momentum — all waiting for you.
            </p>

            <ul className="space-y-6">
              {[
                {
                  icon: <Zap size={16} />,
                  title: 'Instant Dashboard',
                  desc: 'Jump straight into your active work — no delays.'
                },
                {
                  icon: <CheckCircle size={16} />,
                  title: 'Live Project Tracking',
                  desc: 'See progress, updates & milestones in real-time.'
                },
                {
                  icon: <ShieldCheck size={16} />,
                  title: 'Secure Payments',
                  desc: 'Track earnings with full transparency & safety.'
                },
                {
                  icon: <MessageCircle size={16} />,
                  title: 'Client Conversations',
                  desc: 'All chats organized — no missed messages.'
                }
              ].map(item => (
                <li key={item.title} className="flex gap-4 group">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-1 group-hover:bg-blue-500/20 transition">
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
                ⚡ Productivity unlocked
              </p>
              <p className="text-gray-400 text-sm">
                Log in and continue where you left off — faster than ever.
              </p>
            </div>
            </motion.div>
          </div>

          {/* Right Side: Form Card */}
          <div className="lg:col-span-7">
            <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl"
          >

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <Zap size={28} />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-center mb-2">
              Welcome Back
            </h2>

            <p className="text-center text-gray-400 text-sm mb-8">
              Login to your dashboard
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Email"
                  className="w-full h-14 pl-12 rounded-xl bg-white/[0.05] border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full h-14 pl-12 pr-12 rounded-xl bg-white/[0.05] border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in...' : <>Login <LogIn size={18} /></>}
              </motion.button>

            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Don’t have an account?
              <Link to="/register" className="text-blue-400 ml-2 hover:text-blue-300">
                Sign up
              </Link>
            </div>

            <div className="mt-6 flex justify-center items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={14} className="text-green-400" />
              Secure & encrypted
            </div>

          </motion.div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
