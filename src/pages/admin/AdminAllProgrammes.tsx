import { Link, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { adminProgrammesData } from '@/data/adminProgrammesData';

export default function AdminAllProgrammes() {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <SEO
        title="All Programmes (Detailed) | Admin | Leadership by Design"
        description="Comprehensive programme catalogue with full topics and outcomes for client discussions"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 pb-16">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <Link 
                to="/admin" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Programme Overviews</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive programme catalogue with full topics and outcomes for client discussions
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminProgrammesData.map((programme) => (
                <Link key={programme.id} to={`/admin/programmes/${programme.id}`}>
                  <Card className="h-full hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer overflow-hidden">
                    {programme.image && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={programme.image} 
                          alt={programme.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <programme.icon className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="secondary">{programme.levelBadge}</Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {programme.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{programme.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{programme.level}</Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{programme.topics.length} topics</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
