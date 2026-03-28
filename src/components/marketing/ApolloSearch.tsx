import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2, UserPlus, Globe, Building, CheckCircle2, Zap, Send, RefreshCw, Phone, PhoneCall } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ADMIN_AUTH_KEY } from '@/lib/adminAuth';

interface ApolloResult {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  company_size: number | null;
  linkedin_url: string;
  city: string;
  country: string;
}

interface ApolloSequence {
  id: string;
  name: string;
  active: boolean;
  num_steps: number;
}

interface ApolloSearchProps {
  onImported?: () => void;
}

export default function ApolloSearch({ onImported }: ApolloSearchProps) {
  const [titles, setTitles] = useState('Head of HR, Head of Learning and Development, Chief People Officer');
  const [locations, setLocations] = useState('South Africa');
  const [keywords, setKeywords] = useState('');
  const [companySize, setCompanySize] = useState('51-200,201-500,501-1000');
  const [results, setResults] = useState<ApolloResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searching, setSearching] = useState(false);
  const [importing, setImporting] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total_entries: 0, total_pages: 0 });
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [sequences, setSequences] = useState<ApolloSequence[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<string>('');
  const [loadingSequences, setLoadingSequences] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [scrapingPhones, setScrapingPhones] = useState(false);
  const token = sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true' ? MASTER_TOKEN : '';

  // Load sequences on mount
  useEffect(() => {
    loadSequences();
  }, []);

  const loadSequences = async () => {
    setLoadingSequences(true);
    try {
      const { data, error } = await supabase.functions.invoke('apollo-enroll-sequence', {
        body: { action: 'list_sequences' },
        headers: { 'x-admin-token': token },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSequences(data.sequences || []);
    } catch (err: any) {
      console.error('Failed to load sequences:', err);
    } finally {
      setLoadingSequences(false);
    }
  };

  const handleSearch = async (page = 1) => {
    setSearching(true);
    try {
      const personTitles = titles.split(',').map(t => t.trim()).filter(Boolean);
      const orgLocations = locations.split(',').map(l => l.trim()).filter(Boolean);
      const employeeRanges = companySize.split(',').map(s => s.trim()).filter(Boolean);

      const { data, error } = await supabase.functions.invoke('apollo-search', {
        body: {
          person_titles: personTitles,
          organization_locations: orgLocations,
          organization_num_employees_ranges: employeeRanges,
          q_keywords: keywords || undefined,
          page,
          per_page: 25,
        },
        headers: { 'x-admin-token': token },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResults(data.people || []);
      setPagination(data.pagination || { page: 1, total_entries: 0, total_pages: 0 });
      setSelected(new Set());
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
        first_name: r.first_name,
        last_name: r.last_name,
        email: r.email,
        company: r.company,
        phone: r.phone,
        title: r.title,
      }));

      const batchId = `apollo-${Date.now()}`;
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

  const handleEnrollInSequence = async () => {
    if (!selectedSequence || selected.size === 0) {
      toast({ title: 'Select a sequence', description: 'Pick a sequence and select contacts first.', variant: 'destructive' });
      return;
    }

    const toEnroll = results.filter(r => selected.has(r.id));
    setEnrolling(true);
    try {
      const contacts = toEnroll.map(r => ({
        apollo_id: r.id,
        email: r.email,
        first_name: r.first_name,
        last_name: r.last_name,
        company: r.company,
        title: r.title,
      }));

      const { data, error } = await supabase.functions.invoke('apollo-enroll-sequence', {
        body: { action: 'enroll', sequence_id: selectedSequence, contacts },
        headers: { 'x-admin-token': token },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: '🚀 Enrolled in Sequence!',
        description: `${data.enrolled} contacts added to "${data.sequence_name}". Engagement monitoring is active.`,
      });

      setImported(prev => {
        const next = new Set(prev);
        toEnroll.forEach(r => next.add(r.id));
        return next;
      });
      setSelected(new Set());
    } catch (err: any) {
      toast({ title: 'Enrollment failed', description: err.message, variant: 'destructive' });
    } finally {
      setEnrolling(false);
    }
  };

  const handleSyncEngagement = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('apollo-sync-engagement', {
        headers: { 'x-admin-token': token },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: 'Engagement Synced',
        description: `Checked ${data.checked} contacts. ${data.alerts_sent} call alerts sent. ${data.added_to_call_list} added to call list.`,
      });
    } catch (err: any) {
      toast({ title: 'Sync failed', description: err.message, variant: 'destructive' });
    } finally {
      setSyncing(false);
    }
  };

  const handleScrapePhones = async () => {
    const noPhone = results.filter(r => !r.phone && !imported.has(r.id));
    if (noPhone.length === 0) {
      toast({ title: 'All contacts have numbers', description: 'No missing phone numbers to scrape.' });
      return;
    }

    setScrapingPhones(true);
    try {
      const companies = noPhone.map(r => ({ id: r.id, company: r.company }));

      const { data, error } = await supabase.functions.invoke('scrape-company-phones', {
        body: { companies },
        headers: { 'x-admin-token': token },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const phoneMap = new Map<string, string>();
      (data.results || []).forEach((r: any) => {
        if (r.phone) phoneMap.set(r.id, r.phone);
      });

      if (phoneMap.size > 0) {
        setResults(prev => prev.map(r => phoneMap.has(r.id) ? { ...r, phone: phoneMap.get(r.id)! } : r));
      }

      toast({
        title: `📞 Found ${data.found} numbers`,
        description: `Scraped ${data.total} company websites. ${data.found} phone numbers discovered.`,
      });
    } catch (err: any) {
      toast({ title: 'Scraping failed', description: err.message, variant: 'destructive' });
    } finally {
      setScrapingPhones(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Apollo.io People Search & Sequencing
          </div>
          <Button variant="outline" size="sm" onClick={handleSyncEngagement} disabled={syncing} className="gap-1.5">
            {syncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Sync Engagement
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Job Titles (comma-separated)</Label>
            <Input value={titles} onChange={e => setTitles(e.target.value)} placeholder="Head of HR, CHRO, L&D Manager" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Locations (comma-separated)</Label>
            <Input value={locations} onChange={e => setLocations(e.target.value)} placeholder="South Africa, Namibia" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Company Size Ranges</Label>
            <Input value={companySize} onChange={e => setCompanySize(e.target.value)} placeholder="51-200,201-500" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Keywords (optional)</Label>
            <Input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="insurance, financial services" className="mt-1" />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button onClick={() => handleSearch(1)} disabled={searching} className="gap-2">
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {searching ? 'Searching...' : 'Search Apollo'}
          </Button>

          {/* Sequence Selector */}
          <div className="flex items-center gap-2">
            <Select value={selectedSequence} onValueChange={setSelectedSequence}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder={loadingSequences ? 'Loading sequences...' : 'Select Apollo Sequence'} />
              </SelectTrigger>
              <SelectContent>
                {sequences.filter(s => s.active).map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      {s.name} ({s.num_steps} steps)
                    </div>
                  </SelectItem>
                ))}
                {sequences.filter(s => s.active).length === 0 && (
                  <SelectItem value="none" disabled>No active sequences found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-muted-foreground">
                {pagination.total_entries.toLocaleString()} results found · Page {pagination.page} of {pagination.total_pages}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {selected.size > 0 && selectedSequence && (
                  <Button size="sm" variant="default" onClick={handleEnrollInSequence} disabled={enrolling} className="gap-1.5">
                    {enrolling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Enroll {selected.size} in Sequence
                  </Button>
                )}
                {selected.size > 0 && (
                  <Button size="sm" variant="default" onClick={handleSendToCallAgent} disabled={importing} className="gap-1.5 bg-green-600 hover:bg-green-700">
                    {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PhoneCall className="w-3.5 h-3.5" />}
                    Send {selected.size} to Call Agent
                  </Button>
                )}
                {selected.size > 0 && selectedSequence && (
                  <Button size="sm" variant="default" onClick={handleEnrollInSequence} disabled={enrolling} className="gap-1.5">
                    {enrolling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Enroll {selected.size} in Sequence
                  </Button>
                )}
                {results.some(r => !r.phone) && (
                  <Button size="sm" variant="secondary" onClick={handleScrapePhones} disabled={scrapingPhones} className="gap-1.5">
                    {scrapingPhones ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Phone className="w-3.5 h-3.5" />}
                    {scrapingPhones ? 'Scraping...' : `Find Numbers (${results.filter(r => !r.phone).length})`}
                  </Button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto border border-border rounded-md max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox checked={selected.size === results.length && results.length > 0} onCheckedChange={toggleAll} />
                    </TableHead>
                     <TableHead>Name</TableHead>
                     <TableHead>Title</TableHead>
                     <TableHead>Company</TableHead>
                     <TableHead>Email</TableHead>
                     <TableHead>Phone</TableHead>
                     <TableHead>Location</TableHead>
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
                      <TableCell className="font-medium text-sm whitespace-nowrap">
                        {r.first_name} {r.last_name}
                        {r.linkedin_url && (
                          <a href={r.linkedin_url} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary hover:underline text-xs">LI</a>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{r.title || '—'}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-muted-foreground" />
                          {r.company || '—'}
                        </div>
                        {r.company_size && <span className="text-xs text-muted-foreground">{r.company_size} employees</span>}
                      </TableCell>
                       <TableCell className="text-xs">{r.email || '—'}</TableCell>
                       <TableCell className="text-xs">
                         {r.phone ? (
                           <a href={`tel:${r.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                             <Phone className="w-3 h-3" />
                             {r.phone}
                           </a>
                         ) : '—'}
                       </TableCell>
                       <TableCell className="text-xs text-muted-foreground">{[r.city, r.country].filter(Boolean).join(', ') || '—'}</TableCell>
                       <TableCell>
                        {imported.has(r.id) ? (
                          <Badge variant="outline" className="text-xs">Enrolled</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled={pagination.page <= 1 || searching} onClick={() => handleSearch(pagination.page - 1)}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {pagination.page} / {pagination.total_pages}</span>
                <Button variant="outline" size="sm" disabled={pagination.page >= pagination.total_pages || searching} onClick={() => handleSearch(pagination.page + 1)}>Next</Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
