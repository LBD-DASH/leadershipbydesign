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
  Globe
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
  about_summary: string | null;
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
  const [isRunning, setIsRunning] = useState(false);
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
    refetchInterval: isRunning ? 5000 : false // Poll while running
  });

  // Fetch all prospect companies
  const { data: companies } = useQuery({
    queryKey: ['prospect-companies-by-industry'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospect_companies')
        .select('id, company_name, website_url, industry, company_size, status, created_at, contact_email, about_summary')
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
      setIsRunning(true);
      const { data, error } = await supabase.functions.invoke('auto-prospect-pipeline');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setIsRunning(false);
      queryClient.invalidateQueries({ queryKey: ['prospecting-runs'] });
      queryClient.invalidateQueries({ queryKey: ['prospect-companies'] });
      
      if (data.success) {
        toast.success(`Pipeline completed! Saved ${data.stats.companies_saved} new prospects`);
      } else {
        toast.error('Pipeline failed: ' + data.error);
      }
    },
    onError: (error) => {
      setIsRunning(false);
      toast.error('Pipeline failed: ' + error.message);
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
  const hasRunningJob = runs?.some(r => r.status === 'running');

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
            disabled={isRunning || hasRunningJob || activeCount === 0}
            className="w-full md:w-auto"
            size="lg"
          >
            {isRunning || hasRunningJob ? (
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
                                <div key={company.id} className="p-3 hover:bg-muted/50 transition-colors">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium truncate">{company.company_name}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {company.status}
                                        </Badge>
                                      </div>
                                      {company.about_summary && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                          {company.about_summary}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                        {company.company_size && (
                                          <span>{company.company_size} employees</span>
                                        )}
                                        {company.contact_email && (
                                          <span className="truncate">{company.contact_email}</span>
                                        )}
                                        <span>
                                          Added {formatDistanceToNow(new Date(company.created_at), { addSuffix: true })}
                                        </span>
                                      </div>
                                    </div>
                                    <a 
                                      href={company.website_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
                                    >
                                      <Globe className="w-3 h-3" />
                                      Website
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
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
