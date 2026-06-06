import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check current active authentication session status
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkSession();

    // Listen live to state mutations (logout events, token expirations)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show a blank view or minimal loader while token signatures are verified
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  // Force redirect back to entry screen if token parameters are missing
  return isAuthenticated ? <>{children}</> : <Navigate to="/786313login" replace />;
};

export default AdminRoute;