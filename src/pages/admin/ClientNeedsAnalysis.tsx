import { Loader2, ClipboardCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import NeedsAnalysisWizard from '@/components/admin/NeedsAnalysisWizard';

export default function ClientNeedsAnalysis() {
  const { isAuthenticated, loading, authenticate } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                <ClipboardCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Client Needs Analysis</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Sign In</h1>
            </div>
            <AdminLoginForm onAuthenticate={authenticate} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Client Needs Analysis</h1>
            <p className="text-sm text-muted-foreground mt-1">Discovery call → proposal-ready summary in minutes</p>
          </div>
          <NeedsAnalysisWizard />
        </div>
      </main>
      <Footer />
    </>
  );
}
