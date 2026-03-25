import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2, Building, CheckCircle2, Phone, PhoneCall, Brain } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ADMIN_AUTH_KEY, MASTER_TOKEN } from '@/lib/adminAuth';

const INDUSTRIES = [
  'Financial Services', 'Insurance', 'Accounting',
  'Wealth Management', 'Fintech',
  'Management Consulting', 'Legal Services', 'Engineering',
  'Information Technology', 'Software Development', 'Cybersecurity',
  'Architecture & Planning',
  'Healthcare', 'Pharmaceuticals', 'Medical Devices',
  'Manufacturing', 'Mining & Metals', 'Renewable Energy', 'Construction',
  'Retail', 'Consumer Goods', 'Telecommunications',
  'Agriculture', 'Real Estate', 'Education',
  'Hospitality', 'Tourism',
];

interface Prospect {
  id: string;
  company_name: string;
  website: string;
  employee_count: number;
  industry_vertical: string;
  decision_maker_name: string;
  decision_maker_title: string;
  decision_maker_email_guess: string;
  pain_signals: string[];
  os_readiness_score: number;
  priority_tier: string;
  engagement_hook: string;
  recommended_programme: string;
}

interface ProspectSearchProps {
  onImported?: () => void;
}

export default function ProspectSearch({ onImported }: ProspectSearchProps) {
  const [industry, setIndustry] = useState('');
  const [locations, setLocations] = useState('Johannesburg, Cape Town, Durban');
  const [results, setResults] = useState<Prospect[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searching, setSearching] = useState(false);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [scrapingPhones, setScrapingPhones] = useState(false);
  const token = sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true' ? MASTER_TOKEN : '';

  const handleSearch = async () => {
    if (!industry) {
      toast({ title: 'Select an industry', description: 'Pick a target industry to search.', variant: 'destructive' });
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('claude-prospect-search', {
        body: {
          industry,
          locations: locations.split(',').map(l => l.trim()).filter(Boolean),
          max_employees: 500,
        },
        headers: { 'x-admin-token': token },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const prospects = (data.prospects || []).map((p: any, i: number) => ({
        ...p,
        id: p.id || `prospect-${i}-${Date.now()}`,
      }));

      setResults(prospects);
      setSelected(new Set());
      toast({ title: `Found ${prospects.length} prospects`, description: `${industry} companies in South Africa (≤500 employees)` });
    } catch (err: any) {
      toast({ title: 'Search failed', description: err.message, variant: 'destructive' });
    } finally {
      setSearching(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === results.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(results.map(r => r.id)));
    }
  };

  const handleSendToCallAgent = async () => {
    const toImport = results.filter(r => selected.has(r.id));
    if (toImport.length === 0) return;

    setImporting(true);
    try {
      const prospects = toImport.map(r => ({
        first_name: r.decision_maker_name.split(' ')[0] || '',
        last_name: r.decision_maker_name.split(' ').slice(1).join(' ') || '',
        email: r.decision_maker_email_guess,
        company: r.company_name,
        phone: '',
        title: r.decision_maker_title,
      }));

      const batchId = `claude-${Date.now()}`;
      const { data, error } = await supabase.functions.invoke('admin-call-list', {
        body: { action: 'bulk_upload', prospects, batch_id: batchId },
        headers: { 'x-admin-token': token },
      });

      if (error || !data?.success) throw new Error(data?.error || error?.message || 'Import failed');

      toast({ title: 'Imported!', description: `${data.imported} contacts added to call list.` });
      setImported(prev => {
        const next = new Set(prev);
        toImport.forEach(r => next.add(r.id));
        return next;
      });
      setSelected(new Set());
      onImported?.();
    } catch (err: any) {
      toast({ title: 'Import failed', description: err.message, variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  const handleScrapePhones = async () => {
    const noPhone = results.filter(r => !imported.has(r.id));
    if (noPhone.length === 0) return;

    setScrapingPhones(true);
    try {
      const companies = noPhone.map(r => ({ id: r.id, company: r.company_name }));

      const { data, error } = await supabase.functions.invoke('scrape-company-phones', {
        body: { companies },
        headers: { 'x-admin-token': token },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: `Found ${data.found} numbers`,
        description: `Scraped ${data.total} company websites.`,
      });
    } catch (err: any) {
      toast({ title: 'Scraping failed', description: err.message, variant: 'destructive' });
    } finally {
      setScrapingPhones(false);
    }
  };

  const tierColor = (tier: string) => {
    if (tier === 'HOT') return 'bg-red-100 text-red-800';
    if (tier === 'WARM') return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Claude Connector — Prospect Discovery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs">Target Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select industry..." />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map(ind => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Locations (comma-separated)</Label>
            <Input value={locations} onChange={e => setLocations(e.target.value)} placeholder="Johannesburg, Cape Town" className="mt-1" />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={searching} className="gap-2 w-full">
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {searching ? 'Discovering...' : 'Discover Prospects'}
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Uses Claude AI to find South African companies (≤500 employees) with leadership development pain signals.
        </p>

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-muted-foreground">
                {results.length} prospects found in {industry}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {selected.size > 0 && (
                  <Button size="sm" variant="default" onClick={handleSendToCallAgent} disabled={importing} className="gap-1.5 bg-green-600 hover:bg-green-700">
                    {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PhoneCall className="w-3.5 h-3.5" />}
                    Send {selected.size} to Call Agent
                  </Button>
                )}
                <Button size="sm" variant="secondary" onClick={handleScrapePhones} disabled={scrapingPhones} className="gap-1.5">
                  {scrapingPhones ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Phone className="w-3.5 h-3.5" />}
                  {scrapingPhones ? 'Scraping...' : 'Find Numbers'}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto border border-border rounded-md max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox checked={selected.size === results.length && results.length > 0} onCheckedChange={toggleAll} />
                    </TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Decision Maker</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Pain Signal</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map(r => (
                    <TableRow key={r.id} className={imported.has(r.id) ? 'opacity-50' : ''}>
                      <TableCell>
                        {imported.has(r.id) ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-muted-foreground" />
                          <span className="font-medium">{r.company_name || '—'}</span>
                        </div>
                        {r.employee_count && <span className="text-xs text-muted-foreground">{r.employee_count} employees</span>}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium">{r.decision_maker_name || '—'}</div>
                        <div className="text-xs text-muted-foreground">{r.decision_maker_title || '—'}</div>
                      </TableCell>
                      <TableCell className="text-xs">{r.decision_maker_email_guess || '—'}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{r.engagement_hook || '—'}</TableCell>
                      <TableCell className="text-sm font-medium">{r.os_readiness_score}/10</TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${tierColor(r.priority_tier)}`}>{r.priority_tier}</Badge>
                      </TableCell>
                      <TableCell>
                        {imported.has(r.id) ? (
                          <Badge variant="outline" className="text-xs">Added</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
