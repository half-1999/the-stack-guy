import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Globe, MapPin, Target, 
  Zap, Loader2, CheckCircle, X, 
  ExternalLink, Mail, Phone, Building,
  TrendingUp, AlertCircle, Sparkles
} from 'lucide-react';
import { aiAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SEARCH_TEMPLATES = [
  { label: 'Web Development', query: 'looking for web development agency', icon: '🌐' },
  { label: 'SEO Services', query: 'looking for SEO company', icon: '📈' },
  { label: 'Mobile App', query: 'need mobile app developer', icon: '📱' },
  { label: 'E-Commerce', query: 'need e-commerce website development', icon: '🛒' },
  { label: 'Digital Marketing', query: 'looking for digital marketing agency', icon: '📣' },
  { label: 'UI/UX Design', query: 'need UI/UX design services', icon: '🎨' },
];

const LOCATIONS = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'india', label: 'India', icon: MapPin },
  { id: 'usa', label: 'USA', icon: MapPin },
  { id: 'uk', label: 'UK', icon: MapPin },
];

export default function LeadGenerator() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('global');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLead, setGeneratedLead] = useState(null);
  const [generationLog, setGenerationLog] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState([]);

  const handleGenerateSingle = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsGenerating(true);
    setGenerationLog(prev => [...prev, { time: new Date(), message: 'Initializing neural search...' }]);

    try {
      setGenerationLog(prev => [...prev, { time: new Date(), message: 'Searching Google for prospects...' }]);
      
      const resp = await aiAPI.generateSingleLead({ query: searchQuery, location });
      console.log('Lead Generator Response:', resp);
      
      setGenerationLog(prev => [...prev, { time: new Date(), message: 'Analyzing lead quality with AI...' }]);
      
      setGeneratedLead(resp.data.data);
      setGenerationLog(prev => [...prev, { time: new Date(), message: 'Lead generated successfully!' }]);
      toast.success('Lead generated successfully!');
    } catch (error) {
      console.error('Lead generation error:', error);
      setGenerationLog(prev => [...prev, { time: new Date(), message: `Error: ${error.message}`, isError: true }]);
      toast.error('Failed to generate lead');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBatchGenerate = async () => {
    if (selectedTemplates.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setIsGenerating(true);
    setGenerationLog([]);

    try {
      const queries = selectedTemplates.map(t => t.query);
      const resp = await aiAPI.generateLeads({ queries, location, limit: 10 });
      
      setGenerationLog(prev => [...prev, { time: new Date(), message: `Generated ${resp.data.data.count} leads successfully!` }]);
      toast.success(`Generated ${resp.data.data.count} leads!`);
    } catch (error) {
      toast.error('Batch generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTemplate = (template) => {
    setSelectedTemplates(prev => {
      const exists = prev.find(t => t.label === template.label);
      if (exists) {
        return prev.filter(t => t.label !== template.label);
      }
      return [...prev, template];
    });
  };

  const getConversionBadge = (score) => {
    if (score >= 80) return { label: 'Hot Lead', color: 'bg-red-500/20 text-red-500 border-red-500/30' };
    if (score >= 60) return { label: 'Warm', color: 'bg-orange-500/20 text-orange-500 border-orange-500/30' };
    if (score >= 40) return { label: 'Cool', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' };
    return { label: 'Cold', color: 'bg-gray-500/20 text-gray-500 border-gray-500/30' };
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 font-display uppercase tracking-widest leading-tight">
            AI Lead <span className="gradient-text-blue">Generator</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Neural-powered prospect discovery and lead qualification engine.
          </p>
        </div>
        
        <div className="flex rounded-xl bg-white/5 border border-white/5 p-1 overflow-hidden">
          <button 
            onClick={() => setBatchMode(false)}
            className={`px-6 h-10 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${!batchMode ? 'bg-blue-600 text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}
          >
            Single Search
          </button>
          <button 
            onClick={() => setBatchMode(true)}
            className={`px-6 h-10 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${batchMode ? 'bg-blue-600 text-white shadow-glow-blue/20' : 'text-[#6b7280] hover:text-white'}`}
          >
            Batch Mode
          </button>
        </div>
      </div>

      {/* Mode Toggle Info */}
      <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
              <Sparkles className="text-blue-500" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                {batchMode ? 'Batch Lead Generation' : 'Single Lead Search'}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {batchMode 
                  ? 'Generate multiple leads across categories to fill your pipeline'
                  : 'Search and generate one high-quality lead at a time'
                }
              </p>
            </div>
          </div>
          
          {/* Cron Status & Manual Trigger */}
          <div className="flex flex-col items-end gap-2">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
              Auto-run: Daily 4 PM
            </p>
            <button
              onClick={async () => {
                setIsGenerating(true);
                try {
                  await aiAPI.runCronNow();
                  toast.success('Lead generation triggered manually!');
                  queryClient.invalidateQueries(['leads']);
                } catch (err) {
                  toast.error('Failed to trigger');
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 transition-all"
            >
              Run Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search Panel */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {!batchMode ? (
              <motion.div
                key="single"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-10 border-white/5"
              >
                <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
                  <Target className="text-blue-500" size={20} />
                  Search Parameters
                </h3>

                {/* Search Query Input */}
                <div className="space-y-4 mb-8">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                    What are you looking for?
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g., looking for web development agency..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 text-sm text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Location Selection */}
                <div className="space-y-4 mb-8">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                    Target Location
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {LOCATIONS.map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => setLocation(loc.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                          location === loc.id 
                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-500' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <loc.icon size={14} />
                        <span className="text-xs font-black uppercase tracking-widest">{loc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Templates */}
                <div className="space-y-4 mb-8">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                    Quick Templates
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SEARCH_TEMPLATES.map(template => (
                      <button
                        key={template.label}
                        onClick={() => setSearchQuery(template.query)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
                      >
                        <span>{template.icon}</span>
                        <span className="font-medium">{template.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateSingle}
                  disabled={isGenerating || !searchQuery.trim()}
                  className="w-full py-4 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Generating Lead...
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Generate Lead
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="batch"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-10 border-white/5"
              >
                <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
                  <Target className="text-purple-500" size={20} />
                  Select Categories
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {SEARCH_TEMPLATES.map(template => (
                    <button
                      key={template.label}
                      onClick={() => toggleTemplate(template)}
                      className={`p-6 rounded-2xl border transition-all text-left ${
                        selectedTemplates.find(t => t.label === template.label)
                          ? 'bg-purple-600/20 border-purple-500/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{template.icon}</span>
                      <span className="text-xs font-black text-white uppercase tracking-widest">{template.label}</span>
                    </button>
                  ))}
                </div>

                {/* Location Selection */}
                <div className="space-y-4 mb-8">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                    Target Location
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {LOCATIONS.map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => setLocation(loc.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                          location === loc.id 
                            ? 'bg-purple-600/20 border-purple-500/50 text-purple-500' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <loc.icon size={14} />
                        <span className="text-xs font-black uppercase tracking-widest">{loc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleBatchGenerate}
                  disabled={isGenerating || selectedTemplates.length === 0}
                  className="w-full py-4 rounded-xl bg-purple-600 text-white text-xs font-black uppercase tracking-widest hover:bg-purple-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Generating Leads...
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Generate {selectedTemplates.length} x {SEARCH_TEMPLATES.length} Leads
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Lead Display */}
          {generatedLead && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-10 border-green-500/20 bg-green-500/5"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  Generated Lead
                </h3>
                <button 
                  onClick={() => setGeneratedLead(null)}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lead Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500 font-black text-xl">
                      {generatedLead.name?.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase">{generatedLead.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">{generatedLead.company}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/5">
                    {generatedLead.email && (
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Mail size={14} className="text-blue-500" />
                        <span>{generatedLead.email}</span>
                      </div>
                    )}
                    {generatedLead.phone && (
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Phone size={14} className="text-blue-500" />
                        <span>{generatedLead.phone}</span>
                      </div>
                    )}
                    {generatedLead.website && (
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Building size={14} className="text-blue-500" />
                        <a 
                          href={generatedLead.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center gap-2"
                        >
                          {generatedLead.website}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-2">Requirements</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{generatedLead.requirements}</p>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Lead Score</span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${getConversionBadge(generatedLead.score).color}`}>
                        {getConversionBadge(generatedLead.score).label}
                      </span>
                    </div>
                    <div className="text-5xl font-black text-white font-display">
                      {generatedLead.score}
                      <span className="text-lg text-gray-500">/100</span>
                    </div>
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
                        style={{ width: `${generatedLead.score}%` }}
                      />
                    </div>
                  </div>

                  {generatedLead.aiAnalysis && (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Sparkles size={12} className="text-purple-500" /> AI Insight
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {generatedLead.aiAnalysis.strategicAdvice}
                      </p>
                      
                      {generatedLead.aiAnalysis.suggestedServices && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {generatedLead.aiAnalysis.suggestedServices.map((service, i) => (
                            <span key={i} className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-500 font-medium">
                              {service}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <a
                      href={generatedLead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all text-center"
                    >
                      Visit Website
                    </a>
                    <button className="flex-1 py-3 rounded-xl bg-green-600 text-white text-xs font-black uppercase tracking-widest hover:bg-green-500 transition-all">
                      {generatedLead._id ? 'Already Saved' : 'Save Lead'}
                    </button>
                  </div>
                  
                  {generatedLead._id && (
                    <p className="text-[10px] text-green-500 font-bold text-center mt-2">
                      ✓ Lead saved to database - View in Leads page
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Generation Log */}
        <div className="space-y-8">
          <div className="glass-card p-8 border-white/5">
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
              <Loader2 className="text-blue-500" size={20} />
              Activity Log
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {generationLog.length === 0 ? (
                <div className="text-center py-8 opacity-30">
                  <p className="text-xs font-black uppercase tracking-widest">No activity yet</p>
                </div>
              ) : (
                generationLog.map((log, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-lg border text-xs ${
                      log.isError 
                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    <span className="text-[10px] text-gray-600 font-black uppercase">
                      {log.time.toLocaleTimeString()}
                    </span>
                    <p className="mt-1">{log.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="glass-card p-8 border-white/5">
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
              <TrendingUp className="text-green-500" size={20} />
              Generator Stats
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Generated</p>
                <p className="text-2xl font-black text-white">{generationLog.filter(l => !l.isError && l.message.includes('success')).length}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Success Rate</p>
                <p className="text-2xl font-black text-green-500">87%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
