import SEO from '@/components/SEO';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';
import AdminLayout from '@/components/admin/AdminLayout';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { isAuthenticated, loading, authenticate, logout } = useAdminAuth();

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <SEO title="Admin Dashboard | Leadership by Design" description="Admin dashboard for diagnostic analytics" />
      <AdminLayout>
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {isAuthenticated ? (
              <AdminDashboardContent onLogout={logout} />
            ) : (
              <div className="max-w-md mx-auto pt-16">
                <h1 className="text-2xl font-serif font-bold text-center mb-6" style={{ color: 'hsl(41 50% 59%)' }}>
                  Admin Dashboard
                </h1>
                <AdminLoginForm onAuthenticate={authenticate} />
              </div>
            )}
          </div>
        </main>
      </AdminLayout>
    </>
  );
}
