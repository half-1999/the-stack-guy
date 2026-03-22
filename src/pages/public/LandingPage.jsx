import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap, Shield, Rocket, Clock, MessageSquare,
  ArrowRight, Star, CheckCircle, Smartphone,
  Globe, Layout, Users, Play, Award,
  Activity, Sparkles, Heart, ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const stats = [
  { label: 'High-Impact Delivery', value: '500+', icon: Rocket },
  { label: 'Global Founders', value: '120+', icon: Globe },
  { label: 'Avg. Launch Time', value: '48h', icon: Clock },
  { label: 'Uptime Stability', value: '99.9%', icon: Activity }
];

const videoTestimonials = [
  { id: 1, name: 'Arjun Varma', role: 'CEO, Fintech Hub', videoThumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', duration: '0:45' },
  { id: 2, name: 'Priya Das', role: 'Founder, EcoScale', videoThumb: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', duration: '1:12' },
  { id: 3, name: 'Siddharth M.', role: 'Head of Product', videoThumb: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', duration: '0:58' }
];

export default function LandingPage() {
  return (
    <>
      {/* ✅ SEO OPTIMIZATION */}
      <Helmet>
        <title>The Stack Guy | High-Performance Business Websites</title>
        <meta name="description" content="Launch your business online in 48 hours with high-performance MERN stack systems built for scale, SEO, and conversions." />
      </Helmet>

      <div className="bg-[#050508] selection:bg-blue-500/30">
        {/* Dynamic Background Noise */}
        <div className="noise-overlay" />

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent -z-10 blur-[120px]" />
          <div className="container-custom">
            <div className="text-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-white/10 text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-10 shadow-glow-blue/10"
              >
                <Sparkles size={14} className="animate-pulse" /> The Sovereign Operating System for Founders
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-10 font-display uppercase tracking-tight leading-[0.9]"
              >
                STOP BUILDING <br />
                <span className="gradient-text-trust">WEBSITES.</span> <br />
                LAUNCH <span className="italic font-light">SYSTEMS.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl text-gray-400 mb-16 italic font-medium leading-relaxed max-w-2xl mx-auto"
              >
                Professional business operating systems delivered in 48 hours. Built for high-performance scale, not just simple clicks.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <Link to="/book-call" className="btn-primary h-16 px-12 text-lg no-underline justify-center shadow-glow-blue/20">
                  <Zap size={22} /> Initialize Your Project
                </Link>
                <Link to="/portfolio" className="btn-os h-16 px-12 text-lg no-underline justify-center border-white/10 hover:border-white/20">
                  Audit Our Work
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* High-Trust Stats Bar */}
        <section className="py-20 border-y border-white/5 bg-[#0a0a0f]/50 backdrop-blur-xl">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 mx-auto border border-white/5">
                    <stat.icon size={20} />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black text-white font-display tracking-tighter leading-none">{stat.value}</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Reel/Video Testimonials Section */}
        <section className="section overflow-hidden">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 font-display uppercase tracking-tight">
                  TRUST IS <span className="gradient-text-blue">VERIFIED.</span>
                </h2>
                <p className="text-lg text-gray-500 italic">Watch real founders share their scaling journey with THE STACK GUY OS.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-white uppercase tracking-widest">
                  <Heart size={14} className="text-red-500" /> Instagram Proof
                </div>
              </div>
            </div>

            <div className="carousel-container no-scrollbar">
              {videoTestimonials.map((v) => (
                <motion.div
                  key={v.id}
                  className="carousel-item glass-card-premium rounded-[40px] overflow-hidden group border-white/10 bg-white/[0.01]"
                  whileHover={{ y: -10 }}
                >
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <img src={v.videoThumb} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                        <Play size={40} fill="white" />
                      </div>
                    </div>
                    <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black text-white">
                      {v.duration}
                    </div>
                    <div className="absolute bottom-8 left-8">
                      <h4 className="text-xl font-black text-white uppercase tracking-widest mb-1">{v.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{v.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured UI/UX Display */}
        <section className="section bg-[#0a0a0f]/50">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-card p-1 rounded-[60px] border-white/5 shadow-2xl relative z-10 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" className="rounded-[59px] w-full" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent pointer-events-none" />
                </div>
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -right-10 top-20 glass-card p-6 border-white/10 bg-black/80 backdrop-blur-2xl z-20 rounded-3xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Status</p>
                      <p className="text-sm font-bold text-white uppercase">Vault Synced</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <div className="space-y-12">
                <motion.div {...fadeInUp}>
                  <div className="badge badge-blue mb-6">Unrivaled Performance</div>
                  <h2 className="text-4xl md:text-7xl font-black text-white leading-none mb-8 font-display uppercase tracking-tight">
                    BUILT WITH <span className="gradient-text-blue">PURE SPEED.</span>
                  </h2>
                  <p className="text-lg text-gray-400 italic mb-12">
                    Our Agency OS is engineered using a custom-developed stack for maximum conversion. No page builders. No bloat. No compromise.
                  </p>
                </motion.div>

                <div className="space-y-8">
                  {[
                    { title: 'Neural Caching', desc: 'Predictive data handling for instant load times.' },
                    { title: 'OS Dashboards', desc: 'Fully personalized portal for every client you sign.' },
                    { title: 'Ecosystem Credits', desc: 'Refer friends and earn ₹5,000 in project credit instantly.' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-6 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-widest mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-500 italic">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                  <Link to="/book-call" className="btn-primary h-16 px-12 text-lg no-underline justify-center group">
                    Start Your Build <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Certifications */}
        <section className="py-20 bg-white/[0.02]">
          <div className="container-custom">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-20 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-3 text-white font-black uppercase text-xl tracking-tighter italic">
                <Shield size={32} /> ISO-27001 SECURE
              </div>
              <div className="flex items-center gap-3 text-white font-black uppercase text-xl tracking-tighter italic">
                <Award size={32} /> TOP FREELANCER 2026
              </div>
              <div className="flex items-center gap-3 text-white font-black uppercase text-xl tracking-tighter italic">
                <Globe size={32} /> 12+ COUNTRIES
              </div>
              <div className="flex items-center gap-3 text-white font-black uppercase text-xl tracking-tighter italic">
                <Zap size={32} /> 48H GUARANTEE
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="section pb-32">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card-premium p-16 md:p-32 rounded-[60px] border-blue-500/20 text-center relative overflow-hidden group shadow-glow-blue/10"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 -z-10 group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />

              <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-glow-blue animate-float">
                  <Rocket size={48} className="text-white" />
                </div>
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tight leading-[0.85] font-display">
                  THE FUTURE <br /> <span className="gradient-text-blue">IS IN THE STACK.</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-500 italic max-w-2xl mx-auto leading-relaxed font-medium">
                  Don't settle for static. We build dynamic engines that capture leads and scale while you sleep.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/book-call" className="btn-primary h-18 px-16 text-xl no-underline justify-center shadow-2xl">
                    Initialize OS Build Now
                  </Link>
                  <Link to="/contact" className="btn-os h-18 px-16 text-xl no-underline justify-center border-white/10 hover:border-white/20">
                    Contact Sales Team
                  </Link>
                </div>
                <div className="pt-8 flex items-center justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">
                  <span className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> 24h Support</span>
                  <span className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> Multi-Currency</span>
                  <span className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> Weekly Audits</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
