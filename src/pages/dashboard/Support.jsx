import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, MessageSquare, Send, Mail, User, Shield, 
  Clock, CheckCircle2, AlertCircle, Inbox, Filter,
  MoreVertical, Paperclip, ChevronRight, Star,
  Trash2, ThumbsUp, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { messagesAPI, testimonialsAPI } from '../../services/api';
import { useAuthStore } from '../../store';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { toast } from 'react-hot-toast';

export default function Support() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('tickets'); // tickets, testimonials
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [replyMode, setReplyMode] = useState('chat'); // chat, email
  const [msgInput, setMsgInput] = useState('');
  const [emailSubject, setEmailSubject] = useState('Support Update - The Stack Guy');
  const scrollRef = useRef(null);

  // 1. Fetch Conversations (Support Tickets)
  const { data: conversations, isLoading: convosLoading } = useQuery({
    queryKey: ['support-conversations'],
    queryFn: async () => {
      const res = await messagesAPI.getSupportConversations();
      return res.data.data;
    },
    enabled: isAdmin
  });

  // 2. Fetch Messages for Selected Convo
  const { data: messages, isLoading: msgsLoading } = useQuery({
    queryKey: ['support-messages', selectedConvo?._id],
    queryFn: async () => {
      const res = await messagesAPI.getByUser(selectedConvo._id);
      return res.data.data;
    },
    enabled: !!selectedConvo
  });

  // 3. Fetch Testimonials
  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const res = await testimonialsAPI.getAll();
      return res.data.data;
    },
    enabled: activeTab === 'testimonials' && isAdmin
  });

  // Mutations
  const sendMessageMutation = useMutation({
    mutationFn: (data) => messagesAPI.send(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['support-messages', selectedConvo?._id]);
      setMsgInput('');
      toast.success('Message sent');
    }
  });

  const replyViaEmailMutation = useMutation({
    mutationFn: (data) => messagesAPI.replyViaEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['support-messages', selectedConvo?._id]);
      setMsgInput('');
      toast.success('Email reply sent & logged');
    }
  });

  const moderateTestimonialMutation = useMutation({
    mutationFn: ({ id, data }) => testimonialsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-testimonials']);
      toast.success('Testimonial status updated');
    }
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: (id) => testimonialsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-testimonials']);
      toast.success('Testimonial removed');
    }
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReply = (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedConvo) return;

    if (replyMode === 'email') {
      replyViaEmailMutation.mutate({
        userId: selectedConvo._id,
        subject: emailSubject,
        content: msgInput
      });
    } else {
      sendMessageMutation.mutate({
        receiverId: selectedConvo._id,
        content: msgInput
      });
    }
  };

  if (convosLoading || testimonialsLoading) return <LoadingScreen />;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 font-display uppercase tracking-tight leading-none">
            Support <span className="gradient-text-blue">& Feedback</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium italic">
            Manage inquiries, tickets, and client testimonials.
          </p>
        </div>
        
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'tickets' ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-gray-500 hover:text-white'}`}
          >
            Support Tickets
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'testimonials' ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-gray-500 hover:text-white'}`}
          >
            Testimonials
          </button>
        </div>
      </div>

      <div className="h-[700px] flex gap-6">
        {activeTab === 'tickets' ? (
          <>
            {/* Sidebar: Message List */}
            <div className="w-[380px] glass-card border-white/5 bg-white/[0.01] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search messages..."
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold uppercase tracking-widest"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {conversations?.length === 0 ? (
                  <div className="p-12 text-center">
                    <Inbox size={40} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest">No messages found</p>
                  </div>
                ) : (
                  conversations?.map((conv) => (
                    <button 
                      key={conv._id}
                      onClick={() => setSelectedConvo(conv.user)}
                      className={`w-full p-6 border-b border-white/5 flex gap-4 text-left transition-all hover:bg-white/[0.03] ${selectedConvo?._id === conv.user._id ? 'bg-white/[0.05] border-l-4 border-l-blue-500' : ''}`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 text-white font-black text-lg">
                          {conv.user.name[0]}
                        </div>
                        {conv.unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-[#0a0a11] flex items-center justify-center text-[8px] text-white font-black">{conv.unreadCount}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-black text-white uppercase tracking-wider truncate">{conv.user.name}</h4>
                          <span className="text-[8px] text-gray-600 font-black uppercase">{new Date(conv.lastMessage.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate font-medium italic">"{conv.lastMessage.content}"</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Main: Chat View */}
            <div className="flex-1 glass-card border-white/5 bg-white/[0.01] flex flex-col overflow-hidden relative">
              {selectedConvo ? (
                <>
                  <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black">
                        {selectedConvo.name[0]}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">{selectedConvo.name}</h3>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{selectedConvo.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                       <button 
                        onClick={() => setReplyMode(replyMode === 'chat' ? 'email' : 'chat')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2 transition-all ${replyMode === 'email' ? 'bg-purple-600 text-white border-purple-500 shadow-glow-purple' : 'text-gray-500 hover:text-white'}`}
                       >
                         {replyMode === 'email' ? <Mail size={14} /> : <MessageSquare size={14} />} {replyMode === 'email' ? 'Email Mode' : 'Chat Mode'}
                       </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {msgsLoading ? <LoadingScreen /> : messages?.map((msg) => {
                      const isMe = msg.senderId._id === user._id;
                      const isEmail = msg.content.startsWith('[Email Reply]');
                      
                      return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-4 relative ${isMe ? (isEmail ? 'bg-purple-600/20 text-white border border-purple-500/30' : 'bg-blue-600 text-white') : 'bg-white/5 border border-white/10 text-gray-300'}`}>
                            {isEmail && <div className="flex items-center gap-1 text-[8px] font-black uppercase mb-2 text-purple-400"><Mail size={10} /> Email Notification Sent</div>}
                            <p className="text-sm font-medium leading-relaxed">{isEmail ? msg.content.replace('[Email Reply] ', '') : msg.content}</p>
                            <div className="mt-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest opacity-50">
                              <Clock size={10} /> {new Date(msg.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={scrollRef} />
                  </div>

                  <form onSubmit={handleReply} className="p-6 pt-0">
                    <div className="glass-card-premium border-white/10 bg-white/[0.03] p-4 rounded-3xl">
                      {replyMode === 'email' && (
                        <input 
                          type="text" 
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Email Subject..."
                          className="w-full bg-transparent border-b border-white/5 mb-4 pb-2 text-xs font-black uppercase tracking-widest text-purple-400 outline-none"
                        />
                      )}
                      <div className="flex items-end gap-4">
                        <textarea 
                          value={msgInput}
                          onChange={(e) => setMsgInput(e.target.value)}
                          placeholder={replyMode === 'email' ? "Type an email reply..." : "Type a direct message..."}
                          className="flex-1 bg-transparent border-none outline-none text-sm text-white font-medium resize-none min-h-[60px]"
                        />
                        <button 
                          type="submit" 
                          disabled={sendMessageMutation.isPending || replyViaEmailMutation.isPending}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${replyMode === 'email' ? 'bg-purple-600 hover:bg-purple-500 shadow-glow-purple' : 'bg-blue-600 hover:bg-blue-500 shadow-glow-blue'} text-white shrink-0`}
                        >
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                   <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center text-gray-700 mb-8 border border-white/5">
                      <Inbox size={48} />
                   </div>
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Message Center</h3>
                   <p className="text-sm text-gray-500 max-w-xs italic">Select a conversation from the list to start replying or reviewing ticket history.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Testimonials Management */
          <div className="flex-1 glass-card border-white/5 bg-white/[0.01] flex flex-col overflow-hidden p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pr-2">
              {testimonials?.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <Star size={40} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-xs text-gray-500 font-black uppercase tracking-widest">No testimonials found</p>
                </div>
              ) : testimonials?.map((t) => (
                <motion.div 
                  key={t._id}
                  layout
                  className="glass-card p-6 bg-white/[0.02] border-white/5 flex flex-col group relative"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-white/10 text-yellow-500">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">{t.clientName}</h4>
                        <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">{t.role} @ {t.company || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => moderateTestimonialMutation.mutate({ id: t._id, data: { approved: !t.approved } })}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${t.approved ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                      >
                        {t.approved ? <XCircle size={14} /> : <ThumbsUp size={14} />}
                      </button>
                      <button 
                        onClick={() => { if(confirm('Delete?')) deleteTestimonialMutation.mutate(t._id); }}
                        className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 font-medium italic mb-6 flex-1">"{t.content}"</p>
                  
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex text-yellow-500 scale-75 origin-left">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < t.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${t.approved ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {t.approved ? 'Live' : 'Pending'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
