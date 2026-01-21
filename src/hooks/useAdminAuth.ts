import { useState, useEffect } from 'react';

const MASTER_EMAIL = 'kevin@kevinbritz.com';
const MASTER_TOKEN = 'Bypass2024';
const ADMIN_AUTH_KEY = 'admin_authenticated';

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
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    authenticate,
    logout,
  };
};
