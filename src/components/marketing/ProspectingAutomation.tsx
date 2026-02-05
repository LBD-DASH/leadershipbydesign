import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Users,
  Target,
  Lightbulb,
  MessageSquare,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';

interface ProspectingConfig {
  id: string;
  industry: string;
  location: string;
  company_size: string;
  is_active: boolean;
  last_run_at: string | null;
}

interface ProspectCompany {
  id: string;
  company_name: string;
  website_url: string;
  industry: string | null;
  company_size: string | null;
  status: string;
  created_at: string;
  contact_email: string | null;
  contact_phone: string | null;
  contact_name: string | null;
  contact_role: string | null;
  about_summary: string | null;
  personalised_pitch: string | null;
  suggested_approach: string | null;
  physical_address: string | null;
  linkedin_url: string | null;
  pain_points: unknown[] | null;
  opportunity_signals: unknown[] | null;
  leadership_team: unknown[] | null;
  hr_contacts: unknown[] | null;
}

interface ProspectingRun {
  id: string;
  started_at: string;
  completed_at: string | null;
  status: string;
  companies_discovered: number;
  companies_researched: number;
  companies_saved: number;
  errors: Array<{ industry: string; company?: string; error: string }> | null;
}

export default function ProspectingAutomation() {
  const queryClient = useQueryClient();
  const [expandedIndustries, setExpandedIndustries] = useState<Set<string>>(new Set());

  // Fetch industry configs
  const { data: configs, isLoading: configsLoading } = useQuery({
    queryKey: ['prospecting-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospecting_config')
        .select('*')
        .order('industry');
      if (error) throw error;
      return data as ProspectingConfig[];
    }
  });

  // Fetch recent runs
  const { data: runs, isLoading: runsLoading } = useQuery({
    queryKey: ['prospecting-runs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospecting_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as unknown as ProspectingRun[];
    },
    refetchInterval: 5000 // Poll every 5 seconds to check for running jobs
  });

  // Check if there's a running job (computed from runs data)
  const hasRunningJob = runs?.some(r => r.status === 'running') ?? false;

  // Fetch all prospect companies with full research data
  const { data: companies } = useQuery({
    queryKey: ['prospect-companies-by-industry'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospect_companies')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ProspectCompany[];
    }
  });

  // Group companies by industry
  const companiesByIndustry = companies?.reduce((acc, company) => {
    const industry = company.industry || 'Unknown';
    if (!acc[industry]) acc[industry] = [];
    acc[industry].push(company);
    return acc;
  }, {} as Record<string, ProspectCompany[]>) || {};

  const toggleIndustryExpanded = (industry: string) => {
    setExpandedIndustries(prev => {
      const next = new Set(prev);
      if (next.has(industry)) {
        next.delete(industry);
      } else {
        next.add(industry);
      }
      return next;
    });
  };

  // Toggle industry active status
  const toggleIndustry = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('prospecting_config')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospecting-config'] });
      toast.success('Industry updated');
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    }
  });

  // Run pipeline manually
  const runPipeline = useMutation({
    mutationFn: async () => {
      // First, create a run record so we can immediately show status
      const { data: runRecord, error: insertError } = await supabase
        .from('prospecting_runs')
        .insert({
          status: 'running',
          run_details: { triggered_at: new Date().toISOString(), source: 'manual' },
        })
        .select()
        .single();

      if (insertError) {
        throw new Error('Failed to create run record: ' + insertError.message);
      }

      // Now invoke the function with the run_id so it continues this run
      // Fire and forget - don't wait for the response as it takes several minutes
      supabase.functions.invoke('auto-prospect-pipeline', {
        body: { run_id: runRecord.id },
      }).catch(err => {
        console.log('Pipeline invoked (may timeout, but runs in background):', err);
      });

      return { success: true, message: 'Pipeline started', run_id: runRecord.id };
    },
    onSuccess: (data) => {
      toast.success('Pipeline started! Processing companies in the background.');
      // Immediately invalidate to show the new running status
      queryClient.invalidateQueries({ queryKey: ['prospecting-runs'] });
    },
    onError: (error) => {
      toast.error('Failed to start pipeline: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-primary"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case 'running':
        return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Running</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const activeCount = configs?.filter(c => c.is_active).length || 0;
  const latestRun = runs?.[0];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Industries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{activeCount}</span>
              <span className="text-muted-foreground">of {configs?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Run</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-lg font-medium">
                {latestRun 
                  ? formatDistanceToNow(new Date(latestRun.started_at), { addSuffix: true })
                  : 'Never'
                }
              </span>
            </div>
            {latestRun && (
              <div className="mt-1">
                {getStatusBadge(latestRun.status)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prospects Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">
                {latestRun?.companies_saved || 0}
              </span>
              <span className="text-muted-foreground">from last run</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Run Pipeline Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Run Pipeline
          </CardTitle>
          <CardDescription>
            Manually trigger the prospecting pipeline to discover and research companies now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => runPipeline.mutate()}
            disabled={hasRunningJob || activeCount === 0}
            className="w-full md:w-auto"
            size="lg"
          >
            {hasRunningJob ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Pipeline Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Now ({activeCount * 10} companies)
              </>
            )}
          </Button>
          {activeCount === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Enable at least one industry below to run the pipeline
            </p>
          )}
        </CardContent>
      </Card>

      {/* Industry Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Target Industries
          </CardTitle>
          <CardDescription>
            Enable/disable industries to include in daily prospecting
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {configs?.map((config) => {
                const industryCompanies = companiesByIndustry[config.industry] || [];
                const isExpanded = expandedIndustries.has(config.industry);
                
                return (
                  <Collapsible key={config.id} open={isExpanded} onOpenChange={() => toggleIndustryExpanded(config.industry)}>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-background">
                        <div className="flex items-center gap-3 flex-1">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{config.industry}</h4>
                              {config.is_active ? (
                                <Badge variant="default">Active</Badge>
                              ) : (
                                <Badge variant="secondary">Paused</Badge>
                              )}
                              <Badge variant="outline" className="ml-1">
                                {industryCompanies.length} companies
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {config.location} • {config.company_size} employees
                            </p>
                            {config.last_run_at && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Last run: {formatDistanceToNow(new Date(config.last_run_at), { addSuffix: true })}
                              </p>
                            )}
                          </div>
                        </div>
                        <Switch
                          checked={config.is_active}
                          onCheckedChange={(checked) => 
                            toggleIndustry.mutate({ id: config.id, is_active: checked })
                          }
                        />
                      </div>
                      
                      <CollapsibleContent>
                        <div className="border-t bg-muted/30">
                          {industryCompanies.length > 0 ? (
                            <div className="divide-y">
                              {industryCompanies.map((company) => (
                                <div key={company.id} className="p-4 hover:bg-muted/50 transition-colors border-b last:border-b-0">
                                  {/* Header */}
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-base">{company.company_name}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {company.status}
                                        </Badge>
                                        {company.company_size && (
                                          <Badge variant="secondary" className="text-xs">
                                            {company.company_size}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Added {formatDistanceToNow(new Date(company.created_at), { addSuffix: true })}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      {company.linkedin_url && (
                                        <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                                          <Linkedin className="w-4 h-4" />
                                        </a>
                                      )}
                                      <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                                        <Globe className="w-4 h-4" />
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>

                                  {/* About */}
                                  {company.about_summary && (
                                    <p className="text-sm text-muted-foreground mb-3">
                                      {company.about_summary}
                                    </p>
                                  )}

                                  {/* Contact Info Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-xs">
                                    {company.contact_name && (
                                      <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-muted-foreground" />
                                        <span>{company.contact_name}{company.contact_role && ` (${company.contact_role})`}</span>
                                      </div>
                                    )}
                                    {company.contact_email && (
                                      <div className="flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-muted-foreground" />
                                        <a href={`mailto:${company.contact_email}`} className="text-primary hover:underline">{company.contact_email}</a>
                                      </div>
                                    )}
                                    {company.contact_phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="w-3 h-3 text-muted-foreground" />
                                        <a href={`tel:${company.contact_phone}`} className="text-primary hover:underline">{company.contact_phone}</a>
                                      </div>
                                    )}
                                    {company.physical_address && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-muted-foreground" />
                                        <span className="truncate">{company.physical_address}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Pain Points & Opportunities */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                    {company.pain_points && company.pain_points.length > 0 && (
                                      <div className="bg-destructive/5 rounded-lg p-2">
                                        <div className="flex items-center gap-1 text-xs font-medium text-destructive mb-1">
                                          <Target className="w-3 h-3" />
                                          Pain Points
                                        </div>
                                        <ul className="text-xs space-y-0.5">
                                          {(company.pain_points as string[]).slice(0, 3).map((point, i) => (
                                            <li key={i} className="text-muted-foreground">• {String(point)}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {company.opportunity_signals && company.opportunity_signals.length > 0 && (
                                      <div className="bg-primary/5 rounded-lg p-2">
                                        <div className="flex items-center gap-1 text-xs font-medium text-primary mb-1">
                                          <Lightbulb className="w-3 h-3" />
                                          Opportunities
                                        </div>
                                        <ul className="text-xs space-y-0.5">
                                          {(company.opportunity_signals as string[]).slice(0, 3).map((signal, i) => (
                                            <li key={i} className="text-muted-foreground">• {String(signal)}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>

                                  {/* Leadership Team */}
                                  {company.leadership_team && company.leadership_team.length > 0 && (
                                    <div className="mb-3">
                                      <div className="flex items-center gap-1 text-xs font-medium mb-1">
                                        <Users className="w-3 h-3" />
                                        Leadership Team
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {(company.leadership_team as Array<{ name?: string; role?: string }>).slice(0, 4).map((leader, i) => (
                                          <div key={i} className="text-xs bg-muted px-2 py-1 rounded">
                                            <span className="font-medium">{leader.name || 'Unknown'}</span>
                                            {leader.role && <span className="text-muted-foreground"> - {leader.role}</span>}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* HR Contacts */}
                                  {company.hr_contacts && company.hr_contacts.length > 0 && (
                                    <div className="mb-3">
                                      <div className="flex items-center gap-1 text-xs font-medium mb-1">
                                        <User className="w-3 h-3" />
                                        HR Contacts
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {(company.hr_contacts as Array<{ name?: string; role?: string; email?: string }>).slice(0, 3).map((hr, i) => (
                                          <div key={i} className="text-xs bg-muted px-2 py-1 rounded">
                                            <span className="font-medium">{hr.name || 'Unknown'}</span>
                                            {hr.role && <span className="text-muted-foreground"> - {hr.role}</span>}
                                            {hr.email && <a href={`mailto:${hr.email}`} className="ml-1 text-primary hover:underline">{hr.email}</a>}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Personalized Pitch */}
                                  {company.personalised_pitch && (
                                    <div className="bg-accent/30 rounded-lg p-2 mb-2">
                                      <div className="flex items-center gap-1 text-xs font-medium mb-1">
                                        <MessageSquare className="w-3 h-3" />
                                        Personalized Pitch
                                      </div>
                                      <p className="text-xs text-muted-foreground">{company.personalised_pitch}</p>
                                    </div>
                                  )}

                                  {/* Suggested Approach */}
                                  {company.suggested_approach && (
                                    <div className="text-xs">
                                      <span className="font-medium">Suggested Approach:</span>{' '}
                                      <span className="text-muted-foreground">{company.suggested_approach}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No companies discovered yet for this industry
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Run History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Run History
          </CardTitle>
          <CardDescription>
            Recent pipeline executions and results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {runsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : runs && runs.length > 0 ? (
            <div className="space-y-3">
              {runs.map((run) => (
                <div 
                  key={run.id} 
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(run.status)}
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(run.started_at), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Discovered:</span>
                        <span className="ml-1 font-medium">{run.companies_discovered}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Researched:</span>
                        <span className="ml-1 font-medium">{run.companies_researched}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Saved:</span>
                        <span className="ml-1 font-medium text-primary">{run.companies_saved}</span>
                      </div>
                    </div>
                    {run.errors && run.errors.length > 0 && (
                      <div className="mt-2 p-2 bg-destructive/10 rounded text-sm">
                        <div className="flex items-center gap-1 text-destructive font-medium mb-1">
                          <AlertCircle className="w-3 h-3" />
                          {run.errors.length} error(s)
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {run.errors.slice(0, 3).map((err, i) => (
                            <li key={i}>
                              {err.company ? `${err.company}: ` : ''}{err.error.substring(0, 100)}
                            </li>
                          ))}
                          {run.errors.length > 3 && (
                            <li>...and {run.errors.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No pipeline runs yet. Click "Run Now" to start prospecting!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
