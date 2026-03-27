import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuthStore, useUIStore } from '../store';
import { notificationsAPI, SOCKET_URL } from '../services/api';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// Tiny base64 "pop" sound for incoming notifications
const NOTIFICATION_SOUND = 'data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq/zQAQAAABwAABgAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';


export default function DashboardLayout() {
  const { isAuthenticated, user, token } = useAuthStore();
  const { notificationCount, setNotificationCount } = useUIStore();
  
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // Request Notification permission for desktop alerts
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    // Fetch initial count
    const fetchUnread = async () => {
      try {
        const resp = await notificationsAPI.getAll({ unreadOnly: true });
        setNotificationCount(resp.data.unreadCount || 0);
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    };
    fetchUnread();

    // Live listener - bypass Vite proxy and hit the specific socket port securely
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'] // Try WS first, fallback to polling
    });

    socket.on('connect', () => {
      console.log('✅ Dashboard Socket Connected', socket.id);
      const userId = user?._id || user?.id;
      if (userId) {
        socket.emit('join', userId);
        console.log('✅ Requested join room:', userId);
      } else {
        console.warn('⚠️ User ID missing on connect! Full user object:', user);
      }
    });

    socket.on('new-notification', (notif) => {
      console.log('🔔 RECEIVED NEW NOTIFICATION:', notif);
      setNotificationCount(useUIStore.getState().notificationCount + 1);
      
      // Update global notification cache so all components reflect it instantly
      queryClient.setQueryData(['notifications'], (old = []) => {
        if (old.find(n => n._id === notif._id)) return old; // Avoid dupe
        return [notif, ...old];
      });

      // Data refresh triggers (without full page reload) - Valid React Query v5 syntax
      if (notif?.type === 'lead') queryClient.invalidateQueries({ queryKey: ['leads'] });
      if (notif?.type === 'appointment') queryClient.invalidateQueries({ queryKey: ['appointments'] });
      if (notif?.type === 'project' || notif?.type === 'project-update') queryClient.invalidateQueries({ queryKey: ['projects'] });

      // Toast popup
      toast.success(notif?.title || 'You have a new notification!', {
        icon: '🔔',
        style: {
          borderRadius: '16px',
          background: '#0a0a11',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
        },
      });

      // Play sound alert safely
      try {
        const audio = new Audio(NOTIFICATION_SOUND);
        audio.play().catch(e => console.log('Audio autoplay blocked by browser:', e));
      } catch (error) {}

      // Push notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Event in TSG', {
          body: notif?.title || 'You have a new notification!',
          icon: '/favicon.ico'
        });
      }
    });

    // Directly append new leads to the table cache synchronously (fixes instant count)
    socket.on('new-lead', (leadData) => {
       queryClient.setQueryData(['leads'], (old = []) => {
         if (old.find(l => l._id === leadData._id)) return old;
         return [leadData, ...old];
       });
    });

    // Removed to prevent duplicate notifications (new-notification handles everything natively).
    return () => socket.disconnect();
  }, [isAuthenticated, token, user, setNotificationCount, queryClient]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container" style={{ background: 'var(--color-bg-primary)' }}>
      <Sidebar />
      <div className="main-content flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
