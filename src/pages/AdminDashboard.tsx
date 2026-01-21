import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { isAuthenticated, loading, authenticate, logout } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Admin Dashboard | Leadership by Design"
        description="Admin dashboard for diagnostic analytics"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 pb-16">
          <div className="container mx-auto px-6">
            {isAuthenticated ? (
              <AdminDashboardContent onLogout={logout} />
            ) : (
              <AdminLoginForm onAuthenticate={authenticate} />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
