import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotFoundPage from '../../pages/NotFoundPage';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, token } = useAuth();

  useEffect(() => {
    console.log('AdminRoute state:', { user, loading, token });
  }, [user, loading, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/786313login" state={{ from: location }} replace />;
  }

  if (!user || user.role !== 'admin') {
      return <NotFoundPage />;
  }

  console.log('Rendering admin route for user:', user);
  return <>{children}</>;
};

export default AdminRoute;