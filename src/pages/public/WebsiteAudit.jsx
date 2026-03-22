import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Zap, AlertTriangle, CheckCircle, Smartphone, Shield, Layout, Settings, Star, TrendingUp, Info, Link } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { auditAPI } from '../../services/api';
import { Helmet } from 'react-helmet-async';

const scanSteps = [
  'Checking Server Response...',
  'Analyzing Meta Tags...',
  'Evaluating Image Optimization...',
  'Testing Mobile Responsiveness...',
  'Checking Security Certificates...',
  'Calculating Lighthouse Scores...'
];

export default function WebsiteAudit() {
  const [url, setUrl] = useState('');
  const [step, setStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState(null);

  const mutation = useMutation({
    mutationFn: (targetUrl) => auditAPI.audit(targetUrl),
    onSuccess: (resp) => {
      setReport(resp.data.data);
      setIsScanning(false);
    }
  });

  const startAudit = (e) => {
    e.preventDefault();
    if (!url) return;
    setIsScanning(true);
    setStep(0);
    setReport(null);

    // Simulate steps visual
    let s = 0;
    const interval = setInterval(() => {
      s++;
      if (s < scanSteps.length) {
        setStep(s);
      } else {
        clearInterval(interval);
        mutation.mutate(url);
      }
    }, 1200);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-500/10 border-green-500/20';
    if (score >= 70) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <>
      {/* 🔍 SEO */}
      <Helmet>
        <title>Free Website Audit Tool | SEO & Performance Checker</title>
        <meta
          name="description"
          content="Analyze your website performance, SEO, and mobile optimization instantly. Get a professional audit report in seconds."
        />
      </Helmet>

      <div className="pt-24 pb-24 bg-[#0a0a0f]">
        <div className="">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="badge badge-blue mb-4">AI Audit Tool</div>
            <h1 className="section-title text-4xl md:text-5xl mb-6">Free AI <span className="gradient-text">Website Audit</span></h1>
            <p className="text-xl text-[#9ca3af]">
              Enter your website URL and get a professional report on performance, SEO, and mobile experience within 30 seconds.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {!report && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-12 text-center"
              >
                <form onSubmit={startAudit} className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-2 top-1/2 -translate-y-1/2 text-[#6b7280]" size={15} />

                    <input
                      type="url"
                      placeholder="https://yourwebsite.com"
                      className="input-field ml-1 pl-12 h-16 text-lg"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary px-12 h-16 text-lg font-black no-underline justify-center shadow-glow-blue"
                  >
                    <Search size={22} className="mr-2" /> Start Scan
                  </button>
                </form>
                <div className="flex flex-wrap justify-center gap-8 text-[#6b7280] font-bold uppercase text-[10px] tracking-widest">
                  <div className="flex items-center gap-2"><CheckCircle size={14} className="text-[#3b82f6]" /> Performance</div>
                  <div className="flex items-center gap-2"><CheckCircle size={14} className="text-[#3b82f6]" /> SEO Score</div>
                  <div className="flex items-center gap-2"><CheckCircle size={14} className="text-[#3b82f6]" /> Mobile Optimization</div>
                </div>
              </motion.div>
            )}

            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-20 text-center flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="relative mb-12">
                  <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-[#3b82f6] animate-spin" />
                  <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#3b82f6] animate-pulse" size={32} />
                </div>
                <motion.h2
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  {scanSteps[step]}
                </motion.h2>
                <p className="text-[#9ca3af] animate-pulse">Scanning {url}...</p>
              </motion.div>
            )}

            {report && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                {/* Header Stats */}
                <div className="glass-card p-10 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-[#111118] to-[#0a0a0f] border-[#3b82f6]/20 border-2">
                  <div className="mb-6 md:mb-0">
                    <p className="text-xs text-[#9ca3af] uppercase font-bold tracking-widest mb-1">Audit Results for</p>
                    <h2 className="text-2xl font-bold text-white">{url}</h2>
                    <p className="text-xs text-[#6b7280] mt-2">Analyzed on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date().toLocaleTimeString('en-IN')}</p>
                  </div>
                  <button onClick={() => setReport(null)} className="btn-secondary h-12 text-sm justify-center">Scan Another Site</button>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    { label: 'Performance', score: report.scores.performance, icon: Zap },
                    { label: 'SEO', score: report.scores.seo, icon: Search },
                    { label: 'Accessibility', score: report.scores.accessibility, icon: Layout },
                    { label: 'Best Practices', score: report.scores.bestPractices, icon: Shield },
                    { label: 'Mobile', score: report.scores.mobile, icon: Smartphone }
                  ].map((s) => (
                    <div key={s.label} className={`glass-card p-6 text-center border-2 transition-transform hover:scale-105 ${getScoreBg(s.score)}`}>
                      <div className={`mb-4 mx-auto w-10 h-10 rounded-lg flex items-center justify-center ${getScoreColor(s.score)} bg-white/5`}>
                        <s.icon size={20} />
                      </div>
                      <p className={`text-3xl font-black mb-1 font-display ${getScoreColor(s.score)}`}>{s.score}</p>
                      <p className="text-[10px] text-white uppercase font-bold tracking-widest">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Issues List */}
                  <div className="lg:col-span-7 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <AlertTriangle size={24} className="text-orange-500" /> Key Issues Found
                    </h3>
                    <div className="space-y-4">
                      {report.issues.map((i, idx) => (
                        <div key={idx} className="glass-card p-6 flex gap-6 group hover:bg-white/2 transition-colors">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${i.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                            }`}>
                            <AlertTriangle size={18} />
                          </div>
                          <div>
                            <div className="flex gap-2 items-center mb-1">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${i.type === 'error' ? 'text-red-500 border-red-500/20' : 'text-orange-500 border-orange-500/20'
                                }`}>
                                {i.type}
                              </span>
                              <span className="text-xs text-[#6b7280] font-bold uppercase tracking-wider">{i.category}</span>
                            </div>
                            <p className="text-white font-bold">{i.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations Sidebar */}
                  <div className="lg:col-span-5 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <Settings size={24} className="text-[#3b82f6]" /> Recommendations
                    </h3>
                    <div className="glass-card p-8 bg-gradient-to-br from-[#111118] to-[#0a0a0f]">
                      <ul className="space-y-6">
                        {report.recommendations.map((r, idx) => (
                          <li key={idx} className="flex gap-4">
                            <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                              <CheckCircle size={14} strokeWidth={3} />
                            </div>
                            <span className="text-sm text-[#9ca3af] font-medium leading-relaxed">{r}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-10 pt-10 border-t border-white/5 text-center">
                        <p className="text-xs text-[#9ca3af] mb-10 leading-relaxed font-medium">
                          Struggling to fix these issues? Our team can optimize your website and improve your score to 90+ in just 48 hours.
                        </p>
                        <button
                          onClick={() => window.location.href = '/book-call'}
                          className="flex w-full items-center justify-center gap-2 py-4 btn-primary text-white"
                        >
                          Fix My Website <TrendingUp size={18} />
                        </button>
                        <p className="text-[10px] text-[#6b7280] font-bold mt-4 uppercase tracking-widest">Pricing starts at ₹4,999</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
