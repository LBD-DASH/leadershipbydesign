import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_AUTH_KEY } from '@/lib/adminAuth';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    const { data } = await supabase
      .from('user_roles' as any)
      .select('role')
      .eq('user_id', userId)
      .in('role', ['admin', 'call_centre']);
    return !!(data && data.length > 0);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const hasRole = await checkAdminRole(session.user.id);
        if (hasRole) {
          sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem(ADMIN_AUTH_KEY);
          setIsAuthenticated(false);
        }
      } else {
        sessionStorage.removeItem(ADMIN_AUTH_KEY);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const hasRole = await checkAdminRole(session.user.id);
        setIsAuthenticated(hasRole);
        if (hasRole) {
          sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        } else {
          sessionStorage.removeItem(ADMIN_AUTH_KEY);
        }
      } else {
        sessionStorage.removeItem(ADMIN_AUTH_KEY);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const authenticate = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Auth error:', error.message);
      return false;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const hasRole = await checkAdminRole(session.user.id);
    if (!hasRole) {
      await supabase.auth.signOut();
      return false;
    }

    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    setIsAuthenticated(true);
    return true;
  };

  const logout = async () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
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
