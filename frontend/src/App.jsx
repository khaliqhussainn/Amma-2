import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Landing1 from './pages/Landing1';
import NewLanding from './pages/NewLanding';
import RegistrationPage from './pages/RegistrationPage';
import AboutPage from './pages/AboutPage';
import ChaptersPage from './pages/ChaptersPage';
import SpecialtiesPage from './pages/SpecialtiesPage';
import MembershipInfoPage from './pages/MembershipInfoPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import EventsPage from './pages/EventsPage';
import NewsEventsPage from './pages/NewsEventsPage';
import EventDetailPage from './pages/EventDetailPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" />
        <Routes>
        <Route path="/" element={<NewLanding />} />
        <Route path="/landing-1" element={<Landing1 />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/chapters" element={<ChaptersPage />} />
        <Route path="/specialties" element={<SpecialtiesPage />} />
        <Route path="/membership-info" element={<MembershipInfoPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />
        <Route path="/news-events" element={<NewsEventsPage />} />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/member-dashboard" element={<MemberDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
