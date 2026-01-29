import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2 } from "lucide-react";
import AdminLoginForm from "./AdminLoginForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { isAuthenticated, loading, authenticate } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <SEO
          title="Admin Login | Leadership by Design"
          description="Admin access required"
        />
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
            <div className="container mx-auto px-6">
              <AdminLoginForm onAuthenticate={authenticate} />
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
