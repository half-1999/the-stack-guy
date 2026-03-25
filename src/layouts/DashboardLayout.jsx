import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuthStore, useUIStore } from '../store';
import { notificationsAPI } from '../services/api';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';

export default function DashboardLayout() {
  const { isAuthenticated, user, token } = useAuthStore();
  const { setNotificationCount } = useUIStore();
  
  useEffect(() => {
    if (!isAuthenticated || !token) return;

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

    // Live listener
    const socket = io(window.location.origin, {
      auth: { token }
    });

    socket.on('new-notification', () => {
      setNotificationCount(prev => prev + 1);
    });

    return () => socket.disconnect();
  }, [isAuthenticated, token, setNotificationCount]);

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
