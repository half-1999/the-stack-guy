import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Play, Pause, Zap, Clock, CheckCircle, AlertCircle,
  RefreshCw, History, Calendar, FileText, AlertTriangle,
  Code, Lightbulb, Sparkles, Eye, Send, ExternalLink
} from 'lucide-react';
import { blogSchedulerAPI, blogAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function AutoBlog() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const now = useMemo(() => new Date(), []);
  const currentHour = now.getHours();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ['scheduler-status'],
    queryFn: async () => {
      try {
        const resp = await blogSchedulerAPI.status();
        return resp.data.data;
      } catch (err) {
        return {
          isRunning: true,
          dailyCount: 0,
          lastRun: null,
          history: [],
          nextTopic: null
        };
      }
    },
    refetchInterval: 60000
  });

  const { data: allBlogs = [] } = useQuery({
    queryKey: ['all-blogs'],
    queryFn: async () => {
      try {
        const resp = await blogAPI.getAll();
        return resp.data.data || [];
      } catch (err) {
        return [];
      }
    }
  });

  const todayBlogs = useMemo(() => {
    return allBlogs.filter(blog => {
      const blogDate = new Date(blog.publishedAt);
      return blogDate >= todayStart;
    }).sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
  }, [allBlogs, todayStart]);

  const { data: topics } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      try {
        const resp = await blogSchedulerAPI.getTopics();
        return resp.data.data;
      } catch (err) {
        return { errors: [], projects: [], todayTopics: [] };
      }
    }
  });

  const { data: history = [] } = useQuery({
    queryKey: ['scheduler-history'],
    queryFn: async () => {
      try {
        const resp = await blogSchedulerAPI.history(20);
        return resp.data.data || [];
      } catch (err) {
        return [];
      }
    }
  });

  const startMutation = useMutation({
    mutationFn: () => blogSchedulerAPI.start(),
    onSuccess: () => queryClient.invalidateQueries(['scheduler-status'])
  });

  const stopMutation = useMutation({
    mutationFn: () => blogSchedulerAPI.stop(),
    onSuccess: () => queryClient.invalidateQueries(['scheduler-status'])
  });

  const previewMutation = useMutation({
    mutationFn: (topic) => blogSchedulerAPI.preview(topic),
    onSuccess: (data) => {
      setPreviewData(data.data);
      setShowPreview(true);
    }
  });

  const publishMutation = useMutation({
    mutationFn: ({ blogData, topic }) => blogSchedulerAPI.publish(blogData, topic),
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduler-status']);
      queryClient.invalidateQueries(['scheduler-history']);
      queryClient.invalidateQueries(['admin-posts']);
      queryClient.invalidateQueries(['all-blogs']);
      setShowPreview(false);
      setPreviewData(null);
      setSelectedTopic(null);
    }
  });

  const setNextTopicMutation = useMutation({
    mutationFn: (topic) => blogSchedulerAPI.setNextTopic(topic),
    onSuccess: () => queryClient.invalidateQueries(['scheduler-status'])
  });

  const timeSlots = [
    { time: '10:00 AM', label: 'Morning Post', hour: 10, key: 0 },
    { time: '2:00 PM', label: 'Afternoon Post', hour: 14, key: 1 },
    { time: '7:00 PM', label: 'Evening Post', hour: 19, key: 2 }
  ];

  const visibleSlots = timeSlots.filter(slot => slot.hour > currentHour || slot.hour === currentHour);
  const isAllPosted = todayBlogs.length >= 3;

  const getSlotStatus = (slotKey) => {
    if (todayBlogs[slotKey]) {
      return { status: 'posted', blog: todayBlogs[slotKey] };
    }
    if (slotKey < Math.floor((currentHour - 10) / 4) + (currentHour >= 10 ? 1 : 0) && currentHour >= 10) {
      return { status: 'skipped' };
    }
    return { status: 'pending' };
  };

  if (statusLoading) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase leading-tight">
            Auto <span className="gradient-text">Blog Engine</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Generate MERN content • Preview • Publish
          </p>
        </div>

        <div className="flex items-center gap-4">
          {status?.isRunning ? (
            <button
              onClick={() => stopMutation.mutate()}
              disabled={stopMutation.isPending}
              className="btn-danger h-12 text-xs no-underline font-black uppercase tracking-widest px-6 flex items-center gap-2"
            >
              <Pause size={16} />
              Pause
            </button>
          ) : (
            <button
              onClick={() => startMutation.mutate()}
              disabled={startMutation.isPending}
              className="btn-primary h-12 text-xs no-underline font-black uppercase tracking-widest px-6 flex items-center gap-2 shadow-glow-blue/20"
            >
              <Play size={16} />
              Start
            </button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard
          icon={status?.isRunning ? Zap : AlertCircle}
          label="Status"
          value={status?.isRunning ? 'Active' : 'Paused'}
          color={status?.isRunning ? 'green' : 'red'}
          subtext={status?.isRunning ? 'Auto-posting enabled' : 'Scheduler stopped'}
        />
        <StatusCard
          icon={FileText}
          label="Today's Posts"
          value={`${todayBlogs.length}/3`}
          color={todayBlogs.length === 3 ? 'green' : 'blue'}
          subtext={todayBlogs.length === 3 ? 'All done!' : `${3 - todayBlogs.length} remaining`}
        />
        <StatusCard
          icon={Calendar}
          label="Current Time"
          value={now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          color="purple"
          subtext={now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
        />
        <StatusCard
          icon={Clock}
          label="Last Post"
          value={status?.lastRun ? new Date(status.lastRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          color="yellow"
          subtext="Previous execution"
        />
      </div>

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase">Blog Preview</h2>
              <button
                onClick={() => { setShowPreview(false); setPreviewData(null); }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs text-blue-400 font-black uppercase">{previewData.category}</span>
                <h3 className="text-2xl font-bold text-white mt-2">{previewData.title}</h3>
                <p className="text-gray-400 mt-2">{previewData.excerpt}</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                <div 
                  className="prose prose-invert max-w-none text-gray-300 text-sm"
                  dangerouslySetInnerHTML={{ __html: previewData.content }}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {previewData.tags?.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10 flex gap-4">
              <button
                onClick={() => { setShowPreview(false); setPreviewData(null); }}
                className="flex-1 btn-secondary h-12 text-xs font-black uppercase"
              >
                Cancel
              </button>
              <button
                onClick={() => publishMutation.mutate({ 
                  blogData: previewData, 
                  topic: selectedTopic 
                })}
                disabled={publishMutation.isPending}
                className="flex-1 btn-primary h-12 text-xs font-black uppercase flex items-center justify-center gap-2"
              >
                <Send size={16} />
                {publishMutation.isPending ? 'Publishing...' : 'Publish Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Topic Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Topic Override */}
          <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white uppercase tracking-widest text-xs">Next Topic (Optional)</h3>
              {status?.nextTopic && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle size={12} /> Custom topic set
                </span>
              )}
            </div>
            
            {status?.nextTopic ? (
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                <div>
                  <p className="text-white font-medium">{status.nextTopic.title}</p>
                  <p className="text-xs text-gray-500">{status.nextTopic.category} • {status.nextTopic.type}</p>
                </div>
                <button
                  onClick={() => setNextTopicMutation.mutate(null)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Select a topic for next post (or leave empty for auto):</p>
                <div className="grid grid-cols-2 gap-3">
                  {topics?.errors?.slice(0, 4).map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => setNextTopicMutation.mutate(topic)}
                      disabled={setNextTopicMutation.isPending}
                      className="text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={12} className="text-red-400" />
                        <span className="text-xs text-red-400 font-black uppercase">Error</span>
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-2">{topic.title}</p>
                    </button>
                  ))}
                  {topics?.projects?.slice(0, 4).map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => setNextTopicMutation.mutate(topic)}
                      disabled={setNextTopicMutation.isPending}
                      className="text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb size={12} className="text-cyan-400" />
                        <span className="text-xs text-cyan-400 font-black uppercase">Project</span>
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-2">{topic.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generate & Preview */}
          <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white uppercase tracking-widest text-xs">Generate & Preview</h3>
              {currentHour < 10 && (
                <span className="text-xs text-yellow-400 flex items-center gap-1">
                  <Clock size={12} /> Available after 10 AM
                </span>
              )}
              {isAllPosted && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle size={12} /> All 3 posted today
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Choose a topic and preview before publishing:</p>
              <div className="grid grid-cols-1 gap-3 max-h-[250px] overflow-y-auto">
                {[...(topics?.errors || []), ...(topics?.projects || [])].map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTopic(topic)}
                    disabled={previewMutation.isPending || currentHour < 10 || isAllPosted}
                    className={`text-left p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5 ${selectedTopic?.title === topic.title ? 'border-blue-500/50 bg-blue-500/10' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {topic.type === 'error' ? (
                        <AlertTriangle size={12} className="text-red-400" />
                      ) : (
                        <Code size={12} className="text-cyan-400" />
                      )}
                      <span className={`text-[10px] font-black uppercase ${topic.type === 'error' ? 'text-red-400' : 'text-cyan-400'}`}>
                        {topic.type}
                      </span>
                      <span className="text-[10px] text-gray-500">• {topic.category}</span>
                    </div>
                    <p className="text-sm text-gray-200 line-clamp-2">{topic.title}</p>
                  </button>
                ))}
              </div>
              
              {selectedTopic && !isAllPosted && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => previewMutation.mutate(selectedTopic)}
                    disabled={previewMutation.isPending || currentHour < 10}
                    className="flex-1 btn-primary h-12 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow-blue/20 disabled:opacity-50"
                  >
                    <Eye size={16} />
                    {previewMutation.isPending ? 'Generating...' : 'Preview Blog'}
                  </button>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="px-6 h-12 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 text-xs font-black uppercase"
                  >
                    Cancel
                  </button>
                </div>
              )}
              
              {currentHour < 10 && (
                <p className="text-xs text-yellow-500 mt-2">
                  Blog generation is available from 10:00 AM onwards.
                </p>
              )}
              
              {isAllPosted && (
                <p className="text-xs text-green-500 mt-2">
                  ✓ All 3 blogs have been posted today. Come back tomorrow!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: History */}
        <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <History size={18} className="text-blue-400" />
            <h3 className="text-lg font-black text-white uppercase tracking-widest text-xs">Published Today</h3>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {todayBlogs.length > 0 ? (
              todayBlogs.map((blog, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                  className="w-full text-left p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-green-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={12} className="text-green-400" />
                      <span className="text-[9px] font-black uppercase text-green-400">Posted</span>
                    </div>
                    <ExternalLink size={14} className="text-gray-500" />
                  </div>
                  <p className="text-sm text-white font-medium line-clamp-2 mb-1">{blog.title}</p>
                  <p className="text-[10px] text-gray-500">
                    {new Date(blog.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
              ))
            ) : (
              <div className="text-center py-10">
                <FileText size={40} className="text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No blogs posted today</p>
                <p className="text-gray-600 text-xs">Generate and preview to publish</p>
              </div>
            )}
          </div>

          <button
            onClick={() => { queryClient.invalidateQueries(['scheduler-history']); queryClient.invalidateQueries(['all-blogs']); }}
            className="w-full mt-4 p-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 text-xs font-black uppercase flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar size={18} className="text-purple-400" />
          <h3 className="text-lg font-black text-white uppercase tracking-widest text-xs">Today's Schedule</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleSlots.length > 0 ? (
            visibleSlots.map((slot) => {
              const slotInfo = getSlotStatus(slot.key);
              const isPosted = slotInfo.status === 'posted';
              const isSkipped = slotInfo.status === 'skipped';
              const isPending = slotInfo.status === 'pending';
              
              return (
                <div key={slot.key} className={`p-6 rounded-2xl border ${isPosted ? 'bg-green-500/10 border-green-500/20' : isSkipped ? 'bg-gray-500/10 border-gray-500/20' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <Clock size={16} className={isPosted ? 'text-green-400' : isSkipped ? 'text-gray-500' : 'text-blue-400'} />
                    {isPosted ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : isSkipped ? (
                      <AlertCircle size={16} className="text-gray-500" />
                    ) : (
                      <Sparkles size={16} className="text-blue-400" />
                    )}
                  </div>
                  <p className="text-white font-black text-lg">{slot.time}</p>
                  <p className="text-xs text-gray-500 uppercase mt-1">{slot.label}</p>
                  
                  {isPosted && slotInfo.blog && (
                    <button
                      onClick={() => navigate(`/blog/${slotInfo.blog.slug}`)}
                      className="w-full mt-4 text-xs text-green-400 hover:text-green-300 flex items-center justify-center gap-1"
                    >
                      <ExternalLink size={12} /> View Blog
                    </button>
                  )}
                  
                  {isPending && status?.isRunning && !isAllPosted && (
                    <button
                      onClick={() => previewMutation.mutate(selectedTopic || null)}
                      disabled={previewMutation.isPending}
                      className="w-full mt-4 btn-primary text-xs py-2 flex items-center justify-center gap-2"
                    >
                      <Eye size={14} />
                      {previewMutation.isPending ? 'Generating...' : 'Preview & Publish'}
                    </button>
                  )}
                  
                  <p className={`text-[10px] mt-2 ${isPosted ? 'text-green-400' : isSkipped ? 'text-gray-500' : 'text-blue-400'}`}>
                    {isPosted ? '✓ Posted' : isSkipped ? '○ Skipped' : '● Ready'}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-8">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
              <p className="text-white font-black text-lg">All Done Today!</p>
              <p className="text-gray-500 text-sm">You've posted all 3 blogs. Come back tomorrow!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, label, value, color, subtext }) {
  const colors = {
    green: 'text-green-400 bg-green-500/10',
    red: 'text-red-400 bg-red-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10'
  };

  return (
    <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-[10px] text-gray-600 mt-2">{subtext}</p>
    </div>
  );
}