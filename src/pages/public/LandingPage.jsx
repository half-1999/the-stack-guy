import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap, Shield, Rocket, Clock, MessageSquare,
  ArrowRight, Star, CheckCircle, Smartphone,
  Globe, Layout, Users, Play, Award,
  Activity, Sparkles, Heart, ChevronRight,
  Layers, Cpu, Fingerprint
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const springConfig = { stiffness: 100, damping: 20, mass: 1 };

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 20 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { staggerChildren: 0.15 }
};

const stats = [
  { label: 'High-Impact Delivery', value: '500', suffix: '+', icon: Rocket },
  { label: 'Global Founders', value: '120', suffix: '+', icon: Globe },
  { label: 'Avg. Launch Time', value: '48', suffix: 'h', icon: Clock },
  { label: 'Uptime Stability', value: '99.9', suffix: '%', icon: Activity }
];

const videoTestimonials = [
  { id: 1, name: 'Arjun Varma', role: 'CEO, Fintech Hub', videoThumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', duration: '0:45' },
  { id: 2, name: 'Priya Das', role: 'Founder, EcoScale', videoThumb: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', duration: '1:12' },
  { id: 3, name: 'Siddharth M.', role: 'Head of Product', videoThumb: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', duration: '0:58' },
  { id: 4, name: 'Elena R.', role: 'CTO, NextGen', videoThumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', duration: '1:05' }
];

// Reusable 3D Tilt Card
const TiltCard = ({ children, className }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-10, 10]), springConfig);

  return (
    <motion.div
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="w-full h-full">
        {children}
      </motion.div>
    </motion.div>
  );
};

// Counter Animation Component
const Counter = ({ value }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const target = parseInt(value, 10);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, hasStarted]);

  return (
    <motion.span onViewportEnter={() => setHasStarted(true)} viewport={{ once: true }}>
      {count}
    </motion.span>
  );
};


export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yHero = useSpring(useTransform(scrollYProgress, [0, 1], [0, 300]), springConfig);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Parallax elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [mouseX, mouseY]);

  const floatingX1 = useSpring(useTransform(mouseX, [-1000, 1000], [20, -20]), springConfig);
  const floatingY1 = useSpring(useTransform(mouseY, [-1000, 1000], [20, -20]), springConfig);
  const floatingX2 = useSpring(useTransform(mouseX, [-1000, 1000], [-30, 30]), springConfig);
  const floatingY2 = useSpring(useTransform(mouseY, [-1000, 1000], [-30, 30]), springConfig);

  return (
    <>
      <Helmet>
        <title>The Stack Guy | High-Performance Business Websites</title>
        <meta name="description" content="Launch your business online in 48 hours with high-performance MERN stack systems built for scale, SEO, and conversions." />
      </Helmet>

      <div className="bg-[#050508] selection:bg-blue-500/30 overflow-hidden text-gray-100">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
             style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)' }} />
        
        {/* Animated Background Orbs */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

        {/* Hero Section */}
        <motion.section 
          style={{ y: yHero, opacity: opacityHero, scale: scaleHero }}
          className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-32 px-6 min-h-screen flex items-center z-10"
        >
          {/* Floating 3D Elements */}
          <motion.div style={{ x: floatingX1, y: floatingY1 }} className="absolute top-[20%] right-[15%] hidden lg:flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.15)] z-0">
            <Layers className="text-blue-400" size={24} />
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Architecture</p>
              <p className="text-sm text-white font-medium">Synced & Secure</p>
            </div>
          </motion.div>
          <motion.div style={{ x: floatingX2, y: floatingY2 }} className="absolute bottom-[25%] left-[10%] hidden lg:flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(79,70,229,0.15)] z-0">
            <Cpu className="text-indigo-400" size={24} />
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Engine</p>
              <p className="text-sm text-white font-medium">Operating Nominal</p>
            </div>
          </motion.div>

          <div className="container-custom relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.05] backdrop-blur-2xl border border-white/10 text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-8 shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-300"
              >
                <Sparkles size={14} className="animate-pulse" /> The Sovereign Operating System for Founders
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 100 }}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 mb-8 font-display uppercase tracking-tighter leading-[0.85] drop-shadow-2xl"
              >
                STOP BUILDING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_40px_rgba(37,99,235,0.4)]">WEBSITES.</span> <br />
                LAUNCH <span className="italic font-light px-2 relative inline-block">
                  <span className="relative z-10 text-white">SYSTEMS.</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/30 -z-10 blur-sm rounded-full"></span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-400 mb-12 italic font-medium leading-relaxed max-w-3xl mx-auto"
              >
                Professional business operating systems delivered in 48 hours. <br className="hidden md:block"/>Built for high-performance scale, not just simple clicks.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
              >
                <Link to="/book-call" className="group relative flex items-center justify-center h-16 px-12 text-lg font-bold text-white bg-blue-600 rounded-full overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap size={22} className="group-hover:scale-110 transition-transform" /> Initialize Your Project
                  </span>
                </Link>
                <Link to="/portfolio" className="group flex items-center justify-center h-16 px-12 text-lg font-bold text-white bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
                  Audit Our Work <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-4 text-sm text-gray-400 font-medium"
              >
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050508] bg-gray-600 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>Trusted by <span className="text-white font-bold">120+</span> scale-up founders</div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Video Testimonials (Moved UP for Trust) */}
        <section className="py-20 relative z-20">
          <div className="container-custom">
             <motion.div {...fadeInUp} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 font-display uppercase tracking-tight">
                  TRUST IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">VERIFIED.</span>
                </h2>
                <p className="text-lg text-gray-400 italic">Watch real founders share their scaling journey.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/10 text-xs font-black text-white uppercase tracking-widest shadow-lg hover:bg-white/[0.1] transition-all cursor-pointer">
                  <Heart size={14} className="text-red-500 animate-pulse" /> Instagram Proof
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex gap-6 overflow-x-auto pb-10 hide-scrollbar snap-x snap-mandatory"
              style={{ cursor: 'grab' }}
              drag="x"
              dragConstraints={{ right: 0, left: -1000 }}
            >
              {videoTestimonials.map((v, i) => (
                <TiltCard key={v.id} className="min-w-[280px] md:min-w-[320px] snap-center">
                  <div className="group relative aspect-[9/16] rounded-[32px] overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
                    <img src={v.videoThumb} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={v.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] rounded-[32px] pointer-events-none z-10" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-110 group-hover:bg-blue-600/50 group-hover:border-blue-400 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <Play size={24} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                    
                    <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-black text-white tracking-widest">
                      {v.duration}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 transform transition-transform duration-300 group-hover:-translate-y-2">
                      <h4 className="text-lg font-black text-white uppercase tracking-widest mb-1">{v.name}</h4>
                      <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">{v.role}</p>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </motion.div>
          </div>
        </section>

        {/* High-Trust Stats Bar with Glassmorphism */}
        <section className="py-16 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-blue-900/10 border-y border-white/5 backdrop-blur-3xl" />
          <div className="container-custom relative">
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="space-y-4 group relative p-6 rounded-3xl bg-white/[0.02] border border-transparent hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 blur-xl rounded-3xl transition-opacity duration-500" />
                  <div className="relative w-14 h-14 rounded-2xl bg-white/[0.05] flex items-center justify-center text-blue-400 mx-auto border border-white/10 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-all duration-300">
                    <stat.icon size={24} />
                    <div className="absolute inset-0 bg-blue-400/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white font-display tracking-tighter leading-none relative z-10 drop-shadow-lg">
                    <Counter value={stat.value} />{stat.suffix}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        {/* Featured UI/UX Display */}
        <section className="py-32 relative z-10">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative perspective-1000"
              >
                <motion.div 
                  whileHover={{ rotateY: 5, rotateX: 5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="glass-card p-2 rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-20" />
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" className="rounded-[32px] w-full transform group-hover:scale-[1.03] transition-transform duration-700 ease-out" alt="Dashboard UI" />
                  <div className="absolute inset-0 rounded-[32px] shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />
                </motion.div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/20 blur-[100px] -z-10 rounded-full" />
                
                <motion.div
                  animate={{ y: [-15, 15, -15] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-12 top-20 p-5 border border-white/10 bg-black/60 backdrop-blur-2xl z-20 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 relative">
                       <CheckCircle size={24} />
                       <div className="absolute inset-0 bg-green-400/20 blur-md rounded-xl animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">System Status</p>
                      <p className="text-sm font-bold text-white uppercase">Vault Synced</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <div className="space-y-12">
                <motion.div {...fadeInUp}>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <Fingerprint size={14} /> Unrivaled Performance
                  </div>
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] mb-6 font-display uppercase tracking-tight">
                    BUILT WITH <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-md">PURE SPEED.</span>
                  </h2>
                  <p className="text-lg text-gray-400 italic font-medium leading-relaxed">
                    Our Agency OS is engineered using a custom-developed stack for maximum conversion. No page builders. No bloat. No compromise.
                  </p>
                </motion.div>

                <motion.div 
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="whileInView"
                  className="space-y-6"
                >
                  {[
                    { title: 'Neural Caching', desc: 'Predictive data handling for instant load times that boost SEO.' },
                    { title: 'OS Dashboards', desc: 'Fully personalized, glass-morphic portal for every client you sign.' },
                    { title: 'Ecosystem Credits', desc: 'Refer founders and earn tier-based project credits automatically.' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      variants={fadeInUp}
                      className="flex gap-5 group p-5 rounded-3xl hover:bg-white/[0.03] border border-transparent hover:border-white/10 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 shrink-0">
                        <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-widest mb-1.5">{item.title}</h4>
                        <p className="text-sm text-gray-500 italic leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                  <Link to="/book-call" className="group inline-flex items-center justify-center h-16 px-10 text-lg font-bold text-white bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/[0.1] hover:border-blue-500/50 shadow-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all duration-300">
                    Deploy Architecture <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="py-32 relative z-10">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative p-12 md:p-24 rounded-[40px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-black/80 backdrop-blur-3xl text-center overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full" />
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />

              <div className="max-w-4xl mx-auto space-y-10 relative z-10">
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(37,99,235,0.4)] border border-white/20"
                >
                  <Rocket size={40} className="text-white" />
                </motion.div>
                
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-[0.9] font-display drop-shadow-xl">
                  THE FUTURE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">IS IN THE STACK.</span>
                </h2>
                
                <p className="text-xl md:text-2xl text-gray-400 italic  mx-auto leading-relaxed font-medium">
                  Don't settle for static. We build dynamic engines that capture leads and scale while you sleep.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                  <Link to="/book-call" className="group relative flex items-center justify-center h-16 px-12 text-lg font-bold text-white bg-blue-600 rounded-full overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] hover:-translate-y-1 transition-all duration-300">
                     <span className="relative z-10 flex items-center gap-2">Initialize OS Build Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                  </Link>
                  <Link to="/contact" className="group flex items-center justify-center h-16 px-12 text-lg font-bold text-white bg-transparent border border-white/20 rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300">
                    Contact Sales Team
                  </Link>
                </div>
                
                <div className="pt-10 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  <span className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5"><CheckCircle size={14} className="text-blue-500" /> 24h Support</span>
                  <span className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5"><CheckCircle size={14} className="text-blue-500" /> ISO-27001 Secure</span>
                  <span className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5"><CheckCircle size={14} className="text-blue-500" /> Weekly Audits</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}