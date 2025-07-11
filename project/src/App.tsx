import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/utils/ScrollToTop';



// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AboutPageClick from './components/home/AboutPageClick';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ContactPage from './pages/ContactPage';
import UpcomingProjects from './pages/UpcomingProjects';
import  FaqsPage  from './pages/FaqsPage';
import Brands from './pages/Brands';
import NotFoundPage from './pages/NotFoundPage';
import BoardOfDirectorDetailPage from './pages/BoardofDirectorsDetails';


// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
// import ProjectForm from './pages/admin/ProjectForm';
import BrandsPage from './pages/admin/BrandsPage';
import AboutStatsPage from './pages/admin/AboutStatsPage';
import HeroSectionPage from './pages/admin/HeroSectionPage';
import BoardMembersPage from './pages/admin/BoardOfDirectorsPage';
import AdminRoute from './components/auth/AdminRoute';

// Context
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import AdminTestimonials from './pages/admin/AdminTestimonials';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Initialize AOS animations globally with repeat on scroll
    AOS.init({
      duration: 800,
      once: false, // Animations repeat every time element enters viewport
    });

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Refresh AOS animations on route change to replay animations when navigating
  useEffect(() => {
    AOS.refresh();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-3">
            <img
              src="/logo-SVG.svg"
              alt="Logo"
              className="h-20 w-20" data-aos="fade-up" data-aos-delay="300" 
            />
          </div>
          <p className="text-neutral-600" data-aos="fade-up" data-aos-delay="300">Building Dreams, Delivering Excellence</p>
        </div>
      </div>
    );
  }

  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/786313login';

  return (
    <AuthProvider>
      <ProjectProvider>
        <ScrollToTop />
        {!isAdminPage && <Header />}
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/aboutclick" element={<AboutPageClick />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/upcoming-projects" element={<UpcomingProjects />} />
              <Route path="/faqs" element={<FaqsPage />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/board/:id" element={<BoardOfDirectorDetailPage />} />


              {/* Admin Routes */}
              <Route path="/786313login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/board" element={<AdminRoute><BoardMembersPage /></AdminRoute>} />
              <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
              {/* <Route path="/admin/projects/add" element={<AdminRoute><ProjectForm /></AdminRoute>} /> */}
              {/* <Route path="/admin/projects/edit/:id" element={<AdminRoute><ProjectForm /></AdminRoute>} /> */}
              <Route path="/admin/brands" element={<AdminRoute><BrandsPage /></AdminRoute>} />
              <Route path="/admin/about" element={<AdminRoute><AboutStatsPage /></AdminRoute>} />
              <Route path="/admin/hero" element={<AdminRoute><HeroSectionPage /></AdminRoute>} />
              <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonials /></AdminRoute>} />
            </Routes>
          </AnimatePresence>
        </main> 
        {!isAdminPage && <Footer />}
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;