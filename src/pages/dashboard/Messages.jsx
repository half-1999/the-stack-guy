import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import {
  Send, CheckCheck, Loader2, MessageCircle
} from 'lucide-react';

import { useAuthStore } from '../../store';
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
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await authAPI.getUsers();
      return resp.data.data.filter(u => u._id !== currentUserId);
    }
  });

  const { data: adminUser } = useQuery({
    queryKey: ['adminUser'],
    enabled: !isAdmin,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await authAPI.getAdmin();
      return resp.data.data;
    }
  });

  useEffect(() => {
    if (!isAdmin && adminUser && !selectedUser) {
      setSelectedUser(adminUser);
    }
  }, [adminUser, isAdmin, selectedUser]);

  /* ================= MESSAGES ================= */

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedUser?._id],
    enabled: !!selectedUser,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await messagesAPI.getByUser(selectedUser._id);
      return resp.data.data;
    }
  });

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (!token) return;

    const newSocket = io(window.location.origin, {
      auth: { token }
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join', currentUserId);
    });

    newSocket.on('online-users', (users) => {
      setOnlineUsers(users || []);
    });

    /* ===== MESSAGE RECEIVE ===== */
    newSocket.on('new-message', (msg) => {
      const chatUserId =
        msg.senderId._id === currentUserId
          ? msg.receiverId
          : msg.senderId._id;

      queryClient.setQueryData(
        ['messages', chatUserId],
        (old = []) => {
          // ✅ replace optimistic message if exists
          const updated = old.map(m =>
            m.optimistic &&
              m.content === msg.content &&
              m.receiverId === msg.receiverId
              ? msg
              : m
          );

          // ✅ if already exists, skip
          const exists = updated.some(m => m._id === msg._id);
          if (exists) return updated;

          return [...updated, msg];
        }
      );
    });

    /* ===== TYPING ===== */
    newSocket.on('user-typing', ({ fromUserId }) => {
      if (fromUserId === selectedUser?._id) {
        setTypingUsers(prev => ({ ...prev, [fromUserId]: true }));
      }
    });

    newSocket.on('user-stop-typing', ({ fromUserId }) => {
      if (fromUserId === selectedUser?._id) {
        setTypingUsers(prev => ({ ...prev, [fromUserId]: false }));
      }
    });

    /* ===== READ ===== */
    newSocket.on('new-message', (msg) => {
      const chatUserId =
        msg.senderId._id === currentUserId
          ? msg.receiverId
          : msg.senderId._id;

      // update messages
      queryClient.setQueryData(['messages', chatUserId], (old = []) => {
        const exists = old.some(m => m._id === msg._id);
        if (exists) return old;
        return [...old, msg];
      });

      // ✅ auto mark read if chat open
      if (chatUserId === selectedUser?._id) {
        socket.emit('mark-read', {
          userId: selectedUser._id
        });
      }
    });

    /* ===== LAST SEEN ===== */
    newSocket.on('user-last-seen', ({ userId, lastSeen }) => {
      queryClient.setQueryData(['contacts'], (old) => {
        if (!old) return old;
        return old.map(u =>
          u._id === userId ? { ...u, lastSeen } : u
        );
      });
    });

    return () => newSocket.disconnect();
  }, [token, currentUserId, queryClient, selectedUser?._id]);

  /* ================= SCROLL ================= */

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

  /* ================= SEND ================= */

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedUser) return;

    const tempId = Date.now();

    const optimisticMessage = {
      _id: tempId,
      content: msgInput,
      createdAt: new Date().toISOString(),
      senderId: { _id: currentUserId },
      receiverId: selectedUser._id,
      read: false,
      optimistic: true
    };

    queryClient.setQueryData(
      ['messages', selectedUser._id],
      (old = []) => [...old, optimisticMessage]
    );

    socket.emit('send-message', {
      receiverId: selectedUser._id,
      content: msgInput
    });

    setMsgInput('');
  };

  /* ================= TYPING ================= */

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

  /* ================= READ ================= */

  useEffect(() => {
    if (!selectedUser || !socket) return;

    socket.emit('mark-read', {
      userId: selectedUser._id
    });

  }, [selectedUser]);

  /* ================= UI ================= */

  if ((contactsLoading && isAdmin) || !socket) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-[calc(100vh-160px)] flex bg-[#0a0a11]">

      {/* SIDEBAR */}
      {isAdmin && (
        <aside className="w-80 border-r p-4 space-y-2">
          {(contacts || []).map(contact => {
            const isOnline = onlineUsers?.includes(contact._id);

            return (
              <button
                key={contact._id}
                onClick={() => setSelectedUser(contact)}
                className="relative w-full p-4 flex items-center gap-4 hover:bg-gray-800 rounded"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 flex items-center justify-center rounded-full text-white">
                    {contact.name[0]}
                  </div>

                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full" />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <p>{contact.name}</p>
                  <p className="text-xs text-gray-400">
                    {isOnline
                      ? "Online"
                      : contact.lastSeen
                        ? `Last seen ${timeAgo(contact.lastSeen)}`
                        : "Offline"}
                  </p>
                </div>
              </button>
            );
          })}
        </aside>
      )}

      {/* CHAT */}
      <main className="flex-1 flex flex-col">

        {selectedUser ? (
          <>
            {/* HEADER */}
            <div className="p-4 border-b">
              <h3>{selectedUser.name}</h3>
              <p>
                {typingUsers[selectedUser._id]
                  ? "Typing..."
                  : onlineUsers.includes(selectedUser._id)
                    ? "Online"
                    : selectedUser.lastSeen
                      ? `Last seen ${timeAgo(selectedUser.lastSeen)}`
                      : "Offline"}
              </p>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4">
              {messagesLoading ? (
                <Loader2 />
              ) : (
                messages?.map(msg => {
                  const isMe = msg.senderId._id === currentUserId;

                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="bg-gray-700 p-3 rounded max-w-xs">
                        {msg.content}

                        <div className="flex justify-end gap-2 text-xs mt-1">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>

                          {msg.optimistic && (
                            <span className="text-gray-400">Sending...</span>
                          )}

                          {isMe && !msg.optimistic && (
                            <CheckCheck
                              size={14}
                              className={msg.read ? 'text-blue-500' : 'text-gray-400'}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef} />
            </div>

            {/* INPUT */}
            <form onSubmit={handleSend} className="p-4 flex gap-2">
              <input
                value={msgInput}
                onChange={handleTyping}
                className="flex-1 p-2 bg-gray-800 text-white rounded"
              />
              <button type="submit">
                <Send />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <MessageCircle size={40} />
          </div>
        )}

      </main>
    </div>
  );
}