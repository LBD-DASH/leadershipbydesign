import { Link, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Loader2, User, Users, Zap, Target, Shield, Layers, BarChart3 } from 'lucide-react';

const programmeOverviews = [
  {
    title: 'Executive Coaching',
    description: 'One-on-one coaching built on the SHIFT framework for senior leaders',
    route: '/admin/overview/executive-coaching',
    pages: 2,
    icon: User,
    category: 'Coaching'
  },
  {
    title: 'SHIFT Leadership Development',
    description: 'Internationally recognised programme based on leadership operating levels',
    route: '/admin/overview/shift-leadership',
    pages: 2,
    icon: Layers,
    category: 'Development'
  },
  {
    title: 'SHIFT Methodology',
    description: 'The five core SHIFT skills and workshop applications',
    route: '/admin/overview/shift-methodology',
    pages: 2,
    icon: Zap,
    category: 'Methodology'
  },
  {
    title: 'Team Alignment Workshop',
    description: 'For teams working hard but not in the same direction',
    route: '/admin/overview/workshop-alignment',
    pages: 1,
    icon: Target,
    category: 'Workshop'
  },
  {
    title: 'Team Energy Workshop',
    description: 'For teams that lack energy and emotional commitment',
    route: '/admin/overview/workshop-motivation',
    pages: 1,
    icon: Zap,
    category: 'Workshop'
  },
  {
    title: 'Team Ownership Workshop',
    description: 'For capable teams where ownership is inconsistent',
    route: '/admin/overview/workshop-leadership',
    pages: 1,
    icon: Shield,
    category: 'Workshop'
  },
  {
    title: 'Leadership Levels (L1-L5)',
    description: 'The five leadership operating levels and development paths',
    route: '/admin/overview/leadership-levels',
    pages: 2,
    icon: BarChart3,
    category: 'Framework'
  }
];

export default function AdminOverviews() {
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
        title="Programme Overviews | Admin | Leadership by Design"
        description="Access downloadable programme overviews for client discussions"
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
                Downloadable 1-2 page overviews for client discussions
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programmeOverviews.map((programme) => (
                <Link key={programme.route} to={programme.route}>
                  <Card className="h-full hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <programme.icon className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="secondary">{programme.pages} page{programme.pages > 1 ? 's' : ''}</Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {programme.title}
                      </CardTitle>
                      <CardDescription>{programme.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{programme.category}</Badge>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
