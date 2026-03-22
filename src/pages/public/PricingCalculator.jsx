import { useState, useMemo, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle, Globe, Layout, Shield, Rocket, Clock, Info, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { leadsAPI } from '../../services/api';


function LaptopDemo({ pages = 1, features = [], loading = false }) {
  // Prepare page labels dynamically
  const pageLabels = ['Home', 'About', 'Contact'];
  const displayedPages = pageLabels.slice(0, pages);

  return (
    <div className="relative w-full max-w-3xl mx-auto p-6 rounded-xl shadow-xl bg-black/5">
      {/* Laptop Screen */}
      <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center gap-2 animate-pulse"
            >
              {/* Skeleton blocks for pages */}
              {Array.from({ length: pages }).map((_, i) => (
                <div
                  key={i}
                  className="w-3/4 h-6 bg-gray-700 rounded-lg"
                ></div>
              ))}
              <span className="text-gray-500 text-sm mt-2">Loading Preview...</span>
            </motion.div>
          ) : (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-white text-lg font-bold"
            >
              {displayedPages.map((p, i) => (
                <div
                  key={i}
                  className="w-3/4 h-8 bg-gray-800 rounded-md flex items-center justify-center"
                >
                  {p} Page
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {features.length > 0 ? (
          features.map((f, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold"
            >
              {f}
            </motion.span>
          ))
        ) : (
          <span className="text-gray-500 text-sm italic">No additional features selected</span>
        )}
      </div>
    </div>
  );
}


const baseProjects = [
  { id: 'landing', label: 'Landing Page', price: 999, icon: Layout, desc: 'Single scroll high conversion page.' },
  { id: 'business', label: 'Business Website', price: 2999, icon: Globe, desc: 'Multi-page professional presence.' },
  { id: 'ecommerce', label: 'E-commerce Store', price: 3999, icon: Shield, desc: 'Full-featured online store with payments.' },
  { id: 'saas', label: 'SaaS Platform', price: 4999, icon: Rocket, desc: 'Complex web app with dashboard & auth.' }
];

const featureAddons = [
  { id: 'auth', label: 'User Authentication', price: 1599 },
  { id: 'ecommerce', label: 'E-commerce Engine', price: 2999 },
  { id: 'realtime', label: 'Real-time Chat', price: 1999 },
  { id: 'ai', label: 'AI Integration', price: 2999 },
  { id: 'booking', label: 'Appointment System', price: 1999 },
  { id: 'seo', label: 'Advanced SEO Meta', price: 999 },
  { id: 'blog', label: 'Blog System', price: 1999 },
  { id: 'pwa', label: 'PWA (Installable App)', price: 1999 }
];

export default function PricingCalculator() {
  const [selectedBase, setSelectedBase] = useState(baseProjects[1]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [urgency, setUrgency] = useState(false);
  const navigate = useNavigate();

  const quoteIdRef = useRef(Math.random().toString(36).substring(7).toUpperCase());

  // 🔥 O(1) lookup map
  const featureMap = useMemo(() => {
    const map = {};
    featureAddons.forEach(f => (map[f.id] = f));
    return map;
  }, []);

  const totalPrice = useMemo(() => {
    let total = selectedBase.price;

    // Add page cost
    if (pageCount > 0) {
      total += 100; // first page (static)
      if (pageCount > 1) {
        total += (pageCount - 1) * 1999; // additional dynamic pages
      }
    }

    // Add features
    selectedFeatures.forEach(id => {
      total += featureMap[id]?.price || 0;
    });

    // Bundle discount
    if (selectedFeatures.length >= 3) total *= 0.9;

    // Urgency
    if (urgency) total *= 1.15;

    return Math.round(total);
  }, [selectedBase, selectedFeatures, pageCount, urgency, featureMap]);

  const toggleFeature = useCallback((id) => {
    setSelectedFeatures(prev =>
      prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  }, []);

  const handleBookCall = async () => {
    try {
      // Build full project summary
      const pageSummary = pageCount > 0
        ? `Pages: ${pageCount} (1 static + ${pageCount - 1} dynamic)`
        : 'Pages: None';

      const featuresSummary = selectedFeatures.length > 0
        ? selectedFeatures.map(id => featureMap[id]?.label).join(', ')
        : 'No additional features';

      const urgencySummary = urgency ? 'Fast Track Delivery (2-3 Days)' : 'Standard Delivery';

      const description = `
Project Type: ${selectedBase.label}
${pageSummary}
Features: ${featuresSummary}
Delivery: ${urgencySummary}
Total Estimated Price: ₹${totalPrice.toLocaleString('en-IN')}
Quote ID: ${quoteIdRef.current}
      `;

      // Send lead to API
      const response = await leadsAPI.create({
        name: 'Guest User ',
        email: '',
        phone: '',
        projectType: selectedBase.label,
        budget: totalPrice,
        message: description,
        source: 'pricing',
      });
      console.log(response);

      // Only navigate if success is true
      if (response?.success) {
        navigate('/book-call');
      } else {
        console.error('Lead creation failed:', response);
      }

      // Redirect to booking page
      navigate('/book-call');
    } catch (err) {
      console.error('Error creating lead:', err);
    }
  };
  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Pricing Calculator | The Stack Guy</title>
        <meta name="description" content="Estimate your website or SaaS cost instantly with our interactive pricing calculator." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Web Development Pricing Calculator",
            "provider": "The Stack Guy"
          })}
        </script>
      </Helmet>

      <div className="pt-32 pb-24 bg-[#0a0a0f]">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="badge badge-blue mb-4">Pricing Estimation</div>
            <h1 className="section-title text-4xl md:text-5xl mb-6">Interactive <span className="gradient-text">Pricing Calculator</span></h1>
            <p className="text-xl text-[#9ca3af]">
              Select your requirements and get an instant ballpark estimate. No sales calls needed for initial pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Controls Side */}
            <div className="lg:col-span-8 space-y-12">
              {/* 1. Base Project Selection */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-sm font-black">1</span>
                  What are you building?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {baseProjects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedBase(p)}
                      className={`glass-card p-6 text-left flex items-start gap-4 transition-all border-2 ${selectedBase.id === p.id
                        ? 'border-[#3b82f6] bg-[#3b82f6]/5 shadow-glow-blue'
                        : 'border-white/5 hover:border-white/10'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedBase.id === p.id ? 'bg-[#3b82f6] text-white' : 'bg-white/5 text-[#9ca3af]'
                        }`}>
                        <p.icon size={24} />
                      </div>
                      <div>
                        <h4 className={`font-bold mb-1 ${selectedBase.id === p.id ? 'text-white' : 'text-[#9ca3af]'}`}>{p.label}</h4>
                        <p className="text-xs text-[#6b7280] leading-normal">{p.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Page Count */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-sm font-black">2</span>
                  How many pages?
                </h3>
                <div className="glass-card p-8 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold mb-1">Number of Pages</h4>
                    <p className="text-xs text-[#9ca3af]">Minimum 1 (Home). Each additional page adds ₹2,000.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setPageCount(Math.max(1, pageCount - 1))}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5 text-white"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-3xl font-black text-white font-display w-12 text-center">{pageCount}</span>
                    <button
                      onClick={() => setPageCount(pageCount + 1)}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5 text-white"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Features Selection */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-sm font-black">3</span>
                  Select Advanced Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featureAddons.map((f) => (
                    <label
                      key={f.id}
                      className={`glass-card p-6 cursor-pointer flex items-center justify-between border-2 transition-all group ${selectedFeatures.includes(f.id)
                        ? 'border-[#39ff14]/40 bg-[#39ff14]/5'
                        : 'border-white/5 hover:border-white/10 shadow-glow-green/10'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${selectedFeatures.includes(f.id) ? 'bg-[#39ff14] text-[#0a0a0f]' : 'bg-white/5 text-[#6b7280]'
                          }`}>
                          {selectedFeatures.includes(f.id) && <CheckCircle size={16} strokeWidth={3} />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={selectedFeatures.includes(f.id)}
                          onChange={() => toggleFeature(f.id)}
                        />
                        <div>
                          <h4 className={`font-bold text-sm ${selectedFeatures.includes(f.id) ? 'text-white' : 'text-[#9ca3af]'}`}>{f.label}</h4>
                          <p className="text-[10px] text-[#6b7280] uppercase font-bold tracking-widest">+₹{f.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <LaptopDemo
                pages={pageCount}
                features={selectedFeatures.map(id => featureMap[id].label)}
                loading={false}
                className="w-full max-w-3xl mx-auto"
              />

              {/* 4. Speed Delivery */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-sm font-black">4</span>
                  Delivery Speed
                </h3>
                <div
                  onClick={() => setUrgency(!urgency)}
                  className={`glass-card p-8 cursor-pointer flex items-center justify-between border-2 transition-all ${urgency ? 'border-orange-500/40 bg-orange-500/5 shadow-glow-orange' : 'border-white/5 hover:border-white/10'
                    }`}
                >
                  <div className="flex gap-6 items-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${urgency ? 'bg-orange-500 text-white animate-pulse' : 'bg-white/5 text-[#9ca3af]'
                      }`}>
                      <Clock size={32} />
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold mb-1 ${urgency ? 'text-white' : 'text-[#9ca3af]'}`}>Fast Track Delivery (2-3 Days)</h4>
                      <p className="text-sm text-[#6b7280]">Skip the queue and get your project delivered on priority. (+30% Service Fee)</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-4 ${urgency ? 'border-orange-500 bg-orange-500' : 'border-white/10'}`} />
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                <div className="glass-card p-10 bg-gradient-to-br from-[#111118] to-[#0a0a0f] border-[#3b82f6]/30 border-2">
                  <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4 uppercase tracking-tighter">Project Summary</h3>

                  <div className="space-y-4 mb-10 pb-10 border-b border-white/5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#9ca3af]">Base: {selectedBase.label}</span>
                      <span className="text-white font-bold">₹{selectedBase.price.toLocaleString('en-IN')}</span>
                    </div>
                    {pageCount > 1 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#9ca3af]">Pages: {pageCount} (Home + {pageCount - 1})</span>
                        <span className="text-white font-bold">₹{((pageCount - 1) * 2000).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {selectedFeatures.map(fId => {
                      const f = featureAddons.find(a => a.id === fId);
                      return (
                        <div key={fId} className="flex justify-between items-center text-sm">
                          <span className="text-[#9ca3af]">{f.label}</span>
                          <span className="text-white font-bold">₹{f.price.toLocaleString('en-IN')}</span>
                        </div>
                      );
                    })}
                    {urgency && (
                      <div className="flex justify-between items-center text-sm text-orange-400 font-bold">
                        <span className="flex items-center gap-1"><Clock size={14} /> Priority Boost</span>
                        <span>+30%</span>
                      </div>
                    )}
                  </div>

                  <div className="text-center mb-10">
                    <p className="text-xs text-[#9ca3af] uppercase font-bold tracking-widest mb-2">Estimated Total Investment</p>
                    <p className="text-6xl font-black text-white font-display mb-2">₹{totalPrice.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-[#6b7280] font-bold">ESTIMATED BALLPARK QUOTE</p>
                  </div>

                  <div className="space-y-4 text-xs text-[#6b7280] p-4 bg-white/2 rounded-xl border border-white/5 mb-8">
                    <p className="flex items-center gap-2"><CheckCircle size={10} className="text-[#10b981]" /> Includes 1 Month Support</p>
                    <p className="flex items-center gap-2"><CheckCircle size={10} className="text-[#10b981]" /> Includes Hosting Configuration</p>
                    <p className="flex items-center gap-2"><CheckCircle size={10} className="text-[#10b981]" /> Clean Modern Source Code</p>
                  </div>

                  <button
                    onClick={handleBookCall}
                    className="btn-primary w-full justify-center py-5 text-xl font-black mb-4 no-underline"
                  >
                    <Zap size={20} /> Book Discovery Call
                  </button>
                  <p className="text-center text-[10px] text-[#6b7280] font-bold uppercase tracking-widest">
                    Quote ID: {Math.random().toString(36).substring(7).toUpperCase()}
                  </p>
                </div>

                <div className="glass-card p-6 flex flex-col items-center gap-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#9ca3af]">
                    <Info size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Custom Requirements?</h4>
                    <p className="text-[10px] text-[#9ca3af] leading-relaxed">
                      If your project is complex or unique, please <Link to="/contact" className="text-blue-500 font-black hover:underline underline-offset-4">contact us directly</Link> for a custom proposal within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}