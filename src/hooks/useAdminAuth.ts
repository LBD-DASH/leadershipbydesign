import { useState, useEffect } from 'react';
import { ADMIN_AUTH_KEY, MASTER_EMAIL, MASTER_TOKEN } from '@/lib/adminAuth';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStatus = sessionStorage.getItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(authStatus === 'true');
    setLoading(false);
  }, []);

  const authenticate = (email: string, token: string): boolean => {
    if (email.toLowerCase() === MASTER_EMAIL.toLowerCase() && token === MASTER_TOKEN) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      // Store token so admin-only backend functions can verify access
      sessionStorage.setItem('admin_token', token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    authenticate,
    logout,
  };
};
