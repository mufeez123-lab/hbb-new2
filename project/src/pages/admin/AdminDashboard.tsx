import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import BrandsPage from './BrandsPage';
import BoardOfDirectorsPage from './BoardOfDirectorsPage';
import HeroSectionPage from './HeroSectionPage';
import AboutStatsPage from './AboutStatsPage';
import api from '../../services/api';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Image as ImageIcon,
  BrandingWatermark as BrandingWatermarkIcon,
} from '@mui/icons-material';

const AdminDashboard: React.FC = () => {
  const [boardCount, setBoardCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [heroImageCount, setHeroImageCount] = useState(0);
  const [brandCount, setBrandCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Fetch all admin metrics
    api.get('/admin/board').then((res) => setBoardCount(res.data.length));
    api.get('/admin/projects').then((res) => setProjectCount(res.data.length));
    api.get('/admin/hero').then((res) => setHeroImageCount(res.data.length));
    api.get('/admin/brands').then((res) => setBrandCount(res.data.length));

    // Detect screen width for responsiveness
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize); // Listen for resize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 text-center p-4">
        <div className="bg-white p-6 rounded-lg shadow text-gray-800">
          <h2 className="text-xl font-bold mb-2">Admin Access Restricted</h2>
          <p>Admins can only access the dashboard from a desktop device.</p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Board Members',
      value: boardCount,
      icon: <PeopleIcon fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Active Projects',
      value: projectCount,
      icon: <BusinessIcon fontSize="large" />,
      color: '#2e7d32',
    },
    {
      title: 'Hero Images',
      value: heroImageCount,
      icon: <ImageIcon fontSize="large" />,
      color: '#ed6c02',
    },
    {
      title: 'Brands',
      value: brandCount,
      icon: <BrandingWatermarkIcon fontSize="large" />,
      color: '#9c27b0',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 ml-0 mt-16">
          <h3 className="text-2xl font-bold mb-6">Dashboard</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-lg flex items-center p-5 gap-4"
              >
                <div
                  className="p-3 rounded-full text-white"
                  style={{ backgroundColor: metric.color }}
                >
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-semibold">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>

          <Routes>
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/board" element={<BoardOfDirectorsPage />} />
            <Route path="/hero" element={<HeroSectionPage />} />
            <Route path="/about-stats" element={<AboutStatsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
