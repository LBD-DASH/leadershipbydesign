import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Calendar, Building2, Users, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SEO from '@/components/SEO';

interface Programme {
  name: string;
  yearsActive: string;
  sector: string;
  type: string;
  orgsCount: number;
  description: string;
  status: 'legacy' | 'active';
  highlights?: string[];
}

const programmes: Programme[] = [
  {
    name: 'High Performing Teams',
    yearsActive: '2018–2024',
    sector: 'Financial Services',
    type: 'Team Development',
    orgsCount: 45,
    description: 'Comprehensive team alignment and performance programme built on the SHIFT methodology. Delivered across investment management, insurance, and banking.',
    status: 'legacy',
    highlights: ['Most delivered programme', 'Adapted for remote teams in 2020'],
  },
  {
    name: 'Voice & Service Excellence',
    yearsActive: '2016–2022',
    sector: 'Insurance',
    type: 'Frontline Development',
    orgsCount: 28,
    description: 'Customer-facing communication and service delivery training for call centre and branch teams. Focus on empathy, de-escalation, and brand alignment.',
    status: 'legacy',
  },
  {
    name: 'Unconscious Bias & Inclusivity',
    yearsActive: '2019–2025',
    sector: 'Financial Services',
    type: 'Culture & Inclusion',
    orgsCount: 35,
    description: 'Workshop-based programme exploring cognitive biases in leadership decision-making, hiring, and team dynamics. Includes personal action planning.',
    status: 'active',
  },
  {
    name: 'Change Management Design',
    yearsActive: '2017–2023',
    sector: 'Multi-sector',
    type: 'Organisational Development',
    orgsCount: 22,
    description: 'Structured change readiness and adoption framework for leaders managing transformation initiatives. Combines diagnostic tools with facilitated design sprints.',
    status: 'legacy',
  },
  {
    name: 'Enneagram & Collaboration',
    yearsActive: '2020–2025',
    sector: 'Executive',
    type: 'Self-Awareness',
    orgsCount: 18,
    description: 'Deep-dive into Enneagram personality framework for executive teams. Builds self-awareness, conflict resolution capability, and collaborative intelligence.',
    status: 'active',
  },
  {
    name: 'Human-Centric Leadership',
    yearsActive: '2015–2024',
    sector: 'Financial Services',
    type: 'Leadership Development',
    orgsCount: 31,
    description: 'Foundational leadership programme focusing on emotional intelligence, psychological safety, and people-first management practices.',
    status: 'legacy',
    highlights: ['Longest-running programme', 'Evolved into Leader as Coach'],
  },
  {
    name: 'Developing Leaders Programme',
    yearsActive: '2014–2023',
    sector: 'Entry-level',
    type: 'Leadership Development',
    orgsCount: 42,
    description: 'First-time manager and emerging leader development. Covers delegation, feedback, accountability, and team motivation fundamentals.',
    status: 'legacy',
    highlights: ['First programme ever delivered', 'Second highest delivery count'],
  },
  {
    name: 'Diversity & Inclusion Workshop',
    yearsActive: '2018–2025',
    sector: 'Corporate',
    type: 'Culture & Inclusion',
    orgsCount: 25,
    description: 'Half-day to full-day interactive workshops on building inclusive workplaces. Covers systemic bias, allyship, and inclusive leadership behaviours.',
    status: 'active',
  },
  {
    name: 'Leadership Resilience & Agility',
    yearsActive: '2019–2025',
    sector: 'Executive',
    type: 'Leadership Development',
    orgsCount: 20,
    description: 'Executive-level programme building resilience, adaptive capacity, and decision-making under pressure. Includes mindfulness and cognitive reframing tools.',
    status: 'active',
  },
  {
    name: 'Leader as Coach',
    yearsActive: '2023–2025',
    sector: 'Financial Services',
    type: 'Coaching Culture',
    orgsCount: 12,
    description: 'Flagship current programme. Builds coaching capability in middle managers to unlock team performance, reduce dependency, and improve retention.',
    status: 'active',
    highlights: ['Current flagship programme', 'Primary commercial focus'],
  },
];

const allSectors = [...new Set(programmes.map(p => p.sector))];
const allTypes = [...new Set(programmes.map(p => p.type))];

const statusColors: Record<string, string> = {
  legacy: 'bg-muted text-muted-foreground',
  active: 'bg-primary/10 text-primary',
};

const sectorColors: Record<string, string> = {
  'Financial Services': 'bg-accent/60 text-accent-foreground',
  'Insurance': 'bg-secondary text-secondary-foreground',
  'Multi-sector': 'bg-muted text-muted-foreground',
  'Executive': 'bg-primary/10 text-primary',
  'Entry-level': 'bg-secondary text-secondary-foreground',
  'Corporate': 'bg-muted text-muted-foreground',
};

export default function ProgrammesArchive() {
  const [search, setSearch] = useState('');
  const [filterSector, setFilterSector] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => {
    return programmes.filter(p => {
      const matchesSearch = search === '' || 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesSector = filterSector === 'all' || p.sector === filterSector;
      const matchesType = filterType === 'all' || p.type === filterType;
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchesSearch && matchesSector && matchesType && matchesStatus;
    });
  }, [search, filterSector, filterType, filterStatus]);

  const totalOrgs = programmes.reduce((sum, p) => sum + p.orgsCount, 0);

  return (
    <>
      <SEO
        title="Programme Archive | Leadership by Design"
        description="11 years of leadership development across 50+ organisations"
        noIndex
      />
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="bg-[hsl(var(--deep-navy))] text-white py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              Programme Archive
            </h1>
            <p className="text-white/70 text-lg font-sans">
              11 Years of Leadership Development — Internal Reference
            </p>
            <div className="flex flex-wrap gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[hsl(var(--gold))]" />
                <span>2014–2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[hsl(var(--gold))]" />
                <span>50+ Organisations</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[hsl(var(--gold))]" />
                <span>750+ Programmes Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[hsl(var(--gold))]" />
                <span>4,000+ Leaders Developed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search programmes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterSector}
              onChange={e => setFilterSector(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="all">All Sectors</option>
              {allSectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="all">All Types</option>
              {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="legacy">Legacy</option>
            </select>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Showing {filtered.length} of {programmes.length} programmes
          </p>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <Card key={p.name} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={statusColors[p.status]}>
                      {p.status === 'active' ? 'Active' : 'Legacy'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{p.yearsActive}</span>
                  </div>
                  <CardTitle className="text-lg font-serif">{p.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    <Badge variant="outline" className="text-xs">{p.sector}</Badge>
                    <Badge variant="outline" className="text-xs">{p.type}</Badge>
                    <Badge variant="secondary" className="text-xs">{p.orgsCount} orgs</Badge>
                  </div>
                  {p.highlights && (
                    <div className="border-t pt-2 mt-1">
                      {p.highlights.map(h => (
                        <p key={h} className="text-xs text-primary italic">• {h}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
