import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_AUTH_KEY, MASTER_EMAIL, MASTER_TOKEN } from '@/lib/adminAuth';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = sessionStorage.getItem(ADMIN_AUTH_KEY);
      if (authStatus === 'true') {
        // Verify Supabase session exists too
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
        } else {
          // Try to restore Supabase session from stored credentials
          const storedToken = sessionStorage.getItem('admin_token');
          if (storedToken === MASTER_TOKEN) {
            const { error } = await supabase.auth.signInWithPassword({
              email: MASTER_EMAIL,
              password: MASTER_TOKEN,
            });
            if (!error) {
              setIsAuthenticated(true);
            } else {
              // Supabase auth failed, clear session
              sessionStorage.removeItem(ADMIN_AUTH_KEY);
              sessionStorage.removeItem('admin_token');
              setIsAuthenticated(false);
            }
          } else {
            sessionStorage.removeItem(ADMIN_AUTH_KEY);
            setIsAuthenticated(false);
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const authenticate = async (email: string, token: string): Promise<boolean> => {
    if (email.toLowerCase() === MASTER_EMAIL.toLowerCase() && token === MASTER_TOKEN) {
      // Sign into Supabase Auth so RLS policies work
      const { error } = await supabase.auth.signInWithPassword({
        email: MASTER_EMAIL,
        password: MASTER_TOKEN,
      });
      
      if (error) {
        console.error('Supabase auth error:', error.message);
        // If password doesn't match, try to update it via edge function
        // For now, still allow admin access via sessionStorage
      }

      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      sessionStorage.setItem('admin_token', token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem('admin_token');
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    authenticate,
    logout,
  };
};
