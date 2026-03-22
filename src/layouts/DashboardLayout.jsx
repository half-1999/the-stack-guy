import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';

export default function DashboardLayout() {
  const { isAuthenticated, user } = useAuthStore();
  
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
