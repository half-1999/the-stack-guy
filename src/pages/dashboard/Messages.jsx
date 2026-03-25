import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import {
  Send, CheckCheck, Loader2, MessageCircle, User, Search,
  Phone, Video, MoreVertical, Paperclip, Smile, Clock,
  ShieldCheck, Zap, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useUIStore } from '../../store';
import { messagesAPI, authAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { timeAgo } from '../../utils/timeAgo';

let typingTimeout;

export default function Messages() {
  const { user, token } = useAuthStore();
  const currentUserId = user?._id || user?.id;
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState(null);
  const [msgInput, setMsgInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const typingRef = useRef(false);
  const scrollRef = useRef(null);

  /* ================= USERS ================= */
  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['contacts'],
    enabled: isAdmin,
    queryFn: async () => {
      const resp = await authAPI.getUsers();
      return resp.data.data.filter(u => u._id !== currentUserId);
    }
  });

  const { data: adminUser } = useQuery({
    queryKey: ['adminUser'],
    enabled: !isAdmin,
    queryFn: async () => {
      const resp = await authAPI.getAdmin();
      return resp.data.data;
    }
  });

  useEffect(() => {
    if (!isAdmin && adminUser && !selectedUser) setSelectedUser(adminUser);
  }, [adminUser, isAdmin, selectedUser]);

  /* ================= MESSAGES ================= */
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedUser?._id],
    enabled: !!selectedUser,
    queryFn: async () => {
      const resp = await messagesAPI.getByUser(selectedUser._id);
      return resp.data.data;
    }
  });

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!token) return;
    const newSocket = io(window.location.origin, { auth: { token } });
    setSocket(newSocket);

    newSocket.on('connect', () => newSocket.emit('join', currentUserId));
    newSocket.on('online-users', (users) => setOnlineUsers(users || []));
    
    newSocket.on('new-message', (msg) => {
      const chatUserId = msg.senderId._id === currentUserId ? msg.receiverId : msg.senderId._id;
      queryClient.setQueryData(['messages', chatUserId], (old = []) => {
        const exists = old.some(m => m._id === msg._id);
        if (exists) return old;
        return [...old, msg];
      });
      if (chatUserId === selectedUser?._id) newSocket.emit('mark-read', { userId: selectedUser._id });
    });

    newSocket.on('user-typing', ({ fromUserId }) => {
      if (fromUserId === selectedUser?._id) setTypingUsers(prev => ({ ...prev, [fromUserId]: true }));
    });

    newSocket.on('user-stop-typing', ({ fromUserId }) => {
      if (fromUserId === selectedUser?._id) setTypingUsers(prev => ({ ...prev, [fromUserId]: false }));
    });

    return () => newSocket.disconnect();
  }, [token, currentUserId, queryClient, selectedUser?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedUser) return;
    socket.emit('send-message', { receiverId: selectedUser._id, content: msgInput });
    setMsgInput('');
  };

  const handleTyping = (e) => {
    setMsgInput(e.target.value);
    if (!typingRef.current) {
      socket?.emit('typing', { receiverId: selectedUser._id });
      typingRef.current = true;
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket?.emit('stop-typing', { receiverId: selectedUser._id });
      typingRef.current = false;
    }, 1000);
  };

  if ((contactsLoading && isAdmin) || !socket) return <LoadingScreen />;

  return (
    <div className="h-[750px] flex gap-8">
      {/* SIDEBAR: Contacts */}
      {isAdmin && (
        <div className="w-[350px] glass-card border-white/5 bg-white/[0.01] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6">Neural <span className="text-blue-500">Links</span></h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="text" 
                placeholder="Search encrypted channels..."
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] text-white outline-none focus:border-blue-500/50 transition-all font-bold uppercase tracking-widest"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {contacts?.map(contact => {
              const isOnline = onlineUsers?.includes(contact._id);
              const isSelected = selectedUser?._id === contact._id;
              
              return (
                <button
                  key={contact._id}
                  onClick={() => setSelectedUser(contact)}
                  className={`w-full p-6 flex items-center gap-4 transition-all hover:bg-white/[0.03] border-b border-white/5 relative ${isSelected ? 'bg-white/[0.05] border-l-4 border-l-blue-500' : ''}`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/10 flex items-center justify-center text-blue-500 font-black text-lg border border-blue-500/10`}>
                      {contact.name[0]}
                    </div>
                    {isOnline && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-lg border-4 border-[#0a0a11] shadow-glow-green" />}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider truncate mb-1">{contact.name}</h4>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest truncate italic">
                      {isOnline ? 'Active Protocol' : contact.lastSeen ? `OFFLINE - ${timeAgo(contact.lastSeen)}` : 'DISCONNECTED'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CHAT WINDOW */}
      <div className="flex-1 glass-card border-white/5 bg-white/[0.01] flex flex-col overflow-hidden relative">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black">
                  {selectedUser.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2">
                     <span className={`w-1.5 h-1.5 rounded-full ${onlineUsers.includes(selectedUser._id) ? 'bg-green-500 shadow-glow-green' : 'bg-gray-600'}`} />
                     <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">
                       {typingUsers[selectedUser._id] ? "Typing..." : onlineUsers.includes(selectedUser._id) ? "Live Encrypted Session" : "Offline"}
                     </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                 <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><Phone size={16} /></button>
                 <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><Video size={16} /></button>
                 <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><MoreVertical size={16} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar relative">
               <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent pointer-events-none" />
              {messagesLoading ? (
                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
              ) : (
                messages?.map(msg => {
                  const isMe = msg.senderId._id === currentUserId;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg._id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-3xl p-5 relative ${isMe ? 'bg-blue-600 text-white shadow-glow-blue/20' : 'bg-white/5 border border-white/10 text-gray-300'}`}>
                        <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                        <div className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest mt-3 opacity-50 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <Clock size={10} /> {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && <CheckCheck size={12} className={msg.read ? 'text-cyan-300' : 'text-white/50'} />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-8 pt-0 relative z-10">
               <div className="glass-card-premium border-white/10 bg-white/[0.03] p-4 rounded-3xl flex items-center gap-4">
                  <button type="button" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><Paperclip size={18} /></button>
                  <input
                    value={msgInput}
                    onChange={handleTyping}
                    placeholder="Type an encrypted message..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white font-medium italic"
                  />
                  <button type="button" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><Smile size={18} /></button>
                  <button 
                    type="submit"
                    disabled={!msgInput.trim()}
                    className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 shadow-glow-blue text-white flex items-center justify-center transition-all shrink-0 disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
               </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
             <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center text-gray-700 mb-8 border border-white/5">
                <MessageCircle size={48} />
             </div>
             <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Neural Messaging</h3>
             <p className="text-sm text-gray-500 max-w-xs italic italic">Select a contact to begin a secure, real-time encrypted communication session.</p>
          </div>
        )}
      </div>
    </div>
  );
}