import { Link, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, ArrowRight, Loader2, User, Users, Zap, Target, Shield, Layers, BarChart3, Sparkles, Award, Bot, MessageCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ProgrammeOverview {
  title: string;
  description: string;
  route: string;
  pages: number;
  icon: typeof User;
  category: string;
}

const coachingProgrammes: ProgrammeOverview[] = [
  {
    title: 'Executive Coaching',
    description: 'One-on-one coaching built on the SHIFT framework for senior leaders',
    route: '/admin/overview/executive-coaching',
    pages: 2,
    icon: User,
    category: 'Coaching'
  },
  {
    title: 'Leader as Coach',
    description: '6-month programme developing coaching capability in leaders',
    route: '/admin/overview/leader-as-coach',
    pages: 2,
    icon: MessageCircle,
    category: 'Coaching'
  }
];

const leadershipProgrammes: ProgrammeOverview[] = [
  {
    title: 'Leadership Levels (L1-L5)',
    description: 'The five leadership operating levels and development paths',
    route: '/admin/overview/leadership-levels',
    pages: 2,
    icon: BarChart3,
    category: 'Framework'
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
    title: 'Grand Masters of Success',
    description: 'Foundation programme establishing core mindsets and habits',
    route: '/admin/overview/grand-masters',
    pages: 1,
    icon: Award,
    category: 'Foundation'
  },
  {
    title: 'Leadership for Women',
    description: 'Empowering women to lead with authenticity and impact',
    route: '/admin/overview/leadership-women',
    pages: 1,
    icon: Sparkles,
    category: 'Specialised'
  },
  {
    title: 'Leading in the AI Era',
    description: 'Navigate AI adoption while strengthening your human edge',
    route: '/admin/overview/ai-leadership',
    pages: 1,
    icon: Bot,
    category: 'Specialised'
  }
];

const workshopProgrammes: ProgrammeOverview[] = [
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
  }
];

const ProgrammeCard = ({ programme }: { programme: ProgrammeOverview }) => (
  <Link to={programme.route}>
    <Card className="h-full hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer">
      <CardHeader className="pb-3">
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
);

const ProgrammeSection = ({ title, programmes, defaultOpen = false }: { title: string; programmes: ProgrammeOverview[]; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <Badge variant="secondary">{programmes.length}</Badge>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {programmes.map((programme) => (
            <ProgrammeCard key={programme.route} programme={programme} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

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
        title="Programmes & Workshops | Admin | Leadership by Design"
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
              <h1 className="text-3xl font-bold text-foreground">Programmes & Workshops</h1>
              <p className="text-muted-foreground mt-1">
                Downloadable 1-2 page overviews for client discussions
              </p>
            </div>

            <ProgrammeSection title="Coaching Programmes" programmes={coachingProgrammes} defaultOpen />
            <ProgrammeSection title="Leadership Development" programmes={leadershipProgrammes} defaultOpen />
            <ProgrammeSection title="Team Workshops" programmes={workshopProgrammes} defaultOpen />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
