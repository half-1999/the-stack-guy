import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import LeadPopup from './components/ui/LeadPopup';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsAndConditions from './pages/public/TermsAndConditions';

// 🔥 Lazy Load (CRITICAL FOR PERFORMANCE)
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

// Public
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const Portfolio = lazy(() => import('./pages/public/Portfolio'));
const PortfolioDetail = lazy(() => import('./pages/public/PortfolioDetail'));
const ServicePage = lazy(() => import('./pages/public/ServicePage'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const BookCall = lazy(() => import('./pages/public/BookCall'));
const PricingCalculator = lazy(() => import('./pages/public/PricingCalculator'));
const WebsiteAudit = lazy(() => import('./pages/public/WebsiteAudit'));
const Blog = lazy(() => import('./pages/public/Blog'));
const BlogPost = lazy(() => import('./pages/public/BlogPost'));

// Auth
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

// Dashboard
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'));
const Projects = lazy(() => import('./pages/dashboard/Projects'));
const ProjectDetail = lazy(() => import('./pages/dashboard/ProjectDetail'));
const Messages = lazy(() => import('./pages/dashboard/Messages'));

// 🔥 Dashboard (NEW - previously missing)
const Invoices = lazy(() => import('./pages/dashboard/Invoices'));
const Notifications = lazy(() => import('./pages/dashboard/Notifications'));
const Appointments = lazy(() => import('./pages/dashboard/Appointments'));
const Proposals = lazy(() => import('./pages/dashboard/Proposals'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const AIStudio = lazy(() => import('./pages/dashboard/AIStudio'));
const Community = lazy(() => import('./pages/dashboard/Community'));
const Referral = lazy(() => import('./pages/dashboard/Referral'));
const Support = lazy(() => import('./pages/dashboard/Support'));
const Drive = lazy(() => import('./pages/dashboard/Drive'));
const Leads = lazy(() => import('./pages/dashboard/Leads'));
const AdminUsers = lazy(() => import('./pages/dashboard/AdminUsers'));
const AdminBlog = lazy(() => import('./pages/dashboard/AdminBlog'));
const AdminPortfolio = lazy(() => import('./pages/dashboard/AdminPortfolio'));
const AdminPortfolioEdit = lazy(() => import('./pages/dashboard/AdminPortfolioEdit'));
const Analytics = lazy(() => import('./pages/dashboard/Analytics'));
const AuditLogs = lazy(() => import('./pages/dashboard/AuditLogs'));


// 🔥 Optimized Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});


// 🔥 Throttled Scroll Progress
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const height = document.body.scrollHeight - window.innerHeight;
          const scrolled = height > 0 ? (scrollTop / height) * 100 : 0;
          setProgress(scrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[3px] z-[9999] bg-gradient-to-r from-blue-500 to-cyan-400"
      style={{ width: `${progress}%` }}
    />
  );
}


// 🔥 Animated Routes
function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith('/dashboard')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.98 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
          <Routes location={location}>

            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/book-call" element={<BookCall />} />
              <Route path="/audit" element={<WebsiteAudit />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/pricing" element={<PricingCalculator />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="audit" element={<WebsiteAudit />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetail />} /> // incomplete
              <Route path="invoices" element={<Invoices />} />
              <Route path="messages" element={<Messages />} />
              <Route path="support" element={<Support />} />
              <Route path="notifications" element={<Notifications />} /> // incomplete
              <Route path="appointments" element={<Appointments />} />
              <Route path="proposals" element={<Proposals />} /> // incomplete
              <Route path="settings" element={<Settings />} /> // incomplete
              <Route path="ai-studio" element={<AIStudio />} /> // incomplete
              <Route path="community" element={<Community />} /> // incomplete
              <Route path="referral" element={<Referral />} /> // incomplete
              <Route path="vault" element={<Drive />} /> // incomplete

              <Route path="leads" element={<Leads />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="blog" element={<AdminBlog />} /> // incomplete
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="portfolio/:id" element={<AdminPortfolioEdit />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}


// 🔥 Optimized Cursor (NO DOM MANIPULATION)
function useCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return pos;
}


function App() {
  const cursor = useCursor();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>

        <ScrollProgress />

        {/* Cursor */}
        <div
          className="hidden md:block fixed w-4 h-4 bg-blue-500 rounded-full pointer-events-none z-[9999]"
          style={{ left: cursor.x, top: cursor.y, transform: 'translate(-50%, -50%)' }}
        />

        <Router>
          <AnimatedRoutes />
          <LeadPopup />
        </Router>

        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </HelmetProvider>

  );
}

export default App;