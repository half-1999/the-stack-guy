import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  Sparkles, Terminal, Palette, Wand2, Zap, Brain, Rocket, 
  ChevronRight, Send, Loader2, RefreshCcw, FileText, CheckCircle2,
  AlertCircle, MessageSquare, Terminal as TerminalIcon, Edit3, Save, X, Check, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI, blogAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function AIStudio() {
  const [activeTool, setActiveTool] = useState('chat'); // chat, blog, code
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Stack Guy AI assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef(null);

  // Blog Gen State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Web Development');
  const [blogKeywords, setBlogKeywords] = useState('');
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState(null);

  const chatMutation = useMutation({
    mutationFn: (msgs) => aiAPI.chat(msgs),
    onSuccess: (res) => {
      setChatMessages(prev => [...prev, res.data.data]);
    },
    onError: () => toast.error('AI Engine timeout. Check API keys.')
  });

  const blogGenMutation = useMutation({
    mutationFn: (data) => aiAPI.generateBlog(data),
    onSuccess: (res) => {
      setGeneratedBlog(res.data.data);
      setEditedBlog(res.data.data);
      setIsEditing(false);
      toast.success('Blog content generated!');
    },
    onError: () => toast.error('Generation failed.')
  });

  const createBlogMutation = useMutation({
    mutationFn: (data) => blogAPI.create({ ...data, published: true, publishedAt: new Date() }),
    onSuccess: () => {
      toast.success('Blog posted successfully!');
      setGeneratedBlog(null);
      setEditedBlog(null);
      setIsEditing(false);
      setBlogTitle('');
      setBlogKeywords('');
    },
    onError: () => toast.error('Failed to post blog.')
  });

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedBlog(generatedBlog);
    } else {
      setEditedBlog({ ...generatedBlog });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = () => {
    setGeneratedBlog(editedBlog);
    setIsEditing(false);
    toast.success('Changes saved!');
  };

  const handlePostBlog = () => {
    const blogData = {
      title: editedBlog?.title || generatedBlog?.title,
      content: editedBlog?.content || generatedBlog?.content,
      excerpt: editedBlog?.excerpt || generatedBlog?.excerpt,
      author: editedBlog?.author || generatedBlog?.author || 'The Stack Guy',
      category: editedBlog?.category || generatedBlog?.category,
      tags: editedBlog?.tags || generatedBlog?.tags || [],
      featuredImage: editedBlog?.featuredImage || generatedBlog?.featuredImage,
      seoKeywords: editedBlog?.seoKeywords || generatedBlog?.seoKeywords || [],
    };
    createBlogMutation.mutate(blogData);
  };

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsgs = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMsgs);
    setChatInput('');
    chatMutation.mutate(newMsgs);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 font-display uppercase tracking-tight leading-none">
            AI <span className="gradient-text-blue">Studio</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium italic">
            Automate content, strategy, and development workflows.
          </p>
        </div>
        
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTool('chat')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTool === 'chat' ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-gray-500 hover:text-white'}`}
          >
            Neural Chat
          </button>
          <button 
            onClick={() => setActiveTool('blog')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTool === 'blog' ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-gray-500 hover:text-white'}`}
          >
            Content Forge
          </button>
        </div>
      </div>

      <div className="h-[700px] flex gap-8">
        {activeTool === 'chat' ? (
          /* Neural Chat Interface */
          <div className="flex-1 glass-card border-white/5 bg-white/[0.01] flex flex-col overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
               <Brain size={120} className="text-blue-500" />
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar relative z-10">
              {chatMessages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-3xl p-6 relative ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-glow-blue/20' : 'bg-white/5 border border-white/10 text-gray-300'}`}>
                    <div className="flex items-center gap-3 mb-4 opacity-50 text-[8px] font-black uppercase tracking-widest">
                       {msg.role === 'user' ? <User size={10} /> : <Zap size={10} />} {msg.role}
                    </div>
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {chatMutation.isPending && (
                <div className="flex justify-start">
                   <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-3">
                      <Loader2 className="animate-spin text-blue-500" size={16} />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Processing Neural Pathways...</span>
                   </div>
                </div>
              )}
              <div ref={chatScrollRef} />
            </div>

            <form onSubmit={handleChatSubmit} className="p-10 pt-0 relative z-10">
               <div className="glass-card-premium border-white/10 bg-white/[0.03] p-4 rounded-3xl flex items-center gap-4">
                  <TerminalIcon size={18} className="text-gray-600 shrink-0" />
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask anything (content ideas, code help, SEO strategy)..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white font-medium italic"
                  />
                  <button 
                    type="submit" 
                    disabled={chatMutation.isPending}
                    className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 shadow-glow-blue text-white flex items-center justify-center transition-all shrink-0"
                  >
                    <Send size={20} />
                  </button>
               </div>
               <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest mt-4 text-center">Engine: GPT-4o-mini / Context Window: 128k</p>
            </form>
          </div>
        ) : (
          /* Blog Forge Tool */
          <div className="flex-1 flex gap-8 h-full">
             {/* Controls */}
             <div className="w-[400px] glass-card border-white/5 bg-white/[0.01] p-10 flex flex-col gap-8 shrink-0">
                <div className="space-y-2">
                   <h3 className="text-lg font-black text-white uppercase tracking-widest">Blog Engine</h3>
                   <p className="text-xs text-gray-500 italic">Generate SEO-heavy blog structure via AI.</p>
                </div>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Title</label>
                      <input 
                        type="text" 
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        placeholder="e.g. Modern React Patterns 2024"
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</label>
                      <select 
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-black uppercase tracking-widest appearance-none"
                      >
                         <option value="Web Development" className="bg-[#111]">Web Development</option>
                         <option value="Design" className="bg-[#111]">UI/UX Design</option>
                         <option value="Business" className="bg-[#111]">Business / SEO</option>
                         <option value="AI" className="bg-[#111]">Artificial Intelligence</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Keywords (Optional)</label>
                      <textarea 
                        value={blogKeywords}
                        onChange={(e) => setBlogKeywords(e.target.value)}
                        placeholder="keyword1, keyword2..."
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold h-24 resize-none"
                      />
                   </div>
                </div>

                <button 
                  onClick={() => blogGenMutation.mutate({ title: blogTitle, category: blogCategory, keywords: blogKeywords })}
                  disabled={blogGenMutation.isPending || !blogTitle}
                  className="btn-primary w-full h-14 bg-blue-600 text-white shadow-glow-blue flex items-center justify-center gap-3 disabled:opacity-50"
                >
                   {blogGenMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />} 
                   {blogGenMutation.isPending ? 'Forging Content...' : 'Generate Article'}
                </button>
             </div>

              {/* Output Area */}
              <div className="flex-1 glass-card border-white/5 bg-white/[0.01] p-12 flex flex-col overflow-hidden relative">
                 {generatedBlog ? (
                    <div className="overflow-y-auto custom-scrollbar flex-1 space-y-10">
                        <div className="pb-8 border-b border-white/5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2 flex-wrap">
                               {(isEditing ? editedBlog?.tags : generatedBlog.tags)?.map((t, i) => (
                                 isEditing ? (
                                   <input 
                                     key={i}
                                     type="text"
                                     value={editedBlog?.tags[i] || ''}
                                     onChange={(e) => {
                                       const newTags = [...(editedBlog?.tags || [])];
                                       newTags[i] = e.target.value;
                                       setEditedBlog({ ...editedBlog, tags: newTags });
                                     }}
                                     className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-blue-500 w-24"
                                     placeholder={`Tag ${i + 1}`}
                                   />
                                 ) : (
                                   <span key={t} className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[8px] font-black uppercase tracking-widest border border-blue-500/10">#{t}</span>
                                 )
                               ))}
                            </div>
                            <button 
                              onClick={handleEditToggle}
                              className={`btn-os h-10 px-4 ${isEditing ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}
                            >
                              {isEditing ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit</>}
                            </button>
                          </div>
                         
                         {isEditing ? (
                           <input 
                             type="text"
                             value={editedBlog?.title || ''}
                             onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
                             className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-2xl text-white outline-none focus:border-blue-500/50 transition-all font-black uppercase tracking-tighter mb-4"
                           />
                         ) : (
                           <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{generatedBlog.title}</h2>
                         )}
                         
                          <div className="flex items-center gap-4 mb-3">
                            <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500">{isEditing ? editedBlog?.category : generatedBlog.category}</span>
                            {isEditing && (
                              <select 
                                value={editedBlog?.category || ''}
                                onChange={(e) => setEditedBlog({ ...editedBlog, category: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded-lg p-1 text-[8px] font-black uppercase tracking-widest text-gray-500 outline-none"
                              >
                                <option value="Web Development">Web Development</option>
                                <option value="Design">UI/UX Design</option>
                                <option value="Business">Business / SEO</option>
                                <option value="AI">Artificial Intelligence</option>
                              </select>
                            )}
                          </div>
                          
                          {isEditing ? (
                            <textarea 
                              value={editedBlog?.excerpt || ''}
                              onChange={(e) => setEditedBlog({ ...editedBlog, excerpt: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-400 outline-none focus:border-blue-500/50 transition-all font-medium italic h-20 resize-none"
                            />
                          ) : (
                            <p className="text-sm text-gray-500 italic font-medium">"{generatedBlog.excerpt}"</p>
                          )}
                       </div>
                       
                       <article className="prose prose-invert prose-sm max-w-none">
                          {isEditing ? (
                            <textarea 
                              value={editedBlog?.content || ''}
                              onChange={(e) => setEditedBlog({ ...editedBlog, content: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-400 outline-none focus:border-blue-500/50 transition-all font-medium leading-relaxed h-96 resize-none"
                            />
                          ) : (
                            <div className="whitespace-pre-wrap text-gray-400 font-medium leading-relaxed">
                               {generatedBlog.content}
                            </div>
                          )}
                       </article>

                       {isEditing && (
                         <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                           <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">SEO Keywords ({editedBlog?.seoKeywords?.length || 0})</h4>
                           {isEditing ? (
                             <div className="space-y-2">
                               {(editedBlog?.seoKeywords || []).map((kw, i) => (
                                 <input 
                                   key={i}
                                   type="text"
                                   value={kw}
                                   onChange={(e) => {
                                     const newKws = [...(editedBlog?.seoKeywords || [])];
                                     newKws[i] = e.target.value;
                                     setEditedBlog({ ...editedBlog, seoKeywords: newKws });
                                   }}
                                   className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-gray-400 outline-none focus:border-blue-500/50 transition-all"
                                   placeholder={`Keyword ${i + 1}`}
                                 />
                               ))}
                             </div>
                           ) : (
                             <div className="flex flex-wrap gap-2">
                               {generatedBlog.seoKeywords?.map((kw, i) => <span key={i} className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-400">{kw}</span>)}
                             </div>
                           )}
                         </div>
                       )}

                       {!isEditing && generatedBlog.seoKeywords && generatedBlog.seoKeywords.length > 0 && (
                         <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                           <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">SEO Keywords ({generatedBlog.seoKeywords.length})</h4>
                           <div className="flex flex-wrap gap-2">
                             {generatedBlog.seoKeywords.map((kw, i) => <span key={i} className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-400">{kw}</span>)}
                           </div>
                         </div>
                       )}

                       {isEditing && (
                         <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                           <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Featured Image URL</h4>
                           <input 
                             type="text"
                             value={editedBlog?.featuredImage || ''}
                             onChange={(e) => setEditedBlog({ ...editedBlog, featuredImage: e.target.value })}
                             className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-gray-400 outline-none focus:border-blue-500/50 transition-all"
                             placeholder="https://images.unsplash.com/..."
                           />
                           {editedBlog?.featuredImage && (
                             <img src={editedBlog.featuredImage} alt="Featured" className="w-full h-40 object-cover rounded-lg mt-2" />
                           )}
                         </div>
                       )}

                       <div className="pt-10 border-t border-white/5 flex gap-4">
                          {isEditing ? (
                            <>
                              <button onClick={handleSaveEdit} className="flex-1 btn-os bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] h-12 flex items-center justify-center gap-2">
                                <Check size={16} /> Save Changes
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={handlePostBlog}
                                disabled={createBlogMutation.isPending}
                                className="flex-1 btn-os bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] h-12 flex items-center justify-center gap-2"
                              >
                                {createBlogMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />} 
                                Post Blog
                              </button>
                              <button onClick={() => setGeneratedBlog(null)} className="btn-os text-gray-600 h-12">
                                <RefreshCcw size={16} /> Regenerate
                              </button>
                            </>
                          )}
                       </div>
                    </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center mx-auto">
                      <div className="w-20 h-20 rounded-[24px] bg-white/5 flex items-center justify-center text-gray-700 mb-8 border border-white/5 border-dashed">
                         <Sparkles size={32} />
                      </div>
                      <h4 className="text-xl font-black text-white uppercase tracking-widest mb-2">Content Preview</h4>
                      <p className="text-sm text-gray-500 italic leading-relaxed">Generated content will appear here in production-ready format. Fully SEO compliant.</p>
                   </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* OS Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Uptime', val: '99.9%', icon: Zap },
           { label: 'Tokens Used', val: '1.2M', icon: Brain },
           { label: 'Avg Latency', val: '42ms', icon: Rocket },
           { label: 'Health', val: 'OPTIMAL', icon: CheckCircle2 },
         ].map(stat => (
           <div key={stat.label} className="glass-card p-6 border-white/5 flex items-center gap-6 bg-white/[0.01]">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/10">
                 <stat.icon size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">{stat.label}</p>
                 <h4 className="text-xl font-black text-white tracking-widest">{stat.val}</h4>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}

